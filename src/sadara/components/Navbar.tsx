import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SITE_INFO } from '../data/mockData';
import {
  Moon,
  Sun,
  Globe,
  Menu,
  X,
  Bell,
  Atom,
  GraduationCap,
  Calendar,
  Shield,
  BookOpen,
  Brain,
  FileText,
  Sparkles,
  User,
  LogIn,
  CheckCircle2,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    lang,
    setLang,
    theme,
    toggleTheme,
    userRole,
    setUserRole,
    activeTab,
    setActiveTab,
    openBookingModal,
    openAuthModal,
    isLoggedIn,
    user,
    notifications,
    dismissNotification,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  // Menu items corresponding to the user's reference image & requests
  const navItems = [
    { id: 'home', labelAr: 'الرئيسية', labelEn: 'Home', icon: null },
    { id: 'courses', labelAr: 'الدورات', labelEn: 'Courses', icon: BookOpen },
    { id: 'quiz', labelAr: 'اختبار المستوى', labelEn: 'Placement Test', icon: Brain },
    { id: 'articles', labelAr: 'المقالات', labelEn: 'Articles', icon: FileText },
    { id: 'teacher', labelAr: 'من أنا', labelEn: 'About Instructor', icon: GraduationCap },
    { id: 'booking', labelAr: 'الحجز', labelEn: 'Booking', icon: Calendar },
    { id: 'reactor', labelAr: 'المحاكي', labelEn: 'Simulator', icon: Atom, highlight: true },
    { id: 'student', labelAr: 'خطة ذكية ✨', labelEn: 'Smart Plan ✨', icon: Sparkles, plan: true },
    { id: 'admin', labelAr: 'الإدارة', labelEn: 'Admin', icon: Shield, admin: true },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#060913]/95 backdrop-blur-xl transition-colors duration-200">
      {/* Top micro-bar with fixed LTR phone formatting */}
      <div className="hidden lg:block border-b border-slate-200/80 dark:border-white/5 bg-slate-100/70 dark:bg-slate-950/70 text-[12px] py-1.5 px-6 text-slate-600 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-semibold">
              <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{lang === 'ar' ? SITE_INFO.locationAr : SITE_INFO.locationEn}</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              {lang === 'ar' ? 'إشراف:' : 'Supervised by:'}{' '}
              <strong className="text-slate-900 dark:text-white">
                {lang === 'ar' ? SITE_INFO.instructorAr : SITE_INFO.instructorEn}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* LTR isolated phone number to prevent reverse RTL flipping */}
            <a
              href={SITE_INFO.socials.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1.5 font-bold transition"
            >
              <bdi dir="ltr" className="inline-block font-mono tracking-wider">
                +966 59 475 6878
              </bdi>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 px-2 py-0.5 rounded-full font-sans">
                {lang === 'ar' ? 'واتساب معتمد' : 'WhatsApp'}
              </span>
            </a>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <a
              href={`mailto:${SITE_INFO.email}`}
              className="text-slate-600 dark:text-slate-300 hover:text-cyan-500 transition font-mono text-[11px]"
            >
              {SITE_INFO.email}
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <button
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 text-start group cursor-pointer shrink-0"
        >
          <div className="relative size-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 p-0.5 shadow-md shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition">
            <div className="w-full h-full bg-[#0a0f1d] rounded-[10px] flex items-center justify-center overflow-hidden">
              <Atom className="size-5 text-cyan-400" />
            </div>
          </div>
          <div className="leading-tight">
            <div className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              <span>{lang === 'ar' ? SITE_INFO.nameAr : SITE_INFO.nameEn}</span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                1447
              </span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
              {lang === 'ar' ? 'الكيمياء والقدرات والتحصيلي' : 'Nuclear Chem & Qudrat'}
            </div>
          </div>
        </button>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 text-[13px] font-semibold text-slate-700 dark:text-slate-300">
          {navItems.map((item) => {
            const isActive =
              (activeTab === item.id) ||
              (item.id === 'quiz' && activeTab === 'courses') ||
              (item.id === 'articles' && activeTab === 'courses');

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'booking') {
                    openBookingModal();
                  } else if (item.id === 'quiz') {
                    setActiveTab('courses');
                    window.scrollTo({ top: 700, behavior: 'smooth' });
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  isActive
                    ? 'text-cyan-600 dark:text-cyan-400 font-bold bg-cyan-500/10 dark:bg-cyan-500/15'
                    : item.plan
                    ? 'text-cyan-600 dark:text-cyan-300 font-bold hover:bg-cyan-500/10'
                    : item.admin
                    ? 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    : 'hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {item.admin && <span className="text-xs">🔒</span>}
                <span>{lang === 'ar' ? item.labelAr : item.labelEn}</span>
                {item.highlight && (
                  <span className="size-1.5 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls: Lang, Book Session, Auth, Theme, Notifications */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Language Switcher (EN / عربي) */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-white/15 text-xs font-bold text-slate-800 dark:text-white hover:border-cyan-500 hover:text-cyan-500 transition cursor-pointer flex items-center gap-1"
            title="تبديل اللغة / Switch Language"
          >
            <Globe className="size-3.5 text-cyan-500" />
            <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Book Session Outline Button */}
          <button
            onClick={() => openBookingModal()}
            className="hidden sm:inline-flex px-3.5 py-1.5 rounded-full border-2 border-cyan-500/80 hover:border-cyan-400 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 font-bold text-xs transition cursor-pointer"
          >
            {lang === 'ar' ? 'احجز جلسة' : 'Book Session'}
          </button>

          {/* Login / Register Vibrant Button */}
          <button
            onClick={openAuthModal}
            className="px-3.5 py-1.5 rounded-full font-bold text-xs text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-md shadow-cyan-500/30 transition cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <User className="size-3.5" />
            <span className="line-clamp-1">
              {isLoggedIn
                ? user.name.split(' ')[0]
                : lang === 'ar'
                ? 'دخول / إنشاء حساب'
                : 'Sign In / Register'}
            </span>
          </button>

          {/* Theme Switcher (Sun / Moon) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
            title={theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="size-4 text-amber-400" />
            ) : (
              <Moon className="size-4 text-blue-600" />
            )}
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 relative transition cursor-pointer"
              title="التنبيهات"
            >
              <Bell className="size-4" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 size-4 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute ltr:right-0 rtl:left-0 mt-2 w-80 max-w-[90vw] bg-white dark:bg-[#0d1224] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-4 z-50 text-start">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                  <h4 className="font-bold text-xs text-slate-800 dark:text-white flex items-center gap-1.5">
                    <Bell className="size-3.5 text-cyan-500" />
                    <span>{lang === 'ar' ? 'التنبيهات والإشعارات' : 'Notifications'}</span>
                  </h4>
                  <span className="text-[10px] bg-cyan-500/10 text-cyan-500 px-2 py-0.5 rounded-full font-bold">
                    {notifications.length}
                  </span>
                </div>
                <div className="mt-2.5 space-y-2 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-xs flex justify-between gap-2"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{n.title}</div>
                        <div className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">
                          {n.message}
                        </div>
                      </div>
                      <button
                        onClick={() => dismissNotification(n.id)}
                        className="text-slate-400 hover:text-rose-500 text-xs self-start"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#060913] px-6 py-5 shadow-2xl text-start">
          <div className="space-y-1 mb-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'booking') {
                    openBookingModal();
                  } else {
                    setActiveTab(item.id);
                  }
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <span>{lang === 'ar' ? item.labelAr : item.labelEn}</span>
                {item.plan && <span className="text-[10px] text-cyan-500">✨ جديد</span>}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openBookingModal();
              }}
              className="w-full py-2.5 rounded-full font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-cyan-500 text-center shadow-md cursor-pointer"
            >
              {lang === 'ar' ? 'احجز جلستك الآن (150 / 650 / 1200 ر.س)' : 'Book Session Now'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
