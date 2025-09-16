// app/api/payu/success/route.js

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { generateUserId } from '@/lib/userId';
import { sendRegistrationEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const formData = await req.formData();
        const data = Object.fromEntries(formData);

        const salt = process.env.PAYU_MERCHANT_SALT.trim();
        const receivedHash = data.hash;

        // --- THIS IS THE NEW, MORE ROBUST VERIFICATION LOGIC ---
        // It dynamically builds the hash string from the PayU response.
        
        // This is the reverse hash formula required by PayU for verification.
        const hashString = `${salt}|${data.status}||||||||||${data.udf5 || ''}|${data.udf4 || ''}|${data.udf3 || ''}|${data.udf2 || ''}|${data.udf1 || ''}|${data.email}|${data.firstname}|${data.productinfo}|${data.amount}|${data.txnid}|${process.env.PAYU_MERCHANT_KEY.trim()}`;
        
        const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');
        
        if (calculatedHash !== receivedHash) {
            console.error("--- HASH MISMATCH ON SUCCESS ---");
            console.log("String Used for Verification:", hashString);
            console.log("Calculated Hash:", calculatedHash);
            console.log("Received Hash:  ", receivedHash);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/payment/failure?error=hash_mismatch`);
        }

        if (data.status !== 'success') {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/payment/failure?error=payment_failed`);
        }

        // --- Your database and email logic (no changes needed here) ---
        const userId = await generateUserId();
        const newUser = await prisma.user.create({
            data: {
                userId,
                name: data.firstname,
                email: data.email,
                mobile: data.phone,
                address: data.udf1 || '',
                registrationType: data.udf2 || '',
                memberType: data.udf3 || '',
                subCategory: data.udf4 || '',
            },
        });

        await sendRegistrationEmail(newUser, data);

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?txnid=${data.txnid}`);

    } catch (error) {
        console.error("--- FATAL ERROR in /api/payu/success ---:", error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/payment/failure?error=server_error`);
    }
}