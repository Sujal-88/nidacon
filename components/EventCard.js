// components/EventCard.js
import React from 'react';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';

// Helper function to determine the color of the status badge
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

export default function EventCard({ event }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-slate-200/60 hover:border-slate-300/80 flex flex-col">
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
                <img
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

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex-grow">
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
                </div>
                <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 text-sm group-hover:shadow-lg flex items-center justify-center mt-auto">
                    Register Now
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
            </div>
        </div>
    );
}