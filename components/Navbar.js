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
    const displayedNavLinks = isHomePage ? mainNavLinks : eventNavLinks;

    // ✨ NEW: Define login button properties based on the current page
    const loginHref = isHomePage ? '/login/member' : '/login/event';
    const loginText = isHomePage ? 'Member Login' : 'Event Login';

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
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-24">
                    
                    <Link href="/" className="flex items-center space-x-4 cursor-pointer">
                        <div className="w-16 h-16 bg-white border-2 border-white/30 rounded-full flex items-center justify-center 
                                        transform transition-all duration-300 hover:scale-110 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30">
                            <Image src="/logo.png" alt="Logo" width={60} height={60} />
                        </div>
                        <div className="flex flex-col -space-y-1.5">
                            <h1 className="text-xl font-bold text-gray-200 tracking-tight">
                                <span className="text-orange-500">I</span>ndian{' '}
                                <span className="text-white">D</span>ental{' '}
                                <span className="text-green-500">A</span>ssociation
                            </h1>
                            <span className="text-sm font-semibold text-gray-400 tracking-widest pl-1">
                                NAGPUR BRANCH
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center">
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
                        
                        <div className="flex items-center ml-6">
                            <div className="flex items-center space-x-2">
                                <Link 
                                    href="/sponsor-brochure.pdf"
                                    download="IDA_Nagpur_Sponsorship_Brochure.pdf"
                                    className="px-4 py-2 bg-green-500/80 text-white rounded-full font-semibold text-sm transform transition-all duration-300 hover:scale-105 hover:bg-green-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    <div className="flex items-center space-x-2">
                                        <Download className="w-4 h-4" />
                                        <span>Brochure</span>
                                    </div>
                                </Link>
                                
                                {/* ✨ CHANGE: Using dynamic href and text for Login button */}
                                <Link 
                                    href={loginHref}
                                    className="px-4 py-2 bg-cyan-500/80 text-white rounded-full font-semibold text-sm transform transition-all duration-300 hover:scale-105 hover:bg-cyan-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                                >
                                    <div className="flex items-center space-x-2">
                                        <LogIn className="w-4 h-4" />
                                        <span>{loginText}</span>
                                    </div>
                                </Link>
                            </div>

                            <div className="w-px h-7 bg-white/20 mx-4"></div>

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
                        
                        {/* ✨ CHANGE: Using dynamic href and text for mobile Login button */}
                        <Link 
                            href={loginHref} 
                            onClick={() => setMobileMenuOpen(false)} 
                            className="w-full mb-2 py-3 bg-cyan-500 text-white rounded-lg font-semibold flex items-center justify-center space-x-2"
                        >
                            <LogIn className="w-5 h-5" />
                            <span>{loginText}</span>
                        </Link>

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

// NavLink and MobileNavLink components remain the same
const NavLink = ({ href, children, isActive, onClick }) => (
    <Link
        href={href}
        onClick={onClick}
        className={`relative group flex items-center space-x-2 px-3 py-2 rounded-full font-semibold text-sm transition-all duration-300 overflow-hidden ${
            isActive 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'text-white hover:bg-white/20'
        }`}
    >
        <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-6 h-6 opacity-0 transform transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:left-2">
            <Image
                src="/tooth.png"
                alt="Tooth Icon"
                width={24}
                height={24}
                className="filter invert" 
            />
        </div>
        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform transition-all duration-700 ease-in-out group-hover:left-full"></div>
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