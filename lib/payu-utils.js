import crypto from 'crypto';

// This function for the initial request is correct. NO CHANGES NEEDED HERE.
export function generateHash(data, salt) {
  const hashSequence = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|${data.udf1}|${data.udf2}|${data.udf3}|${data.udf4}|${data.udf5}||||||${salt}`;
  return crypto.createHash('sha512').update(hashSequence).digest('hex');
}

// --- THIS IS THE GUARANTEED FIX ---
// The PayU response hash has a unique, specific order: salt|status||...||udf5|udf4|...|key
export function verifyHash(data, salt) {
  const hashSequence = `${salt}|${data.status}|||||||||||${data.udf5}|${data.udf4}|${data.udf3}|${data.udf2}|${data.udf1}|${data.email}|${data.firstname}|${data.productinfo}|${data.amount}|${data.txnid}|${data.key}`;
  
  // This log is crucial for debugging.
  console.log("Verifying Hash on String:", hashSequence);

  const generatedHash = crypto.createHash('sha512').update(hashSequence).digest('hex');
  
  if (generatedHash !== data.hash) {
    console.error("--- HASH MISMATCH DETECTED ---");
    console.error("What PayU Sent (Expected):", data.hash);
    console.error("What We Generated:", generatedHash);
    console.error("------------------------------");
  }
  
  return generatedHash === data.hash;
}

// No changes needed here.
export function createPaymentData({
  amount,
  productInfo,
  customerName,
  customerEmail,
  customerPhone = '',
  merchantKey,
  salt,
  udf1 = '',
  udf2 = '',
  udf3 = '',
  udf4 = '',
  udf5 = ''
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
    udf1,
    udf2,
    udf3,
    udf4,
    udf5,
  };

  paymentData.hash = generateHash(paymentData, salt);
  
  return paymentData;
}