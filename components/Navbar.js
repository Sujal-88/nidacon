// components/Navbar.js

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// ✨ 1. REMOVED Sparkle ICON FROM IMPORT
import { Home, Users, Mic, Calendar, Ticket, Menu, X, Image as ImageIcon, Download } from 'lucide-react';
import Image from 'next/image';

// --- No changes to these sections ---
const mainNavLinks = [
    { name: 'Home', href: '/#home', id: 'home', icon: <Home className="w-4 h-4" /> },
    { name: 'About', href: '/#about', id: 'about', icon: <Users className="w-4 h-4" /> },
    { name: 'Executive Body', href: '/#executive', id: 'executive', icon: <Users className="w-4 h-4" /> },
    { name: 'Upcoming Events', href: '/#upcoming-events', id: 'upcoming-events', icon: <Calendar className="w-4 h-4" /> },
    { name: 'Albums', href: '/#albums', id: 'albums', icon: <ImageIcon className="w-4 h-4" /> },
];

const eventNavLinks = [
    { name: 'Home', href: '/', id: 'home', icon: <Home className="w-4 h-4" /> },
    { name: 'About', href: '/#about', id: 'about', icon: <Users className="w-4 h-4" /> },
    { name: 'Speakers', href: '/register-now#speakers', id: 'speakers', icon: <Mic className="w-4 h-4" /> },
    { name: 'Schedule', href: '/register-now#schedule', id: 'schedule', icon: <Calendar className="w-4 h-4" /> },
];

const Navbar = () => {
    // --- All of your existing Navbar logic remains the same ---
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    
    const pathname = usePathname();

    const isHomePage = pathname === '/';
    const displayedNavLinks = isHomePage ? mainNavLinks : eventNavLinks;

    const handleScrollTo = (e, href) => {
        if (!isHomePage && href.startsWith('/#')) {
            setMobileMenuOpen(false);
            return; 
        }
        if (href.startsWith('/#') || (href.startsWith(pathname + '#'))) {
            e.preventDefault();
            const targetId = href.split('#')[1];
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
            setMobileMenuOpen(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);

            if (isHomePage) {
                let currentSection = '';
                mainNavLinks.forEach(link => {
                    const section = document.getElementById(link.id);
                    if (section && window.scrollY >= section.offsetTop - 100) {
                        currentSection = link.id;
                    }
                });
                if (currentSection) setActiveSection(currentSection);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHomePage]);

    const hasDarkBg = isScrolled || isMobileMenuOpen || !isHomePage;

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${
            hasDarkBg
                ? 'bg-black/30 backdrop-blur-xl shadow-lg border-b border-white/10' 
                : 'bg-transparent'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    
                    <Link href="/" className="flex items-center space-x-2 cursor-pointer">
                        <div className="w-13 h-13 bg-gradient-to-br from-slate-300 to-slate-400 rounded-xl flex items-center justify-center transform transition-transform duration-300 hover:scale-110">
                            <Image src="/logo.png" alt="Logo" width={80} height={80} />
                        </div>
                        <span className="text-2xl font-bold text-white transition-colors duration-300">
                            IDA NAGPUR
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {displayedNavLinks.map((link) => (
                            <NavLink 
                                key={link.name}
                                href={link.href}
                                isActive={isHomePage && activeSection === link.id}
                                onClick={(e) => handleScrollTo(e, link.href)}
                            >
                                {link.icon}
                                <span>{link.name}</span>
                            </NavLink>
                        ))}
                        <div className="pl-4 flex items-center space-x-2">
                             <Link 
                                href="/sponsor-brochure.pdf"
                                download="IDA_Nagpur_Sponsorship_Brochure.pdf"
                                className="px-5 py-2.5 bg-transparent border-2 border-green-400 text-green-400 rounded-full font-semibold text-sm transform transition-all duration-300 hover:scale-105 hover:bg-green-400 hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <Download className="w-4 h-4" />
                                    <span>Sponsor Brochure</span>
                                </div>
                            </Link>
                            <Link href="/register-now" className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-sm transform transition-transform duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                                <div className="flex items-center space-x-2">
                                    <Ticket className="w-4 h-4" />
                                    <span>Register Now</span>
                                </div>
                            </Link>
                        </div>
                    </div>

                   <div className="md:hidden">
                        <button 
                            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                            className={`p-2 rounded-lg transition-colors ${hasDarkBg ? 'bg-white/10' : 'bg-white/50'}`}
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className={`md:hidden transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? 'max-h-screen py-4' : 'max-h-0'
            } overflow-hidden bg-black/50 backdrop-blur-xl`}>
                <div className="flex flex-col space-y-2 px-4">
                    {displayedNavLinks.map((link) => (
                        <MobileNavLink 
                            key={link.name}
                            href={link.href}
                            isActive={isHomePage && activeSection === link.id}
                            onClick={(e) => handleScrollTo(e, link.href)}
                        >
                            {link.icon}
                            <span>{link.name}</span>
                        </MobileNavLink>
                    ))}
                    <div className="pt-4 mt-2 border-t border-white/20">
                        <a 
                            href="/sponsor-brochure.pdf"
                            download="IDA_Nagpur_Sponsorship_Brochure.pdf"
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full mb-2 py-3 bg-green-500 text-white rounded-lg font-semibold flex items-center justify-center space-x-2"
                        >
                            <Download className="w-5 h-5" />
                            <span>Sponsor Brochure</span>
                        </a>
                        <Link href="/register-now" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold flex items-center justify-center space-x-2">
                            <Ticket className="w-5 h-5" />
                            <span>Register Now</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};


// --- ✨ 2. UPDATED NavLink Component with your tooth.png ---
const NavLink = ({ href, children, isActive, onClick }) => (
    <Link
        href={href}
        onClick={onClick}
        className={`relative group flex items-center space-x-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 overflow-hidden ${
            isActive 
                ? 'bg-purple-600 text-white shadow-md' 
                : `text-white hover:bg-white/20`
        }`}
    >
        {/* Container for your Tooth PNG Image */}
        <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-6 h-6 opacity-0 transform transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:left-2">
            <Image
                src="/tooth.png" // Assumes tooth.png is in your /public folder
                alt="Tooth Icon"
                width={24}
                height={24}
                // This makes a black PNG appear white on the dark navbar. Remove if your PNG is already white.
                className="filter invert" 
            />
        </div>
        
        {/* Shine Effect (Optional but nice) */}
        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform transition-all duration-700 ease-in-out group-hover:left-full"></div>

        {/* Original Content - moves to the right on hover */}
        <div className="flex items-center space-x-2 transform transition-transform duration-500 group-hover:translate-x-6">
            {children}
        </div>
    </Link>
);

const MobileNavLink = ({ href, children, isActive, onClick }) => (
    <Link
        href={href}
        onClick={onClick}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-base transition-colors duration-300 ${
            isActive ? 'bg-purple-600 text-white' : 'text-gray-200 hover:bg-white/10'
        }`}
    >
        {children}
    </Link>
);

export default Navbar;