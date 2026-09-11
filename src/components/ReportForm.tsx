import React, { useState, useEffect } from 'react';
import { AppSettings, EvaluationRating, GeneralImpression, InspectionReport } from '../types';
import {
  EVALUATION_DOMAINS,
  RATING_CONFIG,
  IMPRESSION_CONFIG,
  QUICK_NOTES_SUGGESTIONS,
} from '../data/constants';
import { addOrUpdateReport, getStoredSettings, saveStoredSettings } from '../utils/storage';
import {
  School,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Save,
  FileDown,
  Printer,
  Share2,
  Plus,
  Zap,
  Check,
  Award,
  ArrowRight,
  BookmarkCheck,
  ChevronDown,
  FileSpreadsheet,
  Upload,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SchoolImportModal } from './SchoolImportModal';

interface ReportFormProps {
  initialReport?: InspectionReport | null;
  settings: AppSettings;
  onSaveSuccess: (savedReport: InspectionReport, action: 'view' | 'pdf' | 'print' | 'new') => void;
  onCancel?: () => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({
  initialReport,
  settings,
  onSaveSuccess,
  onCancel,
}) => {
  // Current date & time defaults
  const todayStr = new Date().toISOString().split('T')[0];
  const nowTimeStr = new Date().toTimeString().slice(0, 5);

  const [schoolName, setSchoolName] = useState(
    initialReport?.schoolName || (settings.customSchools.length > 0 ? settings.customSchools[0] : '')
  );
  const [newSchoolInput, setNewSchoolInput] = useState('');
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [availableSchools, setAvailableSchools] = useState<string[]>(settings.customSchools);

  const [visitDate, setVisitDate] = useState(initialReport?.visitDate || todayStr);
  const [visitTime, setVisitTime] = useState(initialReport?.visitTime || nowTimeStr);
  const [visitType] = useState('زيارة تفقدية');

  // Evaluations record
  const [evaluations, setEvaluations] = useState<Record<string, EvaluationRating>>(() => {
    if (initialReport?.evaluations) {
      return { ...initialReport.evaluations };
    }
    // Initialize all 22 items to 'good' by default for blazing fast speed
    const initial: Record<string, EvaluationRating> = {};
    EVALUATION_DOMAINS.forEach((domain) => {
      domain.items.forEach((item) => {
        initial[item.id] = 'good';
      });
    });
    return initial;
  });

  // General Impression
  const [generalImpression, setGeneralImpression] = useState<GeneralImpression>(
    initialReport?.generalImpression || 'very_good'
  );

  // Written notes
  const [positives, setPositives] = useState(initialReport?.positives || '');
  const [needs, setNeeds] = useState(initialReport?.needs || '');
  const [recommendations, setRecommendations] = useState(initialReport?.recommendations || '');
  const [agreements, setAgreements] = useState(initialReport?.agreements || '');

  // Saved confirmation modal state
  const [savedReport, setSavedReport] = useState<InspectionReport | null>(null);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Update schools if settings change
  useEffect(() => {
    setAvailableSchools(settings.customSchools);
  }, [settings.customSchools]);

  const handleRatingChange = (itemId: string, rating: EvaluationRating) => {
    setEvaluations((prev) => ({
      ...prev,
      [itemId]: rating,
    }));
  };

  const setAllToRating = (rating: EvaluationRating) => {
    const updated: Record<string, EvaluationRating> = {};
    EVALUATION_DOMAINS.forEach((domain) => {
      domain.items.forEach((item) => {
        updated[item.id] = rating;
      });
    });
    setEvaluations(updated);
  };

  const handleAddNewSchool = () => {
    const trimmed = newSchoolInput.trim();
    if (!trimmed) return;
    if (!availableSchools.includes(trimmed)) {
      const updated = [trimmed, ...availableSchools];
      setAvailableSchools(updated);
      const updatedSettings = { ...getStoredSettings(), customSchools: updated };
      saveStoredSettings(updatedSettings);
    }
    setSchoolName(trimmed);
    setNewSchoolInput('');
    setShowAddSchool(false);
  };

  const handleImportSchools = (importedList: string[], mode: 'merge' | 'replace') => {
    let updated: string[] = [];
    if (mode === 'replace') {
      updated = [...importedList];
    } else {
      const set = new Set([...importedList, ...availableSchools]);
      updated = Array.from(set);
    }

    setAvailableSchools(updated);
    const updatedSettings = { ...getStoredSettings(), customSchools: updated };
    saveStoredSettings(updatedSettings);

    // If current school is not in updated list, select first imported school
    if (importedList.length > 0) {
      setSchoolName(importedList[0]);
    }
  };

  const handleAppendSuggestion = (
    field: 'positives' | 'needs' | 'recommendations' | 'agreements',
    text: string
  ) => {
    if (field === 'positives') {
      setPositives((prev) => (prev ? `${prev}\n• ${text}` : `• ${text}`));
    } else if (field === 'needs') {
      setNeeds((prev) => (prev ? `${prev}\n• ${text}` : `• ${text}`));
    } else if (field === 'recommendations') {
      setRecommendations((prev) => (prev ? `${prev}\n• ${text}` : `• ${text}`));
    } else if (field === 'agreements') {
      setAgreements((prev) => (prev ? `${prev}\n• ${text}` : `• ${text}`));
    }
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const newErrors: string[] = [];
    if (!schoolName.trim()) {
      newErrors.push('يرجى اختيار أو إدخال اسم المدرسة');
    }
    if (!visitDate) {
      newErrors.push('يرجى تحديد تاريخ الزيارة');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setErrors([]);

    const reportId = initialReport?.id || `rep-${Date.now()}`;
    const reportData: InspectionReport = {
      id: reportId,
      schoolName: schoolName.trim(),
      directorateAr: settings.directorateAr,
      directorateEn: settings.directorateEn,
      visitDate,
      visitTime,
      visitType: 'زيارة تفقدية',
      deptHeadName: settings.deptHeadName,
      jobTitle: settings.jobTitle,
      evaluations,
      generalImpression,
      positives,
      needs,
      recommendations,
      agreements,
      status: 'completed',
      createdAt: initialReport?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = addOrUpdateReport(reportData);
    setSavedReport(saved);
    setIsSavedModalOpen(true);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  // Evaluation stats
  const totalItems = 22;
  const goodCount = Object.values(evaluations).filter((v) => v === 'good').length;
  const followupCount = Object.values(evaluations).filter((v) => v === 'needs_followup').length;
  const actionCount = Object.values(evaluations).filter((v) => v === 'needs_action').length;

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-2 sm:px-4">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-l from-rose-950 via-rose-900 to-rose-950 text-white rounded-2xl p-4 md:p-6 shadow-md border border-rose-800 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>نظام ضبط الأداء المدرسي</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black font-tajawal tracking-tight">
              {initialReport ? 'تعديل تقرير الزيارة التفقدية' : 'إعداد تقرير زيارة تفقدية سريعة'}
            </h1>
            <p className="text-xs md:text-sm text-rose-200 mt-1">
              تعبئة سريعة ومنظمة مع خيارات جاهزة واعتماد الترويسة الرسمية
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 text-xs text-right space-y-1">
            <div className="text-rose-200">الزائر المعتمد:</div>
            <div className="font-bold text-white">{settings.deptHeadName}</div>
            <div className="text-[11px] text-amber-300">{settings.jobTitle}</div>
          </div>
        </div>
      </div>

      {/* Error Notices */}
      {errors.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-400 rounded-xl p-4 mb-6 text-rose-900 text-sm">
          <div className="font-bold mb-1 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>يرجى استكمال الحقول المطلوبة:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 pr-2">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Step 1: Visit Metadata Card (بيانات الزيارة) */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-4">
            <div className="w-8 h-8 rounded-lg bg-rose-900 text-white flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-tajawal">
                بيانات الزيارة التفقدية
              </h2>
              <p className="text-xs text-slate-500">
                المدرسة وتاريخ ووقت الزيارة
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* School Name Selection */}
            <div className="md:col-span-2 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs md:text-sm font-bold text-slate-800 flex items-center gap-1.5 font-cairo">
                    <School className="w-4 h-4 text-rose-900" />
                    <span>اسم المدرسة *</span>
                  </label>
                  <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                    ({availableSchools.length} مدرسة متاحة)
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowImportModal(true)}
                    className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                    title="استيراد قائمة مدارس من ملف إكسيل أو PDF"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                    <span>استيراد ملف Excel / PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAddSchool(!showAddSchool)}
                    className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddSchool ? 'إلغاء الإضافة' : '+ مدرسة غير موجودة في القائمة'}</span>
                  </button>
                </div>
              </div>

              {!showAddSchool ? (
                <div className="relative">
                  <select
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm md:text-base font-bold text-slate-900 focus:bg-white focus:border-rose-900 focus:ring-2 focus:ring-rose-900/20 transition-all outline-none"
                  >
                    <option value="">-- اختر المدرسة --</option>
                    {availableSchools.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="p-3 bg-rose-50/70 border-2 border-rose-300 rounded-xl space-y-2">
                  <label className="text-xs font-bold text-rose-950 block">إضافة مدرسة جديدة وحفظها في القائمة:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSchoolInput}
                      onChange={(e) => setNewSchoolInput(e.target.value)}
                      placeholder="اكتب اسم المدرسة الجديدة هنا..."
                      className="flex-1 bg-white border-2 border-rose-600 rounded-xl px-4 py-2 text-sm font-bold text-slate-900 focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleAddNewSchool}
                      className="bg-rose-900 hover:bg-rose-950 text-white font-bold px-4 py-2 rounded-xl text-xs md:text-sm whitespace-nowrap cursor-pointer shadow-xs"
                    >
                      إضافة واختيار
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Visit Date */}
            <div className="space-y-1.5">
              <label className="text-xs md:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-600" />
                <span>تاريخ الزيارة *</span>
              </label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:bg-white focus:border-rose-900 focus:ring-2 focus:ring-rose-900/20 outline-none"
              />
            </div>

            {/* Visit Time */}
            <div className="space-y-1.5">
              <label className="text-xs md:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-600" />
                <span>وقت الزيارة *</span>
              </label>
              <input
                type="time"
                value={visitTime}
                onChange={(e) => setVisitTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:bg-white focus:border-rose-900 focus:ring-2 focus:ring-rose-900/20 outline-none"
              />
            </div>

            {/* Fixed Type and Visitor info display */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs flex items-center justify-between">
              <span className="text-slate-500">نوع الزيارة:</span>
              <span className="font-bold text-slate-800 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                {visitType}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs flex items-center justify-between">
              <span className="text-slate-500">المديرية:</span>
              <span className="font-bold text-slate-800">
                {settings.directorateAr}
              </span>
            </div>
          </div>
        </section>

        {/* Step 2: Quick Evaluation (التقييم السريع - المحاور الخمسة) */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-900 text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 font-tajawal">
                  التقييم السريع للمحاور الخمسة
                </h2>
                <p className="text-xs text-slate-500">
                  اضغط على الزر المناسب لكل بند (جيد / يحتاج متابعة / يحتاج معالجة)
                </p>
              </div>
            </div>

            {/* Fast Auto-fill Tool */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAllToRating('good')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                title="تعيين جميع البنود كـ جيد لتسريع التعبئة وتعديل المستثنى فقط"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>تحديد الكل (🟢 جيد)</span>
              </button>
            </div>
          </div>

          {/* Quick Counter Badges */}
          <div className="flex items-center gap-2 mb-6 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <span className="text-slate-600 font-semibold">إحصائية التقييم:</span>
            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
              🟢 جيد ({goodCount})
            </span>
            <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">
              🟡 يحتاج متابعة ({followupCount})
            </span>
            <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-md">
              🔴 يحتاج معالجة ({actionCount})
            </span>
          </div>

          {/* 5 Domains Loop */}
          <div className="space-y-6">
            {EVALUATION_DOMAINS.map((domain, dIdx) => (
              <div
                key={domain.id}
                className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50"
              >
                {/* Domain Header */}
                <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between font-tajawal">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs">
                      {dIdx + 1}
                    </span>
                    <span className="font-bold text-sm md:text-base">{domain.title}</span>
                  </div>
                  <span className="text-[11px] text-slate-300 font-normal">
                    {domain.items.length} بنود
                  </span>
                </div>

                {/* Domain Criteria List */}
                <div className="p-3 md:p-4 space-y-3 bg-white">
                  {domain.items.map((item, itemIdx) => {
                    const currentRating = evaluations[item.id] || 'good';
                    return (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-400 font-bold w-6">
                            {dIdx + 1}.{itemIdx + 1}
                          </span>
                          <span className="text-sm md:text-base font-bold text-slate-800">
                            {item.label}
                          </span>
                        </div>

                        {/* Large Touch-friendly Rating Buttons */}
                        <div className="grid grid-cols-3 gap-1.5 sm:flex sm:items-center sm:gap-2">
                          {/* Good Button */}
                          <button
                            type="button"
                            onClick={() => handleRatingChange(item.id, 'good')}
                            className={`py-2 px-3 sm:px-4 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-1.5 border-2 transition-all cursor-pointer ${
                              currentRating === 'good'
                                ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm scale-[1.02]'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300'
                            }`}
                          >
                            <span>🟢</span>
                            <span>جيد</span>
                          </button>

                          {/* Needs Followup Button */}
                          <button
                            type="button"
                            onClick={() => handleRatingChange(item.id, 'needs_followup')}
                            className={`py-2 px-3 sm:px-4 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-1.5 border-2 transition-all cursor-pointer ${
                              currentRating === 'needs_followup'
                                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm scale-[1.02]'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-300'
                            }`}
                          >
                            <span>🟡</span>
                            <span>يحتاج متابعة</span>
                          </button>

                          {/* Needs Action Button */}
                          <button
                            type="button"
                            onClick={() => handleRatingChange(item.id, 'needs_action')}
                            className={`py-2 px-3 sm:px-4 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-1.5 border-2 transition-all cursor-pointer ${
                              currentRating === 'needs_action'
                                ? 'bg-rose-700 text-white border-rose-800 shadow-sm scale-[1.02]'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-rose-50 hover:border-rose-300'
                            }`}
                          >
                            <span>🔴</span>
                            <span>يحتاج معالجة</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Step 3: General Impression (الانطباع العام) */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-4">
            <div className="w-8 h-8 rounded-lg bg-rose-900 text-white flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-tajawal">
                الانطباع العام عن الزيارة
              </h2>
              <p className="text-xs text-slate-500">
                اختر مستوى واحد يعكس الخلاصة الشاملة للزيارة
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            {(
              [
                { key: 'excellent', label: '⭐ ممتاز', desc: 'أداء نموذجي' },
                { key: 'very_good', label: '🟢 جيد جدًا', desc: 'أداء متميز' },
                { key: 'good', label: '🟡 جيد', desc: 'مستوى ملائم' },
                { key: 'needs_followup', label: '🟠 يحتاج متابعة', desc: 'ملاحظات محددة' },
                { key: 'needs_action', label: '🔴 يحتاج معالجة', desc: 'تدخل عاجل' },
              ] as const
            ).map((imp) => {
              const isSelected = generalImpression === imp.key;
              return (
                <button
                  type="button"
                  key={imp.key}
                  onClick={() => setGeneralImpression(imp.key)}
                  className={`p-3.5 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'border-rose-900 bg-rose-50/70 text-rose-950 font-black shadow-sm scale-105'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 font-bold'
                  }`}
                >
                  <span className="text-sm md:text-base">{imp.label}</span>
                  <span className="text-[10px] text-slate-500 font-normal">{imp.desc}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 4: Written Notes & Recommendations (الملاحظات والتوصيات - اختيارية وسريعة) */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-900 text-white flex items-center justify-center font-bold text-sm">
                4
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 font-tajawal">
                  الملاحظات الكتابية والتوصيات
                </h2>
                <p className="text-xs text-slate-500">
                  خانات اختيارية وسريعة لإبراز الملاحظات الجوهرية (يمكنك الضغط على المقترحات الجاهزة)
                </p>
              </div>
            </div>
          </div>

          {/* 1. Positives */}
          <div className="space-y-2">
            <label className="text-xs md:text-sm font-bold text-emerald-950 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>أبرز الإيجابيات (اختياري)</span>
            </label>
            <textarea
              rows={2}
              value={positives}
              onChange={(e) => setPositives(e.target.value)}
              placeholder="اكتب أبرز نقاط القوة والإيجابيات التي تم رصدها..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs md:text-sm font-medium text-slate-900 focus:bg-white focus:border-rose-900 focus:ring-2 focus:ring-rose-900/20 outline-none"
            />
            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1.5">
              {QUICK_NOTES_SUGGESTIONS.positives.slice(0, 3).map((sugg, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAppendSuggestion('positives', sugg)}
                  className="text-[11px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  + {sugg}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Needs */}
          <div className="space-y-2">
            <label className="text-xs md:text-sm font-bold text-amber-950 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>أبرز الاحتياجات (اختياري)</span>
            </label>
            <textarea
              rows={2}
              value={needs}
              onChange={(e) => setNeeds(e.target.value)}
              placeholder="اكتب أبرز احتياجات المدرسة أو الجوانب التي تتطلب متابعة..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs md:text-sm font-medium text-slate-900 focus:bg-white focus:border-rose-900 focus:ring-2 focus:ring-rose-900/20 outline-none"
            />
            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1.5">
              {QUICK_NOTES_SUGGESTIONS.needs.slice(0, 3).map((sugg, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAppendSuggestion('needs', sugg)}
                  className="text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  + {sugg}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Recommendations */}
          <div className="space-y-2">
            <label className="text-xs md:text-sm font-bold text-blue-950 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span>أبرز التوصيات (اختياري)</span>
            </label>
            <textarea
              rows={2}
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              placeholder="اكتب التوصيات الموجهة لإدارة المدرسة أو الأقسام ذات العلاقة..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs md:text-sm font-medium text-slate-900 focus:bg-white focus:border-rose-900 focus:ring-2 focus:ring-rose-900/20 outline-none"
            />
            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1.5">
              {QUICK_NOTES_SUGGESTIONS.recommendations.slice(0, 3).map((sugg, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAppendSuggestion('recommendations', sugg)}
                  className="text-[11px] bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  + {sugg}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Step 5: Agreed Points with Administration (أهم الأمور التي تم الاتفاق عليها) */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 space-y-3">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-rose-900 text-white flex items-center justify-center font-bold text-sm">
              5
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-tajawal">
                أهم الأمور التي تم الاتفاق عليها
              </h2>
              <p className="text-xs text-slate-500">
                النقاط والإجراءات المتفق عليها مع إدارة المدرسة أثناء الزيارة الميدانية
              </p>
            </div>
          </div>

          <textarea
            rows={3}
            value={agreements}
            onChange={(e) => setAgreements(e.target.value)}
            placeholder="اكتب ما تم الاتفاق عليه مع مدير/ة المدرسة من خطط وإجراءات ومواعيد متابعة..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs md:text-sm font-medium text-slate-900 focus:bg-white focus:border-rose-900 focus:ring-2 focus:ring-rose-900/20 outline-none"
          />

          {/* Quick Chips */}
          <div className="flex flex-wrap gap-1.5">
            {QUICK_NOTES_SUGGESTIONS.agreements.slice(0, 3).map((sugg, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAppendSuggestion('agreements', sugg)}
                className="text-[11px] bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                + {sugg}
              </button>
            ))}
          </div>
        </section>

        {/* Action Buttons Toolbar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3 sticky bottom-3 z-10 backdrop-blur-md bg-white/95">
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-xs md:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
            >
              إلغاء
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-6 md:px-8 py-3 bg-gradient-to-r from-rose-900 to-rose-950 hover:from-rose-950 hover:to-slate-950 text-white font-black text-sm md:text-base rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-5 h-5 text-amber-400" />
              <span>حفظ تقرير الزيارة</span>
            </button>
          </div>
        </div>
      </form>

      {/* Post-Save Confirmation Modal */}
      {isSavedModalOpen && savedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 text-center border-2 border-slate-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-black text-slate-900 font-tajawal mb-1">
              تم حفظ تقرير الزيارة بنجاح!
            </h3>
            <p className="text-xs md:text-sm text-slate-600 mb-6 font-semibold">
              المدرسة: <span className="text-rose-950 font-bold">{savedReport.schoolName}</span> | التاريخ: {savedReport.visitDate}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
              <button
                onClick={() => {
                  setIsSavedModalOpen(false);
                  onSaveSuccess(savedReport, 'view');
                }}
                className="p-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs md:text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <BookmarkCheck className="w-4 h-4 text-amber-400" />
                <span>عرض التقرير الرسمي</span>
              </button>

              <button
                onClick={() => {
                  setIsSavedModalOpen(false);
                  onSaveSuccess(savedReport, 'pdf');
                }}
                className="p-3 bg-rose-900 hover:bg-rose-950 text-white font-bold text-xs md:text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <FileDown className="w-4 h-4 text-amber-300" />
                <span>تصدير PDF (A4)</span>
              </button>

              <button
                onClick={() => {
                  setIsSavedModalOpen(false);
                  onSaveSuccess(savedReport, 'print');
                }}
                className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs md:text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-300"
              >
                <Printer className="w-4 h-4 text-slate-700" />
                <span>طباعة التقرير</span>
              </button>

              <button
                onClick={() => {
                  setIsSavedModalOpen(false);
                  setIsSavedModalOpen(false);
                  // Reset form for fresh visit
                  setSchoolName('');
                  setPositives('');
                  setNeeds('');
                  setRecommendations('');
                  setAgreements('');
                  onSaveSuccess(savedReport, 'new');
                }}
                className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs md:text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer border border-emerald-300"
              >
                <Plus className="w-4 h-4 text-emerald-700" />
                <span>إنشاء زيارة جديدة</span>
              </button>
            </div>

            <button
              onClick={() => setIsSavedModalOpen(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
            >
              إغلاق والبقاء في الصفحة
            </button>
          </div>
        </div>
      )}

      {/* School Import Modal (Excel / PDF / Text) */}
      <SchoolImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        currentSchools={availableSchools}
        onImportSchools={handleImportSchools}
      />
    </div>
  );
};
