/**
 * CÔNG CỤ PHÂN TÍCH HIỆU QUẢ ƯU ĐÃI LÃI SUẤT VAY
 * Tác giả: Huỳnh Thái Hào
 * Giao diện Modern Banking chuẩn VietinBank, Mobile First, Xuất PNG & PDF A4
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { LoanInputForm } from './components/LoanInputForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { ConsultingSheet } from './components/ConsultingSheet';
import { ExportActionBar } from './components/ExportActionBar';
import { LoanInput, CalculationResult } from './types/loan';
import {
  calculateLoanBenefit,
  addMonthsToDate,
  calculateDaysBetween,
} from './utils/calculator';
import confetti from 'canvas-confetti';
import { ShieldCheck, HeartHandshake } from 'lucide-react';

const STORAGE_KEY = 'vtb_loan_calculator_session';

export default function App() {
  // Initialize start & end date for standard 182-day period
  const getInitialDates = () => {
    const today = new Date();
    const startStr = today.toISOString().split('T')[0];
    const end = new Date(today.getTime() + 182 * 24 * 60 * 60 * 1000);
    const endStr = end.toISOString().split('T')[0];
    return { startStr, endStr };
  };

  const initialDates = getInitialDates();

  const DEFAULT_INPUT: LoanInput = {
    principal: 10_000_000_000, // 10 tỷ đồng
    currentRate: 9.0, // 9.0%/năm
    preferentialRate: 7.0, // 7.0%/năm
    durationMonths: 6,
    startDate: initialDates.startStr,
    endDate: initialDates.endStr,
    actualDays: 182, // 182 ngày chuẩn test case
    bankSharePercent: 50,
    customerSharePercent: 50,
    customerName: '',
    contractNo: '',
    officerName: 'Huỳnh Thái Hào',
    officerPhone: '',
  };

  // Restore from session storage or use default
  const [loanInput, setLoanInput] = useState<LoanInput>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_INPUT, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore localStorage errors
    }
    return DEFAULT_INPUT;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loanInput));
    } catch {
      // Ignore storage errors
    }
  }, [loanInput]);

  // Real-time calculation calculation result
  const calculationResult: CalculationResult = useMemo(() => {
    return calculateLoanBenefit(loanInput);
  }, [loanInput]);

  const reportRef = useRef<HTMLDivElement>(null);

  const handleScrollToReport = () => {
    if (reportRef.current) {
      reportRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLoadSample = () => {
    const { startStr, endStr } = getInitialDates();
    setLoanInput({
      principal: 10_000_000_000,
      currentRate: 9.0,
      preferentialRate: 7.0,
      durationMonths: 6,
      startDate: startStr,
      endDate: endStr,
      actualDays: 182,
      bankSharePercent: 50,
      customerSharePercent: 50,
      customerName: 'Công ty TNHH Hoàng Phát',
      contractNo: '182/2026/HĐTD-VTB',
      officerName: 'Huỳnh Thái Hào',
      officerPhone: '0908 xxx xxx',
    });
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.2 } });
  };

  const handleReset = () => {
    const today = new Date().toISOString().split('T')[0];
    const endStr = addMonthsToDate(today, 6);
    const days = calculateDaysBetween(today, endStr);
    setLoanInput({
      principal: 0,
      currentRate: 9.0,
      preferentialRate: 7.0,
      durationMonths: 6,
      startDate: today,
      endDate: endStr,
      actualDays: days || 182,
      bankSharePercent: 50,
      customerSharePercent: 50,
      customerName: '',
      contractNo: '',
      officerName: 'Huỳnh Thái Hào',
      officerPhone: '',
    });
  };

  const handlePrimaryCalculate = () => {
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
    const el = document.getElementById('results-dashboard');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Banking Header */}
      <Header
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        onShareQuick={handleScrollToReport}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8">
        {/* Intro Banner */}
        <div className="mb-6 bg-gradient-to-r from-red-900 via-[#C61D23] to-[#A01217] rounded-2xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider mb-2">
              Nghiệp Vụ Tín Dụng & Khách Hàng
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Phân Tích Hiệu Quả Ưu Đãi Lãi Suất Vay
            </h2>
            <p className="text-xs sm:text-sm text-red-100/95 mt-1 max-w-2xl leading-relaxed">
              Mô phỏng chính xác tiền lãi theo dư nợ và số ngày thực tế (chuẩn 365 ngày), tự động phân bổ lợi ích tiết kiệm giữa ngân hàng và khách hàng, xuất hồ sơ tư vấn gửi qua Zalo.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/20 flex flex-wrap items-center gap-4 text-xs text-red-100 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-yellow-300" />
              Công thức thực tế 365 ngày/năm
            </span>
            <span className="flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-yellow-300" />
              Tỷ lệ phân chia linh hoạt 0% - 100%
            </span>
          </div>
        </div>

        {/* 1. INPUT SECTION */}
        <LoanInputForm
          input={loanInput}
          onChange={setLoanInput}
          onCalculate={handlePrimaryCalculate}
        />

        {/* 2. LIVE RESULTS & COMPARISON DASHBOARD */}
        <ResultsDashboard
          result={calculationResult}
          onScrollToReport={handleScrollToReport}
        />

        {/* 3. EXPORT ACTION BUTTONS (TOP OF SHEET) */}
        <div ref={reportRef}>
          <ExportActionBar result={calculationResult} input={loanInput} />
        </div>

        {/* 4. THE CONSULTING ADVISORY SHEET (SECTION 6) */}
        <div className="mb-8">
          <div className="text-center mb-3">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Bản Tư Vấn Tài Chính Xuất Khách Hàng (Xem Trước)
            </h3>
            <p className="text-xs text-slate-500">
              Khu vực bên dưới sẽ được chụp nguyên vẹn và xuất thành file PNG / PDF A4 khi bạn nhấn tải
            </p>
          </div>

          <ConsultingSheet result={calculationResult} input={loanInput} />
        </div>

        {/* 5. SECONDARY BOTTOM EXPORT BAR FOR MOBILE CONVENIENCE */}
        <div className="sm:hidden mb-6">
          <ExportActionBar result={calculationResult} input={loanInput} />
        </div>
      </main>

      {/* Global Minimal Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#C61D23]"></div>
            <span className="font-semibold text-slate-700">
              Phân Tích Hiệu Quả Ưu Đãi Lãi Suất Vay
            </span>
            <span>·</span>
            <span>Nghiệp vụ VietinBank</span>
          </div>
          <div className="text-slate-600">
            Tác giả: <strong className="text-slate-900 font-bold">Huỳnh Thái Hào</strong> · Hỗ trợ xuất Zalo & In ấn PDF A4
          </div>
        </div>
      </footer>
    </div>
  );
}
