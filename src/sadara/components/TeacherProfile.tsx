import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SITE_INFO } from '../data/mockData';
import {
  GraduationCap,
  Award,
  BookOpen,
  Star,
  CheckCircle2,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Atom,
  Send,
  Phone,
  Mail,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TeacherProfile: React.FC = () => {
  const { lang, openBookingModal, ratings, addRating, formattedStudentCount } = useApp();

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [submittedNotice, setSubmittedNotice] = useState(false);

  // Only display APPROVED reviews to the public!
  const approvedRatings = ratings.filter((r) => r.status === 'approved');

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    addRating({
      studentName: newName,
      sessionTitle: lang === 'ar' ? 'جلسة تدريبية وتقييم مباشر' : 'Live Tutoring Session Review',
      rating: newRating,
      clarity: 5,
      timeManagement: 5,
      problemSolving: 5,
      comment: newComment,
    });

    setSubmittedNotice(true);
    setShowReviewForm(false);
    setNewName('');
    setNewComment('');

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
    });
  };

  return (
    <section className="py-16 sm:py-20 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#060913]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Profile Header Grid */}
        <div className="k rounded-3xl border border-slate-200 dark:border-white/15 bg-gradient-to-br from-slate-50 via-white to-cyan-500/5 dark:from-[#0c1328] dark:via-[#090e1f] dark:to-[#081024] p-6 sm:p-12 shadow-2xl relative">
          <div className="grid lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            {/* Teacher Image & Badges (Col 4) */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative">
                <div className="size-44 sm:size-52 rounded-3xl p-1 bg-gradient-to-tr from-blue-600 via-cyan-400 to-indigo-600 shadow-2xl shadow-cyan-500/30">
                  <div className="w-full h-full rounded-[22px] bg-[#0a0f1d] overflow-hidden flex items-center justify-center relative">
                    <img
                      src="/logo.png"
                      alt={SITE_INFO.instructorAr}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <Atom className="size-24 text-cyan-400 absolute opacity-80" />
                  </div>
                </div>
                <span className="absolute -bottom-2 -right-2 px-3.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-lg flex items-center gap-1 border-2 border-white dark:border-[#0c1328]">
                  <CheckCircle2 className="size-3.5" />
                  <span>{lang === 'ar' ? 'معلم معتمد 1447' : 'Certified Tutor 1447'}</span>
                </span>
              </div>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-5">
                {lang === 'ar' ? SITE_INFO.instructorAr : SITE_INFO.instructorEn}
              </h2>
              <p className="text-xs sm:text-sm text-cyan-600 dark:text-cyan-400 font-semibold mt-1">
                {lang === 'ar' ? SITE_INFO.instructorRoleAr : SITE_INFO.instructorRoleEn}
              </p>

              <div className="mt-4 flex items-center gap-1.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-amber-400" />
                ))}
                <span className="text-sm font-bold text-slate-900 dark:text-white ms-2">
                  4.98 / 5.0
                </span>
                <span className="text-xs text-slate-400">
                  ({approvedRatings.length} {lang === 'ar' ? 'تقييم معتمد' : 'Approved Reviews'})
                </span>
              </div>

              {/* Verified Contact with LTR formatting */}
              <div className="mt-6 w-full space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <a
                  href={SITE_INFO.socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center gap-2 font-bold transition"
                >
                  <Phone className="size-3.5" />
                  <bdi dir="ltr" className="inline-block font-mono tracking-wider">
                    +966 59 475 6878
                  </bdi>
                </a>

                <a
                  href={`mailto:${SITE_INFO.email}`}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 font-medium transition"
                >
                  <Mail className="size-3.5 text-cyan-500" />
                  <span className="truncate font-mono">{SITE_INFO.email}</span>
                </a>
              </div>
            </div>

            {/* Teacher Bio & Credentials (Col 8) */}
            <div className="lg:col-span-8 text-start space-y-6">
              <div>
                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                  {lang === 'ar' ? 'السيرة الذاتية والخبرات الأكاديمية' : 'Biography & Academic Credentials'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {lang === 'ar'
                    ? 'أكثر من عقد في قيادة طلاب المملكة والخليج نحو التفوق'
                    : 'Over a Decade Leading Gulf Students Towards 99th Percentile'}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {lang === 'ar'
                    ? 'المهندس محمود إسماعيل شلتوت، مهندس متخصص في الكيمياء والهندسة النووية وخبير معتمد في إعداد طلاب الثانوية لاختبارات القدرات العامة والتحصيلي والمسابقات العلمية. مبتكر «محاكي قلب المفاعل الحي» وواضع استراتيجيات الحل الذهبي السريع في القدرات، ساعد أكثر من 12,400 طالب وطالبة في تخطي حاجز الـ 95% والالتحاق بكليات الطب والهندسة والبترول.'
                    : 'Eng. Mahmoud Ismail Shaltoot is a certified chemical & nuclear engineering expert and master tutor preparing students for Qudrat and Tahsili exams. Creator of the Live Reactor Simulator and speed-solving shortcuts, helping thousands secure admissions to elite medical and engineering universities.'}
                </p>
              </div>

              {/* Highlights cards */}
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
                    {formattedStudentCount}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'ar' ? 'طالب وطالبة متدربين' : 'Students Coached'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <div className="text-2xl font-black text-blue-600 dark:text-blue-400">94%</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'ar' ? 'نسبة تحسن الطلاب' : 'Score Improvement'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">100%</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'ar' ? 'تغطية معايير قياس 1447' : '1447 Qiyas Coverage'}
                  </div>
                </div>
              </div>

              {/* Accreditations */}
              <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-cyan-500 shrink-0 mt-0.5" />
                  <span>بكالوريوس ودراسات عليا في الهندسة الكيميائية والتطبيقات النووية.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-cyan-500 shrink-0 mt-0.5" />
                  <span>مؤلف سلسلة «صدارة» في القدرات والتحصيلي وتجميعات النماذج الحديثة.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-cyan-500 shrink-0 mt-0.5" />
                  <span>
                    خدمة تعليمية معتمدة تغطي كافة مدن المملكة (الرياض، جدة، الظهران) والخليج العربي.
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => openBookingModal()}
                  className="px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer transition active:scale-95 text-sm"
                >
                  <Calendar className="size-4" />
                  <span>{lang === 'ar' ? 'احجز جلستك الفردية مع م. محمود شلتوت' : 'Book a Session'}</span>
                </button>

                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-5 py-3.5 rounded-xl font-semibold border border-slate-200 dark:border-white/15 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 transition flex items-center gap-2 cursor-pointer text-sm"
                >
                  <MessageSquare className="size-4 text-cyan-500" />
                  <span>{lang === 'ar' ? 'أضف تقييمك للأستاذ' : 'Leave a Review'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submitted Review Notice */}
        {submittedNotice && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs text-start flex items-center gap-2.5">
            <CheckCircle2 className="size-5 shrink-0" />
            <div>
              <span className="font-bold">تم إرسال تقييمك بنجاح!</span> سيظهر التقييم على المنصة فور
              مراجعة واعتماد المهندس محمود شلتوت من لوحة التحكم.
            </div>
          </div>
        )}

        {/* Add Review Form */}
        {showReviewForm && (
          <form
            onSubmit={handleAddReview}
            className="mt-8 p-6 rounded-2xl border border-cyan-500/30 bg-slate-50 dark:bg-[#0c1224] max-w-2xl mx-auto text-start shadow-xl"
          >
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Star className="size-5 text-amber-400 fill-amber-400" />
              <span>تقييم تجربة الحصة مع المهندس محمود شلتوت</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              ملاحظة: تخضع التقييمات للمراجعة والاعتماد الأكاديمي من المدرس قبل نشرها.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  اسمك الكامل
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="مثال: فيصل بن سعد"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-xs text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  التقييم العام
                </label>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
                >
                  <option value={5}>5 نجوم — ممتاز واستثنائي</option>
                  <option value={4}>4 نجوم — جيد جداً</option>
                  <option value={3}>3 نجوم — جيد</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                رأيك وتجربتك
              </label>
              <textarea
                required
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="اكتب كيف ساعدك الشرح أو المحاكي في رفع درجاتك..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-xs text-slate-800 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-200 dark:hover:bg-white/5"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl font-bold text-xs text-white bg-cyan-600 hover:bg-cyan-500 shadow-md flex items-center gap-1.5"
              >
                <Send className="size-3.5" />
                <span>إرسال للاعتماد والنشر</span>
              </button>
            </div>
          </form>
        )}

        {/* Public Approved Reviews List */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-bold text-slate-900 dark:text-white text-start">
              تقييمات وآراء الطلاب المعتمدة
            </h4>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="size-3.5" />
              <span>مراجعة ومعتمدة من قِبل المدرس</span>
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {approvedRatings.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#0c1224] text-start flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {rev.studentName}
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="size-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium mb-2">
                    {rev.sessionTitle}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{rev.date}</span>
                  <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                    <CheckCircle2 className="size-3" />
                    معتمد رسمياً
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
