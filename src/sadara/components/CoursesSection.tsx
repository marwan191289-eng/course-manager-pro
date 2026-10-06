import React from 'react';
import { useApp } from '../context/AppContext';
import { COURSES, SITE_INFO } from '../data/mockData';
import {
  Check,
  Star,
  Users,
  Clock,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Zap,
} from 'lucide-react';

export const CoursesSection: React.FC = () => {
  const { lang, t, openBookingModal } = useApp();

  return (
    <section className="py-16 sm:py-20 border-b border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-[#070b17] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-semibold mb-3">
            <Sparkles className="size-3.5" />
            <span>{lang === 'ar' ? 'الأسعار المعتمدة: 150 · 650 · 1,200 ر.س' : 'Official Rates: 150 · 650 · 1,200 SAR'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.pricing.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t.pricing.subtitle}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {COURSES.map((course, idx) => {
            const isFeatured = idx === 1; // 650 SAR bundle
            return (
              <div
                key={course.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  isFeatured
                    ? 'border-2 border-cyan-500 bg-white dark:bg-[#0d1428] shadow-2xl shadow-cyan-500/20 md:-translate-y-2'
                    : 'border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b1020] shadow-lg hover:border-cyan-500/40'
                }`}
              >
                {/* Popular Badge */}
                {course.badge && (
                  <div className="absolute -top-3.5 ltr:right-8 rtl:left-8 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold shadow-md">
                    {lang === 'ar' ? course.badge : (course.id === 'course-2' ? 'Most Popular' : 'VIP Elite')}
                  </div>
                )}

                <div>
                  {/* Track label */}
                  <span className="text-xs font-semibold text-cyan-500 dark:text-cyan-400 uppercase tracking-wider block text-start">
                    {lang === 'ar'
                      ? course.track
                      : (course.id === 'course-1'
                        ? 'Qudrat / Tahsili / Chem'
                        : course.id === 'course-2'
                        ? 'Full Math & Verbal & Tahsili'
                        : 'Elite +95 Program')}
                  </span>

                  {/* Course Title */}
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-2 text-start leading-snug">
                    {lang === 'ar' ? course.title : course.titleEn}
                  </h3>

                  {/* Rating & Students */}
                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="size-3.5 fill-amber-500" />
                      {course.rating}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="size-3.5" />
                      +{course.studentsCount} {lang === 'ar' ? 'طالب' : 'Students'}
                    </span>
                  </div>

                  {/* Price Tag */}
                  <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-start">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-slate-900 dark:text-white">
                        {course.price}
                      </span>
                      <span className="text-sm font-bold text-cyan-500">
                        {t.pricing.currency}
                      </span>
                      {course.originalPrice > course.price && (
                        <span className="text-sm text-slate-400 line-through ms-2">
                          {course.originalPrice} {t.pricing.currency}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <Clock className="size-3.5 text-cyan-400" />
                      <span>
                        {lang === 'ar'
                          ? course.duration
                          : (course.id === 'course-1'
                            ? '60 Minutes'
                            : course.id === 'course-2'
                            ? '5 Sessions × 75 Mins'
                            : '10 Sessions × 90 Mins')}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-start">
                    {lang === 'ar' ? course.description : course.descriptionEn}
                  </p>

                  {/* Features List */}
                  <ul className="mt-6 space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 text-start">
                    {(lang === 'ar' ? course.features : course.featuresEn).map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="size-4 text-cyan-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action CTA */}
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/10">
                  <button
                    onClick={() => openBookingModal(course.title)}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                      isFeatured
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-cyan-500/25'
                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-cyan-500 dark:hover:bg-cyan-400 hover:text-white dark:hover:text-black'
                    }`}
                  >
                    <Zap className="size-4" />
                    <span>{t.pricing.bookButton}</span>
                  </button>

                  <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <CreditCard className="size-3 text-cyan-400" />
                      مدى · Apple Pay · STC Pay
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="size-3 text-emerald-400" />
                      دفع آمن 100%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
