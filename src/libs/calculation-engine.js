/**
 * 계산 엔진 통합 모듈 (Barrel Export)
 *
 * 각 기능은 개별 모듈로 분리되어 있으며,
 * 기존 import 호환성을 위해 여기서 재수출합니다.
 */

export { getResaleRate, getResaleValue } from './resale';
export { calculateCarCosts } from './car-cost';
export { calculateTransportCosts } from './transport-cost';
export { calculateDepreciation, calculateBreakEvenPoint } from './break-even';
export { calculateAffordability, makeRecommendation, recommendInvestmentProfile } from './recommendation';
export { calculateLoan } from './loan';
