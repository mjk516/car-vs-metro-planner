import { TRANSPORT_COSTS } from '@/data/cost-constants';

/**
 * 대중교통 연간 비용 계산
 * @param {object} inputs - 사용자 입력값
 * @returns {object} 비용 상세 내역
 */
export function calculateTransportCosts(inputs) {
  const { commuteDistance, weekendTripsPerMonth, weekendTripDistance } = inputs;

  const monthlyPass = TRANSPORT_COSTS.MONTHLY_PASS;

  let taxiMonthly;
  if (commuteDistance <= 10) {
    taxiMonthly = TRANSPORT_COSTS.TAXI_MONTHLY.low;
  } else if (commuteDistance <= 25) {
    taxiMonthly = TRANSPORT_COSTS.TAXI_MONTHLY.medium;
  } else {
    taxiMonthly = TRANSPORT_COSTS.TAXI_MONTHLY.high;
  }

  // 주말/공휴일 이동 비용 계산
  const trips = weekendTripsPerMonth || 0;
  const dist = weekendTripDistance || 0;
  
  // 기본 1,500원 + 10km 초과시 5km당 100원 추가 (한국 대중교통 표준 기준)
  let farePerTrip = TRANSPORT_COSTS.BASE_FARE || 1500;
  if (dist > 10) {
    farePerTrip += Math.ceil((dist - 10) / 5) * (TRANSPORT_COSTS.EXTRA_FARE_PER_5KM || 100);
  }
  
  const weekendMonthly = trips * 2 * farePerTrip; // 왕복 기준

  const monthlyTotal = monthlyPass + taxiMonthly + weekendMonthly;
  const yearlyTotal = monthlyTotal * 12;

  return {
    monthlyPass,
    taxiMonthly,
    weekendMonthly,
    monthlyTotal,
    yearlyTotal,
  };
}