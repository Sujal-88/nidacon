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
      return NextResponse.json({ error: 'PayU configuration missing' }, { status: 500 });
    }

    const isValidHash = verifyHash(payuResponse, merchantSalt);

    if (!isValidHash) {
      // Redirect to a failure page with an error message
      const redirectUrl = new URL('/payment/failure?error=Invalid+hash', request.url);
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

      // Redirect to the success page with a transaction ID for lookup
      const redirectUrl = new URL(`/payment/success?txnid=${payuResponse.txnid}`, request.url);
      return NextResponse.redirect(redirectUrl);
    } else {
      // Redirect to the failure page
      const redirectUrl = new URL(`/payment/failure?txnid=${payuResponse.txnid}&error=${encodeURIComponent(payuResponse.error_Message || 'Payment Failed')}`, request.url);
      return NextResponse.redirect(redirectUrl);
    }

  } catch (error) {
    console.error('Payment success error:', error);
    // Redirect to a generic error page
    const redirectUrl = new URL('/payment/failure?error=Internal+Server+Error', request.url);
    return NextResponse.redirect(redirectUrl);
  }
}