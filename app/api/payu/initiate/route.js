// app/api/payu/initiate/route.js
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const { name, email, mobile, address, registrationType, memberType, subCategory, amount, productinfo, txnid } = await req.json();

    const key = process.env.PAYU_MERCHANT_KEY.trim();
    const salt = process.env.PAYU_MERCHANT_SALT.trim();

    if (!key || !salt) {
      console.error("CRITICAL: PayU KEY or SALT is not defined in the .env file.");
      return NextResponse.json({ message: "Server configuration error." }, { status: 500 });
    }

    const amountString = parseFloat(amount).toFixed(1);

    const sanitizedAddress = (address || '').replace(/(\r\n|\n|\r)/gm, " ").trim();
    const udf1 = sanitizedAddress;
    const udf2 = registrationType || '';
    const udf3 = memberType || '';
    const udf4 = subCategory || '';
    const udf5 = '';

    // Request hash
    const hashString = `${key}|${txnid}|${amountString}|${productinfo}|${name}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    const payuData = {
      key,
      txnid,
      amount: amountString,
      productinfo,
      firstname: name,
      email,
      phone: mobile,
      surl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payu/success`,
      furl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payu/failure`,
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
