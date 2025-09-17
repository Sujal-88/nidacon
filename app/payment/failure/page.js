// app/payment/failure/page.js

"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { XCircle, ArrowRight } from 'lucide-react';

function FailureContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    const getErrorMessage = () => {
        switch (error) {
            case 'verification_failed':
                return 'The payment verification failed. Please contact support if the amount was debited.';
            case 'server_error':
                return 'An unexpected server error occurred. Please try again after some time.';
            default:
                return 'Your payment was either cancelled or failed. Please try again.';
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center border border-red-200">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900">Payment Failed</h1>
                <p className="mt-4 text-gray-600">
                    {getErrorMessage()}
                </p>
                <Link href="/register-now" passHref>
                    <button className="mt-8 w-full py-3 px-6 text-lg font-semibold text-white bg-purple-600 rounded-lg shadow-md transition-all duration-300 hover:bg-purple-700">
                        Try Again <ArrowRight className="inline w-5 h-5 ml-2" />
                    </button>
                </Link>
            </div>
        </div>
    );
}

// Wrap with Suspense
export default function FailurePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FailureContent />
        </Suspense>
    );
}