// app/payment/success/page.js
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const txnid = searchParams.get('txnid');
  const registrationType = searchParams.get('registrationType');

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-green-600 mt-4">Payment Successful!</h1>
        <p className="text-gray-600 mt-2">Thank you for your payment. Your registration is confirmed.</p>
        
        {txnid && (
          <div className="mt-6 text-left">
            <h3 className="text-lg font-semibold mb-2">Transaction Details:</h3>
            <div className="bg-gray-50 p-4 rounded">
              <p><strong>Transaction ID:</strong> {txnid}</p>
            </div>
          </div>
        )}

        <div className="mt-6">
            {registrationType === 'sports' ? (
                <Link href="/sports/login" className="w-full block bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700">
                    Go to Sports Login
                </Link>
            ) : (
                <Link href="/" className="w-full block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                    Back to Home
                </Link>
            )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}