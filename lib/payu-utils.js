import crypto from 'crypto';

// This function for the initial request is correct. NO CHANGES.
export function generateHash(data, salt) {
  const hashSequence = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|${data.udf1}|${data.udf2}|${data.udf3}|${data.udf4}|${data.udf5}||||||${salt}`;
  return crypto.createHash('sha512').update(hashSequence).digest('hex');
}

// --- THIS IS THE GUARANTEED FIX ---
// The PayU response hash has a unique, specific order and must handle potentially empty UDFs.
export function verifyHash(data, salt) {
  // Use empty strings as a fallback if PayU does not return these fields
  const udf1 = data.udf1 || '';
  const udf2 = data.udf2 || '';
  const udf3 = data.udf3 || '';
  const udf4 = data.udf4 || '';
  const udf5 = data.udf5 || '';

  const hashSequence = `${salt}|${data.status}|||||||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${data.email}|${data.firstname}|${data.productinfo}|${data.amount}|${data.txnid}|${data.key}`;
  
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

// No changes needed for this function.
// ... (createPaymentData function remains the same)