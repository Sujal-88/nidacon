import { NextResponse } from 'next/server';
import { verifyHash } from '@/lib/payu-utils';
import { prisma } from '@/lib/prisma';
import { generateUserId } from '@/lib/userId';
import { sendRegistrationEmail } from '@/lib/email';

export async function POST(request) {
  try {
    console.log("SUCCESS ROUTE: Request received.");
    const formData = await request.formData();
    const payuResponse = Object.fromEntries(formData);
    console.log("SUCCESS ROUTE: Form data parsed.");

    const merchantSalt = process.env.PAYU_MERCHANT_SALT;
    if (!merchantSalt) {
      console.error("FATAL: PayU salt is missing.");
      throw new Error('PayU salt is not configured');
    }

    console.log("SUCCESS ROUTE: Verifying hash...");
    if (!verifyHash(payuResponse, merchantSalt)) {
      console.error("Hash verification failed.");
      const failureUrl = new URL('/payment/failure', request.url);
      failureUrl.searchParams.set('error', 'Invalid Hash');
      return NextResponse.redirect(failureUrl, { status: 303 });
    }
    console.log("SUCCESS ROUTE: Hash verified successfully.");

    if (payuResponse.status === 'success') {
      console.log("SUCCESS ROUTE: Status is success. Connecting to DB and creating user...");
      
      const userId = await generateUserId();
      console.log("SUCCESS ROUTE: User ID generated:", userId);

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
      console.log("SUCCESS ROUTE: User created in DB:", newUser.email);

      await sendRegistrationEmail(newUser, payuResponse);
      console.log("SUCCESS ROUTE: Email process initiated.");

      const successUrl = new URL('/payment/success', request.url);
      successUrl.searchParams.set('txnid', payuResponse.txnid);
      console.log("SUCCESS ROUTE: Redirecting to success page.");
      return NextResponse.redirect(successUrl, { status: 303 });
    } else {
      const failureUrl = new URL('/payment/failure', request.url);
      failureUrl.searchParams.set('error', `Payment status: ${payuResponse.status}`);
      return NextResponse.redirect(failureUrl, { status: 303 });
    }
  } catch (error) {
    console.error("--- FATAL ERROR IN SUCCESS API ROUTE ---");
    console.error(error); // This will log the exact database or other error
    const errorUrl = new URL('/payment/failure', request.url);
    errorUrl.searchParams.set('error', 'Internal Server Error');
    return NextResponse.redirect(errorUrl, { status: 303 });
  }
}