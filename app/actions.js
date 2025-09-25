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
  
  // *** CRITICAL: Ensure you have this environment variable set in Vercel ***
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!merchantKey || !salt || !baseUrl) {
    console.error("FATAL ERROR: PayU credentials or NEXT_PUBLIC_BASE_URL are not set in environment variables.");
    return { error: "Payment gateway is not configured correctly. Please contact support." };
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

  // *** DEFINE THE CORRECT API ROUTES ***
  const successUrl = `${baseUrl}/api/payment/success`;
  const failureUrl = `${baseUrl}/api/payment/failure`;

  const hashString = `${merchantKey}|${txnid}|${amountString}|${cleanProductinfo}|${cleanName}|${cleanEmail}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
  
  // *** ADDED LOGGING FOR DEBUGGING ***
  console.log("--- INITIATING PAYMENT ---");
  console.log("Base URL:", baseUrl);
  console.log("Success URL (surl):", successUrl);
  console.log("Failure URL (furl):", failureUrl);
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

export async function processMembership(formData) {
    const name = formData.get('name');
    const email = formData.get('email');
    const mobile = formData.get('mobile');
    const address = formData.get('address');
    const msdcRegistration = formData.get('msdcRegistration');
    const memberType = formData.get('memberType'); // e.g., 'new-member', 'renewal'
    
    try {
        const newMemberId = await generateMemberId();
        const txnid = `NIDAMEM-${Date.now()}`;

        // Find user by email to prevent duplicates. If they exist, we update them.
        // If not, we create a new user record.
        const user = await prisma.user.upsert({
            where: { email: email },
            update: {
                isMember: true,
                memberId: newMemberId, // Assign new member ID on renewal/creation
                transactionId: txnid, // Update with the latest transaction ID for this payment
                paymentStatus: 'pending'
            },
            create: {
                email: email,
                name: name,
                mobile: mobile,
                address: address,
                userId: `TEMP-${Date.now()}`, // Temporary placeholder
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