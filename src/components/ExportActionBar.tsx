/**
 * Export Action Bar Component
 * Provides PNG download, A4 PDF download, Web Share, and Zalo Text Copy
 * Author: Huỳnh Thái Hào
 */

import React, { useState } from 'react';
import {
  Download,
  FileDown,
  Share2,
  Copy,
  Check,
  Loader2,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CalculationResult, LoanInput } from '../types/loan';
import {
  exportElementToPng,
  exportElementToPdf,
  shareConsultingSheet,
  generateZaloMessage,
  getDateStringForFilename,
} from '../utils/exportUtils';

interface ExportActionBarProps {
  result: CalculationResult;
  input: LoanInput;
}

export const ExportActionBar: React.FC<ExportActionBarProps> = ({
  result,
  input,
}) => {
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [copiedZalo, setCopiedZalo] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getTargetElement = (): HTMLElement | null => {
    return document.getElementById('consulting-advisory-sheet');
  };

  const handleDownloadPng = async () => {
    const el = getTargetElement();
    if (!el) {
      showToast('Không tìm thấy bảng kết quả để xuất ảnh.');
      return;
    }

    try {
      setIsExportingPng(true);
      const dateStr = getDateStringForFilename();
      await exportElementToPng(el, `Uu_dai_lai_suat_${dateStr}.png`);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      showToast('Đã tải ảnh PNG thành công! Sẵn sàng gửi Zalo.');
    } catch (err) {
      console.error(err);
      showToast('Có lỗi xảy ra khi tạo ảnh PNG. Vui lòng thử lại.');
    } finally {
      setIsExportingPng(false);
    }
  };

  const handleDownloadPdf = async () => {
    const el = getTargetElement();
    if (!el) {
      showToast('Không tìm thấy bảng kết quả để xuất PDF.');
      return;
    }

    try {
      setIsExportingPdf(true);
      const dateStr = getDateStringForFilename();
      await exportElementToPdf(el, `Uu_dai_lai_suat_${dateStr}.pdf`);
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.8 } });
      showToast(`Đã xuất file PDF A4: Uu_dai_lai_suat_${dateStr}.pdf`);
    } catch (err) {
      console.error(err);
      showToast('Có lỗi xảy ra khi xuất PDF. Vui lòng thử lại.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleShare = async () => {
    const el = getTargetElement();
    if (!el) return;

    try {
      setIsSharing(true);
      const res = await shareConsultingSheet(
        el,
        `Phương án ưu đãi lãi suất vay - ${result.referenceId}`
      );
      if (res.method === 'native') {
        showToast('Đã mở bảng chia sẻ của thiết bị.');
      } else {
        showToast('Đã lưu ảnh về máy để bạn chia sẻ qua Zalo.');
      }
    } catch (err) {
      console.error(err);
      showToast('Không thể chia sẻ tự động. Đã chuyển sang tải ảnh.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyZalo = async () => {
    try {
      const message = generateZaloMessage(result, input);
      await navigator.clipboard.writeText(message);
      setCopiedZalo(true);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.85 } });
      showToast('Đã sao chép tin nhắn Zalo! Hãy mở Zalo và dán cho khách hàng.');
      setTimeout(() => setCopiedZalo(false), 3000);
    } catch (err) {
      console.error(err);
      showToast('Không thể sao chép vào clipboard. Vui lòng cấp quyền.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm p-4 sm:p-5 mb-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Xuất Hồ Sơ & Gửi Khách Hàng (Zalo)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Tối ưu hóa độ phân giải cao và định dạng chuyên nghiệp gửi qua Zalo, Email hoặc in ấn
          </p>
        </div>
        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 self-start sm:self-center">
          Khổ chuẩn A4 & Hình ảnh HD
        </span>
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* 1. TẢI ẢNH PNG */}
        <button
          type="button"
          onClick={handleDownloadPng}
          disabled={isExportingPng}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-[#C61D23] hover:bg-[#b0181d] text-white flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer disabled:opacity-60"
        >
          {isExportingPng ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{isExportingPng ? 'Đang tạo ảnh HD...' : 'TẢI ẢNH PNG (Zalo)'}</span>
        </button>

        {/* 2. XUẤT FILE PDF */}
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={isExportingPdf}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-[#005082] hover:bg-[#003e65] text-white flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer disabled:opacity-60"
        >
          {isExportingPdf ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileDown className="w-4 h-4" />
          )}
          <span>{isExportingPdf ? 'Đang xuất PDF A4...' : 'XUẤT FILE PDF A4'}</span>
        </button>

        {/* 3. SAO CHÉP VĂN BẢN ZALO */}
        <button
          type="button"
          onClick={handleCopyZalo}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-slate-800 hover:bg-slate-900 text-white flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
        >
          {copiedZalo ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <MessageSquare className="w-4 h-4 text-sky-300" />
          )}
          <span>{copiedZalo ? 'ĐÃ SAO CHÉP!' : 'SAO CHÉP CHAT ZALO'}</span>
        </button>

        {/* 4. CHIA SẺ */}
        <button
          type="button"
          onClick={handleShare}
          disabled={isSharing}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center gap-2 border border-slate-300 transition-all active:scale-[0.98] cursor-pointer"
        >
          {isSharing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Share2 className="w-4 h-4 text-[#C61D23]" />
          )}
          <span>CHIA SẺ HỒ SƠ</span>
        </button>
      </div>
    </div>
  );
};
