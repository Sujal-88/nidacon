import crypto from 'crypto';

// This function is correct, no changes needed here.
export function generateHash(data, salt) {
  const hashSequence = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|${data.udf1}|${data.udf2}|${data.udf3}|${data.udf4}|${data.udf5}||||||${salt}`;
  return crypto.createHash('sha512').update(hashSequence).digest('hex');
}

// Verify response hash
export function verifyHash(data, salt) {
  // --- THIS IS THE FINAL FIX ---
  // The PayU response hash includes several empty values between status and the udf fields.
  // The correct sequence is salt|status||||||||||udf1|udf2...
  const hashSequence = `${salt}|${data.status}|||||||||||${data.udf1}|${data.udf2}|${data.udf3}|${data.udf4}|${data.udf5}|${data.email}|${data.firstname}|${data.productinfo}|${data.amount}|${data.txnid}|${data.key}`;
  
  // Log the exact string we are hashing for debugging
  console.log("Verifying Hash on String:", hashSequence);

  const hash = crypto.createHash('sha512').update(hashSequence).digest('hex');
  
  if (hash !== data.hash) {
    console.error("HASH MISMATCH!");
    console.error("Expected Hash:", data.hash);
    console.error("Generated Hash:", hash);
  }
  
  return hash === data.hash;
}

// This function is correct, no changes needed here.
export function createPaymentData({
  amount,
  productInfo,
  customerName,
  customerEmail,
  customerPhone = '',
  merchantKey,
  salt
}) {
  const txnid = `TXN_${Date.now()}`;
  
  const paymentData = {
    key: merchantKey,
    txnid,
    amount: amount.toString(),
    productinfo: productInfo,
    firstname: customerName,
    email: customerEmail,
    phone: customerPhone,
    surl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/success`,
    furl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/failure`,
    service_provider: 'payu_paisa',
    udf1: '',
    udf2: '',
    udf3: '',
    udf4: '',
    udf5: '',
  };

  paymentData.hash = generateHash(paymentData, salt);
  
  return paymentData;
}