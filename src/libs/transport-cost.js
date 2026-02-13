import { TRANSPORT_COSTS } from '@/data/cost-constants';

/**
 * 대중교통 연간 비용 계산
 * @param {object} inputs - 사용자 입력값
 * @returns {object} 비용 상세 내역
 */
export function calculateTransportCosts(inputs) {
  const { commuteDistance } = inputs;

  const monthlyPass = TRANSPORT_COSTS.MONTHLY_PASS;

  let taxiMonthly;
  if (commuteDistance <= 10) {
    taxiMonthly = TRANSPORT_COSTS.TAXI_MONTHLY.low;
  } else if (commuteDistance <= 25) {
    taxiMonthly = TRANSPORT_COSTS.TAXI_MONTHLY.medium;
  } else {
    taxiMonthly = TRANSPORT_COSTS.TAXI_MONTHLY.high;
  }

  const monthlyTotal = monthlyPass + taxiMonthly;
  const yearlyTotal = monthlyTotal * 12;

  return {
    monthlyPass,
    taxiMonthly,
    monthlyTotal,
    yearlyTotal,
  };
}
