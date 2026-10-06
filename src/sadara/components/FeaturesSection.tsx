import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Atom,
  Brain,
  Video,
  CreditCard,
  Users,
  Award,
  Sparkles,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const { lang, t, setActiveTab, openBookingModal } = useApp();

  const features = [
    {
      icon: Atom,
      title: t.features.f1_title,
      desc: t.features.f1_desc,
      action: () => setActiveTab('reactor'),
      actionLabel: lang === 'ar' ? 'جرّب المحاكي الآن' : 'Launch Simulator Now',
      highlight: true,
    },
    {
      icon: Brain,
      title: t.features.f2_title,
      desc: t.features.f2_desc,
      action: () => setActiveTab('courses'),
      actionLabel: lang === 'ar' ? 'تصفح بنك التجميعات' : 'Explore Question Bank',
    },
    {
      icon: Video,
      title: t.features.f3_title,
      desc: t.features.f3_desc,
      action: () => setActiveTab('courses'),
      actionLabel: lang === 'ar' ? 'جدول الجلسات المباشرة' : 'Live Sessions Schedule',
    },
    {
      icon: CreditCard,
      title: t.features.f4_title,
      desc: t.features.f4_desc,
      action: () => openBookingModal(),
      actionLabel: lang === 'ar' ? 'احجز بـ Apple Pay / مدى' : 'Pay via Apple Pay / Mada',
    },
    {
      icon: Users,
      title: t.features.f5_title,
      desc: t.features.f5_desc,
      action: () => setActiveTab('admin'),
      actionLabel: lang === 'ar' ? 'استكشف لوحة التحكم' : 'Explore Admin Dashboard',
    },
    {
      icon: Award,
      title: t.features.f6_title,
      desc: t.features.f6_desc,
      action: () => setActiveTab('student'),
      actionLabel: lang === 'ar' ? 'نماذج الشهادات المعتمدة' : 'Verified Certificates',
    },
  ];

  return (
    <section className="py-16 sm:py-20 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#060913]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-semibold mb-3">
            <Sparkles className="size-3.5" />
            <span>{lang === 'ar' ? 'معايير التميز والإتقان الأكاديمي' : 'Standards of Academic Excellence'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.features.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t.features.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-start">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className={`k rounded-3xl p-7 border transition-all duration-300 flex flex-col justify-between ${
                  feat.highlight
                    ? 'border-cyan-500/40 bg-gradient-to-b from-cyan-500/5 via-white to-white dark:from-cyan-950/20 dark:via-[#0c1224] dark:to-[#0c1224] shadow-xl'
                    : 'border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#0c1224] hover:border-cyan-500/30 shadow-sm'
                }`}
              >
                <div>
                  <div className="size-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-5">
                    <Icon className="size-6" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
                  <button
                    onClick={feat.action}
                    className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{feat.actionLabel}</span>
                    <span>{lang === 'ar' ? '←' : '→'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
