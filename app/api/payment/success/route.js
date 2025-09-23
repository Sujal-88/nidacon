import { NextResponse } from 'next/server';
import { verifyHash } from '@/lib/payu-utils';
import { prisma } from '@/lib/prisma';
import { generateUserId } from '@/lib/userId';
import { sendRegistrationEmail } from '@/lib/email';

export async function POST(request) {
  try {
    console.log("🚀 SUCCESS ROUTE: Request received.");
    const formData = await request.formData();
    const payuResponse = Object.fromEntries(formData);
    
    // Log all PayU response data for debugging
    console.log("📋 PayU Response Data:", {
      status: payuResponse.status,
      txnid: payuResponse.txnid,
      amount: payuResponse.amount,
      firstname: payuResponse.firstname,
      email: payuResponse.email,
      hash: payuResponse.hash ? `${payuResponse.hash.substring(0, 10)}...` : 'missing',
      mihpayid: payuResponse.mihpayid,
      key: payuResponse.key
    });

    const merchantSalt = process.env.PAYU_MERCHANT_SALT;
    if (!merchantSalt) {
      console.error("❌ FATAL: PayU salt is missing.");
      throw new Error('PayU salt is not configured');
    }

    // Verify hash first
    console.log("🔐 SUCCESS ROUTE: Verifying hash...");
    const isHashValid = verifyHash(payuResponse, merchantSalt);
    
    if (!isHashValid) {
      console.error("❌ Hash verification failed for transaction:", payuResponse.txnid);
      const failureUrl = new URL('/payment/failure', request.url);
      failureUrl.searchParams.set('txnid', payuResponse.txnid || 'N/A');
      failureUrl.searchParams.set('error', 'Security verification failed. Please contact support.');
      return NextResponse.redirect(failureUrl, { status: 303 });
    }
    
    console.log("✅ SUCCESS ROUTE: Hash verified successfully.");

    // Check payment status
    if (payuResponse.status === 'success') {
      console.log("💰 SUCCESS ROUTE: Payment successful. Creating user...");
      
      // Check if user already exists with this email or transaction ID
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: payuResponse.email },
            { userId: payuResponse.txnid } // if you're using txnid as userId
          ]
        }
      });

      if (existingUser) {
        console.log("⚠️ User already exists, redirecting to success...");
        const successUrl = new URL('/payment/success', request.url);
        successUrl.searchParams.set('txnid', payuResponse.txnid);
        successUrl.searchParams.set('existing', 'true');
        return NextResponse.redirect(successUrl, { status: 303 });
      }

      const userId = await generateUserId();
      console.log("🆔 SUCCESS ROUTE: User ID generated:", userId);

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
          // Store payment details for reference
          transactionId: payuResponse.txnid,
          payuId: payuResponse.mihpayid,
          paymentAmount: parseFloat(payuResponse.amount) || 0,
          paymentStatus: 'completed'
        }
      });
      
      console.log("✅ SUCCESS ROUTE: User created in DB:", newUser.email);

      // Send email asynchronously (don't wait for it to complete)
      sendRegistrationEmail(newUser, payuResponse)
        .then(() => console.log("📧 Email sent successfully"))
        .catch(err => console.error("📧 Email failed:", err));

      const successUrl = new URL('/payment/success', request.url);
      successUrl.searchParams.set('txnid', payuResponse.txnid);
      successUrl.searchParams.set('userId', newUser.userId);
      successUrl.searchParams.set('amount', payuResponse.amount);
      
      console.log("🎉 SUCCESS ROUTE: Redirecting to success page.");
      return NextResponse.redirect(successUrl, { status: 303 });
      
    } else {
      // Payment failed but hash was valid
      console.error("💸 Payment failed with status:", payuResponse.status);
      const failureUrl = new URL('/payment/failure', request.url);
      failureUrl.searchParams.set('txnid', payuResponse.txnid || 'N/A');
      failureUrl.searchParams.set('error', `Payment ${payuResponse.status}: ${payuResponse.error_Message || 'Unknown error'}`);
      return NextResponse.redirect(failureUrl, { status: 303 });
    }
    
  } catch (error) {
    console.error("💥 FATAL ERROR IN SUCCESS API ROUTE:");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    // Try to get transaction ID from the error context
    let txnid = 'unknown';
    try {
      const formData = await request.formData();
      const payuResponse = Object.fromEntries(formData);
      txnid = payuResponse.txnid || 'unknown';
    } catch (e) {
      console.error("Could not extract transaction ID from error context");
    }

    const errorUrl = new URL('/payment/failure', request.url);
    errorUrl.searchParams.set('txnid', txnid);
    errorUrl.searchParams.set('error', 'Technical error occurred. Please contact support if amount was debited.');
    return NextResponse.redirect(errorUrl, { status: 303 });
  }
}