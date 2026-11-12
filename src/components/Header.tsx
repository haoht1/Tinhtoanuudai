/**
 * Header Component - Modern Banking Aesthetic (VietinBank Style)
 * Author: Huỳnh Thái Hào
 */

import React from 'react';
import { Landmark, Sparkles, RotateCcw, Share2 } from 'lucide-react';

interface HeaderProps {
  onLoadSample: () => void;
  onReset: () => void;
  onShareQuick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoadSample, onReset, onShareQuick }) => {
  return (
    <header className="border-b border-slate-200 bg-white shadow-xs sticky top-0 z-30">
      {/* Top micro brand ribbon */}
      <div className="bg-[#C61D23] h-1.5 w-full"></div>

      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Brand & Title lockup */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#C61D23] flex items-center justify-center text-white shadow-sm shrink-0">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C61D23]">
                  VIETINBANK
                </span>
                <span className="text-slate-300 text-xs">|</span>
                <span className="text-[11px] font-medium text-slate-500">
                  Phân Hệ Khách Hàng
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                PHÂN TÍCH HIỆU QUẢ ƯU ĐÃI LÃI SUẤT VAY
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Công cụ tính toán lợi ích tài chính giữa ngân hàng và khách hàng · Tác giả: <span className="font-semibold text-slate-700">Huỳnh Thái Hào</span>
              </p>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={onLoadSample}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#005082] bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors cursor-pointer"
              title="Điền dữ liệu mẫu 10 Tỷ, 182 ngày, 9% -> 7%"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#005082]" />
              <span className="whitespace-nowrap">Dữ liệu mẫu</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Xóa dữ liệu để nhập mới"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">Xóa</span>
            </button>

            <button
              type="button"
              onClick={onShareQuick}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#C61D23] hover:bg-[#b0181d] rounded-lg shadow-xs transition-colors cursor-pointer"
              title="Chia sẻ kết quả"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">Chia sẻ</span>
            </button>
          </div>
        </div>

        {/* Mobile author caption */}
        <div className="mt-1.5 pt-1.5 border-t border-slate-100 sm:hidden flex items-center justify-between text-[11px] text-slate-500">
          <span>Công cụ tính toán lợi ích tài chính</span>
          <span>Tác giả: <strong className="text-slate-700">Huỳnh Thái Hào</strong></span>
        </div>
      </div>
    </header>
  );
};
