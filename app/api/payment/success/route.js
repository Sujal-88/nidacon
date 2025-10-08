// app/api/payment/success/route.js

import { NextResponse } from 'next/server';
import { verifyHash } from '@/lib/payu-utils';
import { prisma } from '@/lib/prisma';
import { generateUserId } from '@/lib/userId';
import { sendRegistrationEmail } from '@/lib/email';

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

      if (registrationType === 'sports') {
        const sportRegistration = await prisma.sportRegistration.findUnique({ where: { transactionId: txnid } });
        if (sportRegistration && sportRegistration.paymentStatus === 'pending') {
          await prisma.sportRegistration.update({
            where: { transactionId: txnid },
            data: { paymentStatus: 'success', payuId: payuResponse.mihpayid },
          });
        }
      } else {
        const user = await prisma.user.findUnique({ where: { transactionId: txnid } });
        if (user && user.paymentStatus === 'pending') {
          const userId = await generateUserId();
          const updatedUser = await prisma.user.update({
            where: { transactionId: txnid },
            data: {
              userId: userId,
              paymentStatus: 'success',
              payuId: payuResponse.mihpayid,
              isMember: true,
            },
          });
          await sendRegistrationEmail(updatedUser, payuResponse);
        }
      }
      
      const successUrl = new URL('/payment/success', request.url);
      successUrl.searchParams.set('txnid', txnid);
      return NextResponse.redirect(successUrl, { status: 303 });

    } else {
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