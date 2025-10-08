// app/sports/login/page.js
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SportsLoginPage() {
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
            const response = await fetch('/api/auth/login/sports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, mobile }),
            });
            const data = await response.json();
            if (response.ok) {
                router.push('/sports/profile');
            } else {
                setError(data.error || 'Login failed.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="bg-gray-50 min-h-screen flex items-center justify-center">
            {/* Form JSX is similar to your other login pages */}
            <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-center">Sports Event Login</h1>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {/* Input for User ID */}
                    <div>
                        <label htmlFor="userId">User ID</label>
                        <input id="userId" type="text" value={userId} onChange={(e) => setUserId(e.target.value)} required className="mt-1 w-full p-3 border rounded-md" />
                    </div>
                    {/* Input for Mobile */}
                    <div>
                        <label htmlFor="mobile">Registered Mobile Number</label>
                        <input id="mobile" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} required className="mt-1 w-full p-3 border rounded-md" />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-purple-600 text-white rounded-md font-semibold disabled:opacity-50">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </main>
    );
}