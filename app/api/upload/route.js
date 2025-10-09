// app/api/upload/route.js
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const runtime = 'edge'; // Vercel Blob works best with the Edge runtime

export async function POST(request) {
  const file = request.body || '';
  const filename = request.headers.get('x-vercel-filename') || 'image.png';

  try {
    const blob = await put(filename, file, {
      access: 'public',
    });

    return NextResponse.json(blob);

  } catch (error) {
    console.error('VERCEL BLOB UPLOAD ERROR:', error);
    return NextResponse.json(
      { message: 'Error uploading file to Vercel Blob.' },
      { status: 500 }
    );
  }
}