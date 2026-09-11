import React from 'react';
import { PalestineEmblem } from './OfficialHeader';
import { ShieldCheck, ArrowRight, Award, Lock, FileCheck, CheckCircle2, AlertTriangle, Building2, User } from 'lucide-react';

interface IntellectualPropertyPageProps {
  onBack: () => void;
}

export const IntellectualPropertyPage: React.FC<IntellectualPropertyPageProps> = ({ onBack }) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 font-['Cairo',sans-serif] text-slate-900 animate-fadeIn">
      {/* Back button & Action Bar */}
      <div className="no-print flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-200 shadow-sm transition-all cursor-pointer"
        >
          <ArrowRight className="w-4 h-4 text-rose-900" />
          <span>العودة إلى الصفحة الرئيسية</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-full text-xs font-bold font-mono">
          <Lock className="w-3.5 h-3.5 text-amber-700" />
          <span>Version 1.0.0 – 2026</span>
        </div>
      </div>

      {/* Main Document Card */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden">
        {/* Document Header with Palestine Flag & Emblem */}
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          {/* Subtle Palestinian Flag colors ribbon */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-black via-white to-emerald-700"></div>

          <div className="flex justify-center mb-3">
            <PalestineEmblem size={72} />
          </div>

          <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 font-tajawal">
            دولة فلسطين – وزارة التربية والتعليم العالي
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white font-tajawal mb-2">
            حقوق الملكية الفكرية
          </h1>

          <div className="inline-block px-4 py-1 bg-rose-900/80 border border-rose-700/60 rounded-full text-xs sm:text-sm font-bold text-amber-200">
            حقوق الملكية الفكرية محفوظة © 2026
          </div>
        </div>

        {/* Document Content */}
        <div className="p-6 sm:p-10 space-y-8 text-right leading-relaxed text-sm sm:text-base">
          {/* Intro statement */}
          <div className="p-5 bg-slate-50 rounded-2xl border-r-4 border-rose-900 border-y border-l border-slate-200 shadow-sm">
            <p className="text-slate-800 leading-relaxed font-semibold">
              هذا التطبيق مخصص لإعداد وتنظيم <strong className="text-rose-950 font-bold">تقارير الزيارات التفقدية للمدارس</strong>، وقد تم إعداد وتطوير فكرته وبنيته وآلية عمله ونماذجه وواجهته وآلية تنظيم البيانات وإخراج التقرير بصورة أصلية.
            </p>
          </div>

          {/* Official Developer & Authority Card */}
          <div className="bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white p-6 rounded-2xl border border-rose-800 shadow-md">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold font-tajawal mb-3">
              <Award className="w-4 h-4" />
              <span>بيانات صاحب الفكرة والتطوير والجهة الرسمية</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-lg sm:text-xl font-black text-white">
                <User className="w-5 h-5 text-amber-400 shrink-0" />
                <span>إعداد وتطوير: أ. عبد اللطيف رضوان</span>
              </div>
              <div className="flex items-center gap-2 text-sm sm:text-base text-rose-100 font-bold">
                <Building2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>قسم ضبط الأداء المدرسي – مديرية التربية والتعليم – قلقيلية</span>
              </div>
              <div className="pt-2 text-xs text-amber-300/90 font-mono font-bold">
                © 2026 – جميع الحقوق محفوظة
              </div>
            </div>
          </div>

          {/* Scope of Development Rights */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-rose-950 font-bold text-base sm:text-lg font-tajawal border-b pb-2 border-slate-200">
              <FileCheck className="w-5 h-5 text-rose-900" />
              <h2>نطاق ومشمولات حقوق التطوير</h2>
            </div>
            <p className="text-slate-700 leading-relaxed text-justify">
              تشمل حقوق التطوير، بحسب ما ينطبق على التطبيق، فكرة التطبيق، وهيكلية العمل، وتسلسل خطوات إدخال البيانات، ونماذج وتقسيمات التقرير، وآليات التقييم والتعبئة السريعة، وطريقة تنظيم البيانات، وآلية معالجة المدخلات وإنتاج التقرير، والتعليمات المخصصة للذكاء الاصطناعي والـPrompts، والتصميم والمكونات البرمجية الأصلية.
            </p>
          </div>

          {/* Legal Restriction & Prohibition */}
          <div className="p-5 bg-rose-50/80 rounded-2xl border border-rose-200 text-rose-950 space-y-2">
            <div className="flex items-center gap-2 font-black text-rose-900">
              <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0" />
              <span>تنبيه قانوني وحظر الاستخدام غير المصرح به</span>
            </div>
            <p className="text-xs sm:text-sm text-rose-900 leading-relaxed font-semibold text-justify">
              يُمنع نسخ التطبيق أو إعادة إنتاجه أو إعادة نشره أو إعادة استخدام تصميمه أو محتواه أو نماذجه أو آلية عمله أو أي من مكوناته التطويرية الأصلية، كليًا أو جزئيًا، أو إنشاء تطبيق آخر اعتمادًا على مكوناته الخاصة، دون الحصول على إذن مسبق من صاحب حقوق التطوير.
            </p>
          </div>

          {/* System Specs & Protection Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
              <div className="text-slate-500 font-bold">رقم الإصدار</div>
              <div className="font-bold text-slate-900 font-mono">Version 1.0.0 – 2026</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
              <div className="text-slate-500 font-bold">الغرض من النظام</div>
              <div className="font-bold text-slate-900">تقارير الزيارات التفقدية</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
              <div className="text-slate-500 font-bold">حالة الحماية</div>
              <div className="font-bold text-emerald-700 flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>حقوق ملكية فكرية مثبتة</span>
              </div>
            </div>
          </div>
        </div>

        {/* Document Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-6 text-center text-xs text-slate-500 font-tajawal">
          <p>© 2026 أ. عبد اللطيف رضوان | قسم ضبط الأداء المدرسي – مديرية التربية والتعليم – قلقيلية | جميع الحقوق محفوظة</p>
        </div>
      </div>
    </div>
  );
};
