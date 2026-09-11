import React, { useState } from 'react';
import { InspectionReport } from '../types';
import { EVALUATION_DOMAINS } from '../data/constants';
import { OfficialHeader, PalestineEmblem } from './OfficialHeader';
import { exportReportToPDF, generateWhatsAppMessage } from '../utils/pdfExport';
import {
  Printer,
  FileDown,
  Edit3,
  Share2,
  ArrowRight,
  Check,
  Copy,
  Sparkles,
  FileText,
} from 'lucide-react';

interface OfficialReportViewProps {
  report: InspectionReport;
  onEdit?: (report: InspectionReport) => void;
  onBack?: () => void;
  onNewReport?: () => void;
}

export const OfficialReportView: React.FC<OfficialReportViewProps> = ({
  report,
  onEdit,
  onBack,
  onNewReport,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Impressions plain formal text without bright colors
  const impressionLabels: Record<string, string> = {
    excellent: 'ممتاز',
    very_good: 'جيد جدًا',
    good: 'جيد',
    needs_followup: 'يحتاج متابعة',
    needs_action: 'يحتاج معالجة',
  };

  const impressionText = impressionLabels[report.generalImpression] || 'جيد';

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportReportToPDF('printable-official-report', report);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareWhatsApp = () => {
    const encoded = generateWhatsAppMessage(report);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleCopySummary = () => {
    const rawMsg = decodeURIComponent(generateWhatsAppMessage(report));
    navigator.clipboard.writeText(rawMsg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Evaluation statistics
  const goodCount = Object.values(report.evaluations).filter((v) => v === 'good').length;
  const followupCount = Object.values(report.evaluations).filter((v) => v === 'needs_followup').length;
  const actionCount = Object.values(report.evaluations).filter((v) => v === 'needs_action').length;

  // Domain splitting:
  // Page 1: Domains 1, 2, and 3 (الدوام والانضباط، التعليم والتعلم، الطلبة - كامل على الصفحة الأولى)
  // Page 2: Domains 4 and 5 (البيئة المدرسية - في بداية الصفحة الثانية، الإدارة والتنظيم)
  const page1Domains = EVALUATION_DOMAINS.slice(0, 3);
  const page2Domains = EVALUATION_DOMAINS.slice(3, 5);

  return (
    <div className="w-full max-w-5xl mx-auto py-4 px-2 sm:px-4">
      {/* Non-printable Action Toolbar */}
      <div className="no-print bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 sticky top-2 z-20 backdrop-blur-md bg-white/95">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>العودة للتقارير</span>
              </button>
            )}
            <div className="hidden sm:block">
              <span className="text-xs text-slate-500 block">المدرسة التي تمت زيارتها</span>
              <span className="text-sm font-bold text-slate-900">{report.schoolName}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(report)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl transition-all cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-slate-600" />
                <span>تعديل التقرير</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
              title="نسخ ملخص نصي للتقرير"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span className="text-emerald-700 font-bold">تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-600" />
                  <span>نسخ ملخص</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-slate-600" />
              <span>واتساب</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-700" />
              <span>طباعة (صفحتان)</span>
            </button>

            <button
              type="button"
              onClick={handleExportPDF}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 border border-slate-950 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <FileDown className="w-4 h-4 text-slate-300" />
              <span>{isExporting ? 'جاري تصدير PDF...' : 'تصدير PDF (صفحتان)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Printable Container: 2 Dedicated Pages */}
      <div id="printable-official-report" className="space-y-8 print:space-y-0">
        {/* ========================================================================= */}
        {/* PAGE 1: Header, Metadata Table, Domains 1, 2, and 3 (Students Complete) */}
        {/* ========================================================================= */}
        <div
          id="printable-report-page-1"
          className="report-page bg-white border border-slate-300 print:border-none shadow-md print:shadow-none mx-auto p-6 md:p-8 font-['Cairo',sans-serif] text-slate-900 flex flex-col justify-between"
          style={{ width: '100%', maxWidth: '794px', minHeight: '1120px', boxSizing: 'border-box' }}
        >
          <div>
            {/* 1. Official Header */}
            <OfficialHeader
              directorateAr={report.directorateAr}
              directorateEn={report.directorateEn}
              reportTitle="تقرير زيارة تفقدية مدرسية"
              showTitle={true}
            />

            {/* 2. Visit Metadata Table (بيانات الزيارة التفقدية) - Soft Light Gray Header */}
            <div className="mb-4">
              <div className="border border-slate-400 rounded-md overflow-hidden">
                <div className="bg-slate-100 border-b border-slate-300 text-slate-900 px-3 py-1.5 flex items-center justify-between font-tajawal">
                  <span className="font-bold text-xs md:text-sm">بيانات الزيارة التفقدية</span>
                  <span className="text-[11px] text-slate-600 font-semibold">قسم ضبط الأداء المدرسي</span>
                </div>
                <table className="w-full text-xs md:text-sm border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-300">
                      <td className="w-1/4 bg-slate-50 font-bold px-3 py-1.5 text-slate-800 border-l border-slate-300">
                        المدرسة
                      </td>
                      <td className="w-1/4 font-bold px-3 py-1.5 text-slate-900 border-l border-slate-300">
                        {report.schoolName}
                      </td>
                      <td className="w-1/4 bg-slate-50 font-bold px-3 py-1.5 text-slate-800 border-l border-slate-300">
                        المديرية
                      </td>
                      <td className="w-1/4 font-medium px-3 py-1.5 text-slate-800">
                        {report.directorateAr}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="bg-slate-50 font-bold px-3 py-1.5 text-slate-800 border-l border-slate-300">
                        تاريخ الزيارة
                      </td>
                      <td className="font-medium px-3 py-1.5 text-slate-800 border-l border-slate-300">
                        {report.visitDate}
                      </td>
                      <td className="bg-slate-50 font-bold px-3 py-1.5 text-slate-800 border-l border-slate-300">
                        وقت الزيارة
                      </td>
                      <td className="font-medium px-3 py-1.5 text-slate-800">
                        {report.visitTime}
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-slate-50 font-bold px-3 py-1.5 text-slate-800 border-l border-slate-300">
                        نوع الزيارة
                      </td>
                      <td className="font-medium px-3 py-1.5 text-slate-800 border-l border-slate-300">
                        {report.visitType || 'زيارة تفقدية'}
                      </td>
                      <td className="bg-slate-50 font-bold px-3 py-1.5 text-slate-800 border-l border-slate-300">
                        القائم بالزيارة
                      </td>
                      <td className="font-bold px-3 py-1.5 text-slate-900">
                        {report.deptHeadName} ({report.jobTitle})
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Evaluation Table - Part 1 (المحاور 1، 2، 3) */}
            <div className="mb-2">
              <div className="bg-slate-100 border border-slate-300 rounded-t-md px-3 py-1.5 text-center font-bold text-xs md:text-sm text-slate-900 font-tajawal">
                نتائج تقييم محاور الأداء المدرسي
              </div>

              <div className="border-x border-b border-slate-400 rounded-b-md overflow-hidden">
                <table className="w-full text-xs md:text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900 font-tajawal text-center border-b border-slate-300">
                      <th className="py-1.5 px-2 text-right w-8 border-l border-slate-300 font-bold">#</th>
                      <th className="py-1.5 px-3 text-right font-bold border-l border-slate-300">المحور / بند التقييم</th>
                      <th className="py-1.5 px-2 text-center w-24 border-l border-slate-300 font-bold bg-slate-100">جيد</th>
                      <th className="py-1.5 px-2 text-center w-28 border-l border-slate-300 font-bold bg-slate-100">يحتاج متابعة</th>
                      <th className="py-1.5 px-2 text-center w-28 font-bold bg-slate-100">يحتاج معالجة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {page1Domains.map((domain, domainIdx) => (
                      <React.Fragment key={domain.id}>
                        {/* Domain Subheader: Soft light grey shading */}
                        <tr className="bg-slate-100/90 font-bold text-slate-900 border-t border-b border-slate-300 font-tajawal">
                          <td colSpan={5} className="py-1.5 px-3 text-xs md:text-sm text-slate-900">
                            {domain.title}
                          </td>
                        </tr>

                        {/* Items in Domain */}
                        {domain.items.map((item, itemIdx) => {
                          const rating = report.evaluations[item.id] || 'good';
                          return (
                            <tr
                              key={item.id}
                              className={`border-b border-slate-200 ${
                                itemIdx % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'
                              }`}
                            >
                              <td className="py-1.5 px-2 text-center text-slate-500 border-l border-slate-200 font-mono text-[11px]">
                                {domainIdx + 1}.{itemIdx + 1}
                              </td>
                              <td className="py-1.5 px-3 text-slate-800 border-l border-slate-200 font-medium">
                                {item.label}
                              </td>
                              {/* Good Column */}
                              <td className="py-1.5 px-2 text-center border-l border-slate-200">
                                {rating === 'good' ? (
                                  <span className="font-bold text-slate-900 text-sm">✓</span>
                                ) : (
                                  <span className="text-slate-300 text-xs">-</span>
                                )}
                              </td>
                              {/* Needs Followup Column */}
                              <td className="py-1.5 px-2 text-center border-l border-slate-200">
                                {rating === 'needs_followup' ? (
                                  <span className="font-bold text-slate-900 text-sm">✓</span>
                                ) : (
                                  <span className="text-slate-300 text-xs">-</span>
                                )}
                              </td>
                              {/* Needs Action Column */}
                              <td className="py-1.5 px-2 text-center">
                                {rating === 'needs_action' ? (
                                  <span className="font-bold text-slate-900 text-sm">✓</span>
                                ) : (
                                  <span className="text-slate-300 text-xs">-</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Page 1 Official Footer */}
          <div className="pt-2.5 border-t border-slate-300 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-600 font-tajawal mt-auto">
            <span>إعداد وتطوير: أ. عبد اللطيف رضوان | قسم ضبط الأداء المدرسي – مديرية التربية والتعليم – قلقيلية | © 2026</span>
            <span className="font-bold text-slate-800">صفحة 1 من 2</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PAGE 2: Starts with Domain 4 (البيئة المدرسية), Domain 5, Notes, Signatures */}
        {/* ========================================================================= */}
        <div
          id="printable-report-page-2"
          className="report-page bg-white border border-slate-300 print:border-none shadow-md print:shadow-none mx-auto p-6 md:p-8 font-['Cairo',sans-serif] text-slate-900 flex flex-col justify-between"
          style={{ width: '100%', maxWidth: '794px', minHeight: '1120px', boxSizing: 'border-box' }}
        >
          <div>
            {/* Top Compact Ministerial Header for Page 2 */}
            <div className="border-b-2 border-slate-800 pb-2 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PalestineEmblem size={32} />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block font-tajawal">
                      دولة فلسطين - وزارة التربية والتعليم العالي
                    </span>
                    <span className="text-[11px] text-slate-600 block">
                      {report.directorateAr} | قسم ضبط الأداء المدرسي
                    </span>
                  </div>
                </div>
                <div className="text-left font-tajawal">
                  <span className="text-xs font-bold text-slate-900 block">
                    تقرير زيارة: <span className="font-black">{report.schoolName}</span>
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    تاريخ الزيارة: {report.visitDate} (تابع)
                  </span>
                </div>
              </div>
            </div>

            {/* 1. Evaluation Table - Part 2 (بداية الصفحة الثانية تكون البيئة المدرسية) */}
            <div className="mb-4">
              <div className="border border-slate-400 rounded-md overflow-hidden">
                <table className="w-full text-xs md:text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900 font-tajawal text-center border-b border-slate-300">
                      <th className="py-1.5 px-2 text-right w-8 border-l border-slate-300 font-bold">#</th>
                      <th className="py-1.5 px-3 text-right font-bold border-l border-slate-300">المحور / بند التقييم</th>
                      <th className="py-1.5 px-2 text-center w-24 border-l border-slate-300 font-bold bg-slate-100">جيد</th>
                      <th className="py-1.5 px-2 text-center w-28 border-l border-slate-300 font-bold bg-slate-100">يحتاج متابعة</th>
                      <th className="py-1.5 px-2 text-center w-28 font-bold bg-slate-100">يحتاج معالجة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {page2Domains.map((domain, domainIdx) => (
                      <React.Fragment key={domain.id}>
                        {/* Domain Subheader: Soft light grey shading */}
                        <tr className="bg-slate-100/90 font-bold text-slate-900 border-t border-b border-slate-300 font-tajawal">
                          <td colSpan={5} className="py-1.5 px-3 text-xs md:text-sm text-slate-900">
                            {domain.title}
                          </td>
                        </tr>

                        {/* Items in Domain */}
                        {domain.items.map((item, itemIdx) => {
                          const rating = report.evaluations[item.id] || 'good';
                          return (
                            <tr
                              key={item.id}
                              className={`border-b border-slate-200 ${
                                itemIdx % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'
                              }`}
                            >
                              <td className="py-1.5 px-2 text-center text-slate-500 border-l border-slate-200 font-mono text-[11px]">
                                {domainIdx + 4}.{itemIdx + 1}
                              </td>
                              <td className="py-1.5 px-3 text-slate-800 border-l border-slate-200 font-medium">
                                {item.label}
                              </td>
                              {/* Good Column */}
                              <td className="py-1.5 px-2 text-center border-l border-slate-200">
                                {rating === 'good' ? (
                                  <span className="font-bold text-slate-900 text-sm">✓</span>
                                ) : (
                                  <span className="text-slate-300 text-xs">-</span>
                                )}
                              </td>
                              {/* Needs Followup Column */}
                              <td className="py-1.5 px-2 text-center border-l border-slate-200">
                                {rating === 'needs_followup' ? (
                                  <span className="font-bold text-slate-900 text-sm">✓</span>
                                ) : (
                                  <span className="text-slate-300 text-xs">-</span>
                                )}
                              </td>
                              {/* Needs Action Column */}
                              <td className="py-1.5 px-2 text-center">
                                {rating === 'needs_action' ? (
                                  <span className="font-bold text-slate-900 text-sm">✓</span>
                                ) : (
                                  <span className="text-slate-300 text-xs">-</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. General Impression (الانطباع العام) - Formal Soft Grey Box */}
            <div className="mb-3.5 p-2.5 bg-slate-50 border border-slate-400 rounded-md flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">الانطباع العام عن الزيارة الميدانية:</span>
                <span className="text-xs md:text-sm font-black text-slate-900 border-b border-slate-800 pb-0.5">
                  {impressionText}
                </span>
              </div>
              <div className="text-[11px] font-semibold text-slate-700 flex items-center gap-2">
                <span>(جيد: {goodCount}</span>
                <span>•</span>
                <span>يحتاج متابعة: {followupCount}</span>
                {actionCount > 0 && (
                  <>
                    <span>•</span>
                    <span>يحتاج معالجة: {actionCount}</span>
                  </>
                )}
                <span>)</span>
              </div>
            </div>

            {/* 3. Qualitative Notes & Recommendations (الملاحظات والتوصيات) - Clean Light Gray Headers */}
            <div className="space-y-2.5 mb-4">
              {/* 1. Positives */}
              <div className="border border-slate-400 rounded-md overflow-hidden">
                <div className="bg-slate-100 border-b border-slate-300 px-3 py-1 font-bold text-xs md:text-sm text-slate-900 font-tajawal">
                  أبرز الإيجابيات:
                </div>
                <div className="p-2 text-xs md:text-sm text-slate-800 whitespace-pre-line leading-relaxed min-h-[34px] bg-white">
                  {report.positives?.trim() || 'تم رصد التزام وانضباط عام بالمحددات والمعايير التربوية المعمول بها.'}
                </div>
              </div>

              {/* 2. Needs */}
              <div className="border border-slate-400 rounded-md overflow-hidden">
                <div className="bg-slate-100 border-b border-slate-300 px-3 py-1 font-bold text-xs md:text-sm text-slate-900 font-tajawal">
                  أبرز الاحتياجات:
                </div>
                <div className="p-2 text-xs md:text-sm text-slate-800 whitespace-pre-line leading-relaxed min-h-[34px] bg-white">
                  {report.needs?.trim() || 'لا توجد احتياجات استثنائية تعيق سير العملية التعليمية.'}
                </div>
              </div>

              {/* 3. Recommendations */}
              <div className="border border-slate-400 rounded-md overflow-hidden">
                <div className="bg-slate-100 border-b border-slate-300 px-3 py-1 font-bold text-xs md:text-sm text-slate-900 font-tajawal">
                  أبرز التوصيات:
                </div>
                <div className="p-2 text-xs md:text-sm text-slate-800 whitespace-pre-line leading-relaxed min-h-[34px] bg-white">
                  {report.recommendations?.trim() || 'الاستمرار في خطة التطوير والمتابعة المستمرة لتعزيز مخرجات التعلم.'}
                </div>
              </div>

              {/* 4. Agreements */}
              <div className="border border-slate-400 rounded-md overflow-hidden">
                <div className="bg-slate-100 border-b border-slate-300 px-3 py-1 font-bold text-xs md:text-sm text-slate-900 font-tajawal">
                  أهم الأمور التي تم الاتفاق عليها مع إدارة المدرسة:
                </div>
                <div className="p-2 text-xs md:text-sm text-slate-800 whitespace-pre-line leading-relaxed min-h-[34px] bg-white">
                  {report.agreements?.trim() || 'تم التوافق مع إدارة المدرسة على استمرار متابعة آليات التنفيذ وفق الخطط المعتمدة.'}
                </div>
              </div>
            </div>

            {/* 4. Official Signatures Table (التوقيعات الرسمية) */}
            <div className="mb-2">
              <table className="w-full text-xs md:text-sm border border-slate-400 text-center border-collapse">
                <thead>
                  <tr className="bg-slate-100 font-bold font-tajawal border-b border-slate-400">
                    <th className="w-1/2 py-1.5 px-4 border-l border-slate-400 text-slate-900">
                      مدير / مديرة المدرسة
                    </th>
                    <th className="w-1/2 py-1.5 px-4 text-slate-900">
                      رئيس قسم ضبط الأداء المدرسي
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="w-1/2 py-4 px-4 border-l border-slate-400 align-top">
                      <div className="space-y-3 text-right pr-2">
                        <p className="font-semibold text-slate-800">
                          الاسم: <span className="font-mono text-slate-400">...................................................</span>
                        </p>
                        <p className="font-semibold text-slate-800">
                          التوقيع: <span className="font-mono text-slate-400">.................................................</span>
                        </p>
                        <p className="font-semibold text-slate-800">
                          خاتم المدرسة:
                        </p>
                      </div>
                    </td>
                    <td className="w-1/2 py-4 px-4 align-top">
                      <div className="space-y-3 text-right pr-2">
                        <p className="font-bold text-slate-900">
                          الاسم: <span className="font-bold">{report.deptHeadName}</span>
                        </p>
                        <p className="font-semibold text-slate-800">
                          التوقيع: <span className="font-mono text-slate-400">.................................................</span>
                        </p>
                        <p className="text-[11px] text-slate-500 font-tajawal">
                          قسم ضبط الأداء المدرسي - {report.directorateAr}
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Page 2 Official Footer */}
          <div className="pt-2.5 border-t border-slate-300 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-600 font-tajawal mt-auto">
            <span>إعداد وتطوير: أ. عبد اللطيف رضوان | قسم ضبط الأداء المدرسي – مديرية التربية والتعليم – قلقيلية | © 2026</span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[9px] text-slate-500">
                تاريخ الطباعة: {new Date().toLocaleDateString('ar-EG')}
              </span>
              <span className="font-bold text-slate-800">صفحة 2 من 2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Action */}
      <div className="no-print mt-6 flex items-center justify-center gap-3">
        {onNewReport && (
          <button
            type="button"
            onClick={onNewReport}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer text-sm"
          >
            <Sparkles className="w-4 h-4 text-slate-300" />
            <span>+ إنشاء زيارة تفقدية جديدة</span>
          </button>
        )}
      </div>
    </div>
  );
};
