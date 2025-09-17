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
      // Even if hash fails, if PayU says it's a success, redirect to a page that can be manually verified.
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

  } catch (error) {
    console.error('--- FATAL ERROR in /api/payu/success ---:', error);
    const redirectUrl = new URL('/payment/failure?error=server_error', request.url);
    return NextResponse.redirect(redirectUrl);
  }
}

function verifyPayUHash(payuResponse) {
  const SALT = process.env.PAYU_MERCHANT_SALT.trim();

  // The order of fields for the RESPONSE hash is the reverse of the request hash.
  // SALT|status|||||||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
  const hashString = `${SALT}|${payuResponse.status}|${''}|${''}|${''}|${''}|${''}|${''}|${''}|${''}|${''}|${payuResponse.udf5}|${payuResponse.udf4}|${payuResponse.udf3}|${payuResponse.udf2}|${payuResponse.udf1}|${payuResponse.email}|${payuResponse.firstname}|${payuResponse.productinfo}|${payuResponse.amount}|${payuResponse.txnid}|${process.env.PAYU_MERCHANT_KEY.trim()}`;

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