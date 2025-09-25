// app/profile/page.js
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

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

export default async function ProfilePage() {
    const user = await getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <main className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-6 py-24 sm:py-32">
                <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                        Welcome, {user.name}!
                    </h1>
                    <p className="mt-4 text-gray-600">
                        Here are your registration details for NIDACON 2026.
                    </p>

                    <div className="mt-8 border-t pt-8">
                        <h2 className="text-2xl font-bold text-gray-800">Your Information</h2>
                        <div className="mt-4 space-y-4">
                            <p><strong>User ID:</strong> {user.userId}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Mobile:</strong> {user.mobile}</p>
                            <p><strong>Address:</strong> {user.address}</p>
                        </div>
                    </div>

                    <div className="mt-8 border-t pt-8">
                        <h2 className="text-2xl font-bold text-gray-800">Your Registrations</h2>
                        <div className="mt-4 space-y-4">
                            <p><strong>NIDACON Registration:</strong> {user.registrationType} ({user.memberType})</p>
                            {user.isMember && <p><strong>IDA Membership:</strong> Active</p>}
                            {user.workshops && user.workshops.length > 0 && (
                                <div>
                                    <strong>Workshops:</strong>
                                    <ul>
                                        {user.workshops.map(ws => <li key={ws}>- {ws}</li>)}
                                    </ul>
                                </div>
                            )}
                            {user.hasPaperOrPoster && <p><strong>Paper/Poster Submission:</strong> Submitted</p>}
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}