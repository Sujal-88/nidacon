import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateUserId } from '@/lib/userId';
import { sendRegistrationEmail } from '@/lib/email';

function verifyPayUHash(payuResponse) {
  const SALT = process.env.PAYU_MERCHANT_SALT?.trim();
  const key = process.env.PAYU_MERCHANT_KEY?.trim();

  if (!SALT || !key) {
    console.error('CRITICAL: Missing PayU credentials in .env file.');
    return false;
  }
  
  const amount = parseFloat(payuResponse.get('amount') || 0).toFixed(2);
  const status = payuResponse.get('status') || '';
  const udf5 = payuResponse.get('udf5') || '';
  const udf4 = payuResponse.get('udf4') || '';
  const udf3 = payuResponse.get('udf3') || '';
  const udf2 = payuResponse.get('udf2') || '';
  const udf1 = payuResponse.get('udf1') || '';
  const email = payuResponse.get('email') || '';
  const firstname = payuResponse.get('firstname') || '';
  const productinfo = payuResponse.get('productinfo') || '';
  const txnid = payuResponse.get('txnid') || '';
  
  const hashStringParts = [
    SALT, status, '', '', '', '', '', '', '', '', '', '',
    udf5, udf4, udf3, udf2, udf1, email, firstname, productinfo, amount, txnid, key
  ];

  const hashString = hashStringParts.join('|');
  const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex').toLowerCase();
  const receivedHash = (payuResponse.get('hash') || '').toLowerCase();

  console.log("--- HASH VERIFICATION ---");
  console.log("STRING USED:", hashString);
  console.log("CALCULATED HASH:", calculatedHash);
  console.log("RECEIVED HASH:", receivedHash);

  return calculatedHash === receivedHash;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const payuResponse = Object.fromEntries(formData.entries());

    console.log('--- Received PayU Callback ---', payuResponse);

    const isValidHash = verifyPayUHash(formData);

    if (!isValidHash) {
      console.error('HASH VERIFICATION FAILED!');
      const redirectUrl = new URL(`/payment-result?status=error&message=hash_failed`, request.url);
      return NextResponse.redirect(redirectUrl);
    }

    if (payuResponse.status === 'success') {
      console.log(`Payment successful for txnid: ${payuResponse.txnid}.`);

      const existingUser = await prisma.user.findUnique({ where: { email: payuResponse.email } });

      if (!existingUser) {
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
          },
        });
        await sendRegistrationEmail(newUser, payuResponse);
      } else {
        await sendRegistrationEmail(existingUser, payuResponse);
      }
      
      const redirectUrl = new URL(`/payment-result?status=success&txnid=${payuResponse.txnid}`, request.url);
      return NextResponse.redirect(redirectUrl);

    } else {
      console.log(`Payment failed for txnid: ${payuResponse.txnid}.`);
      const redirectUrl = new URL(`/payment-result?status=failure&txnid=${payuResponse.txnid}&error=${payuResponse.error_Message}`, request.url);
      return NextResponse.redirect(redirectUrl);
    }

  } catch (error) {
    console.error('--- FATAL ERROR in /api/payu/callback ---:', error);
    const redirectUrl = new URL('/payment-result?status=error&message=server_error', request.url);
    return NextResponse.redirect(redirectUrl);
  }
}
