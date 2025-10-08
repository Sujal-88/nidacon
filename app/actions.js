// app/actions.js
"use server";

import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { generateMemberId } from '@/lib/memberId';

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
    console.error("FATAL ERROR: PayU credentials or NEXT_PUBLIC_BASE_URL are not set.");
    return { error: "Payment gateway is not configured correctly. Please contact support." };
  }

  const amountString = parseFloat(amount).toFixed(2);

  // Ensure all fields are defined as empty strings if null, to guarantee hash integrity.
  const firstname = (name || '').replace(/\|/g, "");
  const email_clean = (email || '').replace(/\|/g, "");
  const productinfo_clean = (productinfo || '').replace(/\|/g, "");
  const udf1 = (address || '').replace(/(\r\n|\n|\r)/gm, " ").replace(/\|/g, "").trim();
  const udf2 = (registrationType || '').replace(/\|/g, "");
  const udf3 = (memberType || '').replace(/\|/g, "");
  const udf4 = (subCategory || '').replace(/\|/g, "");
  const udf5 = (formData.get('udf5') || '').replace(/\|/g, "");

  const successUrl = `${baseUrl}/api/payment/success`;
  const failureUrl = `${baseUrl}/api/payment/failure`;

  // --- THIS IS THE CRITICAL FIX ---
  // The string MUST contain |||||| (6 pipes) between udf5 and the SALT.
  const hashString = `${merchantKey}|${txnid}|${amountString}|${productinfo_clean}|${firstname}|${email_clean}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;

  console.log("--- FINAL HASH STRING FOR PAYU ---");
  console.log(hashString);

  const hash = crypto.createHash('sha512').update(hashString).digest('hex');

  const paymentData = {
    key: merchantKey,
    txnid,
    amount: amountString,
    productinfo: productinfo_clean,
    firstname: firstname,
    email: email_clean,
    phone: mobile,
    surl: successUrl,
    furl: failureUrl,
    udf1,
    udf2,
    udf3,
    udf4,
    udf5,
    hash,
  };

  return paymentData;
}
// (The other functions in this file, processMembership and initiateSportsPayment, do not need changes)
export async function processMembership(formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const mobile = formData.get('mobile');
  const address = formData.get('address');
  const msdcRegistration = formData.get('msdcRegistration');
  const memberType = formData.get('memberType');

  try {
    const newMemberId = await generateMemberId();
    const txnid = `NIDAMEM-${Date.now()}`;

    const user = await prisma.user.upsert({
      where: { email: email },
      update: {
        name: name,
        mobile: mobile,
        address: address,
        isMember: true,
        memberId: newMemberId,
        transactionId: txnid,
        paymentStatus: 'pending'
      },
      create: {
        email: email,
        name: name,
        mobile: mobile,
        address: address,
        userId: `TEMP-${Date.now()}`,
        isMember: true,
        memberId: newMemberId,
        transactionId: txnid,
        paymentStatus: 'pending'
      }
    });

    return {
      success: true,
      txnid: txnid,
      memberId: user.memberId,
    };

  } catch (error) {
    console.error("Error processing membership:", error);
    return { success: false, error: "Could not process membership request." };
  }
}

export async function initiateSportsPayment(formData) {
  const name = formData.get('name');
  const age = parseInt(formData.get('age'), 10);
  const mobile = formData.get('mobile');
  const gender = formData.get('gender');
  const tshirtSize = formData.get('tshirtSize');
  const memberType = formData.get('memberType');
  const selectedSports = formData.getAll('selectedSports');
  const totalPrice = parseFloat(formData.get('totalPrice'));
  const txnid = `NIDASPORTZ-${Date.now()}`;

  try {
    await prisma.sportRegistration.create({
      data: {
        name,
        age,
        mobile,
        gender,
        tshirtSize,
        memberType,
        selectedSports,
        totalPrice,
        transactionId: txnid,
        paymentStatus: 'pending',
      },
    });

    const paymentFormData = new FormData();
    paymentFormData.append('name', name);
    // email is optional for sports, but we must pass an empty string
    paymentFormData.append('email', '');
    paymentFormData.append('mobile', mobile);
    // address is optional for sports, but we must pass an empty string
    paymentFormData.append('address', '');
    paymentFormData.append('amount', totalPrice);
    paymentFormData.append('txnid', txnid);
    paymentFormData.append('productinfo', 'NIDASPORTZ 2025 Registration');
    paymentFormData.append('registrationType', 'sports');
    paymentFormData.append('memberType', memberType);
    paymentFormData.append('subCategory', selectedSports.join(', '));

    return await initiatePayment(paymentFormData);

  } catch (error) {
    console.error("Error initiating sports payment:", error);
    return { error: "Could not process your sports registration." };
  }
}