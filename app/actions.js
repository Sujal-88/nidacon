// "use server";

// import crypto from 'crypto';
// import { prisma } from '@/lib/prisma';
// import { generateMemberId } from '@/lib/memberId';
// import { generateUserId } from '@/lib/userId'; // Import generateUserId

// // --- initiatePayment (Keep existing) ---
// export async function initiatePayment(formData) {
//   // ... (existing initiatePayment code) ...
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
//   const photoUrl = formData.get('photoUrl') || '';

//   // --- NEW: Read Add-on flags ---
//   const implantAddon = formData.get('implant') === 'true';
//   const banquetAddon = formData.get('banquet') === 'true';
//   // --- End NEW ---

//   const merchantKey = process.env.PAYU_MERCHANT_KEY;
//   const salt = process.env.PAYU_MERCHANT_SALT;
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

//   if (!merchantKey || !salt || !baseUrl) {
//     console.error("FATAL ERROR: PayU credentials or NEXT_PUBLIC_BASE_URL are not set.");
//     return { error: "Payment gateway is not configured correctly. Please contact support." };
//   }

//   const amountString = parseFloat(amount).toFixed(2);

//   const firstname = (name || '').replace(/\|/g, "");
//   const email_clean = (email || '').replace(/\|/g, "");
//   const productinfo_clean = (productinfo || '').replace(/\|/g, "");
//   const udf1 = (address || '').replace(/(\r\n|\n|\r)/gm, " ").replace(/\|/g, "").trim();
//   const udf2 = (registrationType || '').replace(/\|/g, "");
//   const udf3 = (memberType || '').replace(/\|/g, "");
//   const udf4 = (subCategory || '').replace(/\|/g, "");

  
//   const udf5_parts = [];
//   if (registrationType === 'delegate') { // Only add for delegates
//       udf5_parts.push(`implant:${implantAddon}`);
//       udf5_parts.push(`banquet:${banquetAddon}`);
//   }
//   const udf5 = udf5_parts.join(',').replace(/\|/g, "");
//   const udf6 = (photoUrl || '').replace(/\|/g, "");


//   const successUrl = `${baseUrl}/api/payment/success`;
//   const failureUrl = `${baseUrl}/api/payment/failure`;

//   // --- Hash string includes the potentially populated udf5 ---
//   const hashString = `${merchantKey}|${txnid}|${amountString}|${productinfo_clean}|${firstname}|${email_clean}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}|${udf6}|||||${salt}`;

//   // console.log("--- FINAL HASH STRING FOR PAYU ---");
//   // console.log(hashString); // For debugging

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
//     udf1, // Address
//     udf2, // registrationType
//     udf3, // memberType
//     udf4, // subCategory (e.g., from old delegate flow, or maybe workshop IDs)
//     udf5, // NEW: Contains add-on info for delegates
//     udf6, // NEW: photoUrl for sports registrations
//     hash,
//   };

//   return paymentData;
// }

// // --- processMembership (Keep existing) ---
// export async function processMembership(formData) {
//   // ... (existing processMembership code) ...
//    const name = formData.get('name');
//   const email = formData.get('email');
//   const mobile = formData.get('mobile');
//   const address = formData.get('address');
//   const msdcRegistration = formData.get('msdcRegistration');
//   const memberType = formData.get('memberType');

//   try {
//     const newMemberId = await generateMemberId();
//     const txnid = `NIDAMEM-${Date.now()}`;

//     // Use upsert to handle both new and existing users wanting membership
//     const user = await prisma.user.upsert({
//       where: { email: email },
//       update: { name, mobile, address },
//       create: {
//         email, name, mobile, address,
//         userId: `TEMP-${Date.now()}`,
//       }
//     });

//     await prisma.membership.create({
//       data: {
//         userId: user.id, // Link to User Identity
//         memberId: newMemberId,
//         type: memberType,
//         msdcNumber: msdcRegistration,
//         transactionId: txnid,
//         amount: 0, // Will be updated by webhook
//         paymentStatus: 'pending'
//       }
//     });

//     // console.log(`Membership processed for ${email}. User ID (temp or existing): ${user.userId}, IDA Member ID: ${user.memberId}, Txn ID: ${txnid}`);

//     return {
//       success: true,
//       txnid: txnid,
//       memberId: newMemberId,
//     };

//   } catch (error) {
//     console.error("Error processing membership:", error);
//      if (error.code === 'P2002' && error.meta?.target?.includes('memberId')) {
//          // This is unlikely if generateMemberId is correct, but handle just in case
//         console.error("Duplicate Member ID generated. This should not happen.");
//         return { success: false, error: "Internal error generating member ID. Please try again." };
//     }
//     return { success: false, error: "Could not process membership request due to a database error." };
//   }
// }

// // --- initiateSportsPayment (Keep existing) ---
// export async function initiateSportsPayment(formData) {
//   // ... (existing initiateSportsPayment code) ...
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
//     // Create the SportRegistration record first with 'pending' status
//     await prisma.sportRegistration.create({
//       data: {
//         name,
//         age,
//         mobile,
//         gender,
//         email, // Save email
//         tshirtSize,
//         memberType,
//         selectedSports,
//         totalPrice,
//         photoUrl, // Save the photo URL
//         transactionId: txnid,
//         paymentStatus: 'pending', // Start as pending
//         // userId will be generated and added upon successful payment in the success route
//       },
//     });

//     // Prepare data specifically for the generic initiatePayment function
//     const paymentFormData = new FormData();
//     paymentFormData.append('name', name);
//     paymentFormData.append('email', email || ''); // Pass email, or empty string if not provided
//     paymentFormData.append('mobile', mobile);
//     paymentFormData.append('address', ''); // Sports doesn't collect address
//     paymentFormData.append('amount', totalPrice.toString()); // Ensure amount is string
//     paymentFormData.append('txnid', txnid);
//     paymentFormData.append('productinfo', 'NIDASPORTZ 2025 Registration');
//     paymentFormData.append('registrationType', 'sports'); // Crucial differentiator
//     paymentFormData.append('memberType', memberType); // 'member' or 'non-member'
//     paymentFormData.append('subCategory', selectedSports.join(', ')); // List selected sports
//     // udf5 is not used for sports in this setup, pass empty
//     paymentFormData.append('udf5', '');
//     paymentFormData.append('photoUrl', photoUrl);



//     // Call the generic initiatePayment function
//     return await initiatePayment(paymentFormData);

//   } catch (error) {
//     console.error("Error initiating sports payment:", error);
//     // TODO: Consider deleting the pending SportRegistration record here if creation failed before payment initiation
//     return { error: "Could not process your sports registration due to a server error." };
//   }
// }

// // --- NEW: Server Action to Save Paper/Poster Submission ---
// export async function saveSubmission(submissionData) {
//     console.log("Saving Submission:", submissionData);
//     try {
//         // A. Upsert User (Identity)
//         // We need a valid User to link the paper/poster to.
//         const user = await prisma.user.upsert({
//             where: { email: submissionData.email },
//             update: {
//                 name: submissionData.name,
//                 mobile: submissionData.mobile,
//                 address: submissionData.address,
//             },
//             create: {
//                 email: submissionData.email,
//                 name: submissionData.name,
//                 mobile: submissionData.mobile,
//                 address: submissionData.address,
//                 userId: await generateUserId(),
//             },
//         });

//         // B. Create Paper/Poster Node
//         // Using .create() ensures a new node is created every time,
//         // allowing multiple submissions per user.
//         await prisma.paperPoster.create({
//             data: {
//                 userId: user.id, // Foreign Key to User
//                 type: 'paper-poster',
//                 category: submissionData.paperCategory || submissionData.posterCategory,
                
//                 // New Fields as requested
//                 enrollName: submissionData.name,
//                 mobile: submissionData.mobile,
//                 email: submissionData.email,
//                 collegeName: submissionData.collegeName || "Not Provided", // Ensure your frontend sends this!
//                 title: submissionData.title || "Untitled", // Ensure your frontend sends this!
                
//                 // URLs
//                 fullPaperUrl: submissionData.paperUrl || null,
//                 posterUrl: submissionData.posterUrl || null,
                
//                 status: 'submitted',
//             }
//         });

//         return { success: true, userId: user.userId };

//     } catch (error) {
//         console.error("Submission Error:", error);
//         return { success: false, error: "Database error during submission save." };
//     }
// }
// // --- End NEW Server Action ---

"use server";

import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { generateMemberId } from '@/lib/memberId';
import { generateUserId } from '@/lib/userId';

export async function initiatePayment(formData) {
  const name = formData.get('name');
  // FIX: Ensure email is clean for DB lookup
  const rawEmail = formData.get('email');
  const email = rawEmail ? rawEmail.trim().toLowerCase() : ''; 
  
  const mobile = formData.get('mobile');
  const address = formData.get('address');
  const registrationType = formData.get('registrationType');
  const memberType = formData.get('memberType');
  const subCategory = formData.get('subCategory');
  const amount = formData.get('amount');
  const productinfo = formData.get('productinfo');
  const txnid = formData.get('txnid') || `NIDA${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const photoUrl = formData.get('photoUrl') || '';
  
  // Flags
  const implantAddon = formData.get('implant') === 'true';
  const banquetAddon = formData.get('banquet') === 'true';

  const merchantKey = process.env.PAYU_MERCHANT_KEY;
  const salt = process.env.PAYU_MERCHANT_SALT;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!merchantKey || !salt || !baseUrl) {
    return { error: "Payment gateway config missing." };
  }

  // ============================================================
  // 🛡️ UNIVERSAL SAFETY SAVE (With Overwrite Protection)
  // ============================================================
  
  // 1. Define what we ALWAYS update (Contact info & Payment status)
  const baseUpdateData = {
    name,
    mobile,
    address,
    transactionId: txnid,
    paymentAmount: parseFloat(amount),
    paymentStatus: 'pending', // Mark as pending immediately
  };

  // 2. Define what we update ONLY for Delegates
  // This prevents overwriting a Delegate's status if they later buy a Workshop/Sport
  if (registrationType === 'delegate') {
    baseUpdateData.registrationType = registrationType;
    baseUpdateData.memberType = memberType;
    baseUpdateData.subCategory = subCategory; // Only update subCategory for Delegates
    baseUpdateData.purchasedImplantAddon = implantAddon;
    baseUpdateData.purchasedBanquetAddon = banquetAddon;
    if (photoUrl) baseUpdateData.photoUrl = photoUrl;
  }

  try {
    await prisma.user.upsert({
      where: { email: email },
      update: baseUpdateData, // Use the safe object constructed above
      create: {
        email,
        name,
        mobile,
        address,
        // For NEW users, we save everything regardless of type
        registrationType: registrationType,
        memberType: memberType,
        subCategory: subCategory,
        transactionId: txnid,
        paymentAmount: parseFloat(amount),
        paymentStatus: 'pending',
        userId: `TEMP-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        purchasedImplantAddon: implantAddon,
        purchasedBanquetAddon: banquetAddon,
        photoUrl: photoUrl
      }
    });
  } catch (e) {
    console.error("Failed to save pending record:", e);
    // Fail-open: Continue to payment even if DB save fails
  }
  // ============================================================

  const amountString = parseFloat(amount).toFixed(2);
  
  // Sanitize fields for PayU Hash
  const firstname = (name || '').replace(/\|/g, "");
  const email_clean = (email || '').replace(/\|/g, ""); 
  const productinfo_clean = (productinfo || '').replace(/\|/g, "");
  const udf1 = (address || '').replace(/(\r\n|\n|\r)/gm, " ").replace(/\|/g, "").trim();
  const udf2 = (registrationType || '').replace(/\|/g, "");
  const udf3 = (memberType || '').replace(/\|/g, "");
  const udf4 = (subCategory || '').replace(/\|/g, "");

  const udf5_parts = [];
  if (registrationType === 'delegate') {
      udf5_parts.push(`implant:${implantAddon}`);
      udf5_parts.push(`banquet:${banquetAddon}`);
  }
  const udf5 = udf5_parts.join(',').replace(/\|/g, "");
  const udf6 = (photoUrl || '').replace(/\|/g, "");

  const hashString = `${merchantKey}|${txnid}|${amountString}|${productinfo_clean}|${firstname}|${email_clean}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}|${udf6}|||||${salt}`;
  const hash = crypto.createHash('sha512').update(hashString).digest('hex');

  return {
    key: merchantKey,
    txnid,
    amount: amountString,
    productinfo: productinfo_clean,
    firstname: firstname,
    email: email_clean,
    phone: mobile,
    surl: `${baseUrl}/api/payment/success`,
    furl: `${baseUrl}/api/payment/failure`,
    udf1, udf2, udf3, udf4, udf5, udf6,
    hash,
  };
}

// ... (Rest of the file remains unchanged: processMembership, initiateSportsPayment, saveSubmission)
export async function processMembership(formData) {
   const name = formData.get('name');
   const email = formData.get('email').trim().toLowerCase();
   const mobile = formData.get('mobile');
   const address = formData.get('address');
   const msdcRegistration = formData.get('msdcRegistration');
   const memberType = formData.get('memberType');

  try {
    const newMemberId = await generateMemberId();
    const txnid = `NIDAMEM-${Date.now()}`;

    const user = await prisma.user.upsert({
      where: { email: email },
      update: { name, mobile, address },
      create: {
        email, name, mobile, address,
        userId: `TEMP-${Date.now()}`,
      }
    });

    await prisma.membership.create({
      data: {
        userId: user.id,
        memberId: newMemberId,
        type: memberType,
        msdcNumber: msdcRegistration,
        transactionId: txnid,
        amount: 0,
        paymentStatus: 'pending'
      }
    });

    return { success: true, txnid: txnid, memberId: newMemberId };
  } catch (error) {
    console.error("Error processing membership:", error);
    return { success: false, error: "Database error." };
  }
}

export async function initiateSportsPayment(formData) {
    const name = formData.get('name');
    const age = parseInt(formData.get('age'), 10);
    const mobile = formData.get('mobile');
    const gender = formData.get('gender');
    const rawEmail = formData.get('email');
    const email = rawEmail ? rawEmail.trim().toLowerCase() : '';
    
    const tshirtSize = formData.get('tshirtSize');
    const memberType = formData.get('memberType');
    const selectedSports = formData.getAll('selectedSports');
    const totalPrice = parseFloat(formData.get('totalPrice'));
    const photoUrl = formData.get('photoUrl');
    const txnid = `NIDASPORTZ-${Date.now()}`;

  try {
    await prisma.sportRegistration.create({
      data: {
        name, age, mobile, gender, email,
        tshirtSize, memberType, selectedSports, totalPrice, photoUrl,
        transactionId: txnid,
        paymentStatus: 'pending',
      },
    });

    const paymentFormData = new FormData();
    paymentFormData.append('name', name);
    paymentFormData.append('email', email);
    paymentFormData.append('mobile', mobile);
    paymentFormData.append('address', '');
    paymentFormData.append('amount', totalPrice.toString());
    paymentFormData.append('txnid', txnid);
    paymentFormData.append('productinfo', 'NIDASPORTZ 2025 Registration');
    paymentFormData.append('registrationType', 'sports');
    paymentFormData.append('memberType', memberType);
    paymentFormData.append('subCategory', selectedSports.join(', '));
    paymentFormData.append('udf5', '');
    paymentFormData.append('photoUrl', photoUrl);

    return await initiatePayment(paymentFormData);

  } catch (error) {
    console.error("Error initiating sports payment:", error);
    return { error: "Server error processing sports registration." };
  }
}

export async function saveSubmission(submissionData) {
    try {
        const email = submissionData.email.trim().toLowerCase();
        
        const user = await prisma.user.upsert({
            where: { email: email },
            update: {
                name: submissionData.name,
                mobile: submissionData.mobile,
                address: submissionData.address,
            },
            create: {
                email: email,
                name: submissionData.name,
                mobile: submissionData.mobile,
                address: submissionData.address,
                userId: await generateUserId(),
            },
        });

        await prisma.paperPoster.create({
            data: {
                userId: user.id,
                type: 'paper-poster',
                category: submissionData.paperCategory || submissionData.posterCategory,
                enrollName: submissionData.name,
                mobile: submissionData.mobile,
                email: email,
                collegeName: submissionData.collegeName || "Not Provided",
                title: submissionData.title || "Untitled",
                fullPaperUrl: submissionData.paperUrl || null,
                posterUrl: submissionData.posterUrl || null,
                status: 'submitted',
            }
        });

        return { success: true, userId: user.userId };
    } catch (error) {
        console.error("Submission Error:", error);
        return { success: false, error: "Database error." };
    }
}