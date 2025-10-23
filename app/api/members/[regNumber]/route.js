// app/api/members/[regNumber]/route.js

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
    try {
        const { regNumber } = params; // This should be 'regNumber' to match the filename

        if (!regNumber || typeof regNumber !== 'string') {
            return NextResponse.json({ error: 'Invalid Registration ID format.' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { userId: regNumber.trim() }, // Query by the correct parameter
        });

        if (!user) {
            // Return 404 specifically for 'not found'
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }

        // Return the necessary user data on success (200 OK is default)
        return NextResponse.json({
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            address: user.address,
            // Add any other relevant fields you might want to pre-fill
            // msdcRegistration: user.msdcRegistration || '', // Example
        });

    } catch (error) {
        console.error('Failed to fetch user details:', error);
        // Return 500 for generic server errors
        return NextResponse.json({ error: 'Internal Server Error while fetching details.' }, { status: 500 });
    }
}