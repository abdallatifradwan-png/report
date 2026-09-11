import React, { useState } from 'react';
import { PalestineEmblem } from './OfficialHeader';
import { verifyPassword, setAuthenticated } from '../utils/storage';
import { Lock, LogIn, AlertCircle, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  deptHeadName?: string;
  directorateAr?: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  deptHeadName = 'عبد اللطيف رضوان',
  directorateAr = 'مديرية التربية والتعليم / قلقيلية',
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError(true);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      if (verifyPassword(password)) {
        setAuthenticated(true);
        setError(false);
        onLoginSuccess();
      } else {
        setError(true);
        setIsLoading(false);
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-rose-950 to-slate-950 flex flex-col justify-between items-center p-4 font-['Cairo',sans-serif]">
      {/* Decorative Top Accent Bar */}
      <div className="w-full max-w-md h-1.5 bg-gradient-to-r from-amber-400 via-rose-600 to-emerald-600 rounded-t-full mt-2"></div>

      <div className="w-full max-w-md my-auto">
        {/* Main Official Login Card */}
        <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-8 text-center text-slate-900 relative overflow-hidden">
          {/* Subtle Palestinian colors bar on top */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-black via-white to-emerald-700"></div>

          {/* Official Coat of Arms of Palestine */}
          <div className="mb-4 flex justify-center">
            <PalestineEmblem size={80} />
          </div>

          <div className="mb-6 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-tajawal">
              دولة فلسطين - وزارة التربية والتعليم العالي
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-rose-950 font-tajawal">
              تقرير الزيارة التفقدية المدرسية
            </h1>
            <p className="text-xs text-slate-600 font-semibold">
              قسم ضبط الأداء المدرسي
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-right">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                كلمة المرور للدخول:
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(false);
                  }}
                  placeholder="أدخل كلمة المرور..."
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-4 py-3 text-center text-base font-bold text-slate-900 focus:bg-white focus:border-rose-900 focus:ring-4 focus:ring-rose-900/10 outline-none transition-all"
                  autoFocus
                />
                <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-rose-900 to-rose-950 hover:from-rose-950 hover:to-slate-950 text-white font-black text-base rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
            >
              <LogIn className="w-5 h-5 text-amber-400" />
              <span>{isLoading ? 'جاري التحقق...' : 'دخول'}</span>
            </button>
          </form>

          {/* Safe hint info */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>نظام إداري محمي خاص برئاسة قسم ضبط الأداء المدرسي</span>
          </div>
        </div>
      </div>

      {/* Footer Branding Note */}
      <footer className="w-full max-w-md text-center py-3 text-white/80 text-xs font-tajawal space-y-1">
        <p className="font-bold text-white">إعداد وتطوير: أ. عبد اللطيف رضوان</p>
        <p className="text-[11px] text-white/70">قسم ضبط الأداء المدرسي – مديرية التربية والتعليم – قلقيلية</p>
        <p className="text-[10px] text-amber-300 font-mono">© 2026 – جميع الحقوق محفوظة | Version 1.0.0</p>
      </footer>
    </div>
  );
};
