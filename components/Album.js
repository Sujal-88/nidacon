'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';

const ALBUM_DATA = [
  { id: 1, title: '', artist: '', cover: '/gallery/2023Pic1-0.jpg' },
  { id: 2, title: '', artist: '', cover: '/gallery/2023Pic3.jpg' },
  { id: 3, title: '', artist: '', cover: '/gallery/2023Pic7.jpg' },
  { id: 4, title: '', artist: '', cover: '/gallery/2023Pic5.jpg' },
  { id: 5, title: '', artist: '', cover: '/gallery/2023Pic4.jpg' },
  { id: 6, title: '', artist: '', cover: '/gallery/2023Pic1.jpg' },
  { id: 7, title: '', artist: '', cover: '/gallery/photo7.png' },
  { id: 8, title: '', artist: '', cover: '/gallery/2023Pic2.jpg' },
];

const Arrow = ({ direction, onClick, enabled }) => (
    <button
        className={`absolute top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-slate-800/60 hover:bg-slate-700/80 backdrop-blur-sm flex items-center justify-center text-purple-400 transition-all duration-300 z-10 disabled:opacity-30 disabled:cursor-not-allowed ${direction === 'prev' ? 'left-4' : 'right-4'
            }`}
        onClick={onClick}
        disabled={!enabled}
    >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {direction === 'prev' ? <polyline points="15 18 9 12 15 6"></polyline> : <polyline points="9 18 15 12 9 6"></polyline>}
        </svg>
    </button>
);

// This is the individual card component
const AlbumCard = ({ album }) => (
    <div className="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-purple-500/30 hover:-translate-y-2">
        <Image
            src={album.cover}
            alt={`Album cover for ${album.title}`}
            width={600}
            height={600}
            className="object-cover w-full h-full aspect-square transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 w-full">
            <h3 className="font-bold text-lg text-white truncate">{album.title}</h3>
            <p className="text-sm text-purple-300 truncate">{album.artist}</p>
        </div>
    </div>
);

export default function Albums() {
    // ✨ CHANGE 1: Group the albums into pairs (chunks of 2)
    const groupedAlbums = ALBUM_DATA.reduce((result, _item, index) => {
        if (index % 2 === 0) {
            result.push(ALBUM_DATA.slice(index, index + 2));
        }
        return result;
    }, []);

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
    
    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setPrevBtnEnabled(emblaApi.canScrollPrev());
        setNextBtnEnabled(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    return (
        <>
            {/* ✨ CHANGE 2: Simplified CSS. Each slide is now always 100% width. */}
            <style jsx global>{`
        .embla {
          overflow: hidden;
        }
        .embla__container {
          display: flex;
          margin-left: -1rem; /* Adjust for padding */
        }
        .embla__slide {
          flex: 0 0 100%; /* Each slide takes full width */
          min-width: 0;
          padding-left: 1rem;
        }
      `}</style>

            <section id='albums' className="bg-slate-900 text-white py-12 sm:py-16 lg:py-20 antialiased">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                                Featured Albums
                            </span>
                        </h2>
                        <p className="mt-4 text-lg text-slate-400 max-w-3xl mx-auto">
                            Discover new soundscapes and curated collections from past NIDACON.
                        </p>
                    </div>

                    <div className="relative">
                        <div className="embla" ref={emblaRef}>
                            <div className="embla__container">
                                {/* ✨ CHANGE 3: Map over the GROUPED albums */}
                                {groupedAlbums.map((albumGroup, index) => (
                                    <div className="embla__slide" key={index}>
                                        {/* ✨ CHANGE 4: A responsive grid INSIDE the slide.
                      - 1 column on mobile (stacking them)
                      - 2 columns on medium screens and up (side-by-side)
                    */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {albumGroup.map((album) => (
                                                <AlbumCard key={album.id} album={album} />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Arrow direction="prev" onClick={scrollPrev} enabled={prevBtnEnabled} />
                        <Arrow direction="next" onClick={scrollNext} enabled={nextBtnEnabled} />
                    </div>
                </div>
            </section>
        </>
    );
}