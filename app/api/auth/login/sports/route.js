// app/api/auth/login/sports/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        const { userId, mobile } = await request.json();

        if (!userId || !mobile) {
            return NextResponse.json({ error: 'User ID and mobile number are required.' }, { status: 400 });
        }

        const registration = await prisma.sportRegistration.findUnique({
            where: { userId: userId.trim() },
        });

        if (!registration || registration.mobile !== mobile.trim()) {
            return NextResponse.json({ error: 'Invalid credentials provided.' }, { status: 401 });
        }

        cookies().set('sports_session', registration.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        return NextResponse.json({ message: 'Login successful' });

    } catch (error) {
        console.error('Sports login error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}