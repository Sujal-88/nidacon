import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const payuResponse = Object.fromEntries(formData);
    
    const url = new URL('/payment/failure', request.url);
    url.searchParams.set('txnid', payuResponse.txnid || 'N/A');
    url.searchParams.set('error', payuResponse.error_Message || 'Payment failed or cancelled.');
    
    return NextResponse.redirect(url, { status: 303 });
  } catch (error) {
     console.error('Payment Failure Route Error:', error);
     const url = new URL('/payment/failure', request.url);
     url.searchParams.set('error', 'Internal Server Error');
     return NextResponse.redirect(url, { status: 303 });
  }
}