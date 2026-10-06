import React from 'react';
import { useApp } from '../context/AppContext';
import { SITE_INFO } from '../data/mockData';
import {
  Atom,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Share2,
  Calendar,
  BookOpen,
  GraduationCap,
  Shield,
  User,
  Heart,
} from 'lucide-react';

interface Props {
  onOpenSocialModal: () => void;
}

export const Footer: React.FC<Props> = ({ onOpenSocialModal }) => {
  const { lang, t, setActiveTab, openBookingModal } = useApp();

  const quickLinks = [
    { id: 'home', label: lang === 'ar' ? 'الرئيسية' : 'Home' },
    { id: 'courses', label: lang === 'ar' ? 'الدورات المتاحة والتسجيل' : 'Available Courses' },
    { id: 'reactor', label: lang === 'ar' ? 'محاكي قلب المفاعل الحي' : 'Live Reactor Simulator', highlight: true },
    { id: 'teacher', label: lang === 'ar' ? 'صفحة المدرس محمود شلتوت' : 'Eng. Mahmoud Shaltoot' },
    { id: 'student', label: lang === 'ar' ? 'بوابة الطالب والدروس' : 'Student Portal & Lessons' },
    { id: 'booking', label: lang === 'ar' ? 'حجز جلسة' : 'Book a Session' },
    { id: 'admin', label: lang === 'ar' ? 'الإدارة والتحكم' : 'Admin Control' },
  ];

  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-slate-900 dark:bg-[#040711] text-white">
      {/* Upper Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-12">
          {/* Brand Info (Col 5) */}
          <div className="lg:col-span-5 text-start space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-[#080d1d] rounded-[10px] flex items-center justify-center">
                  <Atom className="size-6 text-cyan-400" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white">
                  {lang === 'ar' ? SITE_INFO.nameAr : SITE_INFO.nameEn}
                </span>
                <span className="block text-xs text-cyan-400 font-semibold">
                  {SITE_INFO.taglineAr}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {t.footer.desc}
            </p>

            {/* Social Links Icons */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <a
                href={SITE_INFO.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="size-9 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-white/10 flex items-center justify-center transition"
                title="واتساب"
              >
                <Phone className="size-4" />
              </a>

              <a
                href={SITE_INFO.socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="size-9 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 border border-white/10 flex items-center justify-center transition font-bold text-xs"
                title="تيك توك"
              >
                TikTok
              </a>

              <a
                href={SITE_INFO.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="size-9 rounded-xl bg-white/5 hover:bg-pink-500/20 text-slate-300 hover:text-pink-400 border border-white/10 flex items-center justify-center transition font-bold text-xs"
                title="إنستغرام"
              >
                IG
              </a>

              <a
                href={SITE_INFO.socials.x}
                target="_blank"
                rel="noopener noreferrer"
                className="size-9 rounded-xl bg-white/5 hover:bg-sky-500/20 text-slate-300 hover:text-sky-400 border border-white/10 flex items-center justify-center transition font-black text-xs"
                title="إكس (تويتر)"
              >
                𝕏
              </a>

              <a
                href={SITE_INFO.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="size-9 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-white/10 flex items-center justify-center transition font-bold text-xs"
                title="يوتيوب"
              >
                YT
              </a>

              {/* Share modal trigger */}
              <button
                onClick={onOpenSocialModal}
                className="px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition"
                title="معاينة بطاقات التواصل وSEO"
              >
                <Share2 className="size-3.5" />
                <span>مشاركة المنصة</span>
              </button>
            </div>
          </div>

          {/* Quick Links (Col 3) */}
          <div className="lg:col-span-3 text-start">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-white/10">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      if (link.id === 'booking') {
                        openBookingModal();
                      } else {
                        setActiveTab(link.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={`hover:text-cyan-400 transition cursor-pointer flex items-center gap-1.5 ${
                      link.highlight ? 'text-cyan-400 font-semibold' : ''
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.highlight && (
                      <span className="size-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Contact Info (Col 4) */}
          <div className="lg:col-span-4 text-start">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-white/10">
              {t.footer.contactUs}
            </h4>
            <div className="space-y-3.5 text-xs sm:text-sm text-slate-400">
              <div>
                <span className="text-slate-500 block text-xs mb-1">{t.footer.phone}</span>
                <a
                  href={SITE_INFO.socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-emerald-400 font-mono font-bold text-base flex items-center gap-2 transition"
                >
                  <Phone className="size-4 text-emerald-400" />
                  <bdi dir="ltr" className="inline-block font-mono tracking-wider">
                    +966 59 475 6878
                  </bdi>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-sans">
                    {lang === 'ar' ? 'واتساب فوري' : 'WhatsApp'}
                  </span>
                </a>
              </div>

              <div>
                <span className="text-slate-500 block text-xs mb-1">{t.footer.email}</span>
                <a
                  href={`mailto:${SITE_INFO.email}`}
                  className="text-slate-300 hover:text-cyan-400 flex items-center gap-2 transition"
                >
                  <Mail className="size-4 text-cyan-400" />
                  <span>{SITE_INFO.email}</span>
                </a>
              </div>

              <div>
                <span className="text-slate-500 block text-xs mb-1">{t.footer.geo}</span>
                <div className="text-slate-300 flex items-start gap-2">
                  <MapPin className="size-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{lang === 'ar' ? SITE_INFO.locationAr : SITE_INFO.locationEn}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar — Exact Copyright matching the user's uploaded banner */}
      <div className="border-t border-white/10 bg-black/40 py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="text-center md:text-start leading-relaxed">
            {lang === 'ar' ? SITE_INFO.copyrightAr : SITE_INFO.copyrightEn}
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-950/40 text-white font-mono text-xs shadow-sm">
              <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Made by Marwan Negm</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
