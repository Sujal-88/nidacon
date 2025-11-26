// import { NextResponse } from 'next/server';
// import { verifyHash } from '@/lib/payu-utils';
// import { prisma } from '@/lib/prisma';
// import { generateUserId } from '@/lib/userId';
// import {
//   sendRegistrationEmail,
//   sendSportsRegistrationEmail,
//   sendMembershipEmail,
//   sendWorkshopEmail
// } from '@/lib/email';

// export async function POST(request) {
//   let txnid = 'unknown';

//   try {
//     const formData = await request.formData();
//     const payuResponse = Object.fromEntries(formData);
//     txnid = payuResponse.txnid || 'unknown-txn';

//     // Clean the email to prevent "Black Entry" duplicates
//     const responseEmail = (payuResponse.email || '').trim();
//     const registrationType = payuResponse.udf2;

//     console.log("=== PayU Success Webhook ===");
//     console.log(`Txn: ${txnid}`);
//     console.log(`Type (UDF2): ${payuResponse.udf2}`);
//     console.log(`Email: ${responseEmail}`);

//     // 1. Verify Salt
//     const merchantSalt = process.env.PAYU_MERCHANT_SALT;
//     if (!merchantSalt) throw new Error('PayU salt is not configured');

//     // 2. Verify Hash
//     if (!verifyHash(payuResponse, merchantSalt)) {
//       console.error(`❌ Hash verification FAILED for ${txnid}`);
//       return redirectWithFailure(request, txnid, 'Security hash mismatch');
//     }

//     // 3. Handle Failure
//     if (payuResponse.status !== 'success') {
//       console.log(`❌ Payment status is ${payuResponse.status}`);
//       return redirectWithFailure(request, txnid, payuResponse.error_Message || 'Payment Failed');
//     }

//     // 2. Handle SPORTS (Separate Flow)
//     if (registrationType === 'sports') {
//       const sportReg = await prisma.sportRegistration.findUnique({ where: { transactionId: txnid } });
//       if (sportReg && sportReg.paymentStatus !== 'success') {
//         const sportsUserId = `NIDASPORTZ-${String(Date.now()).slice(-6)}`;
//         const updated = await prisma.sportRegistration.update({
//           where: { transactionId: txnid },
//           data: {
//             paymentStatus: 'success',
//             payuId: payuResponse.mihpayid,
//             userId: sportsUserId
//           },
//         });
//         await sendSportsRegistrationEmail(updated, payuResponse);
//       }
//       return redirectToSuccess(request, txnid, registrationType);
//     }

//     // 3. Handle IDENTITY (User)
//     // We ensure the User exists for Membership, Delegate, and Workshop flows.
//     let user = await prisma.user.findFirst({
//       where: { email: { equals: responseEmail, mode: 'insensitive' } }
//     });

//     if (!user) {
//       console.log(`Creating new user for ${responseEmail}`);
//       // Create a basic user identity if one doesn't exist
//       user = await prisma.user.create({
//         data: {
//           email: responseEmail,
//           name: payuResponse.firstname,
//           mobile: payuResponse.phone,
//           address: payuResponse.udf1,
//           userId: `TEMP-${Date.now()}`,
//         }
//       });
//     }

//     // 4. ROUTE BY REGISTRATION TYPE (The Split Logic)

//     // --- CASE A: MEMBERSHIP ---
//     if (registrationType === 'membership') {
//       console.log("Processing Membership Update...");
//       // The Membership record was pre-created in actions.js with status 'pending'
//       const membership = await prisma.membership.findUnique({
//         where: { transactionId: txnid }
//       });

//       if (membership) {
//         await prisma.membership.update({
//           where: { transactionId: txnid },
//           data: {
//             paymentStatus: 'success',
//             payuId: payuResponse.mihpayid,
//             amount: parseFloat(payuResponse.amount),
//             // Link to the confirmed User Identity if not already
//             userId: user.id
//           }
//         });

//         await sendMembershipEmail({ ...user, memberId: membership.memberId }, payuResponse);
//       } else {
//         console.error("CRITICAL: Membership record not found for txnid:", txnid);
//       }
//     }

//     // --- CASE B: WORKSHOP ---
//     else if (registrationType && registrationType.startsWith('workshop')) {
//       console.log("Processing Workshop Entry...");

//       // udf4 contains comma-separated workshop names (from actions.js)
//       const rawWorkshops = payuResponse.udf4 || '';
//       const workshopNames = rawWorkshops ? rawWorkshops.split(',').map(s => s.trim()).filter(s => s !== '') : [];

//       // Create a NEW WorkshopRegistration entry
//       await prisma.workshopRegistration.create({
//         data: {
//           userId: user.id,
//           workshops: workshopNames, // Storing array of names
//           transactionId: txnid,
//           payuId: payuResponse.mihpayid,
//           amount: parseFloat(payuResponse.amount),
//           paymentStatus: 'success'
//         }
//       });

//       await sendWorkshopEmail(user, payuResponse);
//     }

//     // --- CASE C: DELEGATE (Legacy / Main Conference) ---
//     else if (registrationType === 'delegate') {
//       console.log("Processing Delegate Registration...");

//       // Upgrade User ID from TEMP to NIDAxxxx
//       let finalUserId = user.userId;
//       if (user.userId.startsWith('TEMP')) {
//         finalUserId = await generateUserId();
//       }

//       // Check Add-ons from udf5 (constructed in actions.js)
//       let purchasedImplant = false;
//       let purchasedBanquet = false;
//       if (payuResponse.udf5) {
//         purchasedImplant = payuResponse.udf5.includes('implant:true');
//         purchasedBanquet = payuResponse.udf5.includes('banquet:true');
//       }

//       // Update the MAIN USER record
//       const updatedUser = await prisma.user.update({
//         where: { id: user.id },
//         data: {
//           userId: finalUserId,
//           registrationType: 'delegate',
//           transactionId: txnid,
//           payuId: payuResponse.mihpayid,
//           paymentAmount: parseFloat(payuResponse.amount),
//           paymentStatus: 'success',
//           // Delegate specific fields
//           purchasedImplantAddon: purchasedImplant,
//           purchasedBanquetAddon: purchasedBanquet,
//           memberType: payuResponse.udf3 // 'member' or 'non-member' status
//         }
//       });

//       await sendRegistrationEmail(updatedUser, payuResponse);
//     }

//     return redirectToSuccess(request, txnid, registrationType);

//   } catch (error) {
//     console.error("CRITICAL SERVER ERROR in Payment Webhook:", error);
//     return redirectWithFailure(request, txnid, 'Internal Server Error');
//   }
// }

// function redirectToSuccess(request, txnid, type) {
//   const url = new URL('/payment/success', request.url);
//   url.searchParams.set('txnid', txnid);
//   url.searchParams.set('registrationType', type);
//   return NextResponse.redirect(url, { status: 303 });
// }

// function redirectWithFailure(request, txnid, message) {
//   const url = new URL('/payment/failure', request.url);
//   url.searchParams.set('txnid', txnid);
//   url.searchParams.set('error_Message', message);
//   url.searchParams.set('status', 'failure');
//   return NextResponse.redirect(url, { status: 303 });
// }

// 27-11-2025
import { NextResponse } from 'next/server';
import { verifyHash } from '@/lib/payu-utils';
import { prisma } from '@/lib/prisma';
import { generateUserId } from '@/lib/userId';
import {
  sendRegistrationEmail,
  sendSportsRegistrationEmail,
  sendMembershipEmail,
  sendWorkshopEmail
} from '@/lib/email';

export async function POST(request) {
  let txnid = 'unknown';
  const startTime = Date.now();

  try {
    const formData = await request.formData();
    const payuResponse = Object.fromEntries(formData);
    txnid = payuResponse.txnid || 'unknown-txn';

    console.log(`\n=== 🔔 PayU Webhook: ${txnid} ===`);
    console.log(`Type: ${payuResponse.udf2} | Email: ${payuResponse.email}`);

    // STEP 1: Security Check
    const merchantSalt = process.env.PAYU_MERCHANT_SALT;
    if (!verifyHash(payuResponse, merchantSalt)) {
      console.error(`❌ [${txnid}] Hash Mismatch`);
      return redirectWithFailure(request, txnid, 'Security hash mismatch');
    }

    // STEP 2: Status Check
    if (payuResponse.status !== 'success') {
      console.log(`❌ [${txnid}] Status: ${payuResponse.status}`);
      await updatePaymentFailure(txnid, payuResponse);
      return redirectWithFailure(request, txnid, payuResponse.error_Message || 'Payment Failed');
    }

    // STEP 3: Smart Idempotency Check (Optimized)
    // Only check the table relevant to the registration type
    const isDuplicate = await checkDuplicateSmart(txnid, payuResponse.udf2);
    if (isDuplicate) {
      console.log(`⚠️ [${txnid}] Already processed. Skipping.`);
      return redirectToSuccess(request, txnid, payuResponse.udf2);
    }

    // STEP 4: Route Processing
    const registrationType = payuResponse.udf2;
    const subCategory = payuResponse.udf4 || '';

    // --- SPORTS ---
    if (registrationType === 'sports') {
      await processSportsRegistration(txnid, payuResponse);
      return redirectToSuccess(request, txnid, registrationType);
    }

    // --- USER IDENTITY (Delegate/Member/Workshop) ---
    // This "Safety Net" fixes the missing name issue by creating a user if missing
    const user = await getOrCreateUser(payuResponse);
    
    // --- SPECIFIC TYPES ---
    if (registrationType === 'membership') {
      await processMembershipRegistration(txnid, payuResponse, user, subCategory);
    } 
    else if (registrationType && registrationType.startsWith('workshop')) {
      await processWorkshopRegistration(txnid, payuResponse, user, subCategory);
    } 
    else if (registrationType === 'delegate') {
      await processDelegateRegistration(txnid, payuResponse, user, subCategory);
    }

    console.log(`✅ [${txnid}] Completed in ${Date.now() - startTime}ms`);
    return redirectToSuccess(request, txnid, registrationType);

  } catch (error) {
    console.error(`❌ [${txnid}] CRITICAL ERROR:`, error);
    return redirectWithFailure(request, txnid, 'Internal Server Error');
  }
}

// ============================================
// OPTIMIZED HELPERS
// ============================================

/**
 * Smart check that only queries the relevant table
 */
async function checkDuplicateSmart(txnid, type) {
  if (type === 'sports') {
    const txn = await prisma.sportRegistration.findUnique({ where: { transactionId: txnid } });
    return txn && txn.paymentStatus === 'success';
  }
  if (type === 'membership') {
    const txn = await prisma.membership.findUnique({ where: { transactionId: txnid } });
    return txn && txn.paymentStatus === 'success';
  }
  if (type && type.startsWith('workshop')) {
    // Workshops might rely on User table or their own table depending on implementation
    // Checking both to be safe, but optimizing order
    const wsTxn = await prisma.workshopRegistration.findFirst({ where: { transactionId: txnid } });
    return wsTxn && wsTxn.paymentStatus === 'success';
  }
  // Default Delegate (User Table)
  const userTxn = await prisma.user.findUnique({ where: { transactionId: txnid } });
  return userTxn && userTxn.paymentStatus === 'success';
}

/**
 * Robust User Retrieval/Creation
 * Handles race conditions using try/catch on create
 */
async function getOrCreateUser(payuResponse) {
  const email = payuResponse.email.trim().toLowerCase();
  
  // 1. Try to find existing
  let user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: 'insensitive' } }
  });

  if (user) return user;

  // 2. If not found, try to create (Safety Net)
  console.log(`📝 Creating missing user from Webhook data: ${email}`);
  const tempId = `TEMP-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

  try {
    user = await prisma.user.create({
      data: {
        email: email,
        name: payuResponse.firstname || 'Unknown',
        mobile: payuResponse.phone || '',
        address: payuResponse.udf1 || '',
        userId: tempId,
        paymentStatus: 'pending'
      }
    });
  } catch (error) {
    // If create fails (likely race condition where user was created ms ago), find it again
    console.log(`⚠️ User creation race condition, fetching...`);
    user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } }
    });
  }

  if (!user) throw new Error("Failed to get or create user identity");
  return user;
}

async function processSportsRegistration(txnid, payuResponse) {
  const sportReg = await prisma.sportRegistration.findUnique({ 
    where: { transactionId: txnid } 
  });

  if (!sportReg) {
    // If sports record is missing, we cannot easily reconstruct it due to missing fields (age, etc)
    console.error(`❌ Sports Record Missing for ${txnid}`);
    return; 
  }

  if (sportReg.paymentStatus !== 'success') {
    const sportsUserId = `NIDASPORTZ-${String(Date.now()).slice(-6)}`;
    const updated = await prisma.sportRegistration.update({
      where: { transactionId: txnid },
      data: {
        paymentStatus: 'success',
        payuId: payuResponse.mihpayid,
        userId: sportsUserId,
        email: payuResponse.email.trim().toLowerCase()
      }
    });
    await sendSportsRegistrationEmail(updated, payuResponse);
  }
}

async function processMembershipRegistration(txnid, payuResponse, user, subCategory) {
  const membership = await prisma.membership.findUnique({ 
    where: { transactionId: txnid } 
  });

  if (membership && membership.paymentStatus !== 'success') {
    await prisma.membership.update({
      where: { transactionId: txnid },
      data: {
        paymentStatus: 'success',
        payuId: payuResponse.mihpayid,
        amount: parseFloat(payuResponse.amount),
        userId: user.id
      }
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isMember: true,
        memberId: membership.memberId,
        subCategory: subCategory
      }
    });
    
    await sendMembershipEmail({ ...user, memberId: membership.memberId }, payuResponse);
  }
}

async function processWorkshopRegistration(txnid, payuResponse, user, subCategory) {
  const workshopNames = subCategory ? subCategory.split(',').map(s => s.trim()).filter(Boolean) : [];
  
  // Create the registration record
  await prisma.workshopRegistration.create({
    data: {
      userId: user.id,
      workshops: workshopNames,
      transactionId: txnid,
      payuId: payuResponse.mihpayid,
      amount: parseFloat(payuResponse.amount),
      paymentStatus: 'success'
    }
  });
  
  await sendWorkshopEmail(user, payuResponse);
}

async function processDelegateRegistration(txnid, payuResponse, user, subCategory) {
  // Upgrade ID if needed
  let finalUserId = user.userId;
  if (user.userId.startsWith('TEMP')) {
    finalUserId = await generateUserId();
  }

  let purchasedImplant = false;
  let purchasedBanquet = false;
  if (payuResponse.udf5) {
    purchasedImplant = payuResponse.udf5.includes('implant:true');
    purchasedBanquet = payuResponse.udf5.includes('banquet:true');
  }

  // Force update user details from PayU to ensure accuracy
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      userId: finalUserId,
      name: payuResponse.firstname || user.name,
      mobile: payuResponse.phone || user.mobile,
      address: payuResponse.udf1 || user.address,
      photoUrl: payuResponse.udf6 || user.photoUrl,
      registrationType: 'delegate',
      subCategory: subCategory, 
      transactionId: txnid,
      payuId: payuResponse.mihpayid,
      paymentAmount: parseFloat(payuResponse.amount),
      paymentStatus: 'success',
      purchasedImplantAddon: purchasedImplant,
      purchasedBanquetAddon: purchasedBanquet,
      memberType: payuResponse.udf3
    }
  });

  await sendRegistrationEmail(updatedUser, payuResponse);
}

async function updatePaymentFailure(txnid, payuResponse) {
  // Helper to update status to failure based on type
  const type = payuResponse.udf2;
  const data = { paymentStatus: 'failure', payuId: payuResponse.mihpayid };
  
  if (type === 'sports') {
    await prisma.sportRegistration.updateMany({ where: { transactionId: txnid }, data });
  } else if (type === 'membership') {
    await prisma.membership.updateMany({ where: { transactionId: txnid }, data });
  } else {
    await prisma.user.updateMany({ where: { transactionId: txnid }, data });
  }
}

function redirectToSuccess(request, txnid, type) {
  const url = new URL('/payment/success', request.url);
  url.searchParams.set('txnid', txnid);
  url.searchParams.set('registrationType', type);
  return NextResponse.redirect(url, { status: 303 });
}

function redirectWithFailure(request, txnid, message) {
  const url = new URL('/payment/failure', request.url);
  url.searchParams.set('txnid', txnid);
  url.searchParams.set('error_Message', message);
  url.searchParams.set('status', 'failure');
  return NextResponse.redirect(url, { status: 303 });
}