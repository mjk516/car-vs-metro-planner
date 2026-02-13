import { CAR_COSTS } from '@/data/cost-constants';

/**
 * 연도별 잔존가치율 반환
 * @param {number} year - 연도 (0~)
 * @returns {number} 잔존가치율 (0~1)
 */
export function getResaleRate(year) {
  const rates = CAR_COSTS.RESALE_VALUE_RATES;
  if (year < rates.length) return rates[year];
  return Math.max(0.05, rates[rates.length - 1] * Math.pow(0.98, year - rates.length + 1));
}

/**
 * 차량 잔존가치 계산
 * @param {number} carPrice - 차량 가격 (만원)
 * @param {number} year - 연도
 * @returns {number} 잔존가치 (원)
 */
export function getResaleValue(carPrice, year) {
  return Math.round(carPrice * 10000 * getResaleRate(year));
}
