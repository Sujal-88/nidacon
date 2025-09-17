// src/app/api/payu/success/route.js

import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  try {
    const data = await req.formData();

    // Using your specified environment variable names
    const salt = process.env.PAYU_MERCHANT_SALT;
    const key = process.env.PAYU_MERCHANT_KEY;

    if (!salt || !key) {
      console.error("PayU Key or Salt is not defined in environment variables.");
      return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    }

    const status = data.get('status');
    const txnid = data.get('txnid');
    const amount = data.get('amount');
    const productinfo = data.get('productinfo');
    const firstname = data.get('firstname');
    const email = data.get('email');
    const receivedHash = data.get('hash');

    // IMPORTANT: Use (?? '') to ensure missing fields become empty strings, not "null"
    const udf1 = data.get('udf1') ?? '';
    const udf2 = data.get('udf2') ?? '';
    const udf3 = data.get('udf3') ?? '';
    const udf4 = data.get('udf4') ?? '';
    const udf5 = data.get('udf5') ?? '';

    // The required string format for response hash validation
    const hashString = `${salt}|${status}||||||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;

    const shasum = crypto.createHash('sha512');
    shasum.update(hashString);
    const ourHash = shasum.digest('hex');
    
    // --- For debugging in Vercel logs ---
    console.log("PayU Response Hash:", receivedHash);
    console.log("Our Calculated Hash:", ourHash);
    // ------------------------------------

    if (ourHash !== receivedHash) {
      // Hashes do not match, suspicious transaction
      return NextResponse.json({ message: "Invalid hash" }, { status: 400 });
    }

    // Hashes match, payment is verified
    if (status === 'success') {
      // TODO: Add your logic here to update your database.
      // e.g., Mark the order corresponding to 'txnid' as paid.

      // Redirect to a user-friendly success page
      const successUrl = new URL('/payment-success', req.nextUrl.origin);
      successUrl.searchParams.set('txnid', txnid);
      successUrl.searchParams.set('amount', amount);
      return NextResponse.redirect(successUrl);

    } else {
      // Payment failed
      const failureUrl = new URL('/payment-failure', req.nextUrl.origin);
      failureUrl.searchParams.set('txnid', txnid);
      failureUrl.searchParams.set('status', status);
      return NextResponse.redirect(failureUrl);
    }

  } catch (error) {
    console.error("Error processing PayU response:", error);
    return NextResponse.json({ message: "An internal server error occurred" }, { status: 500 });
  }
}