// app/api/upload/route.js
import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ message: 'No file found.' }, { status: 400 });
  }

  // Convert the file to a buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    // Upload the file to ImageKit
    const response = await imagekit.upload({
      file: buffer, // required
      fileName: file.name, // required
      folder: '/nidasportz_profiles', // Optional: Organize uploads into a folder
      useUniqueFileName: true, // Optional: Let ImageKit handle unique naming
    });

    // Return the URL of the uploaded file
    return NextResponse.json({ url: response.url });

  } catch (error) {
    console.error('ImageKit Upload Error:', error);
    return NextResponse.json(
      { message: 'Error uploading to ImageKit.' },
      { status: 500 }
    );
  }
}