// // app/api/payment/success/route.js

// import { NextResponse } from 'next/server';
// import { verifyHash } from '@/lib/payu-utils';
// import { prisma } from '@/lib/prisma';
// import { generateUserId } from '@/lib/userId';
// import { sendRegistrationEmail, sendSportsRegistrationEmail } from '@/lib/email';

// export async function POST(request) {
//   try {
//     const formData = await request.formData();
//     const payuResponse = Object.fromEntries(formData);
//     const txnid = payuResponse.txnid || 'unknown';

//     const merchantSalt = process.env.PAYU_MERCHANT_SALT;
//     if (!merchantSalt) {
//       throw new Error('PayU salt is not configured');
//     }

//     if (!verifyHash(payuResponse, merchantSalt)) {
//       console.error("Hash verification failed for txnid:", txnid);
//       const failureUrl = new URL('/payment/failure', request.url);
//       failureUrl.searchParams.set('txnid', txnid);
//       failureUrl.searchParams.set('error', 'Security hash mismatch on response.');
//       return NextResponse.redirect(failureUrl, { status: 303 });
//     }

//     if (payuResponse.status === 'success') {
//       const registrationType = payuResponse.udf2;
//       const successUrl = new URL('/payment/success', request.url);
//       successUrl.searchParams.set('txnid', txnid);
//       successUrl.searchParams.set('registrationType', registrationType);

//       if (registrationType === 'sports') {
//         const sportRegistration = await prisma.sportRegistration.findUnique({ where: { transactionId: txnid } });
//         if (sportRegistration && sportRegistration.paymentStatus === 'pending') {
//           const userId = await generateUserId();
//           const updatedRegistration = await prisma.sportRegistration.update({
//             where: { transactionId: txnid },
//             data: {
//               paymentStatus: 'success',
//               payuId: payuResponse.mihpayid,
//               userId: userId,
//             },
//           });
//           await sendSportsRegistrationEmail(updatedRegistration, payuResponse);
//         }
//       } else {
//         // --- FIX STARTS HERE ---
//         let user = await prisma.user.findUnique({ where: { transactionId: txnid } });

//         // Scenario 1: User exists and is pending (e.g., from membership flow) -> Update them.
//         if (user && user.paymentStatus === 'pending') {
//           const userId = user.userId.startsWith('TEMP-') ? await generateUserId() : user.userId;
//           const updatedUser = await prisma.user.update({
//             where: { transactionId: txnid },
//             data: {
//               userId: userId,
//               paymentStatus: 'success',
//               payuId: payuResponse.mihpayid,
//             },
//           });
//           await sendRegistrationEmail(updatedUser, payuResponse);
//         }
//         // Scenario 2: User does NOT exist (e.g., from delegate/workshop flow) -> Create them.
//         else if (!user) {
//           const userId = await generateUserId();
//           const newUser = await prisma.user.create({
//             data: {
//               userId: userId,
//               name: payuResponse.firstname,
//               email: payuResponse.email,
//               mobile: payuResponse.phone,
//               address: payuResponse.udf1,
//               registrationType: payuResponse.udf2,
//               memberType: payuResponse.udf3,
//               subCategory: payuResponse.udf4,
//               transactionId: txnid,
//               paymentStatus: 'success',
//               payuId: payuResponse.mihpayid,
//               paymentAmount: parseFloat(payuResponse.amount),
//             },
//           });
//           await sendRegistrationEmail(newUser, payuResponse);
//         }
//         // Scenario 3: User exists and is already processed (duplicate webhook) -> Do nothing.
//         else {
//             console.log(`Transaction ${txnid} already processed for user ${user.email}. Ignoring duplicate.`);
//         }
//         // --- FIX ENDS HERE ---
//       }
      
//       return NextResponse.redirect(successUrl, { status: 303 });

//     } else {
//       // Logic for failed payments remains the same
//       const failureUrl = new URL('/payment/failure', request.url);
//       failureUrl.searchParams.set('txnid', txnid);
//       failureUrl.searchParams.set('error', payuResponse.error_Message || `Payment status: ${payuResponse.status}`);
//       return NextResponse.redirect(failureUrl, { status: 303 });
//     }
//   } catch (error) {
//     console.error("Error in PayU success route:", error);
//     const errorUrl = new URL('/payment/failure', request.url);
//     errorUrl.searchParams.set('error', 'An internal server error occurred.');
//     return NextResponse.redirect(errorUrl, { status: 303 });
//   }
// }

// app/api/payment/success/route.js

import { NextResponse } from 'next/server';
import { verifyHash } from '@/lib/payu-utils';
import { prisma } from '@/lib/prisma';
import { generateUserId } from '@/lib/userId'; // For NIDAxxxx IDs
import { sendRegistrationEmail, sendSportsRegistrationEmail, sendMembershipEmail } from '@/lib/email';

export async function POST(request) {
  let txnid = 'unknown'; // Initialize txnid outside try block
  try {
    const formData = await request.formData();
    const payuResponse = Object.fromEntries(formData);
    txnid = payuResponse.txnid || 'unknown-txn'; // Assign txnid here

    console.log("Received PayU Success Response:", payuResponse); // Log entire response

    const merchantSalt = process.env.PAYU_MERCHANT_SALT;
    if (!merchantSalt) {
      throw new Error('PayU salt is not configured');
    }

    // Verify the hash FIRST
    if (!verifyHash(payuResponse, merchantSalt)) {
      console.error(`Hash verification failed for txnid: ${txnid}`);
      // Redirect to failure page, indicating hash mismatch
      const failureUrl = new URL('/payment/failure', request.url);
      failureUrl.searchParams.set('txnid', txnid);
      failureUrl.searchParams.set('error_Message', 'Response hash mismatch. Security check failed.'); // Use error_Message
      failureUrl.searchParams.set('status', 'failure'); // Set status explicitly
      return NextResponse.redirect(failureUrl, { status: 303 });
    }

    console.log(`Hash verified successfully for txnid: ${txnid}`);

    // Check PayU status
    if (payuResponse.status === 'success') {
      console.log(`Payment successful for txnid: ${txnid}`);

      const registrationType = payuResponse.udf2; // 'delegate', 'workshop-registered', 'membership', 'sports' etc.
      const memberType = payuResponse.udf3; // 'member', 'non-member' etc.
      const payuId = payuResponse.mihpayid;
      const amountPaid = parseFloat(payuResponse.amount);
      const photoUrl = payuResponse.udf6 || null;
      // Prepare success URL base
      const successUrl = new URL('/payment/success', request.url);
      successUrl.searchParams.set('txnid', txnid);
      successUrl.searchParams.set('registrationType', registrationType);

      // --- Handle SPORTS Registration ---
      if (registrationType === 'sports') {
        const sportRegistration = await prisma.sportRegistration.findUnique({ where: { transactionId: txnid } });

        if (sportRegistration && sportRegistration.paymentStatus === 'pending') {
          console.log(`Updating PENDING Sports Registration for txnid: ${txnid}`);
          // Generate specific Sports User ID (e.g., NIDASPORTZ-XXX) - Consider a separate counter/generator if needed
          const sportsUserId = `NIDASPORTZ-${txnid.slice(-4)}`; // Simple example ID
          const updatedRegistration = await prisma.sportRegistration.update({
            where: { transactionId: txnid },
            data: {
              paymentStatus: 'success',
              payuId: payuId,
              userId: sportsUserId, // Assign the sports-specific login ID
            },
          });
          console.log(`Sports Registration updated successfully for ${updatedRegistration.email}`);
          // Send sports-specific email
          await sendSportsRegistrationEmail(updatedRegistration, payuResponse);

        } else if (sportRegistration) {
           console.log(`Sports Registration for txnid: ${txnid} already processed. Status: ${sportRegistration.paymentStatus}. Ignoring duplicate webhook.`);
        } else {
            console.error(`CRITICAL: Sports registration record not found for successful txnid: ${txnid}`);
            // Don't redirect to success, maybe redirect to an error page or log extensively
             const errorUrl = new URL('/payment/failure', request.url);
             errorUrl.searchParams.set('txnid', txnid);
             errorUrl.searchParams.set('error_Message', 'Registration record not found after successful payment. Contact support.');
             errorUrl.searchParams.set('status', 'error');
             return NextResponse.redirect(errorUrl, { status: 303 });
        }

      }
      // --- Handle OTHER Registrations (Delegate, Workshop, Membership) ---
      else {
        
        // --- START OF FIX ---

        // Parse Add-ons first (you're already doing this, just move it up)
        let purchasedImplant = false;
        let purchasedBanquet = false;
        if (registrationType === 'delegate' && payuResponse.udf5) {
          const parts = payuResponse.udf5.split(',');
          parts.forEach(part => {
            const [key, value] = part.split(':');
            if (key === 'implant' && value === 'true') purchasedImplant = true;
            if (key === 'banquet' && value === 'true') purchasedBanquet = true;
          });
          console.log(`Parsed Addons for txnid ${txnid}: Implant=${purchasedImplant}, Banquet=${purchasedBanquet}`);
        }

        // Define the complete data payload for the user
        const userDataPayload = {
          name: payuResponse.firstname,
          mobile: payuResponse.phone,
          address: payuResponse.udf1,
          photoUrl: photoUrl, // This is udf6
          registrationType: registrationType,
          memberType: memberType,
          subCategory: payuResponse.udf4,
          transactionId: txnid, // Set or overwrite with the new successful transaction
          paymentStatus: 'success',
          payuId: payuId,
          paymentAmount: amountPaid,
          isMember: memberType === 'member',
          ...(registrationType === 'delegate' && {
            purchasedImplantAddon: purchasedImplant,
            purchasedBanquetAddon: purchasedBanquet,
          }),
        };

        // Check if user exists by email to determine their User ID
        let existingUser = await prisma.user.findUnique({
          where: { email: payuResponse.email }
        });

        let finalUserId;
        if (existingUser) {
          // User exists. Use their ID, or upgrade it from TEMP- if it was a pending membership.
          finalUserId = existingUser.userId.startsWith('TEMP-') ? await generateUserId() : existingUser.userId;
          console.log(`User found by email. Updating record for: ${payuResponse.email}, UserID: ${finalUserId}`);
        } else {
          // User does not exist. Generate a new permanent ID.
          finalUserId = await generateUserId();
          console.log(`New user. Creating record for: ${payuResponse.email}, UserID: ${finalUserId}`);
        }

        // Use Prisma's upsert to atomically create or update the user
        // This is the core of the fix: it finds by email, then updates or creates.
        const user = await prisma.user.upsert({
          where: {
            email: payuResponse.email, // Use email as the unique identifier
          },
          update: {
            ...userDataPayload,
            userId: finalUserId, // Ensure the correct userId is set
          },
          create: {
            ...userDataPayload,
            email: payuResponse.email, // Email is required on create
            userId: finalUserId,       // Assign the new ID
          }
        });

        console.log(`Database operation successful for ${user.email}, UserID: ${user.userId}`);
        
        // --- END OF FIX ---

        // Send the correct email based on what was just paid for
        if (registrationType === 'membership') {
          await sendMembershipEmail(user, payuResponse);
        } else {
          await sendRegistrationEmail(user, payuResponse);
        }
      }

      // Redirect to the final success page
      console.log(`Redirecting to success page for txnid: ${txnid}`);
      return NextResponse.redirect(successUrl, { status: 303 });

    } else {
      // Handle non-success statuses from PayU (failure, pending, etc.)
      console.log(`Payment status NOT 'success' for txnid: ${txnid}. Status: ${payuResponse.status}`);

      // Update DB record to reflect failure (if applicable)
       const registrationType = payuResponse.udf2;
       if (registrationType === 'sports') {
           await prisma.sportRegistration.updateMany({
               where: { transactionId: txnid, paymentStatus: 'pending' },
               data: { paymentStatus: 'failure', payuId: payuResponse.mihpayid },
           });
       } else {
            await prisma.user.updateMany({
               where: { transactionId: txnid, paymentStatus: 'pending' },
               data: { paymentStatus: 'failure', payuId: payuResponse.mihpayid },
           });
       }

      // Redirect to failure page
      const failureUrl = new URL('/payment/failure', request.url);
      failureUrl.searchParams.set('txnid', txnid);
      failureUrl.searchParams.set('error_Message', payuResponse.error_Message || `Payment status: ${payuResponse.status}`);
      failureUrl.searchParams.set('status', payuResponse.status || 'failure'); // Pass actual status if available
      return NextResponse.redirect(failureUrl, { status: 303 });
    }
  } catch (error) {
    console.error(`Critical Error in PayU success route for txnid: ${txnid}:`, error);
    // Redirect to a generic error/failure page
    const errorUrl = new URL('/payment/failure', request.url);
    errorUrl.searchParams.set('txnid', txnid); // Include txnid if possible
    errorUrl.searchParams.set('error_Message', 'An internal server error occurred while processing payment confirmation.');
    errorUrl.searchParams.set('status', 'error');
    return NextResponse.redirect(errorUrl, { status: 303 });
  }
}