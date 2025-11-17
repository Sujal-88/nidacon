// components/Footer.js

"use client";

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About IDA', href: '#about' },
    { name: 'Speakers', href: '#speakers' },
    { name: 'Schedule', href: '#schedule' },
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: '#', name: 'Facebook' },
    { icon: <Twitter className="w-5 h-5" />, href: '#', name: 'Twitter' },
    { icon: <Instagram className="w-5 h-5" />, href: '#', name: 'Instagram' },
    { icon: <Linkedin className="w-5 h-5" />, href: '#', name: 'LinkedIn' },
  ];

  return (
    <footer className="bg-white text-gray-800 pt-16 sm:pt-20 lg:pt-25 relative">
      {/* SVG Wave Separator - Responsive height */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg 
          data-name="Layer 1" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block h-[40px] sm:h-[60px] md:h-[80px] lg:h-[120px] w-full"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            className="fill-current text-gray-900"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 pb-12 sm:pb-14 lg:pb-16">
          
          {/* Column 1: Branding & About */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="text-xl sm:text-2xl font-bold">Indian Dental Association</h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
              The Nagpur Branch of the Indian Dental Association (IDA) is dedicated to advancing dental health and education. Join us in our mission to promote excellence in dentistry and community well-being.
            </p>
            <div className="mt-5 sm:mt-6 flex space-x-3 sm:space-x-4">
              {socialLinks.map((social, index) => (
                <Link key={index} href={social.href} passHref>
                  <span 
                    className="text-gray-500 hover:text-purple-600 transition-colors duration-300 cursor-pointer p-2 hover:bg-purple-50 rounded-full" 
                    aria-label={social.name}
                  >
                    {social.icon}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} passHref>
                    <span className="text-sm sm:text-base text-gray-600 hover:text-purple-600 transition-colors duration-300 cursor-pointer inline-block hover:translate-x-1 transform">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/register-now" passHref>
                  <span className="text-sm sm:text-base font-bold text-purple-600 hover:text-purple-700 transition-colors duration-300 cursor-pointer inline-block hover:translate-x-1 transform">
                    Register Now
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold tracking-wider uppercase">Contact Us</h3>
            <ul className="mt-3 sm:mt-4 space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 sm:mt-1 shrink-0 text-purple-600" />
                <span className="leading-snug">IDA Nagpur Office, Ramdaspeth, Nagpur, Maharashtra 440010</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-purple-600" />
                <a 
                  href="mailto:contact@idanagpur.com" 
                  className="hover:text-purple-600 transition-colors break-all"
                >
                  contact@idanagpur.com
                </a>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-purple-600" />
                <a 
                  href="tel:+911234567890" 
                  className="hover:text-purple-600 transition-colors"
                >
                  +91 99604 03696
                </a>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold tracking-wider uppercase">Stay Updated</h3>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">
              Get the latest news and updates about NIDACON 2026.
            </p>
            <form className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:gap-0">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-800 bg-gray-100 border border-gray-300 rounded-lg sm:rounded-l-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2.5 sm:p-3 rounded-lg sm:rounded-r-md sm:rounded-l-none hover:bg-purple-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center justify-center gap-2 sm:gap-0"
                aria-label="Subscribe to newsletter"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="sm:hidden font-semibold">Subscribe</span>
              </button>
            </form>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Bottom Bar - Responsive */}
        <div className="py-6 sm:py-8 flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-gray-500 gap-3 sm:gap-4">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} IDA Nagpur Branch. All Rights Reserved.
          </p>
          <p className="text-center sm:text-right">
            Designed with <span className="text-red-500">♥</span> by 
            <a 
              href="https://eighty8studio.store" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-semibold hover:text-purple-600 transition-colors ml-1"
            >
              Eighty8 Studio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;