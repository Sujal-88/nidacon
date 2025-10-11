// components/Navbar.js

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Mic, Calendar, Ticket, Menu, X, Image as ImageIcon, Download, LogIn } from 'lucide-react';
import Image from 'next/image';

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
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    
    const pathname = usePathname();

    const isHomePage = pathname === '/';
    const isSportsPage = pathname === '/sports';
    const displayedNavLinks = isHomePage ? mainNavLinks : eventNavLinks;

    let loginHref = '/login/member';
    let loginText = 'Member Login';

    if (isSportsPage) {
        loginHref = '/sports/login';
        loginText = 'Sports Login';
    } else if (!isHomePage) {
        loginHref = '/login/event';
        loginText = 'Event Login';
    }

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
            // A threshold of 10px is enough for the effect
            setIsScrolled(window.scrollY > 10);

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
    
    // This variable determines when the blurred background is shown
    const hasBackground = isScrolled || isMobileMenuOpen || !isHomePage;

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${
            hasBackground
                // UPDATED: Replaced solid bg with semi-transparent black and a stronger blur
                ? 'bg-black/30 backdrop-blur-lg shadow-lg' 
                : 'bg-transparent'
        }`}>
            <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
                    
                    {/* Logo Section - Responsive */}
                    <Link href="/" className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 cursor-pointer flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-white border-2 border-white/30 rounded-full flex items-center justify-center 
                                        transform transition-all duration-300 hover:scale-110 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30">
                            <Image 
                                src="/logo.png" 
                                alt="Logo" 
                                width={60} 
                                height={60}
                                className="w-full h-full object-contain p-0.5"
                            />
                        </div>
                        <div className="flex flex-col -space-y-0.5 sm:-space-y-1 lg:-space-y-1.5">
                            <h1 className="text-xs sm:text-sm md:text-base lg:text-xl font-bold text-gray-200 tracking-tight leading-tight">
                                <span className="text-orange-500">Indian</span>{' '}
                                <span className="text-white">Dental</span>{' '}
                                <span className="text-green-300">Association</span>
                            </h1>
                            <span className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-semibold text-white tracking-wider lg:tracking-widest pl-0.5 sm:pl-1">
                                NAGPUR BRANCH
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-1">
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
                        
                        <div className="flex items-center ml-4 xl:ml-6">
                            <div className="flex items-center space-x-2">
                                <Link 
                                    href="/sponsor-brochure.pdf"
                                    download="IDA_Nagpur_Sponsorship_Brochure.pdf"
                                    className="px-3 xl:px-4 py-2 bg-amber-500 text-white rounded-full font-semibold text-xs xl:text-sm transform transition-all duration-300 hover:scale-105 hover:bg-amber-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                                >
                                    <div className="flex items-center space-x-1.5 xl:space-x-2">
                                        <Download className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                                        <span className="hidden xl:inline">Brochure</span>
                                        <span className="xl:hidden">PDF</span>
                                    </div>
                                </Link>
                                
                                <Link 
                                    href={loginHref}
                                    className="px-3 xl:px-4 py-2 bg-indigo-800/80 text-white rounded-full font-semibold text-xs xl:text-sm transform transition-all duration-300 hover:scale-105 hover:bg-indigo-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:ring-offset-2"
                                >
                                    <div className="flex items-center space-x-1.5 xl:space-x-2">
                                        <LogIn className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                                        <span className="hidden xl:inline">{loginText}</span>
                                        <span className="xl:hidden">Login</span>
                                    </div>
                                </Link>
                            </div>

                            <div className="w-px h-7 bg-white/20 mx-3 xl:mx-4"></div>

                            <Link href="/register-now" className="px-4 xl:px-5 py-2 xl:py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-xs xl:text-sm transform transition-transform duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                                <div className="flex items-center space-x-1.5 xl:space-x-2">
                                    <Ticket className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                                    <span>Register</span>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Tablet Navigation (md-lg) */}
                    <div className="hidden md:flex lg:hidden items-center space-x-2">
                        <Link 
                            href="/sponsor-brochure.pdf"
                            download="IDA_Nagpur_Sponsorship_Brochure.pdf"
                            className="p-2 bg-green-500/80 text-white rounded-full transform transition-all duration-300 hover:scale-105 hover:bg-green-600"
                            title="Download Brochure"
                        >
                            <Download className="w-4 h-4" />
                        </Link>
                        
                        <Link 
                            href={loginHref}
                            className="p-2 bg-cyan-500/80 text-white rounded-full transform transition-all duration-300 hover:scale-105 hover:bg-cyan-600"
                            title={loginText}
                        >
                            <LogIn className="w-4 h-4" />
                        </Link>

                        <Link 
                            href="/register-now" 
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-sm transform transition-transform duration-300 hover:scale-105"
                        >
                            <div className="flex items-center space-x-1.5">
                                <Ticket className="w-4 h-4" />
                                <span>Register</span>
                            </div>
                        </Link>

                        <button 
                            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                            className={`p-2 rounded-lg transition-colors ml-2 ${hasBackground ? 'bg-white/10' : 'bg-white/50'}`}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
                        </button>
                    </div>

                    {/* Mobile Hamburger (< md) */}
                    <div className="md:hidden flex items-center space-x-2">
                        <Link 
                            href="/register-now" 
                            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-xs sm:text-sm"
                        >
                            <div className="flex items-center space-x-1 sm:space-x-1.5">
                                <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span>Register</span>
                            </div>
                        </Link>

                        <button 
                            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${hasBackground ? 'bg-white/10' : 'bg-white/50'}`}
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile/Tablet Menu */}
            <div className={`lg:hidden transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? 'max-h-[calc(100vh-4rem)]' : 'max-h-0'
            } overflow-hidden`}>
                {/* UPDATED: Removed old background classes and placed them on a new inner div for padding */}
                <div className="bg-gray-900/90 backdrop-blur-md px-3 sm:px-4 py-3 sm:py-4">
                    <div className="flex flex-col space-y-1.5 sm:space-y-2">
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
                        <div className="pt-3 sm:pt-4 mt-2 border-t border-white/20 space-y-2">
                            <a 
                                href="/sponsor-brochure.pdf"
                                download="IDA_Nagpur_Sponsorship_Brochure.pdf"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full py-2.5 sm:py-3 bg-green-500 text-white rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center space-x-2 hover:bg-green-600 transition-colors"
                            >
                                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Download Brochure</span>
                            </a>
                            
                            <Link 
                                href={loginHref} 
                                onClick={() => setMobileMenuOpen(false)} 
                                className="w-full py-2.5 sm:py-3 bg-cyan-500 text-white rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center space-x-2 hover:bg-cyan-600 transition-colors"
                            >
                                <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>{loginText}</span>
                            </Link>

                            <Link 
                                href="/register-now" 
                                onClick={() => setMobileMenuOpen(false)} 
                                className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center space-x-2 hover:shadow-lg transition-shadow"
                            >
                                <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Register Now</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ href, children, isActive, onClick }) => (
    <Link
        href={href}
        onClick={onClick}
        className={`relative group flex items-center space-x-1.5 xl:space-x-2 px-2 xl:px-3 py-2 rounded-full font-semibold text-xs xl:text-sm transition-all duration-300 overflow-hidden ${
            isActive 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'text-white hover:bg-white/20'
        }`}
    >
        <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-5 h-5 xl:w-6 xl:h-6 opacity-0 transform transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:left-1.5 xl:group-hover:left-2">
            <Image
                src="/tooth.png"
                alt="Tooth Icon"
                width={24}
                height={24}
                className="filter invert w-full h-full" 
            />
        </div>
        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform transition-all duration-700 ease-in-out group-hover:left-full"></div>
        <div className="flex items-center space-x-1.5 xl:space-x-2 transform transition-transform duration-500 group-hover:translate-x-5 xl:group-hover:translate-x-6">
            {children}
        </div>
    </Link>
);

const MobileNavLink = ({ href, children, isActive, onClick }) => (
    <Link
        href={href}
        onClick={onClick}
        className={`flex items-center space-x-2.5 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-colors duration-300 ${
            isActive ? 'bg-purple-600 text-white' : 'text-gray-200 hover:bg-white/10'
        }`}
    >
        {children}
    </Link>
);

export default Navbar;