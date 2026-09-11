import React, { useState } from 'react';
import { AppSettings } from '../types';
import { saveStoredSettings } from '../utils/storage';
import { PalestineEmblem } from './OfficialHeader';
import { Sparkles, Building2, User, Award, CheckCircle2, Shield } from 'lucide-react';

interface InitialSetupModalProps {
  currentSettings: AppSettings;
  onCompleted: (newSettings: AppSettings) => void;
}

export const InitialSetupModal: React.FC<InitialSetupModalProps> = ({
  currentSettings,
  onCompleted,
}) => {
  const [password, setPassword] = useState(currentSettings.passwordHash || '112233');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AppSettings = {
      ...currentSettings,
      deptHeadName: 'أ. عبد اللطيف رضوان',
      jobTitle: 'رئيس قسم ضبط الأداء المدرسي',
      directorateAr: 'مديرية التربية والتعليم – قلقيلية',
      directorateEn: 'Directorate Of Education / Qalqilya',
      passwordHash: password.trim() || '112233',
      isConfigured: true,
    };

    saveStoredSettings(updated);
    onCompleted(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 text-right border border-slate-200 animate-fadeIn">
        <div className="text-center mb-6">
          <PalestineEmblem size={64} className="mx-auto mb-2" />
          <h2 className="text-xl font-black text-rose-950 font-tajawal">
            معالج الإعداد الأولي للتطبيق
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            يرجى ضبط البيانات الرسمية للمديرية ورئيس القسم (تُحفظ تلقائياً لجميع التقارير)
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs md:text-sm">
          {/* Official Authority & Developer Fixed Info */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl border border-rose-900/50 space-y-2 text-right">
            <div className="flex items-center justify-between text-xs text-amber-300 font-bold font-tajawal">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>بيانات التطوير والرئاسة الرسمية (معتمدة وثابتة)</span>
              </span>
              <span className="text-[10px] bg-rose-950 px-2 py-0.5 rounded border border-rose-800 text-rose-200">
                بيانات ثابتة
              </span>
            </div>

            <div className="text-xs space-y-1 pt-1">
              <div className="text-white font-bold">
                إعداد وتطوير: <span className="text-amber-300">أ. عبد اللطيف رضوان</span>
              </div>
              <div className="text-slate-300 text-[11px]">
                رئيس قسم ضبط الأداء المدرسي – مديرية التربية والتعليم – قلقيلية
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-slate-600" />
              <span>تعيين كلمة المرور لتأمين التطبيق:</span>
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-900 focus:bg-white focus:border-rose-900 outline-none"
              placeholder="112233"
              required
            />
            <p className="text-[10px] text-slate-400">كلمة المرور الافتراضية الموصى بها: 112233</p>
            <span className="text-[10px] text-slate-500 block">
              يمكنك تغييرها في أي وقت من إعدادات التطبيق.
            </span>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3.5 px-6 bg-rose-900 hover:bg-rose-950 text-white font-black text-sm md:text-base rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5 text-amber-400" />
            <span>حفظ الإعدادات والمتابعة</span>
          </button>
        </form>
      </div>
    </div>
  );
};
