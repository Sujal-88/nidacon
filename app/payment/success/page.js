// app/payment/success/page.js
'use client';

import { useEffect, useState, Suspense } from 'react'; // Ensure Suspense is here
import { useSearchParams } from 'next/navigation';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [transactionDetails, setTransactionDetails] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get all PayU response parameters
        const payuResponse = {};
        searchParams.forEach((value, key) => {
          payuResponse[key] = value;
        });

        // Verify the payment
        const response = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payuResponse),
        });

        const data = await response.json();

        if (data.success) {
          setVerificationStatus('success');
          setTransactionDetails(data);
        } else {
          setVerificationStatus('failed');
          setTransactionDetails(data);
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
      }
    };

    if (searchParams.get('txnid')) {
      verifyPayment();
    }
  }, [searchParams]);

  if (verificationStatus === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-green-600 mt-4">Payment Successful!</h1>
          <p className="text-gray-600 mt-2">Thank you for your payment.</p>
          
          {transactionDetails && (
            <div className="mt-6 text-left">
              <h3 className="text-lg font-semibold mb-2">Transaction Details:</h3>
              <div className="bg-gray-50 p-4 rounded">
                <p><strong>Transaction ID:</strong> {transactionDetails.transactionId}</p>
                <p><strong>PayU ID:</strong> {transactionDetails.payuId}</p>
                <p><strong>Amount:</strong> ₹{transactionDetails.amount}</p>
              </div>
            </div>
          )}

          <div className="mt-6 space-y-2">
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-red-600 mt-4">Payment Verification Failed</h1>
        <p className="text-gray-600 mt-2">There was an issue verifying your payment.</p>
        
        {transactionDetails && (
          <p className="text-red-600 mt-4">{transactionDetails.message || transactionDetails.error}</p>
        )}

        <div className="mt-6 space-y-2">
          <button 
            onClick={() => window.location.href = '/payment'}
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
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  )
}