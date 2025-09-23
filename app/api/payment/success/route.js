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

    // 1. Verify the hash
    const isHashValid = verifyHash(payuResponse, merchantSalt);
    if (!isHashValid) {
      console.error("Hash verification failed for txnid:", txnid);
      const failureUrl = new URL('/payment/failure', request.url);
      failureUrl.searchParams.set('txnid', txnid);
      failureUrl.searchParams.set('error', 'Security hash mismatch.');
      return NextResponse.redirect(failureUrl, { status: 303 });
    }

    // 2. Check payment status
    if (payuResponse.status === 'success') {
      // 3. Check if the transaction has already been processed
      const existingUser = await prisma.user.findUnique({
        where: { transactionId: txnid },
      });

      if (existingUser) {
        console.log("Transaction already processed for txnid:", txnid);
        const successUrl = new URL('/payment/success', request.url);
        successUrl.searchParams.set('txnid', txnid);
        return NextResponse.redirect(successUrl, { status: 303 });
      }

      // 4. Create new user and save payment details
      const userId = await generateUserId();
      const newUser = await prisma.user.create({
        data: {
          userId: userId,
          name: payuResponse.firstname,
          email: payuResponse.email,
          mobile: payuResponse.phone,
          address: payuResponse.udf1 || '',
          registrationType: payuResponse.udf2 || '',
          memberType: payuResponse.udf3 || '',
          subCategory: payuResponse.udf4 || '',
          transactionId: txnid,
          payuId: payuResponse.mihpayid, // This is the PayU payment ID
          paymentAmount: parseFloat(payuResponse.amount),
          paymentStatus: payuResponse.status,
        },
      });

      // 5. Send confirmation email
      await sendRegistrationEmail(newUser, payuResponse);

      // 6. Redirect to the client-side success page
      const successUrl = new URL('/payment/success', request.url);
      successUrl.searchParams.set('txnid', txnid);
      return NextResponse.redirect(successUrl, { status: 303 });

    } else {
      // Handle other statuses like 'failure' or 'pending'
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