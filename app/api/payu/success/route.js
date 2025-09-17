// app/api/payu/success/route.js
import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const payuResponse = Object.fromEntries(formData.entries());

    console.log('--- PayU Success Response ---');
    console.log(payuResponse);

    const isValidHash = verifyPayUHash(payuResponse);

    if (!isValidHash) {
      console.error('HASH VERIFICATION FAILED!');
      if (payuResponse.status === 'success') {
        const redirectUrl = new URL(`/payment/success?txnid=${payuResponse.txnid}&hash_error=true`, request.url);
        return NextResponse.redirect(redirectUrl);
      }
      return NextResponse.redirect(new URL(`/payment/failure?error=verification_failed`, request.url));
    }

    if (payuResponse.status === 'success') {
      // await updateOrderStatus(payuResponse.txnid, 'completed', payuResponse);
      console.log(`Payment successful for txnid: ${payuResponse.txnid}. Redirecting...`);
      const redirectUrl = new URL(`/payment/success?txnid=${payuResponse.txnid}`, request.url);
      return NextResponse.redirect(redirectUrl);
    } else {
      // await updateOrderStatus(payuResponse.txnid, 'failed', payuResponse);
      console.log(`Payment failed for txnid: ${payuResponse.txnid}. Redirecting...`);
      const redirectUrl = new URL(`/payment/failure?txnid=${payuResponse.txnid}`, request.url);
      return NextResponse.redirect(redirectUrl);
    }

  } catch (error)
 {
    console.error('--- FATAL ERROR in /api/payu/success ---:', error);
    const redirectUrl = new URL('/payment/failure?error=server_error', request.url);
    return NextResponse.redirect(redirectUrl);
  }
}

function verifyPayUHash(payuResponse) {
  const SALT = process.env.PAYU_MERCHANT_SALT.trim();
  const key = process.env.PAYU_MERCHANT_KEY.trim();

  // Ensure the amount has exactly two decimal places, matching the format in the initiate route.
  const amount = parseFloat(payuResponse.amount).toFixed(2);

  const hashString = [
    SALT,
    payuResponse.status || '',
    '', '', '', '', '', '', '', '', '', // udf10 → udf6
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
  ].join('|');

  const calculatedHash = crypto
    .createHash('sha512')
    .update(hashString)
    .digest('hex')
    .toLowerCase();

  const receivedHash = (payuResponse.hash || '').toLowerCase();

  console.log('--- Hash Verification ---');
  console.log('String to Hash:', hashString);
  console.log('Calculated Hash:', calculatedHash);
  console.log('PayU Hash:', receivedHash);

  return calculatedHash === receivedHash;
}