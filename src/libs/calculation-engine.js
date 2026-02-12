import { CAR_COSTS, TRANSPORT_COSTS, THRESHOLDS, ANALYSIS_YEARS } from '@/data/cost-constants';

/**
 * 연도별 잔존가치율 반환
 * @param {number} year - 연도 (0~)
 * @returns {number} 잔존가치율 (0~1)
 */
export function getResaleRate(year) {
  const rates = CAR_COSTS.RESALE_VALUE_RATES;
  if (year < rates.length) return rates[year];
  // 15년 초과: 연 2%씩 완만한 추가 하락 (최소 5% 유지)
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

/**
 * 자가용 연간 비용 계산
 * @param {object} inputs - 사용자 입력값
 * @returns {object} 비용 상세 내역
 */
export function calculateCarCosts(inputs) {
  const { carPrice, commuteDistance, commuteFrequency, fuelPrice } = inputs;
  const priceWon = carPrice * 10000;

  // 연간 주행거리 (편도 × 2 × 주당횟수 × 52주)
  const yearlyKm = commuteDistance * 2 * commuteFrequency * 52;

  // 1년차 감가상각 (잔존가치 기반)
  const depreciation = Math.round(priceWon * (getResaleRate(0) - getResaleRate(1)));

  // 유류비 (사용자 입력 연비 또는 기본값)
  const fuelEff = inputs.fuelEfficiency || CAR_COSTS.FUEL.avgFuelEfficiency;
  const actualFuelPrice = fuelPrice || CAR_COSTS.FUEL.pricePerLiter;
  const fuelCost = (yearlyKm / fuelEff) * actualFuelPrice;

  // 보험료 (사용자 입력 또는 차량가격 기반 자동 계산)
  const insurance = inputs.insuranceYearly != null
    ? inputs.insuranceYearly * 10000
    : Math.min(
        Math.max(priceWon * CAR_COSTS.INSURANCE.rate, CAR_COSTS.INSURANCE.min),
        CAR_COSTS.INSURANCE.max
      );

  // 자동차세 (사용자 입력 또는 가격대별 기본값)
  let tax;
  if (inputs.taxYearly != null) {
    tax = inputs.taxYearly * 10000;
  } else {
    if (carPrice <= 2000) tax = CAR_COSTS.TAX.under2000;
    else if (carPrice <= 3000) tax = CAR_COSTS.TAX.under3000;
    else if (carPrice <= 5000) tax = CAR_COSTS.TAX.under5000;
    else tax = CAR_COSTS.TAX.over5000;
  }

  // 정비비 (사용자 입력 또는 기본값)
  const maintenance = inputs.maintenanceYearly != null
    ? inputs.maintenanceYearly * 10000
    : CAR_COSTS.MAINTENANCE.yearly;

  // 주차비 (사용자 입력 또는 기본값, 연간)
  const parking = inputs.parkingMonthly != null
    ? inputs.parkingMonthly * 10000 * 12
    : CAR_COSTS.PARKING.monthly * 12;

  // 기타 비용 (사용자 입력 또는 기본값, 연간)
  const misc = inputs.miscMonthly != null
    ? inputs.miscMonthly * 10000 * 12
    : CAR_COSTS.MISC.monthly * 12;

  // 운영비 합계 (감가상각 제외 - 실제 현금 지출)
  const operatingTotal = fuelCost + insurance + tax + maintenance + parking + misc;

  // 연간 총비용 (감가상각 포함 - 경제적 비용)
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

  // 할부 설정
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
  // 초기 현금 지출: 할부 시 선수금, 일시불 시 전액
  let carCashSpent = inputs.useLoan ? (priceWon - loanPrincipal) : priceWon;
  let loanBalance = loanPrincipal;
  let totalInterestPaid = 0;
  let transportCumulative = 0;
  let breakEvenYear = null;

  for (let year = 1; year <= ANALYSIS_YEARS; year++) {
    // 운영비 (연간)
    carCashSpent += carCosts.operatingTotal;

    // 할부 원리금 상환 (월별 계산)
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

    // 해당 연도 잔존가치
    const resaleRate = getResaleRate(year);
    const resaleValue = priceWon * resaleRate;

    // 순비용 = 총 지출 + 잔여 대출금 - 잔존가치
    // (차량 처분 시: 잔존가치로 매각 → 대출 잔액 상환 → 남은 것이 회수금)
    const carNetCost = carCashSpent + Math.max(0, loanBalance) - resaleValue;

    // 대중교통 누적
    transportCumulative += transportCosts.yearlyTotal;

    // 총 지출 (매각 안 할 경우: 현금 지출 + 잔여 대출)
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

  let score = 0;
  const reasons = [];

  // 1. 비용 비교
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

  // 2. 자산 기반 지불 여력
  const assetCoverageYears = (assets * 10000) / carCosts.yearlyTotal;
  const isWealthy = assetCoverageYears >= 10 && affordability.assetRatio < 30;

  // 3. 연봉 대비 부담률
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

  // 4. 자산 대비 차량 가격
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

  // 5. 통근 거리
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

  // 6. 최소 자산 기준
  if (assets < THRESHOLDS.MIN_ASSET_FOR_CAR) {
    score -= 3;
    reasons.push({
      type: 'transport',
      text: `보유 자산(${assets}만원)이 차량 구매 최소 기준(1,000만원)에 미달합니다.`,
    });
  }

  // 7. 월 여유 자금 체크
  const monthlyDisposable = (salary * 10000 / 12) - (monthlyExpense * 10000);
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

  // 8. 할부 이자 부담 가산
  if (inputs.useLoan) {
    const loanResult = calculateLoan(
      carPrice,
      carPrice * (inputs.downPaymentPercent || 30) / 100,
      inputs.loanTermMonths || 48,
      inputs.loanRate || 4.5
    );
    const interestManWon = Math.round(loanResult.totalInterest / 10000);
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

/**
 * 할부 계산
 */
export function calculateLoan(totalPrice, downPayment, termMonths, annualRate) {
  const principal = (totalPrice - downPayment) * 10000;
  const monthlyRate = annualRate / 100 / 12;

  if (monthlyRate === 0) {
    return {
      monthlyPayment: Math.round(principal / termMonths),
      totalPayment: principal,
      totalInterest: 0,
    };
  }

  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);

  const totalPayment = monthlyPayment * termMonths;
  const totalInterest = totalPayment - principal;

  return {
    monthlyPayment: Math.round(monthlyPayment),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
  };
}
