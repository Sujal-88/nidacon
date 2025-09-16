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

const speakers = [
  {
    id: 1,
    name: 'Dr. Anjali Sharma',
    qualification: 'MDS, Oral & Maxillofacial Surgeon',
    description: 'Pioneering techniques in minimally invasive facial surgery.',
    image: 'https://images.unsplash.com/photo-1537368910025-7b3b3a7b1b5e?auto=format&fit=crop&q=80&w=200&h=200&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDB8fHx8fA%3D%3D', // Example image URL
  },
  {
    id: 2,
    name: 'Dr. Rajesh Singh',
    qualification: 'BDS, Public Health Dentistry',
    description: 'Advocating for accessible dental care in rural communities.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDd8fHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 3,
    name: 'Dr. Priya Mehta',
    qualification: 'PhD, Dental Researcher',
    description: 'Innovating new materials for restorative dental procedures.',
    image: 'xx',
  },
  {
    id: 4,
    name: 'Dr. XYZ',
    qualification: 'MDS, Periodontist',
    description: 'Expert in gum disease treatment and dental implantology.',
    image: 'https://images.unsplash.com/photo-1507003211169-e69adba4c293?auto=format&fit=crop&q=80&w=200&h=200&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDh8fHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDB8fHx8fA%3D%3D',
  },
];

function HomePageContent() {
  return (
    <>
      {/* Hero Section */}
      <section id='home' className="relative flex flex-col min-h-screen text-white">
        <BackgroundVideo />
        <EventBar
          message="NIDACON 2026 is coming to Nagpur! Click here to learn more and register!"
          href="/nidacon-details"
        />
        <div className="relative z-10 flex-grow flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-4">
            Welcome to NIDACON 2026
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            A brief and engaging description of your event. Join us for an amazing experience of learning and collaboration.
          </p>
          <Link href="/register-now">
            <button
              className="bg-blue-600 flex justify-center items-center cursor-pointer font-bold px-8 py-4 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out text-lg"
              >
              <Ticket className="w-4 h-4" />
              <span className='ml-2'>Register Now</span>
            </button>
          </Link>
        </div>

        {/* ===== NEW: Netflix-style Gradient Separator ===== */}
        {/* This div sits at the bottom of the hero section. Its background is a gradient that goes from your dark color (gray-900) to transparent. */}
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-gray-900 to-transparent"></div>

      </section>

      {/* ===== UPDATED: About IDA Section ===== */}
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

    {/* --- NEW: Core Values Section --- */}
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


      {/* ===== NEW: Speakers Section (Light Theme) ===== */}
      <section id='speakers' className="bg-white text-gray-900 py-24 sm:py-32 -mt-16 relative z-0"> {/* -mt-16 to pull it up into the gradient */}
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Our Esteemed Speakers</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the visionary minds and leading experts who will share their insights at NIDACON 2026.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {speakers.map((speaker) => (
              <div key={speaker.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                <img
                  className="w-full h-56 object-cover object-center"
                  src={speaker.image}
                  alt={speaker.name}
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
        {/* <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-gray-900 to-transparent"></div> */}
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </section>


      <Schedule />

      <OurLegacy id='legacy' />

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