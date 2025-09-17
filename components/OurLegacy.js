// components/OurLegacy.js

"use client";

import React from 'react';
import Link from 'next/link'; // Import the Link component
import { motion } from 'framer-motion';
import { Calendar, Users, Award, MoveRight } from 'lucide-react'; // Import a new icon
import Image from 'next/image';

// --- COMPONENT STRUCTURE ---
const OurLegacy = () => {
  // Animation variants (no changes needed here)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section id="legacy" className="bg-gray-900 text-white py-24 sm:py-32 overflow-hidden">
      <motion.div 
        className="container mx-auto px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* FIX 1: Grid gap is now responsive */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          
          {/* --- Left Column: Narrative & Stats --- */}
          <motion.div variants={itemVariants}>
            <p className="font-semibold text-purple-400 uppercase tracking-wider">
              Our Legacy
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mt-4">
              Forging Excellence Since 1968
            </h2>
            <p className="mt-6 text-lg text-gray-300 leading-relaxed">
              For over five decades, the Indian Dental Association, Nagpur Branch, has been the bedrock of our region&apos;s dental community, dedicated to advancing the art and science of dentistry.
            </p>
            <p className="mt-4 text-lg text-gray-300 leading-relaxed">
              Today, we stand as a thriving network of professionals, bound by a shared commitment to ethical practice, continuous learning, and unparalleled patient care.
            </p>
            
            {/* NEW: "Know More" Button */}
            <Link href="/history" passHref>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 font-semibold text-purple-300 border-2 border-purple-400/50 rounded-lg transition-colors hover:bg-purple-400 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Discover Our Journey
                <MoveRight className="w-5 h-5" />
              </motion.button>
            </Link>
            
            {/* Key Statistics */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
              <div className="flex sm:flex-col items-center sm:items-start gap-3">
                <Calendar className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-3xl font-bold">50+</p>
                  <p className="text-gray-400">Years of Service</p>
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-start gap-3">
                <Users className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-3xl font-bold">1200+</p>
                  <p className="text-gray-400">Members Strong</p>
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-start gap-3">
                <Award className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-3xl font-bold">100+</p>
                  <p className="text-gray-400">Events Hosted</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* --- Right Column: Photo Collage --- */}
          {/* FIX 2: Reordered for mobile-first view and responsive adjustments */}
          <motion.div 
            variants={itemVariants} 
            className="relative h-80 md:h-96 order-first md:order-last"
          >
            <Image
              src="https://images.unsplash.com/photo-1579154341101-095c52221064?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Historical IDA Event"
              className="absolute w-full h-full object-cover rounded-lg shadow-2xl"
              width={500}
              height={224}
            />
            {/* FIX 3: Overlapping images are now responsive */}
            <Image
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="IDA Members Networking"
              className="absolute w-32 h-24 md:w-48 md:h-32 object-cover rounded-lg shadow-lg border-4 border-gray-800 -bottom-4 -left-4 md:-bottom-8 md:-left-8"
              width={192}
              height={128}
            />
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Dental Conference Seminar"
              className="absolute w-28 h-28 md:w-40 md:h-40 object-cover rounded-full shadow-lg border-4 border-gray-800 -top-4 -right-4 md:-top-10 md:-right-10"
              width={160}
              height={160}
            />
          </motion.div>
          
        </div>
      </motion.div>
    </section>
  );
};

export default OurLegacy;