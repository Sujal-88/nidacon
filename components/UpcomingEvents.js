import React, { useState } from 'react';
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function UpcomingEvents() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const events = [
        // ... your event data remains the same
        {
            title: 'Sustainable & Green Building Design',
            date: 'Oct 11, 2025',
            time: '10:00 AM - 4:00 PM',
            location: 'VNIT Auditorium, Nagpur',
            description: 'Explore innovative techniques in sustainable design and eco-friendly materials with leading architects and industry experts.',
            category: 'Workshop',
            attendees: '120+',
            imageSrc: '/',
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
            imageSrc: '/',
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

    // ✨ CHANGE 1: Set items per slide to 2
    const itemsPerSlide = 2;
    const totalSlides = Math.ceil(events.length / itemsPerSlide);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const getStatusColor = (status) => {
        const colors = {
            'Early Bird': 'bg-green-100 text-green-700',
            'Filling Fast': 'bg-orange-100 text-orange-700',
            'Premium': 'bg-purple-100 text-purple-700',
            'Limited Seats': 'bg-red-100 text-red-700',
            'New': 'bg-blue-100 text-blue-700',
            'Exclusive': 'bg-indigo-100 text-indigo-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    // The rest of your component remains the same until the grid...

    return (
        <section id='upcoming-events' className="bg-gradient-to-br from-slate-50 via-white to-slate-50 py-16 lg:py-20">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <div className="inline-flex items-center px-6 py-4 rounded-full text-sm font-medium bg-slate-100 text-slate-700 mb-6">
                        <Calendar className="w-4 h-4 mr-2" />
                        Upcoming Events
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                        NIDACON 2026 Events & Workshops
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        Join industry leaders and professionals in shaping the future of architecture and design through innovative learning experiences
                    </p>
                </div>

                {/* Carousel Container */}
                <div className="relative">
                    <div className="overflow-hidden rounded-xl">
                        <div
                            className="flex transition-transform duration-700 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {Array.from({ length: totalSlides }, (_, slideIndex) => (
                                <div key={slideIndex} className="w-full flex-shrink-0 px-2">
                                    {/* ✨ CHANGE 2: Simplified the grid for a 2-column layout on desktop */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                                        {events.slice(slideIndex * itemsPerSlide, slideIndex * itemsPerSlide + itemsPerSlide).map((event, eventIndex) => (
                                            // The entire event card design below is untouched
                                            <div
                                                key={slideIndex * itemsPerSlide + eventIndex}
                                                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-slate-200/60 hover:border-slate-300/80"
                                            >
                                                <div className="relative h-48 overflow-hidden">
                                                    <Image
                                                        src={event.imageSrc}
                                                        alt={event.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                                                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                                        <span className="px-3 py-1.5 text-xs font-semibold bg-white/95 backdrop-blur-sm text-slate-700 rounded-lg shadow-sm">
                                                            {event.category}
                                                        </span>
                                                        <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${getStatusColor(event.status)}`}>
                                                            {event.status}
                                                        </span>
                                                    </div>
                                                    <div className="absolute bottom-4 right-4 flex items-center bg-white/95 backdrop-blur-sm text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm">
                                                        <Users className="w-3.5 h-3.5 mr-1.5" />
                                                        {event.attendees}
                                                    </div>
                                                    <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-bold">
                                                        {event.price}
                                                    </div>
                                                </div>
                                                <div className="p-6">
                                                    <h3 className="font-bold text-slate-900 text-xl mb-3 line-clamp-2 leading-tight">
                                                        {event.title}
                                                    </h3>
                                                    <p className="text-slate-600 text-sm mb-5 line-clamp-2 leading-relaxed">
                                                        {event.description}
                                                    </p>
                                                    <div className="space-y-3 mb-6">
                                                        <div className="flex items-center text-sm text-slate-600">
                                                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center mr-3 flex-shrink-0">
                                                                <Calendar className="w-4 h-4" />
                                                            </div>
                                                            <span className="font-medium">{event.date}</span>
                                                        </div>
                                                        <div className="flex items-center text-sm text-slate-600">
                                                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center mr-3 flex-shrink-0">
                                                                <Clock className="w-4 h-4" />
                                                            </div>
                                                            <span>{event.time}</span>
                                                        </div>
                                                        <div className="flex items-center text-sm text-slate-600">
                                                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center mr-3 flex-shrink-0">
                                                                <MapPin className="w-4 h-4" />
                                                            </div>
                                                            <span className="truncate">{event.location}</span>
                                                        </div>
                                                    </div>
                                                    <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 text-sm group-hover:shadow-lg flex items-center justify-center">
                                                        Register Now
                                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Arrows (logic updated to be enabled/disabled correctly) */}
                    {totalSlides > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-white/95 backdrop-blur-sm border border-slate-200 hover:border-slate-300 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-10 disabled:opacity-40 disabled:cursor-not-allowed"
                                disabled={currentSlide === 0}
                            >
                                <ChevronLeft className="w-5 h-5 text-slate-700" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white/95 backdrop-blur-sm border border-slate-200 hover:border-slate-300 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-10 disabled:opacity-40 disabled:cursor-not-allowed"
                                disabled={currentSlide === totalSlides - 1}
                            >
                                <ChevronRight className="w-5 h-5 text-slate-700" />
                            </button>
                        </>
                    )}
                </div>

                {/* Pagination Dots */}
                {totalSlides > 1 && (
                    <div className="flex justify-center mt-10 space-x-3">
                        {Array.from({ length: totalSlides }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`transition-all duration-300 ${currentSlide === index
                                        ? 'w-8 h-3 bg-slate-900 rounded-full'
                                        : 'w-3 h-3 bg-slate-300 hover:bg-slate-400 rounded-full'
                                    }`}
                            />
                        ))}
                    </div>
                )}
                
                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link href="/events" passHref>
                        <button className="inline-flex items-center px-8 py-4 border-2 border-slate-300 hover:border-slate-900 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 transition-all duration-300 shadow-sm hover:shadow-md">
                            View All Events
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}