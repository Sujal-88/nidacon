// components/SpeakerCarousel.js
"use client";

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import './carousel.css';

const speakers = [
  { id: 1, src: '/path/to/speaker1.jpg', alt: 'Speaker 1' },
  { id: 2, src: '/path/to/speaker2.jpg', alt: 'Speaker 2' },
  { id: 3, src: '/path/to/speaker3.jpg', alt: 'Speaker 3' },
];

export default function SpeakerCarousel() {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      axis: 'y',
      drag: false,
      direction: 'ltr',
    },
    [Autoplay({ delay: 2000, stopOnInteraction: false })]
  );

  return (
    <div className="relative">
      {/* Decorative elements */}
      <div className="absolute -top-4 -left-4 w-8 h-8 border-2 border-purple-400/30 rounded-full animate-pulse"></div>
      <div className="absolute -bottom-4 -right-4 w-6 h-6 border-2 border-blue-400/30 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      
      {/* Main carousel container with fixed dimensions */}
      <div 
        className="embla embla--vertical relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20"
        style={{ width: '200px', height: '200px' }}
        ref={emblaRef}
      >
        <div className="embla__container">
          {speakers.map((speaker) => (
            <div 
              className="embla__slide flex items-center justify-center" 
              key={speaker.id}
              style={{ height: '200px' }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={speaker.src}
                  alt={speaker.alt}
                  fill
                  className="object-cover"
                />
                {/* Gradient overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                {/* Speaker label */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm font-semibold bg-black/30 backdrop-blur-sm px-2 py-1 rounded">
                    {speaker.alt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-2xl blur-sm -z-10"></div>
      </div>
      
      {/* Label */}
      <div className="mt-4 text-center">
        <p className="text-white/80 text-sm font-medium">Featured Speakers</p>
      </div>
    </div>
  );
}