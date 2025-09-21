// components/Navbar.js

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Mic, Calendar, Ticket, Menu, X, Image as ImageIcon } from 'lucide-react'; // Added ImageIcon for clarity
import Image from 'next/image';

// Links for the main homepage ("/")
const mainNavLinks = [
  { name: 'Home', href: '/#home', id: 'home', icon: <Home className="w-4 h-4" /> },
  { name: 'About', href: '/#about', id: 'about', icon: <Users className="w-4 h-4" /> },
  { name: 'Executive Body', href: '/#executive', id: 'executive', icon: <Users className="w-4 h-4" /> },
  { name: 'Upcoming Events', href: '/#upcoming-events', id: 'upcoming-events', icon: <Calendar className="w-4 h-4" /> },
  { name: 'Albums', href: '/#albums', id: 'albums', icon: <ImageIcon className="w-4 h-4" /> },
];

// Links for the event/registration pages (e.g., "/register-now")
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

  // ** LOGIC TO SWITCH NAVLINKS BASED ON ROUTE **
  const isHomePage = pathname === '/';
  const displayedNavLinks = isHomePage ? mainNavLinks : eventNavLinks;

  const handleScrollTo = (e, href) => {
    // If we are on a different page and the link is for the homepage, let the Link component handle it.
    if (!isHomePage && href.startsWith('/#')) {
        setMobileMenuOpen(false);
        return; 
    }
    // If the link is an anchor on the current page, perform smooth scroll
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

      // Only track active sections if we are on the homepage
      if (isHomePage) {
        let currentSection = '';
        mainNavLinks.forEach(link => { // Check against mainNavLinks for section IDs
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
  }, [isHomePage]); // Rerun effect if the path changes (and thus isHomePage changes)

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled || isMobileMenuOpen || !isHomePage
          ? 'bg-white/90 backdrop-blur-lg shadow-md border-b border-gray-200/80' 
          : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-300 to-slate-400 rounded-xl flex items-center justify-center transform transition-transform duration-300 hover:scale-110">
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
            </div>
            <span className={`text-2xl font-bold transition-colors duration-300 ${isScrolled || isMobileMenuOpen || !isHomePage ? 'text-gray-800' : 'text-white'}`}>
              IDA NAGPUR
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {displayedNavLinks.map((link) => (
              <NavLink 
                key={link.name}
                href={link.href}
                isActive={isHomePage && activeSection === link.id}
                isScrolled={isScrolled || !isHomePage}
                onClick={(e) => handleScrollTo(e, link.href)}
              >
                {link.icon}
                <span>{link.name}</span>
              </NavLink>
            ))}
            <Link href="/register-now" className="ml-4 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-sm transform transition-transform duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                <div className="flex items-center space-x-2">
                    <Ticket className="w-4 h-4" />
                    <span>Register Now</span>
                </div>
            </Link>
          </div>

          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-white/50"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-gray-800" /> : <Menu className="w-6 h-6 text-gray-800" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-screen py-4' : 'max-h-0'
        } overflow-hidden bg-white/95 backdrop-blur-lg`}>
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
            <div className="pt-4 border-t border-gray-200">
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

const NavLink = ({ href, children, isActive, isScrolled, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
      isActive 
        ? 'bg-purple-600 text-white shadow-md' 
        : `hover:bg-gray-200/70 ${isScrolled ? 'text-gray-700' : 'text-white'}`
    }`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ href, children, isActive, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-base transition-colors duration-300 ${
      isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-200/70'
    }`}
  >
    {children}
  </Link>
);

export default Navbar;