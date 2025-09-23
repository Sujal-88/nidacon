import { NextResponse } from 'next/server';
import { verifyHash } from '@/lib/payu-utils';
import { prisma } from '@/lib/prisma';
import { generateUserId } from '@/lib/userId';
import { sendRegistrationEmail } from '@/lib/email';

export async function POST(request) {
  console.log("🚀 SUCCESS ROUTE: Starting...");
  
  let payuResponse = {};
  let txnid = 'unknown';
  
  try {
    // Parse form data with better error handling
    const formData = await request.formData();
    payuResponse = Object.fromEntries(formData);
    txnid = payuResponse.txnid || 'unknown';
    
    console.log("📋 PayU Response:", {
      status: payuResponse.status,
      txnid: payuResponse.txnid,
      amount: payuResponse.amount,
      email: payuResponse.email,
      hash_present: !!payuResponse.hash
    });

    // Check if we have required data
    if (!payuResponse.status || !payuResponse.hash) {
      throw new Error('Missing required PayU response data');
    }

    const merchantSalt = process.env.PAYU_MERCHANT_SALT;
    if (!merchantSalt) {
      throw new Error('PayU salt is not configured');
    }

    // Verify hash
    console.log("🔐 Verifying hash...");
    const isHashValid = verifyHash(payuResponse, merchantSalt);
    
    if (!isHashValid) {
      console.error("❌ Hash verification failed");
      const failureUrl = new URL('/payment/failure', request.url);
      failureUrl.searchParams.set('txnid', txnid);
      failureUrl.searchParams.set('error', 'Security verification failed');
      return NextResponse.redirect(failureUrl, { status: 303 });
    }

    if (payuResponse.status === 'success') {
      console.log("💰 Payment successful, creating user...");
      
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
        }
      });

      console.log("✅ User created:", newUser.email);

      // Send email asynchronously
      sendRegistrationEmail(newUser, payuResponse).catch(console.error);

      const successUrl = new URL('/payment/success', request.url);
      successUrl.searchParams.set('txnid', payuResponse.txnid);
      successUrl.searchParams.set('amount', payuResponse.amount);
      
      return NextResponse.redirect(successUrl, { status: 303 });
      
    } else {
      console.log("💸 Payment failed with status:", payuResponse.status);
      const failureUrl = new URL('/payment/failure', request.url);
      failureUrl.searchParams.set('txnid', txnid);
      failureUrl.searchParams.set('error', `Payment ${payuResponse.status}`);
      return NextResponse.redirect(failureUrl, { status: 303 });
    }
    
  } catch (error) {
    console.error("💥 SUCCESS ROUTE ERROR:");
    console.error("  Message:", error.message);
    console.error("  Stack:", error.stack);
    console.error("  PayU Response Keys:", Object.keys(payuResponse));

    const errorUrl = new URL('/payment/failure', request.url);
    errorUrl.searchParams.set('txnid', txnid);
    errorUrl.searchParams.set('error', `Server error: ${error.message}`);
    return NextResponse.redirect(errorUrl, { status: 303 });
  }
}