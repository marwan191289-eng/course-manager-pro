import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_LOGIN_ACTIVITIES, SITE_INFO } from '../data/mockData';
import {
  X,
  Mail,
  Lock,
  Phone,
  Shield,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  RefreshCw,
  Key,
  Globe,
  Apple,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, user, setUser, addNotification, socialLogin } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'security'>('login');
  const [email, setEmail] = useState('m.alshammari@gmail.com');
  const [password, setPassword] = useState('••••••••••');
  const [phone, setPhone] = useState('+966 59 123 4567');
  const [recoveryChannel, setRecoveryChannel] = useState<'email' | 'sms' | 'whatsapp'>('whatsapp');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user.twoFactorEnabled);
  const [recoverySent, setRecoverySent] = useState(false);
  const [loginActivities, setLoginActivities] = useState(INITIAL_LOGIN_ACTIVITIES);

  if (!isAuthModalOpen) return null;

  const handleLogoutAllDevices = () => {
    setLoginActivities([
      {
        id: 'act-' + Date.now(),
        device: 'الجهاز الحالي فقط (Session Secured)',
        browser: 'Current Browser',
        ip: '188.52.140.21',
        location: 'الرياض، المملكة العربية السعودية',
        timestamp: 'الآن',
        status: 'normal',
      },
    ]);
    addNotification('الأمان والحساب', 'تم تسجيل الخروج فوراً من كافة الأجهزة الأخرى المرتبطة بحسابك.');
  };

  const handleToggle2FA = () => {
    const updated = !twoFactorEnabled;
    setTwoFactorEnabled(updated);
    setUser((prev) => ({ ...prev, twoFactorEnabled: updated }));
    addNotification(
      'المصادقة الثنائية (2FA)',
      updated
        ? 'تم تفعيل المصادقة الثنائية 2FA عبر رمز التحقق.'
        : 'تم تعطيل المصادقة الثنائية.'
    );
  };

  const handleSendRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoverySent(true);
    addNotification(
      'استعادة كلمة المرور',
      `تم إرسال رابط إعادة تعيين كلمة المرور عبر ${
        recoveryChannel === 'whatsapp'
          ? 'واتساب (+966 59 475 6878)'
          : recoveryChannel === 'sms'
          ? 'رسالة نصية قصيرة SMS'
          : 'البريد الإلكتروني'
      }.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0c1224] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-white/15 my-8 text-start text-slate-900 dark:text-white">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-6 ltr:right-6 rtl:left-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
        >
          <X className="size-5" />
        </button>

        {/* Modal Header & Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 pb-3 border-b border-slate-100 dark:border-white/10">
            <button
              onClick={() => {
                setMode('login');
                setRecoverySent(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                mode === 'login'
                  ? 'bg-cyan-500 text-white'
                  : 'text-slate-500 hover:text-cyan-500'
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => {
                setMode('register');
                setRecoverySent(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                mode === 'register'
                  ? 'bg-cyan-500 text-white'
                  : 'text-slate-500 hover:text-cyan-500'
              }`}
            >
              إنشاء حساب جديد
            </button>
            <button
              onClick={() => setMode('security')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                mode === 'security'
                  ? 'bg-cyan-500 text-white'
                  : 'text-slate-500 hover:text-cyan-500'
              }`}
            >
              إعدادات الأمان والـ 2FA
            </button>
          </div>
        </div>

        {/* LOGIN / REGISTER FORM */}
        {(mode === 'login' || mode === 'register') && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-black">
                {mode === 'login' ? 'مرحباً بك مجدداً في صدارة' : 'إنشاء حساب طالب / ولي أمر جديد'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                ادخل بياناتك للوصول إلى الجلسات المباشرة وبنك الأسئلة والمحاكي.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addNotification('تم تسجيل الدخول بنجاح', `أهلاً بك يا ${user.name}`);
                closeAuthModal();
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="size-4 text-slate-400 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full ltr:pl-9 rtl:pr-9 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    كلمة المرور
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-cyan-500 hover:underline cursor-pointer"
                    >
                      نسيت كلمة المرور؟
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="size-4 text-slate-400 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full ltr:pl-9 rtl:pr-9 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/25 cursor-pointer transition active:scale-95"
              >
                {mode === 'login' ? 'دخول فوري' : 'تأكيد التسجيل'}
              </button>
            </form>

            {/* Social Logins: iCloud, Gmail, LinkedIn, X, Facebook, GitHub */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/10">
              <span className="text-[11px] text-slate-400 block text-center mb-3">
                أو الدخول بضغطة زر عبر حساباتك المعتمدة:
              </span>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    socialLogin('icloud');
                    closeAuthModal();
                  }}
                  className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Apple className="size-4" />
                  <span>iCloud</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    socialLogin('google');
                    closeAuthModal();
                  }}
                  className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Globe className="size-4 text-rose-500" />
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    socialLogin('linkedin');
                    closeAuthModal();
                  }}
                  className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="font-bold text-blue-500">in</span>
                  <span>LinkedIn</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    socialLogin('X (Twitter)');
                    closeAuthModal();
                  }}
                  className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="font-black">𝕏</span>
                  <span>X (Twitter)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    socialLogin('Facebook');
                    closeAuthModal();
                  }}
                  className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="font-bold text-blue-600">f</span>
                  <span>Facebook</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    socialLogin('GitHub');
                    closeAuthModal();
                  }}
                  className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>GitHub</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-black">استعادة كلمة المرور</h3>
              <p className="text-xs text-slate-500 mt-1">
                اختر الطريقة الأنسب لك لاستلام رابط أو كود إعادة التعيين الفوري.
              </p>
            </div>

            {recoverySent ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="size-4" />
                  <span>تم إرسال تعليمات الاستعادة بنجاح!</span>
                </div>
                <div>
                  يرجى تفقد رسائلك، أو التواصل مع الدعم المباشر على واتساب{' '}
                  <span className="font-bold">{SITE_INFO.phone}</span>.
                </div>
                <button
                  onClick={() => setMode('login')}
                  className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold cursor-pointer"
                >
                  العودة لتسجيل الدخول
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendRecovery} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                    قناة الاستعادة المفضلة:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRecoveryChannel('whatsapp')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        recoveryChannel === 'whatsapp'
                          ? 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : 'border-slate-200 dark:border-white/10 text-slate-500'
                      }`}
                    >
                      واتساب (WhatsApp)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecoveryChannel('sms')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        recoveryChannel === 'sms'
                          ? 'border-blue-500 bg-blue-500/15 text-blue-600 dark:text-blue-400'
                          : 'border-slate-200 dark:border-white/10 text-slate-500'
                      }`}
                    >
                      رسالة قصيرة SMS
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecoveryChannel('email')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        recoveryChannel === 'email'
                          ? 'border-cyan-500 bg-cyan-500/15 text-cyan-600 dark:text-cyan-400'
                          : 'border-slate-200 dark:border-white/10 text-slate-500'
                      }`}
                    >
                      البريد الإلكتروني
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {recoveryChannel === 'email' ? 'أدخل بريدك الإلكتروني' : 'أدخل رقم جوالك'}
                  </label>
                  <input
                    type="text"
                    required
                    value={recoveryChannel === 'email' ? email : phone}
                    onChange={(e) =>
                      recoveryChannel === 'email'
                        ? setEmail(e.target.value)
                        : setPhone(e.target.value)
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-500"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl font-bold text-xs text-white bg-cyan-600 hover:bg-cyan-500 cursor-pointer"
                  >
                    إرسال كود الاستعادة
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* SECURITY & 2FA & ACTIVE SESSIONS TAB */}
        {mode === 'security' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-black">إعدادات الأمان والمصادقة المتقدمة</h3>
              <p className="text-xs text-slate-500 mt-1">
                حماية الحساب، المصادقة الثنائية 2FA، وتقارير نشاط جلسات الدخول.
              </p>
            </div>

            {/* 2FA Toggle */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Key className="size-4 text-cyan-500" />
                  <span>المصادقة الثنائية (Two-Factor Authentication 2FA)</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  طلب رمز إضافي عند محاولة تسجيل الدخول من أجهزة جديدة.
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggle2FA}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  twoFactorEnabled
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {twoFactorEnabled ? 'مفعلة ✓' : 'معطلة'}
              </button>
            </div>

            {/* Logout from all devices button */}
            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs sm:text-sm text-rose-500 flex items-center gap-1.5">
                  <LogOut className="size-4" />
                  <span>تسجيل الخروج من كافة الأجهزة المرتبطة فوراً</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  إنهاء جميع الجلسات النشطة في حال الاشتباه بدخول غير معتاد.
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogoutAllDevices}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer active:scale-95 transition"
              >
                إنهاء الجلسات
              </button>
            </div>

            {/* Activity Log */}
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-2">
                سجل النشاط المفصل لآخر جلسات الدخول:
              </span>
              <div className="space-y-2">
                {loginActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Smartphone className="size-3.5 text-cyan-500" />
                        <span>{act.device}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {act.location} • IP: {act.ip}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
