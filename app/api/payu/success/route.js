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
    
    console.log('PayU Response:', payuResponse);
    
    // Verify the hash for security
    const isValidHash = verifyPayUHash(payuResponse);
    
    if (!isValidHash) {
      console.error('Invalid hash received from PayU');
      return new Response('Invalid hash', { status: 400 });
    }
    
    // Process the payment based on status
    if (payuResponse.status === 'success') {
      // Payment successful - update your database
      await updateOrderStatus(payuResponse.txnid, 'completed', payuResponse);
      
      // Redirect to success page
      return Response.redirect(new URL(`/payment/success?txnid=${payuResponse.txnid}`, request.url));
    } else {
      // Payment failed
      await updateOrderStatus(payuResponse.txnid, 'failed', payuResponse);
      
      // Redirect to failure page
      return Response.redirect(new URL(`/payment/failure?txnid=${payuResponse.txnid}`, request.url));
    }
    
  } catch (error) {
    console.error('Error processing PayU response:', error);
    return Response.redirect(new URL('/payment/error', request.url));
  }
}

// For Pages Router (if you're using pages directory)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const payuResponse = req.body;
    console.log('PayU Response:', payuResponse);
    
    // Verify the hash for security
    const isValidHash = verifyPayUHash(payuResponse);
    
    if (!isValidHash) {
      console.error('Invalid hash received from PayU');
      return res.status(400).json({ message: 'Invalid hash' });
    }
    
    // Process the payment based on status
    if (payuResponse.status === 'success') {
      // Payment successful
      await updateOrderStatus(payuResponse.txnid, 'completed', payuResponse);
      return res.redirect(`/payment/success?txnid=${payuResponse.txnid}`);
    } else {
      // Payment failed
      await updateOrderStatus(payuResponse.txnid, 'failed', payuResponse);
      return res.redirect(`/payment/failure?txnid=${payuResponse.txnid}`);
    }
    
  } catch (error) {
    console.error('Error processing PayU response:', error);
    return res.redirect('/payment/error');
  }
}

// Hash verification function
function verifyPayUHash(payuResponse) {
  const SALT = process.env.PAYU_MERCHANT_SALT.trim(); // Make sure this is the correct SALT
  
  const hashString = [
    SALT,
    payuResponse.status || '',
    '', '', '', '', '', // Six empty placeholders
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
  
  return calculatedHash === payuResponse.hash;
}

// Update order status in your database
async function updateOrderStatus(txnid, status, payuResponse) {
  try {
    // Replace with your database logic
    console.log(`Updating order ${txnid} status to ${status}`);
    
    // Example database update (adjust according to your setup)
    // await db.orders.update({
    //   where: { transactionId: txnid },
    //   data: { 
    //     status: status,
    //     paymentId: payuResponse.mihpayid,
    //     paymentMode: payuResponse.mode,
    //     paymentResponse: JSON.stringify(payuResponse)
    //   }
    // });
    
  } catch (error) {
    console.error('Error updating order status:', error);
  }
}