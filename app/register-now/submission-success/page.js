// app/register-now/submission-success/page.js

import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function SubmissionSuccessPage() {
  return (
    <main className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-6 py-24 sm:py-32">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Submission Successful!
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Thank you for your submission. We have received your details for the paper/poster presentation.
          </p>
          <div className="mt-10">
            <Link href="/">
              <span className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300">
                Back to Home
              </span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}