import { NextResponse } from 'next/server';

export async function POST(request) {
  const formData = await request.formData();
  const searchParams = new URLSearchParams();

  for (const [key, value] of formData.entries()) {
    searchParams.append(key, value);
  }

  // Redirect to the VISUAL page with the data in the URL
  const redirectUrl = new URL(`/payment/success?${searchParams.toString()}`, request.url);
  return NextResponse.redirect(redirectUrl);
}