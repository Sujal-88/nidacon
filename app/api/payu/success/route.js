// app/api/payu/success/route.js

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { generateUserId } from '@/lib/userId';
import { sendRegistrationEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(req) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const failureUrl = new URL('/payment/failure', baseUrl);

    try {
        const formData = await req.formData();
        const data = Object.fromEntries(formData);
        
        const salt = process.env.PAYU_MERCHANT_SALT.trim();
        const key = process.env.PAYU_MERCHANT_KEY.trim();
        const receivedHash = data.hash;

        // --- THIS IS THE DEFINITIVE FIX ---
        // Dynamically create the hash string based on the received data,
        // which is more reliable than a hardcoded string.

        // The reverse hash formula is: salt|status|...reversed_other_params...|key
        const reverse_params = [
            'udf10', 'udf9', 'udf8', 'udf7', 'udf6', 'udf5', 'udf4', 'udf3', 'udf2', 'udf1',
            'email', 'firstname', 'productinfo', 'amount', 'txnid'
        ];

        let hashString = `${salt}|${data.status}`;

        for (const param of reverse_params) {
            hashString += `|${data[param] || ''}`;
        }
        
        hashString += `|${key}`;
        
        const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');

        if (calculatedHash !== receivedHash || data.status !== 'success') {
            console.error("--- HASH MISMATCH OR PAYMENT FAILED ---");
            console.log("String Used for Verification:", hashString);
            console.log("Calculated Hash:", calculatedHash);
            console.log("Received Hash:  ", receivedHash);
            failureUrl.searchParams.set('error', 'verification_failed');
            return NextResponse.redirect(failureUrl);
        }

        // --- Database and Email Logic ---
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

        // --- Redirect to Final Success Page ---
        const successUrl = new URL(`/payment/success?txnid=${data.txnid}`, baseUrl);
        return NextResponse.redirect(successUrl);

    } catch (error) {
        console.error("--- UNHANDLED FATAL ERROR in /api/payu/success ---:", error);
        failureUrl.searchParams.set('error', 'server_error');
        return NextResponse.redirect(failureUrl);
    }
}