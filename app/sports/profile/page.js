// app/sports/profile/page.js
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

async function getRegistration() {
    const sessionId = cookies().get('sports_session')?.value;
    if (!sessionId) return null;
    
    const registration = await prisma.sportRegistration.findUnique({
        where: { id: sessionId },
    });
    return registration;
}

export default async function SportsProfilePage() {
    const registration = await getRegistration();

    if (!registration) {
        redirect('/sports/login');
    }

    return (
        <main className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-6 py-24 sm:py-32">
                <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
                    <h1 className="text-3xl font-bold">Welcome, {registration.name}!</h1>
                    <p className="mt-4 text-gray-600">Here are your NIDASPORTZ 2025 registration details.</p>

                    <div className="mt-8 border-t pt-8 space-y-4">
                        <p><strong>User ID:</strong> {registration.userId}</p>
                        <p><strong>Selected Sports:</strong> {registration.selectedSports.join(', ')}</p>
                        <p><strong>T-Shirt Size:</strong> {registration.tshirtSize}</p>
                        <p><strong>Member Type:</strong> {registration.memberType}</p>
                        <p><strong>Total Price Paid:</strong> ₹{registration.totalPrice}</p>
                        <p><strong>Payment Status:</strong> <span className="font-semibold text-green-600">{registration.paymentStatus}</span></p>
                    </div>
                </div>
            </div>
        </main>
    );
}