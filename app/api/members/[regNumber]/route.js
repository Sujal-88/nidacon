// app/api/members/[regNumber]/route.js

import { NextResponse } from 'next/server';
// You will need a utility function to connect to your database and query it.
// For example: import { getMemberByRegNumber } from '@/lib/db'; 

// This is a mock database for demonstration. Replace this with your actual database logic.
const MOCK_DB = [
    { regNumber: '12345', name: 'Dr. Anjali Sharma', email: 'anjali.s@example.com', mobile: '9876543210', msdcRegistration: 'MSDC-9876', address: '123 Ram Nagar, Nagpur' },
    { regNumber: '67890', name: 'Dr. Rohan Verma', email: 'rohan.v@example.com', mobile: '9123456780', msdcRegistration: 'MSDC-5432', address: '456 Sita Layout, Nagpur' },
];


export async function GET(request, { params }) {
    try {
        const { regNumber } = params;

        // --- Replace this mock logic with your actual database query ---
        // const member = await getMemberByRegNumber(regNumber); 
        const member = MOCK_DB.find(m => m.regNumber === regNumber);
        // ----------------------------------------------------------------

        if (!member) {
            return NextResponse.json({ error: 'Member with this registration number not found.' }, { status: 404 });
        }

        // Return the found member's data
        return NextResponse.json({
            name: member.name,
            email: member.email,
            mobile: member.mobile,
            msdcRegistration: member.msdcRegistration,
            address: member.address,
            number: member.regNumber, // Ensuring the registration number is also returned
        });

    } catch (error) {
        console.error('Failed to fetch member details:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}