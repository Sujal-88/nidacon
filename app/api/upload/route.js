// app/api/upload/route.js
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  // Diagnostic Log: Check if the environment variable is loaded
  console.log('Vercel Blob Token Loaded:', !!process.env.BLOB_READ_WRITE_TOKEN);

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { message: 'Vercel Blob Store is not configured.' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  try {
    const blob = await put(filename, request.body, {
      access: 'public',
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Error during blob upload:', error);
    return NextResponse.json(
      { message: 'Error uploading file.', error: error.message },
      { status: 500 }
    );
  }
}