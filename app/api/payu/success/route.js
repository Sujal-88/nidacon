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
      console.log(`Payment successful for txnid: ${payuResponse.txnid}. Redirecting...`);
      
      // --- THIS IS THE FIX ---
      // Manually construct the redirect URL
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const redirectUrl = `${baseUrl}/payment/success?txnid=${payuResponse.txnid}`;
      
      return NextResponse.redirect(redirectUrl);

    } else {
      console.log(`Payment failed for txnid: ${payuResponse.txnid}. Redirecting...`);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const redirectUrl = `${baseUrl}/payment/failure?txnid=${payuResponse.txnid}`;
      
      return NextResponse.redirect(redirectUrl);
    }

  } catch (error) {
    console.error('--- FATAL ERROR in /api/payu/success ---:', error);
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const redirectUrl = `${baseUrl}/payment/error`;
    
    return NextResponse.redirect(redirectUrl);
  }
}

function verifyPayUHash(payuResponse) {
  const SALT = process.env.PAYU_MERCHANT_SALT.trim();
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