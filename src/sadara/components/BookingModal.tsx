import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SITE_INFO, COUNTRIES_LIST } from '../data/mockData';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  CreditCard,
  CheckCircle2,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Video,
  ArrowRight,
  ArrowLeft,
  Bell,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Globe,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BookingModal: React.FC = () => {
  const {
    lang,
    t,
    isBookingModalOpen,
    closeBookingModal,
    selectedCourseForBooking,
    addBooking,
  } = useApp();

  const [step, setStep] = useState<'details' | 'payment' | 'submitted'>('details');

  // Country selection
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES_LIST[0]);

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('594756878');
  const [email, setEmail] = useState('');
  const [track, setTrack] = useState(selectedCourseForBooking || 'جلسة فردية مباشرة مكثفة (150 ر.س)');
  const [platform, setPlatform] = useState<'zoom' | 'meet'>('zoom');
  const [notes, setNotes] = useState('');

  // Calendar State (Interactive Month Calendar)
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // October
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(12);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('6:00 م');

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'mada' | 'visa' | 'stc_pay'>('apple_pay');
  const [cardNumber, setCardNumber] = useState('5888 •••• •••• 4210');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('09/28');
  const [cardCvv, setCardCvv] = useState('789');
  const [isProcessing, setIsProcessing] = useState(false);
  const [submittedBookingId, setSubmittedBookingId] = useState('');

  if (!isBookingModalOpen) return null;

  // Determine pricing
  let price = 150;
  if (track.includes('5') || track.includes('خماسية') || track.includes('650')) price = 650;
  if (track.includes('10') || track.includes('VIP') || track.includes('الذهبية') || track.includes('1200')) price = 1200;

  // Calendar days generation
  const monthNamesAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const monthNamesEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weekDaysAr = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
  const weekDaysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const availableTimeSlots = [
    { time: '4:00 م', timeEn: '4:00 PM', available: true },
    { time: '5:30 م', timeEn: '5:30 PM', available: true },
    { time: '7:00 م', timeEn: '7:00 PM', available: true },
    { time: '8:30 م', timeEn: '8:30 PM', available: true },
    { time: '9:30 م', timeEn: '9:30 PM', available: true },
    { time: '11:00 م', timeEn: '11:00 PM', available: false },
  ];

  const fullSelectedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDayNumber).padStart(2, '0')}`;
  const dayOfWeekIndex = (new Date(currentYear, currentMonth, selectedDayNumber)).getDay();
  const dayNameStr = lang === 'ar' ? weekDaysAr[dayOfWeekIndex] : weekDaysEn[dayOfWeekIndex];

  const handleCountryChange = (countryCode: string) => {
    const found = COUNTRIES_LIST.find((c) => c.code === countryCode) || COUNTRIES_LIST[0];
    setSelectedCountry(found);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) return;
    setCardHolder(name);
    setStep('payment');
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);

      // Book with status: PENDING (requires teacher approval from Admin Dashboard!)
      const fullPhone = `${selectedCountry.dial} ${phone}`;
      const newB = addBooking({
        studentName: name,
        studentPhone: fullPhone,
        studentEmail: email,
        courseOrTrack: track,
        date: fullSelectedDate,
        timeSlot: selectedTimeSlot,
        platform,
        status: 'pending', // Pending teacher approval!
        meetingUrl:
          platform === 'zoom'
            ? 'https://zoom.us/j/94756878' + Math.floor(10 + Math.random() * 89)
            : 'https://meet.google.com/sadara-tutoring',
        price,
        paymentMethod,
        paymentStatus: 'paid',
        country: selectedCountry.nameAr,
        notes,
        reminderSent: false,
      });

      setSubmittedBookingId(newB.id);
      setStep('submitted');

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 1500);
  };

  // WhatsApp preview message
  const waMessage = `السلام عليكم ورحمة الله، تم سداد رسوم الحجز في منصة صدارة وهو بانتظار اعتماد المدرس:%0A` +
    `👤 الطالب: ${encodeURIComponent(name)}%0A` +
    `🌍 الدولة: ${encodeURIComponent(selectedCountry.nameAr)}%0A` +
    `📚 المادة: ${encodeURIComponent(track)}%0A` +
    `📅 الموعد المختار: ${dayNameStr} (${fullSelectedDate})%0A` +
    `⏰ التوقيت: ${encodeURIComponent(selectedTimeSlot)}%0A` +
    `💳 رقم الطلب: ${submittedBookingId}`;

  const waLink = `https://wa.me/${SITE_INFO.phoneClean}?text=${waMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0c1328] shadow-2xl p-6 sm:p-8 text-start my-8 text-slate-900 dark:text-white">
        {/* Close Button */}
        <button
          onClick={closeBookingModal}
          className="absolute top-6 ltr:right-6 rtl:left-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
        >
          <X className="size-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-2">
            <Sparkles className="size-3.5" />
            <span>{lang === 'ar' ? 'حجز جلسة خاصة مع م. محمود شلتوت' : 'Book a Private Session'}</span>
          </div>
          <h3 className="text-2xl font-black">
            {step === 'submitted'
              ? (lang === 'ar' ? 'تم استلام طلب الحجز والسداد بنجاح' : 'Booking & Payment Submitted')
              : step === 'payment'
              ? (lang === 'ar' ? 'بوابة الدفع الإلكتروني المعتمدة' : 'Secure Payment Gateway')
              : (lang === 'ar' ? 'بيانات الحجز واختيار الموعد' : 'Booking Details & Schedule')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {step === 'submitted'
              ? (lang === 'ar' ? 'حالة الحجز الحالية: ⏳ قيد مراجعة واعتماد المهندس محمود شلتوت' : 'Current Status: ⏳ Pending approval from Eng. Mahmoud Shaltoot')
              : (lang === 'ar' ? 'السعودية ودول الخليج العربي والدول العربية الشقيقة' : 'Saudi Arabia, Gulf States & Arab Countries')}
          </p>
        </div>

        {/* Step 1: Details & Calendar */}
        {step === 'details' && (
          <form onSubmit={handleProceedToPayment} className="space-y-4">
            {/* Country Selector: GCC vs Arab Countries with Quick Region Filter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Globe className="size-3.5 text-cyan-500" />
                  <span>{lang === 'ar' ? 'الدولة / النطاق الجغرافي:' : 'Country / Region:'}</span>
                </label>
                <div className="flex rounded-lg p-0.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      const firstGulf = COUNTRIES_LIST.find((c) => c.region === 'gulf');
                      if (firstGulf) setSelectedCountry(firstGulf);
                    }}
                    className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
                      selectedCountry.region === 'gulf'
                        ? 'bg-cyan-500 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-cyan-500'
                    }`}
                  >
                    {lang === 'ar' ? '🇸🇦 دول الخليج العربي' : 'Gulf States'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const firstArab = COUNTRIES_LIST.find((c) => c.region === 'arab');
                      if (firstArab) setSelectedCountry(firstArab);
                    }}
                    className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
                      selectedCountry.region === 'arab'
                        ? 'bg-cyan-500 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-cyan-500'
                    }`}
                  >
                    {lang === 'ar' ? '🌍 بقية الدول العربية' : 'Arab Countries'}
                  </button>
                </div>
              </div>

              <select
                value={selectedCountry.code}
                onChange={(e) => handleCountryChange(e.target.value)}
                style={{ colorScheme: 'auto' }}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer shadow-sm"
              >
                <optgroup label={lang === 'ar' ? '🇸🇦 دول مجلس التعاون الخليجي' : 'Gulf States'} className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white font-bold">
                  {COUNTRIES_LIST.filter((c) => c.region === 'gulf').map((c) => (
                    <option key={c.code} value={c.code} className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white py-1">
                      {lang === 'ar' ? c.nameAr : c.nameEn} ({c.dial})
                    </option>
                  ))}
                </optgroup>
                <optgroup label={lang === 'ar' ? '🌍 بقية الدول العربية' : 'Arab Countries'} className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white font-bold">
                  {COUNTRIES_LIST.filter((c) => c.region === 'arab').map((c) => (
                    <option key={c.code} value={c.code} className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white py-1">
                      {lang === 'ar' ? c.nameAr : c.nameEn} ({c.dial})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Name & Phone */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === 'ar' ? 'الاسم الكامل للطالب' : 'Student Full Name'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="size-4 text-slate-400 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: عبد الرحمن الشهري' : 'e.g. Abdulrahman Al-Shehri'}
                    className="w-full ltr:pl-9 rtl:pr-9 py-2.5 px-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0c1224] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === 'ar' ? 'رقم الواتساب للتأكيد' : 'WhatsApp Number'} <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-2">
                  <span dir="ltr" className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-100 dark:bg-white/5 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 shrink-0">
                    {selectedCountry.dial}
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="5x xxx xxxx"
                    className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0c1224] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Email & Subject Track */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === 'ar' ? 'البريد الإلكتروني للإشعار' : 'Email Address'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="size-4 text-slate-400 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full ltr:pl-9 rtl:pr-9 py-2.5 px-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0c1224] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Styled Track Dropdown with explicit high-contrast colors */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === 'ar' ? 'المادة / المسار المطلوب:' : 'Subject / Package:'}
                </label>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  style={{ colorScheme: 'auto' }}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer shadow-sm"
                >
                  <option value="جلسة فردية مباشرة مكثفة (150 ر.س)" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white py-1">
                    {lang === 'ar' ? 'جلسة فردية مباشرة مكثفة (150 ر.س)' : 'Private 1-on-1 Coaching (150 SAR)'}
                  </option>
                  <option value="باقة التفوق الخماسية 5 جلسات (650 ر.س)" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white py-1">
                    {lang === 'ar' ? 'باقة التفوق الخماسية 5 جلسات (650 ر.س)' : 'Excellence 5-Session Bundle (650 SAR)'}
                  </option>
                  <option value="باقة الصدارة VIP الذهبية 10 جلسات (1,200 ر.س)" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white py-1">
                    {lang === 'ar' ? 'باقة الصدارة VIP الذهبية 10 جلسات (1,200 ر.س)' : 'VIP Gold Sadara 10-Session Bundle (1,200 SAR)'}
                  </option>
                  <option value="قدرات كمي وتأسيس هندسي" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white py-1">
                    {lang === 'ar' ? 'قدرات كمي وتأسيس هندسي' : 'Quantitative Math & Geometry'}
                  </option>
                  <option value="قدرات لفظي واستيعاب مقروء" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white py-1">
                    {lang === 'ar' ? 'قدرات لفظي واستيعاب مقروء' : 'Verbal Analogy & Reading Comprehension'}
                  </option>
                  <option value="تحصيلي كيمياء نووية وفيزياء ذرية" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white py-1">
                    {lang === 'ar' ? 'تحصيلي كيمياء نووية وفيزياء ذرية' : 'Tahsili Nuclear Chemistry & Atomic Physics'}
                  </option>
                </select>
              </div>
            </div>

            {/* Interactive Visual Calendar (Month view + Navigation + Day selection) */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentMonth > 0) setCurrentMonth(currentMonth - 1);
                      else {
                        setCurrentMonth(11);
                        setCurrentYear(currentYear - 1);
                      }
                    }}
                    className="p-1 rounded-lg border border-slate-300 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition cursor-pointer"
                    title="الشهر السابق"
                  >
                    <ChevronRight className="size-4 rtl:rotate-0 ltr:rotate-180" />
                  </button>
                  <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <CalendarIcon className="size-4 text-cyan-500" />
                    <span>
                      {lang === 'ar' ? monthNamesAr[currentMonth] : monthNamesEn[currentMonth]} {currentYear}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (currentMonth < 11) setCurrentMonth(currentMonth + 1);
                      else {
                        setCurrentMonth(0);
                        setCurrentYear(currentYear + 1);
                      }
                    }}
                    className="p-1 rounded-lg border border-slate-300 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition cursor-pointer"
                    title="الشهر القادم"
                  >
                    <ChevronLeft className="size-4 rtl:rotate-0 ltr:rotate-180" />
                  </button>
                </div>

                <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20">
                  {dayNameStr} • {fullSelectedDate}
                </span>
              </div>

              {/* Day numbers grid for the month */}
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                {weekDaysAr.map((w, i) => (
                  <span key={i} className="text-[10px] text-slate-400 font-bold py-1">
                    {lang === 'ar' ? w : weekDaysEn[i]}
                  </span>
                ))}
                {[...Array(31)].map((_, i) => {
                  const dayNum = i + 1;
                  const isSelected = selectedDayNumber === dayNum;
                  const isPast = dayNum < 6 && currentMonth === 9; // past days
                  return (
                    <button
                      key={dayNum}
                      type="button"
                      disabled={isPast}
                      onClick={() => setSelectedDayNumber(dayNum)}
                      className={`h-8 rounded-lg font-bold text-xs transition cursor-pointer flex items-center justify-center ${
                        isPast
                          ? 'opacity-30 cursor-not-allowed line-through text-slate-400'
                          : isSelected
                          ? 'bg-cyan-500 text-white shadow-md'
                          : 'hover:bg-cyan-500/15 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                <Clock className="size-3.5 inline me-1 text-cyan-500" />
                {lang === 'ar' ? 'اختر التوقيت المفضل (بتوقيت مكة المكرمة):' : 'Select Preferred Time Slot:'}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {availableTimeSlots.map((slot) => (
                  <button
                    type="button"
                    key={slot.time}
                    disabled={!slot.available}
                    onClick={() => setSelectedTimeSlot(slot.time)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer font-mono font-bold text-xs ${
                      !slot.available
                        ? 'opacity-30 cursor-not-allowed line-through border-slate-200 dark:border-white/5'
                        : selectedTimeSlot === slot.time
                        ? 'border-cyan-500 bg-cyan-500/15 text-cyan-600 dark:text-cyan-400'
                        : 'border-slate-300 dark:border-white/10 hover:border-cyan-500/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {lang === 'ar' ? slot.time : slot.timeEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Selection */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                {lang === 'ar' ? 'المنصة المفضلة للجلسة:' : 'Preferred Video Platform:'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPlatform('zoom')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition font-bold text-xs ${
                    platform === 'zoom'
                      ? 'border-blue-500 bg-blue-500/15 text-blue-500'
                      : 'border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Video className="size-4" />
                  <span>Zoom Meetings</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPlatform('meet')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition font-bold text-xs ${
                    platform === 'meet'
                      ? 'border-emerald-500 bg-emerald-500/15 text-emerald-500'
                      : 'border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Video className="size-4" />
                  <span>Google Meet</span>
                </button>
              </div>
            </div>

            {/* Price Preview & Proceed */}
            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">
                  {lang === 'ar' ? 'رسوم الحجز المطلوب سدادها:' : 'Total Booking Fee:'}
                </span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {price} <span className="text-xs text-cyan-500 font-bold">ر.س</span>
                </span>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer transition active:scale-95"
              >
                <span>{lang === 'ar' ? 'الانتقال لصفحة السداد الإلكتروني' : 'Proceed to Payment'}</span>
                <CreditCard className="size-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Dedicated Payment Gateway Screen */}
        {step === 'payment' && (
          <div className="space-y-6">
            {/* Booking Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">{lang === 'ar' ? 'اسم الطالب:' : 'Student:'}</span>
                <span className="font-bold">{name} ({selectedCountry.nameAr})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">{lang === 'ar' ? 'المادة المحددة:' : 'Course:'}</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">{track}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">{lang === 'ar' ? 'الموعد المختار:' : 'Schedule:'}</span>
                <span className="font-bold font-mono">{dayNameStr} • {fullSelectedDate} • {selectedTimeSlot}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex justify-between items-center text-sm font-bold">
                <span>{lang === 'ar' ? 'المبلغ الإجمالي للسداد:' : 'Total Due:'}</span>
                <span className="text-xl font-black text-cyan-600 dark:text-cyan-400">{price} ر.س</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2.5">
                {lang === 'ar' ? 'اختر بوابة الدفع المعتمدة:' : 'Select Payment Gateway:'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'apple_pay', label: 'Apple Pay' },
                  { id: 'mada', label: 'مدى (Mada)' },
                  { id: 'stc_pay', label: 'STC Pay' },
                  { id: 'visa', label: 'Visa / Mastercard' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-3 rounded-2xl border text-center font-bold text-xs transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === m.id
                        ? 'border-cyan-500 bg-cyan-500/15 text-cyan-600 dark:text-cyan-400'
                        : 'border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                    }`}
                  >
                    <CreditCard className="size-4" />
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Card Form Inputs */}
            {paymentMethod !== 'apple_pay' && paymentMethod !== 'stc_pay' && (
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    {lang === 'ar' ? 'رقم البطاقة' : 'Card Number'}
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-[#0c1224] text-xs font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      {lang === 'ar' ? 'تاريخ الانتهاء' : 'Expiry'}
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-[#0c1224] text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-[#0c1224] text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'apple_pay' && (
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-900 text-white text-center space-y-2">
                <div className="font-bold text-base"> Pay Instant Checkout</div>
                <p className="text-xs text-slate-400">
                  سيتم خصم {price} ر.س وتأكيد العملية بأمان عبر البصمة / Face ID.
                </p>
              </div>
            )}

            {paymentMethod === 'stc_pay' && (
              <div className="p-5 rounded-2xl border border-purple-500/30 bg-purple-950/20 text-center space-y-2">
                <div className="font-bold text-sm text-purple-400">STC Pay Express</div>
                <p className="text-xs text-slate-300">
                  أدخل رقم المحفظة {selectedCountry.dial} {phone} لاستلام رمز التأكيد OTP.
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
              <ShieldCheck className="size-4 shrink-0" />
              <span>
                {lang === 'ar'
                  ? 'بوابة دفع إلكترونية آمنة ومعتمدة من مؤسسة النقد العربي السعودي (ساما SAMA).'
                  : 'Secure Electronic Payment Gateway compliant with SAMA standards.'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer"
              >
                {lang === 'ar' ? 'تعديل البيانات والموعد' : 'Back to Details'}
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleProcessPayment}
                className="px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer transition active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>{lang === 'ar' ? 'جاري معالجة الدفع والتحقق...' : 'Processing Payment...'}</span>
                ) : (
                  <>
                    <Lock className="size-4" />
                    <span>
                      {lang === 'ar'
                        ? `سداد المبلغ (${price} ر.س) وإرسال الطلب`
                        : `Pay Now (${price} SAR) & Submit`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Submitted & Pending Approval Notice */}
        {step === 'submitted' && (
          <div className="space-y-6 text-center">
            <div className="size-16 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
              <Clock className="size-9 animate-pulse" />
            </div>

            <div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white">
                {lang === 'ar' ? 'تم استلام طلب الحجز والسداد بنجاح!' : 'Booking Request & Payment Received!'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                {lang === 'ar' ? 'رقم طلب الحجز المعتمد:' : 'Booking Ref:'}{' '}
                <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  {submittedBookingId}
                </span>
              </p>
            </div>

            {/* Clear Teacher Approval Status Banner */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-start space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2 text-sm">
                <Bell className="size-4" />
                <span>حالة الحجز الحالية: قيد مراجعة واعتماد المهندس محمود شلتوت</span>
              </div>
              <p className="leading-relaxed">
                تم تسجيل سدادك بنجاح، ووفقاً للسياسة التعليمية للمنصة، يقوم المدرس بمراجعة جدول المواعيد وقبول الحجز من داخل <strong>صفحة الإدارة</strong>.
                فور القبول، سيتم تفعيل رابط الجلسة وإرسال إشعار تأكيد رسمي عبر واتساب والبريد الإلكتروني وتذكير قبل الحصة بـ 30 دقيقة.
              </p>
            </div>

            {/* Direct WhatsApp follow-up button */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-md flex items-center justify-center gap-2 transition"
              >
                <Phone className="size-4" />
                <span>
                  {lang === 'ar' ? (
                    <>إرسال بيانات الحجز على واتساب المدرس (<bdi dir="ltr">+966 59 475 6878</bdi>)</>
                  ) : (
                    <>Send booking to WhatsApp (<bdi dir="ltr">+966 59 475 6878</bdi>)</>
                  )}
                </span>
              </a>

              <button
                onClick={closeBookingModal}
                className="py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm border border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                {lang === 'ar' ? 'إغلاق والعودة للمنصة' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
