"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

interface BannerItem {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

interface HeroSliderProps {
  bannersJson: string;
}

export default function HeroSlider({ bannersJson }: HeroSliderProps) {
  const banners = useMemo<BannerItem[]>(() => {
    try {
      const parsed = JSON.parse(bannersJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse hero banners:', e);
    }
    return [
      {
        id: '1',
        imageUrl: '',
        title: 'Elevate Your Space with Curated Essentials',
        subtitle: 'Explore handpicked electronics, premium apparel, and modern home utilities.',
        buttonText: 'Shop Catalog',
        buttonLink: '/#catalog'
      }
    ];
  }, [bannersJson]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    stopTimer();
    if (banners.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000); // Cycles every 4 seconds
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (!isHovered) {
      startTimer();
    } else {
      stopTimer();
    }
    return () => stopTimer();
  }, [currentIndex, isHovered, banners]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div
      className="relative w-full overflow-hidden select-none bg-black border-b border-zinc-800 h-[350px] sm:h-[450px] md:h-[500px] lg:h-[580px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {banners.map((slide, index) => {
          const isActive = index === currentIndex;
          const bgStyle = slide.imageUrl
            ? { backgroundImage: `url(${slide.imageUrl})` }
            : {};

          return (
            <div
              key={slide.id || index}
              className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
                isActive
                  ? 'opacity-100 scale-100 z-10'
                  : 'opacity-0 scale-95 z-0 pointer-events-none'
              } ${!slide.imageUrl ? 'bg-gradient-to-r from-slate-950 via-zinc-900 to-black' : 'bg-cover bg-center'}`}
              style={bgStyle}
            >
              {/* Overlay shading to keep text readable */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
              
              {/* Slide Content */}
              <div className="relative z-20 max-w-7xl mx-auto h-full px-6 sm:px-12 flex flex-col justify-center text-left">
                <div className="max-w-xl space-y-5">
                  

                  {/* Main Title heading */}
                  <h1 className={`text-3xl sm:text-5xl font-black tracking-tight leading-[1.1] text-white transition-all duration-700 delay-200 ${
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}>
                    {slide.title}
                  </h1>

                  {/* Subtitle desc */}
                  <p className={`text-zinc-300 text-sm sm:text-base leading-relaxed font-medium transition-all duration-700 delay-300 ${
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}>
                    {slide.subtitle}
                  </p>

                  {/* Action Link button */}
                  <div className={`pt-2 transition-all duration-500 delay-400 ${
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    <Link
                      href={slide.buttonLink || '/#catalog'}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full shadow-lg transition-all hover:-translate-y-0.5 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{slide.buttonText || 'Explore Now'}</span>
                      <ArrowRight className="w-4 h-4 text-black" />
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows (Only show if > 1 slide) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 border border-white/10 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all outline-none"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 border border-white/10 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all outline-none"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Navigation Indicators Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-amber-500 w-6'
                  : 'bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
