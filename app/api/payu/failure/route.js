// app/api/payu/failure/route.js

import { NextResponse } from 'next/server';

export async function POST(req) {
    const formData = await req.formData();
    const data = Object.fromEntries(formData);

    // Log the failure data for debugging
    console.error('Payment Failed or Cancelled:', data);

    // Redirect the user to a user-friendly failure page
    const failureUrl = new URL('/payment/failure', process.env.NEXT_PUBLIC_BASE_URL);
    return NextResponse.redirect(failureUrl);
}