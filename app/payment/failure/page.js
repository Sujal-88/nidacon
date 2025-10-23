// app/payment/failure/page.js
'use client';

import { Suspense } from 'react'; // Corrected import
import { useSearchParams } from 'next/navigation';

function PaymentFailureContent() {
  const searchParams = useSearchParams();

  const txnid = searchParams.get('txnid');
  const error = searchParams.get('error_Message'); // Match the param name from API
  const status = searchParams.get('status');
  const registrationType = searchParams.get('registrationType'); // Get registration type

  // Determine the correct redirect path for 'Try Again'
  const tryAgainPath = registrationType === 'sports' ? '/sports' : '/register-now';

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        {/* ... (existing SVG, title, description) ... */}
         <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-red-600 mt-4">Payment Failed</h1>
        <p className="text-gray-600 mt-2">Your payment could not be processed.</p>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {txnid && (
          <div className="mt-6 text-left">
            <h3 className="text-lg font-semibold mb-2">Transaction Details:</h3>
            <div className="bg-gray-50 p-4 rounded">
              <p><strong>Transaction ID:</strong> {txnid}</p>
              {status && <p><strong>Status:</strong> {status}</p>}
            </div>
          </div>
        )}

        <div className="mt-6 space-y-2">
          {/* Use the dynamically determined path */}
          <button
            onClick={() => window.location.href = tryAgainPath}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
          >
            Back to Home
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <p>If you continue to face issues, please contact our support team.</p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailure() {
  return (
    // Use Suspense to wait for searchParams
    <Suspense fallback={<div>Loading payment status...</div>}>
      <PaymentFailureContent />
    </Suspense>
  );
}