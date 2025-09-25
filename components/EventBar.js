// components/EventBar.js

import { Megaphone, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const EventBar = ({ 
  message = "Upcoming Event: NIDACON 2026 in Nagpur! Register Today!", 
  href = "/event-detail"
}) => {
  return (
    // ✨ WRAPPER: The Link component now has a group class for hover effects
    <Link 
      href={href}
      className="group"
    >
      {/* ✨ CONTAINER: Added shadow, border, and transition for a premium feel */}
      <div
        className="
          sticky top-[76px] z-40 flex w-full items-center justify-between 
          overflow-hidden 
          bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 
          text-white shadow-lg shadow-blue-500/20
          border-b border-white/20
          transition-all duration-300 ease-in-out
          group-hover:shadow-xl group-hover:shadow-purple-500/30 group-hover:-translate-y-0.5
        "
      >
        {/* Marquee Content */}
        <div 
          className="flex-grow flex items-center overflow-hidden"
        >
          <div 
            className="flex whitespace-nowrap group-hover:[animation-play-state:paused]" 
            style={{ animation: 'marquee 20s linear infinite' }}
          >
            {/* Content is duplicated for seamless loop */}
            <span className="mx-8 flex items-center py-2.5">
              <Megaphone className="mr-3 h-5 w-5 text-yellow-300 animate-pulse" />
              <span className="font-semibold tracking-wide">{message}</span>
            </span>
            <span className="mx-8 flex items-center py-2.5">
              <Megaphone className="mr-3 h-5 w-5 text-yellow-300 animate-pulse" />
              <span className="font-semibold tracking-wide">{message}</span>
            </span>
          </div>
        </div>

        {/* ✨ ADDED: Static "Call to Action" on the right */}
        <div className="
            hidden sm:flex items-center bg-black/20
            px-6 py-2.5 h-full
            font-bold text-yellow-300
            transition-colors duration-300
            group-hover:bg-black/40
          "
        >
          <span>Details</span>
          <ArrowRight className="
              ml-2 h-5 w-5 
              transition-transform duration-300 
              group-hover:translate-x-1
            " 
          />
        </div>
      </div>
    </Link>
  );
};

export default EventBar;