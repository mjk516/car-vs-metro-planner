import { CAR_COSTS } from '@/data/cost-constants';
import { getResaleRate } from './resale';

/**
 * 자가용 연간 비용 계산
 * @param {object} inputs - 사용자 입력값
 * @returns {object} 비용 상세 내역
 */
export function calculateCarCosts(inputs) {
  const { carPrice, commuteDistance, commuteFrequency, fuelPrice } = inputs;
  const priceWon = carPrice * 10000;

  // 평일 통근 주행거리
  const commuteYearlyKm = commuteDistance * 2 * commuteFrequency * 52;
  // 주말/공휴일 주행거리
  const weekendTrips = inputs.weekendTripsPerMonth || 0;
  const weekendDistance = inputs.weekendTripDistance || 0;
  const weekendYearlyKm = weekendTrips * weekendDistance * 12;
  // 연간 총 주행거리
  const yearlyKm = commuteYearlyKm + weekendYearlyKm;

  const depreciation = Math.round(priceWon * (getResaleRate(0) - getResaleRate(1)));

  const fuelEff = inputs.fuelEfficiency || CAR_COSTS.FUEL.avgFuelEfficiency;
  const actualFuelPrice = fuelPrice || CAR_COSTS.FUEL.pricePerLiter;
  const fuelCost = (yearlyKm / fuelEff) * actualFuelPrice;

  const insurance = inputs.insuranceYearly != null
    ? inputs.insuranceYearly * 10000
    : Math.min(
        Math.max(priceWon * CAR_COSTS.INSURANCE.rate, CAR_COSTS.INSURANCE.min),
        CAR_COSTS.INSURANCE.max
      );

  let tax;
  if (inputs.taxYearly != null) {
    tax = inputs.taxYearly * 10000;
  } else {
    if (carPrice <= 2000) tax = CAR_COSTS.TAX.under2000;
    else if (carPrice <= 3000) tax = CAR_COSTS.TAX.under3000;
    else if (carPrice <= 5000) tax = CAR_COSTS.TAX.under5000;
    else tax = CAR_COSTS.TAX.over5000;
  }

  const maintenance = inputs.maintenanceYearly != null
    ? inputs.maintenanceYearly * 10000
    : CAR_COSTS.MAINTENANCE.yearly;

  const parking = inputs.parkingMonthly != null
    ? inputs.parkingMonthly * 10000 * 12
    : CAR_COSTS.PARKING.monthly * 12;

  const misc = inputs.miscMonthly != null
    ? inputs.miscMonthly * 10000 * 12
    : CAR_COSTS.MISC.monthly * 12;

  const operatingTotal = fuelCost + insurance + tax + maintenance + parking + misc;
  const yearlyTotal = depreciation + operatingTotal;

  return {
    depreciation,
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
