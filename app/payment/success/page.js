// Option 1: Client-side Component (Recommended)
// app/payment/success/page.js
'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

function PaymentStatusComponent() {
  const searchParams = useSearchParams()
  const [paymentData, setPaymentData] = useState(null)
  
  useEffect(() => {
    // Safely get search parameters
    const status = searchParams.get('status')
    const transactionId = searchParams.get('transaction_id')
    const amount = searchParams.get('amount')
    
    setPaymentData({
      status: status || 'unknown',
      transactionId: transactionId || '',
      amount: amount || '0'
    })
  }, [searchParams])
  
  // Show loading state while data is being set
  if (!paymentData) {
    return <div className="loading">Loading payment status...</div>
  }
  
  const { status, transactionId, amount } = paymentData
  
  return (
    <div className="payment-success-container">
      <div className="payment-status">
        {status === 'success' ? (
          <div className="success-content">
            <h1>Payment Successful!</h1>
            <p>Transaction ID: {transactionId}</p>
            <p>Amount: ${amount}</p>
          </div>
        ) : status === 'failed' ? (
          <div className="failed-content">
            <h1>Payment Failed</h1>
            <p>Please try again or contact support.</p>
          </div>
        ) : (
          <div className="unknown-content">
            <h1>Payment Status Unknown</h1>
            <p>Please check your email for confirmation or contact support.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentStatusComponent />
    </Suspense>
  )
}

// Option 2: Server-side Component with Safe Parameter Handling
// app/payment/success/page.js (Alternative approach)
/*
export default function PaymentSuccessPage({ searchParams }) {
  // Safely destructure with default values
  const { 
    status = 'unknown', 
    transaction_id = '', 
    amount = '0' 
  } = searchParams || {}
  
  return (
    <div className="payment-success-container">
      <div className="payment-status">
        {status === 'success' ? (
          <div className="success-content">
            <h1>Payment Successful!</h1>
            <p>Transaction ID: {transaction_id}</p>
            <p>Amount: ${amount}</p>
          </div>
        ) : status === 'failed' ? (
          <div className="failed-content">
            <h1>Payment Failed</h1>
            <p>Please try again or contact support.</p>
          </div>
        ) : (
          <div className="unknown-content">
            <h1>Payment Status Unknown</h1>
            <p>Please check your email for confirmation or contact support.</p>
          </div>
        )}
      </div>
    </div>
  )
}
*/