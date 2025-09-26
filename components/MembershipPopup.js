// components/MembershipPopup.js
"use client";

import Link from 'next/link';
import Image from 'next/image';

// Import the updated CSS
import './membership-popup.css';

export default function MembershipPopup() {
  return (
    <Link href="/membership" legacyBehavior>
      <a className="cta-container group" aria-label="Become an IDA Nagpur Member">
        <div className="cta-gradient-bg"></div>
        
        {/* NEW: Static text is now a simple div. CSS will handle positioning. */}
        <div className="static-text">
          <span>Become an IDA Nagpur Member</span>
        </div>

        {/* The logo orb remains untouched */}
        <div className="logo-orb">
          <Image
            src={'/logo.png'}
            layout="fill"
            objectFit="contain"
            alt="IDA Nagpur Logo"
            className="p-2 transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>

        {/* Stardust elements are untouched */}
        <div className="stardust stardust-1"></div>
        <div className="stardust stardust-2"></div>
        <div className="stardust stardust-3"></div>
      </a>
    </Link>
  );
}