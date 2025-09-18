import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateUserId } from '@/lib/userId';
import { sendRegistrationEmail } from '@/lib/email';

/**
 * Verifies the integrity of the PayU response hash.
 * This is a critical security measure to ensure the data has not been tampered with.
 * @param {object} payuResponse - The response object from PayU.
 * @returns {boolean} - True if the hash is valid, false otherwise.
 */
function verifyPayUHash(payuResponse) {
  const SALT = process.env.PAYU_MERCHANT_SALT?.trim();
  const key = process.env.PAYU_MERCHANT_KEY?.trim();

  if (!SALT || !key) {
    console.error('CRITICAL: Missing PayU credentials (SALT or KEY) in .env file.');
    return false;
  }

  // The amount must be formatted to two decimal places, matching the request.
  const amount = parseFloat(payuResponse.amount || 0).toFixed(2);

  // The hash string for the response must be in this exact reverse order, starting with the SALT.
  const hashStringParts = [
    SALT,
    payuResponse.status || '',
    '', '', '', '', '', '', '', '', '', '', // 10 empty placeholders for reserved fields
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
  const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex').toLowerCase();
  const receivedHash = (payuResponse.hash || '').toLowerCase();

  return calculatedHash === receivedHash;
}

export async function POST(request) {
  try {
    const payuResponse = await request.json();
    console.log('--- Verifying Payment ---', payuResponse);

    const isValidHash = verifyPayUHash(payuResponse);

    if (!isValidHash) {
      console.error('HASH VERIFICATION FAILED! The request may be fraudulent.');
      return NextResponse.json({ verified: false, message: "Hash verification failed. Invalid transaction." }, { status: 400 });
    }

    // --- HASH IS VALID, PROCEED WITH LOGIC ---

    if (payuResponse.status === 'success') {
      console.log(`Payment successful for txnid: ${payuResponse.txnid}.`);

      // Check if a user with this email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: payuResponse.email },
      });

      if (!existingUser) {
        // --- CREATE NEW USER ---
        console.log(`No existing user found for ${payuResponse.email}. Creating new user.`);
        const userId = await generateUserId(); // Generate the next sequential User ID

        const newUser = await prisma.user.create({
          data: {
            userId: userId,
            name: payuResponse.firstname,
            email: payuResponse.email,
            mobile: payuResponse.phone,
            address: payuResponse.udf1, // Mapped from User Defined Field 1
            registrationType: payuResponse.udf2, // Mapped from UDF2
            memberType: payuResponse.udf3, // Mapped from UDF3
            subCategory: payuResponse.udf4, // Mapped from UDF4
            // Add any other fields from your Prisma schema here
          },
        });
        
        // Send registration emails to the new user and the admin
        await sendRegistrationEmail(newUser, payuResponse);

      } else {
        // --- HANDLE EXISTING USER ---
        console.log(`User ${payuResponse.email} already exists. Skipping user creation.`);
        // You might want to update their record here or just send another confirmation.
        // Re-sending the email is a good way to confirm this new payment.
        await sendRegistrationEmail(existingUser, payuResponse);
      }
      
      return NextResponse.json({ verified: true, message: "Payment successful and verified." });

    } else {
      // --- HANDLE FAILED PAYMENT ---
      console.log(`Payment failed for txnid: ${payuResponse.txnid}. Status: ${payuResponse.status}`);
      return NextResponse.json({ verified: false, message: payuResponse.error_Message || "Payment failed or was cancelled." });
    }

  } catch (error) {
    console.error('--- FATAL ERROR in /api/payu/verify ---:', error);
    // Return a generic error to the client for security
    return NextResponse.json({ verified: false, message: "An internal server error occurred during verification." }, { status: 500 });
  }
}
