import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const payuResponse = Object.fromEntries(formData.entries());

    // --- Start of Debugging ---
    console.log('--- PayU Success Response Received ---');
    console.log(payuResponse);
    // --- End of Debugging ---

    const isValidHash = verifyPayUHash(payuResponse);

    if (!isValidHash) {
      console.error('HASH VERIFICATION FAILED!');
      // Respond with a clear error instead of redirecting immediately
      // This will display "Invalid hash" on the /api/payu/success page, confirming the issue.
      return new Response('Invalid hash', { status: 400 });
    }

    if (payuResponse.status === 'success') {
      // Your existing logic for successful payment
      // await updateOrderStatus(payuResponse.txnid, 'completed', payuResponse);
      console.log(`Payment successful for txnid: ${payuResponse.txnid}. Redirecting...`);
      const redirectUrl = new URL(`/payment/success?txnid=${payuResponse.txnid}`, request.url);
      return NextResponse.redirect(redirectUrl);
    } else {
      // Your existing logic for failed payment
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

  const hashString = [
    SALT,
    payuResponse.status || '',
    '', '', '', '', '', '', // 7 empty placeholders
    payuResponse.udf5 || '',
    payuResponse.udf4 || '',
    payuResponse.udf3 || '',
    payuResponse.udf2 || '',
    payuResponse.udf1 || '',
    payuResponse.email || '',
    payuResponse.firstname || '',
    payuResponse.productinfo || '',
    payuResponse.amount || '',
    payuResponse.txnid || '',
    payuResponse.key || ''
  ].join('|');

  const calculatedHash = crypto
    .createHash('sha512')
    .update(hashString)
    .digest('hex');

  // --- Start of Debugging ---
  console.log('--- Hash Verification Details ---');
  console.log('String to Hash:', hashString);
  console.log('Calculated Hash:', calculatedHash);
  console.log('PayU Hash:', payuResponse.hash);
  console.log('Do Hashes Match?', calculatedHash === payuResponse.hash);
  // --- End of Debugging ---

  return calculatedHash === payuResponse.hash;
}

// Dummy function for now, replace with your actual database logic
async function updateOrderStatus(txnid, status, payuResponse) {
  console.log(`(Mock) Updating order ${txnid} status to ${status}`);
  // Your database logic would go here
}