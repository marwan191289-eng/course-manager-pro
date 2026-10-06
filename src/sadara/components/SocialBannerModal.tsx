import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SITE_INFO } from '../data/mockData';
import {
  Share2,
  X,
  Copy,
  Check,
  Globe,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Send,
  Download,
  QrCode,
  Atom,
  CheckCircle2,
  Heart,
  Repeat2,
  Bookmark,
  ThumbsUp,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SocialBannerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { lang, t, formattedStudentCount } = useApp();
  const [platform, setPlatform] = useState<'whatsapp' | 'twitter' | 'facebook' | 'linkedin' | 'telegram' | 'tiktok'>('whatsapp');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPost, setCopiedPost] = useState(false);

  if (!isOpen) return null;

  const shareUrl = 'https://sadara-edu.sa';
  const shareTitleAr = 'صدارة | منصة القدرات والتحصيلي والكيمياء — م. محمود إسماعيل شلتوت';
  const shareTitleEn = 'Sadara | Nuclear Chemistry, Qudrat & Tahsili Gateway — Eng. Mahmoud Shaltoot';

  const shareDescriptionAr =
    'تصدّر دفعتك في اختبارات القدرات والتحصيلي والكيمياء النووية. بنك أسئلة ذكي، محاكي قلب المفاعل الحي، وحجز جلسات فردية عبر Zoom وGoogle Meet بنسبة تحسن 94%.';
  const shareDescriptionEn =
    'Lead your class in Qudrat, Tahsili & Nuclear Chemistry. Smart question bank, live reactor simulator, and 1-on-1 Zoom masterclasses with 94% improvement rate.';

  const shareTitle = lang === 'ar' ? shareTitleAr : shareTitleEn;
  const shareDescription = lang === 'ar' ? shareDescriptionAr : shareDescriptionEn;

  const postCopy = {
    whatsapp: `🚀 *منصة صدارة التعليمية 1447هـ*\nبإشراف المهندس *محمود إسماعيل شلتوت*\n\n✅ تفوق في اختبارات القدرات والتحصيلي والكيمياء\n⚛️ جرب محاكي قلب المفاعل الحي التفاعلي مجاناً\n🎯 تجميعات 1447 المحلولة خطوة بخطوة\n📲 احجز جلستك الفردية مع المدرس الآن:\n${shareUrl}\n\nللتواصل والاستفسار:\nواتساب: +966 59 475 6878`,
    twitter: `تصدّر دفعتك في القدرات والتحصيلي والكيمياء مع المهندس محمود شلتوت ⚛️✨\n\n🔹 محاكي قلب المفاعل الحي التفاعلي\n🔹 بنك أسئلة ذكي مع الشرح الفوري\n🔹 جلسات فردية مباشرة عبر Zoom\n🔹 نسبة تحسن طلابنا 94% (+12,400 طالب)\n\n🔗 ${shareUrl}\n\n#قدرات #تحصيلي #صدارة #كيمياء_نووية #قياس`,
    facebook: `تعلن منصة صدارة عن فتح باب التسجيل في باقات الجلسات المباشرة لاختبارات القدرات العامة والتحصيلي لعام 1447هـ بإشراف المهندس محمود إسماعيل شلتوت.\n\nاستمتع بتجربة "محاكي قلب المفاعل الحي" لفهم التفاعلات النووية، وبنك الأسئلة الذكي المصمم لنقلك إلى +95%.\n\nللتسجيل وحجز المواعيد: ${shareUrl}`,
    linkedin: `Proud to present "Sadara Educational Gateway" — Saudi Arabia & Gulf's leading platform for Qudrat, Tahsili, and Nuclear Chemistry mastery supervised by Eng. Mahmoud Ismail Shaltoot.\n\nFeaturing the Live Nuclear Reactor Core Simulator and personalized high-impact tutoring.\n\nLearn more at: ${shareUrl}`,
    telegram: `📢 منصة صدارة — بوابتك للمجموع العالي في القدرات والتحصيلي 1447\n\n📌 جلسات مباشرة مع م. محمود شلتوت\n📌 بنك أسئلة تفاعلي وتجميعات حديثة\n📌 تجربة محاكي قلب المفاعل الحي الفريدة\n\nرابط المنصة الرسمي: ${shareUrl}`,
    tiktok: `منصة صدارة — أقوى منصة قدرات وتحصيلي وكيمياء في السعودية والخليج! الرابط في البايو 🚀`,
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyPost = () => {
    navigator.clipboard.writeText(postCopy[platform]);
    setCopiedPost(true);
    setTimeout(() => setCopiedPost(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0c1224] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-white/15 my-6 text-start text-slate-900 dark:text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 ltr:right-6 rtl:left-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
        >
          <X className="size-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-2">
            <Sparkles className="size-3.5" />
            <span>معاينة وتخصيص بطاقات المشاركة الاجتماعية لمنصة صدارة</span>
          </div>
          <h3 className="text-2xl font-black">
            بطاقات النشر والمشاركة المعتمدة (Social Share Cards)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            تصميمات بصرية دقيقة تحاكي عرض الرابط على منصات واتساب، إكس (تويتر)، فيسبوك، لينكد إن، تليجرام، وتيك توك.
          </p>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'whatsapp', label: 'واتساب WhatsApp', color: 'bg-emerald-500' },
            { id: 'twitter', label: 'إكس (Twitter / 𝕏)', color: 'bg-slate-900' },
            { id: 'facebook', label: 'فيسبوك Facebook', color: 'bg-blue-600' },
            { id: 'linkedin', label: 'لينكد إن LinkedIn', color: 'bg-blue-700' },
            { id: 'telegram', label: 'تليجرام Telegram', color: 'bg-cyan-500' },
            { id: 'tiktok', label: 'تيك توك TikTok', color: 'bg-pink-600' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                platform === p.id
                  ? 'bg-cyan-500 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Realistic Mockup Preview Box */}
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 mb-6 overflow-hidden">
          {/* 1. WHATSAPP NATIVE CARD MOCKUP */}
          {platform === 'whatsapp' && (
            <div className="max-w-md mx-auto bg-[#e5ddd5] dark:bg-[#0b141a] p-4 rounded-2xl shadow-lg font-sans">
              <div className="bg-white dark:bg-[#1f2c34] rounded-2xl p-2.5 shadow-md border border-slate-200 dark:border-white/5 text-start">
                {/* Embedded Link Card */}
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#111b21]">
                  <div className="relative h-44 bg-gradient-to-tr from-blue-900 via-cyan-900 to-indigo-950 flex flex-col items-center justify-center p-4 text-center">
                    <Atom className="size-16 text-cyan-400 mb-2 animate-pulse" />
                    <div className="text-xl font-black text-white">صدارة — SADARA</div>
                    <div className="text-[11px] text-cyan-300 font-medium">
                      منصة الكيمياء النووية والقدرات • م. محمود شلتوت
                    </div>
                    <span className="absolute bottom-2 ltr:left-2 rtl:right-2 text-[10px] bg-black/60 px-2 py-0.5 rounded text-white font-mono">
                      {formattedStudentCount} طالب
                    </span>
                  </div>
                  <div className="p-3">
                    <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                      {shareTitleAr}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {shareDescriptionAr}
                    </p>
                    <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <span>🔗</span>
                      <span>sadara-edu.sa</span>
                    </div>
                  </div>
                </div>
                {/* Chat message text */}
                <div className="mt-2 text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line px-1">
                  تصدّر دفعتك في القدرات والتحصيلي مع المهندس محمود شلتوت! رابط المنصة المعتمد 🚀
                </div>
                <div className="text-end text-[10px] text-slate-400 mt-1">11:42 م ✓✓</div>
              </div>
            </div>
          )}

          {/* 2. TWITTER / X CARD MOCKUP */}
          {platform === 'twitter' && (
            <div className="max-w-md mx-auto bg-white dark:bg-black p-4 rounded-2xl border border-slate-200 dark:border-white/15 shadow-xl text-start">
              {/* Tweet Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="size-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  م
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-white">
                    <span>المهندس محمود إسماعيل شلتوت</span>
                    <span className="text-sky-400">✓</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">@MahmoudShaltoot</div>
                </div>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed mb-3">
                تصدّر دفعتك في اختبارات القدرات والتحصيلي والكيمياء النووية. محاكي قلب المفاعل الحي التفاعلي، وبنك الأسئلة الذكي لعام 1447هـ.
              </p>
              {/* Large Image Card */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#16181c]">
                <div className="h-44 bg-gradient-to-r from-blue-900 via-cyan-900 to-slate-900 flex flex-col items-center justify-center p-4 text-center">
                  <div className="text-2xl font-black text-white">صدارة | SADARA</div>
                  <div className="text-xs text-cyan-300 mt-1">
                    محاكي قلب المفاعل الحي • جلسات Zoom المباشرة
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-[10px] text-white/90">
                    <span>94% تحسن</span>
                    <span>•</span>
                    <span>4.9★ تقييم</span>
                  </div>
                </div>
                <div className="p-3">
                  <span className="text-[10px] text-slate-400 font-mono">sadara-edu.sa</span>
                  <div className="font-bold text-xs text-slate-900 dark:text-white mt-0.5 line-clamp-1">
                    {shareTitleAr}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {shareDescriptionAr}
                  </p>
                </div>
              </div>
              {/* Tweet footer */}
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-slate-400 text-xs px-2">
                <span className="flex items-center gap-1"><Heart className="size-3.5 text-rose-500" /> 2.4K</span>
                <span className="flex items-center gap-1"><Repeat2 className="size-3.5 text-emerald-500" /> 840</span>
                <span className="flex items-center gap-1"><Bookmark className="size-3.5" /> 512</span>
              </div>
            </div>
          )}

          {/* 3. FACEBOOK CARD MOCKUP */}
          {platform === 'facebook' && (
            <div className="max-w-md mx-auto bg-white dark:bg-[#242526] p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl text-start">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="size-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  ص
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1">
                    <span>منصة صدارة التعليمية</span>
                    <span className="text-blue-500 text-[10px]">●</span>
                  </div>
                  <div className="text-[10px] text-slate-400">منذ ساعتين • 🌐 عام</div>
                </div>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed mb-3">
                متاح الآن لطلاب المملكة ودول الخليج العربي: التسجيل في جلسات القدرات والتحصيلي مع المهندس محمود شلتوت.
              </p>
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#3a3b3c]">
                <div className="h-40 bg-gradient-to-tr from-blue-950 via-cyan-900 to-indigo-900 flex flex-col items-center justify-center text-white text-center p-4">
                  <div className="text-xl font-black">صدارة — SADARA</div>
                  <div className="text-xs text-cyan-300">منصة القدرات والتحصيلي والكيمياء</div>
                </div>
                <div className="p-3">
                  <div className="text-[10px] uppercase font-mono text-slate-400">SADARA-EDU.SA</div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white mt-0.5">
                    {shareTitleAr}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. LINKEDIN CARD MOCKUP */}
          {platform === 'linkedin' && (
            <div className="max-w-md mx-auto bg-white dark:bg-[#1b1f23] p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl text-start">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="size-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
                  in
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    Sadara Educational Gateway
                  </div>
                  <div className="text-[10px] text-slate-400">E-Learning & STEM Education • Gulf Region</div>
                </div>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                {postCopy.linkedin}
              </p>
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-white/10">
                <div className="h-36 bg-gradient-to-r from-blue-900 to-cyan-800 flex items-center justify-center text-white font-bold text-lg">
                  SADARA • Gulf Tutoring Excellence
                </div>
                <div className="p-3 bg-slate-50 dark:bg-[#282d32]">
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    {shareTitleEn}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">sadara-edu.sa</div>
                </div>
              </div>
            </div>
          )}

          {/* 5. TELEGRAM CARD MOCKUP */}
          {platform === 'telegram' && (
            <div className="max-w-md mx-auto bg-[#f4f4f5] dark:bg-[#182533] p-4 rounded-2xl shadow-xl text-start font-sans">
              <div className="bg-white dark:bg-[#202b36] p-3.5 rounded-xl border border-slate-200 dark:border-white/5 space-y-2">
                <div className="text-xs text-cyan-600 dark:text-cyan-400 font-bold">
                  قناة صدارة للقدرات والتحصيلي 1447
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  {postCopy.telegram}
                </p>
                <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-white/10">
                  <div className="h-32 bg-cyan-950 flex items-center justify-center text-cyan-300 font-bold text-sm">
                    محاكي قلب المفاعل الحي • بنك الأسئلة
                  </div>
                </div>
                <div className="text-end text-[10px] text-slate-400">14:20</div>
              </div>
            </div>
          )}

          {/* 6. TIKTOK BIO / STORY CARD MOCKUP */}
          {platform === 'tiktok' && (
            <div className="max-w-xs mx-auto bg-black text-white p-6 rounded-3xl border border-slate-800 text-center shadow-2xl relative overflow-hidden">
              <div className="size-16 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-cyan-400 to-yellow-400 mx-auto mb-3">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-cyan-400">
                  صدارة
                </div>
              </div>
              <div className="font-black text-base">@sadara.edu</div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                منصة الكيمياء النووية والقدرات والتحصيلي مع م. محمود شلتوت ⚛️ الرابط المعتمد:
              </p>
              <div className="mt-4 p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono text-xs border border-cyan-400/40">
                🔗 sadara-edu.sa
              </div>
            </div>
          )}
        </div>

        {/* Copy Actions Footer */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="p-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-xs text-slate-700 dark:text-slate-300 font-mono flex-1"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 shrink-0 transition cursor-pointer"
              >
                {copiedLink ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                <span>{copiedLink ? 'تم نسخ الرابط' : 'نسخ الرابط'}</span>
              </button>
            </div>

            <button
              onClick={handleCopyPost}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-cyan-500 hover:bg-cyan-600 shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95 shrink-0"
            >
              {copiedPost ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              <span>نسخ المنشور المخصص للمنصة ({platform})</span>
            </button>
          </div>

          {/* Quick Direct WhatsApp Share */}
          <div className="text-center sm:text-start pt-1">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(postCopy.whatsapp)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <MessageCircle className="size-4" />
              <span>مشاركة مباشرة عبر تطبيق واتساب (WhatsApp Web / App)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
