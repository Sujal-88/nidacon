'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function PaymentResultPage({ searchParams }) {
  const { status, txnid, error, message } = searchParams;

  const isSuccess = status === 'success';
  const isFailure = status === 'failure';
  const isError = status === 'error';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-xl text-center">
        {isSuccess && (
          <>
            <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful! ✅</h1>
            <p className="text-gray-700">Thank you for your registration. A confirmation email has been sent to you.</p>
            <p className="text-gray-500 mt-2 text-sm">Transaction ID: {txnid}</p>
          </>
        )}

        {isFailure && (
          <>
            <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed ❌</h1>
            <p className="text-gray-700">Unfortunately, your payment could not be processed.</p>
            <p className="text-gray-600 mt-2">Reason: {error || 'Unknown reason'}</p>
            <p className="text-gray-500 mt-2 text-sm">Transaction ID: {txnid}</p>
          </>
        )}

        {isError && (
          <>
            <h1 className="text-3xl font-bold text-yellow-600 mb-4">An Error Occurred ⚠️</h1>
            <p className="text-gray-700">There was a technical issue processing your payment confirmation.</p>
            <p className="text-gray-600 mt-2">Details: {message === 'hash_failed' ? 'Transaction verification failed.' : 'Server error.'}</p>
            <p className="text-gray-700 mt-4">Please contact support with your transaction details.</p>
          </>
        )}
      </div>
    </div>
  );
}
