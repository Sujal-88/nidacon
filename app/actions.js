"use server";

import crypto from 'crypto';

export async function initiatePayment(formData) {
  // --- KEY CHANGE: Extract data using formData.get() ---
  const name = formData.get('name');
  const email = formData.get('email');
  const mobile = formData.get('mobile');
  const address = formData.get('address');
  const registrationType = formData.get('registrationType');
  const memberType = formData.get('memberType');
  const subCategory = formData.get('subCategory');
  const amount = formData.get('amount');
  const productinfo = formData.get('productinfo');
  const txnid = formData.get('txnid');

  const merchantKey = process.env.PAYU_MERCHANT_KEY;
  const salt = process.env.PAYU_MERCHANT_SALT;

  if (!merchantKey || !salt) {
    console.error("PayU credentials are not set in .env.local");
    return { error: "Payment gateway is not configured." };
  }

  // --- Data Sanitization (Your logic is good) ---
  const amountString = parseFloat(amount).toFixed(2);
  const cleanName = (name || '').replace(/\|/g, ""); // This will be used for 'firstname'
  const cleanEmail = (email || '').replace(/\|/g, "");
  const cleanProductinfo = (productinfo || '').replace(/\|/g, "");

  // Using User Defined Fields (UDF) is a great practice for extra data
  const udf1 = (address || '').replace(/(\r\n|\n|\r)/gm, " ").replace(/\|/g, "").trim();
  const udf2 = (registrationType || '').replace(/\|/g, "");
  const udf3 = (memberType || '').replace(/\|/g, "");
  const udf4 = (subCategory || '').replace(/\|/g, "");
  const udf5 = ''; // Reserved for future use

  // --- Hash Generation (Using your more detailed hash string) ---
  const hashString = `${merchantKey}|${txnid}|${amountString}|${cleanProductinfo}|${cleanName}|${cleanEmail}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
  const hash = crypto.createHash('sha512').update(hashString).digest('hex');

  // --- Prepare the final payload for PayU ---
  const paymentData = {
    key: merchantKey,
    txnid,
    amount: amountString,
    productinfo: cleanProductinfo,
    firstname: cleanName, // CORRECTED: Use the cleaned name for the firstname field
    email: cleanEmail,
    phone: mobile,
    surl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payu/success`,
    furl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payu/failure`,
    udf1,
    udf2,
    udf3,
    udf4,
    udf5,
    hash,
  };

  return paymentData;
}