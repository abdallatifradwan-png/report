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

import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  AppSettings,
  InspectionReport,
  FieldVisitReport,
  AnyAppReport,
} from './types';
import {
  getStoredSettings,
  getStoredReports,
  isUserAuthenticated,
  setAuthenticated,
} from './utils/storage';
import { LoginScreen } from './components/LoginScreen';
import { InitialSetupModal } from './components/InitialSetupModal';
import { Navbar } from './components/Navbar';
import { AppFooter } from './components/AppFooter';
import { DashboardHome } from './components/DashboardHome';
import { ReportForm } from './components/ReportForm';
import { ReportsList } from './components/ReportsList';
import { OfficialReportView } from './components/OfficialReportView';
import { FieldVisitForm } from './components/FieldVisitForm';
import { FieldVisitView } from './components/FieldVisitView';
import { IntellectualPropertyPage } from './components/IntellectualPropertyPage';
import { SettingsModal } from './components/SettingsModal';
import { AboutModal } from './components/AboutModal';
import { exportReportToPDF } from './utils/pdfExport';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isUserAuthenticated());
  const [settings, setSettings] = useState<AppSettings>(() => getStoredSettings());
  const [reports, setReports] = useState<AnyAppReport[]>(() => getStoredReports());

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedReport, setSelectedReport] = useState<AnyAppReport | null>(null);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // First time setup trigger
  const [showInitialSetup, setShowInitialSetup] = useState(!settings.isConfigured);

  const refreshData = () => {
    setSettings(getStoredSettings());
    setReports(getStoredReports());
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    const currSettings = getStoredSettings();
    if (!currSettings.isConfigured) {
      setShowInitialSetup(true);
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setIsAuthenticated(false);
    setActiveTab('home');
    setSelectedReport(null);
  };

  const isFieldReport = (rep: AnyAppReport): rep is FieldVisitReport => {
    return rep.visitKind === 'field' || rep.visitType === 'زيارة ميدانية';
  };

  const handleViewReport = (report: AnyAppReport) => {
    setSelectedReport(report);
    if (isFieldReport(report)) {
      setActiveTab('view_field');
    } else {
      setActiveTab('view_report');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditReport = (report: AnyAppReport) => {
    setSelectedReport(report);
    if (isFieldReport(report)) {
      setActiveTab('edit_field');
    } else {
      setActiveTab('edit_report');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Inspection Visit save handler (الزيارة التفقدية)
  const handleInspectionSaveSuccess = async (
    savedReport: InspectionReport,
    action: 'view' | 'pdf' | 'print' | 'new'
  ) => {
    refreshData();
    setSelectedReport(savedReport);

    if (action === 'view') {
      setActiveTab('view_report');
    } else if (action === 'pdf') {
      setActiveTab('view_report');
      // Export PDF after short delay to ensure DOM is ready
      setTimeout(async () => {
        await exportReportToPDF('printable-official-report', savedReport);
      }, 300);
    } else if (action === 'print') {
      setActiveTab('view_report');
      setTimeout(() => {
        window.print();
      }, 300);
    } else if (action === 'new') {
      setSelectedReport(null);
      setActiveTab('new_inspection');
    }
  };

  // Field Visit save handler (الزيارة الميدانية)
  const handleFieldSaveSuccess = (
    savedReport: FieldVisitReport,
    action: 'view' | 'pdf' | 'print' | 'new'
  ) => {
    refreshData();
    setSelectedReport(savedReport);

    if (action === 'view') {
      setActiveTab('view_field');
    } else if (action === 'pdf') {
      setActiveTab('view_field');
    } else if (action === 'print') {
      setActiveTab('view_field');
      setTimeout(() => {
        window.print();
      }, 300);
    } else if (action === 'new') {
      setSelectedReport(null);
      setActiveTab('new_field');
    }
  };

  // If not logged in, render the official password-protected Login Screen
  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        deptHeadName={settings.deptHeadName}
        directorateAr={settings.directorateAr}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Cairo',sans-serif] text-slate-900 selection:bg-rose-900 selection:text-white">
      {/* First-time setup onboarding modal if not configured */}
      {showInitialSetup && (
        <InitialSetupModal
          currentSettings={settings}
          onCompleted={(newSettings) => {
            setSettings(newSettings);
            setShowInitialSetup(false);
          }}
        />
      )}

      {/* Main Top Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'new_report' || tab === 'new_inspection' || tab === 'new_field') {
            setSelectedReport(null);
          }
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        settings={settings}
        onLogout={handleLogout}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-12">
        {activeTab === 'home' && (
          <DashboardHome
            settings={settings}
            reports={reports}
            onNavigate={(tab) => {
              if (tab === 'settings') {
                setIsSettingsOpen(true);
              } else if (tab === 'about') {
                setIsAboutOpen(true);
              } else if (tab === 'ip_rights') {
                setActiveTab('ip_rights');
              } else if (tab === 'new_inspection') {
                setSelectedReport(null);
                setActiveTab('new_inspection');
              } else if (tab === 'new_field') {
                setSelectedReport(null);
                setActiveTab('new_field');
              } else {
                setActiveTab(tab as ActiveTab);
              }
            }}
            onViewReport={handleViewReport}
          />
        )}

        {/* Start New Inspection Visit (الزيارة التفقدية) */}
        {(activeTab === 'new_report' || activeTab === 'new_inspection') && (
          <ReportForm
            key="new-inspection-report"
            settings={settings}
            initialReport={null}
            onSaveSuccess={handleInspectionSaveSuccess}
            onCancel={() => setActiveTab('home')}
          />
        )}

        {/* Edit Inspection Visit (تعديل الزيارة التفقدية) */}
        {activeTab === 'edit_report' && selectedReport && !isFieldReport(selectedReport) && (
          <ReportForm
            key={selectedReport.id}
            settings={settings}
            initialReport={selectedReport as InspectionReport}
            onSaveSuccess={handleInspectionSaveSuccess}
            onCancel={() => setActiveTab('view_report')}
          />
        )}

        {/* View Inspection Visit (عرض الزيارة التفقدية) */}
        {activeTab === 'view_report' && selectedReport && !isFieldReport(selectedReport) && (
          <OfficialReportView
            report={selectedReport as InspectionReport}
            onEdit={handleEditReport}
            onBack={() => setActiveTab('reports_list')}
            onNewReport={() => {
              setSelectedReport(null);
              setActiveTab('new_inspection');
            }}
          />
        )}

        {/* Start New Field Visit (الزيارة الميدانية) */}
        {activeTab === 'new_field' && (
          <FieldVisitForm
            key="new-field-visit"
            settings={settings}
            initialReport={null}
            onSaveSuccess={handleFieldSaveSuccess}
            onCancel={() => setActiveTab('home')}
          />
        )}

        {/* Edit Field Visit (تعديل الزيارة الميدانية) */}
        {activeTab === 'edit_field' && selectedReport && isFieldReport(selectedReport) && (
          <FieldVisitForm
            key={selectedReport.id}
            settings={settings}
            initialReport={selectedReport as FieldVisitReport}
            onSaveSuccess={handleFieldSaveSuccess}
            onCancel={() => setActiveTab('view_field')}
          />
        )}

        {/* View Field Visit (عرض وطباعة الزيارة الميدانية) */}
        {activeTab === 'view_field' && selectedReport && isFieldReport(selectedReport) && (
          <FieldVisitView
            report={selectedReport as FieldVisitReport}
            settings={settings}
            onBack={() => setActiveTab('reports_list')}
            onEdit={(rep) => {
              setSelectedReport(rep);
              setActiveTab('edit_field');
            }}
          />
        )}

        {/* Reports Archive / List */}
        {activeTab === 'reports_list' && (
          <ReportsList
            reports={reports}
            onViewReport={handleViewReport}
            onEditReport={handleEditReport}
            onNewReport={() => {
              setSelectedReport(null);
              setActiveTab('new_inspection');
            }}
            onNewFieldReport={() => {
              setSelectedReport(null);
              setActiveTab('new_field');
            }}
            onNewInspectionReport={() => {
              setSelectedReport(null);
              setActiveTab('new_inspection');
            }}
            onRefreshReports={refreshData}
          />
        )}

        {/* Intellectual Property Rights Page */}
        {activeTab === 'ip_rights' && (
          <IntellectualPropertyPage onBack={() => setActiveTab('home')} />
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsUpdated={(newSettings) => {
          setSettings(newSettings);
          refreshData();
        }}
        onReportsReloadNeeded={refreshData}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenIpRights={() => setActiveTab('ip_rights')}
      />

      {/* About Application Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onOpenIpRights={() => setActiveTab('ip_rights')}
      />

      {/* Developer and Official Authority Footer */}
      <AppFooter onOpenIpRights={() => setActiveTab('ip_rights')} />
    </div>
  );
}
