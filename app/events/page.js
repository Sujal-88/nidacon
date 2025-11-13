// app/events/page.js
"use client";

import React from 'react';
import { Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import EventCard from '@/components/EventCard'; // Adjust the import path if needed

// You can move this to a shared data file later if you want
const events = [
    // ... your event data remains the same
    {
        title: 'NIDASPORTZ',
        date: '15 Nov, 2025 - 16 Nov, 2025',
        time: '7:00 AM Onwards',
        location: 'ABDA Sports Complex, Nagpur',
        description: 'Join NIDASPORTZ 2025 - Season 6 for an exciting season of competition, camaraderie, and celebration across multiple sports.',
        category: 'Sports',
        attendees: '120+',
        imageSrc: '/sports/title.jpeg',
        status: 'Early Bird',
        price: '₹2,500'
    },
    {
        title: 'NIDACON 2026',
        date: '9 - 11 Jan, 2026',
        time: '9:30 AM - 5:00 PM',
        location: 'Naivedyam North Star, Koradi, Nagpur',
        description: 'Deep dive into BIM, AI and digital tools revolutionizing project management in the dental industry.',
        category: 'Conference',
        attendees: '700+',
        imageSrc: '/NIDACON/nida_logo.png',
        status: 'Filling Fast',
        price: '₹2000'
    },
    {
        title: 'NIDACON Workshop',
        date: '9 - 11 Jan, 2026',
        time: '7:00 PM onwards',
        location: 'Naivedyam North Star, Koradi, Nagpur',
        description: 'Celebrating excellence in dental practices from central India dental Experts.',
        category: 'Gala',
        attendees: '300+',
        imageSrc: '/NIDACON/nida_logo.png',
        status: 'Premium',
        price: '₹5,000'
    },
];

export default function EventsPage() {
    return (
        <section className="bg-gradient-to-br from-slate-50 via-white to-slate-50 py-24 sm:py-32">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-slate-100 text-slate-700 mb-6">
                        <Calendar className="w-4 h-4 mr-2" />
                        All Upcoming Events
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                        Explore Our Events Calendar
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        Find the perfect workshop, conference, or gala to expand your knowledge and network.
                    </p>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <EventCard key={event.title} event={event} />
                    ))}
                </div>

                {/* Back to Home Button */}
                <div className="text-center mt-16">
                    <Link href="/" className="inline-flex items-center px-8 py-4 border-2 border-slate-300 hover:border-slate-900 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 transition-all duration-300 shadow-sm hover:shadow-md">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>
            </div>
        </section>
    );
}