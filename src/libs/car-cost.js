import { CAR_COSTS } from '@/data/cost-constants';
import { getResaleRate } from './resale';
import { calculateLoan } from './loan'; // 할부 계산을 위해 임포트 추가

/**
 * 자가용 연간 비용 계산
 * @param {object} inputs - 사용자 입력값
 * @returns {object} 비용 상세 내역
 */
export function calculateCarCosts(inputs) {
  const { carPrice, commuteDistance, commuteFrequency, fuelPrice } = inputs;
  const priceWon = carPrice * 10000;

  // 주행거리 계산
  const commuteYearlyKm = commuteDistance * 2 * commuteFrequency * 52;
  const weekendTrips = inputs.weekendTripsPerMonth || 0;
  const weekendDistance = inputs.weekendTripDistance || 0;
  const weekendYearlyKm = weekendTrips * weekendDistance * 12;
  const yearlyKm = commuteYearlyKm + weekendYearlyKm;

  // 1. 감가상각비 (일시불 기준일 때 사용)
  const depreciation = Math.round(priceWon * (getResaleRate(0) - getResaleRate(1)));

  // 2. 할부금 계산 (할부 기준일 때 사용)
  let loanPaymentYearly = 0;
  if (inputs.useLoan) {
    const loanResult = calculateLoan(
      carPrice,
      carPrice * (inputs.downPaymentPercent || 30) / 100,
      inputs.loanTermMonths || 48,
      inputs.loanRate || 4.5
    );
    // UI에서 보여주는 '할부원금+이자'의 연간 총합
    loanPaymentYearly = loanResult.monthlyPayment * 12;
    
  }

  // 운영 비용 항목들
  const fuelEff = inputs.fuelEfficiency || CAR_COSTS.FUEL.avgFuelEfficiency;
  const actualFuelPrice = fuelPrice || CAR_COSTS.FUEL.pricePerLiter;
  const fuelCost = (yearlyKm / fuelEff) * actualFuelPrice;

  const insurance = inputs.insuranceYearly != null
    ? inputs.insuranceYearly * 10000
    : Math.min(Math.max(priceWon * CAR_COSTS.INSURANCE.rate, CAR_COSTS.INSURANCE.min), CAR_COSTS.INSURANCE.max);

  let tax;
  if (inputs.taxYearly != null) {
    tax = inputs.taxYearly * 10000;
  } else {
    if (carPrice <= 2000) tax = CAR_COSTS.TAX.under2000;
    else if (carPrice <= 3000) tax = CAR_COSTS.TAX.under3000;
    else if (carPrice <= 5000) tax = CAR_COSTS.TAX.under5000;
    else tax = CAR_COSTS.TAX.over5000;
  }

  const maintenance = inputs.maintenanceYearly != null ? inputs.maintenanceYearly * 10000 : CAR_COSTS.MAINTENANCE.yearly;
  const parking = inputs.parkingMonthly != null ? inputs.parkingMonthly * 10000 * 12 : CAR_COSTS.PARKING.monthly * 12;
  const misc = inputs.miscMonthly != null ? inputs.miscMonthly * 10000 * 12 : CAR_COSTS.MISC.monthly * 12;

  // 3. 순수 운영비 합계
  const operatingTotal = fuelCost + insurance + tax + maintenance + parking + misc;

  // 4. 최종 합계 결정 (핵심 수정!)
  // 할부 구매라면 [할부금 + 운영비], 아니라면 [감가상각 + 운영비]
  const yearlyTotal = inputs.useLoan 
    ? (loanPaymentYearly + operatingTotal) 
    : (depreciation + operatingTotal);

  return {
    depreciation,
    loanPayment: loanPaymentYearly, // 추가: UI에서 합계 검증용으로 사용
    fuelCost: Math.round(fuelCost),
    insurance: Math.round(insurance),
    tax: Math.round(tax),
    maintenance: Math.round(maintenance),
    parking: Math.round(parking),
    misc: Math.round(misc),
    yearlyTotal: Math.round(yearlyTotal),
    monthlyTotal: Math.round(yearlyTotal / 12),
    yearlyKm,
    operatingTotal: Math.round(operatingTotal),
  };
}