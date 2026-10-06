import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Theme, UserRole, UserProfile, Booking, Question, TeacherRating, Article } from '../types';
import { translations } from '../lib/i18n';
import { INITIAL_BOOKINGS, QUESTIONS as DEFAULT_QUESTIONS, INITIAL_RATINGS } from '../data/mockData';

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  t: typeof translations.ar;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  socialLogin: (provider: string) => void;
  logout: () => void;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
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

const defaultUser: UserProfile = {
  id: 'usr-1447',
  name: 'محمد بن عبد الله الشمري',
  email: 'm.alshammari@gmail.com',
  phone: '+966 59 123 4567',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  enrolledCourses: ['course-1', 'course-2'],
  completedLessons: ['l-1', 'l-2', 'l-3', 'l-4'],
  testScores: [
    { quizTitle: 'اختبار محاكاة القدرات الكمي الأول', score: 96, total: 100, date: '2026-10-02' },
    { quizTitle: 'اختبار الكيمياء النووية والتحصيلي', score: 98, total: 100, date: '2026-10-04' },
    { quizTitle: 'التناظر اللفظي واستيعاب المقروء', score: 94, total: 100, date: '2026-10-05' },
  ],
  badges: ['خبير القدرات الذهبي', 'مهندس التفاعلات النووية', 'حاصد الـ +95', 'سفير صدارة المتميز'],
  twoFactorEnabled: true,
  activeDevicesCount: 2,
};

const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'خريطة التفوق في قدرات 1447: كيف تبدأ المذاكرة بدون تشتت؟',
    titleEn: 'Roadmap to Excellence in Qudrat 1447: How to Study Without Distraction',
    category: 'قدرات عامة',
    readTime: '5 دقائق',
    date: '2026-10-01',
    views: 3420,
    summary: 'خطوات عملية لتقسيم وقت المذاكرة وإتقان القوانين الذهبية للجزء الكمي واستيعاب المقروء.',
    summaryEn: 'Practical steps to organize your study schedule and master the golden rules for quantitative and verbal sections.',
    content: 'المذاكرة الذكية تبدأ بالتشخيص الدقيق لنقاط الضعف واستخدام استراتيجيات الحل السريع بدلاً من الحل التقليدي المطول...',
  },
  {
    id: 'art-2',
    title: 'أسرار الكيمياء النووية في اختبار التحصيلي: موازنة الانشطار وحساب النيوترونات',
    titleEn: 'Secrets of Nuclear Chemistry in Tahsili: Fission Balancing & Neutron Flux',
    category: 'تحصيلي علمي',
    readTime: '7 دقائق',
    date: '2026-10-03',
    views: 2890,
    summary: 'شرح مبسط لقوانين حفظ العدد الكتلي والذري وتطبيقات إشعاع شيرينكوف وقضبان التحكم.',
    summaryEn: 'Intuitive breakdown of mass and atomic number conservation laws, Cherenkov radiation, and control rods.',
    content: 'في التفاعلات النووية، مجموع الأعداد الكتلية ومجموع الأعداد الذرية في المتفاعلات يساوي النواتج دوماً...',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('sadara_lang') as Language) || 'ar';
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('sadara_theme') as Theme) || 'dark';
  });

  const [userRole, setUserRole] = useState<UserRole>('student');
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Dynamic realistic student count timer
  const [studentCount, setStudentCount] = useState<number>(() => {
    // Rational timer based on real hours: roughly +1 every hour, +3 every 2 hours
    const epochRef = 1760000000000;
    const hoursElapsed = Math.max(0, Math.floor((Date.now() - epochRef) / (1000 * 60 * 60)));
    // Pattern: 1, 2, 1, 3, 1, 2...
    let rationalGrowth = 0;
    for (let h = 0; h < (hoursElapsed % 500); h++) {
      rationalGrowth += (h % 3 === 0 ? 2 : (h % 5 === 0 ? 3 : 1));
    }
    return 12419 + (rationalGrowth % 120);
  });

  useEffect(() => {
    // Subtle real-time increment every 60 seconds
    const interval = setInterval(() => {
      setStudentCount((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('sadara_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [ratings, setRatings] = useState<TeacherRating[]>(() => {
    const saved = localStorage.getItem('sadara_ratings');
    return saved ? JSON.parse(saved) : INITIAL_RATINGS;
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem('sadara_questions');
    return saved ? JSON.parse(saved) : DEFAULT_QUESTIONS;
  });

  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('sadara_articles');
    return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
  });

  const [answeredQuestions, setAnsweredQuestions] = useState<Record<number, number>>({});
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedCourseForBooking, setSelectedCourseForBooking] = useState<string | undefined>(undefined);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [certificateCourse, setCertificateCourse] = useState('برنامج التميز في القدرات والتحصيلي والكيمياء النووية');

  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; message: string; time: string; type: string }>>([
    {
      id: 'notif-1',
      title: 'مرحباً بك في منصة صدارة!',
      message: 'تم تفعيل حسابك بنجاح بإشراف المهندس محمود إسماعيل شلتوت.',
      time: 'الآن',
      type: 'system',
    },
    {
      id: 'notif-2',
      title: 'جلسة قادمة غداً',
      message: 'تذكير: لديك جلسة قدرات كمي في تمام الساعة 7:00 م عبر Zoom.',
      time: 'منذ ساعة',
      type: 'booking',
    },
  ]);

  const addNotification = (title: string, message: string, type: string = 'system') => {
    const newNotif = {
      id: 'notif-' + Date.now(),
      title,
      message,
      time: 'الآن',
      type,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Sync Language and Direction
  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('sadara_lang', newLang);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Sync Theme
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('sadara_theme', newTheme);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.body.classList.remove('dark');
      document.body.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [theme]);

  // Save Bookings, Ratings, Questions, Articles to localStorage
  useEffect(() => {
    localStorage.setItem('sadara_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('sadara_ratings', JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem('sadara_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('sadara_articles', JSON.stringify(articles));
  }, [articles]);

  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>): Booking => {
    const newBooking: Booking = {
      ...bookingData,
      id: 'BK-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'pending', // Pending teacher approval from Admin panel!
    };

    setBookings((prev) => [newBooking, ...prev]);

    addNotification(
      'طلب حجز جديد قيد الاعتماد',
      `تم إرسال طلب الحجز برقم ${newBooking.id} وهو بانتظار موافقة واعتماد المهندس محمود شلتوت.`,
      'booking'
    );

    return newBooking;
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    addNotification(
      'تحديث حالة الحجز',
      status === 'confirmed'
        ? `تم قبول واعتماد الحجز ${id} بنجاح وإرسال رابط الجلسة وإشعار الواتساب للطالب.`
        : `تم تحديث حالة الحجز ${id} إلى ${status === 'rejected' ? 'مرفوض' : status}.`,
      'booking'
    );
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    addNotification('إلغاء حجز', `تم حذف الحجز ${id} من السجل.`);
  };

  // Ratings management
  const addRating = (ratingData: Omit<TeacherRating, 'id' | 'status' | 'date'>) => {
    const newRating: TeacherRating = {
      ...ratingData,
      id: 'r-' + Date.now(),
      status: 'pending', // Requires teacher approval!
      date: 'اليوم',
    };
    setRatings((prev) => [newRating, ...prev]);
    addNotification(
      'تم إرسال التقييم بنجاح',
      'شكراً لك! سيظهر تقييمك على المنصة فور مراجعته واعتماده من المدرس.'
    );
  };

  const approveRating = (id: string) => {
    setRatings((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r))
    );
    addNotification('اعتماد تقييم', 'تمت الموافقة على نشر التقييم على الصفحة الرئيسية وصفحة المدرس.');
  };

  const deleteRating = (id: string) => {
    setRatings((prev) => prev.filter((r) => r.id !== id));
    addNotification('حذف تقييم', 'تم حذف التقييم بنجاح.');
  };

  // Question bank management
  const deleteQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    addNotification('حذف سؤال', 'تم حذف السؤال من بنك الأسئلة.');
  };

  const addQuestion = (newQ: Question) => {
    setQuestions((prev) => [newQ, ...prev]);
    addNotification('إضافة سؤال', 'تمت إضافة السؤال بنجاح لبنك الأسئلة.');
  };

  // Article management
  const deleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    addNotification('حذف مقال', 'تم حذف المقال التعليمي من المنصة.');
  };

  const addArticle = (newArt: Article) => {
    setArticles((prev) => [newArt, ...prev]);
    addNotification('نشر مقال', 'تم نشر المقال التعليمي بنجاح.');
  };

  // Social Login Provider simulation
  const socialLogin = (provider: string) => {
    let providerName = provider;
    let avatarUrl = defaultUser.avatar;

    if (provider === 'icloud') {
      providerName = 'Apple ID User';
      avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
    } else if (provider === 'google') {
      providerName = 'Google Scholar User';
      avatarUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
    } else if (provider === 'linkedin') {
      providerName = 'Professional Achiever';
      avatarUrl = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80';
    }

    setUser((prev) => ({
      ...prev,
      name: providerName,
      email: `${provider.toLowerCase()}.user@sadara.sa`,
      badges: [...prev.badges, `موثق عبر ${provider}`],
    }));
    setIsLoggedIn(true);
    addNotification('تسجيل الدخول', `تم تسجيل الدخول بنجاح عبر حساب ${provider}.`);
  };

  const logout = () => {
    setIsLoggedIn(false);
    addNotification('تسجيل الخروج', 'تم تسجيل خروجك بأمان من المنصة.');
  };

  const submitAnswer = (questionId: number, optionIdx: number) => {
    setAnsweredQuestions((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const resetQuizProgress = () => {
    setAnsweredQuestions({});
  };

  const openBookingModal = (course?: string) => {
    setSelectedCourseForBooking(course);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const openCertificateModal = (courseName?: string) => {
    if (courseName) setCertificateCourse(courseName);
    setIsCertificateModalOpen(true);
  };
  const closeCertificateModal = () => setIsCertificateModalOpen(false);

  const t = translations[lang];

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        theme,
        setTheme,
        toggleTheme,
        t,
        userRole,
        setUserRole,
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        socialLogin,
        logout,
        bookings,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        answeredQuestions,
        submitAnswer,
        resetQuizProgress,
        activeTab,
        setActiveTab,
        openBookingModal,
        closeBookingModal,
        isBookingModalOpen,
        selectedCourseForBooking,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
        openCertificateModal,
        closeCertificateModal,
        isCertificateModalOpen,
        certificateCourse,
        notifications,
        addNotification,
        dismissNotification,
        studentCount,
        formattedStudentCount: `+${studentCount.toLocaleString()}`,
        ratings,
        addRating,
        approveRating,
        deleteRating,
        questions,
        deleteQuestion,
        addQuestion,
        articles,
        deleteArticle,
        addArticle,
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
