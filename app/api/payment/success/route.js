// app/api/payment/success/route.js

import { NextResponse } from 'next/server';
import { verifyHash } from '@/lib/payu-utils';
import { prisma } from '@/lib/prisma';
import { generateUserId } from '@/lib/userId';
import { sendRegistrationEmail, sendSportsRegistrationEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const payuResponse = Object.fromEntries(formData);
    const txnid = payuResponse.txnid || 'unknown';

    const merchantSalt = process.env.PAYU_MERCHANT_SALT;
    if (!merchantSalt) {
      throw new Error('PayU salt is not configured');
    }

    if (!verifyHash(payuResponse, merchantSalt)) {
      console.error("Hash verification failed for txnid:", txnid);
      const failureUrl = new URL('/payment/failure', request.url);
      failureUrl.searchParams.set('txnid', txnid);
      failureUrl.searchParams.set('error', 'Security hash mismatch on response.');
      return NextResponse.redirect(failureUrl, { status: 303 });
    }

    if (payuResponse.status === 'success') {
      const registrationType = payuResponse.udf2;
      const successUrl = new URL('/payment/success', request.url);
      successUrl.searchParams.set('txnid', txnid);
      successUrl.searchParams.set('registrationType', registrationType);

      if (registrationType === 'sports') {
        const sportRegistration = await prisma.sportRegistration.findUnique({ where: { transactionId: txnid } });
        if (sportRegistration && sportRegistration.paymentStatus === 'pending') {
          const userId = await generateUserId();
          const updatedRegistration = await prisma.sportRegistration.update({
            where: { transactionId: txnid },
            data: {
              paymentStatus: 'success',
              payuId: payuResponse.mihpayid,
              userId: userId,
            },
          });
          await sendSportsRegistrationEmail(updatedRegistration, payuResponse);
        }
      } else {
        // --- FIX STARTS HERE ---
        let user = await prisma.user.findUnique({ where: { transactionId: txnid } });

        // Scenario 1: User exists and is pending (e.g., from membership flow) -> Update them.
        if (user && user.paymentStatus === 'pending') {
          const userId = user.userId.startsWith('TEMP-') ? await generateUserId() : user.userId;
          const updatedUser = await prisma.user.update({
            where: { transactionId: txnid },
            data: {
              userId: userId,
              paymentStatus: 'success',
              payuId: payuResponse.mihpayid,
            },
          });
          await sendRegistrationEmail(updatedUser, payuResponse);
        }
        // Scenario 2: User does NOT exist (e.g., from delegate/workshop flow) -> Create them.
        else if (!user) {
          const userId = await generateUserId();
          const newUser = await prisma.user.create({
            data: {
              userId: userId,
              name: payuResponse.firstname,
              email: payuResponse.email,
              mobile: payuResponse.phone,
              address: payuResponse.udf1,
              registrationType: payuResponse.udf2,
              memberType: payuResponse.udf3,
              subCategory: payuResponse.udf4,
              transactionId: txnid,
              paymentStatus: 'success',
              payuId: payuResponse.mihpayid,
              paymentAmount: parseFloat(payuResponse.amount),
            },
          });
          await sendRegistrationEmail(newUser, payuResponse);
        }
        // Scenario 3: User exists and is already processed (duplicate webhook) -> Do nothing.
        else {
            console.log(`Transaction ${txnid} already processed for user ${user.email}. Ignoring duplicate.`);
        }
        // --- FIX ENDS HERE ---
      }
      
      return NextResponse.redirect(successUrl, { status: 303 });

    } else {
      // Logic for failed payments remains the same
      const failureUrl = new URL('/payment/failure', request.url);
      failureUrl.searchParams.set('txnid', txnid);
      failureUrl.searchParams.set('error', payuResponse.error_Message || `Payment status: ${payuResponse.status}`);
      return NextResponse.redirect(failureUrl, { status: 303 });
    }
  } catch (error) {
    console.error("Error in PayU success route:", error);
    const errorUrl = new URL('/payment/failure', request.url);
    errorUrl.searchParams.set('error', 'An internal server error occurred.');
    return NextResponse.redirect(errorUrl, { status: 303 });
  }
}