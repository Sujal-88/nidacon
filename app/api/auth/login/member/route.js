// app/api/auth/login/member/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        const { memberId, mobile } = await request.json();

        if (!memberId || !mobile) {
            return NextResponse.json({ error: 'Member ID and mobile number are required.' }, { status: 400 });
        }

        // Querying based on the 'memberId' field
        const user = await prisma.user.findUnique({
            where: { memberId: memberId.trim() },
        });

        if (!user || user.mobile !== mobile.trim()) {
            return NextResponse.json({ error: 'Invalid credentials provided.' }, { status: 401 });
        }

        // Set a session cookie
        cookies().set('session', user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        return NextResponse.json({ message: 'Login successful' });

    } catch (error) {
        console.error('Member login error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}