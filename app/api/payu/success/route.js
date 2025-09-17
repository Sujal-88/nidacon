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
      return new Response('Invalid hash', { status: 400 });
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
    const redirectUrl = new URL('/payment/error', request.url);
    return NextResponse.redirect(redirectUrl);
  }
}

function verifyPayUHash(payuResponse) {
  const SALT = process.env.PAYU_MERCHANT_SALT.trim();

  // Make sure amount has 2 decimals like in initiate
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
    payuResponse.key || ''
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


// Stub for DB
async function updateOrderStatus(txnid, status, payuResponse) {
  console.log(`(Mock) Updating order ${txnid} status to ${status}`);
}
