// components/Schedule.js

"use client";

import React from 'react';
import { Clock, Coffee, Mic, Users, Utensils, Award, Rocket } from 'lucide-react';

// --- SCHEDULE DATA ---
// Data remains the same, no changes needed here.
const scheduleItems = [
    { time: "09:00 AM", title: "Registration & Welcome Coffee", description: "Start your day with networking and refreshments.", icon: <Coffee /> },
    { time: "10:00 AM", title: "Opening Keynote: The Future of Dentistry", description: "By Dr. Anjali Sharma", icon: <Mic /> },
    { time: "11:30 AM", title: "Panel: Digital Innovations", description: "Exploring new technologies shaping patient care.", icon: <Users /> },
    { time: "01:00 PM", title: "Networking Lunch", description: "Connect with peers and speakers over a catered lunch.", icon: <Utensils /> },
    { time: "02:30 PM", title: "Workshop: Advanced Implantology", description: "Hands-on session with Dr. Sameer Khan.", icon: <Rocket /> },
    { time: "04:00 PM", title: "Closing Remarks & Awards", description: "Recognizing outstanding contributions to the field.", icon: <Award /> },
];


// --- The main Schedule component ---
const Schedule = () => {
  return (
    <section  id='schedule' className="bg-gray-900 text-white py-24 sm:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Event Schedule</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            A full day of insights, learning, and networking opportunities awaits.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* The simple vertical line */}
          <div className="absolute left-4 md:left-1/2 w-0.5 h-full bg-purple-500/30 -translate-x-1/2"></div>

          {/* Mapping over schedule items */}
          <div className="space-y-12">
            {scheduleItems.map((item, index) => {
              const isLeftOnDesktop = index % 2 === 0;

              return (
                <div key={index} className="relative flex items-center md:justify-center">
                  {/* The Dot on the timeline */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-purple-400 rounded-full border-4 border-gray-900 -translate-x-1/2"></div>
                  
                  {/* Card Content */}
                  <div className={`
                    w-full ml-12 md:ml-0 
                    md:w-5/12 p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg
                    ${isLeftOnDesktop ? 'md:mr-[calc(50%+2rem)] md:text-right' : 'md:ml-[calc(50%+2rem)]'}
                  `}>
                    <p className={`text-purple-400 font-semibold text-lg flex items-center gap-2 ${isLeftOnDesktop ? 'md:justify-end' : 'justify-start'}`}>
                       {React.cloneElement(item.icon, { className: 'w-5 h-5' })}
                       {item.time}
                    </p>
                    <h3 className="text-white font-bold text-xl sm:text-2xl mt-2">{item.title}</h3>
                    <p className="text-gray-400 mt-2">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Schedule;