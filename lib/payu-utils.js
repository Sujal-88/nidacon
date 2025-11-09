import crypto from 'crypto';

export function generateHash(data, salt) {
  const hashSequence = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|${data.udf1}|${data.udf2}|${data.udf3}|${data.udf4}|${data.udf5}|||||${salt}`;
  return crypto.createHash('sha512').update(hashSequence).digest('hex');
}

export function verifyHash(data, salt) {
  
  const udf1 = data.udf1 || '';
  const udf2 = data.udf2 || '';
  const udf3 = data.udf3 || '';
  const udf4 = data.udf4 || '';
  const udf5 = data.udf5 || '';
  const udf6 = data.udf6 || '';

  // Correct PayU response hash sequence including udf6 and 4 pipes
  const hashSequence = `${salt}|${data.status}||||${udf6}|${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${data.email}|${data.firstname}|${data.productinfo}|${data.amount}|${data.txnid}|${data.key}`;

  console.log("🔐 Hash Verification Debug:");
  console.log("  Status:", data.status);
  console.log("  Hash Sequence:", hashSequence);

  const generatedHash = crypto.createHash('sha512').update(hashSequence).digest('hex');

  if (generatedHash !== data.hash) {
    console.error("❌ HASH MISMATCH:");
    console.error("  Expected:", data.hash);
    console.error("  Generated:", generatedHash);
    return false;
  }

  console.log("✅ Hash verification successful!");
  return true;
}

// FIXED: Correct PayU URL configuration
export function createPaymentData(userDetails, transactionId, amount) {
  // Get the base URL correctly
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://nidacon.vercel.app'
      : 'http://localhost:3000');

  return {
    key: process.env.PAYU_MERCHANT_KEY,
    txnid: transactionId,
    amount: amount.toString(),
    productinfo: `NIDACON 2026 - ${userDetails.memberType}`,
    firstname: userDetails.name,
    email: userDetails.email,
    phone: userDetails.mobile,
    udf1: userDetails.address || '',
    udf2: userDetails.registrationType || '',
    udf3: userDetails.memberType || '',
    udf4: userDetails.subCategory || '',
    udf5: '',
    // CRITICAL: These URLs must be your API endpoints, not pages
    surl: `${baseUrl}/api/payment/success`,
    furl: `${baseUrl}/api/payment/failure`,
    // Optional: Add service_provider for better routing
    service_provider: 'payu_paisa'
  };
}