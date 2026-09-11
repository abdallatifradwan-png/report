import React from 'react';

interface OfficialHeaderProps {
  directorateAr?: string;
  directorateEn?: string;
  reportTitle?: string;
  showTitle?: boolean;
  className?: string;
}

export const PalestineEmblem: React.FC<{ size?: number; className?: string }> = ({
  size = 72,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <img
        src="/logo.png"
        alt="شعار دولة فلسطين"
        width={size}
        height={size}
        className="object-contain drop-shadow-sm pointer-events-none"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          maxWidth: '100%',
        }}
        loading="eager"
        decoding="sync"
      />
    </div>
  );
};

export const OfficialHeader: React.FC<OfficialHeaderProps> = ({
  directorateAr = 'مديرية التربية والتعليم / قلقيلية',
  directorateEn = 'Directorate Of Education / Qalqilya',
  reportTitle = 'تقرير زيارة تفقدية مدرسية',
  showTitle = true,
  className = '',
}) => {
  // Extract clean directorate name for Arabic and English
  const cleanAr = directorateAr.includes('مديرية')
    ? directorateAr
    : `مديرية التربية والتعليم / ${directorateAr}`;

  const cleanEn = directorateEn.includes('Directorate')
    ? directorateEn
    : `Directorate Of Education / ${directorateEn}`;

  return (
    <header className={`w-full bg-white select-none ${className}`}>
      {/* 3-Column Official Ministry Header */}
      <div className="grid grid-cols-3 items-center justify-between gap-2 px-2 pt-2 pb-1">
        {/* Right Side: Arabic Official Hierarchy */}
        <div className="text-right flex flex-col justify-center space-y-1">
          <h2 className="text-sm md:text-base font-extrabold text-slate-900 tracking-tight font-tajawal">
            دولة فلسطين
          </h2>
          <h3 className="text-xs md:text-sm font-bold text-slate-800 font-tajawal">
            وزارة التربية والتعليم العالي
          </h3>
          <p className="text-[11px] md:text-xs font-semibold text-slate-700 leading-tight">
            {cleanAr}
          </p>
        </div>

        {/* Center: Official Coat of Arms of Palestine */}
        <div className="flex flex-col items-center justify-center">
          <PalestineEmblem size={68} />
        </div>

        {/* Left Side: English Official Hierarchy (LTR) */}
        <div className="text-left flex flex-col justify-center space-y-1" dir="ltr">
          <h2 className="text-sm md:text-base font-extrabold text-slate-900 tracking-tight font-tajawal">
            State Of Palestine
          </h2>
          <h3 className="text-[11px] md:text-xs font-bold text-slate-800 font-tajawal whitespace-nowrap">
            Ministry of Education& Higher Education
          </h3>
          <p className="text-[10px] md:text-[11px] font-semibold text-slate-700 leading-tight whitespace-nowrap">
            {cleanEn}
          </p>
        </div>
      </div>

      {/* Official Double Border Line (Thick upper, thin lower) matching official Palestinian ministerial papers */}
      <div className="w-full mt-2 mb-3">
        <div className="w-full h-[3px] bg-slate-900"></div>
        <div className="w-full h-[1px] bg-slate-900 mt-[2px]"></div>
      </div>

      {/* Official Centered Document Title */}
      {showTitle && (
        <div className="text-center my-3">
          <div className="inline-block relative">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 font-amiri px-6 py-1 tracking-wide">
              {reportTitle}
            </h1>
            <div className="w-3/4 h-[1.5px] bg-slate-800 mx-auto mt-0.5"></div>
          </div>
        </div>
      )}
    </header>
  );
};
