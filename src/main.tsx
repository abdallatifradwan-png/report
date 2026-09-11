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

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
