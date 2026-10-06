import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SITE_INFO } from '../data/mockData';
import {
  MessageSquare,
  X,
  Send,
  Phone,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const LiveChatWidget: React.FC = () => {
  const { lang, openBookingModal } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'الدعم المباشر — صدارة',
      isBot: true,
      time: 'الآن',
      text: 'مرحباً بك في منصة صدارة! كيف يمكننا مساعدتك اليوم بخصوص جلسات القدرات والتحصيلي مع المهندس محمود شلتوت؟',
    },
  ]);
  const [input, setInput] = useState('');

  const quickReplies = [
    'كيف أحجز جلسة خاصة على Zoom؟',
    'ما هي باقة الـ 5 جلسات (650 ر.س)؟',
    'كيف أشغل محاكي قلب المفاعل الحي؟',
    'طرق الدفع المتاحة في السعودية والخليج',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'أنت',
      isBot: false,
      time: 'الآن',
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Dynamic intelligent support responses
    setTimeout(() => {
      let reply = 'شكراً لتواصلك! يمكنك التحدث معنا مباشرة عبر واتساب المعتمد: ' + SITE_INFO.phone;
      if (text.includes('حجز') || text.includes('Zoom')) {
        reply =
          'يمكنك حجز جلستك مباشرة باختيار اليوم والوقت المناسب وتصلك روابط Zoom وGoogle Meet وتأكيد الواتساب فوراً!';
      } else if (text.includes('باقة') || text.includes('650') || text.includes('150')) {
        reply =
          'الأسعار المعتمدة هي 150 ر.س للجلسة الواحدة، 650 ر.س لباقة 5 جلسات، و1,200 ر.س لباقة النخبة VIP 10 جلسات مع وصول غير محدود لمحاكي المفاعل ومتابعة خاصة.';
      } else if (text.includes('محاكي') || text.includes('المفاعل')) {
        reply =
          'محاكي قلب المفاعل الحي صممه المهندس محمود شلتوت لتبسيط كيمياء النواة والانشطار لطلاب التحصيلي. اضغط على تبويب "محاكي قلب المفاعل الحي" في الشريط العلوي لتجربته!';
      } else if (text.includes('دفع')) {
        reply =
          'الدفع متاح وسريع بلمسة واحدة عبر مدى (Mada)، Apple Pay، فيزا/ماستركارد، وSTC Pay لجميع دول الخليج.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'فريق دعم صدارة',
          isBot: true,
          time: 'الآن',
          text: reply,
        },
      ]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 ltr:right-6 rtl:left-6 z-40">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative size-14 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-white shadow-2xl shadow-cyan-500/40 hover:scale-105 transition flex items-center justify-center cursor-pointer active:scale-95"
          aria-label="فتح الدعم المباشر"
        >
          <MessageSquare className="size-6" />
          <span className="absolute -top-1 -right-1 size-4 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[390px] h-[520px] max-h-[85vh] rounded-3xl bg-white dark:bg-[#0c1224] border border-slate-200 dark:border-white/15 shadow-2xl flex flex-col overflow-hidden text-start animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-700 via-cyan-600 to-teal-500 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Bot className="size-5" />
              </div>
              <div>
                <div className="font-bold text-sm">بوابة الدعم المباشر 24/7</div>
                <div className="text-[11px] text-cyan-100 flex items-center gap-1">
                  <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                  مستشار أكاديمي متصل الآن
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Quick Handover Bar */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2 border-b border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-300">
            <span>تحتاج رداً فورياً على واتساب؟</span>
            <a
              href={SITE_INFO.socials.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold flex items-center gap-1 underline"
            >
              <Phone className="size-3" />
              <span dir="ltr" className="inline-block font-mono">+966 59 475 6878</span>
            </a>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-transparent">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col max-w-[85%] ${
                  m.isBot ? 'self-start' : 'self-end items-end'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    m.isBot
                      ? 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 rounded-tl-none'
                      : 'bg-cyan-500 text-white rounded-tr-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Quick reply chips */}
          <div className="p-2 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 flex gap-1.5 overflow-x-auto text-[11px]">
            {quickReplies.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-cyan-500 hover:border-cyan-500 text-[10px] cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-slate-100 dark:border-white/10 bg-white dark:bg-[#0c1224] flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب استفسارك هنا..."
              className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white transition cursor-pointer"
            >
              <Send className="size-4 rtl:rotate-180" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
