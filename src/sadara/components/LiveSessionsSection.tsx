import React from 'react';
import { useApp } from '../context/AppContext';
import { SESSIONS, SITE_INFO } from '../data/mockData';
import {
  Video,
  Clock,
  User,
  Users,
  ExternalLink,
  Radio,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export const LiveSessionsSection: React.FC = () => {
  const { lang, t, openBookingModal } = useApp();
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section className="py-16 sm:py-20 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#070b18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-semibold mb-3">
              <Radio className="size-3.5 text-cyan-500 animate-pulse" />
              <span>{lang === 'ar' ? 'مباشر عبر Zoom & Google Meet' : 'Live on Zoom & Google Meet'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t.sessions.title}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {t.sessions.subtitle}
            </p>
          </div>

          <button
            onClick={() => openBookingModal()}
            className="self-start md:self-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-cyan-500 border border-cyan-500/30 hover:bg-cyan-500/10 transition flex items-center gap-2 cursor-pointer"
          >
            <span>{lang === 'ar' ? 'احجز جلسة خاصة بك' : 'Book a Private Session'}</span>
            <Arrow className="size-4" />
          </button>
        </div>

        {/* Sessions Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {SESSIONS.map((session) => {
            const isLive = session.status === 'live';
            const isZoom = session.platform === 'zoom';

            return (
              <div
                key={session.id}
                className="k rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1428] p-6 shadow-md hover:border-cyan-500/40 transition flex flex-col justify-between text-start"
              >
                <div>
                  {/* Top status bar */}
                  <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-white/5">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                      {lang === 'ar'
                        ? session.track
                        : (session.id === 's-1'
                          ? 'Verbal Qudrat'
                          : session.id === 's-2'
                          ? 'Quantitative Math'
                          : session.id === 's-3'
                          ? 'Tahsili Chemistry'
                          : 'Interactive Simulator')}
                    </span>

                    {isLive ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                        <span className="size-2 rounded-full bg-rose-500 animate-ping" />
                        {t.sessions.liveNow}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="size-3.5 text-slate-400" />
                        {session.duration}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-4 leading-snug">
                    {lang === 'ar' ? session.title : session.titleEn}
                  </h3>

                  {/* Instructor & Timing */}
                  <div className="mt-4 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <User className="size-4 text-cyan-500" />
                      <span>
                        {lang === 'ar'
                          ? `المحاضر: ${session.instructor}`
                          : `Instructor: ${SITE_INFO.instructorEn}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-blue-500" />
                      <span>{session.when}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      <Users className="size-4 text-emerald-500" />
                      <span>
                        {lang === 'ar'
                          ? `تم تسجيل ${session.enrolledCount} طالب • متبقي ${session.seatsLeft} مقاعد`
                          : `${session.enrolledCount} Students Enrolled • ${session.seatsLeft} Seats Left`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-3">
                  <span className="text-xs font-mono text-slate-500">
                    {lang === 'ar'
                      ? `المنصة: ${isZoom ? 'Zoom Meetings' : 'Google Meet'}`
                      : `Platform: ${isZoom ? 'Zoom Meetings' : 'Google Meet'}`}
                  </span>

                  <a
                    href={session.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition cursor-pointer ${
                      isLive
                        ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                        : isZoom
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                    }`}
                  >
                    <Video className="size-4" />
                    <span>{isZoom ? t.sessions.joinZoom : t.sessions.joinMeet}</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
