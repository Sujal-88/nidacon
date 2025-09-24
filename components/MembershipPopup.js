// components/MembershipPopup.js
"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function MembershipPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    // Animate in after component mounts
    const timer = setTimeout(() => setIsVisible(true), 500);
    
    // Add pulsing effect every 3 seconds
    const pulseTimer = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 600);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(pulseTimer);
    };
  }, []);

  return (
    <div 
      className={`
        relative transition-all duration-700 ease-out transform
        ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}
        ${isPulsing ? 'scale-105' : 'scale-100'}
      `}
    >
      {/* Glow effect */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-full blur-sm opacity-40 animate-pulse"></div>
      
      {/* Main popup */}
      {/* CHANGE: Increased padding (px-8 py-5) for a bigger button */}
      <div className="relative bg-white/15 backdrop-blur-lg border border-white/30 rounded-full px-8 py-5 shadow-2xl">
        <Link href="/membership" className="block">
          {/* CHANGE: Increased font size (text-lg) and spacing */}
          <div className="flex items-center text-white text-lg font-semibold group">
            {/* Animated sparkle icon */}
            {/* CHANGE: Increased logo size and margin */}
            <div className="relative mr-4">
              <Image src={'/logo.png'} width={40} height={40} alt="Logo" />
              <div className="absolute inset-0 w-6 h-6 bg-yellow-300/20 rounded-full animate-ping"></div>
            </div>
            
            <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Join IDA Nagpur Today
            </span>
            
            {/* Animated arrow */}
            {/* CHANGE: Increased arrow size and margin */}
            <ArrowRight className="w-5 h-5 ml-3 text-blue-300 transition-transform duration-300 group-hover:translate-x-1.5" />
          </div>
        </Link>
      </div>
      
      {/* Floating particles effect (adjusted for new size) */}
      <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-white/40 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
      <div className="absolute -top-2 right-4 w-1.5 h-1.5 bg-blue-300/60 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute -bottom-1 right-2 w-2 h-2 bg-purple-300/50 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
    </div>
  );
}