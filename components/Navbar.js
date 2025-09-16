// components/Navbar.js

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import the usePathname hook
import { Home, Users, Mic, Calendar, Ticket, Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/#home', id: 'home', icon: <Home className="w-4 h-4" /> },
  { name: 'About', href: '/#about', id: 'about', icon: <Users className="w-4 h-4" /> },
  { name: 'Speakers', href: '/#speakers', id: 'speakers', icon: <Mic className="w-4 h-4" /> },
  { name: 'Schedule', href: '/#schedule', id: 'schedule', icon: <Calendar className="w-4 h-4" /> },
  { name: 'Legacy', href: '/#legacy', id: 'legacy', icon: <Users className="w-4 h-4" /> },
];

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  const pathname = usePathname(); // Get the current URL path

  const handleScrollTo = (e, href) => {
    // If we are on a different page, let the Link component handle navigation
    if (pathname !== '/') {
      return; 
    }
    // If we are on the homepage, perform a smooth scroll
    e.preventDefault();
    const targetId = href.split('#')[1];
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
    if (isMobileMenuOpen) setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Only track active sections if we are on the homepage
      if (pathname === '/') {
        let currentSection = '';
        navLinks.forEach(link => {
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
  }, [pathname]); // Rerun effect if the path changes

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled || isMobileMenuOpen || pathname !== '/'
          ? 'bg-white/90 backdrop-blur-lg shadow-md border-b border-gray-200/80' 
          : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center transform transition-transform duration-300 hover:scale-110">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className={`text-2xl font-bold transition-colors duration-300 ${isScrolled || isMobileMenuOpen || pathname !== '/' ? 'text-gray-800' : 'text-white'}`}>
              NIDACON
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <NavLink 
                key={link.name}
                href={link.href}
                isActive={pathname === '/' && activeSection === link.id}
                isScrolled={isScrolled || pathname !== '/'}
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

      <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-screen py-4' : 'max-h-0'
        } overflow-hidden bg-white/95 backdrop-blur-lg`}>
        <div className="flex flex-col space-y-2 px-4">
            {navLinks.map((link) => (
              <MobileNavLink 
                key={link.name}
                href={link.href}
                isActive={pathname === '/' && activeSection === link.id}
                onClick={(e) => handleScrollTo(e, link.href)}
              >
                {link.icon}
                <span>{link.name}</span>
              </MobileNavLink>
            ))}
            <div className="pt-4 border-t border-gray-200">
                <Link href="/register-now" className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold flex items-center justify-center space-x-2">
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