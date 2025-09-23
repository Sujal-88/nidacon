// app/actions.js
"use server";

import crypto from 'crypto';

export async function initiatePayment(formData) {
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!merchantKey || !salt || !baseUrl) {
    console.error("PayU credentials or base URL are not set in environment variables.");
    return { error: "Payment gateway is not configured correctly." };
  }

  const amountString = parseFloat(amount).toFixed(2);
  const cleanName = (name || '').replace(/\|/g, "");
  const cleanEmail = (email || '').replace(/\|/g, "");
  const cleanProductinfo = (productinfo || '').replace(/\|/g, "");

  const udf1 = (address || '').replace(/(\r\n|\n|\r)/gm, " ").replace(/\|/g, "").trim();
  const udf2 = (registrationType || '').replace(/\|/g, "");
  const udf3 = (memberType || '').replace(/\|/g, "");
  const udf4 = (subCategory || '').replace(/\|/g, "");
  const udf5 = ''; 

  const hashString = `${merchantKey}|${txnid}|${amountString}|${cleanProductinfo}|${cleanName}|${cleanEmail}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
  
  // Keep this log for debugging!
  console.log("Request Hash String:", hashString);
  
  const hash = crypto.createHash('sha512').update(hashString).digest('hex');

  const paymentData = {
    key: merchantKey,
    txnid,
    amount: amountString,
    productinfo: cleanProductinfo,
    firstname: cleanName,
    email: cleanEmail,
    phone: mobile,
    // --- THIS IS THE CRITICAL FIX ---
    // Ensure surl and furl point to your API routes, not your pages.
    surl: `${baseUrl}/api/payment/success`,
    furl: `${baseUrl}/api/payment/failure`,
    // --- END OF CRITICAL FIX ---
    udf1,
    udf2,
    udf3,
    udf4,
    udf5,
    hash,
  };

  return paymentData;
}