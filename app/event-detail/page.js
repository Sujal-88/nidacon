"use client";

import React from 'react';
import { Calendar, MapPin, Mic, Beaker, Users, Award, ArrowRight } from 'lucide-react';

export default function NidaconLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/30"></div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-block px-5 py-2 bg-white border border-blue-200 text-blue-700 rounded-full text-sm font-medium shadow-sm">
              Central India&apos;s Premier Dental Conference
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-gray-900 tracking-tight">
            NIDACON <span className="text-blue-600">2026</span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-600 mb-12 font-light">
            Advancing Frontiers in Modern Dentistry
          </p>

          {/* Date & Location */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-14">
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-200">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-700">9th – 11th January 2026</span>
            </div>
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-200">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-700">Nagpur, India</span>
            </div>
          </div>

          {/* CTA Button */}
          <a 
            href="#register" 
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Secure Your Spot
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "16+", label: "Expert Speakers", icon: <Mic className="w-6 h-6" /> },
              { number: "10+", label: "Hands-on Workshops", icon: <Beaker className="w-6 h-6" /> },
              { number: "600+", label: "Professional Attendees", icon: <Users className="w-6 h-6" /> }
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
              >
                <div className="text-blue-600 mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold mb-2 text-gray-900">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              What Awaits You
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Three days of transformative learning, networking, and innovation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: <Mic className="w-7 h-7" />, 
                title: "Renowned Speakers", 
                desc: "Learn from global pioneers shaping the future of dentistry" 
              },
              { 
                icon: <Beaker className="w-7 h-7" />, 
                title: "Practical Workshops", 
                desc: "Master cutting-edge techniques through hands-on experience" 
              },
              { 
                icon: <Award className="w-7 h-7" />, 
                title: "Scientific Lectures", 
                desc: "Explore groundbreaking research and evidence-based practices" 
              },
              { 
                icon: <Users className="w-7 h-7" />, 
                title: "Grand Exhibition", 
                desc: "Discover 50+ stalls with state-of-the-art dental innovations" 
              },
              { 
                icon: <Users className="w-7 h-7" />, 
                title: "Premium Networking", 
                desc: "Connect with specialists, researchers, and practitioners" 
              },
              { 
                icon: <Award className="w-7 h-7" />, 
                title: "CME Credits", 
                desc: "Earn continuing education credits for your participation" 
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="group bg-white p-8 rounded-xl border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300"
              >
                <div className="text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="register" className="py-20 px-6 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-12 md:p-16 rounded-2xl shadow-xl border border-blue-100">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Elevate Your Dental Practice
              </h2>
              <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                Don&apos;t miss the premier dental event in Central India. Limited seats available
                for hands-on workshops. Register now to secure your spot.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/register-now" 
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Register Online
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a 
                  href="#brochure" 
                  className="inline-flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  Download Brochure
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
// "use client";

// import React from "react";
// import Image from "next/image";

// const CenteredImagePage = () => {
//   return (
//     <div className="w-full h-screen bg-white flex items-center justify-center">
//       {/* Centered image container */}
//       <div className="relative w-96 h-96">
//         <Image
//           src="/under-construction/photo.jpg"
//           alt="Centered vector"
//           fill
//           priority
//           className="object-contain"
//         />
//       </div>
//     </div>
//   );
// };

// export default CenteredImagePage;