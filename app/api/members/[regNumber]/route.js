import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
    try {
        const { regNumber } = await params;

        if (!regNumber || typeof regNumber !== 'string') {
            return NextResponse.json({ error: 'Invalid Registration ID format.' }, { status: 400 });
        }

        const idToSearch = regNumber.trim();

        const user = await prisma.user.findUnique({
            where: { userId: idToSearch },
            include: { 
                submissions: true // This fetches the array of submissions
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }

        // --- FIX STARTS HERE ---
        
        // 1. STRICT CHECK: Does the submissions array have any items?
        // This enforces "Only One Thing" regardless of whether it's a paper, poster, or typo.
        const hasSubmitted = user.submissions && user.submissions.length > 0;

        // 2. We still check specific types for displaying data if needed, 
        // but we rely on 'hasSubmitted' for the blocking logic.
        const existingPaper = user.submissions.find(s => s.type && s.type.toLowerCase() === 'paper');
        const existingPoster = user.submissions.find(s => s.type && s.type.toLowerCase() === 'poster');

        return NextResponse.json({
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            address: user.address,
            
            // Send the strict flag to the frontend
            hasSubmitted: hasSubmitted, 

            // Keep these if you need to show what they submitted
            paperUrl: existingPaper ? (existingPaper.fullPaperUrl || 'submitted') : null,
            posterUrl: existingPoster ? (existingPoster.posterUrl || 'submitted') : null,
        });
        // --- FIX ENDS HERE ---

    } catch (error) {
        console.error('Failed to fetch user details:', error);
        return NextResponse.json({ error: 'Internal Server Error while fetching details.' }, { status: 500 });
    }
}