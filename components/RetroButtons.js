import React, { useState } from 'react';

const RetroButtons = () => {
  const [selectedIndex, setSelectedIndex] = useState(1);

  const dates = [
    { day: "Friday", date: "9", fullDate: "January 2026" },
    { day: "Saturday", date: "10", fullDate: "January 2026" },
    { day: "Sunday", date: "11", fullDate: "January 2026" },
  ];

  return (
    <div className='flex flex-row xs:flex-row gap-4 sm:gap-6 justify-center items-center font-mono p-4'>
      {dates.map((item, index) => {
        const isSelected = selectedIndex === index;
        
        return (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`
              relative flex flex-col items-center justify-center 
              h-28 sm:h-32 w-23 sm:w-40 
              overflow-visible 
              border-2 
              transition-all duration-150 ease-out group 
              focus:outline-none 
              ${isSelected 
                ? 'border-fuchsia-500 bg-fuchsia-500 translate-x-[4px] translate-y-[4px] shadow-none' 
                : 'border-cyan-400 bg-black hover:-translate-y-1 hover:border-fuchsia-400 hover:text-fuchsia-400 shadow-[6px_6px_0px_0px_rgba(34,211,238,1)]'
              }
            `}
          >
            {/* Corner Deco (The "Tech" Look) - Only shows when not selected */}
            {!isSelected && (
              <>
                <span className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-cyan-400"></span>
                <span className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-cyan-400"></span>
              </>
            )}

            {/* Content */}
            <span className={`relative z-10 flex flex-col items-center transition-colors duration-200 ${isSelected ? 'text-black' : 'text-cyan-400'}`}>
              
              {/* Day */}
              <span className={`text-xs font-bold tracking-widest uppercase mb-1 ${isSelected ? 'text-black' : 'text-fuchsia-500'}`}>
                {item.day}
              </span>
              
              {/* Date Number */}
              <span className="text-5xl sm:text-6xl font-black leading-none font-sans" style={{ textShadow: isSelected ? 'none' : '2px 2px 0px rgba(255,0,255,0.4)' }}>
                {item.date}
              </span>
              
              {/* Month/Year */}
              <span className="text-[10px] sm:text-xs mt-1 border-t-2 border-current px-2 pt-1 opacity-90">
                {item.fullDate}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default RetroButtons;