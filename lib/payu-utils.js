import crypto from 'crypto';

// This function for the initial request is correct. NO CHANGES.
export function generateHash(data, salt) {
  const hashSequence = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|${data.udf1}|${data.udf2}|${data.udf3}|${data.udf4}|${data.udf5}||||||${salt}`;
  return crypto.createHash('sha512').update(hashSequence).digest('hex');
}

// FIXED: Correct PayU response hash verification
export function verifyHash(data, salt) {
  // Use empty strings as fallback if PayU does not return these fields
  const udf1 = data.udf1 || '';
  const udf2 = data.udf2 || '';
  const udf3 = data.udf3 || '';
  const udf4 = data.udf4 || '';
  const udf5 = data.udf5 || '';

  // CORRECTED: PayU official response hash sequence
  // Format: SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
  const hashSequence = `${salt}|${data.status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${data.email}|${data.firstname}|${data.productinfo}|${data.amount}|${data.txnid}|${data.key}`;
  
  console.log("=== HASH VERIFICATION DEBUG ===");
  console.log("Hash Sequence String:", hashSequence);
  console.log("Response Status:", data.status);
  console.log("Transaction ID:", data.txnid);
  console.log("================================");

  const generatedHash = crypto.createHash('sha512').update(hashSequence).digest('hex');
  
  if (generatedHash !== data.hash) {
    console.error("--- HASH MISMATCH DETECTED ---");
    console.error("PayU Hash (Expected):", data.hash);
    console.error("Generated Hash:", generatedHash);
    console.error("Hash Sequence Used:", hashSequence);
    console.error("------------------------------");
    return false;
  }
  
  console.log("✅ Hash verification successful!");
  return true;
}

// Helper function to create payment data for initial PayU request
export function createPaymentData(userDetails, transactionId, amount) {
  return {
    key: process.env.PAYU_MERCHANT_KEY,
    txnid: transactionId,
    amount: amount.toString(),
    productinfo: userDetails.memberType || 'Registration',
    firstname: userDetails.name,
    email: userDetails.email,
    phone: userDetails.mobile,
    udf1: userDetails.address || '',
    udf2: userDetails.registrationType || '',
    udf3: userDetails.memberType || '',
    udf4: userDetails.subCategory || '',
    udf5: '',
    surl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/success`,
    furl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/failure`
  };
}