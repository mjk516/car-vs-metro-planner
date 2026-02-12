// 투자 상품 추천 데이터 (2024~2025년 한국 시장 기준)

export const INVESTMENT_PROFILES = {
  conservative: {
    id: 'conservative',
    name: '안정형',
    description: '원금 보존을 최우선으로 하는 보수적 투자',
    riskLevel: 1,
    expectedReturn: '3~5%',
    allocation: {
      deposit: 40, // 예금/적금
      bond: 35, // 채권
      stock: 15, // 주식
      etc: 10, // 기타 (금, 리츠 등)
    },
    suitableFor: '안정적인 수익을 원하거나 투자 경험이 적은 분',
    keyStrategy: '예적금 중심 + 국채 ETF 배분으로 안정적 이자수익 확보',
  },
  balanced: {
    id: 'balanced',
    name: '균형형',
    description: '안정성과 수익성의 균형을 추구하는 투자',
    riskLevel: 2,
    expectedReturn: '5~8%',
    allocation: {
      deposit: 20,
      bond: 25,
      stock: 40,
      etc: 15,
    },
    suitableFor: '중장기 투자를 통해 자산 증식을 원하는 분',
    keyStrategy: '국내외 지수 ETF 중심 + 채권으로 리스크 분산',
  },
  aggressive: {
    id: 'aggressive',
    name: '성장형',
    description: '높은 수익을 추구하며 변동성을 감수하는 투자',
    riskLevel: 3,
    expectedReturn: '8~12%',
    allocation: {
      deposit: 10,
      bond: 10,
      stock: 65,
      etc: 15,
    },
    suitableFor: '장기 투자 가능하고 단기 손실을 감내할 수 있는 분',
    keyStrategy: '성장주·섹터 ETF 집중 + 글로벌 분산으로 고수익 추구',
  },
};

export const RECOMMENDED_PRODUCTS = {
  // ========== 예금/적금 ==========
  deposit: [
    {
      name: '정기예금 (시중은행)',
      expectedReturn: '3.0~3.5%',
      riskLevel: 1,
      description: '원금 보장, 예금자보호 5천만원',
      minAmount: 100,
      term: '1년',
    },
    {
      name: '정기적금 (인터넷은행)',
      expectedReturn: '3.5~4.0%',
      riskLevel: 1,
      description: '매월 일정금액 저축, 복리 효과',
      minAmount: 10,
      term: '1년',
    },
    {
      name: 'CMA (종금형)',
      expectedReturn: '3.0~3.5%',
      riskLevel: 1,
      description: '수시입출금 가능, 증권사 운용',
      minAmount: 1,
      term: '수시',
    },
    {
      name: '청년도약계좌',
      expectedReturn: '4.5~6.0%',
      riskLevel: 1,
      description: '만 19~34세 대상, 정부 기여금 지원, 비과세',
      minAmount: 70,
      term: '5년',
      eligibility: '만 19~34세, 총급여 7,500만원 이하',
    },
    {
      name: 'ISA (중개형)',
      expectedReturn: '다양',
      riskLevel: 1,
      description: '비과세 200~400만원, 예금·펀드·ETF 통합 관리',
      minAmount: 1,
      term: '3년 이상',
      eligibility: '19세 이상 거주자',
    },
  ],

  // ========== 채권 ==========
  bond: [
    {
      name: 'KODEX 국고채 10년',
      ticker: '148070',
      expectedReturn: '3.5~4.5%',
      riskLevel: 1,
      description: '한국 국채 ETF, 안정적 이자수익',
      category: '국내 채권',
    },
    {
      name: 'TIGER 미국채10년선물',
      ticker: '305080',
      expectedReturn: '4.0~5.0%',
      riskLevel: 2,
      description: '미국 국채 ETF, 환율 변동 포함',
      category: '해외 채권',
    },
    {
      name: 'TIGER 단기통안채',
      ticker: '157450',
      expectedReturn: '3.0~3.5%',
      riskLevel: 1,
      description: '초단기 채권 ETF, 현금성 자산 대안',
      category: '국내 채권',
    },
    {
      name: 'KODEX 미국30년국채+12%프리미엄',
      ticker: '474220',
      expectedReturn: '4.5~6.0%',
      riskLevel: 2,
      description: '미국 장기 국채 + 프리미엄 전략',
      category: '해외 채권',
    },
  ],

  // ========== ETF ==========
  etf: [
    // 국내 지수
    {
      name: 'KODEX 200',
      ticker: '069500',
      expectedReturn: '7~10%',
      riskLevel: 2,
      description: '코스피200 추종 ETF, 한국 대표 지수',
      category: '국내 지수',
    },
    {
      name: 'KODEX 코스닥150',
      ticker: '229200',
      expectedReturn: '8~12%',
      riskLevel: 3,
      description: '코스닥150 추종, 중소형 성장주 투자',
      category: '국내 지수',
    },
    // 해외 지수
    {
      name: 'TIGER 미국S&P500',
      ticker: '360750',
      expectedReturn: '8~12%',
      riskLevel: 2,
      description: '미국 S&P500 추종, 글로벌 분산 투자',
      category: '해외 지수',
    },
    {
      name: 'TIGER 미국나스닥100',
      ticker: '133690',
      expectedReturn: '10~15%',
      riskLevel: 2,
      description: '나스닥100 추종, 미국 빅테크 중심',
      category: '해외 지수',
    },
    {
      name: 'TIGER 일본니케이225',
      ticker: '241390',
      expectedReturn: '7~10%',
      riskLevel: 2,
      description: '일본 니케이225 추종, 엔저 수혜 가능',
      category: '해외 지수',
    },
    // 배당/가치
    {
      name: 'KODEX 배당가치',
      ticker: '290130',
      expectedReturn: '5~8%',
      riskLevel: 2,
      description: '고배당 우량주 중심, 배당 수익 + 시세 차익',
      category: '배당',
    },
    {
      name: 'TIGER 미국배당+7%프리미엄다우존스',
      ticker: '458730',
      expectedReturn: '6~9%',
      riskLevel: 2,
      description: '미국 배당 성장주 + 프리미엄 전략',
      category: '배당',
    },
    // 섹터
    {
      name: 'KODEX 2차전지산업',
      ticker: '305720',
      expectedReturn: '10~15%',
      riskLevel: 3,
      description: '2차전지 섹터 집중 투자',
      category: '섹터',
    },
    {
      name: 'TIGER 반도체',
      ticker: '091230',
      expectedReturn: '10~15%',
      riskLevel: 3,
      description: '반도체 섹터 집중 투자',
      category: '섹터',
    },
    {
      name: 'KODEX 바이오',
      ticker: '244580',
      expectedReturn: '변동',
      riskLevel: 3,
      description: '바이오/헬스케어 섹터, 높은 성장 잠재력',
      category: '섹터',
    },
    // 리츠/부동산
    {
      name: 'TIGER 리츠부동산인프라',
      ticker: '329200',
      expectedReturn: '5~7%',
      riskLevel: 2,
      description: '국내 리츠·부동산 인프라 투자, 배당 수익',
      category: '리츠',
    },
  ],

  // ========== 개별 주식 ==========
  stocks: [
    // 대형 우량주
    {
      name: '삼성전자',
      ticker: '005930',
      expectedReturn: '변동',
      riskLevel: 2,
      description: '한국 대표 기업, 반도체/IT 리더',
      category: '대형주',
      reason: '글로벌 반도체 수요 증가, 안정적 배당',
      dividendYield: '2.0~2.5%',
    },
    {
      name: 'SK하이닉스',
      ticker: '000660',
      expectedReturn: '변동',
      riskLevel: 3,
      description: 'HBM 메모리 선도 기업',
      category: '대형주',
      reason: 'AI 시대 HBM 수요 급증, 기술 경쟁력',
    },
    {
      name: '현대자동차',
      ticker: '005380',
      expectedReturn: '변동',
      riskLevel: 2,
      description: '글로벌 완성차 기업, 전기차 전환',
      category: '대형주',
      reason: '글로벌 시장 점유율 확대, 전기차 라인업',
      dividendYield: '3.0~4.0%',
    },
    // IT/플랫폼
    {
      name: 'NAVER',
      ticker: '035420',
      expectedReturn: '변동',
      riskLevel: 3,
      description: '한국 대표 IT 플랫폼 기업',
      category: '성장주',
      reason: 'AI·클라우드 사업 확장, 플랫폼 경쟁력',
    },
    {
      name: '카카오',
      ticker: '035720',
      expectedReturn: '변동',
      riskLevel: 3,
      description: '종합 플랫폼 기업, 다양한 사업 포트폴리오',
      category: '성장주',
      reason: '금융·모빌리티·콘텐츠 성장 잠재력',
    },
    // 배당주
    {
      name: 'KT&G',
      ticker: '033780',
      expectedReturn: '변동',
      riskLevel: 2,
      description: '안정적 현금흐름, 한국 대표 배당주',
      category: '배당주',
      reason: '높은 배당수익률, 안정적 이익 구조',
      dividendYield: '5.0~6.0%',
    },
    {
      name: 'KB금융',
      ticker: '105560',
      expectedReturn: '변동',
      riskLevel: 2,
      description: '국내 최대 금융지주, 안정적 배당',
      category: '배당주',
      reason: '금리 환경 수혜, 주주환원 정책 강화',
      dividendYield: '4.0~5.0%',
    },
    {
      name: '포스코홀딩스',
      ticker: '005490',
      expectedReturn: '변동',
      riskLevel: 2,
      description: '철강·소재 리더, 2차전지 소재 사업 확장',
      category: '대형주',
      reason: '리튬·니켈 등 2차전지 소재 밸류체인 확보',
      dividendYield: '3.0~4.0%',
    },
    // 성장주
    {
      name: 'LG에너지솔루션',
      ticker: '373220',
      expectedReturn: '변동',
      riskLevel: 3,
      description: '글로벌 2차전지 선도 기업',
      category: '성장주',
      reason: '전기차 배터리 글로벌 점유율 상위, 북미 생산 확대',
    },
    {
      name: '셀트리온',
      ticker: '068270',
      expectedReturn: '변동',
      riskLevel: 3,
      description: '바이오시밀러 글로벌 리더',
      category: '성장주',
      reason: '바이오시밀러 시장 확대, 자체 유통망 구축',
    },
  ],

  // ========== 대체자산/기타 ==========
  etc: [
    {
      name: 'KODEX 골드선물(H)',
      ticker: '132030',
      expectedReturn: '5~10%',
      riskLevel: 2,
      description: '금 가격 추종 ETF, 인플레이션 헤지',
      category: '원자재',
    },
    {
      name: 'KODEX 은선물(H)',
      ticker: '144600',
      expectedReturn: '변동',
      riskLevel: 3,
      description: '은 가격 추종 ETF, 산업 수요 + 안전자산',
      category: '원자재',
    },
  ],
};

// 투자 성향 판단 기준
export const PROFILE_CRITERIA = {
  HIGH_INCOME_THRESHOLD: 5000,  // 연봉 5000만원 이상
  HIGH_ASSET_THRESHOLD: 10000,  // 자산 1억 이상
};

// 복리 계산 참고 상수
export const COMPOUND_INTEREST = {
  conservative: 0.04,  // 4% (안정형 중간값)
  balanced: 0.065,     // 6.5% (균형형 중간값)
  aggressive: 0.10,    // 10% (성장형 중간값)
};
