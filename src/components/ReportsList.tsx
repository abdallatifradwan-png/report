import React, { useState, useMemo } from 'react';
import { AnyAppReport, InspectionReport, FieldVisitReport } from '../types';
import { IMPRESSION_CONFIG } from '../data/constants';
import { deleteStoredReport } from '../utils/storage';
import { exportReportToPDF, generateWhatsAppMessage } from '../utils/pdfExport';
import {
  Search,
  Filter,
  Calendar,
  Eye,
  Edit3,
  FileDown,
  Trash2,
  Share2,
  Plus,
  School,
  Award,
  CheckCircle2,
  ArrowUpDown,
  Download,
  Upload,
  RefreshCw,
  Compass,
  ClipboardCheck,
} from 'lucide-react';

interface ReportsListProps {
  reports: AnyAppReport[];
  onViewReport: (report: AnyAppReport) => void;
  onEditReport: (report: AnyAppReport) => void;
  onNewInspectionReport: () => void;
  onNewFieldReport: () => void;
  onRefreshReports: () => void;
}

export const ReportsList: React.FC<ReportsListProps> = ({
  reports,
  onViewReport,
  onEditReport,
  onNewInspectionReport,
  onNewFieldReport,
  onRefreshReports,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'field' | 'inspection'>('all');
  const [selectedImpression, setSelectedImpression] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [reportToDelete, setReportToDelete] = useState<AnyAppReport | null>(null);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((rep) => {
      const isField = rep.visitKind === 'field' || rep.visitType === 'زيارة ميدانية';

      // Type filter
      if (selectedType === 'field' && !isField) return false;
      if (selectedType === 'inspection' && isField) return false;

      // Search term
      const matchesSearch =
        !searchTerm.trim() ||
        rep.schoolName.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        rep.directorateAr.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        (rep.principalName && rep.principalName.toLowerCase().includes(searchTerm.toLowerCase().trim()));

      // Date filter
      const matchesDate = !dateFilter || rep.visitDate === dateFilter;

      // Impression filter (applies mostly to inspection reports)
      if (selectedImpression !== 'all') {
        const insp = rep as InspectionReport;
        if (!insp.generalImpression || insp.generalImpression !== selectedImpression) {
          return false;
        }
      }

      return matchesSearch && matchesDate;
    });
  }, [reports, searchTerm, selectedType, selectedImpression, dateFilter]);

  const handleDeleteConfirm = () => {
    if (!reportToDelete) return;
    deleteStoredReport(reportToDelete.id);
    setReportToDelete(null);
    onRefreshReports();
  };

  const handleShareWhatsApp = (report: AnyAppReport, e: React.MouseEvent) => {
    e.stopPropagation();
    if (report.visitKind === 'field' || report.visitType === 'زيارة ميدانية') {
      const text = `*تقرير زيارة ميدانية*\nالمدرسة: ${report.schoolName}\nالتاريخ: ${report.visitDate}\nالمديرية: ${report.directorateAr}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    } else {
      const encoded = generateWhatsAppMessage(report as InspectionReport);
      window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    }
  };

  // Stats calculation
  const totalCount = reports.length;
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const fieldCount = reports.filter((r) => r.visitKind === 'field' || r.visitType === 'زيارة ميدانية').length;
  const inspectionCount = totalCount - fieldCount;

  return (
    <div className="w-full max-w-6xl mx-auto py-4 px-2 sm:px-4 font-['Cairo',sans-serif]">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 font-tajawal">
            سجل التقارير والزيارات المدرسية
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            إدارة وعرض وتصدير جميع تقارير الزيارات الميدانية والتفقدية
          </p>
        </div>

        {/* Dual New Visit Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onNewFieldReport}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer text-xs sm:text-sm"
          >
            <Compass className="w-4 h-4 text-emerald-300" />
            <span>+ بدء زيارة ميدانية</span>
          </button>

          <button
            onClick={onNewInspectionReport}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-900 hover:bg-rose-950 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer text-xs sm:text-sm"
          >
            <ClipboardCheck className="w-4 h-4 text-rose-300" />
            <span>+ بدء زيارة تفقدية</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-lg">
            {totalCount}
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block">إجمالي التقارير</span>
            <span className="text-sm font-bold text-slate-900">كل الزيارات</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg">
            {fieldCount}
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block">زيارات ميدانية</span>
            <span className="text-sm font-bold text-emerald-800">النموذج الشامل</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-900 flex items-center justify-center font-bold text-lg">
            {inspectionCount}
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block">زيارات تفقدية</span>
            <span className="text-sm font-bold text-rose-900">النموذج السريع</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold text-lg">
            <CheckCircle2 className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block">حالة التوثيق</span>
            <span className="text-sm font-bold text-slate-900">معتمد ورسمي</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-6 space-y-3">
        {/* Visit Type Segmented Filter */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-600">تصنيف الزيارة:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedType === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              جميع الزيارات ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('field')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedType === 'field'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              زيارات ميدانية ({fieldCount})
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('inspection')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedType === 'inspection'
                  ? 'bg-rose-900 text-white'
                  : 'bg-rose-50 text-rose-900 hover:bg-rose-100'
              }`}
            >
              زيارات تفقدية ({inspectionCount})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search text */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث باسم المدرسة، المديرية، أو اسم المدير..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs md:text-sm text-slate-900 focus:border-rose-900 outline-none"
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs md:text-sm text-slate-900 focus:border-rose-900 outline-none"
            />
          </div>

          {/* Clear button */}
          <div className="flex items-center justify-end">
            {(searchTerm || dateFilter || selectedType !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                  setDateFilter('');
                }}
                className="text-xs text-rose-900 hover:text-rose-950 font-bold cursor-pointer underline"
              >
                إعادة ضبط الفلاتر
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reports Table & List */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <School className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">لا توجد تقارير مطابقة</h3>
          <p className="text-xs text-slate-500 mb-4">
            لم يتم العثور على تقارير تطابق خيارات البحث الحالية.
          </p>
          <div className="flex justify-center gap-2">
            <button
              onClick={onNewFieldReport}
              className="px-4 py-2 bg-emerald-800 text-white text-xs font-bold rounded-xl hover:bg-emerald-900 cursor-pointer"
            >
              + زيارة ميدانية جديدة
            </button>
            <button
              onClick={onNewInspectionReport}
              className="px-4 py-2 bg-rose-900 text-white text-xs font-bold rounded-xl hover:bg-rose-950 cursor-pointer"
            >
              + زيارة تفقدية جديدة
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs md:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-tajawal">
                  <th className="py-3 px-4 font-bold">نوع الزيارة</th>
                  <th className="py-3 px-4 font-bold">اسم المدرسة</th>
                  <th className="py-3 px-4 font-bold">تاريخ وتوقيت الزيارة</th>
                  <th className="py-3 px-4 font-bold">مدير / مديرة المدرسة</th>
                  <th className="py-3 px-3 font-bold text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredReports.map((report) => {
                  const isField = report.visitKind === 'field' || report.visitType === 'زيارة ميدانية';
                  return (
                    <tr
                      key={report.id}
                      onClick={() => onViewReport(report)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      {/* Visit Type Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                            isField
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                              : 'bg-rose-50 text-rose-900 border-rose-300'
                          }`}
                        >
                          {isField ? (
                            <>
                              <Compass className="w-3.5 h-3.5 text-emerald-600" />
                              <span>ميدانية</span>
                            </>
                          ) : (
                            <>
                              <ClipboardCheck className="w-3.5 h-3.5 text-rose-600" />
                              <span>تفقدية</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* School Name */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <School className="w-4 h-4 text-slate-500 shrink-0" />
                          <div>
                            <span className="block group-hover:text-rose-900 font-black">
                              {report.schoolName}
                            </span>
                            <span className="text-[11px] text-slate-500 font-normal">
                              {report.directorateAr}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4 text-slate-700 font-semibold whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{report.visitDate}</span>
                          <span className="text-slate-400 text-xs">({report.visitTime})</span>
                        </div>
                      </td>

                      {/* Principal Name */}
                      <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                        {report.principalName ? (
                          <span className="font-semibold text-xs text-slate-800">
                            {report.principalName}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => onViewReport(report)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="عرض التقرير والطباعة"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onEditReport(report)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="تعديل بيانات التقرير"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleShareWhatsApp(report, e)}
                            className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="مشاركة عبر واتساب"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setReportToDelete(report)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="حذف التقرير"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {reportToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-right border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">تأكيد حذف التقرير</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              هل أنت متأكد من حذف تقرير زيارة مدرسة <strong>{reportToDelete.schoolName}</strong> بتاريخ{' '}
              <strong>{reportToDelete.visitDate}</strong>؟
              <br />
              لا يمكن التراجع عن هذه العملية بعد الحذف.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setReportToDelete(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg cursor-pointer"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
