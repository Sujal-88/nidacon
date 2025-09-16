// components/EventBar.js

import { Megaphone } from 'lucide-react';
import Link from 'next/link';

const EventBar = ({ 
  message = "Upcoming Event: NIDACON 2026 in Nagpur! Register Today!", 
  href = "/register-now"
}) => {
  return (
    <Link 
      href={href}
      // 👇 UPDATE THIS LINE
      className="group sticky top-[76px] z-40 flex w-full items-center overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 py-3 text-white"
    >
      <div 
        className="flex whitespace-nowrap group-hover:[animation-play-state:paused]" 
        style={{ animation: 'marquee 20s linear infinite' }}
      >
        {/* Content is duplicated for seamless loop */}
        <span className="mx-4 flex items-center">
          <Megaphone className="mr-3 h-5 w-5 text-yellow-300" />
          {message}
        </span>
        <span className="mx-4 flex items-center">
          <Megaphone className="mr-3 h-5 w-5 text-yellow-300" />
          {message}
        </span>
      </div>
    </Link>
  );
};

export default EventBar;