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
    const registrationType = payuResponse.udf2;
    const subCategory = payuResponse.udf4 || '';

    console.log(`\n=== 🔔 PayU Webhook: ${txnid} ===`);
    console.log(`Type: ${registrationType} | Status: ${payuResponse.status}`);

    // STEP 1: Security Check
    const merchantSalt = process.env.PAYU_MERCHANT_SALT;
    if (!verifyHash(payuResponse, merchantSalt)) {
      console.error(`❌ [${txnid}] Hash Mismatch`);
      return redirectWithFailure(request, txnid, 'Security hash mismatch');
    }

    // STEP 2: Status Check
    if (payuResponse.status !== 'success') {
      await updatePaymentFailure(txnid, payuResponse);
      return redirectWithFailure(request, txnid, payuResponse.error_Message || 'Payment Failed');
    }

    // STEP 3: Identify User (THE FIX)
    // Priority 1: Find by Transaction ID (The Golden Key)
    // This finds the EXACT record created in initiatePayment
    let user = await prisma.user.findUnique({
      where: { transactionId: txnid }
    });

    // Priority 2: Fallback to Email only if TxnID lookup fails (Safety Net)
    if (!user) {
        console.log(`⚠️ [${txnid}] User not found by TxnID, falling back to Email...`);
        user = await getOrCreateUser(payuResponse);
    }

    // STEP 4: Process Specific Logic based on Type
    
    // --- A. SPORTS REGISTRATION ---
    if (registrationType === 'sports') {
      await processSportsRegistration(txnid, payuResponse);
      return redirectToSuccess(request, txnid, registrationType);
    }

    // --- B. MEMBERSHIP ---
    if (registrationType === 'membership') {
      await processMembershipRegistration(txnid, payuResponse, user, subCategory);
    } 
    // --- C. WORKSHOP ---
    else if (registrationType && registrationType.startsWith('workshop')) {
      await processWorkshopRegistration(txnid, payuResponse, user, subCategory);
    } 
    // --- D. DELEGATE (Main Event) ---
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
// HELPER FUNCTIONS
// ============================================

async function processDelegateRegistration(txnid, payuResponse, user, subCategory) {
  // 1. Upgrade ID: If user still has a TEMP id from initiatePayment, generate a real NIDACON ID
  let finalUserId = user.userId;
  if (user.userId.startsWith('TEMP')) {
    finalUserId = await generateUserId();
  }

  // 2. Parse Add-ons
  const purchasedImplant = payuResponse.udf5?.includes('implant:true') || false;
  const purchasedBanquet = payuResponse.udf5?.includes('banquet:true') || false;

  // 3. UPDATE User Record
  // We update the record found by txnid, guaranteeing we update the Pending user to Success
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      userId: finalUserId,
      registrationType: 'delegate',
      transactionId: txnid,
      payuId: payuResponse.mihpayid,
      paymentAmount: parseFloat(payuResponse.amount),
      paymentStatus: 'success', // <--- STATUS UPDATED HERE
      memberType: payuResponse.udf3,
      subCategory: subCategory,
      purchasedImplantAddon: purchasedImplant,
      purchasedBanquetAddon: purchasedBanquet,
      // Sync contact info just in case
      name: payuResponse.firstname, 
      mobile: payuResponse.phone,
      address: payuResponse.udf1
    }
  });

  await sendRegistrationEmail(updatedUser, {
    txnid: txnid,
    amount: payuResponse.amount,
    status: 'success'
  });
}

// Safety Net: Only used if TxnID lookup fails completely
async function getOrCreateUser(payuResponse) {
  const email = (payuResponse.email || '').trim().toLowerCase();
  
  let user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: 'insensitive' } }
  });

  if (user) return user;

  console.log(`📝 Creating NEW user from Webhook (Fallback): ${email}`);
  return await prisma.user.create({
    data: {
      email: email,
      name: payuResponse.firstname || 'Unknown',
      mobile: payuResponse.phone || '',
      address: payuResponse.udf1 || '',
      userId: `TEMP-${Date.now()}`, 
      paymentStatus: 'pending'
    }
  });
}

// --- Existing Helpers (Sports, Membership, Workshop, Redirects) ---

async function processSportsRegistration(txnid, payuResponse) {
  const sportReg = await prisma.sportRegistration.findUnique({ where: { transactionId: txnid } });
  if (sportReg && sportReg.paymentStatus !== 'success') {
    const updated = await prisma.sportRegistration.update({
      where: { transactionId: txnid },
      data: {
        paymentStatus: 'success',
        payuId: payuResponse.mihpayid,
        userId: `NIDASPORTZ-${String(Date.now()).slice(-6)}`,
        email: payuResponse.email
      }
    });
    await sendSportsRegistrationEmail(updated, payuResponse);
  }
}

async function processMembershipRegistration(txnid, payuResponse, user, subCategory) {
  const membership = await prisma.membership.findUnique({ where: { transactionId: txnid } });
  if (membership) {
    await prisma.membership.update({
      where: { transactionId: txnid },
      data: { paymentStatus: 'success', payuId: payuResponse.mihpayid, amount: parseFloat(payuResponse.amount), userId: user.id }
    });
    // Link membership to the user account
    await prisma.user.update({
      where: { id: user.id },
      data: { isMember: true, memberId: membership.memberId }
    });
    await sendMembershipEmail({ ...user, memberId: membership.memberId }, payuResponse);
  }
}

async function processWorkshopRegistration(txnid, payuResponse, user, subCategory) {
  const workshopNames = subCategory ? subCategory.split(',').map(s => s.trim()).filter(Boolean) : [];
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

async function updatePaymentFailure(txnid, payuResponse) {
  const type = payuResponse.udf2;
  const data = { paymentStatus: 'failure', payuId: payuResponse.mihpayid };
  
  if (type === 'sports') await prisma.sportRegistration.updateMany({ where: { transactionId: txnid }, data });
  else if (type === 'membership') await prisma.membership.updateMany({ where: { transactionId: txnid }, data });
  else await prisma.user.updateMany({ where: { transactionId: txnid }, data });
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
