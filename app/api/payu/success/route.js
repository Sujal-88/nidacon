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
        const key = process.env.PAYU_MERCHANT_KEY.trim();

        // --- Verification Logic (No changes needed here) ---
        const hashString = `${salt}|${data.status}||||||||||${data.udf5 || ''}|${data.udf4 || ''}|${data.udf3 || ''}|${data.udf2 || ''}|${data.udf1 || ''}|${data.email}|${data.firstname}|${data.productinfo}|${data.amount}|${data.txnid}|${key}`;
        const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const successUrl = new URL(`/payment/success?txnid=${data.txnid}`, baseUrl);
        const failureUrl = new URL('/payment/failure', baseUrl);

        if (calculatedHash !== data.hash || data.status !== 'success') {
            failureUrl.searchParams.set('error', 'verification_failed');
            return NextResponse.redirect(failureUrl);
        }

        // --- THIS IS THE FIX ---
        // 1. Create the new user in the database
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

        // 2. Pass the NEWLY CREATED user object to the email function
        await sendRegistrationEmail(newUser, data);

        // 3. Redirect to the final success page
        return NextResponse.redirect(successUrl);

    } catch (error) {
        console.error("--- FATAL ERROR in /api/payu/success ---:", error);
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const errorUrl = new URL('/payment/failure?error=server_error', baseUrl);
        return NextResponse.redirect(errorUrl);
    }
}