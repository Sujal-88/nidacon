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
// app/api/payment/success/route.js
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

  try {
    const formData = await request.formData();
    const payuResponse = Object.fromEntries(formData);
    txnid = payuResponse.txnid;
    const registrationType = payuResponse.udf2;
    const email = payuResponse.email;

    // 1. Verify Hash & Status (Existing Code...)
    const merchantSalt = process.env.PAYU_MERCHANT_SALT;
    if (!verifyHash(payuResponse, merchantSalt)) {
      return redirectWithFailure(request, txnid, 'Security hash mismatch');
    }
    if (payuResponse.status !== 'success') {
      return redirectWithFailure(request, txnid, payuResponse.error_Message || 'Payment Failed');
    }

    // --- 2. BRANCHED LOGIC BY TYPE ---

    // A. DELEGATE (Main User Table)
    if (registrationType === 'delegate') {
        // Find the pending user created in initiatePayment
        let user = await prisma.user.findUnique({ where: { transactionId: txnid } });
        
        if (user) {
            // Generate real ID if TEMP
            let finalUserId = user.userId;
            if (user.userId.startsWith('TEMP')) {
                finalUserId = await generateUserId();
            }

            // Update to Success
            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: {
                    paymentStatus: 'success',
                    payuId: payuResponse.mihpayid,
                    userId: finalUserId
                }
            });
            await sendRegistrationEmail(updatedUser, payuResponse);
        } else {
            console.error("Delegate record not found for txn:", txnid);
        }
    }

    // B. WORKSHOP (WorkshopRegistration Table)
    else if (registrationType && registrationType.startsWith('workshop')) {
        // Find the pending workshop record created in initiatePayment
        const workshopReg = await prisma.workshopRegistration.findFirst({
            where: { transactionId: txnid },
            include: { user: true } // Include user to get email/name
        });

        if (workshopReg) {
            await prisma.workshopRegistration.update({
                where: { id: workshopReg.id },
                data: {
                    paymentStatus: 'success',
                    payuId: payuResponse.mihpayid
                }
            });
            // Send email using the linked user
            await sendWorkshopEmail(workshopReg.user, payuResponse);
        } else {
             console.error("Workshop record not found for txn:", txnid);
        }
    }

    // C. SPORTS (SportRegistration Table)
    else if (registrationType === 'sports') {
        const sportReg = await prisma.sportRegistration.findUnique({ where: { transactionId: txnid } });
        if (sportReg) {
             const sportsUserId = `NIDASPORTZ-${String(Date.now()).slice(-6)}`;
             const updated = await prisma.sportRegistration.update({
                where: { id: sportReg.id },
                data: {
                    paymentStatus: 'success',
                    payuId: payuResponse.mihpayid,
                    userId: sportsUserId
                }
             });
             await sendSportsRegistrationEmail(updated, payuResponse);
        }
    }

    // D. MEMBERSHIP (Membership Table)
    else if (registrationType === 'membership') {
        const membership = await prisma.membership.findUnique({ where: { transactionId: txnid } });
        if(membership) {
            await prisma.membership.update({
                where: { id: membership.id },
                data: {
                    paymentStatus: 'success',
                    payuId: payuResponse.mihpayid,
                    amount: parseFloat(payuResponse.amount)
                }
            });
            // Link membership to User
            await prisma.user.update({
                where: { id: membership.userId },
                data: { isMember: true, memberId: membership.memberId }
            });
            // Fetch user for email
            const user = await prisma.user.findUnique({ where: { id: membership.userId }});
            await sendMembershipEmail({ ...user, memberId: membership.memberId }, payuResponse);
        }
    }

    return redirectToSuccess(request, txnid, registrationType);

  } catch (error) {
    console.error("Webhook Error:", error);
    return redirectWithFailure(request, txnid, 'Internal Server Error');
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
  return NextResponse.redirect(url, { status: 303 });
}
