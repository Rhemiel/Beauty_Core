import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { generatedImages } from '../../../db/schema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { style, color, design, theme, event, image } = body;

    if (!style || !color || !design || !theme || !event) {
      return NextResponse.json(
        { error: 'Missing style, color, design, theme, or event in request body' },
        { status: 400 }
      );
    }

    // Construct 3 distinct prompt variations
    const basePrompt = `High-quality salon photograph of hands with ${style} shape nails, ${color} polish, and ${design} details, styled for a ${theme} theme at a ${event} event`;
    
    const prompts = [
      `${basePrompt}, bright studio lighting, soft focus background, elegant, 8k resolution`,
      `${basePrompt}, warm sunlight, dramatic shadows, highly detailed macro shot, cinematic lighting`,
      `${basePrompt}, cool neon ambient light, modern editorial fashion style, ultra sharp focus`
    ];

    const YOUCAM_API_KEY = process.env.YOUCAM_API_KEY;
    if (!YOUCAM_API_KEY) {
      throw new Error('YOUCAM_API_KEY is not defined in environment variables');
    }

    const API_BASE = 'https://yce-api-01.makeupar.com';

    // Helper to upload an image to YouCam and get a file_id
    const uploadYouCamFile = async (base64Str: string): Promise<string> => {
      // Extract correct MIME type
      const match = base64Str.match(/^data:(image\/\w+);base64,/);
      const mimeType = match ? match[1] : 'image/jpeg';
      let extension = mimeType.split('/')[1] || 'jpg';
      if (extension === 'jpeg') extension = 'jpg';

      // Convert base64 data URL to Buffer
      const base64Data = base64Str.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // 1. Get file upload url
      const fileRes = await fetch(`${API_BASE}/s2s/v2.0/file/image-to-image/youcam`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${YOUCAM_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          files: [{
            content_type: mimeType,
            file_name: `seed.${extension}`,
            file_size: buffer.length
          }]
        })
      });
      
      if (!fileRes.ok) {
        throw new Error(`YouCam File Upload initialization failed: ${await fileRes.text()}`);
      }
      
      const fileJson = await fileRes.json();
      const fileInfo = fileJson.data?.files[0] || fileJson.files[0];
      const fileId = fileInfo.file_id;
      const putReq = fileInfo.requests[0];

      // 2. Upload file binary data
      const putRes = await fetch(putReq.url, {
        method: putReq.method,
        headers: { ...putReq.headers },
        body: buffer
      });
      
      if (!putRes.ok) {
        throw new Error(`YouCam S3 PUT failed: ${await putRes.text()}`);
      }
      
      return fileId;
    };

    // Helper to generate a single image via YouCam Text-to-Image API
    const generateYouCamImage = async (prompt: string, seedFileId?: string): Promise<string> => {
      // 1. Create task
      const endpoint = seedFileId 
        ? `${API_BASE}/s2s/v2.0/task/image-to-image/youcam`
        : `${API_BASE}/s2s/v2.0/task/text-to-image/youcam`;

      const requestBody: any = {
        model: "youcam-image-v2",
        prompt: prompt,
      };

      if (seedFileId) {
        requestBody.src_file_ids = [seedFileId];
      }

      const createResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${YOUCAM_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!createResponse.ok) {
        const errText = await createResponse.text();
        throw new Error(`YouCam Create Task failed (${createResponse.status}): ${errText}`);
      }

      const createJson = await createResponse.json();
      const taskId = createJson.data?.task_id || createJson.task_id;
      
      if (!taskId) {
        throw new Error(`YouCam Create Task did not return a task_id: ${JSON.stringify(createJson)}`);
      }

      // 2. Poll for task status
      let imageUrl = null;
      let attempts = 0;
      const maxAttempts = 30; // 30 attempts * 2 seconds = 60 seconds timeout
      
      const statusEndpoint = seedFileId 
        ? `${API_BASE}/s2s/v2.0/task/image-to-image/youcam/${taskId}`
        : `${API_BASE}/s2s/v2.0/task/text-to-image/youcam/${taskId}`;

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2s
        attempts++;

        const statusResponse = await fetch(statusEndpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${YOUCAM_API_KEY}`
          }
        });

        if (!statusResponse.ok) {
          const errText = await statusResponse.text();
          throw new Error(`YouCam Status Check failed (${statusResponse.status}): ${errText}`);
        }

        const statusJson = await statusResponse.json();
        const data = statusJson.data || statusJson;
        const status = data.task_status || data.status;

        if (status === 'success' || status === 'completed' || status === 'done') {
          const result = data.results || data.result || data;
          imageUrl = result.url || result.image_url || (result.images && result.images[0]);
          if (!imageUrl) {
             throw new Error(`YouCam task succeeded but no image URL was found in response: ${JSON.stringify(statusJson)}`);
          }
          break;
        } else if (status === 'error' || status === 'failed') {
          throw new Error(`YouCam task failed: ${JSON.stringify(statusJson)}`);
        }
      }

      if (!imageUrl) {
        throw new Error(`YouCam task timed out after ${maxAttempts * 2} seconds.`);
      }

      // 3. Download the generated image and convert to base64
      const imgResponse = await fetch(imageUrl);
      if (!imgResponse.ok) throw new Error(`Failed to download YouCam image: ${imgResponse.status}`);
      const arrayBuffer = await imgResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return `data:image/jpeg;base64,${buffer.toString('base64')}`;
    };

    let base64Images: string[] = [];

    if (image) {
      // ─── IMAGE-TO-IMAGE PIPELINE ───
      const uploadedFileId = await uploadYouCamFile(image);
      base64Images = await Promise.all(prompts.map(prompt => generateYouCamImage(prompt, uploadedFileId)));
    } else {
      // ─── TEXT-TO-IMAGE PIPELINE ───
      base64Images = await Promise.all(prompts.map(prompt => generateYouCamImage(prompt)));
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
        // (Assuming you'll add theme/event to Drizzle schema later, if not we omit them here.
        // For now, we'll keep inserting what the schema expects so we don't break DB inserts.)
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
