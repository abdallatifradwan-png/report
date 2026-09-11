import React, { useState, useRef } from 'react';
import {
  FileSpreadsheet,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
  RefreshCw,
  Trash2,
  FileCheck,
  ClipboardPaste,
} from 'lucide-react';
import { parseSchoolsFromExcel, parseSchoolsFromPDF, parseSchoolsFromText } from '../utils/schoolImporter';

interface SchoolImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSchools: string[];
  onImportSchools: (newSchools: string[], mode: 'merge' | 'replace') => void;
}

export const SchoolImportModal: React.FC<SchoolImportModalProps> = ({
  isOpen,
  onClose,
  currentSchools,
  onImportSchools,
}) => {
  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedSchools, setExtractedSchools] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'excel' | 'pdf' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [pastedText, setPastedText] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    setErrorMsg(null);
    setIsProcessing(true);
    const extension = file.name.split('.').pop()?.toLowerCase();

    try {
      let results: string[] = [];
      if (['xlsx', 'xls', 'csv'].includes(extension || '')) {
        setFileType('excel');
        results = await parseSchoolsFromExcel(file);
      } else if (extension === 'pdf') {
        setFileType('pdf');
        results = await parseSchoolsFromPDF(file);
      } else {
        throw new Error('نوع الملف غير مدعوم. يرجى اختيار ملف إكسيل (.xlsx, .xls) أو ملف PDF (.pdf) أو CSV.');
      }

      if (results.length === 0) {
        throw new Error('لم يتم العثور على أسماء مدارس في الملف المرفق. يرجى التأكد من محتوى الملف.');
      }

      setFileName(file.name);
      setExtractedSchools(results);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'حدث خطأ أثناء قراءة الملف. يرجى تجربة ملف آخر.');
      setExtractedSchools([]);
      setFileName(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleTextParse = () => {
    if (!pastedText.trim()) return;
    const results = parseSchoolsFromText(pastedText);
    if (results.length === 0) {
      setErrorMsg('لم يتم التعرف على أسماء مدارس في النص المدخل.');
    } else {
      setErrorMsg(null);
      setExtractedSchools(results);
      setFileName('نص مدخل يدوياً');
      setFileType(null);
    }
  };

  const handleRemoveItem = (index: number) => {
    setExtractedSchools((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirmImport = () => {
    if (extractedSchools.length === 0) return;
    onImportSchools(extractedSchools, importMode);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setExtractedSchools([]);
    setFileName(null);
    setFileType(null);
    setErrorMsg(null);
    setPastedText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Calculate new vs duplicate counts
  const newCount = extractedSchools.filter((s) => !currentSchools.includes(s)).length;
  const duplicateCount = extractedSchools.length - newCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-900 to-rose-950 text-white p-5 flex items-center justify-between relative shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-rose-200 backdrop-blur-xs">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black font-cairo">استيراد قائمة أسماء المدارس</h2>
              <p className="text-xs text-rose-200/90 font-medium font-tajawal">
                تحميل ملف Excel أو PDF أو لصق قائمة لاستخراج وإضافة المدارس تلقائياً
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'file'
                ? 'border-rose-900 text-rose-900 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>تحميل ملف Excel أو PDF</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'text'
                ? 'border-rose-900 text-rose-900 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ClipboardPaste className="w-4 h-4 text-blue-600" />
            <span>لصق نص مباشر</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* File Upload Tab */}
          {activeTab === 'file' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv,.pdf"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFile(e.target.files[0]);
                  }
                }}
                className="hidden"
                id="school-file-upload"
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? 'border-rose-900 bg-rose-50/50 scale-[0.99]'
                    : 'border-slate-300 hover:border-rose-800 bg-slate-50/70 hover:bg-rose-50/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center shadow-xs">
                    <FileText className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="font-black text-slate-800 text-sm sm:text-base font-cairo">
                    اسحب وأفلت ملف المدارس هنا، أو اضغط للاختيار
                  </p>
                  <p className="text-xs text-slate-500 font-medium font-tajawal">
                    يدعم ملفات Excel (.xlsx, .xls)، CSV، وملفات PDF الرسمية
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-900 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-rose-950 transition-colors">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>تصفح الملفات من جهازك</span>
                </span>
              </div>
            </div>
          )}

          {/* Direct Text Tab */}
          {activeTab === 'text' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 font-cairo">
                انسخ والصق قائمة أسماء المدارس (اسم كل مدرسة في سطر منفصل):
              </label>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                rows={5}
                placeholder={`مثال:\nذكور السعدية الثانوية\nبنات الشيماء الثانوية\nذكور السلام الثانوية\nبنات كفر ثلث الثانوية`}
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:border-rose-900 outline-none leading-relaxed"
              />
              <button
                type="button"
                onClick={handleTextParse}
                disabled={!pastedText.trim()}
                className="px-4 py-2 bg-rose-900 hover:bg-rose-950 disabled:bg-slate-300 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <FileCheck className="w-4 h-4" />
                <span>معالجة واستخراج أسماء المدارس</span>
              </button>
            </div>
          )}

          {/* Loading state */}
          {isProcessing && (
            <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-center gap-3 text-rose-900 font-bold text-sm animate-pulse">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>جاري قراءة واستخراج أسماء المدارس من الملف...</span>
            </div>
          )}

          {/* Error message */}
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl flex items-start gap-3 text-rose-900 text-xs font-semibold">
              <AlertCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">تنبيه أثناء الاستيراد:</p>
                <p className="font-tajawal leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Extracted Schools Preview */}
          {extractedSchools.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm font-cairo">
                      تم استخراج {extractedSchools.length} مدرسة بنجاح
                    </h3>
                    {fileName && <p className="text-[11px] text-slate-500 font-medium">المصدر: {fileName}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg">
                    {newCount} مدرسة جديدة
                  </span>
                  {duplicateCount > 0 && (
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg">
                      {duplicateCount} موجودة مسبقاً
                    </span>
                  )}
                </div>
              </div>

              {/* Import Options (Merge vs Replace) */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                <span className="block text-xs font-bold text-slate-700 font-cairo">طريقة الإضافة إلى النظام:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
                  <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                    importMode === 'merge' ? 'border-rose-900 bg-rose-50/60 text-rose-950 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}>
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'merge'}
                      onChange={() => setImportMode('merge')}
                      className="accent-rose-900"
                    />
                    <span>دمج مع القائمة الحالية (إضافة الجديد فقط)</span>
                  </label>

                  <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                    importMode === 'replace' ? 'border-rose-900 bg-rose-50/60 text-rose-950 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}>
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="accent-rose-900"
                    />
                    <span>استبدال القائمة بالكامل بهذه المدارس</span>
                  </label>
                </div>
              </div>

              {/* Schools list box */}
              <div className="max-h-48 overflow-y-auto bg-white rounded-xl border border-slate-200 p-2 divide-y divide-slate-100 text-xs font-medium">
                {extractedSchools.map((sch, index) => {
                  const isExisting = currentSchools.includes(sch);
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between py-1.5 px-2 hover:bg-slate-50 group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 text-slate-400 text-[10px]">{index + 1}.</span>
                        <span className="font-semibold text-slate-800">{sch}</span>
                        {isExisting && (
                          <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                            موجودة مسبقاً
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="حذف من الاستيراد"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-5 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            إلغاء
          </button>

          <div className="flex items-center gap-2">
            {extractedSchools.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2 text-slate-500 hover:text-rose-700 font-bold text-xs cursor-pointer"
              >
                مسح واختيار ملف آخر
              </button>
            )}
            <button
              type="button"
              onClick={handleConfirmImport}
              disabled={extractedSchools.length === 0}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-black rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer transition-all font-cairo"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>اعتماد وحفظ القائمة ({extractedSchools.length} مدرسة)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
