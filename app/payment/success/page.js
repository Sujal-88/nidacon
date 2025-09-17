'use client'; // For App Router

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const txnid = searchParams.get('txnid');
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (txnid) {
      // Fetch order details from your API
      fetchOrderDetails(txnid);
    }
  }, [txnid]);

  const fetchOrderDetails = async (transactionId) => {
    try {
      // Replace with your API endpoint
      const response = await fetch(`/api/orders/${transactionId}`);
      if (response.ok) {
        const data = await response.json();
        setOrderDetails(data);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="mb-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">Your payment has been processed successfully.</p>
        
        {txnid && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Transaction ID:</p>
            <p className="font-mono text-sm text-gray-900">{txnid}</p>
          </div>
        )}
        
        {orderDetails && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold mb-2">Order Details:</h3>
            <p className="text-sm">Amount: ₹{orderDetails.amount}</p>
            <p className="text-sm">Product: {orderDetails.productinfo}</p>
            <p className="text-sm">Date: {new Date(orderDetails.createdAt).toLocaleDateString()}</p>
          </div>
        )}
        
        <div className="space-y-3">
          <button
            onClick={() => window.location.href = '/orders'}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            View All Orders
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-200"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}