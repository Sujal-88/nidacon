// app/api/members/[regNumber]/route.js

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
    try {
        const { regNumber } = params; // This should be 'regNumber' to match the filename

        const user = await prisma.user.findUnique({
            where: { userId: regNumber }, // Query by the correct parameter
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }

        // Return the necessary user data
        return NextResponse.json({
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            address: user.address,
        });

    } catch (error) {
        console.error('Failed to fetch user details:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}