import React from 'react';
import { useApp } from '../context/AppContext';
import { SITE_INFO } from '../data/mockData';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Atom,
  TrendingUp,
  Award,
  Users,
  Play,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { lang, t, openBookingModal, setActiveTab, formattedStudentCount } = useApp();
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden border-b border-slate-200 dark:border-white/10 bg-gradient-to-b from-slate-100 via-slate-50 to-white dark:from-[#080d1e] dark:via-[#060913] dark:to-[#090e20] py-14 sm:py-20 lg:py-24 transition-colors">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 ltr:left-1/4 rtl:right-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 dark:bg-cyan-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-10 ltr:right-10 rtl:left-10 w-80 h-80 bg-blue-600/15 dark:bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Main Hero Copy (Col 7) */}
          <div className="lg:col-span-7 text-start">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
              <Sparkles className="size-4 animate-spin-slow text-cyan-500" />
              <span>{t.hero.badge}</span>
            </div>

            {/* Giant Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.18] text-slate-900 dark:text-white">
              {t.hero.title1}{' '}
              <span className="bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 bg-clip-text text-transparent">
                {t.hero.titleHighlight}
              </span>{' '}
              <br className="hidden sm:inline" />
              {t.hero.title2}
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
              {t.hero.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-wrap gap-3 sm:gap-4 items-center">
              <button
                onClick={() => openBookingModal()}
                className="px-7 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition active:scale-95 flex items-center gap-2 cursor-pointer text-sm sm:text-base"
              >
                <span>{t.hero.bookNow}</span>
                <Arrow className="size-4" />
              </button>

              <button
                onClick={() => setActiveTab('reactor')}
                className="px-6 py-4 rounded-2xl font-semibold border border-cyan-500/40 dark:border-cyan-500/30 bg-white/70 dark:bg-white/5 hover:bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 hover:text-cyan-500 transition flex items-center gap-2 cursor-pointer text-sm sm:text-base"
              >
                <Atom className="size-5 text-cyan-500" />
                <span>{t.hero.exploreReactor}</span>
              </button>

              <button
                onClick={() => setActiveTab('courses')}
                className="px-5 py-4 rounded-2xl font-semibold text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-white/5 transition flex items-center gap-1.5 cursor-pointer text-sm sm:text-base"
              >
                <span>{t.hero.tryQuiz}</span>
              </button>
            </div>

            {/* Key Platform Stats with Live Dynamic Counter */}
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/10 grid grid-cols-3 gap-4 sm:gap-6 max-w-xl">
              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-cyan-600 dark:text-cyan-400 tracking-tight flex items-center gap-1">
                  <span>{formattedStudentCount}</span>
                  <span className="size-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                </div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 flex items-center gap-1">
                  <Users className="size-3.5 text-cyan-500" />
                  <span>{t.hero.studentsLabel}</span>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 block">
                  {lang === 'ar' ? '● تسجيلات حية مستمرة' : '● Live growing'}
                </span>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
                  {SITE_INFO.stats.improvement}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 flex items-center gap-1">
                  <TrendingUp className="size-3.5 text-blue-500" />
                  <span>{t.hero.improvementLabel}</span>
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-500 tracking-tight">
                  {SITE_INFO.stats.rating}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 flex items-center gap-1">
                  <Award className="size-3.5 text-amber-500" />
                  <span>{t.hero.ratingLabel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Hero Visual Card (Col 5) */}
          <div className="lg:col-span-5">
            <div className="k rounded-3xl border border-slate-200 dark:border-white/15 bg-white/95 dark:bg-gradient-to-br dark:from-[#0e1630] dark:to-[#080d1d] p-6 sm:p-7 shadow-2xl backdrop-blur-xl relative">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-rose-500" />
                  <div className="size-3 rounded-full bg-amber-500" />
                  <div className="size-3 rounded-full bg-emerald-500" />
                  <span className="ms-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {t.hero.progressTitle}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  {t.hero.trackLabel}
                </span>
              </div>

              {/* Big Score Box */}
              <div className="mt-5 rounded-2xl bg-gradient-to-r from-blue-900/40 via-cyan-900/30 to-slate-900/50 p-5 border border-cyan-500/20 text-start">
                <div className="flex items-baseline justify-between">
                  <div className="text-5xl sm:text-6xl font-black text-white tracking-tight">
                    98<span className="text-2xl font-bold text-cyan-400">/100</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="size-3" />
                    +20 {lang === 'ar' ? 'درجة' : 'pts'}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-300">
                  {t.hero.latestScore}
                </p>
                <div className="mt-4 h-2.5 w-full bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full w-[96%] animate-pulse" />
                </div>
              </div>

              {/* Stat Grid */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-start">
                <div className="rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-3.5">
                  <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400">640+</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t.hero.solvedQuestions}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-3.5">
                  <div className="text-2xl font-black text-blue-600 dark:text-blue-400">38h</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t.hero.studyTime}
                  </div>
                </div>
              </div>

              {/* Reactor simulation quick launcher bar */}
              <button
                onClick={() => setActiveTab('reactor')}
                className="mt-4 w-full p-3.5 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 transition flex items-center justify-between text-start cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-cyan-500/20 text-cyan-500 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition">
                    <Atom className="size-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{lang === 'ar' ? 'محاكي قلب المفاعل الحي' : 'Live Reactor Simulator'}</span>
                      <span className="size-2 rounded-full bg-cyan-400 animate-ping" />
                    </div>
                    <div className="text-[11px] text-cyan-600 dark:text-cyan-400">
                      {lang === 'ar' ? 'تشغيل تفاعلي حي بمعدل انشطار متحكم به' : 'Interactive controlled fission simulation'}
                    </div>
                  </div>
                </div>
                <Play className="size-4 text-cyan-500 rtl:rotate-180" />
              </button>

              {/* Certified instructor guarantee */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="size-3.5 text-cyan-500" />
                  <span>{lang === 'ar' ? 'محتوى معتمد لعام 1447هـ' : 'Certified 1447 Curriculum'}</span>
                </span>
                <span>Zoom & Google Meet</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
