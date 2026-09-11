import React from 'react';
import { PalestineEmblem } from './OfficialHeader';
import { X, ShieldCheck, CheckCircle2, Award, Building2, User, Calendar, Tag, ExternalLink } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenIpRights?: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onOpenIpRights }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn font-['Cairo',sans-serif]">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 text-center border border-slate-200 text-slate-900 relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <PalestineEmblem size={70} className="mx-auto mb-2" />

        <div className="mb-5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-tajawal">
            دولة فلسطين – وزارة التربية والتعليم العالي
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-rose-950 font-tajawal mt-1">
            حول التطبيق
          </h2>
          <span className="inline-block mt-1 px-3 py-0.5 bg-rose-50 text-rose-900 border border-rose-200 rounded-full text-xs font-bold font-mono">
            Version 1.0.0 – 2026
          </span>
        </div>

        {/* Structured Application Facts as strictly requested */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs sm:text-sm text-right space-y-3 mb-5">
          <div className="flex items-start gap-2.5 pb-2.5 border-b border-slate-200/80">
            <Tag className="w-4 h-4 text-rose-900 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-500 text-xs block">اسم التطبيق:</span>
              <span className="font-bold text-slate-900">تطبيق الزيارات الميدانية والتفقدية</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 pb-2.5 border-b border-slate-200/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-500 text-xs block">الغرض:</span>
              <span className="font-medium text-slate-800">
                إعداد وتوثيق تقارير الزيارات الميدانية والتفقدية الشاملة لمدارس الوطن.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 pb-2.5 border-b border-slate-200/80">
            <User className="w-4 h-4 text-rose-900 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-500 text-xs block">إعداد وتطوير:</span>
              <span className="font-bold text-rose-950">أ. عبد اللطيف رضوان</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 pb-2.5 border-b border-slate-200/80">
            <Building2 className="w-4 h-4 text-rose-900 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-500 text-xs block">الجهة:</span>
              <span className="font-bold text-slate-800">
                قسم ضبط الأداء المدرسي – مديرية التربية والتعليم – قلقيلية
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            <div className="bg-white p-2 rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-500 block">الإصدار:</span>
              <span className="font-bold text-slate-900 font-mono">Version 1.0.0</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-500 block">سنة الإصدار:</span>
              <span className="font-bold text-slate-900 font-mono">2026</span>
            </div>
          </div>
        </div>

        {/* Official Developer Attribution Card */}
        <div className="p-3.5 bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 text-white rounded-2xl text-center space-y-1 shadow-md mb-4">
          <div className="text-xs font-bold text-amber-300">
            © 2026 – جميع الحقوق محفوظة
          </div>
          <div className="text-xs text-rose-200">
            أ. عبد اللطيف رضوان | قسم ضبط الأداء المدرسي – مديرية التربية والتعليم – قلقيلية
          </div>
        </div>

        {/* IP Rights Quick Navigation Button */}
        {onOpenIpRights && (
          <button
            onClick={() => {
              onClose();
              onOpenIpRights();
            }}
            className="w-full mb-3 py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>عرض وثيقة حقوق الملكية الفكرية</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </button>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
};
