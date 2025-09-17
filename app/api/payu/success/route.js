// // src/app/api/payu/success/route.js

// import { NextResponse } from "next/server";
// import crypto from "crypto";

// export async function POST(req) {
//   try {
//     const data = await req.formData();
//     const salt = process.env.PAYU_MERCHANT_SALT;
//     const key = process.env.PAYU_MERCHANT_KEY;

//     // --- Logging for debugging ---
//     console.log("--- Received PayU Form Data ---");
//     for (const [key, value] of data.entries()) {
//       console.log(`${key}: ${value}`);
//     }
//     console.log("---------------------------------");

//     if (!salt || !key) {
//       console.error("PayU Key or Salt is not defined.");
//       return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
//     }

//     const status = data.get('status') ?? '';
//     const txnid = data.get('txnid') ?? '';
//     const amount = parseFloat(data.get('amount')).toFixed(2);
//     const productinfo = data.get('productinfo') ?? '';
//     const firstname = data.get('firstname') ?? '';
//     const email = data.get('email') ?? '';
//     const receivedHash = data.get('hash');
//     const udf1 = data.get('udf1') ?? '';
//     const udf2 = data.get('udf2') ?? '';
//     const udf3 = data.get('udf3') ?? '';
//     const udf4 = data.get('udf4') ?? '';
//     const udf5 = data.get('udf5') ?? '';

//     const hashString = `${salt}|${status}||||||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
    
//     // ** THE FIX IS HERE: Changed 'sha521' to 'sha512' **
//     const shasum = crypto.createHash('sha512');
//     shasum.update(hashString);
//     const ourHash = shasum.digest('hex');

//     console.log("--- HASH COMPARISON ---");
//     console.log("PayU Response Hash:", receivedHash);
//     console.log("Our Calculated Hash: ", ourHash);
//     console.log("Full String We Hashed:", hashString);
//     console.log("-----------------------");

//     if (ourHash !== receivedHash) {
//       return NextResponse.json({ 
//           message: "Invalid hash", 
//           weHashed: hashString,
//           ourHash: ourHash,
//           payuHash: receivedHash
//       }, { status: 400 });
//     }

//     // Hashes match, payment is verified!
//     if (status === 'success') {
//       const successUrl = new URL('/payment-success', req.nextUrl.origin);
//       successUrl.searchParams.set('txnid', txnid);
//       successUrl.searchParams.set('amount', amount);
//       return NextResponse.redirect(successUrl);
//     } else {
//       const failureUrl = new URL('/payment-failure', req.nextUrl.origin);
//       failureUrl.searchParams.set('txnid', txnid);
//       failureUrl.searchParams.set('status', status);
//       return NextResponse.redirect(failureUrl);
//     }

//   } catch (error) {
//     console.error("Error processing PayU response:", error);
//     return NextResponse.json({ message: "An internal server error occurred" }, { status: 500 });
//   }
// }
// src/app/api/payu/success/route.js (TEMPORARY TEST CODE)
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
    const dataFromPayu = await req.formData();
    const salt = process.env.PAYU_MERCHANT_SALT;
    const key = process.env.PAYU_MERCHANT_KEY;
    
    const status = dataFromPayu.get('status');
    const receivedHash = dataFromPayu.get('hash');
    const txnid = dataFromPayu.get('txnid'); // We need the txnid from PayU

    // --- RECREATE THE EXACT SAME DUMMY DATA ---
    // We ignore everything else from PayU and rebuild the hash from our original data.
    const originalData = {
        amount: '1.00',
        productinfo: 'TESTING',
        firstname: 'test',
        email: 'test@test.com',
        udf1: '',
        udf2: '',
        udf3: '',
        udf4: '',
        udf5: ''
    };
    // -----------------------------------------

    const hashString = `${salt}|${status}||||||||||${originalData.udf5}|${originalData.udf4}|${originalData.udf3}|${originalData.udf2}|${originalData.udf1}|${originalData.email}|${originalData.firstname}|${originalData.productinfo}|${originalData.amount}|${txnid}|${key}`;

    const shasum = crypto.createHash('sha512');
    shasum.update(hashString);
    const ourHash = shasum.digest('hex');
    
    console.log("--- FINAL TEST ---");
    console.log("Our Hash:", ourHash);
    console.log("PayU Hash:", receivedHash);
    console.log("String we hashed:", hashString);

    if (ourHash === receivedHash) {
        return NextResponse.json({ message: "SUCCESS! The keys are correct." });
    } else {
        return NextResponse.json({ message: "FAILURE. The keys are incorrect." });
    }
}