// components/CtaButton.js
"use client";

import Link from 'next/link';
import Image from 'next/image';

// Import the new CSS for advanced animations
import './membership-popup.css';

export default function MembershipPopup() {
  return (
    <Link href="/membership" legacyBehavior>
      <a className="cta-container group" aria-label="Become an IDA Nagpur Member">
        <div className="cta-gradient-bg"></div>
        
        <div className="logo-orb">
          <Image
            src={'/logo.png'}
            layout="fill"
            objectFit="contain"
            alt="IDA Nagpur Logo"
            // CHANGE: Reduced padding from p-3 to p-2 to make the logo larger.
            // Added transition classes for a smooth inner zoom effect.
            className="p-2 transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>

        <div className="orbit-text">
          <svg viewBox="0 0 100 100"> 
            <defs>
              <path id="circle" d="M 50, 50 m -47, 0 a 47,47 0 1,1 94,0 a 47,47 0 1,1 -94,0"/>
            </defs>
            <text dy="3.5">
              <textPath xlinkHref="#circle" startOffset="25%">
                Become an IDA Nagpur Member •
              </textPath>
            </text>
          </svg>
        </div>

        <div className="stardust stardust-1"></div>
        <div className="stardust stardust-2"></div>
        <div className="stardust stardust-3"></div>
      </a>
    </Link>
  );
}