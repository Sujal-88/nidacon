// app/page.js
"use client";

import { useState, useEffect } from 'react'; // Import useEffect
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
import MembershipPopup from '@/components/MembershipPopup';
import SpeakerCarousel from '@/components/SpeakerCarousel';
import SponsorCarousel from '@/components/SponsorCarousel';
import ExecutiveBody from '@/components/ExecutiveBody';

function HomePageContent() {
  return (
    <>
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen text-white overflow-hidden">
        <BackgroundVideo />
        <div className="absolute inset-0 bg-black/40 z-[1]"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 sm:h-40 md:h-48 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent z-[2]"></div>

        <EventBar
          message="NIDACON 2026 is coming to Nagpur! Click here to learn more and register!"
          href="/event-detail"
        />

        <div className="relative z-[3] flex flex-col min-h-screen">
          {/* Membership Button with improved spacing */}
          <div className="flex justify-center pt-16 sm:pt-20 md:pt-24 pb-6 sm:pb-8 md:pb-10 px-4">
            <MembershipPopup text='BECOME A IDA NAGPUR MEMBER' />
          </div>

          {/* Main Content Container with consistent spacing */}
          {/* UPDATED: flex-col lg:flex-row for side-by-side, items-stretch, and gap */}
          <div className="flex-1 flex flex-col lg:flex-row justify-center px-4 sm:px-6 lg:px-8 pb-8 space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-0 lg:gap-4 items-stretch">

            {/* ============== ENHANCED NIDASPORTZ SECTION ============== */}
            {/* UPDATED: lg:w-1/2 */}
            <div className="max-w-6xl mx-auto w-full lg:w-1/2">
              <div className="grid lg:grid-cols-1 gap-6 sm:gap-8 lg:gap-12 items-center">

                {/* Left Side - Main Image */}
                <div className="order-2 lg:order-1 flex justify-center lg:justify-center">
                  {/* UPDATED: Reduced max-w from max-w-sm sm:max-w-md to max-w-xs sm:max-w-sm */}
                  <Link href="/sports" className="block group relative max-w-xs sm:max-w-sm w-full">
                    {/* Decorative sport icons - floating around the main image */}
                    <div className="absolute -left-6 sm:-left-8 top-1/4 w-12 sm:w-16 h-12 sm:h-16 opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-float hidden md:block">
                      <Image
                        src="/sports/badminton.png"
                        alt="Badminton"
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="absolute -right-6 sm:-right-8 top-1/3 w-16 sm:w-20 h-16 sm:h-20 opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-float hidden md:block" style={{ animationDelay: '0.3s' }}>
                      <Image
                        src="/sports/cricket.png"
                        alt="Cricket"
                        width={100}
                        height={100}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="absolute -left-8 sm:-left-12 bottom-1/4 w-14 sm:w-18 h-14 sm:h-18 opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-float hidden md:block" style={{ animationDelay: '0.6s' }}>
                      <Image
                        src="/sports/pickleball.png"
                        alt="Pickleball"
                        width={72}
                        height={72}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Main Title Image */}
                    <div className="rounded-lg overflow-hidden shadow-xl sm:shadow-2xl shadow-purple-500/20 transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-purple-500/40 relative">
                      <Image
                        src="/sports/title.jpeg"
                        alt="NIDASPORTZ 2025"
                        width={800}
                        height={1131}
                        layout="responsive"
                        className="relative z-10"
                      />
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
                    </div>
                  </Link>
                </div>

                {/* Right Side - Text and CTA */}
                <div className="order-1 lg:order-2 text-center lg:text-center space-y-4 sm:space-y-6">
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent animate-fade-in-up">
                      Unleash Your Athletic Spirit
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white leading-relaxed max-w-xl mx-auto lg:mx-auto">
                      Join NIDASPORTZ 2025 - Season 6 for an exciting season of competition, camaraderie, and celebration across multiple sports.
                    </p>

                    {/* Date Buttons */}
                    <div className='flex flex-col flex-row xs:flex-row gap-3 sm:gap-4 justify-center lg:justify-center items-center pt-2'>
                      <button className="relative flex flex-col items-center justify-center h-24 sm:h-28 w-32 sm:w-40 overflow-hidden border border-indigo-600 text-white rounded-lg shadow-lg transition-all duration-300 ease-out group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <span className="absolute top-0 left-0 w-full h-full bg-indigo-600 transition-all duration-300 ease-out transform scale-0 group-hover:scale-100 group-focus:scale-100 opacity-90"></span>
                        <span className="relative z-10 flex flex-col items-center transition-colors duration-300 group-hover:text-white group-focus:text-white">
                          <span className="text-xs font-semibold tracking-wider uppercase opacity-80">Saturday</span>
                          <span className="text-4xl sm:text-5xl font-bold leading-tight">15</span>
                          <span className="text-xs sm:text-sm">November 2025</span>
                        </span>
                      </button>

                      <button className="relative flex flex-col items-center justify-center h-24 sm:h-28 w-32 sm:w-40 overflow-hidden border border-indigo-600 text-white rounded-lg shadow-lg transition-all duration-300 ease-out group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <span className="absolute top-0 left-0 w-full h-full bg-indigo-600 transition-all duration-300 ease-out transform scale-0 group-hover:scale-100 group-focus:scale-100 opacity-90"></span>
                        <span className="relative z-10 flex flex-col items-center transition-colors duration-300 group-hover:text-white group-focus:text-white">
                          <span className="text-xs font-semibold tracking-wider uppercase opacity-80">Sunday</span>
                          <span className="text-4xl sm:text-5xl font-bold leading-tight">16</span>
                          <span className="text-xs sm:text-sm">November 2025</span>
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-center items-center pt-2">
                    <Link href="/sports">
                      <button className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-full transition-all duration-300 ease-in-out text-sm sm:text-base shadow-lg transform hover:scale-105 hover:-translate-y-1">
                        <span className="relative z-10">Explore Sports</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition duration-500"></div>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* ======================================================= */}

            {/* ADDED: Vertical Divider for Desktop */}
            <div className="hidden lg:block w-px bg-gray-700/50"></div>

            {/* UPDATED: w-full lg:w-1/2 */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-8 w-full lg:w-1/2">
              <div className="w-full max-w-7xl mx-auto">

                <div className="hidden lg:flex lg:justify-between lg:items-center lg:gap-8">
                  <div className="flex justify-center animate-float card-3d flex-shrink-0">
                    {/* <SpeakerCarousel /> */}
                  </div>

                  <div className="text-center flex-1 px-4 align-center justify-center ">
                    <div className="space-y-2">
                      <h1 className="font-bold leading-tight">
                        <span className="block text-3xl xl:text-5xl bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-fade-in-up opacity-0 [--animation-delay:100ms]">
                          Welcome to
                        </span>
                        <span className="block mt-1 animate-fade-in-up opacity-0 [--animation-delay:300ms]">
                          <Image
                            src="/NIDACON/nida_logo.png"
                            alt="Conference Logo"
                            width={400}  // UPDATED: Increased size
                            height={400} // UPDATED: Increased size
                            className="drop-shadow-[0_0_15px_rgba(120,120,255,0.5)] mx-auto"
                          />
                        </span>
                      </h1>

                      {/* ADDED: Date Buttons */}
                      <div className='flex flex-row xs:flex-row gap-3 sm:gap-4 justify-center items-center pt-4 sm:pt-6 animate-fade-in-up opacity-0 [--animation-delay:400ms]'>
                        <button className="relative flex flex-col items-center justify-center h-24 sm:h-28 w-32 sm:w-40 overflow-hidden border border-indigo-600 text-white rounded-lg shadow-lg transition-all duration-300 ease-out group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <span className="absolute top-0 left-0 w-full h-full bg-indigo-600 transition-all duration-300 ease-out transform scale-0 group-hover:scale-100 group-focus:scale-100 opacity-90"></span>
                          <span className="relative z-10 flex flex-col items-center transition-colors duration-300 group-hover:text-white group-focus:text-white">
                            <span className="text-xs font-semibold tracking-wider uppercase opacity-80">Saturday</span>
                            <span className="text-4xl sm:text-5xl font-bold leading-tight">9</span>
                            <span className="text-xs sm:text-sm">January 2025</span>
                          </span>
                        </button>
                        <button className="relative flex flex-col items-center justify-center h-24 sm:h-28 w-32 sm:w-40 overflow-hidden border border-indigo-600 text-white rounded-lg shadow-lg transition-all duration-300 ease-out group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <span className="absolute top-0 left-0 w-full h-full bg-indigo-600 transition-all duration-300 ease-out transform scale-0 group-hover:scale-100 group-focus:scale-100 opacity-90"></span>
                          <span className="relative z-10 flex flex-col items-center transition-colors duration-300 group-hover:text-white group-focus:text-white">
                            <span className="text-xs font-semibold tracking-wider uppercase opacity-80">Sunday</span>
                            <span className="text-4xl sm:text-5xl font-bold leading-tight">10</span>
                            <span className="text-xs sm:text-sm">January 2025</span>
                          </span>
                        </button>
                        <button className="relative flex flex-col items-center justify-center h-24 sm:h-28 w-32 sm:w-40 overflow-hidden border border-indigo-600 text-white rounded-lg shadow-lg transition-all duration-300 ease-out group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <span className="absolute top-0 left-0 w-full h-full bg-indigo-600 transition-all duration-300 ease-out transform scale-0 group-hover:scale-100 group-focus:scale-100 opacity-90"></span>
                          <span className="relative z-10 flex flex-col items-center transition-colors duration-300 group-hover:text-white group-focus:text-white">
                            <span className="text-xs font-semibold tracking-wider uppercase opacity-80">Sunday</span>
                            <span className="text-4xl sm:text-5xl font-bold leading-tight">11</span>
                            <span className="text-xs sm:text-sm">January 2025</span>
                          </span>
                        </button>
                      </div>

                      <p className="pt-4 text-lg xl:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up opacity-0 [--animation-delay:500ms]">
                        Join us for an extraordinary experience of learning, innovation, and collaboration in dental excellence.
                      </p>
                    </div>

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

                  <div className="flex justify-center animate-float card-3d flex-shrink-0" style={{ animationDelay: '0.5s' }}>
                    {/* <SponsorCarousel /> */}
                  </div>
                </div>

                <div className="hidden md:block lg:hidden">
                  <div className="text-center mb-12">
                    <div className="space-y-2">
                      <h1 className="font-bold leading-tight">
                        <span className="block text-3xl md:text-4xl bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-fade-in-up opacity-0 [--animation-delay:100ms]">
                          Welcome to
                        </span>
                        <span className="block mt-1 animate-fade-in-up opacity-0 [--animation-delay:300ms]">
                          <Image
                            src="/NIDACON/nida_logo.png"
                            alt="Conference Logo"
                            width={400}  // UPDATED: Increased size
                            height={400} // UPDATED: Increased size
                            className="drop-shadow-[0_0_15px_rgba(120,120,255,0.5)] mx-auto"
                          />
                        </span>
                      </h1>

                      {/* ADDED: Date Buttons */}
                      <div className='flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-center pt-4 sm:pt-6 animate-fade-in-up opacity-0 [--animation-delay:400ms]'>
                        <button className="relative flex flex-col items-center justify-center h-24 sm:h-28 w-32 sm:w-40 overflow-hidden border border-indigo-600 text-white rounded-lg shadow-lg transition-all duration-300 ease-out group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <span className="absolute top-0 left-0 w-full h-full bg-indigo-600 transition-all duration-300 ease-out transform scale-0 group-hover:scale-100 group-focus:scale-100 opacity-90"></span>
                          <span className="relative z-10 flex flex-col items-center transition-colors duration-300 group-hover:text-white group-focus:text-white">
                            <span className="text-xs font-semibold tracking-wider uppercase opacity-80">Saturday</span>
                            <span className="text-4xl sm:text-5xl font-bold leading-tight">15</span>
                            <span className="text-xs sm:text-sm">November 2025</span>
                          </span>
                        </button>
                        <button className="relative flex flex-col items-center justify-center h-24 sm:h-28 w-32 sm:w-40 overflow-hidden border border-indigo-600 text-white rounded-lg shadow-lg transition-all duration-300 ease-out group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <span className="absolute top-0 left-0 w-full h-full bg-indigo-600 transition-all duration-300 ease-out transform scale-0 group-hover:scale-100 group-focus:scale-100 opacity-90"></span>
                          <span className="relative z-10 flex flex-col items-center transition-colors duration-300 group-hover:text-white group-focus:text-white">
                            <span className="text-xs font-semibold tracking-wider uppercase opacity-80">Sunday</span>
                            <span className="text-4xl sm:text-5xl font-bold leading-tight">16</span>
                            <span className="text-xs sm:text-sm">November 2025</span>
                          </span>
                        </button>
                      </div>

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

                  <div className="grid grid-cols-2 gap-6 mt-8">
                    <div className="flex justify-center animate-float card-3d">
                      {/* <SpeakerCarousel /> */}
                    </div>
                    <div className="flex justify-center animate-float card-3d" style={{ animationDelay: '0.5s' }}>
                      {/* <SponsorCarousel /> */}
                    </div>
                  </div>
                </div>

                <div className="block md:hidden">
                  <div className="text-center mb-10">
                    <div className="space-y-2">
                      <h1 className="font-bold leading-tight">
                        <span className="block text-2xl sm:text-3xl bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-fade-in-up opacity-0 [--animation-delay:100ms]">
                          Welcome to
                        </span>
                        <span className="block mt-1 animate-fade-in-up opacity-0 [--animation-delay:300ms]">
                          <Image
                            src="/NIDACON/nida_logo.png"
                            alt="Conference Logo"
                            width={400}  // UPDATED: Increased size
                            height={400} // UPDATED: Increased size
                            className="drop-shadow-[0_0_15px_rgba(120,120,255,0.5)] mx-auto"
                          />
                        </span>
                      </h1>

                      {/* ADDED: Date Buttons */}
                      <div className='flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-center pt-4 sm:pt-6 animate-fade-in-up opacity-0 [--animation-delay:400ms]'>
                        <button className="relative flex flex-col items-center justify-center h-24 sm:h-28 w-32 sm:w-40 overflow-hidden border border-indigo-600 text-white rounded-lg shadow-lg transition-all duration-300 ease-out group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <span className="absolute top-0 left-0 w-full h-full bg-indigo-600 transition-all duration-300 ease-out transform scale-0 group-hover:scale-100 group-focus:scale-100 opacity-90"></span>
                          <span className="relative z-10 flex flex-col items-center transition-colors duration-300 group-hover:text-white group-focus:text-white">
                            <span className="text-xs font-semibold tracking-wider uppercase opacity-80">Saturday</span>
                            <span className="text-4xl sm:text-5xl font-bold leading-tight">15</span>
                            <span className="text-xs sm:text-sm">November 2025</span>
                          </span>
                        </button>
                        <button className="relative flex flex-col items-center justify-center h-24 sm:h-28 w-32 sm:w-40 overflow-hidden border border-indigo-600 text-white rounded-lg shadow-lg transition-all duration-300 ease-out group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <span className="absolute top-0 left-0 w-full h-full bg-indigo-600 transition-all duration-300 ease-out transform scale-0 group-hover:scale-100 group-focus:scale-100 opacity-90"></span>
                          <span className="relative z-10 flex flex-col items-center transition-colors duration-300 group-hover:text-white group-focus:text-white">
                            <span className="text-xs font-semibold tracking-wider uppercase opacity-80">Sunday</span>
                            <span className="text-4xl sm:text-5xl font-bold leading-tight">16</span>
                            <span className="text-xs sm:text-sm">November 2025</span>
                          </span>
                        </button>
                      </div>

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

                  <div className="space-y-8 mt-8">
                    <div className="flex justify-center animate-float card-3d">
                      {/* <SpeakerCarousel /> */}
                    </div>
                    <div className="flex justify-center animate-float card-3d" style={{ animationDelay: '0.5s' }}>
                      {/* <SponsorCarousel /> */}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ======================================================= */}

          </div>

          {/* Bottom spacing */}
          <div className="h-8 sm:h-12 md:h-16 lg:h-20"></div>
        </div>
      </section>

      {/* About Section */}
      <section id='about' className="bg-gray-900 text-white py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-6 sm:gap-8 md:gap-10 lg:gap-16 items-center">
            <div className="md:col-span-2">
              <p className="text-xs sm:text-sm md:text-base font-semibold text-purple-400 uppercase tracking-wider">
                About IDA Nagpur
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mt-2 sm:mt-3 md:mt-4">
                Unity in Profession.
                <br />
                Excellence in Practice.
              </h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 leading-relaxed">
                As a cornerstone of the Nagpur dental community, our mission is to advance the science and art of dentistry. We are dedicated to fostering a powerful network of professionals, promoting the highest standards of oral health, and championing continuing education.
              </p>
              <p className="mt-3 sm:mt-4 md:mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 leading-relaxed">
                Through collaboration, outreach, and events like NIDACON, we strive to elevate our profession and serve our community with integrity and care.
              </p>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mt-10 sm:mt-12 md:mt-16 lg:mt-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg sm:rounded-xl p-5 sm:p-6 md:p-8 text-center transition-all duration-300 hover:bg-white/10 hover:-translate-y-2">
                <div className="inline-block p-3 sm:p-4 bg-purple-500/10 rounded-full">
                  <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-400" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-3 sm:mt-4">Continuous Learning</h3>
                <p className="mt-2 text-xs sm:text-sm md:text-base text-gray-400">
                  Championing workshops and seminars to keep our members at the forefront of dental innovation.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg sm:rounded-xl p-5 sm:p-6 md:p-8 text-center transition-all duration-300 hover:bg-white/10 hover:-translate-y-2">
                <div className="inline-block p-3 sm:p-4 bg-purple-500/10 rounded-full">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-400" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-3 sm:mt-4">Professional Unity</h3>
                <p className="mt-2 text-xs sm:text-sm md:text-base text-gray-400">
                  Fostering a powerful network for collaboration, mentorship, and mutual support among dental professionals.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg sm:rounded-xl p-5 sm:p-6 md:p-8 text-center transition-all duration-300 hover:bg-white/10 hover:-translate-y-2 sm:col-span-2 lg:col-span-1">
                <div className="inline-block p-3 sm:p-4 bg-purple-500/10 rounded-full">
                  <HeartHandshake className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-400" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-3 sm:mt-4">Community Service</h3>
                <p className="mt-2 text-xs sm:text-sm md:text-base text-gray-400">
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

  // This effect will run once when the component mounts
  useEffect(() => {
    // Check if the splash screen has been shown before in this session
    const hasVisited = sessionStorage.getItem('hasVisitedHomePage');

    if (hasVisited) {
      // If it has, skip the splash screen
      setIsLoading(false);
    } else {
      // If not, mark it as shown for this session
      sessionStorage.setItem('hasVisitedHomePage', 'true');
    }
  }, []); // The empty dependency array ensures this runs only once on mount

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

{/* NIDACON REGISTRATION COMPONENT */ }
{/* <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-8">
            <div className="w-full max-w-7xl mx-auto">
              
              <div className="hidden lg:flex lg:justify-between lg:items-center lg:gap-8">
                <div className="flex justify-center animate-float card-3d flex-shrink-0">
                  <SpeakerCarousel />
                </div>

                <div className="text-center flex-1 px-4">
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
                    
                    <p className="pt-4 text-lg xl:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up opacity-0 [--animation-delay:500ms]">
                      Join us for an extraordinary experience of learning, innovation, and collaboration in dental excellence.
                    </p>
                  </div>
                  
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

                <div className="flex justify-center animate-float card-3d flex-shrink-0" style={{ animationDelay: '0.5s' }}>
                  <SponsorCarousel />
                </div>
              </div>

              <div className="hidden md:block lg:hidden">
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

                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div className="flex justify-center animate-float card-3d">
                    <SpeakerCarousel />
                  </div>
                  <div className="flex justify-center animate-float card-3d" style={{ animationDelay: '0.5s' }}>
                    <SponsorCarousel />
                  </div>
                </div>
              </div>

              <div className="block md:hidden">
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
          </div> */}