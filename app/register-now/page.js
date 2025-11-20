"use client"
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { UserCheck, Wrench, FileText, ArrowRight, AlertTriangle, Lock } from 'lucide-react'; // Added Lock icon
import Link from 'next/link';
import Image from 'next/image'; // Import Image
import MembershipPopup from '@/components/MembershipPopup'; // Import MembershipPopup

// Data for the registration cards
const registrationOptions = [
  {
    icon: <UserCheck className="w-10 h-10 text-purple-600" />,
    title: 'Delegate Registration',
    price: 'From ₹2000*',
    description: 'For all students, faculty, and practicing dentists attending the main conference.',
    features: [
      'Access to all keynote lectures',
      'Entry to the trade exhibition',
      'Conference lunch & high tea',
      'Delegate kit & certificate',
      '*Early bird pricing for Members. Add-ons available.',
    ],
    buttonText: 'Register as Delegate',
    href: '/register-now/details?type=delegate',
    popular: true,
    id: 'delegate' // Added id
  },
  {
    icon: <Wrench className="w-10 h-10 text-blue-600" />,
    title: 'Hands-on Workshop',
    price: '',
    description: 'Limited-seat workshops for practical, in-depth skill development. *Conference registration required.',
    features: [
      'Choose from specialized topics',
      'Direct interaction with experts',
      'All materials provided',
      'Separate participation certificate',
    ],
    buttonText: 'Enroll in Workshop',
    href: '/register-now/details?type=workshop',
    id: 'workshop' // Added id
  },
  {
    icon: <FileText className="w-10 h-10 text-teal-600" />,
    title: 'Paper/Poster Presenter',
    price: '',
    description: 'For students and faculty who wish to present their research at the conference.',
    features: [
      'Dedicated presentation slot',
      'Entry into "Best Paper" awards',
      'Abstract published in proceedings',
      'Includes delegate registration',
    ],
    buttonText: 'Register as Presenter',
    href: '/register-now/details?type=paper-poster',
    id: 'paper-poster' // Added id
  },
];

export default function RegisterPage() {
  // UPDATED: Renamed state for clarity
  const [isSpecialRegistrationOpen, setIsSpecialRegistrationOpen] = useState(false);

  useEffect(() => {
    // Check if the current date is on or after November 15th, 2025
    const openDate = new Date('2025-11-25T00:00:00');
    const currentDate = new Date();
    // SETTING TO TRUE FOR TESTING - REMOVE IN PRODUCTION
    // setIsSpecialRegistrationOpen(false); 
    
    // PRODUCTION LOGIC
    setIsSpecialRegistrationOpen(currentDate >= openDate);
  }, []);

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 py-24 sm:py-32">
        <div className="text-center max-w-3xl mx-auto">
          {/* ADDED: NIDACON Logo */}
          <Image
            src="/NIDACON/nida_logo.png"
            alt="NIDACON Logo"
            width={300}
            height={300}
            className="mx-auto mb-6"
          />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
            Join NIDACON 2026
          </h1>
          <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg inline-flex items-center gap-2 text-yellow-800">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Early Bird Registration ends 25th November! Prices will increase after this date.</span>
          </div>
          <p className="mt-6 text-lg text-gray-600 leading-8">
            Choose the registration category that best suits your participation. We look forward to welcoming you to Nagpur for an unforgettable experience of learning and collaboration.
          </p>
        </div>

        {/* Membership Popup Integration */}
        <div className="flex flex-col text-center text-red-600 font-bold justify-center mt-10 mb-8 px-4">
          {/* Added MembershipPopup here */}
          <MembershipPopup text='Become an IDA Nagpur Member / Renew Membership' textColor='black' />
          Even if you have a current membership, it is only valid until Dec 31st of this year. <br className="hidden sm:inline" />
          To get member benefits for NIDACON, please renew your membership for the next year.

        </div>

        {/* Registration Cards Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {registrationOptions.map((option) => {
            // UPDATED: Check for both workshop and paper-poster
            const isSpecialCard = option.id === 'paper-poster' || option.id === 'workshop';
            // UPDATED: Use new state variable for disability check
            const isDisabled = isSpecialCard && !isSpecialRegistrationOpen;

            return (
              <div
                key={option.title}
                className={`flex flex-col rounded-2xl shadow-lg border transition-all duration-300 ${isDisabled ? 'bg-gray-100 border-gray-300 opacity-70' : 'bg-white border-gray-200 hover:-translate-y-2'} ${option.popular && !isDisabled ? 'border-purple-300' : ''
                  }`}
              >
                <div className="p-8 flex-grow">
                  <div className={`inline-block p-3 ${isDisabled ? 'bg-gray-200' : 'bg-gray-100'} rounded-lg`}>
                    {React.cloneElement(option.icon, { className: isDisabled ? 'w-10 h-10 text-gray-400' : option.icon.props.className })}
                  </div>
                  <h3 className={`mt-6 text-2xl font-bold ${isDisabled ? 'text-gray-500' : 'text-gray-900'}`}>{option.title}</h3>
                  {option.price && <p className={`mt-2 text-3xl font-bold ${isDisabled ? 'text-gray-500' : 'text-gray-800'}`}>{option.price}</p>}
                  <p className={`mt-4 ${isDisabled ? 'text-gray-500' : 'text-gray-600'}`}>{option.description}</p>
                  <ul className={`mt-6 space-y-3 ${isDisabled ? 'text-gray-500' : 'text-gray-600'}`}>
                    {option.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <svg className={`w-5 h-5 ${isDisabled ? 'text-gray-400' : 'text-green-500'} shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {/* UPDATED: Show message for both special cards when disabled */}
                  {isSpecialCard && !isSpecialRegistrationOpen && (
                    <p className="mt-4 text-sm font-semibold text-orange-600">Opens on November 25th, 2025</p>
                  )}
                </div>
                <div className={`p-6 ${isDisabled ? 'bg-gray-200' : 'bg-gray-50'} rounded-b-2xl`}>
                  {isDisabled ? (
                    <button
                      disabled
                      className="flex items-center justify-center w-full px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md cursor-not-allowed"
                    >
                      <Lock className="w-5 h-5 mr-2" />
                      {option.buttonText}
                    </button>
                  ) : (
                    <Link href={option.href} passHref>
                      <span className="flex items-center justify-center w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300">
                        {option.buttonText}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}