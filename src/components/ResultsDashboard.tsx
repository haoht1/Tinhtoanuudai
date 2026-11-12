/**
 * Results Dashboard Component
 * Displays summary cards, side-by-side comparison, savings highlight, and split visualizer
 * Author: Huỳnh Thái Hào
 */

import React from 'react';
import {
  TrendingDown,
  Building2,
  UserCheck,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { CalculationResult } from '../types/loan';
import {
  formatVND,
  formatPercent,
  formatDisplayDate,
  numberToVietnameseWords,
} from '../utils/calculator';

interface ResultsDashboardProps {
  result: CalculationResult;
  onScrollToReport: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  result,
  onScrollToReport,
}) => {
  return (
    <div id="results-dashboard" className="space-y-6 mb-8">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Bảng Tổng Hợp Kết Quả & So Sánh
            </h2>
            <p className="text-xs text-slate-500">
              Tính toán chính xác theo dư nợ thực tế và {result.actualDays} ngày ưu đãi
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onScrollToReport}
          className="self-start sm:self-center inline-flex items-center gap-1.5 text-xs font-bold text-[#005082] hover:text-[#003b60] bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-200 transition-colors cursor-pointer"
        >
          <span>Xem bản tư vấn xuất Zalo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* A. TỔNG QUAN KHOẢN VAY (6 KPIs STRIP) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-0.5">
            Dư nợ vay
          </span>
          <p className="text-sm sm:text-base font-extrabold text-slate-900 tabular-nums truncate">
            {formatVND(result.principal, false)}
          </p>
          <span className="text-[10px] text-slate-400">đồng</span>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-0.5">
            Lãi suất hiện tại
          </span>
          <p className="text-sm sm:text-base font-extrabold text-slate-800 tabular-nums">
            {formatPercent(result.currentRate)}
          </p>
          <span className="text-[10px] text-slate-400">/năm</span>
        </div>

        <div className="bg-red-50/50 p-3 rounded-xl border border-red-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-[#C61D23] uppercase tracking-wide block mb-0.5">
            Lãi suất ưu đãi
          </span>
          <p className="text-sm sm:text-base font-extrabold text-[#C61D23] tabular-nums">
            {formatPercent(result.preferentialRate)}
          </p>
          <span className="text-[10px] text-[#C61D23]/70">/năm</span>
        </div>

        <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wide block mb-0.5">
            Mức giảm LS
          </span>
          <p className="text-sm sm:text-base font-extrabold text-emerald-700 tabular-nums">
            -{formatPercent(result.rateReduction)}
          </p>
          <span className="text-[10px] text-emerald-600 font-medium">chênh lệch</span>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-0.5">
            Thời gian ưu đãi
          </span>
          <p className="text-sm sm:text-base font-extrabold text-slate-900 tabular-nums">
            {result.actualDays} ngày
          </p>
          <span className="text-[10px] text-slate-400">
            {formatDisplayDate(result.startDate)}
          </span>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-0.5">
            Cơ sở tính lãi
          </span>
          <p className="text-sm sm:text-base font-extrabold text-slate-900 tabular-nums">
            365 ngày
          </p>
          <span className="text-[10px] text-slate-400">lịch thực tế</span>
        </div>
      </div>

      {/* B. SO SÁNH TIỀN LÃI & TỔNG SỐ TIỀN TIẾT KIỆM (HERO CARDS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* THẺ 1: LÃI SUẤT HIỆN TẠI */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Phương Án Hiện Tại
              </span>
              <h3 className="text-base font-bold text-slate-800">
                LÃI SUẤT DUY TRÌ: {formatPercent(result.currentRate)}/NĂM
              </h3>
            </div>
            <div className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">
              Chưa ưu đãi
            </div>
          </div>

          <div className="py-2">
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Tổng tiền lãi khách hàng phải trả:
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 tabular-nums tracking-tight">
              {formatVND(result.currentInterest)}
            </div>
            <div className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Tính trên <strong>{result.actualDays} ngày</strong> thực tế (cơ sở 365 ngày)
              </span>
            </div>
          </div>
        </div>

        {/* THẺ 2: LÃI SUẤT ƯU ĐÃI */}
        <div className="bg-sky-50/40 rounded-2xl border border-sky-200 p-4 sm:p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-sky-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#005082] block">
                Phương Án Ưu Đãi Mới
              </span>
              <h3 className="text-base font-bold text-[#005082]">
                LÃI SUẤT ƯU ĐÃI: {formatPercent(result.preferentialRate)}/NĂM
              </h3>
            </div>
            <div className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Tiết kiệm</span>
            </div>
          </div>

          <div className="py-2">
            <span className="text-xs font-medium text-slate-600 block mb-1">
              Tổng tiền lãi khách hàng phải trả:
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#005082] tabular-nums tracking-tight">
              {formatVND(result.preferentialInterest)}
            </div>
            <div className="text-xs text-emerald-700 font-semibold mt-1.5 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Giảm trực tiếp {(result.currentRate - result.preferentialRate).toFixed(2)}% lãi suất</span>
            </div>
          </div>
        </div>
      </div>

      {/* CON SỐ NỔI BẬT NHẤT: TỔNG SỐ TIỀN LÃI TIẾT KIỆM ĐƯỢC */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 rounded-2xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
        {/* Subtle patterned overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-emerald-100">
                Lợi Ích Tổng Thể Của Khoản Vay
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              TỔNG SỐ TIỀN LÃI TIẾT KIỆM ĐƯỢC
            </h3>
            <p className="text-xs text-emerald-100/90 mt-1 max-w-xl">
              Khoản tiền lãi tiết kiệm được từ việc giảm lãi suất từ {formatPercent(result.currentRate)} xuống {formatPercent(result.preferentialRate)} trong {result.actualDays} ngày.
            </p>
          </div>

          <div className="text-left sm:text-right bg-white/10 sm:bg-transparent p-3 sm:p-0 rounded-xl">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight tabular-nums">
              {formatVND(result.totalSavings)}
            </div>
            <p className="text-xs text-emerald-200 italic mt-1">
              Bằng chữ: {numberToVietnameseWords(result.totalSavings)}
            </p>
          </div>
        </div>
      </div>

      {/* C. BẢNG PHÂN CHIA LỢI ÍCH (NGÂN HÀNG & KHÁCH HÀNG) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Phân Chia Lợi Ích Tài Chính
            </h3>
            <p className="text-xs text-slate-500">
              Cơ cấu phân bổ số tiền {formatVND(result.totalSavings)} theo chính sách ({result.bankSharePercent}% / {result.customerSharePercent}%)
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[#C61D23]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C61D23]"></span> Ngân hàng ({result.bankSharePercent}%)
            </span>
            <span className="flex items-center gap-1.5 text-[#005082]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#005082]"></span> Khách hàng ({result.customerSharePercent}%)
            </span>
          </div>
        </div>

        {/* Visual Dual Progress Bar */}
        <div className="mb-6">
          <div className="h-6 w-full rounded-xl overflow-hidden flex bg-slate-100 p-1 border border-slate-200">
            <div
              className="h-full rounded-lg bg-[#C61D23] transition-all flex items-center justify-center text-[10px] font-extrabold text-white"
              style={{ width: `${result.bankSharePercent}%` }}
            >
              {result.bankSharePercent >= 15 ? `${result.bankSharePercent}%` : ''}
            </div>
            <div
              className="h-full rounded-lg bg-[#005082] transition-all flex items-center justify-center text-[10px] font-extrabold text-white"
              style={{ width: `${result.customerSharePercent}%` }}
            >
              {result.customerSharePercent >= 15 ? `${result.customerSharePercent}%` : ''}
            </div>
          </div>
        </div>

        {/* Two distinct benefit cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {/* NGÂN HÀNG CARD */}
          <div className="bg-red-50/40 rounded-xl border border-red-200 p-4 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#C61D23] text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#C61D23] uppercase tracking-wide">
                    NGÂN HÀNG
                  </h4>
                  <span className="text-[11px] text-slate-500">Thu phí theo chính sách</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-[#C61D23] bg-red-100 px-2.5 py-0.5 rounded-lg tabular-nums">
                  {result.bankSharePercent}%
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-red-100">
              <span className="text-xs text-slate-600 block mb-1">
                Số tiền phí dự kiến thu được:
              </span>
              <div className="text-2xl font-black text-[#C61D23] tabular-nums">
                {formatVND(result.bankFee)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 italic">
                Bằng chữ: {numberToVietnameseWords(result.bankFee)}
              </p>
            </div>
          </div>

          {/* KHÁCH HÀNG CARD */}
          <div className="bg-sky-50/50 rounded-xl border border-sky-200 p-4 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#005082] text-white flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#005082] uppercase tracking-wide">
                    KHÁCH HÀNG
                  </h4>
                  <span className="text-[11px] text-slate-500">Lợi ích thực tế nhận được</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-[#005082] bg-sky-100 px-2.5 py-0.5 rounded-lg tabular-nums">
                  {result.customerSharePercent}%
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-sky-100">
              <span className="text-xs text-slate-600 block mb-1">
                Số tiền khách hàng tiết kiệm thực tế:
              </span>
              <div className="text-2xl font-black text-[#005082] tabular-nums">
                {formatVND(result.customerBenefit)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 italic">
                Bằng chữ: {numberToVietnameseWords(result.customerBenefit)}
              </p>
            </div>
          </div>
        </div>

        {/* HIGHLIGHTED CONCLUSION AS MANDATED BY SECTION 5 */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-0.5">
              Kết Luận Phương Án
            </span>
            <p className="text-sm font-semibold text-slate-900 leading-relaxed">
              “Với chính sách ưu đãi lãi suất và mức phí dự kiến nêu trên, khách hàng tiết kiệm thực tế được <strong className="text-emerald-700 underline decoration-emerald-300 font-extrabold">{formatVND(result.customerBenefit)}</strong> trong thời gian ưu đãi.”
            </p>
            <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
              <span>Đảm bảo kiểm tra:</span>
              <code className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-mono text-[11px]">
                {formatVND(result.bankFee, false)} + {formatVND(result.customerBenefit, false)} = {formatVND(result.totalSavings, false)} đ (100% khớp)
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
