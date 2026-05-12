import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { generatedImages } from '../../../db/schema';
import Replicate from 'replicate';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { style, color, design, image } = body;

    if (!style || !color || !design) {
      return NextResponse.json(
        { error: 'Missing style, color, or design in request body' },
        { status: 400 }
      );
    }

    // Construct 3 distinct prompt variations
    const basePrompt = `High-quality salon photograph of hands with ${style} shape nails, ${color} polish, and ${design} details`;
    
    const prompts = [
      `${basePrompt}, bright studio lighting, soft focus background, elegant, 8k resolution`,
      `${basePrompt}, warm sunlight, dramatic shadows, highly detailed macro shot, cinematic lighting`,
      `${basePrompt}, cool neon ambient light, modern editorial fashion style, ultra sharp focus`
    ];

    let base64Images: string[];

    if (image) {
      // ─── IMAGE-TO-IMAGE PIPELINE (Replicate) ───
      base64Images = await generateWithReplicate(prompts, image);
    } else {
      // ─── TEXT-TO-IMAGE PIPELINE (HuggingFace) ───
      base64Images = await generateWithHuggingFace(prompts);
    }

    // Insert generated images into Drizzle
    const insertedImages = [];
    for (let i = 0; i < base64Images.length; i++) {
      const imageUrl = base64Images[i];
      const usedPrompt = prompts[i];

      const [inserted] = await db.insert(generatedImages).values({
        imageUrl,
        style,
        color,
        design,
        prompt: usedPrompt,
      }).returning();
      
      insertedImages.push(inserted);
    }

    return NextResponse.json({ success: true, images: insertedImages });

  } catch (error: any) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// ─── Replicate Image-to-Image ───────────────────────────────────────────────
async function generateWithReplicate(prompts: string[], imageDataUrl: string): Promise<string[]> {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  const generateOne = async (prompt: string): Promise<string> => {
    const output = await replicate.run(
      "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
      {
        input: {
          image: imageDataUrl,
          prompt: prompt,
          num_outputs: 1,
          refine: "expert_ensemble_refiner",
          scheduler: "K_EULER",
          num_inference_steps: 30,
          guidance_scale: 7.5,
          prompt_strength: 0.8,
          high_noise_frac: 0.8,
          negative_prompt: "ugly, disfigured, blurry, low quality, watermark, text",
        },
      }
    );

    // Replicate returns an array of URLs (or ReadableStream objects)
    const outputArray = output as any[];
    const resultUrl = typeof outputArray[0] === 'string'
      ? outputArray[0]
      : outputArray[0]?.url?.() || String(outputArray[0]);

    // Fetch the generated image and convert to base64
    const imgResponse = await fetch(resultUrl);
    if (!imgResponse.ok) {
      throw new Error(`Failed to fetch generated image from Replicate: ${imgResponse.status}`);
    }
    const arrayBuffer = await imgResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');
    return `data:image/png;base64,${base64Data}`;
  };

  return Promise.all(prompts.map(generateOne));
}

// ─── HuggingFace Text-to-Image ──────────────────────────────────────────────
async function generateWithHuggingFace(prompts: string[]): Promise<string[]> {
  const generateImage = async (prompt: string): Promise<string> => {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      let errText = '';
      try { errText = await response.text(); } catch(e) {}
      throw new Error(`Hugging Face API Error ${response.status}: ${errText}`);
    }

    // Convert the binary image data to a Base64 string
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');
    return `data:image/jpeg;base64,${base64Data}`;
  };

  return Promise.all(prompts.map(generateImage));
}
