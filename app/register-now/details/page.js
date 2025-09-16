// app/register-now/details/page.js

"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Data for the sub-category options
const subCategoryOptions = [
  { id: 'new-membership', label: 'Registration + New Membership' },
  { id: 'renewal-membership', label: 'Registration + Renewal of Membership' },
  { id: 'student-membership', label: 'Registration + Student Membership' },
  { id: 'non-member', label: 'Registration (for Non-Member)' },
  { id: 'life-member', label: 'Registration for Life Member' },
  { id: 'outside-nagpur', label: 'Registration for Member Outside Nagpur' },
];

function RegistrationDetails() {
  const searchParams = useSearchParams();
  const registrationType = searchParams.get('type') || 'delegate'; // Default to delegate

  const [memberType, setMemberType] = useState('');
  const [subCategory, setSubCategory] = useState('');

  // Capitalize the first letter for display
  const displayType = registrationType.charAt(0).toUpperCase() + registrationType.slice(1);

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 py-24 sm:py-32">
        <div className="max-w-2xl mx-auto">
          {/* Header and Progress */}
          <div className="text-center">
            <p className="text-base font-semibold text-purple-600">Step 2 of 3</p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
              Confirm Your Details
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              You've selected: <span className="font-bold text-purple-700">{displayType} Registration</span>.
              Now, please specify your membership status.
            </p>
          </div>
          
          <div className="mt-12 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            {/* Dropdown for Member Type */}
            <div>
              <label htmlFor="member-type" className="block text-sm font-medium text-gray-800">
                1. Are you an IDA RC Member?
              </label>
              <select
                id="member-type"
                name="member-type"
                value={memberType}
                onChange={(e) => setMemberType(e.target.value)}
                className="mt-2 block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="" disabled>-- Please Select --</option>
                <option value="rc-member">Yes, I am an RC-Member</option>
                <option value="without-rc-member">No, I am not an RC-Member</option>
              </select>
            </div>

            {/* Sub-Category Options (conditionally rendered) */}
            {memberType && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <fieldset>
                  <legend className="block text-sm font-medium text-gray-800">
                    2. Choose your registration category
                  </legend>
                  <div className="mt-4 space-y-4">
                    {subCategoryOptions.map((option) => (
                      <div key={option.id} className="flex items-center">
                        <input
                          id={option.id}
                          name="sub-category"
                          type="radio"
                          checked={subCategory === option.id}
                          onChange={() => setSubCategory(option.id)}
                          className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <label htmlFor={option.id} className="ml-3 block text-sm font-medium text-gray-700">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
            )}
            
            {/* Proceed Button */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <Link href={`/register-now/user-info?type=${registrationType}&memberType=${memberType}&subCategory=${subCategory}`} passHref>
                <button
                  type="button"
                  disabled={!subCategory} // Button is disabled until a sub-category is chosen
                  className="w-full py-4 px-6 text-lg font-semibold text-white bg-purple-600 rounded-lg shadow-md transition-all duration-300 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  Proceed to Payment
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Wrap the component in Suspense for useSearchParams
export default function RegistrationDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegistrationDetails />
    </Suspense>
  );
}