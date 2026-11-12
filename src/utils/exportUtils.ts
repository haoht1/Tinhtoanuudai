/**
 * Export and Sharing utilities (PNG, PDF, Zalo text)
 * Author: Huỳnh Thái Hào
 */

import { toPng, toBlob } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { CalculationResult, LoanInput } from '../types/loan';
import { formatDisplayDate, formatPercent, formatVND } from './calculator';

/**
 * Clean today's date formatted for filenames (e.g. 12_11_2026)
 */
export function getDateStringForFilename(): string {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}_${month}_${year}`;
}

/**
 * Export specific DOM element as high-resolution PNG
 */
export async function exportElementToPng(
  element: HTMLElement,
  customFileName?: string
): Promise<string> {
  const dateStr = getDateStringForFilename();
  const fileName = customFileName || `Uu_dai_lai_suat_${dateStr}.png`;

  // Pre-render options for ultra-sharp mobile rendering
  const dataUrl = await toPng(element, {
    pixelRatio: 3,
    quality: 1,
    backgroundColor: '#ffffff',
    cacheBust: true,
    style: {
      transform: 'scale(1)',
      transformOrigin: 'top left',
    },
  });

  // Download trigger
  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
  link.click();

  return dataUrl;
}

/**
 * Export specific DOM element to an A4 PDF document
 * Format requested: Uu_dai_lai_suat_[ngay_thang].pdf
 */
export async function exportElementToPdf(
  element: HTMLElement,
  customFileName?: string
): Promise<void> {
  const dateStr = getDateStringForFilename();
  const fileName = customFileName || `Uu_dai_lai_suat_${dateStr}.pdf`;

  // Generate crisp 2x image of the advisory sheet
  const imgData = await toPng(element, {
    pixelRatio: 2.5,
    quality: 0.98,
    backgroundColor: '#ffffff',
    cacheBust: true,
  });

  // Create A4 PDF (Portrait: 210 x 297 mm)
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const margin = 10; // 10mm margin
  const contentWidth = pdfWidth - margin * 2;

  // Calculate scaled height preserving aspect ratio
  const elementWidth = element.offsetWidth || 800;
  const elementHeight = element.offsetHeight || 1100;
  const contentHeight = (elementHeight * contentWidth) / elementWidth;

  // If content height exceeds single page, scale down slightly to fit gracefully on 1 single A4 sheet
  let finalWidth = contentWidth;
  let finalHeight = contentHeight;
  let xOffset = margin;
  let yOffset = margin;

  const maxAvailableHeight = pdfHeight - margin * 2;
  if (contentHeight > maxAvailableHeight) {
    const scale = maxAvailableHeight / contentHeight;
    finalHeight = maxAvailableHeight;
    finalWidth = contentWidth * scale;
    xOffset = margin + (contentWidth - finalWidth) / 2;
  } else {
    // Vertically center on page
    yOffset = margin + (maxAvailableHeight - contentHeight) / 2;
  }

  pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight, undefined, 'FAST');
  pdf.save(fileName);
}

/**
 * Share sheet via native Web Share API or download fallback
 */
export async function shareConsultingSheet(
  element: HTMLElement,
  title: string
): Promise<{ success: boolean; method: 'native' | 'download' }> {
  const dateStr = getDateStringForFilename();
  const fileName = `Uu_dai_lai_suat_${dateStr}.png`;

  try {
    const blob = await toBlob(element, { pixelRatio: 2.5, backgroundColor: '#ffffff' });
    if (!blob) throw new Error('Blob generation failed');

    const file = new File([blob], fileName, { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: title || 'Phương án ưu đãi lãi suất vay VietinBank',
        text: 'Bảng phân tích hiệu quả ưu đãi lãi suất vay và phân bổ lợi ích tài chính.',
        files: [file],
      });
      return { success: true, method: 'native' };
    }
  } catch (err) {
    // If user cancelled share, don't fallback to download
    if (err instanceof Error && err.name === 'AbortError') {
      return { success: false, method: 'native' };
    }
  }

  // Fallback to PNG download
  await exportElementToPng(element, fileName);
  return { success: true, method: 'download' };
}

/**
 * Formats full Vietnamese advisory message ready to paste into Zalo
 */
export function generateZaloMessage(result: CalculationResult, input: LoanInput): string {
  const customerGreeting = input.customerName?.trim()
    ? `Kính gửi Quý Khách hàng: ${input.customerName.trim()}\n`
    : 'Kính gửi Quý Khách hàng,\n';

  const contractInfo = input.contractNo?.trim()
    ? `Số HĐ tín dụng: ${input.contractNo.trim()}\n`
    : '';

  const officerSignature = input.officerName?.trim()
    ? `\n👨‍💼 Cán bộ tư vấn: ${input.officerName.trim()}${input.officerPhone ? ` - SĐT: ${input.officerPhone.trim()}` : ''}`
    : '\n👨‍💼 Cán bộ tư vấn: Huỳnh Thái Hào';

  return `🏦 VIETINBANK - BẢN PHÂN TÍCH HIỆU QUẢ ƯU ĐÃI LÃI SUẤT VAY
${customerGreeting}${contractInfo}
Kính gửi Quý khách phương án tối ưu hóa chi phí lãi vay với chi tiết như sau:

1️⃣ THÔNG TIN KHOẢN VAY:
• Dư nợ vay: ${formatVND(result.principal)}
• Lãi suất hiện tại: ${formatPercent(result.currentRate)}/năm
• Lãi suất ưu đãi: ${formatPercent(result.preferentialRate)}/năm (Giảm ${formatPercent(result.rateReduction)})
• Thời gian ưu đãi: ${result.actualDays} ngày (${formatDisplayDate(result.startDate)} ➔ ${formatDisplayDate(result.endDate)})

2️⃣ SO SÁNH TIỀN LÃI:
• Tiền lãi theo LS hiện tại: ${formatVND(result.currentInterest)}
• Tiền lãi theo LS ưu đãi: ${formatVND(result.preferentialInterest)}
👉 TỔNG TIỀN LÃI TIẾT KIỆM: ${formatVND(result.totalSavings)}

3️⃣ PHÂN CHIA LỢI ÍCH TÀI CHÍNH:
• Phí ngân hàng (${result.bankSharePercent}%): ${formatVND(result.bankFee)}
• KHÁCH HÀNG THỰC TẾ TIẾT KIỆM (${result.customerSharePercent}%): ${formatVND(result.customerBenefit)}

⭐ KẾT LUẬN:
Khách hàng được hưởng chính sách ưu đãi lãi suất, sau khi thanh toán khoản phí ưu đãi, vẫn tiết kiệm được ${formatVND(result.customerBenefit)} so với phương án duy trì lãi suất hiện tại.

(Thông tin trên mang tính chất mô phỏng và tham khảo theo quy định của ngân hàng)
${officerSignature}`;
}
