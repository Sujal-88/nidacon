import { Suspense } from 'react';
import PaymentStatus from '@components/PaymentStatus';

// This is now a clean Server Component.
// Its only job is to provide the structure and the Suspense boundary.
export default function PaymentSuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Payment Confirmation</h1>
        
        <Suspense fallback={<LoadingFallback />}>
          <PaymentStatus />
        </Suspense>

      </div>
    </div>
  );
}

// A simple fallback component to show while the client component is loading.
function LoadingFallback() {
  return (
    <div className="text-center p-8">
      <h1 className="text-2xl font-bold mb-4">Loading payment details...</h1>
      <p>Please wait.</p>
    </div>
  );
}
