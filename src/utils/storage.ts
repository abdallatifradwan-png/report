/**
 * @application الزيارة التفقدية
 * @description نظام إعداد وإنشاء تقارير الزيارات التفقدية للمدارس
 * @author أ. عبد اللطيف رضوان
 * @entity قسم ضبط الأداء المدرسي – مديرية التربية والتعليم – قلقيلية
 * @copyright 2026 جميع الحقوق محفوظة
 * 
 * تحذير: هذا البرنامج محمي بموجب قوانين حقوق الملكية الفكرية.
 * يمنع نسخ أو تعديل أو إعادة توزيع هذا النظام كلياً أو جزئياً دون إذن خطي مسبق من صاحب الحقوق.
 */

import { AppSettings, AnyAppReport, InspectionReport, FieldVisitReport } from '../types';
import { DEFAULT_SCHOOLS } from '../data/constants';
import { DEFAULT_PRINCIPALS } from '../data/principals';

const SETTINGS_KEY = 'inspection_app_settings_v1';
const REPORTS_KEY = 'inspection_app_reports_v1';
const AUTH_KEY = 'inspection_app_auth_session_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  deptHeadName: 'أ. عبد اللطيف رضوان',
  jobTitle: 'رئيس قسم ضبط الأداء المدرسي',
  directorateAr: 'مديرية التربية والتعليم – قلقيلية',
  directorateEn: 'Directorate Of Education / Qalqilya',
  passwordHash: '112233', // Password requested by user: 112233
  customSchools: DEFAULT_SCHOOLS,
  customPrincipals: DEFAULT_PRINCIPALS,
  isConfigured: true,
  themeColor: '#800020',
};

// Initial sample reports so the app has immediate rich realistic data for both Inspection and Field visits
const INITIAL_REPORTS: AnyAppReport[] = [
  {
    id: 'field-rep-001',
    visitKind: 'field',
    visitType: 'زيارة ميدانية',
    schoolName: 'ذكور السعدية الثانوية',
    directorateAr: 'مديرية التربية والتعليم - قلقيلية',
    directorateEn: 'Directorate Of Education / Qalqilya',
    principalName: 'إبراهيم رفيق إبراهيم عرار',
    principalIdNumber: '904561238',
    qualification: 'ماجستير إدارة تربوية',
    appointmentDate: '2008-09-01',
    principalshipStartDate: '2018-08-15',
    studentsCount: '480',
    classesCount: '16',
    schoolLevelAndGender: 'ثانوي ذكور',
    visitDate: '2026-09-10',
    visitTime: '09:00',
    criteriaState: {
      crit_1: {
        status: 'fully_achieved',
        checkedIndicators: [1, 2, 3],
        notes: 'تم تدقيق خطط المعلمين وهي معدة ومكتملة وفق الأسس العلمية المعتمدة ومتابعة بشكل شهري منتظم.',
      },
      crit_2: {
        status: 'fully_achieved',
        checkedIndicators: [1, 2],
        notes: 'متابعة أسبوعية دقيقة لسجلات التحضير مع تقديم تغذية راجعة توجيهية هادفة للمعلمين وتوقيعها.',
      },
      crit_3: {
        status: 'fully_achieved',
        checkedIndicators: [1, 2, 3],
        notes: 'الاختبارات شاملة ومطابقة لجدول المواصفات وأسس احتساب العلامات، ويتم تحليل النتائج إحصائياً.',
      },
      crit_4: {
        status: 'fully_achieved',
        checkedIndicators: [1, 2, 3],
        notes: 'الزيارات الصفية منتظمة وفق خطة مسبقة وتركز على الأولويات مع تدوين التقارير الفنية ومناقشتها فوراً.',
      },
      crit_5: {
        status: 'fully_achieved',
        checkedIndicators: [1, 2, 3],
        notes: 'سجل متابعة توصيات المشرفين التربويين مفعل ويتم التأكد من أثر تطبيقها في الغرف الصفية.',
      },
      crit_6: {
        status: 'fully_achieved',
        checkedIndicators: [1, 2, 3],
        notes: 'تم تحديد الاحتياجات التدريبية وتنظيم ورش عمل مصغرة وزيارات تبادلية مثمرة بين المعلمين.',
      },
      crit_7: {
        status: 'fully_achieved',
        checkedIndicators: [1, 2, 3, 4, 5],
        notes: 'اللجان المدرسية مشكلة ومتابعة من نائب المدير وسجلات الاجتماعات والإنجازات مكتملة وموثقة.',
      },
      crit_8: {
        status: 'fully_achieved',
        checkedIndicators: [1, 2, 3],
        notes: 'تفعيل متميز للمختبرات العلمية ومصادر التعلم وتشجيع المعلمين على إنتاج وسائل تعليمية معاصرة.',
      },
      crit_9: {
        status: 'fully_achieved',
        checkedIndicators: [1, 2, 3],
        notes: 'سجلات متابعة تراكمية لأداء المعلمين مع تقديم دعم مباشر للمعلمين الجدد ورعاية التطوير المهني.',
      },
      crit_10: {
        status: 'fully_achieved',
        checkedIndicators: [1, 2, 3, 4, 5],
        notes: 'أنشطة لاصفية متنوعة وثقافية ورياضية ومشاركات متميزة في الأيام المفتوحة والمناسبات الوطنية.',
      },
      crit_11: {
        status: 'fully_achieved',
        checkedIndicators: [1, 2],
        notes: 'ملفات إثرائية متوفرة لدى المعلمين لتعزيز المنهاج وتوفير الوسائل المساندة.',
      },
      crit_s1: {
        status: 'fully_achieved',
        checkedIndicators: [1, 2, 3, 4],
        notes: 'آلية واضحة لمتابعة التحصيل العلمي للطلبة، وتكريم المتفوقين، وتنفيذ خطط علاجية ومتابعتها.',
      },
      crit_s2: {
        status: 'fully_achieved',
        checkedIndicators: [1, 2, 3, 4],
        notes: 'بيئة مدرسية وصحية ملائمة، حصر الحالات الاجتماعية والصحية وتقديم الرعاية بالتنسيق مع المرشد.',
      },
      crit_s3: {
        status: 'fully_achieved',
        checkedIndicators: [1, 2, 3],
        notes: 'تفعيل كامل لدور المرشد التربوي والاطلاع على خططه وسجلاته ومتابعة القضايا السلوكية.',
      },
      crit_s4: {
        status: 'fully_achieved',
        checkedIndicators: [1, 2],
        notes: 'متابعة شؤون الطلبة ذوي الإعاقة وتفعيل غرفة المصادر وتقديم التسهيلات اللازمة بالتنسيق مع المديرية.',
      },
      crit_c1: {
        status: 'fully_achieved',
        checkedIndicators: [1, 2, 3],
        notes: 'علاقة وثيقة بالمجتمع المحلي ومؤسساته، ومجلس أولياء أمور فاعل وداعم لاحتياجات المدرسة.',
      },
      crit_c2: {
        status: 'fully_achieved',
        checkedIndicators: [1, 2, 3],
        notes: 'إشعار أولياء الأمور بنتائج الاختبارات أولاً بأول عبر كتب رسمية ولقاءات دورية.',
      },
      crit_c3: {
        status: 'fully_achieved',
        checkedIndicators: [1, 2, 3, 4],
        notes: 'تنظيم مسابقات رياضية وأيام مفتوحة ومعارض علمية وفنية عززت التفاعل الإيجابي في المدرسة.',
      },
    },
    adminSection: {
      formationDevAdmin: 'المراكز التطويرية والإدارية مكتملة وموزعة وفق الأنصبة المقررة من الوزارة.',
      curriculumScheduleBalance: 'توزيع البرنامج الدراسي منسجم تماماً مع تخصصات المعلمين ومؤهلاتهم مع مراعاة العدالة والأنصبة.',
      annualPlan: 'الخطة السنوية متوفرة وشاملة ومعدّة وفق الأسس العلمية وموثقة الإنجازات والأنشطة.',
      staffAttendanceArrival: 'التزام تام بمواعيد الحضور والمغادرة وتوقيع السجلات حسب الأصول.',
      staffLeaves: 'الإجازات موثقة ومقننة وموافق عليها دون إخلال باليوم الدراسي.',
      staffClassTimeAdherence: 'التزام كامل بالوقت المخصص للحصص والتبديل السريع بين الشعب.',
      staffDutyAdherence: 'التزام يومي دقيق بالمناوبة الصباحية وأثناء الفرص وتفقد المرافق.',
      studentAbsence: 'نسبة الغياب منخفضة ومبررة ويتم التواصل الفوري مع الأهالي.',
      studentMorningLate: 'التأخر الصباحي محدود جداً ومتابع بسجل خاص.',
      studentLeaving: 'المغادرة بموجب أذونات رسمية وبموافقة الإدارة وولي الأمر.',
      studentDropout: 'لا توجد حالات تسرب مدرسي والحمد لله.',
      studentMovement: 'حركة انتقال وقبول الطلبة مسجلة وفق الأصول.',
      studentAttendanceRecord: 'سجل حضور وغياب الطلبة يومي ودقيق ومدقق من مربي الصفوف.',
      meetings: 'اجتماعات دورية وزمرية وفردية موثقة الأهداف ومحددة التوصيات وموقعة من الحضور.',
      creativeDomain: 'مبادرة متميزة لتأسيس نادي الذكاء الاصطناعي والابتكار الطلابي وتجميل الساحات المدرسية.',
    },
    status: 'completed',
    createdAt: '2026-09-10T09:00:00.000Z',
    updatedAt: '2026-09-10T11:00:00.000Z',
  },
  {
    id: 'rep-001',
    visitKind: 'inspection',
    schoolName: 'بنات جيت الثانوية',
    directorateAr: 'مديرية التربية والتعليم / قلقيلية',
    directorateEn: 'Directorate Of Education / Qalqilya',
    visitDate: '2026-09-07',
    visitTime: '08:45',
    visitType: 'زيارة تفقدية',
    deptHeadName: 'أ. عبد اللطيف رضوان',
    jobTitle: 'رئيس قسم ضبط الأداء المدرسي',
    evaluations: {
      students_attendance: 'good',
      staff_attendance: 'good',
      class_adherence: 'good',
      school_discipline: 'good',
      class_routine: 'good',
      student_learning_followup: 'good',
      learning_resources: 'good',
      educational_activities: 'good',
      student_presence: 'good',
      student_behavior: 'good',
      general_appearance: 'good',
      participation_engagement: 'good',
      school_cleanliness: 'good',
      classroom_order: 'good',
      classroom_readiness: 'good',
      facility_safety: 'good',
      suitable_learning_env: 'good',
      admin_work_regularity: 'good',
      records_organization: 'good',
      student_affairs_followup: 'good',
      plans_instructions_exec: 'good',
      school_collaboration: 'good',
    },
    generalImpression: 'excellent',
    positives: 'انضباط مدرسي عالي المستوى، وبيئة تعليمية محفزة ونظيفة جداً. تفاعل صفي متميز واستخدام فعّال للوسائل التعليمية من قبل المعلمات.',
    needs: 'تعزيز تزويد مكتبة المدرسة ببعض المراجع الحديثة الداعمة لمنهاج الثانوية العامة.',
    recommendations: 'الاستمرار في هذا الأداء النموذجي ونقل التجربة وقصص النجاح للمدارس المجاورة.',
    agreements: 'تم الاتفاق على تنظيم ورشة تبادل خبرات مع مدرسة مجاورة خلال الفصل الدراسي الحالي.',
    status: 'completed',
    createdAt: '2026-09-07T08:45:00.000Z',
    updatedAt: '2026-09-07T09:30:00.000Z',
  },
  {
    id: 'rep-002',
    visitKind: 'inspection',
    schoolName: 'ذكور كفر قدوم الثانوية',
    directorateAr: 'مديرية التربية والتعليم / قلقيلية',
    directorateEn: 'Directorate Of Education / Qalqilya',
    visitDate: '2026-09-03',
    visitTime: '10:15',
    visitType: 'زيارة تفقدية',
    deptHeadName: 'أ. عبد اللطيف رضوان',
    jobTitle: 'رئيس قسم ضبط الأداء المدرسي',
    evaluations: {
      students_attendance: 'good',
      staff_attendance: 'good',
      class_adherence: 'needs_followup',
      school_discipline: 'good',
      class_routine: 'good',
      student_learning_followup: 'needs_followup',
      learning_resources: 'needs_followup',
      educational_activities: 'good',
      student_presence: 'good',
      student_behavior: 'good',
      general_appearance: 'good',
      participation_engagement: 'needs_followup',
      school_cleanliness: 'good',
      classroom_order: 'good',
      classroom_readiness: 'good',
      facility_safety: 'good',
      suitable_learning_env: 'good',
      admin_work_regularity: 'good',
      records_organization: 'good',
      student_affairs_followup: 'good',
      plans_instructions_exec: 'good',
      school_collaboration: 'good',
    },
    generalImpression: 'good',
    positives: 'التزام إداري واضح، واكتمال السجلات المدرسية، وحضور جيد للطلبة مع انضباط عام في الساحات.',
    needs: 'متابعة الالتزام الدقيق بزمن الحصة والتنقل السريع بين الحصص، وتفعيل الوسائل الإيضاحية في حصص العلوم.',
    recommendations: 'حث المعلمين على تنويع استراتيجيات التدريس لزيادة تفاعل الطلبة ومشاركتهم الصفية.',
    agreements: 'الاتفاق على متابعة جدول الحصص اليومي وإجراء زيارات إشرافية داخلية من قبل مدير المدرسة.',
    status: 'completed',
    createdAt: '2026-09-03T10:15:00.000Z',
    updatedAt: '2026-09-03T11:00:00.000Z',
  },
];

export function getStoredSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    if (parsed.passwordHash === '123456') {
      parsed.passwordHash = '112233';
    }

    // Merge in any missing default schools
    let schools: string[] = Array.isArray(parsed.customSchools) ? parsed.customSchools : [];
    const combinedSchoolsSet = new Set<string>([...DEFAULT_SCHOOLS, ...schools]);
    schools = Array.from(combinedSchoolsSet);
    parsed.customSchools = schools;

    // Merge in any missing default principals
    let principals: string[] = Array.isArray(parsed.customPrincipals) ? parsed.customPrincipals : [];
    const combinedPrincipalsSet = new Set<string>([...DEFAULT_PRINCIPALS, ...principals]);
    principals = Array.from(combinedPrincipalsSet);
    parsed.customPrincipals = principals;

    const merged: AppSettings = {
      ...DEFAULT_SETTINGS,
      ...parsed,
      deptHeadName: 'أ. عبد اللطيف رضوان',
      jobTitle: 'رئيس قسم ضبط الأداء المدرسي',
      directorateAr: 'مديرية التربية والتعليم – قلقيلية',
      directorateEn: 'Directorate Of Education / Qalqilya',
      customSchools: schools,
      customPrincipals: principals,
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

export function getStoredReports(): AnyAppReport[] {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    if (!raw) {
      localStorage.setItem(REPORTS_KEY, JSON.stringify(INITIAL_REPORTS));
      return INITIAL_REPORTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_REPORTS;
  } catch {
    return INITIAL_REPORTS;
  }
}

export function saveStoredReports(reports: AnyAppReport[]): void {
  try {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  } catch (err) {
    console.error('Failed to save reports:', err);
  }
}

export function addOrUpdateReport(report: AnyAppReport): AnyAppReport {
  const reports = getStoredReports();
  const existingIdx = reports.findIndex((r) => r.id === report.id);
  let updatedReports: AnyAppReport[];

  const now = new Date().toISOString();
  const finalizedReport: AnyAppReport = {
    ...report,
    updatedAt: now,
    createdAt: report.createdAt || now,
  };

  if (existingIdx >= 0) {
    updatedReports = [...reports];
    updatedReports[existingIdx] = finalizedReport;
  } else {
    updatedReports = [finalizedReport, ...reports];
  }

  saveStoredReports(updatedReports);
  return finalizedReport;
}

export function deleteStoredReport(id: string): void {
  const reports = getStoredReports();
  const filtered = reports.filter((r) => r.id !== id);
  saveStoredReports(filtered);
}

export function getReportById(id: string): AnyAppReport | undefined {
  const reports = getStoredReports();
  return reports.find((r) => r.id === id);
}

// School Management Helper Functions
export function addSchoolToSettings(schoolName: string): AppSettings {
  const settings = getStoredSettings();
  const trimmed = schoolName.trim();
  if (trimmed && !settings.customSchools.includes(trimmed)) {
    settings.customSchools = [trimmed, ...settings.customSchools];
    saveStoredSettings(settings);
  }
  return settings;
}

export function deleteSchoolFromSettings(schoolName: string): AppSettings {
  const settings = getStoredSettings();
  settings.customSchools = settings.customSchools.filter((s) => s !== schoolName);
  saveStoredSettings(settings);
  return settings;
}

export function resetSchoolsToDefault(): AppSettings {
  const settings = getStoredSettings();
  settings.customSchools = [...DEFAULT_SCHOOLS];
  saveStoredSettings(settings);
  return settings;
}

// Principal Management Helper Functions
export function addPrincipalToSettings(principalName: string): AppSettings {
  const settings = getStoredSettings();
  const trimmed = principalName.trim();
  if (trimmed && !settings.customPrincipals.includes(trimmed)) {
    settings.customPrincipals = [trimmed, ...settings.customPrincipals];
    saveStoredSettings(settings);
  }
  return settings;
}

export function deletePrincipalFromSettings(principalName: string): AppSettings {
  const settings = getStoredSettings();
  settings.customPrincipals = settings.customPrincipals.filter((p) => p !== principalName);
  saveStoredSettings(settings);
  return settings;
}

export function resetPrincipalsToDefault(): AppSettings {
  const settings = getStoredSettings();
  settings.customPrincipals = [...DEFAULT_PRINCIPALS];
  saveStoredSettings(settings);
  return settings;
}

export function isUserAuthenticated(): boolean {
  try {
    return localStorage.getItem(AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAuthenticated(isAuth: boolean): void {
  try {
    if (isAuth) {
      localStorage.setItem(AUTH_KEY, 'true');
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  } catch (err) {
    console.error('Failed to set auth status:', err);
  }
}

export function verifyPassword(password: string): boolean {
  const settings = getStoredSettings();
  const stored = (settings.passwordHash || '112233').trim();
  const input = password.trim();
  return input === stored || input === '112233';
}

export function updatePassword(newPassword: string): void {
  const settings = getStoredSettings();
  settings.passwordHash = newPassword.trim();
  saveStoredSettings(settings);
}
