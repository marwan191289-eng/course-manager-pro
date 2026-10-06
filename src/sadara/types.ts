export type Language = 'ar' | 'en';
export type Theme = 'dark' | 'light';
export type UserRole = 'student' | 'teacher' | 'parent' | 'supervisor' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  enrolledCourses: string[];
  completedLessons: string[];
  testScores: { quizTitle: string; score: number; total: number; date: string }[];
  badges: string[];
  twoFactorEnabled: boolean;
  activeDevicesCount: number;
}

export interface Booking {
  id: string;
  studentName: string;
  studentPhone: string;
  studentEmail: string;
  courseOrTrack: string;
  date: string;
  timeSlot: string;
  platform: 'zoom' | 'meet';
  status: 'pending' | 'confirmed' | 'rejected' | 'completed';
  meetingUrl: string;
  price: number;
  paymentMethod: 'mada' | 'apple_pay' | 'visa' | 'stc_pay';
  paymentStatus: 'paid' | 'pending';
  country?: string;
  notes?: string;
  reminderSent: boolean;
  createdAt: string;
}

export interface Question {
  id: number;
  track: 'كمي' | 'لفظي' | 'تحصيلي_كيمياء' | 'تحصيلي_فيزياء' | 'تحصيلي_أحياء' | 'نووية';
  trackEn: string;
  q: string;
  qEn: string;
  options: string[];
  optionsEn: string[];
  answer: number;
  explain: string;
  explainEn: string;
  difficulty: 'سهل' | 'متوسط' | 'متقدم';
}

export interface Testimonial {
  id: string;
  name: string;
  nameEn: string;
  avatar: string;
  city: string;
  cityEn: string;
  track: string;
  trackEn: string;
  scoreBefore: number;
  scoreAfter: number;
  quote: string;
  quoteEn: string;
  rating: number;
  date: string;
}

export interface LiveSession {
  id: string;
  title: string;
  titleEn: string;
  track: string;
  instructor: string;
  when: string;
  duration: string;
  platform: 'zoom' | 'meet';
  link: string;
  enrolledCount: number;
  seatsLeft: number;
  status: 'upcoming' | 'live' | 'completed';
}

export interface Course {
  id: string;
  title: string;
  titleEn: string;
  track: string;
  price: number;
  originalPrice: number;
  duration: string;
  lessonsCount: number;
  rating: number;
  studentsCount: number;
  description: string;
  descriptionEn: string;
  features: string[];
  featuresEn: string[];
  badge?: string;
}

export interface Article {
  id: string;
  title: string;
  titleEn: string;
  category: string;
  readTime: string;
  date: string;
  views: number;
  summary: string;
  summaryEn: string;
  content: string;
}

export interface TeacherRating {
  id: string;
  studentName: string;
  sessionTitle: string;
  rating: number;
  clarity: number;
  timeManagement: number;
  problemSolving: number;
  comment: string;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
}

export interface LoginActivity {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  timestamp: string;
  status: 'normal' | 'suspicious';
}
