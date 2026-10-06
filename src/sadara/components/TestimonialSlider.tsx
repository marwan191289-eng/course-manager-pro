import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { TESTIMONIALS } from '../data/mockData';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Award,
} from 'lucide-react';

export const TestimonialSlider: React.FC = () => {
  const { lang, t } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto-play interval every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped left
        lang === 'ar' ? handlePrev() : handleNext();
      } else {
        // Swiped right
        lang === 'ar' ? handleNext() : handlePrev();
      }
    }
    touchStartX.current = null;
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section
      className="py-16 sm:py-20 bg-slate-50 dark:bg-[#070b18] border-b border-slate-200 dark:border-white/10 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Decorative ambient gradients */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-semibold mb-3">
            <Award className="size-3.5" />
            <span>+12,400 طالب وطالبة في السعودية والخليج</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.testimonials.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t.testimonials.subtitle}
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className="relative max-w-4xl mx-auto"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Card */}
          <div className="k rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0e152a] p-6 sm:p-10 shadow-2xl relative transition-all duration-500 text-start">
            <Quote className="size-12 text-cyan-500/20 absolute top-6 ltr:right-8 rtl:left-8 pointer-events-none" />

            <div className="grid md:grid-cols-12 gap-6 sm:gap-8 items-center">
              {/* Student Avatar & Score Badge */}
              <div className="md:col-span-4 flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                <div className="relative">
                  <img
                    src={current.avatar}
                    alt={current.name}
                    className="size-20 sm:size-24 rounded-full object-cover border-2 border-cyan-400/50 shadow-md"
                    loading="lazy"
                  />
                  <span className="absolute bottom-0 right-0 size-6 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0e152a] flex items-center justify-center text-white">
                    <CheckCircle2 className="size-3.5" />
                  </span>
                </div>

                <div className="mt-3 font-bold text-base text-slate-900 dark:text-white">
                  {lang === 'ar' ? current.name : current.nameEn}
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <MapPin className="size-3 text-cyan-500" />
                  <span>{lang === 'ar' ? current.city : current.cityEn}</span>
                </div>

                {/* Score Growth Badge */}
                <div className="mt-4 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600/15 via-cyan-500/15 to-emerald-500/15 border border-cyan-500/30 flex items-center justify-around text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{t.testimonials.jumpedFrom}</span>
                    <span className="text-base font-bold text-slate-400 line-through">{current.scoreBefore}</span>
                  </div>
                  <TrendingUp className="size-4 text-emerald-400 animate-pulse" />
                  <div>
                    <span className="text-[10px] text-emerald-400 block font-semibold">{t.testimonials.to}</span>
                    <span className="text-xl font-black text-cyan-500 dark:text-cyan-400">
                      {current.scoreAfter}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Student Quote & Rating */}
              <div className="md:col-span-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(current.rating)].map((_, i) => (
                      <Star key={i} className="size-4 text-amber-400 fill-amber-400" />
                    ))}
                    <span className="ms-2 text-xs font-bold text-amber-400">5.0 / 5.0</span>
                    <span className="ms-auto text-xs text-slate-400">{current.date}</span>
                  </div>

                  <span className="inline-block px-3 py-1 rounded-md text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-3">
                    {lang === 'ar' ? current.track : current.trackEn}
                  </span>

                  <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-medium italic">
                    "{lang === 'ar' ? current.quote : current.quoteEn}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-500 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="size-4" />
                    <span>طالب موثق لدى منصة صدارة</span>
                  </span>
                  <span>إشراف م. محمود إسماعيل شلتوت</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav Controls */}
          <div className="mt-6 flex items-center justify-between px-2">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx
                      ? 'w-8 bg-cyan-500'
                      : 'w-2.5 bg-slate-300 dark:bg-white/20 hover:bg-slate-400'
                  }`}
                  aria-label={`شريحة رقم ${idx + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/15 text-slate-700 dark:text-white transition shadow-sm active:scale-95 cursor-pointer"
                aria-label="السابق"
              >
                <ChevronRight className="size-5 rtl:rotate-0 ltr:rotate-180" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/15 text-slate-700 dark:text-white transition shadow-sm active:scale-95 cursor-pointer"
                aria-label="التالي"
              >
                <ChevronLeft className="size-5 rtl:rotate-0 ltr:rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
