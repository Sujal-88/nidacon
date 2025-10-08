// app/sports/profile/page.js
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { User, Award, Tally3, DollarSign, CheckCircle, Shirt } from 'lucide-react';


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

    const sportIcons = {
        cricket: '/sports/cricket.png',
        badminton: '/sports/badminton.png',
        football: '/sports/football-svg.svg',
        pickleball: '/sports/pickleball.png',
        shooting: '/sports/shooting-svg.svg',
    }

    return (
        <main className="min-h-screen bg-gray-100 py-12 sm:py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-8">
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                                <User className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">{registration.name}</h1>
                                <p className="text-purple-200">NIDASPORTZ 2025</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm font-semibold text-gray-500">User ID</p>
                                <p className="text-lg font-bold text-gray-800">{registration.userId}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm font-semibold text-gray-500">Member Type</p>
                                <p className="text-lg font-bold text-gray-800 capitalize">{registration.memberType}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-2">Selected Sports</p>
                            <div className="flex flex-wrap gap-4">
                                {registration.selectedSports.map(sport => (
                                    <div key={sport} className="flex items-center bg-blue-50 text-blue-800 font-semibold px-4 py-2 rounded-full">
                                        <Image src={sportIcons[sport]} width={20} height={20} alt={sport} className="mr-2" />
                                        <span className="capitalize">{sport}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                                <Shirt className="w-6 h-6 text-gray-500 mr-3" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-500">T-Shirt Size</p>
                                    <p className="text-lg font-bold text-gray-800">{registration.tshirtSize}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                                <DollarSign className="w-6 h-6 text-gray-500 mr-3" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-500">Total Price Paid</p>
                                    <p className="text-lg font-bold text-gray-800">₹{registration.totalPrice}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-gray-500">Email</p>
                            <p className="text-lg font-bold text-gray-800">{registration.email}</p>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg flex items-center justify-center text-center">
                            <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                            <div>
                                <p className="text-sm font-semibold text-green-700">Payment Status</p>
                                <p className="text-lg font-bold text-green-800 capitalize">{registration.paymentStatus}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}