/**
 * @application استمارة تقرير الزيارة الميدانية
 * @description معاينة وطباعة وتصدير التقرير الرسمي للزيارة الميدانية لمديرية التربية والتعليم - قلقيلية
 * @author أ. عبد اللطيف رضوان
 * @entity قسم ضبط الأداء المدرسي – مديرية التربية والتعليم – قلقيلية
 * @copyright 2026 جميع الحقوق محفوظة
 */

import React, { useRef } from 'react';
import { FieldVisitReport, AppSettings } from '../types';
import {
  TEACHERS_DOMAIN,
  STUDENTS_DOMAIN,
  COMMUNICATION_DOMAIN,
  DEFAULT_SIGNATORIES,
} from '../data/fieldVisitStructure';
import {
  Printer,
  FileDown,
  ArrowRight,
  Edit,
  Building2,
  Calendar,
  Clock,
  User,
  GraduationCap,
  Users,
  CheckCircle2,
  Sparkles,
  Award,
  Loader2,
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface FieldVisitViewProps {
  report: FieldVisitReport;
  settings: AppSettings;
  onBack: () => void;
  onEdit: (report: FieldVisitReport) => void;
}

export const FieldVisitView: React.FC<FieldVisitViewProps> = ({
  report,
  settings,
  onBack,
  onEdit,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = React.useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    if (!printRef.current) return;
    setIsExporting(true);
    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`تقرير_زيارة_ميدانية_${report.schoolName}_${report.visitDate}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-3 sm:px-6 space-y-6 font-['Cairo',sans-serif]">
      {/* Top Controls (Hidden during print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <button
          onClick={onBack}
          className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>رجوع</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(report)}
            className="px-4 py-2 text-xs font-bold text-emerald-800 hover:text-white bg-emerald-50 hover:bg-emerald-700 border border-emerald-300 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Edit className="w-4 h-4" />
            <span>تعديل التقرير</span>
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري التصدير...</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                <span>تصدير PDF</span>
              </>
            )}
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>طباعة التقرير</span>
          </button>
        </div>
      </div>

      {/* Official Document Container */}
      <div
        ref={printRef}
        className="print-area bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-lg space-y-6 text-right leading-relaxed text-slate-900"
      >
        {/* Official Header */}
        <div className="border-b-2 border-slate-900 pb-5">
          <div className="grid grid-cols-3 items-center text-center">
            {/* Right Arabic Info */}
            <div className="text-right text-xs sm:text-sm font-bold space-y-1 font-tajawal text-slate-800">
              <p>دولة فلسطين</p>
              <p>وزارة التربية والتعليم العالي</p>
              <p>{report.directorateAr || 'مديرية التربية والتعليم / قلقيلية'}</p>
              <p className="text-emerald-900 font-black">قسم ضبط الأداء المدرسي</p>
            </div>

            {/* Center Emblem & Title */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-14 h-14 rounded-full border-2 border-emerald-900/40 p-1 flex items-center justify-center bg-emerald-50">
                <Building2 className="w-8 h-8 text-emerald-900" />
              </div>
              <h1 className="text-lg sm:text-xl font-black font-tajawal tracking-tight text-slate-950 pt-1">
                استمارة تقرير الزيارة الميدانية
              </h1>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
                العام الدراسي 2026/2025م
              </span>
            </div>

            {/* Left English Info */}
            <div className="text-left text-[11px] sm:text-xs font-bold space-y-1 font-tajawal text-slate-700 dir-ltr">
              <p>State of Palestine</p>
              <p>Ministry of Education & H.E.</p>
              <p>Directorate of Education - Qalqilya</p>
              <p className="text-slate-500 font-normal">School Performance Audit</p>
            </div>
          </div>
        </div>

        {/* أولاً: معلومات عامة (General Info Table) */}
        <div className="space-y-2">
          <div className="bg-emerald-900 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold font-tajawal flex items-center justify-between">
            <span>أولاً: معلومات عامة</span>
            <span className="text-[11px] text-emerald-200 font-normal">بيانات المدرسة والمدير</span>
          </div>

          <table className="w-full border-collapse border border-slate-400 text-xs text-right">
            <tbody>
              <tr>
                <td className="border border-slate-300 bg-slate-100 font-bold p-2 w-32">اسم المدرسة:</td>
                <td className="border border-slate-300 p-2 font-bold text-emerald-900">{report.schoolName}</td>
                <td className="border border-slate-300 bg-slate-100 font-bold p-2 w-32">المديرية:</td>
                <td className="border border-slate-300 p-2 font-bold">قلقيلية</td>
              </tr>
              <tr>
                <td className="border border-slate-300 bg-slate-100 font-bold p-2">اسم مدير/ة المدرسة:</td>
                <td className="border border-slate-300 p-2 font-bold">{report.principalName || '—'}</td>
                <td className="border border-slate-300 bg-slate-100 font-bold p-2">رقم الهوية:</td>
                <td className="border border-slate-300 p-2">{report.principalIdNumber || '—'}</td>
              </tr>
              <tr>
                <td className="border border-slate-300 bg-slate-100 font-bold p-2">المؤهل العلمي:</td>
                <td className="border border-slate-300 p-2">{report.qualification || '—'}</td>
                <td className="border border-slate-300 bg-slate-100 font-bold p-2">تاريخ التعيين:</td>
                <td className="border border-slate-300 p-2">{report.appointmentDate || '—'}</td>
              </tr>
              <tr>
                <td className="border border-slate-300 bg-slate-100 font-bold p-2">تاريخ استلام إدارة المدرسة:</td>
                <td className="border border-slate-300 p-2">{report.principalshipStartDate || '—'}</td>
                <td className="border border-slate-300 bg-slate-100 font-bold p-2">مستوى المدرسة وجنسها:</td>
                <td className="border border-slate-300 p-2 font-bold">{report.schoolLevelAndGender || '—'}</td>
              </tr>
              <tr>
                <td className="border border-slate-300 bg-slate-100 font-bold p-2">عدد الطلبة:</td>
                <td className="border border-slate-300 p-2">{report.studentsCount} طالب/ـة</td>
                <td className="border border-slate-300 bg-slate-100 font-bold p-2">عدد الشعب:</td>
                <td className="border border-slate-300 p-2">{report.classesCount} شعبة</td>
              </tr>
              <tr>
                <td className="border border-slate-300 bg-slate-100 font-bold p-2">تاريخ الزيارة:</td>
                <td className="border border-slate-300 p-2 font-bold text-slate-900">{report.visitDate}</td>
                <td className="border border-slate-300 bg-slate-100 font-bold p-2">وقت الزيارة:</td>
                <td className="border border-slate-300 p-2">{report.visitTime}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ثانياً: الجوانب الفنية / التعليمية: أ- مجال المعلمين */}
        <div className="space-y-2 pt-2">
          <div className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold font-tajawal flex items-center justify-between">
            <span>ثانياً: الجوانب الفنية / التعليمية: أ- مجال المعلمين (المعايير 1 - 11)</span>
            <span className="text-[11px] text-slate-300 font-normal">المؤشرات والملحوظات الميدانية</span>
          </div>

          <table className="w-full border-collapse border border-slate-400 text-xs text-right">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold">
                <th className="border border-slate-300 p-2 w-10 text-center">الرقم</th>
                <th className="border border-slate-300 p-2 w-48">المعيار</th>
                <th className="border border-slate-300 p-2 w-64">المؤشرات المعتمدة</th>
                <th className="border border-slate-300 p-2">الملحوظات</th>
              </tr>
            </thead>
            <tbody>
              {TEACHERS_DOMAIN.criteria.map((crit) => {
                const critState = report.criteriaState[crit.id] || {
                  status: 'fully_achieved',
                  checkedIndicators: [],
                  notes: '',
                };
                return (
                  <tr key={crit.id} className="align-top hover:bg-slate-50">
                    <td className="border border-slate-300 p-2 text-center font-bold">{crit.num}</td>
                    <td className="border border-slate-300 p-2">
                      <div className="font-bold text-slate-950">{crit.title}</div>
                      {crit.subtitle && (
                        <div className="text-[10px] text-amber-800 font-bold mt-0.5">{crit.subtitle}</div>
                      )}
                    </td>
                    <td className="border border-slate-300 p-2">
                      <ul className="space-y-1 text-[11px] list-disc list-inside text-slate-700">
                        {crit.indicators.map((ind) => (
                          <li
                            key={ind.num}
                            className={
                              critState.checkedIndicators.includes(ind.num)
                                ? 'font-bold text-emerald-950'
                                : 'text-slate-500'
                            }
                          >
                            <span className="font-bold">.{ind.num}</span> {ind.text}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="border border-slate-300 p-2 text-slate-800 whitespace-pre-wrap leading-relaxed font-medium">
                      {critState.notes || 'محقق بالكامل وفق الأصول.'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ثانياً: الجوانب الفنية / التعليمية: ب- مجال الطلبة */}
        <div className="space-y-2 pt-2">
          <div className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold font-tajawal flex items-center justify-between">
            <span>ثانياً: الجوانب الفنية / التعليمية: ب- مجال الطلبة (المعايير 1 - 4)</span>
            <span className="text-[11px] text-slate-300 font-normal">المؤشرات والملحوظات الميدانية</span>
          </div>

          <table className="w-full border-collapse border border-slate-400 text-xs text-right">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold">
                <th className="border border-slate-300 p-2 w-10 text-center">الرقم</th>
                <th className="border border-slate-300 p-2 w-48">المعيار</th>
                <th className="border border-slate-300 p-2 w-64">المؤشرات المعتمدة</th>
                <th className="border border-slate-300 p-2">الملحوظات</th>
              </tr>
            </thead>
            <tbody>
              {STUDENTS_DOMAIN.criteria.map((crit) => {
                const critState = report.criteriaState[crit.id] || {
                  status: 'fully_achieved',
                  checkedIndicators: [],
                  notes: '',
                };
                return (
                  <tr key={crit.id} className="align-top hover:bg-slate-50">
                    <td className="border border-slate-300 p-2 text-center font-bold">{crit.num}</td>
                    <td className="border border-slate-300 p-2 font-bold text-slate-950">{crit.title}</td>
                    <td className="border border-slate-300 p-2">
                      <ul className="space-y-1 text-[11px] list-disc list-inside text-slate-700">
                        {crit.indicators.map((ind) => (
                          <li
                            key={ind.num}
                            className={
                              critState.checkedIndicators.includes(ind.num)
                                ? 'font-bold text-emerald-950'
                                : 'text-slate-500'
                            }
                          >
                            <span className="font-bold">.{ind.num}</span> {ind.text}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="border border-slate-300 p-2 text-slate-800 whitespace-pre-wrap leading-relaxed font-medium">
                      {critState.notes || 'محقق بالكامل وفق الأصول.'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ثالثاً: الاتصال والتواصل */}
        <div className="space-y-2 pt-2">
          <div className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold font-tajawal flex items-center justify-between">
            <span>ثالثاً: الاتصال والتواصل (المعايير 1 - 3)</span>
            <span className="text-[11px] text-slate-300 font-normal">المؤشرات والملحوظات الميدانية</span>
          </div>

          <table className="w-full border-collapse border border-slate-400 text-xs text-right">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold">
                <th className="border border-slate-300 p-2 w-10 text-center">الرقم</th>
                <th className="border border-slate-300 p-2 w-48">المعيار</th>
                <th className="border border-slate-300 p-2 w-64">المؤشرات المعتمدة</th>
                <th className="border border-slate-300 p-2">الملحوظات</th>
              </tr>
            </thead>
            <tbody>
              {COMMUNICATION_DOMAIN.criteria.map((crit) => {
                const critState = report.criteriaState[crit.id] || {
                  status: 'fully_achieved',
                  checkedIndicators: [],
                  notes: '',
                };
                return (
                  <tr key={crit.id} className="align-top hover:bg-slate-50">
                    <td className="border border-slate-300 p-2 text-center font-bold">{crit.num}</td>
                    <td className="border border-slate-300 p-2 font-bold text-slate-950">{crit.title}</td>
                    <td className="border border-slate-300 p-2">
                      <ul className="space-y-1 text-[11px] list-disc list-inside text-slate-700">
                        {crit.indicators.map((ind) => (
                          <li
                            key={ind.num}
                            className={
                              critState.checkedIndicators.includes(ind.num)
                                ? 'font-bold text-emerald-950'
                                : 'text-slate-500'
                            }
                          >
                            <span className="font-bold">.{ind.num}</span> {ind.text}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="border border-slate-300 p-2 text-slate-800 whitespace-pre-wrap leading-relaxed font-medium">
                      {critState.notes || 'محقق بالكامل وفق الأصول.'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* رابعاً: الجوانب الإدارية */}
        <div className="space-y-2 pt-2">
          <div className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold font-tajawal flex items-center justify-between">
            <span>رابعاً: الجوانب الإدارية</span>
            <span className="text-[11px] text-slate-300 font-normal">تشكيلات، خطة سنوية، دوام واجتماعات</span>
          </div>

          <table className="w-full border-collapse border border-slate-400 text-xs text-right">
            <tbody>
              {/* أ- التشكيلات المدرسية */}
              <tr className="bg-slate-100 font-bold">
                <td colSpan={2} className="border border-slate-300 p-2 text-slate-900">
                  أ- التشكيلات المدرسية:
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 bg-slate-50 p-2 w-72 font-bold">
                  .1 المراكز التطويرية والإدارية:
                </td>
                <td className="border border-slate-300 p-2 whitespace-pre-wrap">
                  {report.adminSection?.formationDevAdmin || '—'}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 bg-slate-50 p-2 font-bold leading-relaxed">
                  .2 توزيع البرنامج الدراسي ومدى انسجامه مع تخصصات ومؤهلات وقدرات المعلمين والعدالة في توزيعه وفقاً لاحتياجات المدرسة:
                </td>
                <td className="border border-slate-300 p-2 whitespace-pre-wrap">
                  {report.adminSection?.curriculumScheduleBalance || '—'}
                </td>
              </tr>

              {/* ب- الخطة السنوية */}
              <tr className="bg-slate-100 font-bold">
                <td colSpan={2} className="border border-slate-300 p-2 text-slate-900">
                  ب- الخطة السنوية: (توفرها، ملاءمتها للأسس العلمية ، إنجازات)
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 bg-slate-50 p-2 font-bold">الخطة السنوية والإنجازات:</td>
                <td className="border border-slate-300 p-2 whitespace-pre-wrap">
                  {report.adminSection?.annualPlan || '—'}
                </td>
              </tr>

              {/* ج- متابعة دوام العاملين */}
              <tr className="bg-slate-100 font-bold">
                <td colSpan={2} className="border border-slate-300 p-2 text-slate-900">
                  ج- متابعة دوام العاملين:
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 bg-slate-50 p-2 font-bold">.1 حضور ومغادرة:</td>
                <td className="border border-slate-300 p-2">{report.adminSection?.staffAttendanceArrival || '—'}</td>
              </tr>
              <tr>
                <td className="border border-slate-300 bg-slate-50 p-2 font-bold">.2 إجازات:</td>
                <td className="border border-slate-300 p-2">{report.adminSection?.staffLeaves || '—'}</td>
              </tr>
              <tr>
                <td className="border border-slate-300 bg-slate-50 p-2 font-bold">.3 الالتزام بالوقت المخصص للحصص:</td>
                <td className="border border-slate-300 p-2">{report.adminSection?.staffClassTimeAdherence || '—'}</td>
              </tr>
              <tr>
                <td className="border border-slate-300 bg-slate-50 p-2 font-bold">.4 التزام المعلم بالمناوبة:</td>
                <td className="border border-slate-300 p-2">{report.adminSection?.staffDutyAdherence || '—'}</td>
              </tr>

              {/* د- متابعة دوام الطلبة */}
              <tr className="bg-slate-100 font-bold">
                <td colSpan={2} className="border border-slate-300 p-2 text-slate-900">
                  د- متابعة دوام الطلبة:
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 bg-slate-50 p-2 font-bold">الغياب:</td>
                <td className="border border-slate-300 p-2">{report.adminSection?.studentAbsence || '—'}</td>
              </tr>
              <tr>
                <td className="border border-slate-300 bg-slate-50 p-2 font-bold">التأخر الصباحي:</td>
                <td className="border border-slate-300 p-2">{report.adminSection?.studentMorningLate || '—'}</td>
              </tr>
              <tr>
                <td className="border border-slate-300 bg-slate-50 p-2 font-bold">المغادرة:</td>
                <td className="border border-slate-300 p-2">{report.adminSection?.studentLeaving || '—'}</td>
              </tr>
              <tr>
                <td className="border border-slate-300 bg-slate-50 p-2 font-bold">التسرب:</td>
                <td className="border border-slate-300 p-2">{report.adminSection?.studentDropout || '—'}</td>
              </tr>
              <tr>
                <td className="border border-slate-300 bg-slate-50 p-2 font-bold">الحركة:</td>
                <td className="border border-slate-300 p-2">{report.adminSection?.studentMovement || '—'}</td>
              </tr>
              <tr>
                <td className="border border-slate-300 bg-slate-50 p-2 font-bold">سجل حضور وغياب الطالب:</td>
                <td className="border border-slate-300 p-2">{report.adminSection?.studentAttendanceRecord || '—'}</td>
              </tr>

              {/* هـ- الاجتماعات بمختلف أشكالها */}
              <tr className="bg-slate-100 font-bold">
                <td colSpan={2} className="border border-slate-300 p-2 text-slate-900">
                  هـ- الاجتماعات بمختلف أشكالها: (دورية، زمرية، فردية) مناسبة من حيث العدد ووضوح الأهداف والتوصيات
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 bg-slate-50 p-2 font-bold">الاجتماعات وتوصياتها:</td>
                <td className="border border-slate-300 p-2 whitespace-pre-wrap">
                  {report.adminSection?.meetings || '—'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* خامساً: أ. المجال الإبداعي */}
        <div className="space-y-2 pt-2">
          <div className="bg-amber-800 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold font-tajawal flex items-center justify-between">
            <span>خامساً: أ. المجال الإبداعي</span>
            <span className="text-[11px] text-amber-200 font-normal">المبادرات والمشاريع الريادية</span>
          </div>

          <div className="border border-slate-300 p-3 rounded-lg text-xs bg-amber-50/40 text-slate-900 whitespace-pre-wrap leading-relaxed font-medium">
            {report.adminSection?.creativeDomain || 'لا توجد ملاحظات إبداعية مضافة.'}
          </div>
        </div>

        {/* Signatures Section (التوقيعات الرسمية الثلاثة المعتمدة حسب الملف المرفق) */}
        <div className="pt-8 border-t-2 border-slate-900 mt-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            {/* رئيس قسم ضبط الأداء المدرسي */}
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="font-bold text-xs text-slate-700">مُعِدّ التقرير</p>
                <p className="font-black text-sm text-slate-950 font-tajawal">
                  {DEFAULT_SIGNATORIES.deptHead.role}
                </p>
                <p className="text-xs font-bold text-emerald-900">
                  {DEFAULT_SIGNATORIES.deptHead.name}
                </p>
              </div>
              <div className="pt-8 border-b border-dashed border-slate-400 w-36 mx-auto"></div>
              <p className="text-[10px] text-slate-400">التوقيع والخاتم</p>
            </div>

            {/* مدير الدائرة الإدارية */}
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="font-bold text-xs text-slate-700">تدقيق واعتماد</p>
                <p className="font-black text-sm text-slate-950 font-tajawal">
                  {DEFAULT_SIGNATORIES.adminDirector.role}
                </p>
                <p className="text-xs font-bold text-slate-900">
                  {DEFAULT_SIGNATORIES.adminDirector.name}
                </p>
              </div>
              <div className="pt-8 border-b border-dashed border-slate-400 w-36 mx-auto"></div>
              <p className="text-[10px] text-slate-400">التوقيع والخاتم</p>
            </div>

            {/* مدير عام التربية والتعليم */}
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="font-bold text-xs text-slate-700">مصادقة</p>
                <p className="font-black text-sm text-slate-950 font-tajawal">
                  {DEFAULT_SIGNATORIES.generalDirector.role}
                </p>
                <p className="text-xs font-bold text-slate-900">
                  {DEFAULT_SIGNATORIES.generalDirector.name}
                </p>
              </div>
              <div className="pt-8 border-b border-dashed border-slate-400 w-36 mx-auto"></div>
              <p className="text-[10px] text-slate-400">التوقيع والخاتم الرسمي</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 text-center text-[10px] text-slate-400 border-t border-slate-200 flex items-center justify-between">
          <span>دولة فلسطين – وزارة التربية والتعليم العالي – مديرية قلقيلية</span>
          <span>تاريخ الطباعة: {new Date().toLocaleDateString('ar-EG')}</span>
          <span>قسم ضبط الأداء المدرسي – أ. عبد اللطيف رضوان</span>
        </div>
      </div>
    </div>
  );
};
