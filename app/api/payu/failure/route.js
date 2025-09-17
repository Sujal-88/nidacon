// app/api/payu/failure/route.js
import crypto from 'crypto';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const payuResponse = Object.fromEntries(formData.entries());

    console.log('--- PayU Failure Response ---');
    console.log(payuResponse);

    const isValidHash = verifyPayUHash(payuResponse);

    if (!isValidHash) {
      console.error('Invalid hash received from PayU');
      return new Response('Invalid hash', { status: 400 });
    }

    await updateOrderStatus(payuResponse.txnid, 'failed', payuResponse);

    const errorMessage = payuResponse.error_Message || 'Payment failed';
    return Response.redirect(
      new URL(`/payment/failure?txnid=${payuResponse.txnid}&error=${encodeURIComponent(errorMessage)}`, request.url)
    );

  } catch (error) {
    console.error('Error processing PayU failure response:', error);
    return Response.redirect(new URL('/payment/error', request.url));
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

async function updateOrderStatus(txnid, status, payuResponse) {
  console.log(`Updating order ${txnid} status to ${status}`);
  // Replace with your DB logic
}
