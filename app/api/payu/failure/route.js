// app/api/payu/failure/route.js (App Router)
// OR pages/api/payu/failure.js (Pages Router)

import crypto from 'crypto';

// For App Router (Next.js 13+)
export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Convert FormData to object
    const payuResponse = {};
    for (const [key, value] of formData.entries()) {
      payuResponse[key] = value;
    }
    
    console.log('PayU Failure Response:', payuResponse);
    
    // Verify the hash for security
    const isValidHash = verifyPayUHash(payuResponse);
    
    if (!isValidHash) {
      console.error('Invalid hash received from PayU');
      return new Response('Invalid hash', { status: 400 });
    }
    
    // Update order status to failed
    await updateOrderStatus(payuResponse.txnid, 'failed', payuResponse);
    
    // Redirect to failure page with error details
    const errorMessage = payuResponse.error_Message || 'Payment failed';
    return Response.redirect(
      new URL(`/payment/failure?txnid=${payuResponse.txnid}&error=${encodeURIComponent(errorMessage)}`, request.url)
    );
    
  } catch (error) {
    console.error('Error processing PayU failure response:', error);
    return Response.redirect(new URL('/payment/error', request.url));
  }
}

// For Pages Router
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const payuResponse = req.body;
    console.log('PayU Failure Response:', payuResponse);
    
    // Verify the hash for security
    const isValidHash = verifyPayUHash(payuResponse);
    
    if (!isValidHash) {
      console.error('Invalid hash received from PayU');
      return res.status(400).json({ message: 'Invalid hash' });
    }
    
    // Update order status to failed
    await updateOrderStatus(payuResponse.txnid, 'failed', payuResponse);
    
    // Redirect to failure page
    const errorMessage = payuResponse.error_Message || 'Payment failed';
    return res.redirect(`/payment/failure?txnid=${payuResponse.txnid}&error=${encodeURIComponent(errorMessage)}`);
    
  } catch (error) {
    console.error('Error processing PayU failure response:', error);
    return res.redirect('/payment/error');
  }
}

// Hash verification function (same as success handler)
function verifyPayUHash(payuResponse) {
  const SALT = process.env.PAYU_MERCHANT_SALT.trim();

  const hashString = [
    SALT,
    payuResponse.status || '',
    '', '', '', '', '', '', '', '', '', // 10 empties for udf10 → udf6
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

  console.log('--- Hash Verification ---');
  console.log('String to Hash:', hashString);
  console.log('Calculated Hash:', calculatedHash);
  console.log('PayU Hash:', payuResponse.hash);

  return calculatedHash === payuResponse.hash;
}

// Update order status in your database
async function updateOrderStatus(txnid, status, payuResponse) {
  try {
    console.log(`Updating order ${txnid} status to ${status}`);
    
    // Replace with your database logic
    // await db.orders.update({
    //   where: { transactionId: txnid },
    //   data: { 
    //     status: status,
    //     paymentResponse: JSON.stringify(payuResponse),
    //     errorMessage: payuResponse.error_Message
    //   }
    // });
    
  } catch (error) {
    console.error('Error updating order status:', error);
  }
}