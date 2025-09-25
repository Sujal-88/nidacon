// app/login/event/page.js
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EventLoginPage() {
    const [userId, setUserId] = useState('');
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/login/event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, mobile }),
            });

            const data = await response.json();

            if (response.ok) {
                router.push('/profile'); // Redirect to profile page on success
            } else {
                setError(data.error || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="container mx-auto px-6 py-24 sm:py-32">
                <div className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                        NIDACON Event Login
                    </h1>
                    <p className="mt-4 text-gray-600">
                        Login with the User ID you received in your registration email.
                    </p>
                    <form onSubmit={handleSubmit} className="mt-8 text-left space-y-6">
                        <div>
                            <label htmlFor="userId" className="block text-sm font-medium text-gray-700">Event User ID</label>
                            <input
                                type="text"
                                id="userId"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                placeholder="e.g., NIDA101"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Registered Mobile Number</label>
                            <input
                                type="tel"
                                id="mobile"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                placeholder="Your 10-digit mobile number"
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                         <div className="text-center text-sm">
                            <p className="text-gray-600">
                                Not an event registrant? <Link href="/login/member" className="font-medium text-purple-600 hover:text-purple-500">Login as an IDA Member</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}