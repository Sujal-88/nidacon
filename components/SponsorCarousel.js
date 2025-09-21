// components/SponsorCarousel.js
"use client";

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import './carousel.css';

const sponsors = [
  { id: 1, src: '/sponsors/sponsor1.jpg', alt: 'Sponsor 1' },
  { id: 2, src: '/sponsors/sponsor2.png', alt: 'Sponsor 2' },
  { id: 3, src: '/sponsors/sponsor3.jpg', alt: 'Sponsor 3' },
];

export default function SponsorCarousel() {
  const [emblaRef] = useEmblaCarousel(
    { 
      loop: true, 
      drag: false,
    }, 
    [Autoplay({ delay: 2500, stopOnInteraction: false })]
  );

  return (
    <div className="relative">
      {/* Decorative elements */}
      <div className="absolute -top-4 -right-4 w-8 h-8 border-2 border-yellow-400/30 rounded-full animate-pulse"></div>
      <div className="absolute -bottom-4 -left-4 w-6 h-6 border-2 border-green-400/30 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
      
      {/* Main carousel container with fixed dimensions */}
      <div 
        className="embla relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-white/10 backdrop-blur-sm"
        style={{ width: '200px', height: '200px' }}
        ref={emblaRef}
      >
        <div className="embla__container">
          {sponsors.map((sponsor) => (
            <div 
              className="embla__slide flex items-center justify-center p-4" 
              key={sponsor.id}
            >
              <div className="relative w-full h-full flex items-center justify-center bg-white/90 rounded-xl">
                <Image
                  src={sponsor.src}
                  alt={sponsor.alt}
                  width={160}
                  height={160}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-green-400/20 rounded-2xl blur-sm -z-10"></div>
      </div>
      
      {/* Label */}
      <div className="mt-4 text-center">
        <p className="text-white/80 text-sm font-medium">Our Partners</p>
      </div>
    </div>
  );
}