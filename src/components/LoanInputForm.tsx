/**
 * Loan Input Form Component - Mobile-First ergonomics
 * Author: Huỳnh Thái Hào
 */

import React, { useState } from 'react';
import {
  Calendar,
  Percent,
  Sliders,
  DollarSign,
  AlertTriangle,
  Building,
  User,
  Phone,
  FileText,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Calculator,
} from 'lucide-react';
import { LoanInput } from '../types/loan';
import {
  formatPercent,
  numberToVietnameseWords,
  calculateDaysBetween,
  addMonthsToDate,
} from '../utils/calculator';

interface LoanInputFormProps {
  input: LoanInput;
  onChange: (updated: LoanInput) => void;
  onCalculate: () => void;
}

const PRINCIPAL_PRESETS = [
  { label: '500 Tr', value: 500_000_000 },
  { label: '1 Tỷ', value: 1_000_000_000 },
  { label: '2 Tỷ', value: 2_000_000_000 },
  { label: '5 Tỷ', value: 5_000_000_000 },
  { label: '10 Tỷ', value: 10_000_000_000 },
  { label: '20 Tỷ', value: 20_000_000_000 },
  { label: '50 Tỷ', value: 50_000_000_000 },
];

const MONTH_PRESETS = [
  { label: '3 Tháng', months: 3 },
  { label: '5 Tháng', months: 5 },
  { label: '6 Tháng', months: 6 },
  { label: '12 Tháng', months: 12 },
];

const SHARE_PRESETS = [
  { label: '50 / 50', bank: 50, customer: 50 },
  { label: '75 / 25', bank: 75, customer: 25 },
  { label: '80 / 20', bank: 80, customer: 20 },
  { label: '90 / 10', bank: 90, customer: 10 },
  { label: '25 / 75', bank: 25, customer: 75 },
  { label: '100 / 0', bank: 100, customer: 0 },
];

export const LoanInputForm: React.FC<LoanInputFormProps> = ({
  input,
  onChange,
  onCalculate,
}) => {
  const [showDatePicker, setShowDatePicker] = useState<boolean>(true);
  const [showCustomerDetails, setShowCustomerDetails] = useState<boolean>(false);

  // Formatting principal input with thousand separators
  const formatRawNumber = (num: number): string => {
    return num > 0 ? new Intl.NumberFormat('vi-VN').format(num) : '';
  };

  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    const num = rawVal ? parseInt(rawVal, 10) : 0;
    onChange({ ...input, principal: num });
  };

  const handlePrincipalPreset = (val: number) => {
    onChange({ ...input, principal: val });
  };

  const handleCurrentRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    onChange({ ...input, currentRate: val });
  };

  const handlePreferentialRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    onChange({ ...input, preferentialRate: val });
  };

  const handleMonthPreset = (months: number) => {
    const start = input.startDate || new Date().toISOString().split('T')[0];
    const end = addMonthsToDate(start, months);
    const days = calculateDaysBetween(start, end);
    onChange({
      ...input,
      durationMonths: months,
      startDate: start,
      endDate: end,
      actualDays: days,
    });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const start = e.target.value;
    const end = input.endDate;
    const days = calculateDaysBetween(start, end);
    onChange({
      ...input,
      startDate: start,
      actualDays: days > 0 ? days : 1,
    });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const end = e.target.value;
    const start = input.startDate;
    const days = calculateDaysBetween(start, end);
    onChange({
      ...input,
      endDate: end,
      actualDays: days > 0 ? days : 1,
    });
  };

  const handleDaysDirectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const days = parseInt(e.target.value, 10) || 1;
    // Calculate new end date based on start date and days
    const start = new Date(input.startDate + 'T00:00:00');
    const newEnd = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
    const endStr = newEnd.toISOString().split('T')[0];
    onChange({
      ...input,
      actualDays: Math.max(1, days),
      endDate: endStr,
    });
  };

  // Sync benefit sharing percentage
  const handleBankShareChange = (val: number) => {
    const clamped = Math.min(100, Math.max(0, val));
    onChange({
      ...input,
      bankSharePercent: clamped,
      customerSharePercent: 100 - clamped,
    });
  };

  const handleCustomerShareChange = (val: number) => {
    const clamped = Math.min(100, Math.max(0, val));
    onChange({
      ...input,
      customerSharePercent: clamped,
      bankSharePercent: 100 - clamped,
    });
  };

  // Validation checks
  const isRateWarning = input.preferentialRate >= input.currentRate;
  const isPrincipalInvalid = input.principal <= 0;
  const isDaysInvalid = input.actualDays <= 0;
  const hasValidationError = isRateWarning || isPrincipalInvalid || isDaysInvalid;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-50 text-[#C61D23] flex items-center justify-center font-bold text-sm">
            1
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Thông Tin Khoản Vay & Chính Sách
          </h2>
        </div>
        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          Công thức chuẩn 365 ngày/năm
        </span>
      </div>

      <div className="space-y-5">
        {/* FIELD 1: DƯ NỢ VAY */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#C61D23]" />
              Dư nợ vay (VNĐ) <span className="text-red-500">*</span>
            </span>
            <span className="text-xs font-medium text-slate-500">
              Ví dụ: 10.000.000.000 đồng
            </span>
          </label>

          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={formatRawNumber(input.principal)}
              onChange={handlePrincipalChange}
              placeholder="Nhập số tiền vay..."
              className="w-full text-lg sm:text-xl font-bold text-slate-900 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C61D23] focus:border-transparent tabular-nums transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400 pointer-events-none">
              đồng
            </span>
          </div>

          {/* Amount in Vietnamese Words */}
          {input.principal > 0 && (
            <div className="mt-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-1.5 italic">
              <span className="font-medium text-slate-500">Bằng chữ:</span>
              <span className="text-slate-800 font-semibold">{numberToVietnameseWords(input.principal)}</span>
            </div>
          )}

          {/* Quick presets for principal */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {PRINCIPAL_PRESETS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => handlePrincipalPreset(p.value)}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  input.principal === p.value
                    ? 'bg-[#C61D23] text-white border-[#C61D23] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* FIELD 2 & 3: LÃI SUẤT HIỆN TẠI & LÃI SUẤT DỰ KIẾN ƯU ĐÃI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Lãi suất đang áp dụng */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-slate-500" />
                Lãi suất đang áp dụng
              </span>
              <span className="text-[11px] text-slate-400 font-normal">% / năm</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.05"
                min="0"
                max="50"
                value={input.currentRate || ''}
                onChange={handleCurrentRateChange}
                placeholder="Ví dụ: 9.0"
                className="w-full text-lg font-bold text-slate-900 px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 tabular-nums"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400 pointer-events-none">
                %/năm
              </span>
            </div>

            {/* Quick rate chips */}
            <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
              {[8.5, 9.0, 9.5, 10.0, 10.5].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => onChange({ ...input, currentRate: rate })}
                  className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer shrink-0 ${
                    input.currentRate === rate
                      ? 'bg-slate-800 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>

          {/* Lãi suất dự kiến ưu đãi */}
          <div className="bg-red-50/50 p-3.5 rounded-xl border border-red-200">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#C61D23] uppercase tracking-wide flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-[#C61D23]" />
                Lãi suất dự kiến ưu đãi
              </label>
              {input.currentRate > input.preferentialRate && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  Giảm {(input.currentRate - input.preferentialRate).toFixed(2)}%/năm
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.05"
                min="0"
                max="50"
                value={input.preferentialRate || ''}
                onChange={handlePreferentialRateChange}
                placeholder="Ví dụ: 7.0"
                className="w-full text-lg font-bold text-[#C61D23] px-3.5 py-2.5 bg-white border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C61D23] tabular-nums"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400 pointer-events-none">
                %/năm
              </span>
            </div>

            {/* Quick preferential rate chips */}
            <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
              {[6.5, 7.0, 7.5, 8.0, 8.5].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => onChange({ ...input, preferentialRate: rate })}
                  className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer shrink-0 ${
                    input.preferentialRate === rate
                      ? 'bg-[#C61D23] text-white'
                      : 'bg-white text-slate-600 hover:bg-red-100 border border-red-200'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Warning if preferential rate is higher than current */}
        {isRateWarning && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Lưu ý:</strong> Lãi suất dự kiến ưu đãi ({input.preferentialRate}%) đang cao hơn hoặc bằng lãi suất hiện tại ({input.currentRate}%). Cần nhập lãi suất ưu đãi thấp hơn để sinh tiền tiết kiệm.
            </span>
          </div>
        )}

        {/* FIELD 4: THỜI GIAN ÁP DỤNG ƯU ĐÃI & SỐ NGÀY THỰC TẾ */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#005082]" />
              Thời gian áp dụng ưu đãi & Số ngày thực tế
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="text-xs font-semibold text-[#005082] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {showDatePicker ? 'Ẩn chọn ngày chi tiết' : 'Tùy chỉnh ngày bắt đầu & kết thúc'}
                {showDatePicker ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Quick Month Selectors */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs text-slate-500 font-medium">Chọn nhanh:</span>
            {MONTH_PRESETS.map((m) => (
              <button
                key={m.months}
                type="button"
                onClick={() => handleMonthPreset(m.months)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  input.durationMonths === m.months
                    ? 'bg-[#005082] text-white border-[#005082] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Date Picker Grid */}
          {showDatePicker && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200/80">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  value={input.startDate}
                  onChange={handleStartDateChange}
                  className="w-full text-sm font-semibold text-slate-800 px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005082]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Ngày kết thúc
                </label>
                <input
                  type="date"
                  value={input.endDate}
                  onChange={handleEndDateChange}
                  className="w-full text-sm font-semibold text-slate-800 px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005082]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Số ngày tính lãi (365 ngày/năm)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="3650"
                    value={input.actualDays}
                    onChange={handleDaysDirectChange}
                    className="w-full text-sm font-bold text-[#005082] px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005082] tabular-nums"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">
                    ngày
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Active summary banner */}
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-600 bg-white px-3 py-2 rounded-lg border border-slate-200">
            <span>
              Kỳ tính lãi: <strong>{input.actualDays} ngày thực tế</strong> ({input.startDate} ➔ {input.endDate})
            </span>
            <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              Cơ sở: 365 ngày
            </span>
          </div>
        </div>

        {/* SECTION B: CHÍNH SÁCH PHÂN CHIA LỢI ÍCH */}
        <div className="bg-gradient-to-br from-slate-50 to-red-50/20 p-4 sm:p-5 rounded-2xl border-2 border-red-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#C61D23]" />
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Chính Sách Phân Chia Lợi Ích Tiết Kiệm
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-[#C61D23] bg-red-100/70 px-2 py-0.5 rounded">
              Tính trên số lãi tiết kiệm
            </span>
          </div>

          <p className="text-xs text-slate-600 mb-4">
            Điều chỉnh linh hoạt tỷ lệ phân chia giữa Ngân hàng (phí thu) và Khách hàng (lợi ích thực tế nhận được). Tổng luôn bằng 100%.
          </p>

          {/* Dual Inputs */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Ngân hàng */}
            <div className="bg-white p-3 rounded-xl border border-red-200 shadow-2xs">
              <span className="block text-[11px] font-bold text-[#C61D23] uppercase tracking-wider mb-1">
                Ngân hàng hưởng
              </span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={input.bankSharePercent}
                  onChange={(e) => handleBankShareChange(Number(e.target.value))}
                  className="w-full text-xl sm:text-2xl font-black text-[#C61D23] bg-transparent focus:outline-none tabular-nums"
                />
                <span className="text-lg font-bold text-slate-400">%</span>
              </div>
              <span className="text-[11px] text-slate-500">Phí dịch vụ thu từ KH</span>
            </div>

            {/* Khách hàng */}
            <div className="bg-white p-3 rounded-xl border border-sky-200 shadow-2xs">
              <span className="block text-[11px] font-bold text-[#005082] uppercase tracking-wider mb-1">
                Khách hàng hưởng
              </span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={input.customerSharePercent}
                  onChange={(e) => handleCustomerShareChange(Number(e.target.value))}
                  className="w-full text-xl sm:text-2xl font-black text-[#005082] bg-transparent focus:outline-none tabular-nums"
                />
                <span className="text-lg font-bold text-slate-400">%</span>
              </div>
              <span className="text-[11px] text-slate-500">Tiết kiệm thực tế</span>
            </div>
          </div>

          {/* Interactive Range Slider */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
              <span className="text-[#C61D23]">Ngân hàng: {input.bankSharePercent}%</span>
              <span className="text-[#005082]">Khách hàng: {input.customerSharePercent}%</span>
            </div>
            <div className="relative h-4 rounded-full bg-slate-200 overflow-hidden flex">
              <div
                className="h-full bg-[#C61D23] transition-all"
                style={{ width: `${input.bankSharePercent}%` }}
              ></div>
              <div
                className="h-full bg-[#005082] transition-all"
                style={{ width: `${input.customerSharePercent}%` }}
              ></div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={input.bankSharePercent}
              onChange={(e) => handleBankShareChange(Number(e.target.value))}
              className="w-full h-2 cursor-pointer mt-2"
            />
          </div>

          {/* Quick preset buttons for sharing ratio */}
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs font-medium text-slate-500 self-center mr-1">Tỷ lệ mẫu:</span>
            {SHARE_PRESETS.map((p) => {
              const active = input.bankSharePercent === p.bank;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    onChange({
                      ...input,
                      bankSharePercent: p.bank,
                      customerSharePercent: p.customer,
                    });
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* CUSTOMER & OFFICER DETAILS (OPTIONAL ACCORDION) */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowCustomerDetails(!showCustomerDetails)}
            className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              Thông tin khách hàng & Cán bộ tư vấn (Tùy chọn hiển thị trên bản xuất)
            </span>
            {showCustomerDetails ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showCustomerDetails && (
            <div className="p-4 bg-white grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <Building className="w-3 h-3" /> Tên Khách hàng / Doanh nghiệp
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Công ty TNHH Hoàng Phát"
                  value={input.customerName || ''}
                  onChange={(e) => onChange({ ...input, customerName: e.target.value })}
                  className="w-full text-xs font-medium text-slate-800 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C61D23]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <FileText className="w-3 h-3" /> Số Hợp đồng tín dụng
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: 0182/2026/HĐTD-VTB"
                  value={input.contractNo || ''}
                  onChange={(e) => onChange({ ...input, contractNo: e.target.value })}
                  className="w-full text-xs font-medium text-slate-800 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C61D23]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <User className="w-3 h-3" /> Cán bộ QHKH thực hiện
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Huỳnh Thái Hào"
                  value={input.officerName || ''}
                  onChange={(e) => onChange({ ...input, officerName: e.target.value })}
                  className="w-full text-xs font-medium text-slate-800 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C61D23]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Số điện thoại liên hệ
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: 09xx xxx xxx"
                  value={input.officerPhone || ''}
                  onChange={(e) => onChange({ ...input, officerPhone: e.target.value })}
                  className="w-full text-xs font-medium text-slate-800 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C61D23]"
                />
              </div>
            </div>
          )}
        </div>

        {/* PRIMARY CTA BUTTON: TÍNH TOÁN HIỆU QUẢ ƯU ĐÃI */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onCalculate}
            disabled={hasValidationError}
            className={`w-full py-4 px-6 rounded-xl font-extrabold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-[0.99] cursor-pointer ${
              hasValidationError
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-[#C61D23] hover:bg-[#b0181d] text-white shadow-red-900/20 hover:shadow-lg'
            }`}
          >
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>TÍNH TOÁN HIỆU QUẢ ƯU ĐÃI</span>
          </button>

          <p className="text-center text-xs text-slate-500 mt-2">
            Hệ thống tự động tính toán tức thì ngay khi bạn thay đổi bất kỳ thông số nào.
          </p>
        </div>
      </div>
    </div>
  );
};
