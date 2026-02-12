// OPINET(한국석유공사) 전국 평균 유가 조회
// API 키가 없을 경우 공공데이터포털 대체 경로 사용

const OPINET_API_KEY = process.env.OPINET_API_KEY || '';
const OPINET_URL = 'https://www.opinet.co.kr/api/avgAllPrice.do';

// 30분 캐시
let cache = { data: null, timestamp: 0 };
const CACHE_TTL = 30 * 60 * 1000;

// 폴백: 공공데이터포털 or 정적 데이터
const FALLBACK_PRICE = {
  gasoline: 1650,
  diesel: 1500,
  lpg: 1000,
  source: 'fallback',
  date: new Date().toISOString().split('T')[0],
};

export async function GET() {
  try {
    // 캐시 확인
    if (cache.data && Date.now() - cache.timestamp < CACHE_TTL) {
      return Response.json({ data: cache.data, cached: true });
    }

    // OPINET API 키가 있으면 실시간 조회
    if (OPINET_API_KEY) {
      const url = `${OPINET_URL}?out=json&code=${OPINET_API_KEY}`;
      const response = await fetch(url, { next: { revalidate: 1800 } });

      if (response.ok) {
        const json = await response.json();
        const oilList = json?.RESULT?.OIL || [];

        const prices = {};
        for (const oil of oilList) {
          if (oil.PRODCD === 'B027') prices.gasoline = Math.round(oil.PRICE);
          if (oil.PRODCD === 'D047') prices.diesel = Math.round(oil.PRICE);
          if (oil.PRODCD === 'K015') prices.lpg = Math.round(oil.PRICE);
        }

        const result = {
          ...prices,
          source: 'opinet',
          date: oilList[0]?.TRADE_DT || new Date().toISOString().split('T')[0],
        };

        cache = { data: result, timestamp: Date.now() };
        return Response.json({ data: result, cached: false });
      }
    }

    // API 키 없으면 대체: 네이버 증권 크롤링 시도
    try {
      const naverRes = await fetch(
        'https://finance.naver.com/marketindex/oilDailyQuote.naver',
        { next: { revalidate: 3600 } }
      );

      if (naverRes.ok) {
        const html = await naverRes.text();
        // 휘발유 가격 파싱 (간단 정규식)
        const match = html.match(/휘발유[\s\S]*?<td class="num">([\d,.]+)/);
        if (match) {
          const gasolinePrice = Math.round(parseFloat(match[1].replace(',', '')));
          const result = {
            gasoline: gasolinePrice,
            diesel: Math.round(gasolinePrice * 0.91), // 경유는 대략 91% 수준
            lpg: Math.round(gasolinePrice * 0.61),
            source: 'naver',
            date: new Date().toISOString().split('T')[0],
          };

          cache = { data: result, timestamp: Date.now() };
          return Response.json({ data: result, cached: false });
        }
      }
    } catch {
      // 네이버도 실패하면 폴백
    }

    // 최종 폴백: 정적 데이터
    cache = { data: FALLBACK_PRICE, timestamp: Date.now() };
    return Response.json({ data: FALLBACK_PRICE, cached: false });
  } catch (error) {
    console.error('Fuel price API error:', error);
    return Response.json({ data: FALLBACK_PRICE, cached: false });
  }
}
