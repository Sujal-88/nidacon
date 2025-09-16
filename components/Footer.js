// components/Footer.js

"use client";

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About IDA', href: '#about' },
    { name: 'Speakers', href: '#speakers' }, // Assuming you'll add an ID to the speakers section
    { name: 'Schedule', href: '#schedule' }, // Assuming you'll add an ID to the schedule section
  ];

  const socialLinks = [
    { icon: <Facebook />, href: '#', name: 'Facebook' },
    { icon: <Twitter />, href: '#', name: 'Twitter' },
    { icon: <Instagram />, href: '#', name: 'Instagram' },
    { icon: <Linkedin />, href: '#', name: 'LinkedIn' },
  ];

  return (
    <footer className="bg-white text-gray-800 pt-25 relative">
      {/* SVG Wave Separator */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block h-[60px] md:h-[120px] w-full">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-current text-gray-900"></path>
        </svg>
      </div>

      <div className="container mx-auto px-6 lg:px-8">
        {/* --- Main Footer Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16">
          {/* Column 1: Branding & About */}
          <div className="md:col-span-2 lg:col-span-1">
            <h2 className="text-2xl font-bold">NIDACON 2026</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              The premier dental conference by IDA Nagpur, fostering innovation, community, and professional excellence.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social, index) => (
                <Link key={index} href={social.href} passHref>
                  <span className="text-gray-500 hover:text-purple-600 transition-colors duration-300" aria-label={social.name}>
                    {social.icon}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} passHref>
                    <span className="text-gray-600 hover:text-purple-600 transition-colors duration-300 cursor-pointer">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/register-now" passHref>
                  <span className="font-bold text-purple-600 hover:text-purple-700 transition-colors duration-300 cursor-pointer">
                    Register Now
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-lg font-semibold tracking-wider uppercase">Contact Us</h3>
            <ul className="mt-4 space-y-4 text-gray-600">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 shrink-0 text-purple-600" />
                <span>IDA Nagpur Office, Ramdaspeth, Nagpur, Maharashtra 440010</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 shrink-0 text-purple-600" />
                <a href="mailto:contact@idanagpur.com" className="hover:text-purple-600">contact@idanagpur.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0 text-purple-600" />
                <a href="tel:+911234567890" className="hover:text-purple-600">+91 12345 67890</a>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-lg font-semibold tracking-wider uppercase">Stay Updated</h3>
            <p className="mt-4 text-gray-600">Get the latest news and updates about NIDACON 2026.</p>
            <form className="mt-4 flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 text-gray-800 bg-gray-100 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <button
                type="submit"
                className="bg-purple-600 text-white p-3 rounded-r-md hover:bg-purple-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Subscribe to newsletter"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* --- Bottom Bar --- */}
        <div className="py-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} IDA Nagpur Branch. All Rights Reserved.</p>
          <p className="mt-4 sm:mt-0">
            Designed with ❤️ by 
            <a href="https://your-portfolio.com" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-purple-600"> Eighty8 Studio</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;