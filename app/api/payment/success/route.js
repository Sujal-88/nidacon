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

    const merchantSalt = process.env.PAYU_MERCHANT_SALT;

    if (!merchantSalt) {
      throw new Error('PayU configuration missing');
    }

    const isValidHash = verifyHash(payuResponse, merchantSalt);

    if (!isValidHash) {
      const redirectUrl = new URL('/payment/failure', request.url);
      redirectUrl.searchParams.set('error', 'Invalid hash');
      return NextResponse.redirect(redirectUrl);
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

      const redirectUrl = new URL('/payment/success', request.url);
      redirectUrl.searchParams.set('txnid', payuResponse.txnid);
      return NextResponse.redirect(redirectUrl);
    } else {
      const redirectUrl = new URL('/payment/failure', request.url);
      redirectUrl.searchParams.set('txnid', payuResponse.txnid);
      redirectUrl.searchParams.set('error', payuResponse.error_Message || 'Payment Failed');
      return NextResponse.redirect(redirectUrl);
    }

  } catch (error) {
    console.error('Payment success error:', error);
    const redirectUrl = new URL('/payment/failure', request.url);
    redirectUrl.searchParams.set('error', 'Internal Server Error');
    return NextResponse.redirect(redirectUrl);
  }
}