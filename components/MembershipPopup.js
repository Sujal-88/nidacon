// components/MembershipPopup.js
"use client";

import Link from 'next/link';
import Image from 'next/image';
import './membership-popup.css';

export default function MembershipPopup({
  text = 'Become an IDA Nagpur Member',
  textColor = 'white'
}) {
  return (
    // FIX: Removed legacyBehavior prop and the inner <a> tag.
    // Props from the old <a> tag (like className) are now on the Link component itself.
    <Link href="/membership" className="cta-container group" aria-label={text}>
      <div className="cta-gradient-bg"></div>

      <div className="static-text">
        <span style={{ color: textColor }}>
          {text}
        </span>
      </div>

      <div className="logo-orb">
        <Image
          src={'/logo.png'}
          alt="IDA Nagpur Logo"
          fill // FIX: Use fill instead of layout="fill"
          sizes="(max-width: 640px) 80px, 120px" // FIX: Added sizes prop for performance
          className="p-1.5 sm:p-2 transition-transform duration-500 ease-out group-hover:scale-105"
          priority
        />
      </div>

      <div className="stardust stardust-1"></div>
      <div className="stardust stardust-2"></div>
      <div className="stardust stardust-3"></div>
    </Link>
  );
}