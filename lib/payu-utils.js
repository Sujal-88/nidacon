import crypto from 'crypto';

// Generate hash for PayU
export function generateHash(data, salt) {
  const hashSequence = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${salt}`;
  return crypto.createHash('sha512').update(hashSequence).digest('hex');
}

// Verify response hash
export function verifyHash(data, salt) {
  const hashSequence = `${salt}|${data.status}|||||||||||${data.udf5}|${data.udf4}|${data.udf3}|${data.udf2}|${data.udf1}|${data.email}|${data.firstname}|${data.productinfo}|${data.amount}|${data.txnid}|${data.key}`;
  const hash = crypto.createHash('sha512').update(hashSequence).digest('hex');
  return hash === data.hash;
}

// Generate unique transaction ID
export function generateTransactionId() {
  return `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

// Create payment form data
export function createPaymentData({
  amount,
  productInfo,
  customerName,
  customerEmail,
  customerPhone = '',
  merchantKey,
  salt
}) {
  const txnid = generateTransactionId();
  
  const paymentData = {
    key: merchantKey,
    txnid,
    amount: amount.toString(),
    productinfo: productInfo,
    firstname: customerName,
    email: customerEmail,
    phone: customerPhone,
    surl: process.env.NEXT_PUBLIC_SUCCESS_URL,
    furl: process.env.NEXT_PUBLIC_FAILURE_URL,
    service_provider: 'payu_paisa',
  };

  // Generate hash
  paymentData.hash = generateHash(paymentData, salt);
  
  return paymentData;
}