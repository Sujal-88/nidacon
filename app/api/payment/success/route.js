// // app/api/payment/success/route.js

// import { NextResponse } from 'next/server';
// import { verifyHash } from '@/lib/payu-utils';
// import { prisma } from '@/lib/prisma';
// import { generateUserId } from '@/lib/userId';
// import { sendRegistrationEmail, sendSportsRegistrationEmail, sendMembershipEmail } from '@/lib/email';

// export async function POST(request) {
//   let txnid = 'unknown';
  
//   try {
//     const formData = await request.formData();
//     const payuResponse = Object.fromEntries(formData);
//     txnid = payuResponse.txnid || 'unknown-txn';

//     console.log("=== PayU Success Webhook Received ===");
//     console.log("Transaction ID:", txnid);
//     console.log("Status:", payuResponse.status);
//     console.log("Email:", payuResponse.email);
//     console.log("UDF2 (Type):", payuResponse.udf2);
//     console.log("Amount:", payuResponse.amount);

//     // Verify merchant salt is configured
//     const merchantSalt = process.env.PAYU_MERCHANT_SALT;
//     if (!merchantSalt) {
//       throw new Error('PayU salt is not configured');
//     }

//     // Verify hash FIRST
//     if (!verifyHash(payuResponse, merchantSalt)) {
//       console.error(`❌ Hash verification FAILED for txnid: ${txnid}`);
//       const failureUrl = new URL('/payment/failure', request.url);
//       failureUrl.searchParams.set('txnid', txnid);
//       failureUrl.searchParams.set('error_Message', 'Security hash mismatch. Please contact support.');
//       failureUrl.searchParams.set('status', 'failure');
//       return NextResponse.redirect(failureUrl, { status: 303 });
//     }

//     console.log(`✓ Hash verified successfully for txnid: ${txnid}`);

//     // Check if payment was successful
//     if (payuResponse.status !== 'success') {
//       console.log(`❌ Payment status NOT success: ${payuResponse.status}`);
      
//       // Update DB to reflect failure
//       const registrationType = payuResponse.udf2;
//       try {
//         if (registrationType === 'sports') {
//           await prisma.sportRegistration.updateMany({
//             where: { transactionId: txnid, paymentStatus: 'pending' },
//             data: { paymentStatus: 'failure', payuId: payuResponse.mihpayid },
//           });
//         } else {
//           await prisma.user.updateMany({
//             where: { transactionId: txnid, paymentStatus: 'pending' },
//             data: { paymentStatus: 'failure', payuId: payuResponse.mihpayid },
//           });
//         }
//       } catch (dbError) {
//         console.error("Error updating failure status:", dbError);
//       }

//       const failureUrl = new URL('/payment/failure', request.url);
//       failureUrl.searchParams.set('txnid', txnid);
//       failureUrl.searchParams.set('error_Message', payuResponse.error_Message || `Payment ${payuResponse.status}`);
//       failureUrl.searchParams.set('status', payuResponse.status || 'failure');
//       return NextResponse.redirect(failureUrl, { status: 303 });
//     }

//     // Payment is successful - proceed with processing
//     console.log(`✓ Payment SUCCESSFUL for txnid: ${txnid}`);

//     const registrationType = payuResponse.udf2;
//     const memberType = payuResponse.udf3;
//     const payuId = payuResponse.mihpayid;
//     const amountPaid = parseFloat(payuResponse.amount);
//     const photoUrl = payuResponse.udf6 || null;

//     // Parse Add-ons early (for delegate registrations)
//     let purchasedImplant = false;
//     let purchasedBanquet = false;
//     if (registrationType === 'delegate' && payuResponse.udf5) {
//       const parts = payuResponse.udf5.split(',');
//       parts.forEach(part => {
//         const [key, value] = part.split(':');
//         if (key === 'implant' && value === 'true') purchasedImplant = true;
//         if (key === 'banquet' && value === 'true') purchasedBanquet = true;
//       });
//       console.log(`Parsed Add-ons: Implant=${purchasedImplant}, Banquet=${purchasedBanquet}`);
//     }

//     // Prepare success URL
//     const successUrl = new URL('/payment/success', request.url);
//     successUrl.searchParams.set('txnid', txnid);
//     successUrl.searchParams.set('registrationType', registrationType);

//     // === HANDLE SPORTS REGISTRATION ===
//     if (registrationType === 'sports') {
//       console.log("Processing SPORTS registration...");
      
//       try {
//         const sportRegistration = await prisma.sportRegistration.findUnique({ 
//           where: { transactionId: txnid } 
//         });

//         if (!sportRegistration) {
//           console.error(`❌ CRITICAL: Sports registration not found for txnid: ${txnid}`);
//           const errorUrl = new URL('/payment/failure', request.url);
//           errorUrl.searchParams.set('txnid', txnid);
//           errorUrl.searchParams.set('error_Message', 'Registration record not found. Contact support.');
//           errorUrl.searchParams.set('status', 'error');
//           return NextResponse.redirect(errorUrl, { status: 303 });
//         }

//         if (sportRegistration.paymentStatus === 'success') {
//           console.log(`⚠️ Duplicate webhook: Sports registration already processed for ${sportRegistration.email}`);
//         } else if (sportRegistration.paymentStatus === 'pending') {
//           console.log(`Updating sports registration to SUCCESS...`);
//           const sportsUserId = `NIDASPORTZ-${String(Date.now()).slice(-6)}`;
          
//           const updatedRegistration = await prisma.sportRegistration.update({
//             where: { transactionId: txnid },
//             data: {
//               paymentStatus: 'success',
//               payuId: payuId,
//               userId: sportsUserId,
//             },
//           });
          
//           console.log(`✓ Sports registration updated: ${updatedRegistration.email}, UserID: ${sportsUserId}`);
//           await sendSportsRegistrationEmail(updatedRegistration, payuResponse);
//           console.log(`✓ Sports email sent to ${updatedRegistration.email}`);
//         }
//       } catch (dbError) {
//         console.error("❌ Database error in sports registration:", dbError);
//         throw dbError;
//       }

//       return NextResponse.redirect(successUrl, { status: 303 });
//     }

//     // === HANDLE OTHER REGISTRATIONS (Delegate, Workshop, Membership) ===
//     console.log(`Processing ${registrationType} registration...`);

//     try {
//       // STEP 1: Check if this EXACT transaction was already processed
//       const existingTransaction = await prisma.user.findUnique({
//         where: { transactionId: txnid }
//       });

//       if (existingTransaction) {
//         console.log(`⚠️ DUPLICATE webhook detected for txnid: ${txnid}`);
//         console.log(`   Existing user: ${existingTransaction.email}, Status: ${existingTransaction.paymentStatus}`);
        
//         // Resend email if it might have failed previously
//         try {
//           if (registrationType === 'membership') {
//             await sendMembershipEmail(existingTransaction, payuResponse);
//           } else {
//             await sendRegistrationEmail(existingTransaction, payuResponse);
//           }
//           console.log(`✓ Re-sent email to ${existingTransaction.email}`);
//         } catch (emailError) {
//           console.error("Email re-send failed:", emailError);
//         }
        
//         return NextResponse.redirect(successUrl, { status: 303 });
//       }

//       console.log("✓ New transaction - proceeding with user creation/update");

//       // STEP 2: Prepare complete user data payload
//       const userDataPayload = {
//         name: payuResponse.firstname,
//         mobile: payuResponse.phone,
//         address: payuResponse.udf1,
//         photoUrl: photoUrl,
//         registrationType: registrationType,
//         memberType: memberType,
//         subCategory: payuResponse.udf4,
//         transactionId: txnid,
//         paymentStatus: 'success',
//         payuId: payuId,
//         paymentAmount: amountPaid,
//         isMember: memberType === 'member',
//         ...(registrationType === 'delegate' && {
//           purchasedImplantAddon: purchasedImplant,
//           purchasedBanquetAddon: purchasedBanquet,
//         }),
//       };

//       // STEP 3: Check if user exists by EMAIL
//       const existingUser = await prisma.user.findUnique({
//         where: { email: payuResponse.email }
//       });

//       let finalUser;

//       if (existingUser) {
//         // User exists - UPDATE scenario (e.g., member buying delegate pass)
//         console.log(`User exists: ${payuResponse.email}, Current UserID: ${existingUser.userId}`);
        
//         // Determine final userId (upgrade from TEMP- if needed)
//         const finalUserId = existingUser.userId.startsWith('TEMP-') 
//           ? await generateUserId() 
//           : existingUser.userId;

//         console.log(`Updating existing user with new transaction...`);
        
//         finalUser = await prisma.user.update({
//           where: { email: payuResponse.email },
//           data: {
//             ...userDataPayload,
//             userId: finalUserId,
//           }
//         });

//         console.log(`✓ User UPDATED successfully: ${finalUser.email}, UserID: ${finalUser.userId}`);
        
//       } else {
//         // New user - CREATE scenario
//         console.log(`New user registration for: ${payuResponse.email}`);
        
//         const newUserId = await generateUserId();
//         console.log(`Generated new UserID: ${newUserId}`);

//         finalUser = await prisma.user.create({
//           data: {
//             ...userDataPayload,
//             email: payuResponse.email, // Critical: email must be included in create
//             userId: newUserId,
//           }
//         });

//         console.log(`✓ User CREATED successfully: ${finalUser.email}, UserID: ${finalUser.userId}`);
//       }

//       // STEP 4: Send appropriate email
//       console.log(`Sending ${registrationType} email to ${finalUser.email}...`);
      
//       if (registrationType === 'membership') {
//         await sendMembershipEmail(finalUser, payuResponse);
//       } else {
//         await sendRegistrationEmail(finalUser, payuResponse);
//       }
      
//       console.log(`✓ Email sent successfully to ${finalUser.email}`);

//     } catch (dbError) {
//       console.error("❌ Database operation FAILED:", dbError);
//       console.error("Error details:", {
//         name: dbError.name,
//         message: dbError.message,
//         code: dbError.code,
//       });
//       throw dbError; // Re-throw to be caught by outer try-catch
//     }

//     console.log(`✓ Processing complete for txnid: ${txnid}. Redirecting to success page.`);
//     return NextResponse.redirect(successUrl, { status: 303 });

//   } catch (error) {
//     console.error("=== CRITICAL ERROR in PayU Success Route ===");
//     console.error("Transaction ID:", txnid);
//     console.error("Error:", error);
//     console.error("Stack:", error.stack);
    
//     const errorUrl = new URL('/payment/failure', request.url);
//     errorUrl.searchParams.set('txnid', txnid);
//     errorUrl.searchParams.set('error_Message', 'Internal server error. Please contact support with transaction ID.');
//     errorUrl.searchParams.set('status', 'error');
//     return NextResponse.redirect(errorUrl, { status: 303 });
//   }
// }
// app/api/payment/success/route.js

//-------------------------222222222222222222222222222222222222222222222222222222222222222222222222222-------------------------

// import { NextResponse } from 'next/server';
// import { verifyHash } from '@/lib/payu-utils';
// import { prisma } from '@/lib/prisma';
// import { generateUserId } from '@/lib/userId'; // For NIDAxxxx IDs
// import { sendRegistrationEmail, sendSportsRegistrationEmail, sendMembershipEmail } from '@/lib/email';

// export async function POST(request) {
//   let txnid = 'unknown'; // Initialize txnid outside try block
//   try {
//     const formData = await request.formData();
//     const payuResponse = Object.fromEntries(formData);
//     txnid = payuResponse.txnid || 'unknown-txn'; // Assign txnid here

//     console.log("Received PayU Success Response:", payuResponse); // Log entire response

//     const merchantSalt = process.env.PAYU_MERCHANT_SALT;
//     if (!merchantSalt) {
//       throw new Error('PayU salt is not configured');
//     }

//     // Verify the hash FIRST
//     if (!verifyHash(payuResponse, merchantSalt)) {
//       console.error(`Hash verification failed for txnid: ${txnid}`);
//       // Redirect to failure page, indicating hash mismatch
//       const failureUrl = new URL('/payment/failure', request.url);
//       failureUrl.searchParams.set('txnid', txnid);
//       failureUrl.searchParams.set('error_Message', 'Response hash mismatch. Security check failed.'); // Use error_Message
//       failureUrl.searchParams.set('status', 'failure'); // Set status explicitly
//       return NextResponse.redirect(failureUrl, { status: 303 });
//     }

//     console.log(`Hash verified successfully for txnid: ${txnid}`);

//     // Check PayU status
//     if (payuResponse.status === 'success') {
//       console.log(`Payment successful for txnid: ${txnid}`);

//       const registrationType = payuResponse.udf2; // 'delegate', 'workshop-registered', 'membership', 'sports' etc.
//       const memberType = payuResponse.udf3; // 'member', 'non-member' etc.
//       const payuId = payuResponse.mihpayid;
//       const amountPaid = parseFloat(payuResponse.amount);
//       const photoUrl = payuResponse.udf6 || null;
//       // Prepare success URL base
//       const successUrl = new URL('/payment/success', request.url);
//       successUrl.searchParams.set('txnid', txnid);
//       successUrl.searchParams.set('registrationType', registrationType);

//       // --- Handle SPORTS Registration ---
//       if (registrationType === 'sports') {
//         const sportRegistration = await prisma.sportRegistration.findUnique({ where: { transactionId: txnid } });

//         if (sportRegistration && sportRegistration.paymentStatus === 'pending') {
//           console.log(`Updating PENDING Sports Registration for txnid: ${txnid}`);
//           // Generate specific Sports User ID (e.g., NIDASPORTZ-XXX) - Consider a separate counter/generator if needed
//           const sportsUserId = `NIDASPORTZ-${txnid.slice(-4)}`; // Simple example ID
//           const updatedRegistration = await prisma.sportRegistration.update({
//             where: { transactionId: txnid },
//             data: {
//               paymentStatus: 'success',
//               payuId: payuId,
//               userId: sportsUserId, // Assign the sports-specific login ID
//             },
//           });
//           console.log(`Sports Registration updated successfully for ${updatedRegistration.email}`);
//           // Send sports-specific email
//           await sendSportsRegistrationEmail(updatedRegistration, payuResponse);

//         } else if (sportRegistration) {
//            console.log(`Sports Registration for txnid: ${txnid} already processed. Status: ${sportRegistration.paymentStatus}. Ignoring duplicate webhook.`);
//         } else {
//             console.error(`CRITICAL: Sports registration record not found for successful txnid: ${txnid}`);
//             // Don't redirect to success, maybe redirect to an error page or log extensively
//              const errorUrl = new URL('/payment/failure', request.url);
//              errorUrl.searchParams.set('txnid', txnid);
//              errorUrl.searchParams.set('error_Message', 'Registration record not found after successful payment. Contact support.');
//              errorUrl.searchParams.set('status', 'error');
//              return NextResponse.redirect(errorUrl, { status: 303 });
//         }

//       }
//       // --- Handle OTHER Registrations (Delegate, Workshop, Membership) ---
//       else {
        
//         // --- START OF FIX ---

//         // Parse Add-ons first (you're already doing this, just move it up)
//         let purchasedImplant = false;
//         let purchasedBanquet = false;
//         if (registrationType === 'delegate' && payuResponse.udf5) {
//           const parts = payuResponse.udf5.split(',');
//           parts.forEach(part => {
//             const [key, value] = part.split(':');
//             if (key === 'implant' && value === 'true') purchasedImplant = true;
//             if (key === 'banquet' && value === 'true') purchasedBanquet = true;
//           });
//           console.log(`Parsed Addons for txnid ${txnid}: Implant=${purchasedImplant}, Banquet=${purchasedBanquet}`);
//         }

//         // Define the complete data payload for the user
//         const userDataPayload = {
//           name: payuResponse.firstname,
//           mobile: payuResponse.phone,
//           address: payuResponse.udf1,
//           photoUrl: photoUrl, // This is udf6
//           registrationType: registrationType,
//           memberType: memberType,
//           subCategory: payuResponse.udf4,
//           transactionId: txnid, // Set or overwrite with the new successful transaction
//           paymentStatus: 'success',
//           payuId: payuId,
//           paymentAmount: amountPaid,
//           isMember: memberType === 'member',
//           ...(registrationType === 'delegate' && {
//             purchasedImplantAddon: purchasedImplant,
//             purchasedBanquetAddon: purchasedBanquet,
//           }),
//         };

//         // CRITICAL FIX: Always search by transactionId first to prevent race conditions
//         // Check if this exact transaction was already processed
//         let existingTransaction = await prisma.user.findUnique({
//           where: { transactionId: txnid }
//         });

//         if (existingTransaction) {
//           // Transaction already processed - this is a duplicate webhook
//           console.log(`Duplicate webhook detected for txnid: ${txnid}. User: ${existingTransaction.email}. Skipping update.`);
//           const user = existingTransaction;
          
//           // Send email anyway (in case previous attempt failed)
//           if (registrationType === 'membership') {
//             await sendMembershipEmail(user, payuResponse);
//           } else {
//             await sendRegistrationEmail(user, payuResponse);
//           }
//         } else {
//           // NEW TRANSACTION - Check if user exists by email (for pending memberships)
//           let existingUser = await prisma.user.findUnique({
//             where: { email: payuResponse.email }
//           });

//           let finalUserId;
//           if (existingUser) {
//             // User exists (pending membership scenario). Use their ID, or upgrade from TEMP-
//             finalUserId = existingUser.userId.startsWith('TEMP-') ? await generateUserId() : existingUser.userId;
//             console.log(`Existing user found by email. Updating record for: ${payuResponse.email}, UserID: ${finalUserId}`);
            
//             // Update existing user with payment details
//             const user = await prisma.user.update({
//               where: { email: payuResponse.email },
//               data: {
//                 ...userDataPayload,
//                 userId: finalUserId,
//               }
//             });

//             console.log(`Database update successful for ${user.email}, UserID: ${user.userId}`);

//             // Send the correct email based on what was just paid for
//             if (registrationType === 'membership') {
//               await sendMembershipEmail(user, payuResponse);
//             } else {
//               await sendRegistrationEmail(user, payuResponse);
//             }
//           } else {
//             // NEW USER - Generate new ID and create record
//             finalUserId = await generateUserId();
//             console.log(`New user. Creating record for: ${payuResponse.email}, UserID: ${finalUserId}`);

//             const user = await prisma.user.create({
//               data: {
//                 ...userDataPayload,
//                 email: payuResponse.email,
//                 userId: finalUserId,
//               }
//             });

//             console.log(`Database create successful for ${user.email}, UserID: ${user.userId}`);

//             // Send the correct email based on what was just paid for
//             if (registrationType === 'membership') {
//               await sendMembershipEmail(user, payuResponse);
//             } else {
//               await sendRegistrationEmail(user, payuResponse);
//             }
//           }
//         }
        
//         // --- END OF FIX ---
//       }

//       // Redirect to the final success page
//       console.log(`Redirecting to success page for txnid: ${txnid}`);
//       return NextResponse.redirect(successUrl, { status: 303 });

//     } else {
//       // Handle non-success statuses from PayU (failure, pending, etc.)
//       console.log(`Payment status NOT 'success' for txnid: ${txnid}. Status: ${payuResponse.status}`);

//       // Update DB record to reflect failure (if applicable)
//        const registrationType = payuResponse.udf2;
//        if (registrationType === 'sports') {
//            await prisma.sportRegistration.updateMany({
//                where: { transactionId: txnid, paymentStatus: 'pending' },
//                data: { paymentStatus: 'failure', payuId: payuResponse.mihpayid },
//            });
//        } else {
//             await prisma.user.updateMany({
//                where: { transactionId: txnid, paymentStatus: 'pending' },
//                data: { paymentStatus: 'failure', payuId: payuResponse.mihpayid },
//            });
//        }

//       // Redirect to failure page
//       const failureUrl = new URL('/payment/failure', request.url);
//       failureUrl.searchParams.set('txnid', txnid);
//       failureUrl.searchParams.set('error_Message', payuResponse.error_Message || `Payment status: ${payuResponse.status}`);
//       failureUrl.searchParams.set('status', payuResponse.status || 'failure'); // Pass actual status if available
//       return NextResponse.redirect(failureUrl, { status: 303 });
//     }
//   } catch (error) {
//     console.error(`Critical Error in PayU success route for txnid: ${txnid}:`, error);
//     // Redirect to a generic error/failure page
//     const errorUrl = new URL('/payment/failure', request.url);
//     errorUrl.searchParams.set('txnid', txnid); // Include txnid if possible
//     errorUrl.searchParams.set('error_Message', 'An internal server error occurred while processing payment confirmation.');
//     errorUrl.searchParams.set('status', 'error');
//     return NextResponse.redirect(errorUrl, { status: 303 });
//   }
// }

//------------------333333333333333333333333333333333333333333333333333333333333333333333333333---------------------------
// app/api/payment/success/route.js

// app/api/payment/success/route.js
// app/api/payment/success/route.js
// app/api/payment/success/route.js
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
    txnid = payuResponse.txnid || 'unknown-txn';
    
    // Clean the email to prevent "Black Entry" duplicates
    const responseEmail = (payuResponse.email || '').trim();

    console.log("=== PayU Success Webhook ===");
    console.log(`Txn: ${txnid}`);
    console.log(`Type (UDF2): ${payuResponse.udf2}`);
    console.log(`Email: ${responseEmail}`);

    // 1. Verify Salt
    const merchantSalt = process.env.PAYU_MERCHANT_SALT;
    if (!merchantSalt) throw new Error('PayU salt is not configured');

    // 2. Verify Hash
    if (!verifyHash(payuResponse, merchantSalt)) {
      console.error(`❌ Hash verification FAILED for ${txnid}`);
      return redirectWithFailure(request, txnid, 'Security hash mismatch');
    }

    // 3. Handle Failure
    if (payuResponse.status !== 'success') {
      console.log(`❌ Payment status is ${payuResponse.status}`);
      return redirectWithFailure(request, txnid, payuResponse.error_Message || 'Payment Failed');
    }

    // --- PAYMENT SUCCESSFUL ---
    
    const registrationType = payuResponse.udf2; 
    // FIX 1: Flexible check for any workshop type ('workshop', 'workshop-registered', etc.)
    const isWorkshop = registrationType && registrationType.startsWith('workshop');

    const memberType = payuResponse.udf3;
    const payuId = payuResponse.mihpayid;
    const amountPaid = parseFloat(payuResponse.amount);
    const photoUrl = payuResponse.udf6 || null;
    const subCategoryData = payuResponse.udf4 || ''; // Workshop Names

    // Add-ons (Delegate only)
    let purchasedImplant = false;
    let purchasedBanquet = false;
    if (registrationType === 'delegate' && payuResponse.udf5) {
      purchasedImplant = payuResponse.udf5.includes('implant:true');
      purchasedBanquet = payuResponse.udf5.includes('banquet:true');
    }

    const successUrl = new URL('/payment/success', request.url);
    successUrl.searchParams.set('txnid', txnid);
    successUrl.searchParams.set('registrationType', registrationType);

    // === A. SPORTS REGISTRATION ===
    if (registrationType === 'sports') {
      const sportReg = await prisma.sportRegistration.findUnique({ where: { transactionId: txnid } });
      if (sportReg) {
        if (sportReg.paymentStatus === 'success') {
          console.log(`⚠️ Duplicate Sports Webhook. Already success.`);
        } else {
          const sportsUserId = `NIDASPORTZ-${String(Date.now()).slice(-6)}`;
          const updated = await prisma.sportRegistration.update({
            where: { transactionId: txnid },
            data: { paymentStatus: 'success', payuId: payuId, userId: sportsUserId },
          });
          await sendSportsRegistrationEmail(updated, payuResponse);
        }
      }
      return NextResponse.redirect(successUrl, { status: 303 });
    }

    // === B. MAIN USER (Membership / Delegate / Workshop) ===

    // 1. Check for Duplicate Success
    const existingTxnUser = await prisma.user.findUnique({ where: { transactionId: txnid } });

    if (existingTxnUser && existingTxnUser.paymentStatus === 'success') {
      console.log(`⚠️ DUPLICATE SUCCESS: Transaction ${txnid} already processed.`);
      return NextResponse.redirect(successUrl, { status: 303 });
    }

    // 2. Find User (CASE INSENSITIVE & TRIMMED FIX)
    // Using findFirst with mode: 'insensitive' to catch "user@test.com" even if input was "User@Test.com"
    let targetUser = existingTxnUser || await prisma.user.findFirst({
      where: { 
        email: { equals: responseEmail, mode: 'insensitive' } 
      }
    });

    // --- WORKSHOP MERGING LOGIC ---
    let finalWorkshopList = [];
    
    // Get existing workshops from DB
    if (targetUser && Array.isArray(targetUser.workshops)) {
      finalWorkshopList = [...targetUser.workshops];
    }

    // FIX 2: Use isWorkshop flag to correctly trigger merge logic
    if (isWorkshop) {
       if (subCategoryData) {
         const newWorkshops = subCategoryData.split(',').map(s => s.trim()).filter(s => s.length > 0);
         // Merge and remove duplicates
         finalWorkshopList = [...new Set([...finalWorkshopList, ...newWorkshops])];
         console.log(`✓ WORKSHOP UPDATE: Adding [${newWorkshops}] to [${targetUser?.email}]`);
       } else {
         console.warn("⚠️ Workshop payment received but NO workshop names found in udf4");
       }
    }

    // Prepare Data Payload
    const userDataPayload = {
      name: payuResponse.firstname,
      mobile: payuResponse.phone,
      address: payuResponse.udf1,
      photoUrl: photoUrl,
      
      // FIX 3: Do NOT overwrite registrationType if this is a workshop.
      // This preserves their 'delegate' status if they have it.
      ...(!isWorkshop ? { registrationType: registrationType } : {}),
      
      memberType: memberType,
      subCategory: subCategoryData, 
      workshops: finalWorkshopList, // Saves the MERGED list
      
      transactionId: txnid, 
      paymentStatus: 'success', 
      payuId: payuId,
      paymentAmount: amountPaid,
      
      ...(registrationType === 'membership' ? { isMember: true } : {}),
      ...(registrationType === 'delegate' ? { purchasedImplantAddon: purchasedImplant, purchasedBanquetAddon: purchasedBanquet } : {}),
    };

    let finalUser;

    if (targetUser) {
      console.log(`Updating existing user: ${targetUser.email}`);
      
      let newUserId = targetUser.userId;
      
      // Only upgrade ID if buying Delegate pass (Workshops do NOT change ID)
      if (registrationType === 'delegate' && targetUser.userId && targetUser.userId.startsWith('TEMP-')) {
         newUserId = await generateUserId();
      }

      finalUser = await prisma.user.update({
        where: { id: targetUser.id },
        data: {
          ...userDataPayload,
          userId: newUserId,
        }
      });
    } else {
      console.log(`Creating NEW user: ${responseEmail}`);
      
      let newUserId;
      if (registrationType === 'delegate') {
        newUserId = await generateUserId();
      } else {
        newUserId = `TEMP-${Date.now()}`;
      }

      finalUser = await prisma.user.create({
        data: {
          ...userDataPayload,
          email: responseEmail, // Use the trimmed email
          userId: newUserId,
        }
      });
    }

    // 3. Send Email
    console.log(`Sending email for type: ${registrationType}...`);
    try {
      if (registrationType === 'membership') {
        await sendMembershipEmail(finalUser, payuResponse);
      } else if (isWorkshop) { // FIX 4: Use isWorkshop flag for email check
        await sendWorkshopEmail(finalUser, payuResponse); 
      } else {
        await sendRegistrationEmail(finalUser, payuResponse);
      }
    } catch (e) {
      console.error("Email sending failed:", e);
    }

    return NextResponse.redirect(successUrl, { status: 303 });

  } catch (error) {
    console.error("CRITICAL SERVER ERROR:", error);
    return redirectWithFailure(request, txnid, 'Internal Server Error');
  }
}

function redirectWithFailure(request, txnid, message) {
  const url = new URL('/payment/failure', request.url);
  url.searchParams.set('txnid', txnid);
  url.searchParams.set('error_Message', message);
  url.searchParams.set('status', 'failure');
  return NextResponse.redirect(url, { status: 303 });
}