// app/page.js
"use client";

import { useState } from 'react';
import SplashScreen from '@/components/SplashScreen';
import BackgroundVideo from '@/components/BackgroundVideo';
import { Ticket, Users, BookOpen, HeartHandshake } from 'lucide-react';
import EventBar from "@/components/EventBar";
import Schedule from '@/components/Schedule';
import OurLegacy from '@/components/OurLegacy';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import UpcomingEvents from '@/components/UpcomingEvents';
import Albums from '@/components/Album';

// Import the new components
import MembershipPopup from '@/components/MembershipPopup';
import SpeakerCarousel from '@/components/SpeakerCarousel';
import SponsorCarousel from '@/components/SponsorCarousel';
import ExecutiveBody from '@/components/ExecutiveBody';

const speakers = [
  {
    id: 1,
    name: 'Dr. Tushar Shrirao',
    qualification: 'President',
    description: 'Pioneering techniques in minimally invasive facial surgery.',
    image: '/committee/ketanGarg.jpeg',
  },
  {
    id: 2,
    name: 'Dr. Ketan Garg',
    qualification: 'HON.Secreatary',
    description: 'Advocating for accessible dental care in rural communities.',
    image: '/committee/rohitMude.jpeg',
  },
  {
    id: 3,
    name: 'Dr. Rohit Mude',
    qualification: 'Treasurer',
    description: 'Innovating new materials for restorative dental procedures.',
    image: '/committee/tusharShrirao.jpeg',
  },
];

function HomePageContent() {
  return (
    <>
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen text-white overflow-hidden">
        <BackgroundVideo />
        <div className="absolute inset-0 bg-black/40 z-[1]"></div>
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent z-[2]"></div>

        {/* EventBar - Sticky positioning handled in component */}
        <EventBar
          message="NIDACON 2026 is coming to Nagpur! Click here to learn more and register!"
          href="/event-detail"
        />
        
        <div className="relative z-[3] flex flex-col min-h-screen">
          {/* MembershipPopup - Better mobile spacing */}
          <div className="flex justify-center pt-20 sm:pt-24.5 pb-3 px-4">
            <MembershipPopup text='BECOME A IDA NAGPUR MEMBER' />
          </div>

          {/* Divider - Responsive width */}
          <div className="my-8 sm:my-12 flex justify-center px-4">
            <div className="h-[1px] w-full sm:w-2/3 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
          </div>
        
          <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16 pb-8">
            <div className="w-full max-w-7xl mx-auto">
              
              {/* Desktop Layout: Three Column Grid */}
              <div className="hidden lg:flex lg:justify-between lg:items-center lg:gap-8">
                
                {/* Left Column: Speaker Carousel */}
                <div className="flex justify-center animate-float card-3d flex-shrink-0">
                  <SpeakerCarousel />
                </div>

                {/* Center Column: Main Content */}
                <div className="text-center flex-1 px-4">
                  {/* Main Headline */}
                  <div className="space-y-2">
                    <h1 className="font-bold leading-tight">
                      <span className="block text-3xl xl:text-5xl bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-fade-in-up opacity-0 [--animation-delay:100ms]">
                        Welcome to
                      </span>
                      <span className="block text-6xl xl:text-9xl text-white mt-1 drop-shadow-[0_0_15px_rgba(120,120,255,0.5)] animate-fade-in-up opacity-0 [--animation-delay:300ms]">
                        <span className="text-gray-100">N</span>
                        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">IDA</span>
                        <span className="text-gray-100">CON</span> 2026
                      </span>
                    </h1>
                    
                    {/* Subtitle */}
                    <p className="pt-4 text-lg xl:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up opacity-0 [--animation-delay:500ms]">
                      Join us for an extraordinary experience of learning, innovation, and collaboration in dental excellence.
                    </p>
                  </div>
                  
                  {/* Call to Action Button */}
                  <div className="pt-8 xl:pt-10 animate-fade-in-up opacity-0 [--animation-delay:700ms]">
                    <Link href="/register-now" className="inline-block">
                      <button className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-12 xl:px-14 py-4 xl:py-5 rounded-full transition-all duration-300 ease-in-out text-base xl:text-lg shadow-2xl transform hover:scale-105 hover:-translate-y-1 animate-pulse-button">
                        <div className="flex items-center justify-center">
                          <Ticket className="w-5 h-5 xl:w-6 xl:h-6 mr-2 xl:mr-3 transition-transform duration-300 group-hover:rotate-12" />
                          <span className="font-semibold">Register Now</span>
                        </div>
                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition duration-500"></div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Right Column: Sponsor Carousel */}
                <div className="flex justify-center animate-float card-3d flex-shrink-0" style={{ animationDelay: '0.5s' }}>
                  <SponsorCarousel />
                </div>
              </div>

              {/* Tablet Layout: Two Column Grid (Carousel below content) */}
              <div className="hidden md:block lg:hidden">
                {/* Main Content */}
                <div className="text-center mb-12">
                  <div className="space-y-2">
                    <h1 className="font-bold leading-tight">
                      <span className="block text-3xl md:text-4xl bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-fade-in-up opacity-0 [--animation-delay:100ms]">
                        Welcome to
                      </span>
                      <span className="block text-5xl md:text-7xl text-white mt-1 drop-shadow-[0_0_15px_rgba(120,120,255,0.5)] animate-fade-in-up opacity-0 [--animation-delay:300ms]">
                        <span className="text-gray-100">N</span>
                        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">IDA</span>
                        <span className="text-gray-100">CON</span> 2026
                      </span>
                    </h1>
                    
                    <p className="pt-4 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed font-light animate-fade-in-up opacity-0 [--animation-delay:500ms]">
                      Join us for an extraordinary experience of learning, innovation, and collaboration in dental excellence.
                    </p>
                  </div>
                  
                  <div className="pt-8 animate-fade-in-up opacity-0 [--animation-delay:700ms]">
                    <Link href="/register-now" className="inline-block">
                      <button className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-10 py-4 rounded-full transition-all duration-300 ease-in-out text-base shadow-2xl transform hover:scale-105 hover:-translate-y-1 animate-pulse-button">
                        <div className="flex items-center justify-center">
                          <Ticket className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                          <span className="font-semibold">Register Now</span>
                        </div>
                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition duration-500"></div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Carousels Side by Side on Tablet */}
                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div className="flex justify-center animate-float card-3d">
                    <SpeakerCarousel />
                  </div>
                  <div className="flex justify-center animate-float card-3d" style={{ animationDelay: '0.5s' }}>
                    <SponsorCarousel />
                  </div>
                </div>
              </div>

              {/* Mobile Layout: Single Column Stack */}
              <div className="block md:hidden">
                {/* Main Content */}
                <div className="text-center mb-10">
                  <div className="space-y-2">
                    <h1 className="font-bold leading-tight">
                      <span className="block text-2xl sm:text-3xl bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-fade-in-up opacity-0 [--animation-delay:100ms]">
                        Welcome to
                      </span>
                      <span className="block text-4xl sm:text-6xl text-white mt-1 drop-shadow-[0_0_15px_rgba(120,120,255,0.5)] animate-fade-in-up opacity-0 [--animation-delay:300ms]">
                        <span className="text-gray-100">N</span>
                        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">IDA</span>
                        <span className="text-gray-100">CON</span> 2026
                      </span>
                    </h1>
                    
                    <p className="pt-4 text-base sm:text-lg text-gray-200 max-w-xl mx-auto leading-relaxed font-light animate-fade-in-up opacity-0 [--animation-delay:500ms] px-2">
                      Join us for an extraordinary experience of learning, innovation, and collaboration in dental excellence.
                    </p>
                  </div>
                  
                  <div className="pt-6 animate-fade-in-up opacity-0 [--animation-delay:700ms]">
                    <Link href="/register-now" className="inline-block">
                      <button className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-3.5 rounded-full transition-all duration-300 ease-in-out text-sm shadow-2xl transform hover:scale-105 hover:-translate-y-1 animate-pulse-button">
                        <div className="flex items-center justify-center">
                          <Ticket className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                          <span className="font-semibold">Register Now</span>
                        </div>
                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition duration-500"></div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Carousels Stacked on Mobile */}
                <div className="space-y-8 mt-8">
                  <div className="flex justify-center animate-float card-3d">
                    <SpeakerCarousel />
                  </div>
                  <div className="flex justify-center animate-float card-3d" style={{ animationDelay: '0.5s' }}>
                    <SponsorCarousel />
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div className="h-12 sm:h-16"></div>
        </div>
      </section>
      
      {/* About IDA Section */}
      <section id='about' className="bg-gray-900 text-white py-16 sm:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8 md:gap-10 lg:gap-16 items-center">
            <div className="md:col-span-2">
              <p className="text-sm sm:text-base font-semibold text-purple-400 uppercase tracking-wider">
                About IDA Nagpur
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mt-3 sm:mt-4">
                Unity in Profession.
                <br />
                Excellence in Practice.
              </h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed">
                As a cornerstone of the Nagpur dental community, our mission is to advance the science and art of dentistry. We are dedicated to fostering a powerful network of professionals, promoting the highest standards of oral health, and championing continuing education.
              </p>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed">
                Through collaboration, outreach, and events like NIDACON, we strive to elevate our profession and serve our community with integrity and care.
              </p>
            </div>
          </div>
          <div className="mt-12 sm:mt-16 lg:mt-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 sm:p-8 text-center transition-all duration-300 hover:bg-white/10 hover:-translate-y-2">
                <div className="inline-block p-3 sm:p-4 bg-purple-500/10 rounded-full">
                  <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mt-3 sm:mt-4">Continuous Learning</h3>
                <p className="mt-2 text-sm sm:text-base text-gray-400">
                  Championing workshops and seminars to keep our members at the forefront of dental innovation.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 sm:p-8 text-center transition-all duration-300 hover:bg-white/10 hover:-translate-y-2">
                <div className="inline-block p-3 sm:p-4 bg-purple-500/10 rounded-full">
                  <Users className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mt-3 sm:mt-4">Professional Unity</h3>
                <p className="mt-2 text-sm sm:text-base text-gray-400">
                  Fostering a powerful network for collaboration, mentorship, and mutual support among dental professionals.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 sm:p-8 text-center transition-all duration-300 hover:bg-white/10 hover:-translate-y-2 sm:col-span-2 lg:col-span-1">
                <div className="inline-block p-3 sm:p-4 bg-purple-500/10 rounded-full">
                  <HeartHandshake className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mt-3 sm:mt-4">Community Service</h3>
                <p className="mt-2 text-sm sm:text-base text-gray-400">
                  Dedicated to improving public oral health through outreach programs and awareness campaigns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ExecutiveBody />

      <UpcomingEvents id="upcoming-events" />
      <Albums id="albums" />
      <Footer />
    </>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleAnimationComplete = () => {
    setIsLoading(false);
  };

  return (
    <div>
      {isLoading ? (
        <SplashScreen onAnimationComplete={handleAnimationComplete} />
      ) : (
        <HomePageContent />
      )}
    </div>
  );
}