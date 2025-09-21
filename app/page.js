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
    image: '/committee/ketanGarg.jpeg', // Example image URL
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
        {/* Background Video */}
        <BackgroundVideo />
        
        {/* Background Overlays */}
        <div className="absolute inset-0 bg-black/40 z-[1]"></div>
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent z-[2]"></div>

        {/* Event Notification Bar */}
        <div className="relative z-[3] top-17">
          <EventBar
            message="NIDACON 2026 is coming to Nagpur! Click here to learn more and register!"
            href="/nidacon-details"
          />
        </div>
        
        {/* Main Hero Content */}
        <div className="relative z-[3] flex flex-col min-h-screen">
          {/* Membership Popup - Top Section */}
          <div className="flex justify-center pt-22 pb-3">
            <MembershipPopup />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-7xl mx-auto">
              
              {/* Desktop Layout: Three Column Grid */}
              <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Column: Speaker Carousel */}
                <div className="col-span-3 flex justify-center">
                  <div className="transform hover:scale-105 transition-transform duration-500">
                    <SpeakerCarousel />
                  </div>
                </div>

                {/* Center Column: Main Content */}
                <div className="col-span-6 text-center space-y-8">
                  {/* Main Headline */}
                  <div className="space-y-4">
                    <h1 className="text-5xl xl:text-7xl font-bold leading-tight">
                      <span className="block bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-pulse">
                        Welcome to
                      </span>
                      <span className="block text-white mt-2 drop-shadow-2xl">
                        NIDACON 2026
                      </span>
                    </h1>
                    
                    {/* Subtitle */}
                    <p className="text-xl xl:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-light">
                      Join us for an extraordinary experience of learning, innovation, and collaboration in dental excellence.
                    </p>
                  </div>
                  
                  {/* Call to Action Button */}
                  <div className="pt-4">
                    <Link href="/register-now" className="inline-block">
                      <button className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-12 py-5 rounded-full transition-all duration-300 ease-in-out text-lg shadow-2xl transform hover:scale-105 hover:-translate-y-1">
                        <div className="flex items-center justify-center">
                          <Ticket className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:rotate-12" />
                          <span className="font-semibold">Register Now</span>
                        </div>
                        {/* Enhanced Glow Effect */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition duration-500"></div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Right Column: Sponsor Carousel */}
                <div className="col-span-3 flex justify-center">
                  <div className="transform hover:scale-105 transition-transform duration-500">
                    <SponsorCarousel />
                  </div>
                </div>
              </div>

              {/* Tablet Layout: Two Column Grid */}
              <div className="hidden md:grid lg:hidden md:grid-cols-2 gap-12 items-center">
                
                {/* Left Column: Main Content */}
                <div className="text-center md:text-left space-y-6">
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    <span className="block bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                      Welcome to
                    </span>
                    <span className="block text-white mt-2 drop-shadow-2xl">
                      NIDACON 2026
                    </span>
                  </h1>
                  
                  <p className="text-lg md:text-xl text-gray-200 leading-relaxed font-light">
                    Join us for an extraordinary experience of learning, innovation, and collaboration in dental excellence.
                  </p>
                  
                  <div className="pt-2">
                    <Link href="/register-now" className="inline-block">
                      <button className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-10 py-4 rounded-full transition-all duration-300 ease-in-out text-lg shadow-2xl transform hover:scale-105">
                        <div className="flex items-center justify-center">
                          <Ticket className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:rotate-12" />
                          <span>Register Now</span>
                        </div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Right Column: Carousels Stacked */}
                <div className="flex flex-col items-center space-y-8">
                  <div className="transform hover:scale-105 transition-transform duration-300">
                    <SpeakerCarousel />
                  </div>
                  <div className="transform hover:scale-105 transition-transform duration-300">
                    <SponsorCarousel />
                  </div>
                </div>
              </div>

              {/* Mobile Layout: Single Column */}
              <div className="md:hidden text-center space-y-8">
                
                {/* Main Content */}
                <div className="space-y-6">
                  <h1 className="text-4xl sm:text-5xl font-bold leading-tight px-4">
                    <span className="block bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                      Welcome to
                    </span>
                    <span className="block text-white mt-2 drop-shadow-2xl">
                      NIDACON 2026
                    </span>
                  </h1>
                  
                  <p className="text-lg text-gray-200 leading-relaxed font-light px-6 max-w-lg mx-auto">
                    Join us for an extraordinary experience of learning, innovation, and collaboration in dental excellence.
                  </p>
                  
                  <div className="pt-2">
                    <Link href="/register-now" className="inline-block">
                      <button className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-full transition-all duration-300 ease-in-out text-base shadow-2xl transform hover:scale-105">
                        <div className="flex items-center justify-center">
                          <Ticket className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:rotate-12" />
                          <span>Register Now</span>
                        </div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Mobile Carousels */}
                <div className="flex flex-col items-center space-y-8 pt-8">
                  <div className="w-full max-w-sm">
                    <SpeakerCarousel />
                  </div>
                  <div className="w-full max-w-sm">
                    <SponsorCarousel />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Spacing */}
          <div className="h-16"></div>
        </div>
      </section>
      
      {/* About IDA Section */}
      <section id='about' className="bg-gray-900 text-white py-24 sm:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Main grid for the asymmetrical layout */}
          <div className="grid md:grid-cols-5 gap-10 md:gap-16 items-center">
            {/* Left Column: The Headline */}
            <div className="md:col-span-2">
              <p className="text-base font-semibold text-purple-400 uppercase tracking-wider">
                About IDA Nagpur
              </p>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mt-4">
                Unity in Profession.
                <br />
                Excellence in Practice.
              </h2>
            </div>

            {/* Right Column: The Narrative */}
            <div className="md:col-span-3">
              <p className="text-lg lg:text-xl text-gray-400 leading-relaxed">
                As a cornerstone of the Nagpur dental community, our mission is to advance the science and art of dentistry. We are dedicated to fostering a powerful network of professionals, promoting the highest standards of oral health, and championing continuing education.
              </p>
              <p className="mt-6 text-lg lg:text-xl text-gray-400 leading-relaxed">
                Through collaboration, outreach, and events like NIDACON, we strive to elevate our profession and serve our community with integrity and care.
              </p>
            </div>
          </div>

          {/* Core Values Section */}
          <div className="mt-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Value Card 1: Education */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 text-center transition-all duration-300 hover:bg-white/10 hover:-translate-y-2">
                <div className="inline-block p-4 bg-purple-500/10 rounded-full">
                  <BookOpen className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mt-4">Continuous Learning</h3>
                <p className="mt-2 text-gray-400">
                  Championing workshops and seminars to keep our members at the forefront of dental innovation.
                </p>
              </div>

              {/* Value Card 2: Community */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 text-center transition-all duration-300 hover:bg-white/10 hover:-translate-y-2">
                <div className="inline-block p-4 bg-purple-500/10 rounded-full">
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mt-4">Professional Unity</h3>
                <p className="mt-2 text-gray-400">
                  Fostering a powerful network for collaboration, mentorship, and mutual support among dental professionals.
                </p>
              </div>

              {/* Value Card 3: Service */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 text-center transition-all duration-300 hover:bg-white/10 hover:-translate-y-2">
                <div className="inline-block p-4 bg-purple-500/10 rounded-full">
                  <HeartHandshake className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mt-4">Community Service</h3>
                <p className="mt-2 text-gray-400">
                  Dedicated to improving public oral health through outreach programs and awareness campaigns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Speakers Section */}
      <ExecutiveBody />
      {/* <section id='executive' className="bg-white text-gray-900 py-24 sm:py-32 -mt-16 relative z-0">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Our Executive Body</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the visionary minds and leading experts who are backbone of IDA Nagpur.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto">
            {speakers.map((speaker) => (
              <div key={speaker.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                <Image
                  className="w-full h-56 object-cover object-center"
                  src={speaker.image}
                  alt={speaker.name}
                  width={500}
                  height={224}
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{speaker.name}</h3>
                  <p className="text-blue-600 text-sm font-medium mb-3">{speaker.qualification}</p>
                  <p className="text-gray-600 text-base leading-relaxed">{speaker.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </section> */}

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