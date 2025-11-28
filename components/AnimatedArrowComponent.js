// components/AnimatedArrowComponent.js
import React from 'react';

const AnimatedArrow = ({ className = "" }) => {
  return (
    // We removed absolute/top/left here and replaced it with {className}
    // This allows page.js to control the position.
    <div className={`pointer-events-none z-[4] overflow-visible flex items-start justify-center ${className}`}>
      <div className="relative w-full h-full">
        
        <svg 
          className="w-full h-full overflow-visible"
          viewBox="0 0 300 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 40 40 
               C 10 110, 80 130, 90 90 
               C 100 60, 60 40, 50 70 
               C 40 120, 180 160, 240 150"
            stroke="#ffffff" 
            /* Changed stroke to white so it is visible on the dark background */
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="arrow-path"
            style={{
              filter: 'drop-shadow(2px 4px 4px rgba(0,0,0,0.5))',
              strokeDasharray: '600', 
              strokeDashoffset: '600',
              animation: 'drawArrow 2.5s ease-in-out infinite'
            }}
          />

          <path
            d="M 210 135 L 240 150 L 215 165"
            stroke="#ffffff"
             /* Changed stroke to white */
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="arrow-head"
            style={{
              opacity: 0,
              animation: 'fadeInHead 2.5s ease-in-out infinite'
            }}
          />
        </svg>

        <style>{`
          @keyframes drawArrow {
            0% { stroke-dashoffset: 600; opacity: 0; }
            15% { opacity: 1; }
            50% { stroke-dashoffset: 0; opacity: 1; }
            70% { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 0; }
          }
          @keyframes fadeInHead {
            0%, 40% { opacity: 0; }
            50% { opacity: 1; }
            70% { opacity: 1; }
            100% { opacity: 0; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default AnimatedArrow;