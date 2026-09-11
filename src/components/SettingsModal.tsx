import React, { useState } from 'react';
import { AppSettings, AnyAppReport } from '../types';
import {
  saveStoredSettings,
  getStoredReports,
  saveStoredReports,
  DEFAULT_SETTINGS,
} from '../utils/storage';
import { DEFAULT_SCHOOLS } from '../data/constants';
import { DEFAULT_PRINCIPALS } from '../data/principals';
import {
  X,
  Save,
  User,
  Award,
  Building2,
  KeyRound,
  School,
  Plus,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Check,
  ShieldCheck,
  FileSpreadsheet,
  Search,
  RotateCcw,
  Lock,
  Info,
  Users,
} from 'lucide-react';
import { SchoolImportModal } from './SchoolImportModal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsUpdated: (newSettings: AppSettings) => void;
  onReportsReloadNeeded?: () => void;
  onOpenAbout?: () => void;
  onOpenIpRights?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsUpdated,
  onReportsReloadNeeded,
  onOpenAbout,
  onOpenIpRights,
}) => {
  if (!isOpen) return null;

  const [newPassword, setNewPassword] = useState(settings.passwordHash || '112233');

  // Schools management
  const [schools, setSchools] = useState<string[]>(settings.customSchools || DEFAULT_SCHOOLS);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  // Principals management
  const [principals, setPrincipals] = useState<string[]>(
    settings.customPrincipals || DEFAULT_PRINCIPALS
  );
  const [newPrincipalName, setNewPrincipalName] = useState('');
  const [principalSearchQuery, setPrincipalSearchQuery] = useState('');

  // Active subtab for lists: 'schools' | 'principals'
  const [listTab, setListTab] = useState<'schools' | 'principals'>('schools');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddSchool = () => {
    const trimmed = newSchoolName.trim();
    if (trimmed && !schools.includes(trimmed)) {
      setSchools([trimmed, ...schools]);
      setNewSchoolName('');
    }
  };

  const handleRemoveSchool = (name: string) => {
    setSchools(schools.filter((s) => s !== name));
  };

  const handleResetToOfficialSchools = () => {
    if (window.confirm(`هل أنت متأكد من استعادة قائمة المدارس الرسمية (${DEFAULT_SCHOOLS.length} مدرسة)؟`)) {
      setSchools([...DEFAULT_SCHOOLS]);
    }
  };

  const handleImportSchools = (importedList: string[], mode: 'merge' | 'replace') => {
    if (mode === 'replace') {
      setSchools([...importedList]);
    } else {
      const merged = Array.from(new Set([...importedList, ...schools]));
      setSchools(merged);
    }
  };

  // Principal management handlers
  const handleAddPrincipal = () => {
    const trimmed = newPrincipalName.trim();
    if (trimmed && !principals.includes(trimmed)) {
      setPrincipals([trimmed, ...principals]);
      setNewPrincipalName('');
    }
  };

  const handleRemovePrincipal = (name: string) => {
    setPrincipals(principals.filter((p) => p !== name));
  };

  const handleResetToOfficialPrincipals = () => {
    if (window.confirm(`هل أنت متأكد من استعادة قائمة مدراء المدارس الرسمية (${DEFAULT_PRINCIPALS.length} مدير/ة)؟`)) {
      setPrincipals([...DEFAULT_PRINCIPALS]);
    }
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AppSettings = {
      ...settings,
      deptHeadName: 'أ. عبد اللطيف رضوان',
      jobTitle: 'رئيس قسم ضبط الأداء المدرسي',
      directorateAr: 'مديرية التربية والتعليم – قلقيلية',
      directorateEn: 'Directorate Of Education / Qalqilya',
      passwordHash: newPassword.trim() || '112233',
      customSchools: schools,
      customPrincipals: principals,
      isConfigured: true,
    };

    saveStoredSettings(updated);
    onSettingsUpdated(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  // Export Data Backup
  const handleExportBackup = () => {
    const reports = getStoredReports();
    const backupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      settings,
      reports,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_school_inspection_app_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target?.result as string);
        if (data.settings) {
          saveStoredSettings(data.settings);
          onSettingsUpdated(data.settings);
          setSchools(data.settings.customSchools || DEFAULT_SCHOOLS);
          if (data.settings.customPrincipals) {
            setPrincipals(data.settings.customPrincipals);
          }
        }
        if (data.reports && Array.isArray(data.reports)) {
          saveStoredReports(data.reports);
          if (onReportsReloadNeeded) onReportsReloadNeeded();
        }
        alert('تمت استعادة البيانات بنجاح!');
        onClose();
      } catch (err) {
        alert('حدث خطأ أثناء قراءة ملف النسخة الاحتياطية.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden text-right">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between font-tajawal">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold">إعدادات التطبيق والبيانات الرسمية</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs sm:text-sm">
          {/* Quick Access to About & IP Rights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {onOpenAbout && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAbout();
                }}
                className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-between text-slate-800 transition-all cursor-pointer text-right group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                    <Info className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <span className="font-bold text-xs block">حول التطبيق</span>
                    <span className="text-[11px] text-slate-500">اسم التطبيق، الإصدار والجهة</span>
                  </div>
                </div>
                <span className="text-xs text-rose-900 font-bold group-hover:translate-x-[-2px] transition-transform">عرض &larr;</span>
              </button>
            )}

            {onOpenIpRights && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenIpRights();
                }}
                className="p-3 bg-amber-50/60 hover:bg-amber-100/60 border border-amber-200/80 rounded-2xl flex items-center justify-between text-amber-950 transition-all cursor-pointer text-right group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-xs block">حقوق الملكية الفكرية</span>
                    <span className="text-[11px] text-amber-800">وثيقة الحماية الرسمية © 2026</span>
                  </div>
                </div>
                <span className="text-xs text-amber-900 font-bold group-hover:translate-x-[-2px] transition-transform">عرض &larr;</span>
              </button>
            )}
          </div>

          <form id="settings-form" onSubmit={handleSaveAll} className="space-y-4">
            {/* Fixed Developer and Official Authority Information as strictly mandated */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-rose-900/60 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold font-tajawal">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>بيانات صاحب الفكرة والتطوير والجهة (ثابتة ومعتمدة)</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-rose-950/80 text-rose-200 border border-rose-800 rounded-md">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>محمية رسمياً</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                  <span className="text-[11px] text-slate-300 block mb-0.5">إعداد وتطوير:</span>
                  <span className="font-bold text-sm text-white">أ. عبد اللطيف رضوان</span>
                  <span className="text-[11px] text-amber-300 block mt-0.5">رئيس قسم ضبط الأداء المدرسي</span>
                </div>

                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                  <span className="text-[11px] text-slate-300 block mb-0.5">الجهة الرسمية:</span>
                  <span className="font-bold text-sm text-white">قسم ضبط الأداء المدرسي</span>
                  <span className="text-[11px] text-emerald-300 block mt-0.5">مديرية التربية والتعليم – قلقيلية</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 font-mono text-center pt-1 border-t border-white/10">
                © 2026 – جميع الحقوق محفوظة | Version 1.0.0
              </p>
            </div>

            {/* Password security */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-rose-900" />
                <span>تغيير كلمة المرور</span>
              </h3>
              <div className="max-w-xs">
                <label className="block font-semibold text-slate-700 mb-1">كلمة المرور الجديدة:</label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:border-rose-900 outline-none"
                  placeholder="كلمة المرور"
                  required
                />
              </div>
            </div>

            {/* Tabbed School & Principal Lists Management */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setListTab('schools')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      listTab === 'schools'
                        ? 'bg-rose-900 text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <School className="w-3.5 h-3.5" />
                    <span>إدارة المدارس ({schools.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setListTab('principals')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      listTab === 'principals'
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>إدارة مدراء المدارس ({principals.length})</span>
                  </button>
                </div>
              </div>

              {listTab === 'schools' ? (
                /* Tab 1: Schools Management */
                <div className="space-y-3 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-slate-600 font-medium">
                      تعديل وإضافة المدارس المتاحة في القوائم المنسدلة للزيارات
                    </span>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setShowImportModal(true)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                        <span>استيراد Excel / PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleResetToOfficialSchools}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        title="استعادة قائمة المدارس الرسمية"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                        <span>استعادة المدارس الأصلية ({DEFAULT_SCHOOLS.length})</span>
                      </button>
                    </div>
                  </div>

                  {/* Add School Field */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSchoolName}
                      onChange={(e) => setNewSchoolName(e.target.value)}
                      placeholder="أدخل اسم مدرسة جديدة لإضافتها..."
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs md:text-sm font-semibold text-slate-900 focus:border-rose-900 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddSchool}
                      className="px-4 py-2 bg-rose-900 hover:bg-rose-950 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة مدرسة</span>
                    </button>
                  </div>

                  {/* Search filter for schools */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={schoolSearchQuery}
                      onChange={(e) => setSchoolSearchQuery(e.target.value)}
                      placeholder="بحث سريع في قائمة المدارس..."
                      className="w-full bg-white border border-slate-200 rounded-xl pr-8 pl-3 py-1.5 text-xs text-slate-800 focus:border-rose-900 outline-none"
                    />
                  </div>

                  {/* Scrollable list of schools */}
                  <div className="max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl p-2 divide-y divide-slate-100">
                    {schools
                      .filter((s) => s.toLowerCase().includes(schoolSearchQuery.toLowerCase()))
                      .map((sch, i) => (
                        <div key={i} className="py-1.5 px-2 flex items-center justify-between text-xs hover:bg-slate-50 group">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 w-6">{i + 1}.</span>
                            <span className="font-semibold text-slate-800">{sch}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSchool(sch)}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                            title="حذف من القائمة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    {schools.filter((s) => s.toLowerCase().includes(schoolSearchQuery.toLowerCase())).length === 0 && (
                      <div className="py-4 text-center text-xs text-slate-400">
                        لا توجد مدارس مطابقة للبحث
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Tab 2: Principals Management */
                <div className="space-y-3 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-slate-600 font-medium">
                      تعديل وإضافة مدراء ومديرات المدارس المعتمدين في القوائم المنسدلة
                    </span>

                    <button
                      type="button"
                      onClick={handleResetToOfficialPrincipals}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors"
                      title="استعادة قائمة المدراء الرسمية"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                      <span>استعادة قائمة المدراء الأصلية ({DEFAULT_PRINCIPALS.length})</span>
                    </button>
                  </div>

                  {/* Add Principal Field */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPrincipalName}
                      onChange={(e) => setNewPrincipalName(e.target.value)}
                      placeholder="أدخل اسم مدير / مديرة مدرسة لإضافته..."
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs md:text-sm font-semibold text-slate-900 focus:border-emerald-800 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddPrincipal}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة مدير/ة</span>
                    </button>
                  </div>

                  {/* Search filter for principals */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={principalSearchQuery}
                      onChange={(e) => setPrincipalSearchQuery(e.target.value)}
                      placeholder="بحث سريع في قائمة مدراء المدارس..."
                      className="w-full bg-white border border-slate-200 rounded-xl pr-8 pl-3 py-1.5 text-xs text-slate-800 focus:border-emerald-800 outline-none"
                    />
                  </div>

                  {/* Scrollable list of principals */}
                  <div className="max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl p-2 divide-y divide-slate-100">
                    {principals
                      .filter((p) => p.toLowerCase().includes(principalSearchQuery.toLowerCase()))
                      .map((prin, i) => (
                        <div key={i} className="py-1.5 px-2 flex items-center justify-between text-xs hover:bg-slate-50 group">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 w-6">{i + 1}.</span>
                            <span className="font-semibold text-slate-800">{prin}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemovePrincipal(prin)}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                            title="حذف من القائمة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    {principals.filter((p) => p.toLowerCase().includes(principalSearchQuery.toLowerCase())).length === 0 && (
                      <div className="py-4 text-center text-xs text-slate-400">
                        لا يوجد مدراء مطابقين للبحث
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Backup & Restore */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Download className="w-4 h-4 text-slate-700" />
                <span>النسخ الاحتياطي واستعادة البيانات</span>
              </h3>
              <p className="text-xs text-slate-500">
                يمكنك تحميل نسخة احتياطية من جميع التقارير والإعدادات، أو استعادتها على جهاز آخر.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-300 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-600" />
                  <span>تصدير نسخة احتياطية (JSON)</span>
                </button>

                <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-300 cursor-pointer">
                  <Upload className="w-4 h-4 text-slate-600" />
                  <span>استيراد نسخة احتياطية</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs md:text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer"
          >
            إغلاق
          </button>

          <button
            type="submit"
            form="settings-form"
            className="px-6 py-2.5 bg-rose-900 hover:bg-rose-950 text-white font-bold text-xs md:text-sm rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>تم حفظ الإعدادات!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-amber-400" />
                <span>حفظ التعديلات</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* School Import Modal */}
      <SchoolImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        currentSchools={schools}
        onImportSchools={handleImportSchools}
      />
    </div>
  );
};
