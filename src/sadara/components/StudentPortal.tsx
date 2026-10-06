import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  FileText,
  Clock,
  TrendingUp,
  MessageCircle,
  Download,
  Send,
  Video,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export const StudentPortal: React.FC = () => {
  const { lang, user, openCertificateModal, addNotification } = useApp();

  const [activeLessonTab, setActiveLessonTab] = useState<'lessons' | 'analytics' | 'chat'>('lessons');
  const [selectedLesson, setSelectedLesson] = useState<number>(0);

  // Video player interactive state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playerMode, setPlayerMode] = useState<'interactive' | 'video' | 'embed'>('interactive');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(300); // 5 minutes sample
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);

  // Timer loop for interactive lecture playback
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1 * playbackSpeed;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, duration, playbackSpeed]);

  const lessons = [
    {
      id: 1,
      title: 'استراتيجيات الحل الذهبي في القدرات الكمي (الحل في 20 ثانية)',
      titleEn: 'Golden Strategies in Quantitative Math (20-Second Shortcuts)',
      duration: '45 دقيقة',
      durationEn: '45 Mins',
      type: 'محاضرة تفاعلية كاملة',
      typeEn: 'Interactive Masterclass',
      completed: true,
      videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      keyFormula: 'قانون التناسب العكسي: (س₁ × ص₁ = س₂ × ص₂)',
      keyFormulaEn: 'Inverse Proportion Rule: (x₁ · y₁ = x₂ · y₂)',
      notes: 'تطبيق قانون التدرج المنتظم وقاعدة ضرب الآحاد بدون إكمال العملية الحسابية الطويلة. حل تجميعات 1447 الحديثة خطوة بخطوة مع المهندس محمود شلتوت.',
      notesEn: 'Applying regular progression shortcuts and unit-digit multiplication rules to solve Qudrat problems in under 20 seconds.',
      chapters: ['00:00 - المقدمة والقواعد الذهبية', '00:45 - مسائل السرعة والمسافة', '01:30 - مسائل التناسب العكسي والطردي', '02:15 - الحل السريع بدون آلة حاسبة'],
      chaptersEn: ['00:00 - Introduction & Shortcuts', '00:45 - Speed and Distance', '01:30 - Direct & Inverse Ratios', '02:15 - Rapid Mental Calculation'],
    },
    {
      id: 2,
      title: 'التناظر اللفظي والخطأ السياقي الحديث لعام 1447',
      titleEn: 'Verbal Analogy & Contextual Error for 1447',
      duration: '50 دقيقة',
      durationEn: '50 Mins',
      type: 'جلسة زوم مسجلة',
      typeEn: 'Recorded Zoom Masterclass',
      completed: true,
      videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      keyFormula: 'قاعدة الربط: أداة : وظيفتها | سبب : نتيجة',
      keyFormulaEn: 'Relationship Rule: Tool : Function | Cause : Effect',
      notes: 'أكثر من 150 نموذج تناظر لفظي متكرر بنسبة 100% في قياس، مع شرح خوارزمية تحديد العلاقة الدقيقة بين الكلمات.',
      notesEn: 'Over 150 recurring verbal analogy models from actual Qiyas tests with relationship deduction logic.',
      chapters: ['00:00 - فهم علاقة الأداة والوظيفة', '00:50 - استراتيجية اكتشاف الخطأ السياقي', '01:40 - نماذج قياس المتكررة'],
      chaptersEn: ['00:00 - Tool-Function Correlation', '00:50 - Contextual Error Elimination', '01:40 - High-frequency Models'],
    },
    {
      id: 3,
      title: 'كيمياء التحصيلي: التفاعلات النووية ومحاكي المفاعل الحي',
      titleEn: 'Tahsili Chemistry: Nuclear Reactions & Reactor Simulator',
      duration: '60 دقيقة',
      durationEn: '60 Mins',
      type: 'تفاعلي مع المحاكي',
      typeEn: 'Live Nuclear Simulation',
      completed: true,
      videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      keyFormula: 'انشطار اليورانيوم: ²³⁵U + ¹n → ¹⁴¹Ba + ⁹²Kr + 3 ¹n + Energy',
      keyFormulaEn: 'Uranium Fission: ²³⁵U + ¹n → ¹⁴¹Ba + ⁹²Kr + 3 ¹n + Energy',
      notes: 'شرح موازنة المعادلات النووية، إشعاعات ألفا وبيتا وجاما وحساب عمر النصف وانشطار اليورانيوم-235 ودور قضبان البورون في امتصاص النيوترونات.',
      notesEn: 'Balancing nuclear reactions, alpha/beta/gamma decay, half-life formulas, and control rod absorption dynamics.',
      chapters: ['00:00 - انشطار اليورانيوم', '00:40 - موازنة الأعداد الكتلية والذرية', '01:20 - ربط المحاكي بأسئلة قياس'],
      chaptersEn: ['00:00 - Fission Fundamentals', '00:40 - Mass & Atomic Number Conservation', '01:20 - Real Qiyas Exam Applications'],
    },
    {
      id: 4,
      title: 'اختبار محاكاة قياس الشامل مع التصحيح الفوري',
      titleEn: 'Full Qiyas Simulation Exam with Real-time Grading',
      duration: '90 دقيقة',
      durationEn: '90 Mins',
      type: 'اختبار قياس تجريبي',
      typeEn: 'Full Mock Exam',
      completed: false,
      videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      keyFormula: 'إدارة الوقت: دقيقة واحدة بحد أقصى لكل سؤال',
      keyFormulaEn: 'Time Pacing: Max 60 seconds per question',
      notes: 'اختبار شامل يحاكي الضغط الزمني الفعلي للاختبار مع توزيع الدرجات والتحليل البياني للأداء.',
      notesEn: 'Complete exam simulation mirroring actual time pressures with comprehensive section diagnostics.',
      chapters: ['00:00 - توجيهات الاختبار', '00:30 - حل المسائل الصعبة مع الأستاذ'],
      chaptersEn: ['00:00 - Exam Instructions', '00:30 - Detailed Professor Walkthrough'],
    },
  ];

  const currentLessonData = lessons[selectedLesson];

  // Video controls
  const togglePlay = () => {
    if (playerMode === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Direct video playback prevented, switching to interactive whiteboard', err);
            setVideoError(true);
            setPlayerMode('interactive');
            setIsPlaying(true);
          });
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 300);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (videoRef.current && playerMode === 'video') {
      videoRef.current.currentTime = time;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (videoRef.current && videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const formatVideoTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Chat with Teacher state
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'م. محمود شلتوت',
      isTeacher: true,
      time: '10:30 ص',
      text: 'أهلاً بك يا بطل! راجعت نتيجتك في كويز الكيمياء النووية؛ أداؤك ممتاز جداً وتجاوزت 98%. ركّز على تدريبات التدرج المنتظم في الكمي.',
    },
    {
      id: 2,
      sender: 'أنا',
      isTeacher: false,
      time: '10:35 ص',
      text: 'شكراً جزيلاً أستاذنا القدير! محاكي قلب المفاعل الحي بسط لي مفهوم قضبان التحكم تماماً.',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'أنا',
      isTeacher: false,
      time: 'الآن',
      text: chatInput,
    };

    setMessages([...messages, userMsg]);
    setChatInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'م. محمود شلتوت',
          isTeacher: true,
          time: 'الآن',
          text: 'وصلتني رسالتك وسأناقشها معك في مطلع جلستنا القادمة عبر Zoom إن شاء الله!',
        },
      ]);
    }, 1000);
  };

  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Student Profile Card */}
      <div className="k rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224] p-6 sm:p-8 shadow-xl text-start mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="size-20 sm:size-24 rounded-2xl object-cover border-2 border-cyan-400 shadow-lg"
            />
            <span className="absolute -bottom-1 -right-1 size-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0c1224]" />
          </div>

          <div className="flex-1 text-center sm:text-start">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {user.name}
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                طالب مسجل · قياس 1447
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {user.email} • {user.phone}
            </p>

            {/* Badges Earned */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
              {user.badges.map((b, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                >
                  <Award className="size-3.5 text-amber-400" />
                  <span>{b}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Certificate Action */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => openCertificateModal()}
              className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-md flex items-center gap-2 cursor-pointer transition active:scale-95"
            >
              <Award className="size-4" />
              <span>استخراج شهادة إتمام الدورة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-white/10 pb-4 mb-8">
        <button
          onClick={() => setActiveLessonTab('lessons')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition ${
            activeLessonTab === 'lessons'
              ? 'bg-cyan-500 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-cyan-500'
          }`}
        >
          <BookOpen className="size-4" />
          <span>{lang === 'ar' ? 'المحاضرات والدروس المشروحة (فيديو حي)' : 'Interactive Lessons & Videos'}</span>
        </button>

        <button
          onClick={() => setActiveLessonTab('analytics')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition ${
            activeLessonTab === 'analytics'
              ? 'bg-cyan-500 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-cyan-500'
          }`}
        >
          <TrendingUp className="size-4" />
          <span>{lang === 'ar' ? 'تقرير الأداء ومتابعة التقدم' : 'Performance Analytics'}</span>
        </button>

        <button
          onClick={() => setActiveLessonTab('chat')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition ${
            activeLessonTab === 'chat'
              ? 'bg-cyan-500 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-cyan-500'
          }`}
        >
          <MessageCircle className="size-4" />
          <span>{lang === 'ar' ? 'محادثة المعلم المباشرة' : 'Direct Teacher Chat'}</span>
        </button>
      </div>

      {/* Tab 1: Video Lessons Player */}
      {activeLessonTab === 'lessons' && (
        <div className="grid lg:grid-cols-12 gap-8 items-start text-start">
          {/* Lessons List (Col 5) */}
          <div className="lg:col-span-5 space-y-3">
            {lessons.map((lesson, idx) => (
              <div
                key={lesson.id}
                onClick={() => {
                  setSelectedLesson(idx);
                  setIsPlaying(false);
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                  }
                }}
                className={`p-4 rounded-2xl border transition cursor-pointer ${
                  selectedLesson === idx
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224] hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400">{lesson.type}</span>
                  {lesson.completed ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-500 font-semibold">
                      <CheckCircle2 className="size-3.5" />
                      مكتمل
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">قيد المتابعة</span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                  {lang === 'ar' ? lesson.title : lesson.titleEn}
                </h4>

                <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="size-3" />
                  <span>{lesson.duration}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Fully Interactive Video Player (Col 7) */}
          <div className="lg:col-span-7">
            <div className="k rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224] p-6 shadow-xl">
              {/* Player Mode Switcher Tabs */}
              <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-white/10 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {lang === 'ar' ? 'نمط العرض:' : 'Viewing Mode:'}
                </span>
                <div className="flex gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setPlayerMode('interactive')}
                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                      playerMode === 'interactive'
                        ? 'bg-cyan-500 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-cyan-500'
                    }`}
                  >
                    {lang === 'ar' ? 'السبورة الذكية ✨' : 'Interactive Board ✨'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPlayerMode('video');
                      setVideoError(false);
                    }}
                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                      playerMode === 'video'
                        ? 'bg-cyan-500 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-cyan-500'
                    }`}
                  >
                    {lang === 'ar' ? 'مشغل الفيديو HD' : 'HD Video'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlayerMode('embed')}
                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                      playerMode === 'embed'
                        ? 'bg-cyan-500 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-cyan-500'
                    }`}
                  >
                    {lang === 'ar' ? 'بث زوم / يوتيوب' : 'Zoom / Embed'}
                  </button>
                </div>
              </div>

              {/* Mode 1: Interactive Whiteboard / Visual Lecture Canvas */}
              {playerMode === 'interactive' && (
                <div className="relative w-full rounded-2xl bg-gradient-to-br from-slate-950 via-[#0a1128] to-[#071330] border border-cyan-500/30 overflow-hidden shadow-2xl p-6 text-white min-h-[320px] flex flex-col justify-between">
                  {/* Top Bar with Teacher Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="relative size-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 p-0.5">
                        <img
                          src="/logo.png"
                          alt="Teacher"
                          className="w-full h-full object-cover rounded-[10px]"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-cyan-400">
                          {lang === 'ar' ? 'المهندس محمود إسماعيل شلتوت' : 'Eng. Mahmoud Shaltoot'}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <span className="size-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                          <span>{lang === 'ar' ? 'شرح مباشر تفاعلي 1447' : 'Live Lecture 1447'}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded-full font-mono border border-cyan-500/30 font-bold">
                      {isPlaying ? (lang === 'ar' ? '● جاري الشرح الآن' : '● Playing') : (lang === 'ar' ? 'متوقف مؤقتاً' : 'Paused')}
                    </span>
                  </div>

                  {/* Center Visual Slide & Formula */}
                  <div className="my-6 text-center space-y-3">
                    <div className="text-xs text-slate-400 font-medium">
                      {lang === 'ar' ? 'القاعدة الذهبية المستهدفة في هذا المقطع:' : 'Target Golden Rule in this Section:'}
                    </div>
                    <div className="text-lg sm:text-xl font-black font-mono text-cyan-300 bg-white/5 border border-cyan-500/30 py-3 px-4 rounded-xl shadow-inner max-w-lg mx-auto">
                      {lang === 'ar' ? currentLessonData.keyFormula : currentLessonData.keyFormulaEn}
                    </div>

                    {/* Animated Audio Waveform when playing */}
                    {isPlaying && (
                      <div className="flex items-center justify-center gap-1 h-8 pt-2">
                        {[40, 70, 95, 30, 85, 60, 100, 45, 80, 55, 90, 65, 35, 75].map((height, i) => (
                          <span
                            key={i}
                            style={{
                              height: `${height}%`,
                              animationDelay: `${i * 0.08}s`,
                            }}
                            className="w-1 bg-cyan-400 rounded-full animate-pulse inline-block"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Controls */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <input
                      type="range"
                      min={0}
                      max={duration}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full accent-cyan-400 h-1.5 cursor-pointer bg-white/20 rounded-lg"
                    />

                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={togglePlay}
                          className="size-8 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition cursor-pointer font-bold"
                        >
                          {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 ms-0.5" />}
                        </button>
                        <span className="text-[11px] text-slate-300">
                          {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {[1, 1.25, 1.5, 2].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleSpeedChange(s)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                              playbackSpeed === s ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {s}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mode 2: Direct Video Player */}
              {playerMode === 'video' && (
                <div className="relative w-full rounded-2xl bg-black overflow-hidden shadow-2xl group">
                  <video
                    ref={videoRef}
                    src={currentLessonData.videoSrc}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => setIsPlaying(false)}
                    onError={() => {
                      setVideoError(true);
                      setPlayerMode('interactive');
                    }}
                    className="w-full h-64 sm:h-80 object-cover cursor-pointer"
                    onClick={togglePlay}
                    playsInline
                  />

                  {/* Overlaid Play Button when paused */}
                  {!isPlaying && (
                    <div
                      onClick={togglePlay}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer transition"
                    >
                      <div className="size-16 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-2xl shadow-cyan-500/50 hover:scale-110 transition">
                        <Play className="size-8 fill-white ms-1" />
                      </div>
                    </div>
                  )}

                  {/* Video Control Bar */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 pt-6 text-white space-y-2">
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full accent-cyan-400 h-1.5 cursor-pointer bg-white/20 rounded-lg"
                    />

                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={togglePlay}
                          className="hover:text-cyan-400 transition cursor-pointer"
                        >
                          {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
                        </button>

                        <button
                          type="button"
                          onClick={toggleMute}
                          className="hover:text-cyan-400 transition cursor-pointer"
                        >
                          {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                        </button>

                        <span className="text-[11px] text-slate-300">
                          {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {[1, 1.25, 1.5, 2].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleSpeedChange(s)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                              playbackSpeed === s ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {s}x
                          </button>
                        ))}

                        <button
                          type="button"
                          onClick={handleFullscreen}
                          className="hover:text-cyan-400 ms-1 transition cursor-pointer"
                          title="ملء الشاشة"
                        >
                          <Maximize2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Top Badge */}
                  <div className="absolute top-3 ltr:left-3 rtl:right-3 text-[10px] bg-black/70 px-2.5 py-1 rounded text-cyan-400 font-mono flex items-center gap-1 backdrop-blur-sm">
                    <span>شرح: م. محمود إسماعيل شلتوت</span>
                  </div>
                </div>
              )}

              {/* Mode 3: Zoom / Embed Stream */}
              {playerMode === 'embed' && (
                <div className="relative w-full rounded-2xl bg-slate-900 border border-slate-700 overflow-hidden shadow-2xl h-72 sm:h-80 flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
                  <div className="size-14 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                    <Video className="size-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base">
                      {lang === 'ar' ? 'جلسة Zoom & Google Meet التعليمية' : 'Live Zoom & Meet Classroom'}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm">
                      {lang === 'ar'
                        ? 'يمكنك الانضمام مباشرة إلى غرفة البث المباشر عبر الرابط المعتمد مع المهندس محمود شلتوت.'
                        : 'Join the live streaming room directly via the official Zoom & Meet link.'}
                    </p>
                  </div>
                  <a
                    href="https://zoom.us/join"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs flex items-center gap-2 shadow-lg transition"
                  >
                    <Video className="size-4" />
                    <span>{lang === 'ar' ? 'دخول غرفة البث المباشر' : 'Join Live Stream'}</span>
                  </a>
                </div>
              )}

              {/* Lesson details & Chapters */}
              <div className="mt-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {lang === 'ar' ? currentLessonData.title : currentLessonData.titleEn}
                </h3>

                <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold text-cyan-600 dark:text-cyan-400 block mb-1">
                    {lang === 'ar' ? 'ملخص الدرس والملاحظات الأكاديمية:' : 'Lesson Summary & Academic Notes:'}
                  </span>
                  {lang === 'ar' ? currentLessonData.notes : currentLessonData.notesEn}
                </div>

                {/* Chapters */}
                <div className="mt-4">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">
                    {lang === 'ar' ? 'فصول الدرس والتوقيتات:' : 'Lesson Chapters & Timestamps:'}
                  </span>
                  <div className="grid sm:grid-cols-2 gap-2 text-xs">
                    {(lang === 'ar' ? currentLessonData.chapters : currentLessonData.chaptersEn).map((ch, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-slate-700 dark:text-slate-300 flex items-center gap-2"
                      >
                        <span className="size-1.5 rounded-full bg-cyan-400 shrink-0" />
                        <span>{ch}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => addNotification(lang === 'ar' ? 'تحميل الملخص' : 'Download Summary', lang === 'ar' ? 'تم بدء تحميل مذكرة الشرح بصيغة PDF.' : 'PDF study summary downloaded successfully.')}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="size-3.5 text-cyan-500" />
                    <span>{lang === 'ar' ? 'تحميل ملخص الـ PDF' : 'Download PDF Summary'}</span>
                  </button>
                  <button
                    onClick={() => addNotification(lang === 'ar' ? 'إتمام الدرس' : 'Lesson Completed', lang === 'ar' ? 'تم تسجيل إتمام المحاضرة وإضافتها لسجلك الأكاديمي.' : 'Lecture marked as completed and added to transcript.')}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="size-3.5 text-emerald-500" />
                    <span>{lang === 'ar' ? 'تحديد الدرس كمكتمل' : 'Mark as Completed'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Analytics */}
      {activeLessonTab === 'analytics' && (
        <div className="grid md:grid-cols-3 gap-6 text-start">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224] shadow-md">
            <span className="text-xs font-bold text-cyan-500">
              {lang === 'ar' ? 'معدل الإنجاز العام' : 'Overall Completion Rate'}
            </span>
            <div className="text-4xl font-black text-slate-900 dark:text-white mt-2">85%</div>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'ar' ? 'أكملت 17 درساً من أصل 20' : 'Completed 17 of 20 Lessons'}
            </p>
            <div className="mt-4 w-full h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
              <div className="w-[85%] h-full bg-cyan-500 rounded-full" />
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224] shadow-md">
            <span className="text-xs font-bold text-blue-500">
              {lang === 'ar' ? 'متوسط درجات الاختبارات' : 'Average Test Score'}
            </span>
            <div className="text-4xl font-black text-slate-900 dark:text-white mt-2">96.5%</div>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'ar' ? 'أعلى من 97% من طلاب دفعتك' : 'Top 3% of your class'}
            </p>
            <div className="mt-4 w-full h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
              <div className="w-[96%] h-full bg-blue-500 rounded-full" />
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224] shadow-md">
            <span className="text-xs font-bold text-emerald-500">
              {lang === 'ar' ? 'نقاط القوة التنافسية' : 'Competitive Strengths'}
            </span>
            <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div>• {lang === 'ar' ? 'مسائل السرعة والمسافة (كمي): 99%' : 'Speed & Distance Math: 99%'}</div>
              <div>• {lang === 'ar' ? 'موازنة التفاعلات النووية: 100%' : 'Nuclear Reactions Balancing: 100%'}</div>
              <div>• {lang === 'ar' ? 'استيعاب المقروء (لفظي): 94%' : 'Reading Comprehension: 94%'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Chat with Teacher */}
      {activeLessonTab === 'chat' && (
        <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224] shadow-xl overflow-hidden flex flex-col h-[520px] text-start">
          <div className="p-4 border-b border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                م
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  م. محمود إسماعيل شلتوت
                </div>
                <div className="text-[11px] text-emerald-500 flex items-center gap-1">
                  <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                  متواجد للرد على الاستفسارات
                </div>
              </div>
            </div>
            <span className="text-xs text-slate-400">جلسات خاصة أونلاين</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40 dark:bg-transparent">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col max-w-[80%] ${
                  m.isTeacher ? 'self-start' : 'self-end items-end'
                }`}
              >
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    m.isTeacher
                      ? 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white rounded-tl-none'
                      : 'bg-cyan-500 text-white rounded-tr-none shadow-md'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-slate-100 dark:border-white/10 bg-white dark:bg-[#0c1224] flex gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="اكتب سؤالك الأكاديمي للأستاذ محمود هنا..."
              className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition active:scale-95"
            >
              <Send className="size-3.5" />
              <span>إرسال</span>
            </button>
          </form>
        </div>
      )}
    </section>
  );
};
