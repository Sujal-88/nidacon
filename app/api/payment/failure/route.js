// app/api/payment/failure/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  // PayU sends a POST request here. We need to handle it.
  const formData = await request.formData();
  const payuResponse = Object.fromEntries(formData);
  
  // Create a URL to redirect the user to the VISUAL failure page.
  // Pass the relevant info as query parameters.
  const redirectUrl = new URL('/payment/failure', request.url);
  redirectUrl.searchParams.set('txnid', payuResponse.txnid || 'N/A');
  redirectUrl.searchParams.set('error', payuResponse.error_Message || 'Payment failed or was cancelled.');
  redirectUrl.searchParams.set('status', payuResponse.status || 'failure');
  
  return NextResponse.redirect(redirectUrl);
}