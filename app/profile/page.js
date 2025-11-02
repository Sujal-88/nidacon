import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Image from 'next/image'; // <-- Import Image
import { User, Mail, Phone, Home, Ticket, BadgeCheck, FileText } from 'lucide-react'; // <-- Import icons

async function getUser() {
    const sessionId = cookies().get('session')?.value;
    if (!sessionId) {
        return null;
    }
    const user = await prisma.user.findUnique({
        where: { id: sessionId },
    });
    return user;
}

// Helper function for styling
const getStatusBadge = (status) => {
    if (status === 'success') {
        return 'bg-green-100 text-green-800';
    }
    return 'bg-yellow-100 text-yellow-800';
};

export default async function ProfilePage() {
    const user = await getUser();

    if (!user) {
        redirect('/login/event'); // Redirect to event login
    }

    return (
        <main className="bg-gray-50 min-h-screen py-24 sm:py-32">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
                    
                    {/* --- Profile Header --- */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md flex-shrink-0">
                            {user.photoUrl ? (
                                <Image
                                    src={user.photoUrl}
                                    alt="Profile Photo"
                                    fill
                                    className="object-cover"
                                    sizes="160px"
                                />
                            ) : (
                                <User className="w-full h-full text-gray-400 p-8" />
                            )}
                        </div>
                        <div className="text-center sm:text-left pt-2">
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                                Welcome, {user.name}!
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Here are your registration details for NIDACON 2026.
                            </p>
                            <div className="mt-4 flex items-center justify-center sm:justify-start gap-3">
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    <Ticket className="w-4 h-4" />
                                    {user.registrationType || 'N/A'}
                                </span>
                                <span className={`inline-flex items-center gap-2 px-3 py-1 ${getStatusBadge(user.paymentStatus)} rounded-full text-sm font-medium`}>
                                    <BadgeCheck className="w-4 h-4" />
                                    {user.paymentStatus === 'success' ? 'Paid' : 'Pending'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* --- Personal Information --- */}
                    <div className="mt-8 border-t pt-8">
                        <h2 className="text-2xl font-bold text-gray-800">Your Information</h2>
                        <div className="mt-4 space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Mail className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                <span className="text-gray-700">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                <span className="text-gray-700">{user.mobile || 'Not Provided'}</span>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <Home className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                                <span className="text-gray-700">{user.address || 'Not Provided'}</span>
                            </div>
                        </div>
                    </div>

                    {/* --- Registration Details --- */}
                    <div className="mt-8 border-t pt-8">
                        <h2 className="text-2xl font-bold text-gray-800">Your Registrations</h2>
                        <div className="mt-4 space-y-2">
                            {user.isMember && (
                                <p><strong>IDA Membership:</strong> Active (ID: {user.memberId || 'N/A'})</p>
                            )}
                            {user.workshops && user.workshops.length > 0 && (
                                <div>
                                    <strong className="block mb-1">Workshops:</strong>
                                    <ul className="list-disc list-inside pl-2 space-y-1">
                                        {user.workshops.map(ws => <li key={ws} className="text-gray-700">{ws}</li>)}
                                    </ul>
                                </div>
                            )}
                            {user.hasPaperOrPoster && (
                                <div className="flex items-center gap-2 text-green-700">
                                   <FileText className="w-5 h-5" />
                                   <strong>Paper/Poster Submission:</strong> Submitted
                                </div>
                            )}
                            {user.purchasedBanquetAddon && (
                                <p><strong>Add-on:</strong> Purchased Banquet Add-on</p>
                            )}
                             {user.purchasedImplantAddon && (
                                <p><strong>Add-on:</strong> Purchased Implant Add-on</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}