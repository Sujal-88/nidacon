// app/register/page.js

import React from 'react';
import { UserCheck, Wrench, FileText, ArrowRight, AlertTriangle } from 'lucide-react'; // Added AlertTriangle
import Link from 'next/link';

// Data for the registration cards
const registrationOptions = [
  {
    icon: <UserCheck className="w-10 h-10 text-purple-600" />,
    title: 'Delegate Registration',
    // Updated price display
    price: 'From ₹2000*',
    description: 'For all students, faculty, and practicing dentists attending the main conference.',
    features: [
      'Access to all keynote lectures',
      'Entry to the trade exhibition',
      'Conference lunch & high tea',
      'Delegate kit & certificate',
      '*Early bird pricing for Members. Add-ons available.', // Added note
    ],
    buttonText: 'Register as Delegate',
    href: '/register-now/details?type=delegate',
    popular: true,
  },
  {
    icon: <Wrench className="w-10 h-10 text-blue-600" />,
    title: 'Hands-on Workshop',
    price: '', // Keep original or update if needed
    description: 'Limited-seat workshops for practical, in-depth skill development. *Conference registration required.',
    features: [
      'Choose from specialized topics',
      'Direct interaction with experts',
      'All materials provided',
      'Separate participation certificate',
    ],
    buttonText: 'Enroll in Workshop',
    href: '/register-now/details?type=workshop',
  },
  {
    icon: <FileText className="w-10 h-10 text-teal-600" />,
    title: 'Paper/Poster Presenter',
    price: '', // Keep original or update if needed
    description: 'For students and faculty who wish to present their research at the conference.',
    features: [
      'Dedicated presentation slot',
      'Entry into "Best Paper" awards',
      'Abstract published in proceedings',
      'Includes delegate registration',
    ],
    buttonText: 'Register as Presenter',
    href: '/register-now/details?type=paper-poster',
  },
];

export default function RegisterPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 py-24 sm:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
            Join NIDACON 2026
          </h1>
          {/* Early Bird Notice Added */}
          <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg inline-flex items-center gap-2 text-yellow-800">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Early Bird Registration ends 15th November! Prices will increase after this date.</span>
          </div>
          <p className="mt-6 text-lg text-gray-600 leading-8">
            Choose the registration category that best suits your participation. We look forward to welcoming you to Nagpur for an unforgettable experience of learning and collaboration.
          </p>
        </div>

        {/* Registration Cards Grid - No changes needed below this line in the grid structure */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {registrationOptions.map((option) => (
            <div
              key={option.title}
              className={`flex flex-col rounded-2xl shadow-lg border transition-transform duration-300 hover:-translate-y-2 ${
                option.popular ? 'bg-white border-purple-300' : 'bg-white border-gray-200'
              }`}
            >
              <div className="p-8 flex-grow">
                <div className="inline-block p-3 bg-gray-100 rounded-lg">
                  {option.icon}
                </div>
                <h3 className="mt-6 text-2xl font-bold text-gray-900">{option.title}</h3>
                <p className="mt-2 text-3xl font-bold text-gray-800">{option.price}</p>
                <p className="mt-4 text-gray-600">{option.description}</p>
                <ul className="mt-6 space-y-3 text-gray-600">
                  {option.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 bg-gray-50 rounded-b-2xl">
                <Link href={option.href}>
                  <span className="flex items-center justify-center w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300">
                    {option.buttonText}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}