import { NextResponse } from 'next/server';
import { verifyHash } from '@/lib/payu-utils';
import { prisma } from '@/lib/prisma';
import { generateUserId } from '@/lib/userId';
import { sendRegistrationEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const payuResponse = Object.fromEntries(formData);

    const merchantSalt = process.env.PAYU_MERCHANT_SALT;

    if (!merchantSalt) {
      throw new Error('PayU salt is not configured');
    }

    // Even on success, we must verify the hash to prevent tampering.
    if (!verifyHash(payuResponse, merchantSalt)) {
      const failureUrl = new URL('/payment/failure', request.url);
      failureUrl.searchParams.set('error', 'Hash Mismatch');
      return NextResponse.redirect(failureUrl);
    }

    if (payuResponse.status === 'success') {
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
        }
      });

      await sendRegistrationEmail(newUser, {
        txnid: payuResponse.txnid,
        amount: payuResponse.amount,
        status: payuResponse.status,
      });

      // Construct the final user-facing success URL and redirect.
      const successUrl = new URL('/payment/success', request.url);
      successUrl.searchParams.set('txnid', payuResponse.txnid);
      return NextResponse.redirect(successUrl);
    } else {
      // Handle cases where PayU might post a non-success status to the success URL.
      const failureUrl = new URL('/payment/failure', request.url);
      failureUrl.searchParams.set('txnid', payuResponse.txnid);
      failureUrl.searchParams.set('error', payuResponse.error_Message || 'Payment Failed');
      return NextResponse.redirect(failureUrl);
    }

  } catch (error) {
    console.error('Payment Success Route Error:', error);
    const errorUrl = new URL('/payment/failure', request.url);
    errorUrl.searchParams.set('error', 'An internal server error occurred.');
    return NextResponse.redirect(errorUrl);
  }
}