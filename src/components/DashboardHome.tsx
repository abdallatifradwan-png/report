import React from 'react';
import { AppSettings, AnyAppReport, InspectionReport, FieldVisitReport } from '../types';
import { IMPRESSION_CONFIG } from '../data/constants';
import { PalestineEmblem } from './OfficialHeader';
import {
  FilePlus,
  Files,
  Settings,
  Info,
  School,
  Calendar,
  Clock,
  ArrowLeft,
  Sparkles,
  Award,
  Building2,
  UserCheck,
  CheckCircle2,
  Compass,
  ClipboardCheck,
  ShieldCheck,
} from 'lucide-react';

interface DashboardHomeProps {
  settings: AppSettings;
  reports: AnyAppReport[];
  onNavigate: (tab: 'new_inspection' | 'new_field' | 'reports_list' | 'settings' | 'about' | 'ip_rights') => void;
  onViewReport: (report: AnyAppReport) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  settings,
  reports,
  onNavigate,
  onViewReport,
}) => {
  const recentReports = reports.slice(0, 4);

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-3 sm:px-6 space-y-8 font-['Cairo',sans-serif]">
      {/* Official Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-rose-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-right space-y-2">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-bold font-tajawal">
              <Sparkles className="w-3.5 h-3.5" />
              <span>وزارة التربية والتعليم العالي - دولة فلسطين</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-tajawal tracking-tight">
              تطبيق الزيارات الميدانية والتفقدية
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
              إعداد وتطوير: <strong className="text-amber-300">أ. عبد اللطيف رضوان</strong> – منظومة إدارية تربوية متكاملة لإعداد وتوثيق الزيارات الميدانية والتفقدية الشاملة لمدارس {settings.directorateAr}.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-rose-200">
              <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
                <UserCheck className="w-4 h-4 text-amber-300" />
                <span>رئيس القسم: <strong>{settings.deptHeadName}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
                <Building2 className="w-4 h-4 text-emerald-300" />
                <span>{settings.directorateAr}</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 hidden md:flex flex-col items-center">
            <PalestineEmblem size={74} />
          </div>
        </div>
      </div>

      {/* TWO PRIMARY VISIT BUTTONS: 1. بدء الزيارة الميدانية  2. بدء الزيارة التفقدية */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-tajawal flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>نوع الزيارة المطلوبة (اختر لبدء التقرير):</span>
          </h2>
          <span className="text-xs text-slate-400 font-normal">
            إعداد فوري مع بنك التوصيات والمؤشرات المعتمدة
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Button 1: بدء الزيارة الميدانية */}
          <button
            type="button"
            onClick={() => onNavigate('new_field')}
            className="group relative p-6 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl shadow-md hover:shadow-xl transition-all text-right flex flex-col justify-between h-56 border-2 border-emerald-500/40 hover:border-emerald-400 cursor-pointer overflow-hidden"
          >
            <div className="absolute -left-6 -bottom-6 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-400/20 transition-all"></div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-13 h-13 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <Compass className="w-7 h-7 text-emerald-300" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950 shadow-sm">
                  1. نموذج جديد
                </span>
              </div>
              <h3 className="text-xl font-black font-tajawal text-white group-hover:text-amber-300 transition-colors">
                بدء الزيارة الميدانية
              </h3>
              <p className="text-xs text-emerald-100/80 mt-2 leading-relaxed">
                استمارة تقرير الزيارة الميدانية الرسمية الشاملة: مجال المعلمين (11 معيار)، مجال الطلبة (4 معايير)، الاتصال والتواصل، والجوانب الإدارية والإبداعية.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-bold text-amber-300">
              <span className="flex items-center gap-1.5">
                <span>تعبئة استمارة الزيارة الميدانية</span>
              </span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
            </div>
          </button>

          {/* Button 2: بدء الزيارة التفقدية */}
          <button
            type="button"
            onClick={() => onNavigate('new_inspection')}
            className="group relative p-6 bg-gradient-to-br from-rose-950 via-rose-900 to-slate-900 text-white rounded-3xl shadow-md hover:shadow-xl transition-all text-right flex flex-col justify-between h-56 border-2 border-rose-500/40 hover:border-rose-400 cursor-pointer overflow-hidden"
          >
            <div className="absolute -left-6 -bottom-6 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-400/20 transition-all"></div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-13 h-13 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <ClipboardCheck className="w-7 h-7 text-rose-300" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-rose-500 text-white shadow-sm">
                  2. النموذج المعتمد
                </span>
              </div>
              <h3 className="text-xl font-black font-tajawal text-white group-hover:text-amber-300 transition-colors">
                بدء الزيارة التفقدية
              </h3>
              <p className="text-xs text-rose-100/80 mt-2 leading-relaxed">
                استمارة تقرير الزيارة التفقدية السريعة: بنود الدوام، الغرف الصفية، البيئة المدرسية، السجلات الإدارية، التغذية الراجعة والتوصيات الفورية.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-bold text-amber-300">
              <span className="flex items-center gap-1.5">
                <span>تعبئة استمارة الزيارة التفقدية</span>
              </span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Secondary Navigation Cards: Previous Reports, Settings, App Info, IP Rights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Previous Reports */}
        <button
          onClick={() => onNavigate('reports_list')}
          className="group p-5 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-800 rounded-3xl shadow-sm hover:shadow-md transition-all text-right flex flex-col justify-between h-40 cursor-pointer relative overflow-hidden"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-2 shadow-md group-hover:scale-105 transition-transform">
              <Files className="w-5 h-5 text-amber-300" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 font-tajawal">
              التقارير السابقة
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              عرض والبحث وتصدير جميع الزيارات ({reports.length} تقرير)
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-slate-900 pt-1">
            <span>استعراض السجل</span>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 2: Settings & Schools/Principals */}
        <button
          onClick={() => onNavigate('settings')}
          className="group p-5 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-amber-600 rounded-3xl shadow-sm hover:shadow-md transition-all text-right flex flex-col justify-between h-40 cursor-pointer relative overflow-hidden"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-2 shadow-md group-hover:scale-105 transition-transform">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 font-tajawal">
              إدارة المدارس والمدراء
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              إضافة وحذف المدارس، قوائم مدراء المدارس، وبيانات القسم
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-700 pt-1">
            <span>إدارة النظام</span>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 3: Intellectual Property & About */}
        <button
          onClick={() => onNavigate('ip_rights')}
          className="group p-5 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-emerald-700 rounded-3xl shadow-sm hover:shadow-md transition-all text-right flex flex-col justify-between h-40 cursor-pointer relative overflow-hidden"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center mb-2 shadow-md group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 font-tajawal">
              حقوق الملكية الفكرية
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              صاحب الفكرة والتطوير: أ. عبد اللطيف رضوان
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-800 pt-1">
            <span>بيانات المطور والحماية</span>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Recent Visits Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <School className="w-5 h-5 text-slate-800" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-tajawal">
              أحدث الزيارات الموثقة
            </h2>
          </div>
          <button
            onClick={() => onNavigate('reports_list')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
          >
            <span>عرض كل التقارير ({reports.length})</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentReports.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            لا توجد تقارير مسجلة بعد. اختر أحد الزرين بالأعلى لبدء أول زيارة.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentReports.map((rep) => {
              const isField = rep.visitKind === 'field' || rep.visitType === 'زيارة ميدانية';
              const inspectionRep = rep as InspectionReport;
              const imp = inspectionRep.generalImpression
                ? IMPRESSION_CONFIG[inspectionRep.generalImpression] || IMPRESSION_CONFIG.good
                : null;

              return (
                <div
                  key={rep.id}
                  onClick={() => onViewReport(rep)}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-800/40 hover:bg-slate-50/70 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-1 text-right">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isField
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-rose-100 text-rose-900 border border-rose-300'
                        }`}
                      >
                        {isField ? 'زيارة ميدانية' : 'زيارة تفقدية'}
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        {rep.schoolName}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {rep.visitDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {rep.visitTime}
                      </span>
                    </div>
                  </div>

                  {imp ? (
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${imp.badgeClass}`}
                    >
                      {imp.icon} {imp.label}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold border bg-emerald-50 text-emerald-800 border-emerald-200">
                      مكتمل
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
