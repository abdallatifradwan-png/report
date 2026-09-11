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

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { InspectionReport } from '../types';

export async function exportReportToPDF(
  elementId: string,
  report: InspectionReport
): Promise<boolean> {
  const page1 = document.getElementById('printable-report-page-1');
  const page2 = document.getElementById('printable-report-page-2');

  try {
    // Format date for filename e.g. DD-MM-YYYY
    const dateParts = report.visitDate.split('-');
    const formattedDate =
      dateParts.length === 3
        ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
        : report.visitDate;

    const cleanSchoolName = report.schoolName.replace(/[/\\?%*:|"<>]/g, '-').trim();
    const filename = `تقرير زيارة تفقدية - ${cleanSchoolName} - ${formattedDate}.pdf`;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = 210;
    const pdfHeight = 297;

    const canvasOptions = {
      scale: 2.5, // High-DPI crisp rendering
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794,
    };

    if (page1 && page2) {
      // 1. Render Page 1
      const canvas1 = await html2canvas(page1, canvasOptions);
      const imgData1 = canvas1.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData1, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

      // 2. Render Page 2
      pdf.addPage();
      const canvas2 = await html2canvas(page2, canvasOptions);
      const imgData2 = canvas2.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData2, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    } else {
      // Fallback single element export
      const element = document.getElementById(elementId);
      if (!element) return false;

      const canvas = await html2canvas(element, canvasOptions);
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      while (heightLeft > 5) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }
    }

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('PDF export error:', error);
    return false;
  }
}

export function generateWhatsAppMessage(report: InspectionReport): string {
  const impressionLabels: Record<string, string> = {
    excellent: '⭐ ممتاز',
    very_good: '🟢 جيد جداً',
    good: '🟡 جيد',
    needs_followup: '🟠 يحتاج متابعة',
    needs_action: '🔴 يحتاج معالجة',
  };

  const formattedDate = report.visitDate;
  const impression = impressionLabels[report.generalImpression] || report.generalImpression;

  let text = `📋 *تقرير زيارة تفقدية مدرسية*\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `🏫 *المدرسة:* ${report.schoolName}\n`;
  text += `🏛️ *المديرية:* ${report.directorateAr}\n`;
  text += `📅 *تاريخ الزيارة:* ${formattedDate} (${report.visitTime})\n`;
  text += `👤 *الزائر:* ${report.deptHeadName} (${report.jobTitle})\n`;
  text += `📊 *الانطباع العام:* ${impression}\n`;

  if (report.positives?.trim()) {
    text += `\n✨ *أبرز الإيجابيات:*\n${report.positives.trim()}\n`;
  }
  if (report.needs?.trim()) {
    text += `\n📌 *أبرز الاحتياجات:*\n${report.needs.trim()}\n`;
  }
  if (report.recommendations?.trim()) {
    text += `\n💡 *أبرز التوصيات:*\n${report.recommendations.trim()}\n`;
  }
  if (report.agreements?.trim()) {
    text += `\n🤝 *أهم الأمور المتفق عليها:*\n${report.agreements.trim()}\n`;
  }

  text += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `قسم ضبط الأداء المدرسي | وزارة التربية والتعليم`;

  return encodeURIComponent(text);
}
