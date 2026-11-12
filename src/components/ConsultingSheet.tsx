/**
 * Consulting Sheet Component - BẢNG TỔNG HỢP LỢI ÍCH DÀNH CHO KHÁCH HÀNG
 * Professional banking advisory document format, specifically designed for clean PNG / PDF export
 * Author: Huỳnh Thái Hào
 */

import React from 'react';
import { Landmark, Check, Sparkles } from 'lucide-react';
import { CalculationResult, LoanInput } from '../types/loan';
import {
  formatVND,
  formatPercent,
  formatDisplayDate,
  numberToVietnameseWords,
} from '../utils/calculator';

interface ConsultingSheetProps {
  result: CalculationResult;
  input: LoanInput;
}

export const ConsultingSheet: React.FC<ConsultingSheetProps> = ({
  result,
  input,
}) => {
  return (
    <div className="w-full flex justify-center py-2">
      {/* 
        This outer container has id="consulting-advisory-sheet"
        Export functions (PNG / PDF) strictly capture ONLY this element.
        Styled with fixed max width (A4 proportion), white background, clean border, and sharp typography.
      */}
      <div
        id="consulting-advisory-sheet"
        className="w-full max-w-[760px] bg-white rounded-xl border-2 border-slate-300 shadow-md p-6 sm:p-8 text-slate-900 relative overflow-hidden"
        style={{
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
          fontFamily: "'Be Vietnam Pro', system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Top VietinBank Red Brand Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#C61D23]"></div>

        {/* BANK HEADER BRANDING */}
        <div className="flex items-start justify-between pb-4 mb-4 border-b-2 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#C61D23] flex items-center justify-center text-white shadow-sm shrink-0">
              <Landmark className="w-7 h-7" />
            </div>
            <div>
              <div className="text-sm font-black text-[#C61D23] uppercase tracking-wider">
                VIETINBANK
              </div>
              <div className="text-xs font-semibold text-slate-700">
                NGÂN HÀNG THƯƠNG MẠI CỔ PHẦN CÔNG THƯƠNG VIỆT NAM
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Nâng giá trị cuộc sống · Bộ phận Khách hàng Doanh nghiệp & Cá nhân
              </div>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Mã hồ sơ tư vấn
            </div>
            <div className="text-xs font-mono font-bold text-slate-800">
              {result.referenceId}
            </div>
            <div className="text-[11px] text-slate-500">
              Ngày lập: {result.calculationTimestamp}
            </div>
          </div>
        </div>

        {/* DOCUMENT TITLE */}
        <div className="text-center my-5">
          <span className="inline-block px-3 py-1 bg-red-50 text-[#C61D23] text-xs font-extrabold uppercase tracking-widest rounded-full mb-1 border border-red-200">
            BẢN PHÂN TÍCH TÀI CHÍNH
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
            PHƯƠNG ÁN ƯU ĐÃI LÃI SUẤT VAY
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Bảng tổng hợp chi phí lãi vay và hiệu quả tối ưu hóa tài chính dành cho Khách hàng
          </p>
        </div>

        {/* CUSTOMER INFO STRIP (IF ENTERED) */}
        {(input.customerName || input.contractNo) && (
          <div className="bg-slate-50 rounded-xl p-3 mb-5 border border-slate-200 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2">
            {input.customerName && (
              <div>
                <span className="text-slate-500 font-medium">Khách hàng / Đơn vị:</span>{' '}
                <strong className="text-slate-800">{input.customerName}</strong>
              </div>
            )}
            {input.contractNo && (
              <div>
                <span className="text-slate-500 font-medium">Số HĐ tín dụng:</span>{' '}
                <strong className="text-slate-800">{input.contractNo}</strong>
              </div>
            )}
          </div>
        )}

        {/* SECTION 1: THÔNG TIN KHOẢN VAY */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2 pb-1 border-b border-slate-200">
            <span className="w-5 h-5 rounded-full bg-[#C61D23] text-white text-[11px] font-bold flex items-center justify-center">
              I
            </span>
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              THÔNG TIN KHOẢN VAY
            </h2>
          </div>

          <div className="bg-slate-50/70 rounded-xl border border-slate-200 p-3.5 grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 text-xs">
            <div>
              <span className="text-slate-500 block mb-0.5">Dư nợ vay</span>
              <strong className="text-sm font-bold text-slate-900 tabular-nums">
                {formatVND(result.principal)}
              </strong>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">Lãi suất đang áp dụng</span>
              <strong className="text-sm font-bold text-slate-800 tabular-nums">
                {formatPercent(result.currentRate)}/năm
              </strong>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">Lãi suất dự kiến ưu đãi</span>
              <strong className="text-sm font-bold text-[#C61D23] tabular-nums">
                {formatPercent(result.preferentialRate)}/năm
              </strong>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">Mức giảm lãi suất</span>
              <strong className="text-sm font-bold text-emerald-700 tabular-nums">
                -{formatPercent(result.rateReduction)}
              </strong>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">Thời gian áp dụng</span>
              <strong className="text-xs font-semibold text-slate-800">
                {formatDisplayDate(result.startDate)} ➔ {formatDisplayDate(result.endDate)}
              </strong>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">Số ngày tính lãi thực tế</span>
              <strong className="text-sm font-bold text-[#005082] tabular-nums">
                {result.actualDays} ngày (365 ngày/năm)
              </strong>
            </div>
          </div>
        </div>

        {/* SECTION 2: SO SÁNH CHI PHÍ LÃI VAY (TABLE) */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2 pb-1 border-b border-slate-200">
            <span className="w-5 h-5 rounded-full bg-[#C61D23] text-white text-[11px] font-bold flex items-center justify-center">
              II
            </span>
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              SO SÁNH CHI PHÍ LÃI VAY
            </h2>
          </div>

          <div className="overflow-hidden border border-slate-300 rounded-xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-300">
                  <th className="py-2.5 px-3">Nội dung</th>
                  <th className="py-2.5 px-3 text-right">Phương án hiện tại</th>
                  <th className="py-2.5 px-3 text-right bg-red-50/50 text-[#C61D23]">
                    Phương án ưu đãi
                  </th>
                  <th className="py-2.5 px-3 text-right text-emerald-700">Chênh lệch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold text-slate-700">
                    Lãi suất áp dụng
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium text-slate-800 tabular-nums">
                    {formatPercent(result.currentRate)}/năm
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-[#C61D23] bg-red-50/30 tabular-nums">
                    {formatPercent(result.preferentialRate)}/năm
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-700 tabular-nums">
                    -{formatPercent(result.rateReduction)}
                  </td>
                </tr>
                <tr className="bg-slate-50/40">
                  <td className="py-3 px-3 font-bold text-slate-900">
                    Tiền lãi phải trả ({result.actualDays} ngày)
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-800 tabular-nums">
                    {formatVND(result.currentInterest)}
                  </td>
                  <td className="py-3 px-3 text-right font-black text-[#005082] bg-sky-50/50 tabular-nums">
                    {formatVND(result.preferentialInterest)}
                  </td>
                  <td className="py-3 px-3 text-right font-black text-emerald-700 tabular-nums">
                    -{formatVND(result.totalSavings)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 3: HIỆU QUẢ TÀI CHÍNH */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2 pb-1 border-b border-slate-200">
            <span className="w-5 h-5 rounded-full bg-[#C61D23] text-white text-[11px] font-bold flex items-center justify-center">
              III
            </span>
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              HIỆU QUẢ TÀI CHÍNH
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            {/* 1. Tổng tiền tiết kiệm */}
            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                Tổng tiền lãi tiết kiệm
              </span>
              <div className="text-lg sm:text-xl font-black text-emerald-700 tabular-nums">
                {formatVND(result.totalSavings)}
              </div>
              <span className="text-[10px] text-emerald-600 mt-0.5 block">
                Tổng lợi ích tạo ra
              </span>
            </div>

            {/* 2. Phí ưu đãi dự kiến */}
            <div className="bg-red-50/60 rounded-xl p-3 border border-red-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C61D23] block mb-1">
                Phí ưu đãi dự kiến ({result.bankSharePercent}%)
              </span>
              <div className="text-lg sm:text-xl font-black text-[#C61D23] tabular-nums">
                {formatVND(result.bankFee)}
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Phí ngân hàng thu
              </span>
            </div>

            {/* 3. KH thực tế tiết kiệm */}
            <div className="bg-sky-50 rounded-xl p-3 border border-sky-300 ring-2 ring-sky-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#005082] block mb-1">
                Khách hàng thực tế tiết kiệm ({result.customerSharePercent}%)
              </span>
              <div className="text-lg sm:text-xl font-black text-[#005082] tabular-nums">
                {formatVND(result.customerBenefit)}
              </div>
              <span className="text-[10px] text-sky-700 font-semibold mt-0.5 block">
                Lợi ích ròng thực nhận
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 4: TỶ LỆ PHÂN CHIA LỢI ÍCH */}
        <div className="mb-5 bg-slate-50 rounded-xl p-3.5 border border-slate-200">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
            <span className="flex items-center gap-1.5 uppercase tracking-wide">
              <span>IV. TỶ LỆ PHÂN CHIA LỢI ÍCH TIẾT KIỆM</span>
            </span>
            <span className="text-slate-500 font-normal">
              Ngân hàng {result.bankSharePercent}% / Khách hàng {result.customerSharePercent}%
            </span>
          </div>

          <div className="h-5 w-full rounded-lg overflow-hidden flex bg-slate-200 mb-2">
            <div
              className="h-full bg-[#C61D23] flex items-center justify-center text-[10px] font-black text-white"
              style={{ width: `${result.bankSharePercent}%` }}
            >
              {result.bankSharePercent}% Ngân hàng
            </div>
            <div
              className="h-full bg-[#005082] flex items-center justify-center text-[10px] font-black text-white"
              style={{ width: `${result.customerSharePercent}%` }}
            >
              {result.customerSharePercent}% Khách hàng
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-600">
            <span>• Phí Ngân hàng thu: <strong>{formatVND(result.bankFee)}</strong></span>
            <span>• Khách hàng thực nhận: <strong>{formatVND(result.customerBenefit)}</strong></span>
          </div>
        </div>

        {/* HIGHLIGHTED CONCLUSION AS MANDATED */}
        <div className="bg-gradient-to-r from-red-50 via-white to-sky-50 rounded-xl p-4 border-2 border-slate-300 mb-4 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-0.5">
                KẾT LUẬN HIỆU QUẢ TÀI CHÍNH
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                “Khách hàng được hưởng chính sách ưu đãi lãi suất, sau khi thanh toán khoản phí ưu đãi, vẫn tiết kiệm được <span className="text-[#005082] font-black underline decoration-sky-400">{formatVND(result.customerBenefit)}</span> so với phương án duy trì lãi suất hiện tại.”
              </p>
              <p className="text-[11px] text-slate-500 italic mt-1">
                (Bằng chữ: {numberToVietnameseWords(result.customerBenefit)})
              </p>
            </div>
          </div>
        </div>

        {/* MANDATORY LEGAL DISCLAIMER */}
        <div className="text-[10px] sm:text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed mb-6">
          <strong className="text-slate-700">Ghi chú:</strong> “Thông tin trên mang tính chất mô phỏng và tham khảo. Số tiền thực tế có thể thay đổi theo dư nợ thực tế, số ngày tính lãi và điều kiện áp dụng của ngân hàng.”
        </div>

        {/* FOOTER & SIGNATURE SECTION */}
        <div className="pt-3 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-center sm:text-left">
            <div className="font-bold text-slate-800">
              {input.officerName ? `Cán bộ tư vấn: ${input.officerName}` : 'Cán bộ Quan hệ Khách hàng'}
            </div>
            <div className="text-[11px] text-slate-500">
              {input.officerPhone ? `Điện thoại: ${input.officerPhone}` : 'Ngân hàng TMCP Công Thương Việt Nam'}
            </div>
          </div>

          <div className="text-center sm:text-right">
            <div className="text-[11px] text-slate-400 font-medium">Bản quyền phần mềm</div>
            <div className="text-xs font-bold text-slate-800">
              Công cụ phát triển bởi Huỳnh Thái Hào
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
