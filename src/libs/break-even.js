import { ANALYSIS_YEARS } from '@/data/cost-constants';
import { getResaleRate } from './resale';
import { calculateCarCosts } from './car-cost';
import { calculateTransportCosts } from './transport-cost';

/**
 * 감가상각 계산 (연도별) - 잔존가치 기반
 * @param {number} price - 차량 가격 (원)
 * @param {number} year - 연도 (1~)
 * @returns {number} 해당 연도 감가상각 금액
 */
export function calculateDepreciation(price, year) {
  return Math.round(price * (getResaleRate(year - 1) - getResaleRate(year)));
}

/**
 * 손익분기점 계산 (순비용 = 총 지출 - 잔존가치)
 * @param {object} inputs - 사용자 입력값
 * @returns {object} 연도별 누적 비용 데이터 & 손익분기점
 */
export function calculateBreakEvenPoint(inputs) {
  const carCosts = calculateCarCosts(inputs);
  const transportCosts = calculateTransportCosts(inputs);
  const priceWon = inputs.carPrice * 10000;

  let loanMonthlyPayment = 0;
  let loanMonthlyRate = 0;
  let loanPrincipal = 0;
  let loanTermMonths = 0;

  if (inputs.useLoan) {
    const downPaymentPercent = inputs.downPaymentPercent || 30;
    loanTermMonths = inputs.loanTermMonths || 48;
    const loanRate = inputs.loanRate || 4.5;
    loanPrincipal = priceWon * (1 - downPaymentPercent / 100);
    loanMonthlyRate = loanRate / 100 / 12;

    if (loanMonthlyRate > 0) {
      loanMonthlyPayment =
        (loanPrincipal * loanMonthlyRate * Math.pow(1 + loanMonthlyRate, loanTermMonths)) /
        (Math.pow(1 + loanMonthlyRate, loanTermMonths) - 1);
    } else {
      loanMonthlyPayment = loanPrincipal / loanTermMonths;
    }
  }

  const data = [];
  let carCashSpent = inputs.useLoan ? (priceWon - loanPrincipal) : priceWon;
  let loanBalance = loanPrincipal;
  let totalInterestPaid = 0;
  let transportCumulative = 0;
  let breakEvenYear = null;

  for (let year = 1; year <= ANALYSIS_YEARS; year++) {
    carCashSpent += carCosts.operatingTotal;

    if (inputs.useLoan && loanBalance > 0) {
      for (let m = 0; m < 12; m++) {
        if (loanBalance <= 0) break;
        const interest = loanBalance * loanMonthlyRate;
        const principalPayment = Math.min(loanMonthlyPayment - interest, loanBalance);
        carCashSpent += loanMonthlyPayment;
        totalInterestPaid += interest;
        loanBalance = Math.max(0, loanBalance - principalPayment);
      }
    }

    const resaleRate = getResaleRate(year);
    const resaleValue = priceWon * resaleRate;

    const carNetCost = carCashSpent + Math.max(0, loanBalance) - resaleValue;
    transportCumulative += transportCosts.yearlyTotal;

    const carGrossCost = carCashSpent + Math.max(0, loanBalance);

    data.push({
      year,
      car: Math.round(carNetCost / 10000),
      carGross: Math.round(carGrossCost / 10000),
      transport: Math.round(transportCumulative / 10000),
      resale: Math.round(resaleValue / 10000),
      carLabel: `${year}년`,
    });

    if (!breakEvenYear && transportCumulative > carNetCost) {
      breakEvenYear = year;
    }
  }

  const lastData = data[data.length - 1];
  return {
    data,
    breakEvenYear,
    totalCarCost: lastData.car,
    totalTransportCost: lastData.transport,
    resaleValueAtEnd: lastData.resale,
    totalInterestPaid: Math.round(totalInterestPaid / 10000),
  };
}
