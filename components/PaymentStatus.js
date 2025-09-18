'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function PaymentStatus() {
  const [status, setStatus] = useState('Processing your payment details...');
  const [error, setError] = useState('');
  const router = useRouter();
  
  // This hook can now be used safely because this is a Client Component.
  const searchParams = useSearchParams();

  useEffect(() => {
    // Convert searchParams to a plain object
    const payuResponse = Object.fromEntries(searchParams.entries());

    // Check if we have any parameters to process
    if (Object.keys(payuResponse).length > 0) {
      setStatus('Verifying your payment with the server...');
      verifyPayment(payuResponse);
    } else {
      // This can happen if the user navigates to the page directly
      setStatus('No payment data found.');
      setError('Please do not refresh this page. If you believe this is an error, contact support.');
    }
  }, [searchParams]); // Effect runs when searchParams are available

  const verifyPayment = async (payuData) => {
    try {
      const response = await fetch('/api/payu/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payuData),
      });

      const result = await response.json();

      if (response.ok && result.verified) {
        setStatus('Payment successful and verified! ✅');
        setError('');
        // Redirect to a final confirmation or dashboard page after a delay
        setTimeout(() => {
          // You can pass the transaction ID to the final page if needed
          router.push(`/registration-complete?txnid=${payuData.txnid}`);
        }, 3000);
      } else {
        setStatus('Payment verification failed. ❌');
        setError(result.message || 'An unknown error occurred during verification.');
      }
    } catch (err) {
      console.error("Verification API call failed:", err);
      setStatus('Payment verification failed. ❌');
      setError('Could not connect to the server for verification. Please check your internet connection and contact support.');
    }
  };
  
  return (
    <div className="text-center p-8">
      <h1 className="text-2xl font-bold mb-4">{status}</h1>
      {error && <p className="text-red-500 mt-2">Error: {error}</p>}
      {!error && status.includes('...') && (
        <div className="mt-4">
          <p>Please wait, do not close or refresh this page.</p>
        </div>
      )}
    </div>
  );
}
