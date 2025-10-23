// app/api/payment/failure/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  let txnid = 'N/A';
  let registrationType = 'unknown'; // Default if not found
  let errorMessage = 'Payment failed or cancelled.';
  let status = 'failure'; // Default status

  try {
    const formData = await request.formData();
    const payuResponse = Object.fromEntries(formData);

    txnid = payuResponse.txnid || 'N/A';
    // Get registration type from udf2 if available
    registrationType = payuResponse.udf2 || 'unknown';
    errorMessage = payuResponse.error_Message || `Payment status: ${payuResponse.status || 'failed'}`;
    status = payuResponse.status || 'failure';

    console.log(`Payment Failure for txnid: ${txnid}, type: ${registrationType}, message: ${errorMessage}`); // Log details

    const url = new URL('/payment/failure', request.url);
    url.searchParams.set('txnid', txnid);
    url.searchParams.set('error_Message', errorMessage); // Use error_Message consistently
    url.searchParams.set('status', status);
    url.searchParams.set('registrationType', registrationType); // <-- Add registration type

    return NextResponse.redirect(url, { status: 303 });

  } catch (error) {
     console.error('Payment Failure Route Error:', error);
     const url = new URL('/payment/failure', request.url);
     url.searchParams.set('txnid', txnid); // Include txnid if possible
     url.searchParams.set('error_Message', 'Internal Server Error during failure processing.');
     url.searchParams.set('status', 'error');
     url.searchParams.set('registrationType', registrationType); // Include type even on server error if known
     return NextResponse.redirect(url, { status: 303 });
  }
}