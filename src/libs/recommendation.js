import { THRESHOLDS } from '@/data/cost-constants';
import { calculateCarCosts } from './car-cost';
import { calculateTransportCosts } from './transport-cost';
import { calculateBreakEvenPoint } from './break-even';
import { calculateLoan } from './loan';

/**
 * 소득/자산 대비 부담률 계산
 */
export function calculateAffordability(salary, assets, carPrice, yearlyCarCost) {
  const salaryWon = salary * 10000;
  const salaryRatio = yearlyCarCost / salaryWon;
  const assetRatio = carPrice / assets;

  return {
    salaryRatio: Math.round(salaryRatio * 1000) / 10,
    assetRatio: Math.round(assetRatio * 1000) / 10,
    isSalaryBurden: salaryRatio > THRESHOLDS.SALARY_RATIO_LIMIT,
    isAssetBurden: assetRatio > THRESHOLDS.ASSET_RATIO_LIMIT,
  };
}

/**
 * 최종 추천 결정
 */
export function makeRecommendation(inputs) {
  const { salary, assets, monthlyExpense, commuteDistance, commuteFrequency, carPrice } = inputs;

  const carCosts = calculateCarCosts(inputs);
  const transportCosts = calculateTransportCosts(inputs);
  const affordability = calculateAffordability(salary, assets, carPrice, carCosts.yearlyTotal);
  const breakEven = calculateBreakEvenPoint(inputs);

  // 할부 데이터 계산
  let loanCosts = null;
  if (inputs.useLoan) {
    loanCosts = calculateLoan(
      carPrice,
      carPrice * (inputs.downPaymentPercent || 30) / 100,
      inputs.loanTermMonths || 48,
      inputs.loanRate || 4.5
    );
  }

  // 월 여유 자금 계산 (중복 선언 방지를 위해 상단에서 한 번만 선언)
  const monthlyDisposable = (salary * 10000 / 12) - (monthlyExpense * 10000);

  let score = 0;
  const reasons = [];

  // 비용 비교
  if (carCosts.yearlyTotal < transportCosts.yearlyTotal) {
    score += 2;
    reasons.push({
      type: 'car',
      text: `자가용 연간비용(${Math.round(carCosts.yearlyTotal / 10000)}만원)이 대중교통(${Math.round(transportCosts.yearlyTotal / 10000)}만원)보다 저렴합니다.`,
    });
  } else {
    const diff = carCosts.yearlyTotal - transportCosts.yearlyTotal;
    score -= 1;
    reasons.push({
      type: 'transport',
      text: `대중교통이 연간 약 ${Math.round(diff / 10000)}만원 더 절약됩니다.`,
    });
  }

  const assetCoverageYears = (assets * 10000) / carCosts.yearlyTotal;
  const isWealthy = assetCoverageYears >= 10 && affordability.assetRatio < 30;

  // 연봉 대비 분석
  if (affordability.isSalaryBurden && !isWealthy) {
    score -= 2;
    reasons.push({
      type: 'transport',
      text: `연봉 대비 자가용 비용 비율이 ${affordability.salaryRatio}%로 부담이 큽니다 (권장: 30% 이하).`,
    });
  } else if (affordability.isSalaryBurden && isWealthy) {
    score += 1;
    reasons.push({
      type: 'car',
      text: `연봉 대비 비율은 ${affordability.salaryRatio}%이나, 보유 자산으로 ${Math.round(assetCoverageYears)}년간 충당 가능합니다.`,
    });
  } else if (affordability.salaryRatio < 15) {
    score += 2;
    reasons.push({
      type: 'car',
      text: `연봉 대비 자가용 비용 비율이 ${affordability.salaryRatio}%로 매우 여유롭습니다.`,
    });
  } else {
    score += 1;
    reasons.push({
      type: 'car',
      text: `연봉 대비 자가용 비용 비율이 ${affordability.salaryRatio}%로 적정합니다.`,
    });
  }

  // 자산 대비 분석
  if (affordability.isAssetBurden) {
    score -= 2;
    reasons.push({
      type: 'transport',
      text: `보유 자산 대비 차량 가격 비율이 ${affordability.assetRatio}%로 높습니다 (권장: 50% 이하).`,
    });
  } else if (affordability.assetRatio < 10) {
    score += 3;
    reasons.push({
      type: 'car',
      text: `보유 자산 대비 차량 가격이 ${affordability.assetRatio}%로, 구매에 매우 여유롭습니다.`,
    });
  } else if (affordability.assetRatio < 30) {
    score += 2;
    reasons.push({
      type: 'car',
      text: `보유 자산 대비 차량 가격이 ${affordability.assetRatio}%로 충분히 감당 가능합니다.`,
    });
  } else if (assets >= THRESHOLDS.MIN_ASSET_FOR_CAR) {
    score += 1;
    reasons.push({
      type: 'car',
      text: `보유 자산으로 차량 구매가 가능한 수준입니다.`,
    });
  }

  // 통근 거리 분석
  if (commuteDistance >= THRESHOLDS.COMMUTE_LONG) {
    score += 2;
    reasons.push({
      type: 'car',
      text: `편도 ${commuteDistance}km로 장거리 통근이므로 자가용이 편리합니다.`,
    });
  } else if (commuteDistance <= 10) {
    score -= 1;
    reasons.push({
      type: 'transport',
      text: `편도 ${commuteDistance}km로 단거리 통근이므로 대중교통이 효율적입니다.`,
    });
  }

  // 최소 자산 기준
  if (assets < THRESHOLDS.MIN_ASSET_FOR_CAR) {
    score -= 3;
    reasons.push({
      type: 'transport',
      text: `보유 자산(${assets}만원)이 차량 구매 최소 기준(1,000만원)에 미달합니다.`,
    });
  }

  // 월 여유자금 분석
  if (monthlyDisposable < carCosts.monthlyTotal && !isWealthy) {
    score -= 2;
    reasons.push({
      type: 'transport',
      text: `월 여유자금(${Math.round(monthlyDisposable / 10000)}만원)이 자가용 월비용(${Math.round(carCosts.monthlyTotal / 10000)}만원)보다 적습니다.`,
    });
  } else if (monthlyDisposable < carCosts.monthlyTotal && isWealthy) {
    reasons.push({
      type: 'car',
      text: `월 여유자금은 부족하나, 보유 자산으로 비용 충당이 가능합니다.`,
    });
  } else if (monthlyDisposable > carCosts.monthlyTotal * 3) {
    score += 1;
    reasons.push({
      type: 'car',
      text: `월 여유자금이 자가용 비용 대비 충분합니다.`,
    });
  }

  // 할부 이자 비중 분석
  if (inputs.useLoan && loanCosts) {
    const interestManWon = Math.round(loanCosts.totalInterest / 10000);
    if (interestManWon > carPrice * 0.1) {
      score -= 1;
      reasons.push({
        type: 'transport',
        text: `할부 이자(${interestManWon}만원)가 차량가격의 ${Math.round(interestManWon / carPrice * 100)}%로 추가 부담이 됩니다.`,
      });
    }
  }

  const recommendation = score > 0 ? 'car' : 'transport';
  const savingsPerYear = recommendation === 'transport'
    ? carCosts.yearlyTotal - transportCosts.yearlyTotal
    : 0;

  return {
    recommendation,
    score,
    reasons,
    carCosts,
    loanCosts,
    transportCosts,
    affordability,
    breakEven,
    savingsPerYear: Math.round(savingsPerYear / 10000),
    monthlyDisposable: Math.round(monthlyDisposable),
  };
}

/**
 * 투자 성향 추천
 */
export function recommendInvestmentProfile(salary, assets) {
  if (salary >= 5000 && assets >= 10000) return 'aggressive';
  if (salary >= 3000 || assets >= 5000) return 'balanced';
  return 'conservative';
}