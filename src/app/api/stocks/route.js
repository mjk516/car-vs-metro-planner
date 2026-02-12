import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

// 한국 주식/ETF 티커 매핑 (Yahoo Finance 형식)
const TICKER_MAP = {
  // 개별 주식
  '005930': '005930.KS',  // 삼성전자
  '000660': '000660.KS',  // SK하이닉스
  '005380': '005380.KS',  // 현대자동차
  '035420': '035420.KS',  // NAVER
  '035720': '035720.KS',  // 카카오
  '033780': '033780.KS',  // KT&G
  '105560': '105560.KS',  // KB금융
  '005490': '005490.KS',  // 포스코홀딩스
  '373220': '373220.KS',  // LG에너지솔루션
  '068270': '068270.KS',  // 셀트리온
  // ETF - 국내/해외 지수
  '069500': '069500.KS',  // KODEX 200
  '229200': '229200.KS',  // KODEX 코스닥150
  '360750': '360750.KS',  // TIGER 미국S&P500
  '133690': '133690.KS',  // TIGER 미국나스닥100
  '241390': '241390.KS',  // TIGER 일본니케이225
  // ETF - 배당
  '290130': '290130.KS',  // KODEX 배당가치
  '458730': '458730.KS',  // TIGER 미국배당+7%프리미엄다우존스
  // ETF - 섹터
  '305720': '305720.KS',  // KODEX 2차전지산업
  '091230': '091230.KS',  // TIGER 반도체
  '244580': '244580.KS',  // KODEX 바이오
  // ETF - 리츠
  '329200': '329200.KS',  // TIGER 리츠부동산인프라
  // 채권 ETF
  '148070': '148070.KS',  // KODEX 국고채10년
  '305080': '305080.KS',  // TIGER 미국채10년선물
  '157450': '157450.KS',  // TIGER 단기통안채
  '474220': '474220.KS',  // KODEX 미국30년국채+12%프리미엄
  // 대체자산
  '132030': '132030.KS',  // KODEX 골드선물(H)
  '144600': '144600.KS',  // KODEX 은선물(H)
};

// 15분 캐시
let cache = { data: null, timestamp: 0 };
const CACHE_TTL = 15 * 60 * 1000;

export async function GET() {
  try {
    // 캐시 확인
    if (cache.data && Date.now() - cache.timestamp < CACHE_TTL) {
      return Response.json({ data: cache.data, cached: true });
    }

    const tickers = Object.values(TICKER_MAP);
    const results = {};

    // 병렬로 시세 조회
    const quotes = await Promise.allSettled(
      tickers.map((ticker) =>
        yahooFinance.quote(ticker).then((q) => ({ ticker, quote: q }))
      )
    );

    for (const result of quotes) {
      if (result.status === 'fulfilled') {
        const { ticker, quote } = result.value;
        const originalTicker = Object.entries(TICKER_MAP).find(
          ([, v]) => v === ticker
        )?.[0];

        if (originalTicker && quote) {
          results[originalTicker] = {
            price: quote.regularMarketPrice ?? null,
            change: quote.regularMarketChange ?? null,
            changePercent: quote.regularMarketChangePercent ?? null,
            name: quote.shortName ?? quote.longName ?? '',
            marketState: quote.marketState ?? '',
            previousClose: quote.regularMarketPreviousClose ?? null,
          };
        }
      }
    }

    // 캐시 저장
    cache = { data: results, timestamp: Date.now() };

    return Response.json({ data: results, cached: false });
  } catch (error) {
    console.error('Stock API error:', error);
    return Response.json(
      { error: '주식 시세를 가져오는 데 실패했습니다.', data: null },
      { status: 500 }
    );
  }
}
