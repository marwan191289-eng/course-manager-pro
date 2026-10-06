import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking, Question, Article, TeacherRating } from '../types';
import { TIME_SLOTS, DAYS_LIST } from '../data/mockData';
import {
  Shield,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Plus,
  BookOpen,
  FileText,
  HelpCircle,
  Trash2,
  Lock,
  Unlock,
  CreditCard,
  Download,
  AlertCircle,
  Search,
  Star,
  Check,
  MessageSquare,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    bookings,
    updateBookingStatus,
    deleteBooking,
    addNotification,
    ratings,
    approveRating,
    deleteRating,
    questions,
    deleteQuestion,
    addQuestion,
    articles,
    deleteArticle,
    addArticle,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'bookings' | 'reviews' | 'schedule' | 'content' | 'analytics' | 'users'>('bookings');

  // Days and slots state
  const [daysState, setDaysState] = useState(DAYS_LIST);
  const [slotsState, setSlotsState] = useState(TIME_SLOTS);

  // New Article form
  const [newArticleTitle, setNewArticleTitle] = useState('');
  const [newArticleCategory, setNewArticleCategory] = useState('قدرات كمي');

  // New Question form
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionTrack, setNewQuestionTrack] = useState<'كمي' | 'لفظي' | 'تحصيلي_كيمياء' | 'تحصيلي_فيزياء' | 'تحصيلي_أحياء' | 'نووية'>('كمي');

  const toggleDayStatus = (date: string) => {
    setDaysState((prev) =>
      prev.map((d) => (d.date === date ? { ...d, open: !d.open } : d))
    );
    addNotification('تحديث المواعيد', 'تم تعديل إتاحة اليوم بنجاح في جدول الحجز العام.');
  };

  const toggleSlotStatus = (time: string) => {
    setSlotsState((prev) =>
      prev.map((s) => (s.time === time ? { ...s, available: !s.available } : s))
    );
    addNotification('تحديث المواعيد', 'تم تعديل إتاحة التوقيت بنجاح في جدول الحجز العام.');
  };

  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticleTitle.trim()) return;

    addArticle({
      id: 'art-' + Date.now(),
      title: newArticleTitle,
      titleEn: newArticleTitle,
      category: newArticleCategory,
      readTime: '5 دقائق',
      views: 0,
      date: 'اليوم',
      summary: newArticleTitle,
      summaryEn: newArticleTitle,
      content: 'محتوى المقال التعليمي...',
    });
    setNewArticleTitle('');
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    addQuestion({
      id: Date.now(),
      track: newQuestionTrack,
      trackEn: newQuestionTrack,
      q: newQuestionText,
      qEn: newQuestionText,
      options: ['الخيار أ', 'الخيار ب (الصحيح)', 'الخيار ج', 'الخيار د'],
      optionsEn: ['Option A', 'Option B (Correct)', 'Option C', 'Option D'],
      answer: 1,
      explain: 'الشرح النموذجي للمسألة بواسطة م. محمود شلتوت.',
      explainEn: 'Step-by-step mathematical explanation.',
      difficulty: 'متوسط',
    });
    setNewQuestionText('');
  };

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.paymentStatus === 'paid' ? b.price : 0), 0);
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const pendingRatingsCount = ratings.filter((r) => r.status === 'pending').length;

  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 text-start">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-xs font-bold mb-2">
            <Shield className="size-3.5" />
            <span>لوحة التحكم والإدارة المركزية — إشراف م. محمود شلتوت</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            إدارة الحجوزات، المواعيد، اعتماد التقييمات، والمحتوى
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            قبول الحجوزات وسداد الرسوم، مراجعة تقييمات الطلاب قبل النشر، وحذف المقالات والأسئلة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 flex items-center gap-1.5 animate-pulse">
              <span className="size-2 rounded-full bg-amber-500" />
              <span>{pendingCount} حجوزات بانتظار موافقة المدرس</span>
            </span>
          )}
        </div>
      </div>

      {/* KPI Cards Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-start">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1224] border border-slate-200 dark:border-white/10 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400">الإيرادات المحصلة</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {totalRevenue.toLocaleString()}{' '}
            <span className="text-xs font-bold text-cyan-500">ر.س</span>
          </div>
          <div className="text-[11px] text-emerald-500 mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp className="size-3" />
            +18% هذا الأسبوع
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1224] border border-slate-200 dark:border-white/10 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400">طلبات بانتظار الاعتماد</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-500 mt-1">
            {pendingCount}
          </div>
          <div className="text-[11px] text-amber-500 mt-1 font-medium">يتطلب موافقة المدرس</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1224] border border-slate-200 dark:border-white/10 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400">تقييمات جديدة للمراجعة</span>
          <div className="text-2xl sm:text-3xl font-black text-blue-500 mt-1">
            {pendingRatingsCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">قبل الظهور على التطبيق</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1224] border border-slate-200 dark:border-white/10 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400">الحجوزات المقبولة</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-500 mt-1">
            {confirmedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">جلسات معتمدة ومجدولة</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-white/10 pb-3 mb-6">
        {[
          { id: 'bookings', label: `طلبات الحجز والقبول (${bookings.length})`, icon: Calendar },
          { id: 'reviews', label: `مراجعة واعتماد التقييمات (${pendingRatingsCount} جديد)`, icon: MessageSquare, highlight: pendingRatingsCount > 0 },
          { id: 'schedule', label: 'فتح / إغلاق الأيام والتوقيتات', icon: Clock },
          { id: 'content', label: `المقالات والأسئلة (${articles.length + questions.length})`, icon: BookOpen },
          { id: 'analytics', label: 'التقارير المالية والاشتراكات', icon: DollarSign },
          { id: 'users', label: 'المستخدمون والصلاحيات (RBAC)', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-cyan-500 bg-slate-100 dark:bg-white/5'
              }`}
            >
              <Icon className="size-4" />
              <span>{tab.label}</span>
              {tab.highlight && <span className="size-2 rounded-full bg-rose-500 animate-ping" />}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Bookings Management (Accept / Reject / Delete) */}
      {activeTab === 'bookings' && (
        <div className="space-y-4 text-start">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224] overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                قائمة طلبات الحجز والسداد (الموافقة والاعتماد بواسطة المدرس)
              </h4>
              <span className="text-xs text-slate-400">إجمالي {bookings.length} طلب</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="p-3.5">رقم الطلب</th>
                    <th className="p-3.5">الطالب / الدولة</th>
                    <th className="p-3.5">المادة</th>
                    <th className="p-3.5">التاريخ والوقت</th>
                    <th className="p-3.5">المبلغ</th>
                    <th className="p-3.5">الحالة</th>
                    <th className="p-3.5">إجراءات المدرس</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5">
                      <td className="p-3.5 font-mono font-bold text-cyan-500">{b.id}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {b.studentName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono" dir="ltr">
                          {b.studentPhone} {b.country ? `• ${b.country}` : ''}
                        </div>
                      </td>
                      <td className="p-3.5">{b.courseOrTrack}</td>
                      <td className="p-3.5">
                        <div>{b.date}</div>
                        <div className="text-[11px] text-cyan-500">{b.timeSlot}</div>
                      </td>
                      <td className="p-3.5 font-bold">
                        {b.price} ر.س{' '}
                        <span className="text-[10px] text-emerald-500 block">
                          ({b.paymentStatus === 'paid' ? 'مسدد إلكترونياً' : 'معلق'})
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-500/15 text-emerald-500'
                              : b.status === 'pending'
                              ? 'bg-amber-500/15 text-amber-500'
                              : 'bg-rose-500/15 text-rose-500'
                          }`}
                        >
                          {b.status === 'confirmed'
                            ? 'مقبول ومؤكد ✓'
                            : b.status === 'pending'
                            ? 'قيد مراجعة المدرس ⏳'
                            : 'مرفوض'}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          {b.status !== 'confirmed' && (
                            <button
                              onClick={() => updateBookingStatus(b.id, 'confirmed')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition shadow-sm"
                              title="قبول واعتماد الحجز وإرسال الرابط"
                            >
                              <CheckCircle2 className="size-3.5" />
                              <span>قبول واعتماد</span>
                            </button>
                          )}
                          {b.status !== 'rejected' && (
                            <button
                              onClick={() => updateBookingStatus(b.id, 'rejected')}
                              className="p-1.5 rounded-lg bg-rose-500/15 text-rose-500 hover:bg-rose-500 hover:text-white transition cursor-pointer"
                              title="رفض الطلب"
                            >
                              <XCircle className="size-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteBooking(b.id)}
                            className="p-1.5 rounded-lg bg-slate-200 dark:bg-white/10 text-slate-500 hover:text-rose-500 transition cursor-pointer"
                            title="حذف الحجز نهائياً"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Reviews & Ratings Approval Flow */}
      {activeTab === 'reviews' && (
        <div className="space-y-4 text-start">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224] p-5 shadow-sm">
            <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1">
              مراجعة واعتماد تقييمات الطلاب قبل النشر على المنصة
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              لا يمكن ظهور أي تقييم في واجهة التطبيق وصفحة المدرس إلا بعد الضغط على "اعتماد ونشر".
            </p>

            <div className="space-y-3">
              {ratings.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {rev.studentName}
                      </span>
                      <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                        <Star className="size-3.5 fill-amber-400" />
                        {rev.rating}/5
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rev.status === 'approved'
                            ? 'bg-emerald-500/15 text-emerald-500'
                            : 'bg-amber-500/15 text-amber-500'
                        }`}
                      >
                        {rev.status === 'approved' ? 'معتمد ومنشور علناً' : 'قيد المراجعة (معلق)'}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1 italic">
                      "{rev.comment}"
                    </p>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {rev.sessionTitle} • {rev.date}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {rev.status !== 'approved' && (
                      <button
                        onClick={() => approveRating(rev.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 cursor-pointer transition shadow-sm"
                      >
                        <Check className="size-3.5" />
                        <span>اعتماد ونشر التقييم</span>
                      </button>
                    )}
                    <button
                      onClick={() => deleteRating(rev.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500 hover:text-white text-rose-500 font-bold flex items-center gap-1 cursor-pointer transition"
                      title="حذف التقييم"
                    >
                      <Trash2 className="size-3.5" />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Schedule Availability */}
      {activeTab === 'schedule' && (
        <div className="space-y-6 text-start">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224]">
            <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              التحكم في إتاحة أيام الأسبوع (فتح / إغلاق الحجز)
            </h4>
            <div className="grid sm:grid-cols-3 md:grid-cols-6 gap-3">
              {daysState.map((d) => (
                <div
                  key={d.date}
                  className={`p-4 rounded-xl border flex flex-col justify-between ${
                    d.open
                      ? 'border-emerald-500/40 bg-emerald-500/5'
                      : 'border-rose-500/40 bg-rose-500/5 opacity-60'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {d.labelAr}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{d.date}</div>
                  </div>

                  <button
                    onClick={() => toggleDayStatus(d.date)}
                    className={`mt-4 w-full py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition ${
                      d.open
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {d.open ? <Unlock className="size-3.5" /> : <Lock className="size-3.5" />}
                    <span>{d.open ? 'مفتوح للحجز' : 'مغلق حالياً'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224]">
            <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              التحكم في فترات التوقيت اليومية
            </h4>
            <div className="grid sm:grid-cols-3 md:grid-cols-6 gap-3">
              {slotsState.map((slot) => (
                <div
                  key={slot.time}
                  className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex flex-col justify-between"
                >
                  <div className="font-mono font-bold text-base text-slate-900 dark:text-white">
                    {slot.time}
                  </div>
                  <button
                    onClick={() => toggleSlotStatus(slot.time)}
                    className={`mt-3 w-full py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${
                      slot.available
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-400 text-white line-through'
                    }`}
                  >
                    {slot.available ? 'متاح' : 'معطل'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Content Management with DELETE functionality for Articles & Questions */}
      {activeTab === 'content' && (
        <div className="grid lg:grid-cols-2 gap-8 text-start">
          {/* Articles Management & Deletion */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224]">
            <h4 className="font-bold text-base text-slate-900 dark:text-white mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="size-4 text-cyan-500" />
                <span>المقالات التعليمية المنشورة</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">{articles.length} مقال</span>
            </h4>

            {/* Add article form */}
            <form onSubmit={handleAddArticle} className="space-y-3 mb-6 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <input
                type="text"
                required
                value={newArticleTitle}
                onChange={(e) => setNewArticleTitle(e.target.value)}
                placeholder="عنوان المقال الجديد..."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-[#0c1224] text-xs text-slate-900 dark:text-white"
              />
              <div className="flex gap-2">
                <select
                  value={newArticleCategory}
                  onChange={(e) => setNewArticleCategory(e.target.value)}
                  className="p-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-[#0c1224] text-xs"
                >
                  <option value="قدرات كمي">قدرات كمي</option>
                  <option value="قدرات لفظي">قدرات لفظي</option>
                  <option value="تحصيلي علمي">تحصيلي علمي</option>
                  <option value="كيمياء نووية">كيمياء نووية</option>
                </select>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>إضافة ونشر المقال</span>
                </button>
              </div>
            </form>

            {/* List with Delete button */}
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {articles.map((art) => (
                <div
                  key={art.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{art.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {art.category} • {art.views} مشاهدة
                    </div>
                  </div>
                  <button
                    onClick={() => deleteArticle(art.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 cursor-pointer transition shrink-0"
                    title="حذف المقال"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Question Bank Management & Deletion */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224]">
            <h4 className="font-bold text-base text-slate-900 dark:text-white mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <HelpCircle className="size-4 text-blue-500" />
                <span>بنك الأسئلة والتجميعات</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">{questions.length} سؤال</span>
            </h4>

            {/* Add Question form */}
            <form onSubmit={handleAddQuestion} className="space-y-3 mb-6 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <textarea
                rows={2}
                required
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="صيغة السؤال الجديد لقياس..."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-[#0c1224] text-xs text-slate-900 dark:text-white"
              />
              <div className="flex gap-2">
                <select
                  value={newQuestionTrack}
                  onChange={(e) => setNewQuestionTrack(e.target.value as any)}
                  className="p-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-[#0c1224] text-xs"
                >
                  <option value="كمي">قدرات كمي</option>
                  <option value="لفظي">قدرات لفظي</option>
                  <option value="تحصيلي_كيمياء">تحصيلي كيمياء</option>
                  <option value="نووية">كيمياء نووية</option>
                </select>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>إضافة السؤال للبنك</span>
                </button>
              </div>
            </form>

            {/* List with Delete button */}
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex-1">
                    <span className="text-[10px] text-cyan-500 font-bold block">{q.track}</span>
                    <div className="font-medium text-slate-900 dark:text-white line-clamp-1">{q.q}</div>
                  </div>
                  <button
                    onClick={() => deleteQuestion(q.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 cursor-pointer transition shrink-0"
                    title="حذف السؤال"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Financial Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 text-start">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224]">
            <h4 className="font-bold text-base text-slate-900 dark:text-white mb-4">
              تقرير باقات الاشتراكات والتجديد التلقائي
            </h4>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                <span className="text-xs text-slate-400">باقة الجلسة الفردية (150 ر.س)</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  42 اشتراكاً
                </div>
                <div className="text-xs text-cyan-500 mt-1">إجمالي: 6,300 ر.س</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                <span className="text-xs text-slate-400">باقة الـ 5 جلسات (650 ر.س)</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  68 اشتراكاً
                </div>
                <div className="text-xs text-cyan-500 mt-1">إجمالي: 44,200 ر.س</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                <span className="text-xs text-slate-400">باقة VIP الذهبية (1,200 ر.س)</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  25 اشتراكاً
                </div>
                <div className="text-xs text-cyan-500 mt-1">إجمالي: 30,000 ر.س</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Users & RBAC */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224] text-start">
          <h4 className="font-bold text-base text-slate-900 dark:text-white mb-4">
            إدارة الأدوار وصلاحيات المنصة (RBAC Matrix)
          </h4>

          <div className="space-y-3 text-xs">
            {[
              { role: 'طالب (Student)', desc: 'حضور الجلسات، بنك الأسئلة، محاكي المفاعل، استخراج الشهادات', activeCount: '12,400' },
              { role: 'معلم (Teacher - م. محمود شلتوت)', desc: 'بدء الجلسات على زوم، الرد على المحادثات، مراجعة الحجوزات', activeCount: '1' },
              { role: 'ولي أمر (Parent)', desc: 'متابعة تقارير حضور الطالب، النتائج، والتواصل مع المدرس', activeCount: '3,210' },
              { role: 'مشرف أكاديمي (Supervisor)', desc: 'مراقبة جودة الشروحات، إحصائيات الغياب، تدقيق الأسئلة', activeCount: '12' },
              { role: 'مدير المنصة (Admin)', desc: 'تحكم شامل بالإعدادات، بوابات الدفع، والتقارير المالية', activeCount: '3' },
            ].map((r, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{r.role}</div>
                  <div className="text-slate-400 mt-0.5">{r.desc}</div>
                </div>
                <span className="font-mono font-bold text-cyan-500 bg-cyan-500/10 px-2.5 py-1 rounded-lg">
                  {r.activeCount} مستخدم
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
