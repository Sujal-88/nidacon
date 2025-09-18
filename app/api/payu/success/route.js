import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateUserId } from '@/lib/userId';
import { sendRegistrationEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const payuResponse = Object.fromEntries(formData.entries());

    console.log('--- PayU Success Response ---', payuResponse);

    const isValidHash = verifyPayUHash(payuResponse);

    if (!isValidHash) {
      console.error('HASH VERIFICATION FAILED!');
      return NextResponse.redirect(new URL(`/payment/failure?error=verification_failed&txnid=${payuResponse.txnid}`, request.url));
    }

    if (payuResponse.status === 'success') {
      console.log(`Payment successful for txnid: ${payuResponse.txnid}.`);

      const existingUser = await prisma.user.findUnique({
        where: { email: payuResponse.email },
      });

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
        console.log('User already exists, skipping user creation but sending email again.');
        await sendRegistrationEmail(existingUser, payuResponse);
      }
      
      const redirectUrl = new URL(`/payment/success?txnid=${payuResponse.txnid}`, request.url);
      return NextResponse.redirect(redirectUrl);

    } else {
      console.log(`Payment failed for txnid: ${payuResponse.txnid}.`);
      const redirectUrl = new URL(`/payment/failure?txnid=${payuResponse.txnid}&status=${payuResponse.status}`, request.url);
      return NextResponse.redirect(redirectUrl);
    }

  } catch (error) {
    console.error('--- FATAL ERROR in /api/payu/success ---:', error);
    const redirectUrl = new URL('/payment/failure?error=server_error', request.url);
    return NextResponse.redirect(redirectUrl);
  }
}

function verifyPayUHash(payuResponse) {
  const SALT = process.env.PAYU_MERCHANT_SALT?.trim();
  const key = process.env.PAYU_MERCHANT_KEY?.trim();

  if (!SALT || !key) {
    console.error('Missing PayU credentials');
    return false;
  }

  // Ensure amount formatting matches exactly
  const amount = parseFloat(payuResponse.amount || 0).toFixed(2);

  // Response hash format - REVERSE order with SALT first
  const hashStringParts = [
    SALT,
    payuResponse.status || '',
    '', '', '', '', '', '', '', '', '', '', // 10 empty strings for additional fields
    payuResponse.udf5 || '',
    payuResponse.udf4 || '',
    payuResponse.udf3 || '',
    payuResponse.udf2 || '',
    payuResponse.udf1 || '',
    payuResponse.email || '',
    payuResponse.firstname || '',
    payuResponse.productinfo || '',
    amount,
    payuResponse.txnid || '',
    key
  ];

  const hashString = hashStringParts.join('|');
  
  const calculatedHash = crypto
    .createHash('sha512')
    .update(hashString)
    .digest('hex')
    .toLowerCase();

  const receivedHash = (payuResponse.hash || '').toLowerCase();

  console.log('--- RESPONSE HASH DEBUG ---');
  console.log('Hash String Parts:', hashStringParts);
  console.log('Hash String:', hashString);
  console.log('Calculated Hash:', calculatedHash);
  console.log('Received Hash:', receivedHash);
  console.log('Hash Match:', calculatedHash === receivedHash);

  return calculatedHash === receivedHash;
}
