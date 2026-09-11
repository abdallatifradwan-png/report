/**
 * @application الزيارة التفقدية والميدانية
 * @description نموذج إعداد وتعبئة تقرير الزيارة الميدانية لمدارس مديرية التربية والتعليم - قلقيلية
 * @author أ. عبد اللطيف رضوان
 * @entity قسم ضبط الأداء المدرسي – مديرية التربية والتعليم – قلقيلية
 * @copyright 2026 جميع الحقوق محفوظة
 */

import React, { useState, useEffect } from 'react';
import {
  AppSettings,
  FieldVisitReport,
  FieldVisitCriterionState,
  FieldVisitAdminSection,
  FieldCriterionStatus,
} from '../types';
import {
  TEACHERS_DOMAIN,
  STUDENTS_DOMAIN,
  COMMUNICATION_DOMAIN,
  ADMIN_SECTION_SUGGESTIONS,
  FieldCriterion,
} from '../data/fieldVisitStructure';
import {
  findPrincipalByName,
  findPrincipalBySchoolName,
  PrincipalRecord,
} from '../data/principals';
import { addOrUpdateReport, addSchoolToSettings, addPrincipalToSettings } from '../utils/storage';
import {
  School,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Hourglass,
  Sparkles,
  Save,
  Printer,
  FileDown,
  ArrowRight,
  Plus,
  BookmarkCheck,
  Check,
  ChevronDown,
  Users,
  GraduationCap,
  Building2,
  FileText,
  BadgePercent,
  CheckSquare,
  Square,
  ShieldCheck,
  Info,
  Phone,
  MapPin,
  Briefcase,
  RefreshCw,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FieldVisitFormProps {
  initialReport?: FieldVisitReport | null;
  settings: AppSettings;
  onSaveSuccess: (savedReport: FieldVisitReport, action: 'view' | 'pdf' | 'print' | 'new') => void;
  onCancel?: () => void;
}

export const FieldVisitForm: React.FC<FieldVisitFormProps> = ({
  initialReport,
  settings,
  onSaveSuccess,
  onCancel,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const nowTimeStr = new Date().toTimeString().slice(0, 5);

  const defaultInitialSchool = initialReport?.schoolName || (settings.customSchools.length > 0 ? settings.customSchools[0] : '');
  const initialPrincipalRecord = initialReport?.principalName
    ? findPrincipalByName(initialReport.principalName)
    : findPrincipalBySchoolName(defaultInitialSchool);

  // General Info
  const [schoolName, setSchoolName] = useState(defaultInitialSchool);
  const [principalName, setPrincipalName] = useState(
    initialReport?.principalName || initialPrincipalRecord?.name || (settings.customPrincipals.length > 0 ? settings.customPrincipals[0] : '')
  );
  const [principalIdNumber, setPrincipalIdNumber] = useState(
    initialReport?.principalIdNumber || initialPrincipalRecord?.nationalId || ''
  );
  const [qualification, setQualification] = useState(
    initialReport?.qualification || initialPrincipalRecord?.fullQualification || 'بكالوريوس'
  );
  const [appointmentDate, setAppointmentDate] = useState(
    initialReport?.appointmentDate || initialPrincipalRecord?.teacherAppointmentDate || '2010-09-01'
  );
  const [principalshipStartDate, setPrincipalshipStartDate] = useState(
    initialReport?.principalshipStartDate || initialPrincipalRecord?.adminAppointmentDate || '2018-08-15'
  );
  const [studentsCount, setStudentsCount] = useState<string | number>(initialReport?.studentsCount || '350');
  const [classesCount, setClassesCount] = useState<string | number>(initialReport?.classesCount || '12');
  const [schoolLevelAndGender, setSchoolLevelAndGender] = useState(
    initialReport?.schoolLevelAndGender || initialPrincipalRecord?.fullSchoolLevelAndGender || 'أساسي مختلط'
  );
  const [visitDate, setVisitDate] = useState(initialReport?.visitDate || todayStr);
  const [visitTime, setVisitTime] = useState(initialReport?.visitTime || nowTimeStr);

  // السجل الرسمي للمدير الحالي المعتمد من بيانات المديرية
  const [matchedPrincipal, setMatchedPrincipal] = useState<PrincipalRecord | null>(initialPrincipalRecord || null);
  // إشعار التعبئة التلقائية
  const [autoFillNotice, setAutoFillNotice] = useState<string | null>(
    !initialReport && initialPrincipalRecord ? `تم جلب بيانات المدير (${initialPrincipalRecord.name}) تلقائياً لمدرسة ${defaultInitialSchool}` : null
  );

  // Add new school modal / prompt
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [newSchoolInput, setNewSchoolInput] = useState('');
  // Add new principal modal / prompt
  const [showAddPrincipal, setShowAddPrincipal] = useState(false);
  const [newPrincipalInput, setNewPrincipalInput] = useState('');

  // Active section tab in the form
  const [activeSection, setActiveSection] = useState<'teachers' | 'students' | 'communication' | 'admin' | 'creative'>('teachers');

  // Criteria State for all 18 criteria
  const allCriteria = [
    ...TEACHERS_DOMAIN.criteria,
    ...STUDENTS_DOMAIN.criteria,
    ...COMMUNICATION_DOMAIN.criteria,
  ];

  const [criteriaState, setCriteriaState] = useState<Record<string, FieldVisitCriterionState>>(() => {
    if (initialReport?.criteriaState) {
      return { ...initialReport.criteriaState };
    }
    const initial: Record<string, FieldVisitCriterionState> = {};
    allCriteria.forEach((crit) => {
      initial[crit.id] = {
        status: 'fully_achieved',
        checkedIndicators: crit.indicators.map((i) => i.num), // Default all checked
        notes: crit.defaultSuggestions ? crit.defaultSuggestions[0] : 'تم التحقق ومحقق بالكامل وفق الأصول.',
      };
    });
    return initial;
  });

  // Admin section
  const [adminSection, setAdminSection] = useState<FieldVisitAdminSection>(() => {
    if (initialReport?.adminSection) {
      return { ...initialReport.adminSection };
    }
    return {
      formationDevAdmin: ADMIN_SECTION_SUGGESTIONS.formationDevAdmin[0],
      curriculumScheduleBalance: ADMIN_SECTION_SUGGESTIONS.curriculumScheduleBalance[0],
      annualPlan: ADMIN_SECTION_SUGGESTIONS.annualPlan[0],
      staffAttendanceArrival: 'التزام تام بمواعيد الحضور والمغادرة وتوقيع السجلات حسب الأصول.',
      staffLeaves: 'الإجازات مقننة وموثقة رسمياً.',
      staffClassTimeAdherence: 'التزام كامل بالوقت المخصص للحصص.',
      staffDutyAdherence: 'التزام تام بالمناوبة الصباحية واليومية وتفقد الساحات.',
      studentAbsence: 'نسبة الغياب منخفضة ومبررة.',
      studentMorningLate: 'التأخر الصباحي مضبوط ومتابع يومياً.',
      studentLeaving: 'المغادرة بموجب أذونات رسمية مسبقة.',
      studentDropout: 'لا توجد حالات تسرب مدرسي.',
      studentMovement: 'حركة الطلبة وقبولهم مسجلة وفق الأصول.',
      studentAttendanceRecord: 'سجل حضور وغياب الطلبة يومي ودقيق ومدقق.',
      meetings: ADMIN_SECTION_SUGGESTIONS.meetings[0],
      creativeDomain: ADMIN_SECTION_SUGGESTIONS.creativeDomain[0],
    };
  });

  // Confirmation Modal
  const [savedReportObj, setSavedReportObj] = useState<FieldVisitReport | null>(null);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // Common quick choices
  const QUALIFICATION_OPTIONS = [
    'دبلوم',
    'بكالوريوس',
    'بكالوريوس + دبلوم تأهيل تربوي',
    'دبلوم عالي',
    'ماجستير',
    'ماجستير إدارة تربوية',
    'دكتوراه',
  ];

  const LEVEL_GENDER_OPTIONS = [
    'أساسي ذكور',
    'أساسي إناث',
    'أساسي مختلط',
    'ثانوي ذكور',
    'ثانوي إناث',
    'ثانوي مختلط',
    'أساسي وثانوي ذكور',
    'أساسي وثانوي إناث',
    'أساسي وثانوي مختلط',
  ];

  // Handler for setting status of a criterion
  const handleSetStatus = (crit: FieldCriterion, status: FieldCriterionStatus) => {
    setCriteriaState((prev) => {
      const current = prev[crit.id] || {
        status: 'unrated',
        checkedIndicators: [],
        notes: '',
      };

      let autoNote = current.notes;
      if (status === 'fully_achieved') {
        const defaultSugg = crit.defaultSuggestions ? crit.defaultSuggestions[0] : 'محقق بالكامل وموثق وفق الأصول التربوية.';
        autoNote = autoNote ? `${autoNote}\n• ${defaultSugg}` : defaultSugg;
      } else if (status === 'partially_achieved') {
        const partialText = 'محقق جزئياً ويحتاج إلى متابعة واستكمال بعض المتطلبات.';
        autoNote = autoNote ? `${autoNote}\n• ${partialText}` : partialText;
      } else if (status === 'needs_followup') {
        const actionText = 'يحتاج إلى معالجة وتدقيق فوري ومتابعة من إدارة المدرسة.';
        autoNote = autoNote ? `${autoNote}\n• ${actionText}` : actionText;
      } else if (status === 'in_progress') {
        const progressText = 'قيد المتابعة والتنفيذ في الوقت الحالي.';
        autoNote = autoNote ? `${autoNote}\n• ${progressText}` : progressText;
      }

      return {
        ...prev,
        [crit.id]: {
          ...current,
          status,
          notes: autoNote,
        },
      };
    });
  };

  // Handler for toggling an indicator checkbox
  const handleToggleIndicator = (crit: FieldCriterion, indicatorNum: number, indicatorText: string) => {
    setCriteriaState((prev) => {
      const current = prev[crit.id] || {
        status: 'unrated',
        checkedIndicators: [],
        notes: '',
      };

      const isChecked = current.checkedIndicators.includes(indicatorNum);
      const newChecked = isChecked
        ? current.checkedIndicators.filter((n) => n !== indicatorNum)
        : [...current.checkedIndicators, indicatorNum];

      // Auto update note if toggled
      let newNote = current.notes;
      if (!isChecked) {
        const verifiedSnippet = `تم التحقق من: ${indicatorText}`;
        if (!newNote.includes(indicatorText)) {
          newNote = newNote ? `${newNote}\n• ${verifiedSnippet}` : verifiedSnippet;
        }
      }

      return {
        ...prev,
        [crit.id]: {
          ...current,
          checkedIndicators: newChecked,
          notes: newNote,
        },
      };
    });
  };

  // Handler for appending suggestion
  const handleAppendSuggestion = (critId: string, suggestion: string) => {
    setCriteriaState((prev) => {
      const current = prev[critId] || {
        status: 'fully_achieved',
        checkedIndicators: [],
        notes: '',
      };
      const newNote = current.notes ? `${current.notes}\n• ${suggestion}` : suggestion;
      return {
        ...prev,
        [critId]: {
          ...current,
          notes: newNote,
        },
      };
    });
  };

  // اختيار مدرسة: جلب بيانات المدير والمدرسة المسجلة تلقائياً
  const handleSchoolSelect = (selectedSchool: string) => {
    setSchoolName(selectedSchool);
    const found = findPrincipalBySchoolName(selectedSchool);
    if (found) {
      setMatchedPrincipal(found);
      setPrincipalName(found.name);
      setPrincipalIdNumber(found.nationalId);
      setQualification(found.fullQualification);
      setAppointmentDate(found.teacherAppointmentDate);
      setPrincipalshipStartDate(found.adminAppointmentDate);
      setSchoolLevelAndGender(found.fullSchoolLevelAndGender);
      const roleTitle = found.gender === 'أنثى' ? 'المديرة' : 'المدير';
      setAutoFillNotice(`تم نقل بيانات ${roleTitle} (${found.name}) ورقم الهوية والمؤهل وتواريخ التعيين تلقائياً لمدرسة: ${selectedSchool}`);
    } else {
      setMatchedPrincipal(null);
    }
  };

  // اختيار مدير/ة: نقل بيانات المدير تلقائياً وربط المدرسة المسجلة
  const handlePrincipalSelect = (selectedPrincipalName: string) => {
    setPrincipalName(selectedPrincipalName);
    const found = findPrincipalByName(selectedPrincipalName);
    if (found) {
      setMatchedPrincipal(found);
      if (found.schoolName && settings.customSchools.includes(found.schoolName)) {
        setSchoolName(found.schoolName);
      }
      setPrincipalIdNumber(found.nationalId);
      setQualification(found.fullQualification);
      setAppointmentDate(found.teacherAppointmentDate);
      setPrincipalshipStartDate(found.adminAppointmentDate);
      setSchoolLevelAndGender(found.fullSchoolLevelAndGender);
      const roleTitle = found.gender === 'أنثى' ? 'المديرة' : 'المدير';
      setAutoFillNotice(`تم نقل بيانات ${roleTitle} (${found.name}) ورقم الهوية (${found.nationalId}) والمؤهل وتواريخ التعيين تلقائياً`);
    } else {
      setMatchedPrincipal(null);
    }
  };

  // إعادة مزامنة وتحديث الحقول من سجل المديرية المعتمد
  const handleResyncFromOfficial = () => {
    const found = findPrincipalByName(principalName) || findPrincipalBySchoolName(schoolName);
    if (found) {
      setMatchedPrincipal(found);
      setPrincipalName(found.name);
      if (found.schoolName && settings.customSchools.includes(found.schoolName)) {
        setSchoolName(found.schoolName);
      }
      setPrincipalIdNumber(found.nationalId);
      setQualification(found.fullQualification);
      setAppointmentDate(found.teacherAppointmentDate);
      setPrincipalshipStartDate(found.adminAppointmentDate);
      setSchoolLevelAndGender(found.fullSchoolLevelAndGender);
      const roleTitle = found.gender === 'أنثى' ? 'المديرة' : 'المدير';
      setAutoFillNotice(`تمت إعادة جلب وتحديث كافة بيانات ${roleTitle} (${found.name}) من السجل المعتمد بنجاح`);
    }
  };

  // Handler for adding a new school
  const handleAddSchool = () => {
    if (!newSchoolInput.trim()) return;
    addSchoolToSettings(newSchoolInput.trim());
    setSchoolName(newSchoolInput.trim());
    setNewSchoolInput('');
    setShowAddSchool(false);
  };

  // Handler for adding a new principal
  const handleAddPrincipal = () => {
    if (!newPrincipalInput.trim()) return;
    addPrincipalToSettings(newPrincipalInput.trim());
    setPrincipalName(newPrincipalInput.trim());
    setNewPrincipalInput('');
    setShowAddPrincipal(false);
  };

  // Save report
  const handleSave = (action: 'view' | 'pdf' | 'print' | 'new') => {
    const reportToSave: FieldVisitReport = {
      id: initialReport?.id || `field-visit-${Date.now()}`,
      visitKind: 'field',
      visitType: 'زيارة ميدانية',
      schoolName,
      directorateAr: settings.directorateAr || 'مديرية التربية والتعليم - قلقيلية',
      directorateEn: settings.directorateEn || 'Directorate Of Education / Qalqilya',
      principalName,
      principalIdNumber,
      qualification,
      appointmentDate,
      principalshipStartDate,
      studentsCount,
      classesCount,
      schoolLevelAndGender,
      visitDate,
      visitTime,
      criteriaState,
      adminSection,
      status: 'completed',
      createdAt: initialReport?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addOrUpdateReport(reportToSave);
    setSavedReportObj(reportToSave);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }

    if (action === 'new') {
      setIsSavedModalOpen(true);
    } else {
      onSaveSuccess(reportToSave, action);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-3 sm:px-6 space-y-6 pb-32 sm:pb-36 font-['Cairo',sans-serif]">
      {/* Top Banner */}
      <div className="bg-gradient-to-l from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 text-right">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3.5 py-1 rounded-full text-xs font-bold font-tajawal">
              <Sparkles className="w-3.5 h-3.5" />
              <span>دولة فلسطين – وزارة التربية والتعليم العالي</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-tajawal">
              {initialReport ? 'تعديل تقرير زيارة ميدانية' : 'استمارة تقرير زيارة ميدانية'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80">
              مديرية التربية والتعليم – قلقيلية | نموذج متابعة الجوانب الفنية والتعليمية والإدارية
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave('view')}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>حفظ وعرض</span>
            </button>
            <button
              onClick={() => handleSave('pdf')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-emerald-300" />
              <span>PDF</span>
            </button>
            <button
              onClick={() => handleSave('print')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>طباعة</span>
            </button>
          </div>
        </div>
      </div>

      {/* أولاً: معلومات عامة */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-5 text-right">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-base sm:text-lg font-tajawal">
            <Building2 className="w-5 h-5 text-emerald-700" />
            <h2>أولاً: معلومات عامة</h2>
          </div>
          <span className="text-xs text-slate-400 font-normal">
            مديرية قلقيلية – بيانات المدرسة والإدارة
          </span>
        </div>

        {/* إشعار النقل التلقائي للبيانات */}
        {autoFillNotice && (
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl text-xs font-bold shadow-xs transition-all">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{autoFillNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setAutoFillNotice(null)}
              className="text-emerald-700 hover:text-emerald-950 font-black text-sm px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* اسم المدرسة */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700">اسم المدرسة:</label>
              <button
                type="button"
                onClick={() => setShowAddSchool(!showAddSchool)}
                className="text-[11px] text-emerald-700 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>إضافة مدرسة</span>
              </button>
            </div>
            {showAddSchool ? (
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="اكتب اسم المدرسة الجديدة..."
                  value={newSchoolInput}
                  onChange={(e) => setNewSchoolInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-emerald-400 rounded-xl bg-emerald-50/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddSchool}
                  className="px-3 py-2 bg-emerald-700 text-white rounded-xl font-bold cursor-pointer hover:bg-emerald-800"
                >
                  إضافة
                </button>
              </div>
            ) : (
              <select
                value={schoolName}
                onChange={(e) => handleSchoolSelect(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {settings.customSchools.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* اسم مدير/ة المدرسة من القائمة المرفوعة مع إمكانية الإضافة */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700">اسم مدير/ة المدرسة:</label>
              <button
                type="button"
                onClick={() => setShowAddPrincipal(!showAddPrincipal)}
                className="text-[11px] text-emerald-700 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>إضافة اسم مدير</span>
              </button>
            </div>
            {showAddPrincipal ? (
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="اكتب اسم المدير/ة..."
                  value={newPrincipalInput}
                  onChange={(e) => setNewPrincipalInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-emerald-400 rounded-xl bg-emerald-50/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddPrincipal}
                  className="px-3 py-2 bg-emerald-700 text-white rounded-xl font-bold cursor-pointer hover:bg-emerald-800"
                >
                  إضافة
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <select
                  value={principalName}
                  onChange={(e) => handlePrincipalSelect(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {settings.customPrincipals.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* رقم الهوية */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">رقم الهوية:</label>
            <input
              type="text"
              value={principalIdNumber}
              onChange={(e) => setPrincipalIdNumber(e.target.value)}
              placeholder="مثال: 901234567"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* المؤهل العلمي */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">المؤهل العلمي:</label>
            <div className="space-y-1">
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="المؤهل العلمي"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex flex-wrap gap-1 pt-1">
                {QUALIFICATION_OPTIONS.slice(0, 4).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setQualification(opt)}
                    className={`px-2 py-0.5 text-[10px] rounded-md border transition-all cursor-pointer ${
                      qualification === opt
                        ? 'bg-emerald-700 text-white border-emerald-800 font-bold'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* تاريخ التعيين */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">تاريخ التعيين:</label>
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* تاريخ استلام إدارة المدرسة */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">تاريخ استلامه إدارة المدرسة:</label>
            <input
              type="date"
              value={principalshipStartDate}
              onChange={(e) => setPrincipalshipStartDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* عدد الطلبة */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">عدد الطلبة:</label>
            <input
              type="number"
              value={studentsCount}
              onChange={(e) => setStudentsCount(e.target.value)}
              placeholder="عدد الطلبة"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* عدد الشعب */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">عدد الشعب:</label>
            <input
              type="number"
              value={classesCount}
              onChange={(e) => setClassesCount(e.target.value)}
              placeholder="عدد الشعب"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* مستوى المدرسة وجنسها */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">مستوى المدرسة وجنسها:</label>
            <div className="space-y-1">
              <input
                type="text"
                value={schoolLevelAndGender}
                onChange={(e) => setSchoolLevelAndGender(e.target.value)}
                placeholder="أساسي / ثانوي / جنسها"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex flex-wrap gap-1 pt-1">
                {LEVEL_GENDER_OPTIONS.slice(0, 4).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSchoolLevelAndGender(opt)}
                    className={`px-2 py-0.5 text-[10px] rounded-md border transition-all cursor-pointer ${
                      schoolLevelAndGender === opt
                        ? 'bg-emerald-700 text-white border-emerald-800 font-bold'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* تاريخ الزيارة ووقتها */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">تاريخ الزيارة ووقتها:</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-2 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white"
              />
              <input
                type="time"
                value={visitTime}
                onChange={(e) => setVisitTime(e.target.value)}
                className="w-full px-2 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* بطاقة معلومات المدير الرسمية المعتمدة */}
        {matchedPrincipal ? (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-l from-emerald-50/70 via-slate-50 to-white border border-emerald-200/80 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                <span className="font-bold text-slate-900 text-xs font-tajawal">
                  سجل بيانات المدير المعتمد رسمياً لدى مديرية قلقيلية (2026/2025م):
                </span>
                <span className="text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-full">
                  {matchedPrincipal.jobStatus || 'مدير'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleResyncFromOfficial}
                className="text-[11px] text-emerald-800 font-bold hover:text-emerald-950 flex items-center gap-1 bg-emerald-100/70 hover:bg-emerald-100 px-2.5 py-1 rounded-xl transition-all cursor-pointer border border-emerald-300"
                title="إعادة ملء وتحديث كافة الحقول من السجل المعتمد"
              >
                <RefreshCw className="w-3 h-3" />
                <span>إعادة مزامنة الحقول تلقائياً</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 text-[11px] text-slate-700 pt-1">
              <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-slate-400 block text-[10px]">الاسم الكامل:</span>
                <span className="font-bold text-slate-900">{matchedPrincipal.name}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-slate-400 block text-[10px]">رقم الهوية:</span>
                <span className="font-bold text-emerald-800 tracking-wide font-mono">{matchedPrincipal.nationalId}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-slate-400 block text-[10px]">المؤهل والتخصص:</span>
                <span className="font-bold text-slate-900">{matchedPrincipal.fullQualification}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-slate-400 block text-[10px]">المدرسة المعتمدة:</span>
                <span className="font-bold text-slate-900">{matchedPrincipal.schoolName}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-slate-400 block text-[10px]">مكان السكن:</span>
                <span className="font-semibold text-slate-800">{matchedPrincipal.residence || '—'}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-slate-400 block text-[10px]">جوال المدير:</span>
                <span className="font-bold text-slate-800 dir-ltr text-right">{matchedPrincipal.mobile || '—'}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-slate-400 block text-[10px]">هاتف المدرسة:</span>
                <span className="font-semibold text-slate-800 dir-ltr text-right">{matchedPrincipal.landline || '—'}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-slate-400 block text-[10px]">تاريخ استلام المدرسة:</span>
                <span className="font-bold text-slate-900">{matchedPrincipal.currentSchoolStartDate || matchedPrincipal.adminAppointmentDate}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>عند اختيار مدرسة أو اسم مدير مسجل رسمياً، سيتم ملء رقم الهوية والمؤهل والتواريخ تلقائياً. يمكنك أيضاً تعديل الحقول يدوياً في أي وقت.</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation tabs between domains */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-200/80 p-1.5 rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveSection('teachers')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSection === 'teachers'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-slate-700 hover:bg-white/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>أ- مجال المعلمين (11)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('students')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSection === 'students'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-slate-700 hover:bg-white/60'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>ب- مجال الطلبة (4)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('communication')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSection === 'communication'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-slate-700 hover:bg-white/60'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>ثالثاً: الاتصال والتواصل (3)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('admin')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSection === 'admin'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-slate-700 hover:bg-white/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>رابعاً: الجوانب الإدارية</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('creative')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSection === 'creative'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-slate-700 hover:bg-white/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>خامساً: المجال الإبداعي</span>
        </button>
      </div>

      {/* RENDER ACTIVE SECTION */}

      {/* 1. TEACHERS DOMAIN */}
      {activeSection === 'teachers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-xs text-emerald-900">
            <span className="font-bold">
              ثانياً: الجوانب الفنية / التعليمية: أ- مجال المعلمين (المعايير من 1 إلى 11)
            </span>
            <span className="text-[11px] text-emerald-700">
              💡 اضغط على خيارات التقييم أو المؤشرات لكتابتها تلقائياً في بند الملحوظات مع إمكانية التعديل الحر.
            </span>
          </div>

          <div className="space-y-4">
            {TEACHERS_DOMAIN.criteria.map((crit) => (
              <CriterionCard
                key={crit.id}
                criterion={crit}
                state={
                  criteriaState[crit.id] || {
                    status: 'fully_achieved',
                    checkedIndicators: [],
                    notes: '',
                  }
                }
                onSetStatus={(status) => handleSetStatus(crit, status)}
                onToggleIndicator={(num, text) => handleToggleIndicator(crit, num, text)}
                onNotesChange={(newNotes) =>
                  setCriteriaState((prev) => ({
                    ...prev,
                    [crit.id]: {
                      ...(prev[crit.id] || { status: 'fully_achieved', checkedIndicators: [] }),
                      notes: newNotes,
                    },
                  }))
                }
                onAppendSuggestion={(sugg) => handleAppendSuggestion(crit.id, sugg)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. STUDENTS DOMAIN */}
      {activeSection === 'students' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-teal-50 border border-teal-200 p-3 rounded-2xl text-xs text-teal-900">
            <span className="font-bold">
              ثانياً: الجوانب الفنية / التعليمية: ب- مجال الطلبة (المعايير من 1 إلى 4)
            </span>
            <span className="text-[11px] text-teal-700">
              💡 اضغط على خيارات التقييم أو المؤشرات لكتابتها تلقائياً في بند الملحوظات.
            </span>
          </div>

          <div className="space-y-4">
            {STUDENTS_DOMAIN.criteria.map((crit) => (
              <CriterionCard
                key={crit.id}
                criterion={crit}
                state={
                  criteriaState[crit.id] || {
                    status: 'fully_achieved',
                    checkedIndicators: [],
                    notes: '',
                  }
                }
                onSetStatus={(status) => handleSetStatus(crit, status)}
                onToggleIndicator={(num, text) => handleToggleIndicator(crit, num, text)}
                onNotesChange={(newNotes) =>
                  setCriteriaState((prev) => ({
                    ...prev,
                    [crit.id]: {
                      ...(prev[crit.id] || { status: 'fully_achieved', checkedIndicators: [] }),
                      notes: newNotes,
                    },
                  }))
                }
                onAppendSuggestion={(sugg) => handleAppendSuggestion(crit.id, sugg)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 3. COMMUNICATION DOMAIN */}
      {activeSection === 'communication' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-sky-50 border border-sky-200 p-3 rounded-2xl text-xs text-sky-900">
            <span className="font-bold">
              ثالثاً: الاتصال والتواصل (المعايير من 1 إلى 3)
            </span>
            <span className="text-[11px] text-sky-700">
              💡 اضغط على خيارات التقييم أو المؤشرات لكتابتها تلقائياً في بند الملحوظات.
            </span>
          </div>

          <div className="space-y-4">
            {COMMUNICATION_DOMAIN.criteria.map((crit) => (
              <CriterionCard
                key={crit.id}
                criterion={crit}
                state={
                  criteriaState[crit.id] || {
                    status: 'fully_achieved',
                    checkedIndicators: [],
                    notes: '',
                  }
                }
                onSetStatus={(status) => handleSetStatus(crit, status)}
                onToggleIndicator={(num, text) => handleToggleIndicator(crit, num, text)}
                onNotesChange={(newNotes) =>
                  setCriteriaState((prev) => ({
                    ...prev,
                    [crit.id]: {
                      ...(prev[crit.id] || { status: 'fully_achieved', checkedIndicators: [] }),
                      notes: newNotes,
                    },
                  }))
                }
                onAppendSuggestion={(sugg) => handleAppendSuggestion(crit.id, sugg)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 4. ADMIN SECTION */}
      {activeSection === 'admin' && (
        <div className="space-y-6 text-right">
          <div className="bg-slate-100 border border-slate-200 p-3.5 rounded-2xl text-xs text-slate-800 font-bold">
            رابعاً: الجوانب الإدارية (التشكيلات المدرسية، الخطة السنوية، دوام العاملين، دوام الطلبة، والاجتماعات)
          </div>

          {/* أ- التشكيلات المدرسية */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>أ- التشكيلات المدرسية:</span>
            </h3>

            {/* 1. المراكز التطويرية والإدارية */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                .1 المراكز التطويرية والإدارية:
              </label>
              <div className="flex flex-wrap gap-1.5 pb-1">
                {ADMIN_SECTION_SUGGESTIONS.formationDevAdmin.map((sugg, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setAdminSection((prev) => ({
                        ...prev,
                        formationDevAdmin: prev.formationDevAdmin ? `${prev.formationDevAdmin} ${sugg}` : sugg,
                      }))
                    }
                    className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 rounded-lg cursor-pointer transition-all"
                  >
                    + {sugg.slice(0, 45)}...
                  </button>
                ))}
              </div>
              <textarea
                rows={2}
                value={adminSection.formationDevAdmin}
                onChange={(e) =>
                  setAdminSection((prev) => ({ ...prev, formationDevAdmin: e.target.value }))
                }
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* 2. توزيع البرنامج الدراسي */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 leading-relaxed block">
                .2 توزيع البرنامج الدراسي ومدى انسجامه مع تخصصات ومؤهلات وقدرات المعلمين والعدالة في توزيعه وفقاً لاحتياجات المدرسة:
              </label>
              <div className="flex flex-wrap gap-1.5 pb-1">
                {ADMIN_SECTION_SUGGESTIONS.curriculumScheduleBalance.map((sugg, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setAdminSection((prev) => ({
                        ...prev,
                        curriculumScheduleBalance: prev.curriculumScheduleBalance ? `${prev.curriculumScheduleBalance} ${sugg}` : sugg,
                      }))
                    }
                    className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 rounded-lg cursor-pointer transition-all"
                  >
                    + {sugg.slice(0, 45)}...
                  </button>
                ))}
              </div>
              <textarea
                rows={2}
                value={adminSection.curriculumScheduleBalance}
                onChange={(e) =>
                  setAdminSection((prev) => ({ ...prev, curriculumScheduleBalance: e.target.value }))
                }
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* ب- الخطة السنوية */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>ب- الخطة السنوية: (توفرها، ملاءمتها للأسس العلمية، إنجازات)</span>
            </h3>
            <div className="flex flex-wrap gap-1.5 pb-1">
              {ADMIN_SECTION_SUGGESTIONS.annualPlan.map((sugg, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() =>
                    setAdminSection((prev) => ({
                      ...prev,
                      annualPlan: prev.annualPlan ? `${prev.annualPlan} ${sugg}` : sugg,
                    }))
                  }
                  className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 rounded-lg cursor-pointer transition-all"
                >
                  + {sugg.slice(0, 45)}...
                </button>
              ))}
            </div>
            <textarea
              rows={2}
              value={adminSection.annualPlan}
              onChange={(e) => setAdminSection((prev) => ({ ...prev, annualPlan: e.target.value }))}
              className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* ج- متابعة دوام العاملين */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>ج- متابعة دوام العاملين:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">.1 حضور ومغادرة:</label>
                <input
                  type="text"
                  value={adminSection.staffAttendanceArrival}
                  onChange={(e) =>
                    setAdminSection((prev) => ({ ...prev, staffAttendanceArrival: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">.2 إجازات:</label>
                <input
                  type="text"
                  value={adminSection.staffLeaves}
                  onChange={(e) =>
                    setAdminSection((prev) => ({ ...prev, staffLeaves: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">.3 الالتزام بالوقت المخصص للحصص:</label>
                <input
                  type="text"
                  value={adminSection.staffClassTimeAdherence}
                  onChange={(e) =>
                    setAdminSection((prev) => ({ ...prev, staffClassTimeAdherence: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">.4 التزام المعلم بالمناوبة:</label>
                <input
                  type="text"
                  value={adminSection.staffDutyAdherence}
                  onChange={(e) =>
                    setAdminSection((prev) => ({ ...prev, staffDutyAdherence: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* د- متابعة دوام الطلبة */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>د- متابعة دوام الطلبة:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">الغياب:</label>
                <input
                  type="text"
                  value={adminSection.studentAbsence}
                  onChange={(e) =>
                    setAdminSection((prev) => ({ ...prev, studentAbsence: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">التأخر الصباحي:</label>
                <input
                  type="text"
                  value={adminSection.studentMorningLate}
                  onChange={(e) =>
                    setAdminSection((prev) => ({ ...prev, studentMorningLate: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">المغادرة:</label>
                <input
                  type="text"
                  value={adminSection.studentLeaving}
                  onChange={(e) =>
                    setAdminSection((prev) => ({ ...prev, studentLeaving: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">التسرب:</label>
                <input
                  type="text"
                  value={adminSection.studentDropout}
                  onChange={(e) =>
                    setAdminSection((prev) => ({ ...prev, studentDropout: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">الحركة:</label>
                <input
                  type="text"
                  value={adminSection.studentMovement}
                  onChange={(e) =>
                    setAdminSection((prev) => ({ ...prev, studentMovement: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">سجل حضور وغياب الطالب:</label>
                <input
                  type="text"
                  value={adminSection.studentAttendanceRecord}
                  onChange={(e) =>
                    setAdminSection((prev) => ({ ...prev, studentAttendanceRecord: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* هـ- الاجتماعات بمختلف أشكالها */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>هـ- الاجتماعات بمختلف أشكالها: (دورية، زمرية، فردية) مناسبة من حيث العدد ووضوح الأهداف والتوصيات</span>
            </h3>
            <div className="flex flex-wrap gap-1.5 pb-1">
              {ADMIN_SECTION_SUGGESTIONS.meetings.map((sugg, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() =>
                    setAdminSection((prev) => ({
                      ...prev,
                      meetings: prev.meetings ? `${prev.meetings} ${sugg}` : sugg,
                    }))
                  }
                  className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 rounded-lg cursor-pointer transition-all"
                >
                  + {sugg.slice(0, 45)}...
                </button>
              ))}
            </div>
            <textarea
              rows={2}
              value={adminSection.meetings}
              onChange={(e) => setAdminSection((prev) => ({ ...prev, meetings: e.target.value }))}
              className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* 5. CREATIVE DOMAIN */}
      {activeSection === 'creative' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-4 text-right">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-base sm:text-lg font-tajawal pb-3 border-b border-slate-100">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2>خامساً: المجال الإبداعي</h2>
          </div>
          <p className="text-xs text-slate-500">
            أ. المجال الإبداعي: المبادرات والمشاريع الريادية والأنشطة الإبداعية التي تنفذها المدرسة.
          </p>

          <div className="flex flex-wrap gap-1.5 pb-2">
            {ADMIN_SECTION_SUGGESTIONS.creativeDomain.map((sugg, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  setAdminSection((prev) => ({
                    ...prev,
                    creativeDomain: prev.creativeDomain ? `${prev.creativeDomain}\n• ${sugg}` : sugg,
                  }))
                }
                className="px-3 py-1.5 text-xs bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 rounded-xl cursor-pointer transition-all font-medium"
              >
                + {sugg}
              </button>
            ))}
          </div>

          <textarea
            rows={5}
            value={adminSection.creativeDomain}
            onChange={(e) =>
              setAdminSection((prev) => ({ ...prev, creativeDomain: e.target.value }))
            }
            placeholder="اكتب هنا تفاصيل وملاحظات المجال الإبداعي..."
            className="w-full p-3 text-xs sm:text-sm border border-slate-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      )}

      {/* Bottom Docked Action Bar (شريط سفلي منظم وثابت دون حجب شاشة التقييم) */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] py-2.5 px-3 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Status & Cancel */}
          <div className="flex items-center gap-2 min-w-0">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer shrink-0"
              >
                إلغاء
              </button>
            )}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 font-medium truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
              <span className="truncate">{schoolName ? `مدرسة: ${schoolName}` : 'زيارة ميدانية'}</span>
            </div>
          </div>

          {/* Action Buttons in single clean row */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleSave('print')}
              title="طباعة التقرير"
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1 border border-slate-200 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">طباعة</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave('pdf')}
              title="تصدير بصيغة PDF"
              className="px-3 sm:px-3.5 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 shadow-xs transition-all cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave('view')}
              className="px-4 sm:px-6 py-2 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer font-tajawal"
            >
              <Save className="w-4 h-4 text-emerald-200" />
              <span>حفظ تقرير الزيارة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal after saving */}
      {isSavedModalOpen && savedReportObj && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl border border-slate-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-tajawal">
              تم حفظ تقرير الزيارة الميدانية بنجاح!
            </h3>
            <p className="text-xs text-slate-500">
              تم توثيق تقرير زيارة مدرسة <strong>{savedReportObj.schoolName}</strong> بتاريخ{' '}
              {savedReportObj.visitDate}.
            </p>
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsSavedModalOpen(false);
                  onSaveSuccess(savedReportObj, 'view');
                }}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <BookmarkCheck className="w-4 h-4 text-emerald-200" />
                <span>عرض التقرير الرسمي</span>
              </button>
              <button
                onClick={() => {
                  setIsSavedModalOpen(false);
                  onSaveSuccess(savedReportObj, 'pdf');
                }}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <FileDown className="w-4 h-4" />
                <span>تنزيل PDF</span>
              </button>
              <button
                onClick={() => {
                  setIsSavedModalOpen(false);
                  onSaveSuccess(savedReportObj, 'print');
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border border-slate-300"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>طباعة التقرير</span>
              </button>
              <button
                onClick={() => {
                  setIsSavedModalOpen(false);
                  onSaveSuccess(savedReportObj, 'new');
                }}
                className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-300"
              >
                <Plus className="w-4 h-4 text-emerald-700" />
                <span>بدء زيارة جديدة</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component: Single Criterion Card with status pills, indicators checkbox, and notes
interface CriterionCardProps {
  criterion: FieldCriterion;
  state: FieldVisitCriterionState;
  onSetStatus: (status: FieldCriterionStatus) => void;
  onToggleIndicator: (indicatorNum: number, indicatorText: string) => void;
  onNotesChange: (notes: string) => void;
  onAppendSuggestion: (suggestion: string) => void;
}

const CriterionCard: React.FC<CriterionCardProps> = ({
  criterion,
  state,
  onSetStatus,
  onToggleIndicator,
  onNotesChange,
  onAppendSuggestion,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3.5 text-right transition-all hover:border-emerald-700/30">
      {/* Title & Number */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center shrink-0">
            {criterion.num}
          </span>
          <div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
              {criterion.title}
            </h4>
            {criterion.subtitle && (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 inline-block mt-0.5">
                {criterion.subtitle}
              </span>
            )}
          </div>
        </div>

        {/* Quick status rating buttons */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onSetStatus('fully_achieved')}
            className={`px-2.5 py-1.5 text-[11px] rounded-xl font-bold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
              state.status === 'fully_achieved'
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">محقق بالكامل</span>
          </button>

          <button
            type="button"
            onClick={() => onSetStatus('partially_achieved')}
            className={`px-2.5 py-1.5 text-[11px] rounded-xl font-bold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
              state.status === 'partially_achieved'
                ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">محقق جزئياً</span>
          </button>

          <button
            type="button"
            onClick={() => onSetStatus('needs_followup')}
            className={`px-2.5 py-1.5 text-[11px] rounded-xl font-bold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
              state.status === 'needs_followup'
                ? 'bg-rose-700 text-white border-rose-800 shadow-sm'
                : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
            }`}
          >
            <XCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">يحتاج متابعة</span>
          </button>

          <button
            type="button"
            onClick={() => onSetStatus('in_progress')}
            className={`px-2.5 py-1.5 text-[11px] rounded-xl font-bold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
              state.status === 'in_progress'
                ? 'bg-sky-700 text-white border-sky-800 shadow-sm'
                : 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100'
            }`}
          >
            <Hourglass className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">قيد المتابعة</span>
          </button>
        </div>
      </div>

      {/* Indicators list (المؤشرات) */}
      <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
        <span className="font-bold text-slate-600 block text-[11px]">
          المؤشرات (انقر على المؤشر لتوثيقه في الملحوظات):
        </span>
        <div className="space-y-1.5">
          {criterion.indicators.map((ind) => {
            const isChecked = state.checkedIndicators.includes(ind.num);
            return (
              <div
                key={ind.num}
                onClick={() => onToggleIndicator(ind.num, ind.text)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 text-right ${
                  isChecked
                    ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 font-medium shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="shrink-0 pt-0.5">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-700" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 text-[11px] leading-relaxed">
                  <span className="font-bold ml-1">.{ind.num}</span>
                  <span>{ind.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Suggested Phrasing Pills */}
      {criterion.defaultSuggestions && criterion.defaultSuggestions.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] text-slate-500 font-bold block">
            عبارات مقترحة بنقرة واحدة (تُضاف تلقائياً إلى الملحوظات):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {criterion.defaultSuggestions.map((sugg, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onAppendSuggestion(sugg)}
                className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 rounded-lg cursor-pointer transition-all text-right leading-snug"
              >
                + {sugg}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notes Textarea (بند الملحوظات) */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
          <span>بند الملحوظات (يتم الكتابة والتفريغ هنا ويظهر في التقرير الرسمي):</span>
          <span className="text-[10px] text-slate-400 font-normal">متاح للتعديل الحر في أي وقت</span>
        </label>
        <textarea
          rows={2}
          value={state.notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="اكتب أو عدل الملحوظات الخاصة بهذا المعيار..."
          className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
        />
      </div>
    </div>
  );
};
