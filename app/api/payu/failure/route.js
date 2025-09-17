// app/api/payu/failure/route.js
import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const payuResponse = Object.fromEntries(formData.entries());

    console.log('--- PayU Failure Response ---', payuResponse);

    const isValidHash = verifyPayUHash(payuResponse);

    if (!isValidHash) {
      console.error('Invalid hash received from PayU on failure route.');
    }

    const errorMessage = payuResponse.error_Message || 'Payment failed or was cancelled.';
    const redirectUrl = new URL(`/payment/failure?txnid=${payuResponse.txnid}&error=${encodeURIComponent(errorMessage)}`, request.url);
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('Error processing PayU failure response:', error);
    return NextResponse.redirect(new URL('/payment/failure?error=server_error', request.url));
  }
}

function verifyPayUHash(payuResponse) {
  const SALT = process.env.PAYU_MERCHANT_SALT.trim();
  const key = process.env.PAYU_MERCHANT_KEY.trim();

  const amount = parseFloat(payuResponse.amount).toFixed(2);

  const hashStringParts = [
    SALT,
    payuResponse.status || '',
    '', '', '', '', '', '', '', '', '', '', // This is now corrected to TEN empty strings
    payuResponse.udf5 || '',
    payuResponse.udf4 || '',
    payuResponse.udf3 || '',
    payuResponse.udf2 || '',
    payuResponse.udf1 || '',
    payuResponse.email || '',
    payuResponse.firstname || '',
    payuResponse.productinfo || '',
    amount,
    payuResponse.txnid || '',
    key
  ];

  const hashString = hashStringParts.join('|');

  const calculatedHash = crypto
    .createHash('sha512')
    .update(hashString)
    .digest('hex')
    .toLowerCase();

  const receivedHash = (payuResponse.hash || '').toLowerCase();
  
  return calculatedHash === receivedHash;
}