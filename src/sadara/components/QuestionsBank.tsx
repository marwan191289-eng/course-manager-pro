import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Question } from '../types';
import {
  Brain,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Search,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuestionsBank: React.FC = () => {
  const { lang, answeredQuestions, submitAnswer, resetQuizProgress, questions } = useApp();

  const [activeTrack, setActiveTrack] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const tracks = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All Tracks' },
    { id: 'كمي', labelAr: 'قدرات كمي', labelEn: 'Quantitative' },
    { id: 'لفظي', labelAr: 'قدرات لفظي', labelEn: 'Verbal' },
    { id: 'تحصيلي_كيمياء', labelAr: 'تحصيلي كيمياء', labelEn: 'Chemistry' },
    { id: 'تحصيلي_فيزياء', labelAr: 'تحصيلي فيزياء', labelEn: 'Physics' },
    { id: 'تحصيلي_أحياء', labelAr: 'تحصيلي أحياء', labelEn: 'Biology' },
    { id: 'نووية', labelAr: 'كيمياء نووية', labelEn: 'Nuclear' },
  ];

  const filteredQuestions = questions.filter((q) => {
    const matchesTrack = activeTrack === 'all' || q.track === activeTrack;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      q.q.toLowerCase().includes(query) ||
      q.explain.toLowerCase().includes(query) ||
      q.qEn.toLowerCase().includes(query);
    return matchesTrack && matchesSearch;
  });

  const totalAnswered = Object.keys(answeredQuestions).length;
  const totalCorrect = Object.entries(answeredQuestions).filter(
    ([id, ans]) => questions.find((q) => q.id === Number(id))?.answer === ans
  ).length;

  const handlePickAnswer = (question: Question, optionIdx: number) => {
    if (answeredQuestions[question.id] !== undefined) return;
    submitAnswer(question.id, optionIdx);

    if (optionIdx === question.answer) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  return (
    <section className="py-16 sm:py-20 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#060913]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-semibold mb-3">
            <Brain className="size-4" />
            <span>
              {lang === 'ar'
                ? 'بنك الأسئلة الذكي والتجميعات المحلولة خطوة بخطوة'
                : 'Smart Question Bank & Step-by-Step Solutions'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {lang === 'ar' ? 'اختبر جاهزيتك للاختبار الحقيقي' : 'Test Your Real Exam Readiness'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {lang === 'ar'
              ? 'نماذج قياس المعتمدة مع التفسير العلمي الدقيق لكل مسألة بواسطة المهندس محمود شلتوت.'
              : 'Certified Qiyas questions with in-depth scientific explanations by Eng. Mahmoud Shaltoot.'}
          </p>
        </div>

        {/* Score & Progress banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/20 via-cyan-900/20 to-slate-900/30 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4 text-start">
            <div className="size-12 rounded-xl bg-cyan-500/20 text-cyan-500 dark:text-cyan-400 flex items-center justify-center font-black text-xl">
              {totalCorrect}/{totalAnswered}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {lang === 'ar' ? 'درجة الاختبار الحالي' : 'Current Quiz Score'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'ar'
                  ? `أجبت على ${totalAnswered} من أصل ${questions.length} سؤال`
                  : `Answered ${totalAnswered} of ${questions.length} questions`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {totalAnswered > 0 && (
              <button
                onClick={resetQuizProgress}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                <span>{lang === 'ar' ? 'إعادة الاختبار' : 'Retake Quiz'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
          {/* Tracks pills */}
          <div className="flex flex-wrap gap-1.5">
            {tracks.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTrack(t.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTrack === t.id
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-cyan-500'
                }`}
              >
                {lang === 'ar' ? t.labelAr : t.labelEn}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="size-4 text-slate-400 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'ابحث في الأسئلة...' : 'Search questions...'}
              className="w-full ltr:pl-9 rtl:pr-9 py-2 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {filteredQuestions.map((q, qIndex) => {
            const picked = answeredQuestions[q.id];
            const isAnswered = picked !== undefined;
            const isCorrect = isAnswered && picked === q.answer;

            return (
              <div
                key={q.id}
                className="k rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224] p-6 shadow-md transition hover:border-cyan-500/30 text-start"
              >
                {/* Question metadata badge */}
                <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="size-6 rounded-lg bg-cyan-500/15 text-cyan-500 flex items-center justify-center font-black text-xs">
                      {qIndex + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {lang === 'ar' ? q.track : q.trackEn}
                    </span>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 font-medium">
                    {lang === 'ar' ? `مستوى: ${q.difficulty}` : `Level: ${q.difficulty}`}
                  </span>
                </div>

                {/* Question text */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                  {lang === 'ar' ? q.q : q.qEn}
                </h3>

                {/* Options grid */}
                <div className="mt-5 grid sm:grid-cols-2 gap-3">
                  {(lang === 'ar' ? q.options : q.optionsEn).map((option, idx) => {
                    let optionStyle =
                      'border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/5';

                    if (isAnswered) {
                      if (idx === q.answer) {
                        optionStyle =
                          'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 font-bold';
                      } else if (idx === picked) {
                        optionStyle =
                          'border-rose-500 bg-rose-500/15 text-rose-600 dark:text-rose-300 font-bold';
                      } else {
                        optionStyle = 'opacity-40 border-slate-200 dark:border-white/5';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handlePickAnswer(q, idx)}
                        className={`p-3.5 rounded-xl border text-xs sm:text-sm text-start font-medium transition cursor-pointer flex items-center justify-between ${optionStyle}`}
                      >
                        <span>{option}</span>
                        {isAnswered && idx === q.answer && (
                          <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                        )}
                        {isAnswered && idx === picked && idx !== q.answer && (
                          <XCircle className="size-4 text-rose-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation block */}
                {isAnswered && (
                  <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    <div className="flex items-center gap-1.5 font-bold text-cyan-500 mb-1">
                      <HelpCircle className="size-4" />
                      <span>{lang === 'ar' ? 'طريقة الحل والشرح النموذجي:' : 'Solution & Explanation:'}</span>
                    </div>
                    <p>{lang === 'ar' ? q.explain : q.explainEn}</p>
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
