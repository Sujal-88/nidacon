"use client"
import React from 'react';
// For animations, install: npm install framer-motion
import { motion } from 'framer-motion';
// For icons, install: npm install lucide-react
import { 
    Calendar, MapPin, Mic, Beaker, Users, Link2, Presentation, Stethoscope 
} from 'lucide-react';
import Image from 'next/image';

/*
  NOTE FOR THE DEVELOPER:
  1.  **Fonts:** This design uses the 'Poppins' font. Please import it into your project.
      A simple way is to add this to your main CSS file:
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
      And then add 'Poppins' to your tailwind.config.js file.

  2.  **Dependencies:** Make sure to install the required libraries:
      `npm install framer-motion lucide-react`
*/

// Reusable animated container for sections
const MotionContainer = ({ children, className }) => (
    <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.2 }}
        className={className}
    >
        {children}
    </motion.div>
);

// Animation variants for children
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// --- Re-designed Components ---

const FeatureCard = ({ icon, title, description }) => (
    <motion.div 
        variants={itemVariants}
        className="group relative p-8 bg-slate-800/60 rounded-2xl shadow-lg overflow-hidden border border-slate-700"
    >
        {/* Glow effect on hover */}
        <div className="absolute top-0 left-0 w-full h-full bg-cyan-400/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-0 left-0 w-1/2 h-full bg-cyan-400/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative">
            <div className="flex items-center justify-center h-14 w-14 rounded-full bg-slate-700 mb-6 border border-slate-600 text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">{title}</h3>
            <p className="text-slate-400 leading-relaxed">{description}</p>
        </div>
    </motion.div>
);

const SpeakerCard = ({ name, title, imgSrc }) => (
    <motion.div variants={itemVariants} className="text-center group">
        <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-slate-700 group-hover:border-cyan-400 transition-colors duration-300 transform group-hover:scale-105">
            
            <Image src={imgSrc} alt={name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300"></div>
        </div>
        <h4 className="mt-4 text-xl font-bold text-slate-100">{name}</h4>
        <p className="text-cyan-400">{title}</p>
    </motion.div>
);


// --- Main Page Component ---

export default function NidaconPageRedesigned() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans antialiased">
        
        {/* --- Hero Section --- */}
        <div className="relative h-screen flex items-center justify-center overflow-hidden">
            <div 
                className="absolute inset-0 bg-cover bg-center z-0" 
                style={{backgroundImage: "url('https://images.unsplash.com/photo-1579684385127-6abf7489ce04?q=80&w=1920&auto=format&fit=crop')"}}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900"></div>
            
            <div className="relative z-10 text-center px-4">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-8xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400"
                >
                    NIDACON <span className="text-cyan-400">2026</span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto"
                >
                    Advancing Frontiers in Modern Dentistry 🩺
                </motion.p>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-lg"
                >
                    <div className="flex items-center bg-slate-800/70 backdrop-blur-sm px-6 py-3 rounded-full border border-slate-700">
                        <Calendar className="h-5 w-5 mr-3 text-cyan-400" />
                        <span>9th – 11th January 2026</span>
                    </div>
                    <div className="flex items-center bg-slate-800/70 backdrop-blur-sm px-6 py-3 rounded-full border border-slate-700">
                        <MapPin className="h-5 w-5 mr-3 text-cyan-400" />
                        <span>Nagpur, India</span>
                    </div>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-12"
                >
                    <a href="#register" className="inline-block bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(56,189,248,0.5)]">
                        Secure Your Spot
                    </a>
                </motion.div>
            </div>
        </div>

        {/* --- What's in Store Section --- */}
        <section id="features" className="py-20 md:py-28">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-100">An Unforgettable Experience Awaits</h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">A powerful blend of cutting-edge science, practical skills, and collaborative networking.</p>
                </div>
                
                <MotionContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard 
                        icon={<Mic size={28} />} 
                        title="10+ Renowned Speakers" 
                        description="Learn from the global pioneers and innovators shaping the future of dentistry." 
                    />
                    <FeatureCard 
                        icon={<Beaker size={28} />} 
                        title="12+ Hands-on Workshops" 
                        description="Gain practical skills with our immersive workshops on the latest techniques and technologies." 
                    />
                    <FeatureCard 
                        icon={<Presentation size={28} />} 
                        title="Insightful Scientific Lectures" 
                        description="Dive deep into groundbreaking research, complex case studies, and evidence-based practices." 
                    />
                    <FeatureCard 
                        icon={<Stethoscope size={28} />} 
                        title="Grand Dental Exhibition" 
                        description="Explore 50+ stalls featuring state-of-the-art dental equipment, materials, and solutions." 
                    />
                    <FeatureCard 
                        icon={<Users size={28} />} 
                        title="800+ Professional Attendees" 
                        description="Connect with a vast network of dentists, specialists, researchers, and students." 
                    />
                    <FeatureCard 
                        icon={<Link2 size={28} />} 
                        title="Elite Networking Events" 
                        description="Build lasting professional relationships during our curated social events and mixers." 
                    />
                </MotionContainer>
            </div>
        </section>

        {/* --- Featured Speakers Section (NEW) --- */}
        <section className="py-20 md:py-28 bg-slate-800/40">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-100">Meet The Visionaries</h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">Our esteemed speakers are leaders in their fields, ready to share their expertise.</p>
                </div>
                <MotionContainer className="flex flex-wrap justify-center gap-x-12 gap-y-16">
                    <SpeakerCard name="Dr. Evelyn Reed" title="Prosthodontics & Digital Dentistry" imgSrc="https://placehold.co/200x200/415A77/E0E1DD?text=Dr.+Reed" />
                    <SpeakerCard name="Dr. Marcus Chen" title="Oral & Maxillofacial Surgery" imgSrc="https://placehold.co/200x200/415A77/E0E1DD?text=Dr.+Chen" />
                    <SpeakerCard name="Dr. Sofia Al-Jamil" title="Pediatric Dentistry" imgSrc="https://placehold.co/200x200/415A77/E0E1DD?text=Dr.+Al-Jamil" />
                    <SpeakerCard name="Dr. Kenji Tanaka" title="Orthodontic Innovations" imgSrc="https://placehold.co/200x200/415A77/E0E1DD?text=Dr.+Tanaka" />
                </MotionContainer>
            </div>
        </section>

        {/* --- Call to Action / Registration Section --- */}
        <section id="register" className="py-20 md:py-28 bg-cover bg-center bg-fixed" style={{backgroundImage: "url('https://images.unsplash.com/photo-1580281658223-9b93f18ae9ae?q=80&w=1920&auto=format&fit=crop')"}}>
            <div className="container mx-auto px-4 text-center bg-slate-900/80 backdrop-blur-sm py-20 rounded-3xl border border-slate-700 shadow-2xl">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-100">Elevate Your Dental Practice.</h2>
                <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
                    Don&apos;t miss the premier dental event in Central India. Limited seats available for hands-on workshops. Register now to secure your spot.
                </p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <a href="#register-form" className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(56,189,248,0.5)]">
                        Register Online
                    </a>
                    <a href="#brochure" className="border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-400 hover:text-slate-900 font-bold py-3.5 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
                        Download Brochure
                    </a>
                </div>
            </div>
        </section>
        
        {/* --- Footer --- */}
        <footer className="bg-slate-900 border-t border-slate-800 py-10">
            <div className="container mx-auto px-4 text-center text-slate-500">
                <p className="text-lg font-bold text-slate-200 mb-2">NIDACON 2026</p>
                <p>&copy; {new Date().getFullYear()} NIDA Nagpur. All Rights Reserved.</p>
                <p className="text-sm mt-2">Organized for the dental community, by the dental community.</p>
                <div className="mt-4 text-slate-300">
                    <a href="tel:+910000000000" className="hover:text-cyan-400 transition-colors duration-300">Phone: +91 000 000 0000</a>
                    <span className="mx-2">|</span>
                    <a href="mailto:contact@nidacon.com" className="hover:text-cyan-400 transition-colors duration-300">Email: contact@nidacon.com</a>
                </div>
            </div>
        </footer>
    </div>
  );
}