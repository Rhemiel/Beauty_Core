import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { generatedImages } from '../../../db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const images = await db.select()
      .from(generatedImages)
      .orderBy(desc(generatedImages.createdAt))
      .limit(10);

    return NextResponse.json({ success: true, images });
  } catch (error: any) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
