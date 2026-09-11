import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface AppFooterProps {
  onOpenIpRights?: () => void;
}

export const AppFooter: React.FC<AppFooterProps> = ({ onOpenIpRights }) => {
  return (
    <footer className="no-print mt-auto bg-slate-900 text-slate-400 py-5 border-t-2 border-rose-900 text-xs font-['Cairo',sans-serif]">
      <div className="max-w-6xl mx-auto px-4 text-center space-y-2.5">
        <div className="flex flex-wrap items-center justify-center gap-2 text-slate-300 font-semibold font-tajawal text-xs">
          <span>دولة فلسطين</span>
          <span>•</span>
          <span>وزارة التربية والتعليم العالي</span>
          <span>•</span>
          <span>قسم ضبط الأداء المدرسي – مديرية التربية والتعليم – قلقيلية</span>
        </div>

        {/* Official Developer Attribution & Clickable IP Rights Link as requested */}
        <div className="pt-1 flex items-center justify-center">
          <button
            onClick={onOpenIpRights}
            type="button"
            className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-rose-800/60 text-slate-200 transition-all cursor-pointer shadow-sm hover:shadow"
            title="انقر لعرض وثيقة حقوق الملكية الفكرية"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs text-amber-300 group-hover:text-amber-200">
              © 2026 أ. عبد اللطيف رضوان | جميع الحقوق محفوظة
            </span>
            <span className="text-[10px] text-slate-400 border-r border-slate-600 pr-2 mr-1">
              (حقوق الملكية الفكرية)
            </span>
          </button>
        </div>

        <p className="text-[11px] text-slate-500 font-mono">
          نظام تقارير الزيارات التفقدية المدرسية — Version 1.0.0 – 2026
        </p>
      </div>
    </footer>
  );
};
