/**
 * Calculation logic and formatting utilities
 * Author: Huỳnh Thái Hào
 */

import { CalculationResult, LoanInput } from '../types/loan';

/**
 * Calculates calendar days between two dates (YYYY-MM-DD)
 */
export function calculateDaysBetween(startDateStr: string, endDateStr: string): number {
  if (!startDateStr || !endDateStr) return 0;
  const start = new Date(startDateStr + 'T00:00:00');
  const end = new Date(endDateStr + 'T00:00:00');
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Calculates end date by adding N calendar months to start date
 */
export function addMonthsToDate(startDateStr: string, months: number): string {
  const d = new Date(startDateStr + 'T00:00:00');
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
}

/**
 * Core loan benefit calculation
 * Follows exact formula: Tiền lãi = Dư nợ × Lãi suất năm / 100 / 365 × Số ngày thực tế
 */
export function calculateLoanBenefit(input: LoanInput): CalculationResult {
  const {
    principal,
    currentRate,
    preferentialRate,
    actualDays,
    bankSharePercent,
    customerSharePercent,
    startDate,
    endDate,
  } = input;

  const days = Math.max(1, actualDays);

  // Unrounded raw calculations based on 365 days / year
  const rawCurrentInterest = (principal * (currentRate / 100) / 365) * days;
  const rawPreferentialInterest = (principal * (preferentialRate / 100) / 365) * days;

  // Round results to nearest integer VNĐ
  const currentInterest = Math.round(rawCurrentInterest);
  const preferentialInterest = Math.round(rawPreferentialInterest);

  // Total savings = difference between current and preferential interest
  const totalSavings = Math.max(0, currentInterest - preferentialInterest);

  // Bank fee = Total savings * Bank share % / 100
  const bankFee = Math.round(totalSavings * (bankSharePercent / 100));

  // Customer benefit = Total savings - Bank fee
  // Guarantees bankFee + customerBenefit === totalSavings exactly
  const customerBenefit = totalSavings - bankFee;

  // Rate reduction (%/year)
  const rateReduction = Number((currentRate - preferentialRate).toFixed(2));

  // Generate unique reference ID
  const dateObj = new Date();
  const dateCode = dateObj.toISOString().slice(2, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const referenceId = `VTB-LS-${dateCode}-${randomSuffix}`;

  return {
    principal,
    currentRate,
    preferentialRate,
    rateReduction,
    actualDays: days,
    startDate,
    endDate,
    currentInterest,
    preferentialInterest,
    totalSavings,
    bankFee,
    customerBenefit,
    bankSharePercent,
    customerSharePercent,
    calculationTimestamp: new Date().toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
    referenceId,
  };
}

/**
 * Format currency in Vietnamese Dong (e.g. 10.000.000.000 ₫)
 */
export function formatVND(amount: number, includeSymbol = true): string {
  const rounded = Math.round(amount);
  const formatted = new Intl.NumberFormat('vi-VN').format(rounded);
  return includeSymbol ? `${formatted} đồng` : formatted;
}

/**
 * Format compact VND for badges / cards (e.g. "10 Tỷ", "50 Tr")
 */
export function formatCompactVND(amount: number): string {
  if (amount >= 1_000_000_000) {
    const val = amount / 1_000_000_000;
    return `${val % 1 === 0 ? val : val.toFixed(1)} Tỷ`;
  }
  if (amount >= 1_000_000) {
    const val = amount / 1_000_000;
    return `${val % 1 === 0 ? val : val.toFixed(1)} Tr`;
  }
  return formatVND(amount);
}

/**
 * Format percentage (e.g. 9,00% / 7,5%)
 */
export function formatPercent(value: number, decimals = 2): string {
  return `${value.toFixed(decimals).replace('.', ',')}%`;
}

/**
 * Format date string (YYYY-MM-DD to DD/MM/YYYY)
 */
export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

/**
 * Converts numbers into Vietnamese spoken currency text
 * Essential for banking advisory documents
 */
const NUM_WORDS = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

function readGroup(group: number): string {
  const hundreds = Math.floor(group / 100);
  const tens = Math.floor((group % 100) / 10);
  const units = group % 10;
  let res = '';

  if (hundreds > 0 || group >= 100) {
    res += NUM_WORDS[hundreds] + ' trăm ';
  }

  if (tens === 0 && units !== 0 && (hundreds > 0 || group >= 100)) {
    res += 'lẻ ';
  } else if (tens === 1) {
    res += 'mười ';
  } else if (tens > 1) {
    res += NUM_WORDS[tens] + ' mươi ';
  }

  if (tens > 0 && units === 1) {
    if (tens === 1) {
      res += 'một';
    } else {
      res += 'mốt';
    }
  } else if (tens > 0 && units === 5) {
    res += 'lăm';
  } else if (units > 0) {
    res += NUM_WORDS[units];
  }

  return res.trim();
}

export function numberToVietnameseWords(amount: number): string {
  const num = Math.round(amount);
  if (num === 0) return 'Không đồng';
  if (num < 0) return 'Âm ' + numberToVietnameseWords(-num);

  const units = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];
  let temp = num;
  let unitIndex = 0;
  const groups: string[] = [];

  while (temp > 0) {
    const group = temp % 1000;
    if (group > 0) {
      const groupText = readGroup(group);
      const unit = units[unitIndex];
      groups.unshift(unit ? `${groupText} ${unit}` : groupText);
    }
    temp = Math.floor(temp / 1000);
    unitIndex++;
  }

  const result = groups.join(' ').replace(/\s+/g, ' ').trim();
  // Capitalize first letter and append "đồng"
  return result.charAt(0).toUpperCase() + result.slice(1) + ' đồng.';
}
