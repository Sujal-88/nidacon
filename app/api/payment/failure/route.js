import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const payuResponse = Object.fromEntries(formData);

    // Construct the final user-facing failure URL and redirect.
    const failureUrl = new URL('/payment/failure', request.url);
    failureUrl.searchParams.set('txnid', payuResponse.txnid || 'N/A');
    failureUrl.searchParams.set('error', payuResponse.error_Message || 'Payment failed or was cancelled by the user.');
    failureUrl.searchParams.set('status', payuResponse.status || 'failure');
    
    return NextResponse.redirect(failureUrl);

  } catch (error) {
    console.error('Payment Failure Route Error:', error);
    const errorUrl = new URL('/payment/failure', request.url);
    errorUrl.searchParams.set('error', 'An internal server error occurred while processing the failure.');
    return NextResponse.redirect(errorUrl);
  }
}