import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, Lock, User, Loader2, ShieldCheck } from 'lucide-react';

type Mode = 'login' | 'register' | 'reset';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.94l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.56 10.56 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
  </svg>
);
const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden>
    <path d="M16.37 1.43c0 1.14-.42 2.2-1.12 2.98-.84.93-2.2 1.65-3.3 1.56-.14-1.1.42-2.27 1.1-3 .77-.85 2.1-1.48 3.32-1.54zM20.5 17.1c-.56 1.3-.83 1.88-1.55 3.03-1 1.6-2.43 3.6-4.19 3.62-1.56.01-1.96-1.02-4.08-1-2.12.01-2.56 1.02-4.12 1-1.76-.02-3.1-1.82-4.11-3.42C-.37 15.86-.67 10.58 1.15 7.8c1.29-1.98 3.33-3.14 5.25-3.14 1.95 0 3.18 1.07 4.8 1.07 1.56 0 2.52-1.07 4.77-1.07 1.7 0 3.5.93 4.79 2.53-4.21 2.31-3.53 8.32-.26 9.91z" />
  </svg>
);
const MicrosoftIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
    <path fill="#F25022" d="M1 1h10.5v10.5H1z" />
    <path fill="#7FBA00" d="M12.5 1H23v10.5H12.5z" />
    <path fill="#00A4EF" d="M1 12.5h10.5V23H1z" />
    <path fill="#FFB900" d="M12.5 12.5H23V23H12.5z" />
  </svg>
);

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, emailSignIn, emailSignUp, sendPasswordReset, socialLogin, lang } = useApp();
  const ar = lang === 'ar';
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  if (!isAuthModalOpen) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setBusy(true);
    let err: string | null = null;
    if (mode === 'login') err = await emailSignIn(email, password);
    else if (mode === 'register') {
      err = await emailSignUp(name, email, password);
      if (!err) setInfo(ar ? 'تم إنشاء الحساب! تحقق من بريدك الإلكتروني واضغط رابط التفعيل ثم سجّل الدخول.' : 'Account created! Check your email to confirm, then sign in.');
    } else {
      err = await sendPasswordReset(email);
      if (!err) setInfo(ar ? 'أرسلنا رابط إعادة تعيين كلمة المرور إلى بريدك.' : 'Password reset link sent to your email.');
    }
    setBusy(false);
    if (err) setError(err === 'Invalid login credentials' ? (ar ? 'البريد أو كلمة المرور غير صحيحة' : err) : err);
  };

  const social = async (p: string) => {
    setError('');
    const err = await socialLogin(p);
    if (err) setError(err);
  };

  const input = 'sadara-input w-full ps-10 pe-3 py-3 rounded-xl text-sm';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="sadara-panel relative w-full max-w-md rounded-3xl p-7 sm:p-8 my-8">
        <button onClick={closeAuthModal} aria-label="close" className="absolute top-5 end-5 p-2 rounded-xl opacity-60 hover:opacity-100 cursor-pointer">
          <X className="size-5" />
        </button>

        <div className="text-center mb-6">
          <img src="/logo.png" alt="Sadara" className="size-14 mx-auto mb-3 rounded-2xl" />
          <h3 className="text-2xl font-black">
            {mode === 'login' ? (ar ? 'تسجيل الدخول' : 'Sign in') : mode === 'register' ? (ar ? 'إنشاء حساب جديد' : 'Create account') : ar ? 'استعادة كلمة المرور' : 'Reset password'}
          </h3>
          <p className="text-sm opacity-70 mt-1">{ar ? 'منصة صدارة التعليمية — م. محمود شلتوت' : 'Sadara learning platform'}</p>
        </div>

        {mode !== 'reset' && (
          <>
            <div className="grid gap-2.5">
              <button type="button" onClick={() => social('google')} className="sadara-social">
                <GoogleIcon />
                <span>{ar ? 'المتابعة عبر Gmail / Google' : 'Continue with Google'}</span>
              </button>
              <button type="button" onClick={() => social('apple')} className="sadara-social">
                <AppleIcon />
                <span>{ar ? 'المتابعة عبر Apple / iCloud' : 'Continue with Apple'}</span>
              </button>
              <button type="button" onClick={() => social('microsoft')} className="sadara-social">
                <MicrosoftIcon />
                <span>{ar ? 'المتابعة عبر Microsoft / Outlook' : 'Continue with Microsoft'}</span>
              </button>
            </div>
            <div className="flex items-center gap-3 my-5 text-xs opacity-60">
              <span className="flex-1 h-px bg-current opacity-30" />
              {ar ? 'أو بالبريد الإلكتروني' : 'or with email'}
              <span className="flex-1 h-px bg-current opacity-30" />
            </div>
          </>
        )}

        <form onSubmit={submit} className="space-y-3">
          {mode === 'register' && (
            <div className="relative">
              <User className="size-4 absolute start-3.5 top-1/2 -translate-y-1/2 opacity-50" />
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder={ar ? 'الاسم الكامل' : 'Full name'} className={input} />
            </div>
          )}
          <div className="relative">
            <Mail className="size-4 absolute start-3.5 top-1/2 -translate-y-1/2 opacity-50" />
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={ar ? 'البريد الإلكتروني' : 'Email'} className={input} dir="ltr" />
          </div>
          {mode !== 'reset' && (
            <div className="relative">
              <Lock className="size-4 absolute start-3.5 top-1/2 -translate-y-1/2 opacity-50" />
              <input required minLength={6} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={ar ? 'كلمة المرور (6 أحرف على الأقل)' : 'Password'} className={input} dir="ltr" />
            </div>
          )}

          {error && <p className="text-sm text-rose-500 font-semibold">{error}</p>}
          {info && <p className="text-sm text-emerald-500 font-semibold">{info}</p>}

          <button type="submit" disabled={busy} className="sadara-btn-primary w-full py-3 rounded-xl text-base flex items-center justify-center gap-2">
            {busy && <Loader2 className="size-4 animate-spin" />}
            {mode === 'login' ? (ar ? 'دخول' : 'Sign in') : mode === 'register' ? (ar ? 'إنشاء الحساب' : 'Create account') : ar ? 'إرسال الرابط' : 'Send link'}
          </button>
        </form>

        <div className="mt-5 text-sm text-center space-y-2">
          {mode === 'login' && (
            <>
              <button onClick={() => setMode('reset')} className="text-cyan-500 hover:underline cursor-pointer block mx-auto">
                {ar ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
              </button>
              <p>
                {ar ? 'ليس لديك حساب؟' : 'No account?'}{' '}
                <button onClick={() => setMode('register')} className="text-cyan-500 font-bold hover:underline cursor-pointer">
                  {ar ? 'سجّل الآن' : 'Sign up'}
                </button>
              </p>
            </>
          )}
          {mode !== 'login' && (
            <button onClick={() => setMode('login')} className="text-cyan-500 font-bold hover:underline cursor-pointer">
              {ar ? 'لديك حساب؟ تسجيل الدخول' : 'Have an account? Sign in'}
            </button>
          )}
        </div>

        <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] opacity-60">
          <ShieldCheck className="size-3.5" />
          {ar ? 'بياناتك محمية ومشفّرة' : 'Your data is encrypted'}
        </div>
      </div>
    </div>
  );
};
