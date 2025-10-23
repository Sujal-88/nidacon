// // app/actions.js
// "use server";

// import crypto from 'crypto';
// import { prisma } from '@/lib/prisma';
// import { generateMemberId } from '@/lib/memberId';

// export async function initiatePayment(formData) {
//   const name = formData.get('name');
//   const email = formData.get('email');
//   const mobile = formData.get('mobile');
//   const address = formData.get('address');
//   const registrationType = formData.get('registrationType');
//   const memberType = formData.get('memberType');
//   const subCategory = formData.get('subCategory');
//   const amount = formData.get('amount');
//   const productinfo = formData.get('productinfo');
//   const txnid = formData.get('txnid');

//   const merchantKey = process.env.PAYU_MERCHANT_KEY;
//   const salt = process.env.PAYU_MERCHANT_SALT;
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

//   if (!merchantKey || !salt || !baseUrl) {
//     console.error("FATAL ERROR: PayU credentials or NEXT_PUBLIC_BASE_URL are not set.");
//     return { error: "Payment gateway is not configured correctly. Please contact support." };
//   }

//   const amountString = parseFloat(amount).toFixed(2);

//   // Ensure all fields are defined as empty strings if null, to guarantee hash integrity.
//   const firstname = (name || '').replace(/\|/g, "");
//   const email_clean = (email || '').replace(/\|/g, "");
//   const productinfo_clean = (productinfo || '').replace(/\|/g, "");
//   const udf1 = (address || '').replace(/(\r\n|\n|\r)/gm, " ").replace(/\|/g, "").trim();
//   const udf2 = (registrationType || '').replace(/\|/g, "");
//   const udf3 = (memberType || '').replace(/\|/g, "");
//   const udf4 = (subCategory || '').replace(/\|/g, "");
//   const udf5 = (formData.get('udf5') || '').replace(/\|/g, "");

//   const successUrl = `${baseUrl}/api/payment/success`;
//   const failureUrl = `${baseUrl}/api/payment/failure`;

//   // --- THIS IS THE CRITICAL FIX ---
//   // The string MUST contain |||||| (6 pipes) between udf5 and the SALT.
//   const hashString = `${merchantKey}|${txnid}|${amountString}|${productinfo_clean}|${firstname}|${email_clean}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;

//   console.log("--- FINAL HASH STRING FOR PAYU ---");
//   console.log(hashString);

//   const hash = crypto.createHash('sha512').update(hashString).digest('hex');

//   const paymentData = {
//     key: merchantKey,
//     txnid,
//     amount: amountString,
//     productinfo: productinfo_clean,
//     firstname: firstname,
//     email: email_clean,
//     phone: mobile,
//     surl: successUrl,
//     furl: failureUrl,
//     udf1,
//     udf2,
//     udf3,
//     udf4,
//     udf5,
//     hash,
//   };

//   return paymentData;
// }
// // (The other functions in this file, processMembership and initiateSportsPayment, do not need changes)
// export async function processMembership(formData) {
//   const name = formData.get('name');
//   const email = formData.get('email');
//   const mobile = formData.get('mobile');
//   const address = formData.get('address');
//   const msdcRegistration = formData.get('msdcRegistration');
//   const memberType = formData.get('memberType');

//   try {
//     const newMemberId = await generateMemberId();
//     const txnid = `NIDAMEM-${Date.now()}`;

//     const user = await prisma.user.upsert({
//       where: { email: email },
//       update: {
//         name: name,
//         mobile: mobile,
//         address: address,
//         isMember: true,
//         memberId: newMemberId,
//         transactionId: txnid,
//         paymentStatus: 'pending'
//       },
//       create: {
//         email: email,
//         name: name,
//         mobile: mobile,
//         address: address,
//         userId: `TEMP-${Date.now()}`,
//         isMember: true,
//         memberId: newMemberId,
//         transactionId: txnid,
//         paymentStatus: 'pending'
//       }
//     });

//     return {
//       success: true,
//       txnid: txnid,
//       memberId: user.memberId,
//     };

//   } catch (error) {
//     console.error("Error processing membership:", error);
//     return { success: false, error: "Could not process membership request." };
//   }
// }

// export async function initiateSportsPayment(formData) {
//     const name = formData.get('name');
//     const age = parseInt(formData.get('age'), 10);
//     const mobile = formData.get('mobile');
//     const gender = formData.get('gender');
//     const email = formData.get('email');
//     const tshirtSize = formData.get('tshirtSize');
//     const memberType = formData.get('memberType');
//     const selectedSports = formData.getAll('selectedSports');
//     const totalPrice = parseFloat(formData.get('totalPrice'));
//     const photoUrl = formData.get('photoUrl'); // Get the photo URL
//     const txnid = `NIDASPORTZ-${Date.now()}`;

//   try {
//     await prisma.sportRegistration.create({
//       data: {
//         name,
//         age,
//         mobile,
//         gender,
//         email,
//         tshirtSize,
//         memberType,
//         selectedSports,
//         totalPrice,
//         photoUrl, // Save the photo URL
//         transactionId: txnid,
//         paymentStatus: 'pending',
//       },
//     });

//     const paymentFormData = new FormData();
//     paymentFormData.append('name', name);
//     // email is optional for sports, but we must pass an empty string
//     paymentFormData.append('email', email);
//     paymentFormData.append('mobile', mobile);
//     // address is optional for sports, but we must pass an empty string
//     paymentFormData.append('address', '');
//     paymentFormData.append('amount', totalPrice);
//     paymentFormData.append('txnid', txnid);
//     paymentFormData.append('productinfo', 'NIDASPORTZ 2025 Registration');
//     paymentFormData.append('registrationType', 'sports');
//     paymentFormData.append('memberType', memberType);
//     paymentFormData.append('subCategory', selectedSports.join(', '));

//     return await initiatePayment(paymentFormData);

//   } catch (error) {
//     console.error("Error initiating sports payment:", error);
//     return { error: "Could not process your sports registration." };
//   }
// }

// app/actions.js
"use server";

import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { generateMemberId } from '@/lib/memberId'; // Keep this for processMembership

// --- initiatePayment MODIFIED ---
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

  // --- NEW: Read Add-on flags ---
  const implantAddon = formData.get('implant') === 'true';
  const banquetAddon = formData.get('banquet') === 'true';
  // --- End NEW ---

  const merchantKey = process.env.PAYU_MERCHANT_KEY;
  const salt = process.env.PAYU_MERCHANT_SALT;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!merchantKey || !salt || !baseUrl) {
    console.error("FATAL ERROR: PayU credentials or NEXT_PUBLIC_BASE_URL are not set.");
    return { error: "Payment gateway is not configured correctly. Please contact support." };
  }

  const amountString = parseFloat(amount).toFixed(2);

  const firstname = (name || '').replace(/\|/g, "");
  const email_clean = (email || '').replace(/\|/g, "");
  const productinfo_clean = (productinfo || '').replace(/\|/g, "");
  const udf1 = (address || '').replace(/(\r\n|\n|\r)/gm, " ").replace(/\|/g, "").trim();
  const udf2 = (registrationType || '').replace(/\|/g, "");
  const udf3 = (memberType || '').replace(/\|/g, "");
  const udf4 = (subCategory || '').replace(/\|/g, "");

  // --- NEW: Construct udf5 with add-on info ---
  // Store as a simple comma-separated string, e.g., "implant:true,banquet:false"
  // Keep it concise as PayU might have length limits on UDFs
  const udf5_parts = [];
  if (registrationType === 'delegate') { // Only add for delegates
      udf5_parts.push(`implant:${implantAddon}`);
      udf5_parts.push(`banquet:${banquetAddon}`);
  }
  const udf5 = udf5_parts.join(',').replace(/\|/g, ""); // Join parts and ensure no pipe characters
  // --- End NEW ---


  const successUrl = `${baseUrl}/api/payment/success`;
  const failureUrl = `${baseUrl}/api/payment/failure`;

  // --- Hash string includes the potentially populated udf5 ---
  const hashString = `${merchantKey}|${txnid}|${amountString}|${productinfo_clean}|${firstname}|${email_clean}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;

  console.log("--- FINAL HASH STRING FOR PAYU ---");
  console.log(hashString); // For debugging

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
    udf1, // Address
    udf2, // registrationType
    udf3, // memberType
    udf4, // subCategory (e.g., from old delegate flow, or maybe workshop IDs)
    udf5, // NEW: Contains add-on info for delegates
    hash,
  };

  return paymentData;
}
// --- End initiatePayment ---


// --- processMembership remains unchanged ---
export async function processMembership(formData) {
  // ... (Keep existing processMembership code)
   const name = formData.get('name');
  const email = formData.get('email');
  const mobile = formData.get('mobile');
  const address = formData.get('address');
  const msdcRegistration = formData.get('msdcRegistration');
  const memberType = formData.get('memberType'); // e.g., 'new-member', 'renewal', 'student-member'

  try {
    const newMemberId = await generateMemberId();
    const txnid = `NIDAMEM-${Date.now()}`;

    // Use upsert to handle both new and existing users wanting membership
    const user = await prisma.user.upsert({
      where: { email: email },
      update: { // Update existing user record
        name: name,
        mobile: mobile,
        address: address,
        isMember: true, // Mark as member
        memberId: newMemberId, // Assign new IDA Member ID
        transactionId: txnid, // Store transaction ID for payment linking
        paymentStatus: 'pending', // Mark payment as pending
         // Optionally update registrationType if relevant, e.g., 'membership-renewal'
         registrationType: 'membership',
         memberType: memberType, // Store specific membership type
      },
      create: { // Create new user record
        email: email,
        name: name,
        mobile: mobile,
        address: address,
        userId: `TEMP-${Date.now()}`, // Temporary User ID until payment
        isMember: true, // Mark as member
        memberId: newMemberId, // Assign new IDA Member ID
        transactionId: txnid, // Store transaction ID for payment linking
        paymentStatus: 'pending', // Mark payment as pending
        registrationType: 'membership',
        memberType: memberType, // Store specific membership type
      }
    });

    console.log(`Membership processed for ${email}. User ID (temp or existing): ${user.userId}, IDA Member ID: ${user.memberId}, Txn ID: ${txnid}`);

    return {
      success: true,
      txnid: txnid,
      memberId: user.memberId, // Return the newly generated IDA Member ID
    };

  } catch (error) {
    console.error("Error processing membership:", error);
     if (error.code === 'P2002' && error.meta?.target?.includes('memberId')) {
         // This is unlikely if generateMemberId is correct, but handle just in case
        console.error("Duplicate Member ID generated. This should not happen.");
        return { success: false, error: "Internal error generating member ID. Please try again." };
    }
    return { success: false, error: "Could not process membership request due to a database error." };
  }
}

// --- initiateSportsPayment remains unchanged ---
export async function initiateSportsPayment(formData) {
  // ... (Keep existing initiateSportsPayment code)
    const name = formData.get('name');
    const age = parseInt(formData.get('age'), 10);
    const mobile = formData.get('mobile');
    const gender = formData.get('gender');
    const email = formData.get('email');
    const tshirtSize = formData.get('tshirtSize');
    const memberType = formData.get('memberType');
    const selectedSports = formData.getAll('selectedSports');
    const totalPrice = parseFloat(formData.get('totalPrice'));
    const photoUrl = formData.get('photoUrl'); // Get the photo URL
    const txnid = `NIDASPORTZ-${Date.now()}`;

  try {
    // Create the SportRegistration record first with 'pending' status
    await prisma.sportRegistration.create({
      data: {
        name,
        age,
        mobile,
        gender,
        email, // Save email
        tshirtSize,
        memberType,
        selectedSports,
        totalPrice,
        photoUrl, // Save the photo URL
        transactionId: txnid,
        paymentStatus: 'pending', // Start as pending
        // userId will be generated and added upon successful payment in the success route
      },
    });

    // Prepare data specifically for the generic initiatePayment function
    const paymentFormData = new FormData();
    paymentFormData.append('name', name);
    paymentFormData.append('email', email || ''); // Pass email, or empty string if not provided
    paymentFormData.append('mobile', mobile);
    paymentFormData.append('address', ''); // Sports doesn't collect address
    paymentFormData.append('amount', totalPrice.toString()); // Ensure amount is string
    paymentFormData.append('txnid', txnid);
    paymentFormData.append('productinfo', 'NIDASPORTZ 2025 Registration');
    paymentFormData.append('registrationType', 'sports'); // Crucial differentiator
    paymentFormData.append('memberType', memberType); // 'member' or 'non-member'
    paymentFormData.append('subCategory', selectedSports.join(', ')); // List selected sports
    // udf5 is not used for sports in this setup, pass empty
    paymentFormData.append('udf5', '');


    // Call the generic initiatePayment function
    return await initiatePayment(paymentFormData);

  } catch (error) {
    console.error("Error initiating sports payment:", error);
    // TODO: Consider deleting the pending SportRegistration record here if creation failed before payment initiation
    return { error: "Could not process your sports registration due to a server error." };
  }
}