import { useState } from 'react';

export default function PayUPayment({ paymentDetails }) {
  const [loading, setLoading] = useState(false);

  const initiatePayment = async () => {
    setLoading(true);
    
    try {
      // Generate unique transaction ID
      const txnid = `TXN${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
      
      const paymentData = {
        txnid: txnid,
        amount: paymentDetails.amount,
        productinfo: paymentDetails.productinfo || 'Product',
        firstname: paymentDetails.firstname,
        email: paymentDetails.email,
        phone: paymentDetails.phone,
        address1: paymentDetails.address1 || '',
        city: paymentDetails.city || '',
        state: paymentDetails.state || '',
        country: paymentDetails.country || 'India',
        zipcode: paymentDetails.zipcode || ''
      };

      const response = await fetch('/api/payu/initiate-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (response.ok) {
        // Create and submit the form to PayU
        submitPayUForm(result.paymentUrl, result.paymentParams);
      } else {
        throw new Error(result.message || 'Payment initiation failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment initiation failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const submitPayUForm = (paymentUrl, params) => {
    // Create a form dynamically and submit to PayU
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = paymentUrl;

    // Add all parameters as hidden inputs
    Object.keys(params).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = params[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="payment-container">
      <button 
        onClick={initiatePayment} 
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay ₹${paymentDetails.amount}`}
      </button>
    </div>
  );
}