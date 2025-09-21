import { NextResponse } from 'next/server';

export async function POST(request) {
  // 1. Get the form data from PayU's POST request
  const formData = await request.formData();
  const searchParams = new URLSearchParams();

  // 2. Convert the form data into URL search parameters
  for (const [key, value] of formData.entries()) {
    searchParams.append(key, value);
  }

  // 3. Redirect to the success page with the data in the URL
  const redirectUrl = new URL(`/payment/success?${searchParams.toString()}`, request.url);
  return NextResponse.redirect(redirectUrl);
}

// Also handle GET requests to avoid potential issues
export async function GET(request) {
    // If someone lands here via GET, just redirect them to the page itself.
    return NextResponse.redirect(new URL('/payment/success', request.url));
}