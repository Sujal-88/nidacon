// // app/api/payu/initiate/route.js

// import { NextResponse } from 'next/server';
// import crypto from 'crypto';

// export async function POST(req) {
//     try {
//         const { name, email, mobile, address, registrationType, memberType, subCategory, amount, txnid } = await req.json();

//         const key = process.env.PAYU_MERCHANT_KEY.trim();
//         const salt = process.env.PAYU_MERCHANT_SALT.trim();

//         if (!key || !salt) {
//             console.error("CRITICAL: PayU KEY or SALT is not defined in the .env file.");
//             return NextResponse.json({ message: "Server configuration error." }, { status: 500 });
//         }
        
//         const amountString = parseFloat(amount).toFixed(1);

//         // --- THIS IS THE FIX ---
//         // Sanitize the address to remove any newline characters from the textarea
//         const sanitizedAddress = (address || '').replace(/(\r\n|\n|\r)/gm, " ").trim();
//         const udf1 = sanitizedAddress;
//         const udf2 = registrationType || '';
//         const udf3 = memberType || '';
//         const udf4 = subCategory || '';
//         const udf5 = '';
//         const productinfo = 'NIDACON2026_REGISTRATION';

//         // The hash string must be in this exact order
//         // Formula: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
//         const hashString = `${key}|${txnid}|${amountString}|${productinfo}|${name}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;

//         const hash = crypto.createHash('sha512').update(hashString).digest('hex');

//         const payuData = {
//             key,
//             txnid,
//             amount: amountString,
//             productinfo,
//             firstname: name,
//             email,
//             phone: mobile,
//             surl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payu/success`,
//             furl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payu/failure`,
//             hash,
//             udf1, // Sending the sanitized address
//             udf2,
//             udf3,
//             udf4,
//             udf5,
//         };

//         return NextResponse.json(payuData);

//     } catch (error) {
//         console.error('--- FATAL ERROR in /api/payu/initiate ---:', error);
//         return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
//     }
// }
// src/app/api/payu/initiate/route.js (TEMPORARY TEST CODE)
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
    const salt = process.env.PAYU_MERCHANT_SALT;
    const key = process.env.PAYU_MERCHANT_KEY;

    // --- HARDCODED DUMMY TRANSACTION DATA ---
    const data = {
        txnid: 'DUMMYTXN' + Date.now(), // Unique dummy ID
        amount: '1.00',
        productinfo: 'TESTING',
        firstname: 'test',
        email: 'test@test.com',
        phone: '9999999999',
        surl: `${process.env.NEXT_PUBLIC_HOST}/api/payu/success`,
        furl: `${process.env.NEXT_PUBLIC_HOST}/api/payu/failure`,
        udf1: '',
        udf2: '',
        udf3: '',
        udf4: '',
        udf5: ''
    };
    // -----------------------------------------

    const hashString = `${key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|${data.udf1}|${data.udf2}|${data.udf3}|${data.udf4}|${data.udf5}|||||${salt}`;
    const shasum = crypto.createHash('sha512');
    shasum.update(hashString);
    const hash = shasum.digest('hex');

    return NextResponse.json({ ...data, hash });
}