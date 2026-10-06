import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FAQ_LIST } from '../data/mockData';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const { lang, t } = useApp();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-20 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#070b18]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-semibold mb-3">
            <HelpCircle className="size-3.5" />
            <span>إجابات وافية وموثوقة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.faq.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t.faq.subtitle}
          </p>
        </div>

        <div className="space-y-3.5">
          {FAQ_LIST.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224] overflow-hidden shadow-sm transition text-start"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-start font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center justify-between gap-4 cursor-pointer hover:text-cyan-500"
                >
                  <span>{lang === 'ar' ? item.qAr : item.qEn}</span>
                  <ChevronDown
                    className={`size-4 text-cyan-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5">
                    {lang === 'ar' ? item.aAr : item.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
