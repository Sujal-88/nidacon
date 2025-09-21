// app/events/page.js
"use client";

import React from 'react';
import { Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import EventCard from '@/components/EventCard'; // Adjust the import path if needed

// You can move this to a shared data file later if you want
const events = [
    {
        title: 'Sustainable & Green Building Design',
        date: 'Oct 11, 2025',
        time: '10:00 AM - 4:00 PM',
        location: 'VNIT Auditorium, Nagpur',
        description: 'Explore innovative techniques in sustainable design and eco-friendly materials with leading architects and industry experts.',
        category: 'Workshop',
        attendees: '120+',
        imageSrc: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&h=240&fit=crop&crop=center',
        status: 'Early Bird',
        price: '₹2,500'
    },
    {
        title: 'Digital Transformation in Construction',
        date: 'Oct 25, 2025',
        time: '9:30 AM - 5:00 PM',
        location: 'Hotel Radisson Blu, Nagpur',
        description: 'Deep dive into BIM, AI and digital tools revolutionizing project management in the construction industry.',
        category: 'Conference',
        attendees: '200+',
        imageSrc: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=240&fit=crop&crop=center',
        status: 'Filling Fast',
        price: '₹3,500'
    },
    {
        title: 'NIDACON Annual Design Awards',
        date: 'Nov 8, 2025',
        time: '7:00 PM onwards',
        location: 'Le Méridien, Nagpur',
        description: 'Celebrating excellence in architecture and interior design from the Vidarbha region with industry leaders.',
        category: 'Gala',
        attendees: '300+',
        imageSrc: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=240&fit=crop&crop=center',
        status: 'Premium',
        price: '₹5,000'
    },
    {
        title: 'Smart Cities Urban Planning',
        date: 'Nov 22, 2025',
        time: '11:00 AM - 6:00 PM',
        location: 'IT Park, Nagpur',
        description: 'Technology integration in urban development and infrastructure planning for next-generation smart cities.',
        category: 'Conclave',
        attendees: '150+',
        imageSrc: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=400&h=240&fit=crop&crop=center',
        status: 'Limited Seats',
        price: '₹2,800'
    },
    {
        title: 'Innovative Materials & Technology',
        date: 'Dec 5, 2025',
        time: '10:00 AM - 3:00 PM',
        location: 'IIT Bombay, Mumbai',
        description: 'Explore cutting-edge materials and construction technologies shaping the future of architecture.',
        category: 'Seminar',
        attendees: '180+',
        imageSrc: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=240&fit=crop&crop=center',
        status: 'New',
        price: '₹1,800'
    },
    {
        title: 'Heritage Conservation Workshop',
        date: 'Dec 18, 2025',
        time: '9:00 AM - 5:00 PM',
        location: 'Archaeological Museum, Nagpur',
        description: 'Learn traditional and modern techniques for preserving historical architecture and cultural heritage.',
        category: 'Workshop',
        attendees: '85+',
        imageSrc: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=240&fit=crop&crop=center',
        status: 'Exclusive',
        price: '₹3,200'
    }
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