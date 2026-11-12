/**
 * Type definitions for Preferential Loan Interest Efficiency Analysis Tool
 * Author: Huỳnh Thái Hào
 */

export interface LoanInput {
  principal: number; // Dư nợ vay (VNĐ)
  currentRate: number; // Lãi suất hiện tại (%/năm)
  preferentialRate: number; // Lãi suất ưu đãi (%/năm)
  durationMonths: number | null; // Số tháng
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  actualDays: number; // Số ngày thực tế
  bankSharePercent: number; // Tỷ lệ ngân hàng hưởng (%)
  customerSharePercent: number; // Tỷ lệ khách hàng hưởng (%)
  customerName?: string; // Tên khách hàng / Doanh nghiệp
  contractNo?: string; // Số Hợp đồng tín dụng
  officerName?: string; // Cán bộ quan hệ khách hàng
  officerPhone?: string; // SĐT cán bộ
}

export interface CalculationResult {
  principal: number;
  currentRate: number;
  preferentialRate: number;
  rateReduction: number;
  actualDays: number;
  startDate: string;
  endDate: string;
  currentInterest: number;
  preferentialInterest: number;
  totalSavings: number;
  bankFee: number;
  customerBenefit: number;
  bankSharePercent: number;
  customerSharePercent: number;
  calculationTimestamp: string;
  referenceId: string;
}

export interface SharePreset {
  label: string;
  bank: number;
  customer: number;
}
