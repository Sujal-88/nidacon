import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const { name, email, mobile, address, registrationType, memberType, subCategory, amount, productinfo, txnid } = await req.json();

    const key = process.env.PAYU_MERCHANT_KEY?.trim();
    const salt = process.env.PAYU_MERCHANT_SALT?.trim();

    if (!key || !salt) {
      console.error("CRITICAL: PayU KEY or SALT is not defined in the .env file.");
      return NextResponse.json({ message: "Server configuration error." }, { status: 500 });
    }

    // Ensure amount is properly formatted
    const amountString = parseFloat(amount).toFixed(2);

    // Clean and prepare UDF fields
    const sanitizedAddress = (address || '').replace(/(\r\n|\n|\r)/gm, " ").replace(/\|/g, "").trim();
    const udf1 = sanitizedAddress;
    const udf2 = (registrationType || '').replace(/\|/g, "");
    const udf3 = (memberType || '').replace(/\|/g, "");
    const udf4 = (subCategory || '').replace(/\|/g, "");
    const udf5 = '';

    // Clean other fields from pipe characters
    const cleanName = (name || '').replace(/\|/g, "");
    const cleanEmail = (email || '').replace(/\|/g, "");
    const cleanProductinfo = (productinfo || '').replace(/\|/g, "");

    // Request hash - EXACTLY as per PayU documentation
    const hashString = `${key}|${txnid}|${amountString}|${cleanProductinfo}|${cleanName}|${cleanEmail}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    console.log('--- REQUEST HASH DEBUG ---');
    console.log('Hash String:', hashString);
    console.log('Generated Hash:', hash);

    const payuData = {
      key,
      txnid,
      amount: amountString,
      productinfo: cleanProductinfo,
      firstname: cleanName,
      email: cleanEmail,
      phone: mobile,
      surl: `${process.env.NEXT_PUBLIC_BASE_URL}/payu/success`,
      furl: `${process.env.NEXT_PUBLIC_BASE_URL}/payu/failure`,
      hash,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
    };

    return NextResponse.json(payuData);

  } catch (error) {
    console.error('--- FATAL ERROR in /api/payu/initiate ---:', error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}