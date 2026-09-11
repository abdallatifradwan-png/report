import React from 'react';
import { ActiveTab, AppSettings } from '../types';
import { PalestineEmblem } from './OfficialHeader';
import {
  Home,
  FilePlus,
  Files,
  Settings,
  Info,
  LogOut,
  Building2,
  User,
  ShieldCheck,
  Compass,
  ClipboardCheck,
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  settings: AppSettings;
  onLogout: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  settings,
  onLogout,
  onOpenSettings,
  onOpenAbout,
}) => {
  return (
    <header className="no-print sticky top-0 z-30 bg-slate-900 text-white shadow-md border-b-2 border-rose-900 font-['Cairo',sans-serif]">
      {/* Top micro-bar with Palestine flag colors */}
      <div className="w-full h-1 bg-gradient-to-r from-black via-white to-emerald-600"></div>

      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Emblem */}
          <div
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="bg-white/10 p-1.5 rounded-xl border border-white/15 group-hover:bg-white/20 transition-all">
              <PalestineEmblem size={36} />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base md:text-lg font-black text-white font-tajawal tracking-tight">
                  تطبيق الزيارات الميدانية والتفقدية
                </span>
                <span className="hidden lg:inline-block px-2 py-0.5 bg-rose-950/80 text-amber-300 text-[10px] font-bold rounded-md border border-rose-800">
                  ضبط الأداء المدرسي
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-300 flex items-center gap-1.5">
                <span className="font-bold text-amber-300">أ. عبد اللطيف رضوان</span>
                <span className="text-slate-500">•</span>
                <span className="truncate max-w-[140px] sm:max-w-none">{settings.directorateAr}</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => onSelectTab('home')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Home className="w-4 h-4 text-amber-400" />
              <span>الرئيسية</span>
            </button>

            {/* Field Visit Button */}
            <button
              onClick={() => onSelectTab('new_field')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'new_field'
                  ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-400/40'
                  : 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-200 border border-emerald-700/50'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-300" />
              <span>+ زيارة ميدانية</span>
            </button>

            {/* Inspection Visit Button */}
            <button
              onClick={() => onSelectTab('new_inspection')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'new_inspection' || activeTab === 'new_report'
                  ? 'bg-rose-900 text-white shadow-sm ring-2 ring-rose-400/40'
                  : 'bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 border border-rose-800/50'
              }`}
            >
              <ClipboardCheck className="w-4 h-4 text-rose-300" />
              <span>+ زيارة تفقدية</span>
            </button>

            <button
              onClick={() => onSelectTab('reports_list')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'reports_list'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Files className="w-4 h-4 text-amber-400" />
              <span>التقارير السابقة</span>
            </button>
          </nav>

          {/* User Controls & Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
              title="الإعدادات"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAbout}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
              title="معلومات التطبيق"
            >
              <Info className="w-4 h-4" />
            </button>

            <div className="h-6 w-px bg-slate-700 mx-1"></div>

            <button
              onClick={onLogout}
              className="px-3 py-1.5 text-xs font-bold text-rose-300 hover:text-white hover:bg-rose-950/80 rounded-xl border border-rose-900/50 flex items-center gap-1 transition-all cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom-like Sub-nav */}
      <div className="md:hidden flex items-center justify-around bg-slate-950 px-2 py-1.5 border-t border-slate-800 text-xs">
        <button
          onClick={() => onSelectTab('home')}
          className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 font-bold ${
            activeTab === 'home' ? 'text-amber-400 bg-white/10' : 'text-slate-400'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>الرئيسية</span>
        </button>

        <button
          onClick={() => onSelectTab('new_field')}
          className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 font-bold ${
            activeTab === 'new_field' ? 'text-emerald-400 bg-emerald-950' : 'text-emerald-300/80'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>ميدانية</span>
        </button>

        <button
          onClick={() => onSelectTab('new_inspection')}
          className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 font-bold ${
            activeTab === 'new_inspection' || activeTab === 'new_report' ? 'text-rose-400 bg-rose-950' : 'text-rose-300/80'
          }`}
        >
          <ClipboardCheck className="w-3.5 h-3.5" />
          <span>تفقدية</span>
        </button>

        <button
          onClick={() => onSelectTab('reports_list')}
          className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 font-bold ${
            activeTab === 'reports_list' ? 'text-amber-400 bg-white/10' : 'text-slate-400'
          }`}
        >
          <Files className="w-3.5 h-3.5" />
          <span>التقارير</span>
        </button>
      </div>
    </header>
  );
};
