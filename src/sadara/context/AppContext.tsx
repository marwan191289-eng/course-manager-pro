import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, Theme, UserRole, UserProfile, Booking, Question, TeacherRating, Article } from '../types';
import { translations } from '../lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { computeStudentCount } from '../lib/studentCounter';

type NewBooking = Omit<Booking, 'id' | 'createdAt' | 'status' | 'paymentStatus' | 'meetingUrl' | 'reminderSent' | 'paymentMethod'> & { weekday: string };

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  t: typeof translations.ar;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAdmin: boolean;
  authReady: boolean;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  socialLogin: (provider: string) => Promise<string | null>;
  emailSignIn: (email: string, password: string) => Promise<string | null>;
  emailSignUp: (name: string, email: string, password: string) => Promise<string | null>;
  sendPasswordReset: (email: string) => Promise<string | null>;
  logout: () => void;
  bookings: Booking[];
  addBooking: (booking: NewBooking) => Promise<Booking | null>;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  markBookingPaid: (id: string) => void;
  deleteBooking: (id: string) => void;
  answeredQuestions: Record<number, number>;
  submitAnswer: (questionId: number, optionIdx: number) => void;
  resetQuizProgress: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openBookingModal: (preselectedCourse?: string) => void;
  closeBookingModal: () => void;
  isBookingModalOpen: boolean;
  selectedCourseForBooking: string | undefined;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  openCertificateModal: (courseName?: string) => void;
  closeCertificateModal: () => void;
  isCertificateModalOpen: boolean;
  certificateCourse: string;
  notifications: Array<{ id: string; title: string; message: string; time: string; type: string }>;
  addNotification: (title: string, message: string, type?: string) => void;
  dismissNotification: (id: string) => void;
  studentCount: number;
  formattedStudentCount: string;
  ratings: TeacherRating[];
  addRating: (rating: Omit<TeacherRating, 'id' | 'status' | 'date'>) => void;
  approveRating: (id: string) => void;
  deleteRating: (id: string) => void;
  questions: Question[];
  deleteQuestion: (id: number) => void;
  addQuestion: (q: Question) => void;
  articles: Article[];
  deleteArticle: (id: string) => void;
  addArticle: (art: Article) => void;
}

const guestUser: UserProfile = {
  id: '',
  name: '',
  email: '',
  phone: '',
  role: 'student',
  avatar: '',
  enrolledCourses: [],
  completedLessons: [],
  testScores: [],
  badges: [],
  twoFactorEnabled: false,
  activeDevicesCount: 1,
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const mapBooking = (r: any): Booking => ({
  id: r.id,
  studentName: r.student_name,
  studentPhone: r.student_phone,
  studentEmail: r.student_email,
  courseOrTrack: r.course_or_track,
  date: r.booking_date,
  weekday: r.weekday,
  timeSlot: r.time_slot,
  platform: r.platform,
  status: r.status,
  meetingUrl: r.meeting_url ?? '',
  price: r.price,
  paymentMethod: 'visa',
  paymentStatus: r.payment_status,
  country: r.country ?? undefined,
  notes: r.notes ?? undefined,
  reminderSent: false,
  createdAt: r.created_at,
});

const mapRating = (r: any): TeacherRating => ({
  id: r.id,
  studentName: r.student_name,
  sessionTitle: r.session_title,
  rating: r.rating,
  clarity: r.clarity,
  timeManagement: r.time_management,
  problemSolving: r.problem_solving,
  comment: r.comment,
  date: new Date(r.created_at).toLocaleDateString('ar-SA'),
  status: r.status,
});

const mapArticle = (r: any): Article => ({
  id: r.id,
  title: r.title,
  titleEn: r.title_en,
  category: r.category,
  readTime: r.read_time,
  date: String(r.created_at).slice(0, 10),
  views: r.views,
  summary: r.summary,
  summaryEn: r.summary_en,
  content: r.content,
});

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => (localStorage.getItem('sadara_lang') as Language) || 'ar');
  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem('sadara_theme') as Theme) || 'dark');

  const [userRole, setUserRole] = useState<UserRole>('student');
  const [isAdmin, setIsAdmin] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<UserProfile>(guestUser);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [studentCount, setStudentCount] = useState<number>(() => computeStudentCount(Date.now()));
  useEffect(() => {
    const i = setInterval(() => setStudentCount(computeStudentCount(Date.now())), 60_000);
    return () => clearInterval(i);
  }, []);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [ratings, setRatings] = useState<TeacherRating[]>([]);
  const [questions, setQuestions] = useState<(Question & { dbId?: string })[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  const [answeredQuestions, setAnsweredQuestions] = useState<Record<number, number>>({});
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedCourseForBooking, setSelectedCourseForBooking] = useState<string | undefined>(undefined);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [certificateCourse, setCertificateCourse] = useState('برنامج التميز في القدرات والتحصيلي والكيمياء النووية');
  const [notifications, setNotifications] = useState<AppContextType['notifications']>([]);

  const addNotification = (title: string, message: string, type: string = 'system') => {
    setNotifications((prev) => [{ id: 'n-' + Date.now() + Math.random(), title, message, time: 'الآن', type }, ...prev].slice(0, 20));
  };
  const dismissNotification = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  // ---------- Data loading ----------
  const loadPublic = useCallback(async () => {
    const [{ data: q }, { data: a }, { data: r }] = await Promise.all([
      supabase.from('questions').select('*').order('created_at'),
      supabase.from('articles').select('*').order('created_at', { ascending: false }),
      supabase.from('ratings').select('*').order('created_at', { ascending: false }),
    ]);
    setQuestions((q ?? []).map((row: any) => ({ ...(row.data as Question), dbId: row.id })));
    setArticles((a ?? []).map(mapArticle));
    setRatings((r ?? []).map(mapRating));
  }, []);

  const loadBookings = useCallback(async () => {
    const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    setBookings((data ?? []).map(mapBooking));
  }, []);

  const applySession = useCallback(
    async (sessionUser: { id: string; email?: string; user_metadata?: any } | null) => {
      if (!sessionUser) {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setUser(guestUser);
        setBookings([]);
        setAuthReady(true);
        loadPublic();
        return;
      }
      setIsLoggedIn(true);
      const meta = sessionUser.user_metadata ?? {};
      const [{ data: profile }, { data: roles }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', sessionUser.id).maybeSingle(),
        supabase.from('user_roles').select('role').eq('user_id', sessionUser.id),
      ]);
      const admin = (roles ?? []).some((r: any) => r.role === 'admin');
      setIsAdmin(admin);
      setUserRole(admin ? 'admin' : 'student');
      setUser({
        ...guestUser,
        id: sessionUser.id,
        name: profile?.full_name || meta.full_name || meta.name || (sessionUser.email ?? '').split('@')[0],
        email: sessionUser.email ?? '',
        phone: profile?.phone ?? '',
        avatar:
          profile?.avatar_url ||
          meta.avatar_url ||
          `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(sessionUser.email ?? 'S')}`,
        role: admin ? 'admin' : 'student',
        enrolledCourses: ['course-1'],
      });
      setAuthReady(true);
      loadBookings();
      loadPublic();
    },
    [loadBookings, loadPublic],
  );

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        setTimeout(() => applySession(session?.user ?? null), 0);
      }
    });
    supabase.auth.getUser().then(({ data }) => applySession(data.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, [applySession]);

  // Realtime refresh of bookings so students see teacher approvals instantly
  useEffect(() => {
    if (!isLoggedIn) return;
    const ch = supabase
      .channel('bookings-' + user.id)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => loadBookings())
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [isLoggedIn, user.id, loadBookings]);

  // ---------- Lang & theme ----------
  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem('sadara_lang', l);
  };
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const setTheme = (th: Theme) => {
    setThemeState(th);
    localStorage.setItem('sadara_theme', th);
  };
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme !== 'dark');
    root.style.colorScheme = theme;
  }, [theme]);

  // ---------- Auth ----------
  const socialLogin = async (provider: string) => {
    const map: Record<string, 'google' | 'apple' | 'microsoft'> = {
      google: 'google',
      icloud: 'apple',
      apple: 'apple',
      microsoft: 'microsoft',
    };
    const p = map[provider];
    if (!p) return 'unsupported';
    const result = await lovable.auth.signInWithOAuth(p, { redirect_uri: window.location.origin });
    if (result.error) return result.error.message ?? String(result.error);
    if (!result.redirected) setIsAuthModalOpen(false);
    return null;
  };

  const emailSignIn = async (email: string, password: string) => {
    const { data: signed, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message === 'Invalid login credentials' ? 'البريد أو كلمة المرور غير صحيحة' : error.message;
    setIsAuthModalOpen(false);
    const { data: rs } = await supabase.from('user_roles').select('role').eq('user_id', signed.user.id);
    setActiveTab((rs ?? []).some((r: any) => r.role === 'admin') ? 'admin' : 'student');
    addNotification('تسجيل الدخول', 'مرحباً بعودتك إلى منصة صدارة.');
    return null;
  };

  const emailSignUp = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
    });
    return error ? error.message : null;
  };

  const sendPasswordReset = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return error ? error.message : null;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setActiveTab('home');
    addNotification('تسجيل الخروج', 'تم تسجيل خروجك بأمان من المنصة.');
  };

  // ---------- Bookings ----------
  const addBooking = async (b: NewBooking) => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return null;
    }
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        student_name: b.studentName,
        student_phone: b.studentPhone,
        student_email: b.studentEmail,
        country: b.country ?? null,
        course_or_track: b.courseOrTrack,
        booking_date: b.date,
        weekday: b.weekday,
        time_slot: b.timeSlot,
        platform: b.platform,
        price: b.price,
        notes: b.notes ?? null,
      })
      .select()
      .single();
    if (error || !data) {
      addNotification('تعذر إرسال الحجز', error?.message ?? 'حاول مرة أخرى', 'error');
      return null;
    }
    const nb = mapBooking(data);
    setBookings((prev) => [nb, ...prev]);
    return nb;
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    const patch = { status, updated_at: new Date().toISOString() };
    const { error } = await supabase.from('bookings').update(patch).eq('id', id);
    if (error) return addNotification('خطأ', error.message, 'error');
    loadBookings();
    addNotification(
      'تحديث الحجز',
      status === 'approved' ? 'تم قبول الحجز — يمكن للطالب الآن إتمام الدفع.' : 'تم تحديث حالة الحجز.',
    );
  };

  const markBookingPaid = async (id: string) => {
    const b = bookings.find((x) => x.id === id);
    const meeting =
      b?.platform === 'meet' ? 'https://meet.google.com/' : 'https://zoom.us/';
    const { error } = await supabase
      .from('bookings')
      .update({ payment_status: 'paid', status: 'confirmed', meeting_url: b?.meetingUrl || meeting })
      .eq('id', id);
    if (error) return addNotification('خطأ', error.message, 'error');
    loadBookings();
  };

  const deleteBooking = async (id: string) => {
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) return addNotification('خطأ', error.message, 'error');
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  // ---------- Ratings ----------
  const addRating = async (r: Omit<TeacherRating, 'id' | 'status' | 'date'>) => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }
    const { error } = await supabase.from('ratings').insert({
      user_id: user.id,
      student_name: r.studentName || user.name,
      session_title: r.sessionTitle,
      rating: r.rating,
      clarity: r.clarity,
      time_management: r.timeManagement,
      problem_solving: r.problemSolving,
      comment: r.comment,
    });
    if (error) return addNotification('خطأ', error.message, 'error');
    addNotification('تم إرسال التقييم', 'سيظهر تقييمك على المنصة فور اعتماده من المدرس.');
    loadPublic();
  };
  const approveRating = async (id: string) => {
    await supabase.from('ratings').update({ status: 'approved' }).eq('id', id);
    loadPublic();
  };
  const deleteRating = async (id: string) => {
    await supabase.from('ratings').delete().eq('id', id);
    setRatings((prev) => prev.filter((r) => r.id !== id));
  };

  // ---------- Questions & Articles ----------
  const deleteQuestion = async (id: number) => {
    const q = questions.find((x) => x.id === id);
    if (!q?.dbId) return;
    await supabase.from('questions').delete().eq('id', q.dbId);
    setQuestions((prev) => prev.filter((x) => x.id !== id));
  };
  const addQuestion = async (q: Question) => {
    const { error } = await supabase.from('questions').insert({ data: q as any });
    if (error) return addNotification('خطأ', error.message, 'error');
    loadPublic();
  };
  const deleteArticle = async (id: string) => {
    await supabase.from('articles').delete().eq('id', id);
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };
  const addArticle = async (a: Article) => {
    const { error } = await supabase.from('articles').insert({
      title: a.title,
      title_en: a.titleEn,
      category: a.category,
      read_time: a.readTime,
      summary: a.summary,
      summary_en: a.summaryEn,
      content: a.content,
    });
    if (error) return addNotification('خطأ', error.message, 'error');
    loadPublic();
  };

  const submitAnswer = (questionId: number, optionIdx: number) =>
    setAnsweredQuestions((prev) => ({ ...prev, [questionId]: optionIdx }));
  const resetQuizProgress = () => setAnsweredQuestions({});

  const openBookingModal = (course?: string) => {
    setSelectedCourseForBooking(course);
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      addNotification('سجّل الدخول أولاً', 'يرجى تسجيل الدخول أو إنشاء حساب لإتمام الحجز.');
      return;
    }
    setIsBookingModalOpen(true);
  };

  const t = translations[lang];

  return (
    <AppContext.Provider
      value={{
        lang, setLang, theme, setTheme, toggleTheme, t,
        userRole, setUserRole, isAdmin, authReady,
        user, setUser, isLoggedIn, setIsLoggedIn,
        socialLogin, emailSignIn, emailSignUp, sendPasswordReset, logout,
        bookings, addBooking, updateBookingStatus, markBookingPaid, deleteBooking,
        answeredQuestions, submitAnswer, resetQuizProgress,
        activeTab, setActiveTab,
        openBookingModal, closeBookingModal: () => setIsBookingModalOpen(false),
        isBookingModalOpen, selectedCourseForBooking,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        isAuthModalOpen,
        openCertificateModal: (c?: string) => {
          if (c) setCertificateCourse(c);
          setIsCertificateModalOpen(true);
        },
        closeCertificateModal: () => setIsCertificateModalOpen(false),
        isCertificateModalOpen, certificateCourse,
        notifications, addNotification, dismissNotification,
        studentCount, formattedStudentCount: `+${studentCount.toLocaleString('en-US')}`,
        ratings, addRating, approveRating, deleteRating,
        questions, deleteQuestion, addQuestion,
        articles, deleteArticle, addArticle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
