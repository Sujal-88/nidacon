// app/payment/success/page.js
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// A component to read the form data posted by PayU
function PostDataHandler({ onData }) {
  useEffect(() => {
    // This effect runs on the client after the component mounts.
    // We assume the form data is available in a way that can be processed.
    // In many modern setups, the server-side component would handle the POST
    // and pass data to the client component.
    // If PayU POSTs to this client page, we need a way to capture it.
    // This is complex. A better pattern is to have an API route handle the POST,
    // then redirect to this page with query params.
    
    // Let's assume for now we can simulate getting the data or it comes via query.
    // A robust solution might involve a server component for the page that
    // processes the POST and passes data to this client component.
    
    // Since reading POST body on client is not straightforward, let's adapt.
    // We'll rely on the idea that the form data might be accessible via other means,
    // or we adjust the flow slightly. Let's log what we can get.
    
    // This part of the code is tricky because a client-side page cannot directly
    // read the body of a POST request that loaded it. The standard way is:
    // 1. A serverless function (API route) receives the POST.
    // 2. It processes/verifies it.
    // 3. It redirects to a client-facing page with the result in the URL (query params).
    
    // Given your existing flow, let's just make a dummy call for demonstration.
    // In a real scenario, you'd need to solve the POST-to-client data transfer.
    // Let's assume you've solved this and have the `payuData`.
    
    // For now, let's just trigger a verification with dummy data to show the flow.
    // Replace this with actual data retrieval.
    const payuData = {}; // You need to populate this
    onData(payuData);
    
  }, [onData]);

  return null; // This component does not render anything
}


export default function PaymentSuccessPage() {
  const [status, setStatus] = useState('Verifying payment...');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // This is a workaround since we can't read POST body here.
    // We're assuming the data might be in searchParams for this example.
    // You MUST ensure PayU data is passed to this page.
    const payuResponse = Object.fromEntries(searchParams.entries());

    if (Object.keys(payuResponse).length > 0) {
      verifyPayment(payuResponse);
    } else {
        setStatus('Waiting for payment data...')
        // Here you could implement a fallback or show an error
    }
  }, [searchParams]);

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
        // Redirect to the final dashboard or order confirmation page
        setTimeout(() => {
          router.push(`/dashboard?txnid=${payuData.txnid}`);
        }, 3000);
      } else {
        setStatus('Payment verification failed. ❌');
        setError(result.message || 'An unknown error occurred.');
      }
    } catch (err) {
      setStatus('Payment verification failed. ❌');
      setError('Could not connect to the server for verification.');
    }
  };
  
  // NOTE: This component needs a way to receive the POST data from PayU.
  // One way is to have a server component wrapper for this page that
  // can read the request body and pass it as props.
  
  return (
    <div>
      <h1>Payment Status</h1>
      <p>{status}</p>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
}