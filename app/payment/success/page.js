// app/payment/success/page.js

"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight } from 'lucide-react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const transactionId = searchParams.get('txnid');

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center border border-green-200">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900">Payment Successful!</h1>
                <p className="mt-4 text-gray-600">
                    Thank you for your registration. Your payment has been processed successfully.
                    A confirmation email has been sent to your registered email address.
                </p>
                {transactionId && (
                    <div className="mt-6 text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
                        <p>Transaction ID: <span className="font-semibold text-gray-800">{transactionId}</span></p>
                    </div>
                )}
                <Link href="/" passHref>
                    <button className="mt-8 w-full py-3 px-6 text-lg font-semibold text-white bg-purple-600 rounded-lg shadow-md transition-all duration-300 hover:bg-purple-700">
                        Back to Home <ArrowRight className="inline w-5 h-5 ml-2" />
                    </button>
                </Link>
            </div>
        </div>
    );
}

// Wrap with Suspense because useSearchParams is a Client Component hook
export default function SuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}