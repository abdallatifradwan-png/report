import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker if in browser
if (typeof window !== 'undefined' && 'Worker' in window) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
  } catch (e) {
    console.warn('PDF.js worker initialization warning:', e);
  }
}

/**
 * Clean and filter a candidate school name
 */
export function cleanSchoolName(name: string): string | null {
  if (!name) return null;
  // Clean whitespace, bullet points, numbers, commas, quotes
  let cleaned = name
    .replace(/^[\s\d\.\-\*•_()\[\]:؛،,"]+/, '')
    .replace(/[\s\d\.\-\*•_()\[\]:؛،,"]+$/, '')
    .trim();

  // If it's too short (less than 3 chars) or contains no Arabic letters, skip
  if (cleaned.length < 3) return null;

  // Filter out headers like "اسم المدرسة", "الرقم", "المحافظة", etc.
  const ignoreKeywords = [
    'اسم المدرسة',
    'اسم المدرسه',
    'المدرسة',
    'المحافظة',
    'المديرية',
    'الرقم',
    'تسلسل',
    'ملاحظات',
    'الهاتف',
    'البريد',
    'النوع',
    'المرحلة',
    'الجنس',
    'المدير',
    'المديرة',
    'school name',
    'schools',
    'directorate',
    'education',
  ];

  const lower = cleaned.toLowerCase();
  if (ignoreKeywords.some((kw) => lower === kw || lower === `اسم ${kw}`)) {
    return null;
  }

  return cleaned;
}

/**
 * Extract schools from an Excel or CSV file
 */
export async function parseSchoolsFromExcel(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const extractedSchools = new Set<string>();

        // Loop through all sheets in workbook
        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          if (!sheet) return;

          // Convert to 2D array of raw values
          const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          rows.forEach((row) => {
            if (Array.isArray(row)) {
              row.forEach((cell) => {
                if (typeof cell === 'string') {
                  const cleaned = cleanSchoolName(cell);
                  if (cleaned) {
                    extractedSchools.add(cleaned);
                  }
                }
              });
            }
          });
        });

        const result = Array.from(extractedSchools);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Extract schools from a PDF file
 */
export async function parseSchoolsFromPDF(file: File): Promise<string[]> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;

    const extractedSchools = new Set<string>();

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Group text items by line/position
      const linesMap = new Map<number, string[]>();

      textContent.items.forEach((item: any) => {
        if ('str' in item && item.str.trim()) {
          const y = Math.round(item.transform[5] / 4) * 4; // snap to nearest 4px baseline
          if (!linesMap.has(y)) {
            linesMap.set(y, []);
          }
          linesMap.get(y)!.push(item.str);
        }
      });

      // Process lines sorted vertically
      const sortedY = Array.from(linesMap.keys()).sort((a, b) => b - a);

      sortedY.forEach((y) => {
        const lineParts = linesMap.get(y)!;
        const fullLine = lineParts.join(' ').trim();

        // Check each line or split by delimiters
        const candidates = fullLine.split(/[\n\r\t]+| {3,}/);
        candidates.forEach((cand) => {
          const cleaned = cleanSchoolName(cand);
          if (cleaned) {
            extractedSchools.add(cleaned);
          }
        });
      });
    }

    return Array.from(extractedSchools);
  } catch (err) {
    console.error('Error parsing PDF:', err);
    throw new Error('فشل قراءة ملف PDF. يرجى التأكد من احتواء الملف على نصوص قابلة للقراءة وليس صور ممسوحة ضوئياً.');
  }
}

/**
 * Extract schools from pasted plain text (multiline)
 */
export function parseSchoolsFromText(text: string): string[] {
  const lines = text.split(/[\r\n]+/);
  const set = new Set<string>();

  lines.forEach((line) => {
    const cleaned = cleanSchoolName(line);
    if (cleaned) {
      set.add(cleaned);
    }
  });

  return Array.from(set);
}
