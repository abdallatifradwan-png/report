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

export type EvaluationRating = 'good' | 'needs_followup' | 'needs_action';

export type GeneralImpression = 'excellent' | 'very_good' | 'good' | 'needs_followup' | 'needs_action';

export interface EvaluationItem {
  id: string;
  label: string;
  description?: string;
}

export interface EvaluationDomain {
  id: string;
  title: string;
  iconName: string;
  items: EvaluationItem[];
}

// Existing Inspection Report (الزيارة التفقدية)
export interface InspectionReport {
  id: string;
  visitKind?: 'inspection';
  schoolName: string;
  directorateAr: string;
  directorateEn: string;
  visitDate: string; // YYYY-MM-DD
  visitTime: string; // HH:MM
  visitType: string; // "زيارة تفقدية"
  deptHeadName: string; // "أ. عبد اللطيف رضوان"
  jobTitle: string; // "رئيس قسم ضبط الأداء المدرسي"
  evaluations: Record<string, EvaluationRating>;
  generalImpression: GeneralImpression;
  positives: string;
  needs: string;
  recommendations: string;
  agreements: string;
  status: 'completed' | 'draft';
  createdAt: string;
  updatedAt: string;
}

// New Field Visit Criterion State (حالة المعيار في الزيارة الميدانية)
export type FieldCriterionStatus = 'fully_achieved' | 'partially_achieved' | 'needs_followup' | 'in_progress' | 'unrated';

export interface FieldVisitCriterionState {
  status: FieldCriterionStatus;
  checkedIndicators: number[]; // Numbers of checked indicators, e.g. [1, 2]
  notes: string; // The notes written or filled automatically from selections & editable by supervisor
}

// New Field Visit Administrative & Creative Sections (الجوانب الإدارية والمجال الإبداعي)
export interface FieldVisitAdminSection {
  formationDevAdmin: string; // المراكز التطويرية والإدارية
  curriculumScheduleBalance: string; // توزيع البرنامج الدراسي ومدى انسجامه
  annualPlan: string; // الخطة السنوية
  staffAttendanceArrival: string; // دوام العاملين - حضور ومغادرة
  staffLeaves: string; // دوام العاملين - إجازات
  staffClassTimeAdherence: string; // دوام العاملين - الالتزام بالوقت المخصص للحصص
  staffDutyAdherence: string; // دوام العاملين - التزام المعلم بالمناوبة
  studentAbsence: string; // دوام الطلبة - الغياب
  studentMorningLate: string; // دوام الطلبة - التأخر الصباحي
  studentLeaving: string; // دوام الطلبة - المغادرة
  studentDropout: string; // دوام الطلبة - التسرب
  studentMovement: string; // دوام الطلبة - الحركة
  studentAttendanceRecord: string; // دوام الطلبة - سجل حضور وغياب الطالب
  meetings: string; // الاجتماعات بمختلف أشكالها
  creativeDomain: string; // خامساً: المجال الإبداعي
}

// New Field Visit Report (الزيارة الميدانية)
export interface FieldVisitReport {
  id: string;
  visitKind: 'field';
  visitType: 'زيارة ميدانية';
  
  // أولاً: معلومات عامة
  schoolName: string;
  directorateAr: string;
  directorateEn: string;
  principalName: string;
  principalIdNumber: string;
  qualification: string;
  appointmentDate: string;
  principalshipStartDate: string;
  studentsCount: string | number;
  classesCount: string | number;
  schoolLevelAndGender: string;
  visitDate: string;
  visitTime: string;

  // ثانياً وثالثاً: الجوانب الفنية والتعليمية والاتصال والتواصل
  criteriaState: Record<string, FieldVisitCriterionState>;

  // رابعاً وخامساً: الجوانب الإدارية والمجال الإبداعي
  adminSection: FieldVisitAdminSection;

  status: 'completed' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export type AnyAppReport = InspectionReport | FieldVisitReport;

export interface AppSettings {
  deptHeadName: string;
  jobTitle: string;
  directorateAr: string;
  directorateEn: string;
  passwordHash: string; // Stored password
  customSchools: string[];
  customPrincipals: string[]; // Custom Principals list added
  isConfigured: boolean;
  themeColor?: string;
}

export type ActiveTab =
  | 'home'
  | 'new_inspection'
  | 'new_field'
  | 'new_report' // Backward compatible alias
  | 'reports_list'
  | 'view_report'
  | 'edit_report'
  | 'view_field'
  | 'edit_field'
  | 'settings'
  | 'about'
  | 'ip_rights';

