import { NextResponse } from 'next/server';
import { verifyHash } from '@/lib/payu-utils';
import { prisma } from '@/lib/prisma';
import { generateUserId } from '@/lib/userId';
import { sendRegistrationEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const payuResponse = Object.fromEntries(formData);

    if (!verifyHash(payuResponse, process.env.PAYU_MERCHANT_SALT)) {
      const url = new URL('/payment/failure', request.url);
      url.searchParams.set('error', 'Invalid Hash');
      return NextResponse.redirect(url, { status: 303 });
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

      await sendRegistrationEmail(newUser, payuResponse);
      
      const url = new URL('/payment/success', request.url);
      url.searchParams.set('txnid', payuResponse.txnid);
      return NextResponse.redirect(url, { status: 303 });
    } else {
      const url = new URL('/payment/failure', request.url);
      url.searchParams.set('error', payuResponse.error_Message || 'Payment Failed');
      return NextResponse.redirect(url, { status: 303 });
    }
  } catch (error) {
    console.error('Payment Success Route Error:', error);
    const url = new URL('/payment/failure', request.url);
    url.searchParams.set('error', 'Internal Server Error');
    return NextResponse.redirect(url, { status: 303 });
  }
}