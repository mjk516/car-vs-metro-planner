export const CAR_COSTS = {
  // 감가상각률 (연간, 정률법 기준 - 잔존가치 대비 %)
  DEPRECIATION_RATES: {
    year1: 0.25,
    year2: 0.17,
    year3: 0.13,
    year4: 0.12,
    year5: 0.10,
    year6: 0.09,
    year7: 0.08,
    year8: 0.07,
    year9: 0.06,
    year10: 0.05,
    default: 0.04,
  },

  // 연도별 중고차 잔존가치율 (신차가격 대비 %)
  // 한국 중고차 시장 실거래 데이터 기반 (국산차 평균, 2024~2025년 기준)
  // 최근 차량 수명 연장 추세 반영 (10년 이상 운행 일반화)
  RESALE_VALUE_RATES: [
    1.00,  // 0년 (신차)
    0.82,  // 1년
    0.72,  // 2년
    0.63,  // 3년
    0.55,  // 4년
    0.48,  // 5년
    0.42,  // 6년
    0.37,  // 7년
    0.33,  // 8년
    0.29,  // 9년
    0.26,  // 10년
    0.23,  // 11년
    0.21,  // 12년
    0.19,  // 13년
    0.17,  // 14년
    0.16,  // 15년
  ],

  // 차종별 감가상각 보정 (기본 대비 배율)
  DEPRECIATION_MODIFIER: {
    domestic: 1.0,       // 국산차 기본
    imported: 1.15,      // 수입차 (감가 더 빠름)
    electric: 1.25,      // 전기차 (초기 감가 빠름, 기술 발전)
    hybrid: 0.90,        // 하이브리드 (감가 느림, 인기 높음)
    luxury: 1.20,        // 럭셔리 (감가 빠름)
  },

  // 보험료 (연간, 차량가격 기반 비율)
  INSURANCE: {
    rate: 0.035,
    min: 600000,
    max: 2000000,
    // 운전자 연령별 보정
    ageModifier: {
      under26: 1.30,     // 26세 미만 30% 할증
      age26to30: 1.10,   // 26~30세 10% 할증
      age31to65: 1.00,   // 31~65세 기본
      over65: 1.15,      // 65세 초과 15% 할증
    },
  },

  // 자동차세 (연간, 배기량 기준 - 가격대별 근사치)
  TAX: {
    under2000: 300000,
    under3000: 450000,
    under5000: 520000,
    over5000: 650000,
    electric: 130000,    // 전기차 고정
    // 차령에 따른 자동차세 경감률
    ageDiscount: {
      year3: 0.05,       // 3년차 5% 경감
      year4: 0.10,
      year5: 0.15,
      year6: 0.20,
      year7: 0.25,
      year8: 0.30,
      year9: 0.35,
      year10: 0.40,
      max: 0.50,         // 최대 50% 경감
    },
  },

  // 유류비 (연료 종류별)
  FUEL: {
    gasoline: {
      pricePerLiter: 1650,
      avgEfficiency: 12.5,
    },
    diesel: {
      pricePerLiter: 1500,
      avgEfficiency: 14.0,
    },
    lpg: {
      pricePerLiter: 1000,
      avgEfficiency: 9.5,
    },
    electric: {
      pricePerKwh: 250,       // 원/kWh (가정+공용 평균)
      avgEfficiency: 5.8,     // km/kWh
    },
    hybrid: {
      pricePerLiter: 1650,    // 휘발유 기준
      avgEfficiency: 19.0,    // 하이브리드 평균 연비
    },
    // 기본값 (하위 호환)
    pricePerLiter: 1650,
    avgFuelEfficiency: 12.5,
  },

  // 정비/수리비 (연간)
  MAINTENANCE: {
    gasoline: 800000,
    diesel: 900000,     // 디젤 필터 등 추가
    hybrid: 700000,     // 회생제동으로 브레이크 수명 연장
    electric: 400000,   // 엔진 없음, 소모품 적음
    yearly: 800000,     // 기본값
  },

  // 주차비 (월간, 지역별)
  PARKING: {
    monthly: 120000,    // 기본값 (수도권)
    byRegion: {
      seoul: 150000,
      gyeonggi: 100000,
      metropolitan: 80000,  // 광역시
      other: 50000,         // 기타 지역
    },
  },

  // 기타 비용 (세차, 통행료, 검사비 등 월간)
  MISC: {
    monthly: 50000,
    // 세부 항목
    carWash: 15000,         // 월 세차비
    toll: 20000,            // 월 통행료
    inspection: 5000,       // 월 검사비 (2년마다를 월할)
    accessories: 10000,     // 월 소모품 (워셔액, 방향제 등)
  },

  // 취득세 (차량 구매 시 1회)
  ACQUISITION_TAX: {
    rate: 0.07,              // 차량가의 7%
    electric: 0.04,          // 전기차 4% (감면)
    economyCar: 0.04,        // 경차 4% (감면)
  },
};

export const TRANSPORT_COSTS = {
  // 대중교통 월 정기권 (지역별)
  MONTHLY_PASS: 65000,
  BASE_FARE: 1500,
  EXTRA_FARE_PER_5KM: 100,
  MONTHLY_PASS_BY_REGION: {
    seoul: 65000,            // 기후동행카드
    gyeonggi: 70000,         // 경기 K-패스
    busan: 55000,
    other: 50000,
  },

  // 택시 보조비 (월간 - 야근, 긴급 등)
  TAXI_MONTHLY: {
    low: 50000,
    medium: 100000,
    high: 150000,
  },

  // 공유 모빌리티 (월간)
  SHARED_MOBILITY: {
    carsharing: 80000,       // 쏘카/그린카 월 평균
    kickboard: 30000,        // 전동킥보드 월 평균
    bike: 15000,             // 공유자전거 월 평균
  },

  // 야간/심야 할증
  LATE_NIGHT_SURCHARGE: {
    taxiRate: 1.4,           // 심야 40% 할증
    busLastTime: '23:30',
    subwayLastTime: '00:00',
  },
};

// 추천 결정 기준 임계값
export const THRESHOLDS = {
  SALARY_RATIO_LIMIT: 0.30,
  ASSET_RATIO_LIMIT: 0.50,
  COMMUTE_LONG: 30,
  MIN_ASSET_FOR_CAR: 1000,
};

// 분석 기간 (년) - 최근 차량 10년 이상 운행 추세 반영
export const ANALYSIS_YEARS = 15;