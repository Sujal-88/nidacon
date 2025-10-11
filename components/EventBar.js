// components/EventBar.js

import { Megaphone, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const EventBar = ({ 
  message = "Upcoming Event: NIDACON 2026 in Nagpur! Register Today!", 
  href = "/event-detail"
}) => {
  return (
    <Link 
      href={href}
      className="group"
    >
      <div
        className="
          sticky top-[82px] z-40 flex w-full items-center justify-between 
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
            {/* Content duplicated for seamless loop */}
            <span className="mx-4 sm:mx-8 flex items-center py-2 sm:py-2.5">
              <Megaphone className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-yellow-300 animate-pulse flex-shrink-0" />
              <span className="font-semibold tracking-wide text-xs sm:text-sm md:text-base">{message}</span>
            </span>
            <span className="mx-4 sm:mx-8 flex items-center py-2 sm:py-2.5">
              <Megaphone className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-yellow-300 animate-pulse flex-shrink-0" />
              <span className="font-semibold tracking-wide text-xs sm:text-sm md:text-base">{message}</span>
            </span>
            {/* Third duplicate for extra smooth scrolling on mobile */}
            <span className="mx-4 sm:mx-8 flex items-center py-2 sm:py-2.5">
              <Megaphone className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-yellow-300 animate-pulse flex-shrink-0" />
              <span className="font-semibold tracking-wide text-xs sm:text-sm md:text-base">{message}</span>
            </span>
          </div>
        </div>

        {/* Call to Action Button - Hidden on mobile, visible on tablet+ */}
        <div className="
            hidden sm:flex items-center bg-black/20
            px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 h-full
            font-bold text-yellow-300
            transition-colors duration-300
            group-hover:bg-black/40
            text-xs sm:text-sm md:text-base
          "
        >
          <span className="hidden md:inline">Details</span>
          <span className="md:hidden">View</span>
          <ArrowRight className="
              ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5
              transition-transform duration-300 
              group-hover:translate-x-1
              flex-shrink-0
            " 
          />
        </div>
      </div>
    </Link>
  );
};

export default EventBar;