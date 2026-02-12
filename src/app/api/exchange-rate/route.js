// 한국은행 / 네이버 환율 API
// 수입차 비용 산출 등에 활용

// 1시간 캐시
let cache = { data: null, timestamp: 0 };
const CACHE_TTL = 60 * 60 * 1000;

const FALLBACK = {
  usd: 1350,
  eur: 1470,
  jpy: 9.0,  // 100엔당
  source: 'fallback',
  date: new Date().toISOString().split('T')[0],
};

export async function GET() {
  try {
    if (cache.data && Date.now() - cache.timestamp < CACHE_TTL) {
      return Response.json({ data: cache.data, cached: true });
    }

    // 한국수출입은행 환율 API (무료, API키 불필요)
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const koexUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${process.env.KOREAEXIM_API_KEY || ''}&searchdate=${today}&data=AP01`;

    try {
      const res = await fetch(koexUrl, { next: { revalidate: 3600 } });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json) && json.length > 0) {
          const rates = {};
          for (const item of json) {
            const code = item.cur_unit;
            const rate = parseFloat(item.deal_bas_r?.replace(',', '') || '0');
            if (code === 'USD') rates.usd = rate;
            if (code === 'EUR') rates.eur = rate;
            if (code === 'JPY(100)') rates.jpy = rate;
          }

          const result = {
            ...rates,
            source: 'koreaexim',
            date: today,
          };
          cache = { data: result, timestamp: Date.now() };
          return Response.json({ data: result, cached: false });
        }
      }
    } catch {
      // 한국수출입은행 실패 시 네이버로 폴백
    }

    // 폴백: 네이버 환율
    try {
      const naverRes = await fetch(
        'https://finance.naver.com/marketindex/',
        { next: { revalidate: 3600 } }
      );
      if (naverRes.ok) {
        const html = await naverRes.text();
        const usdMatch = html.match(/미국 USD[\s\S]*?<span class="value">([0-9,.]+)/);
        if (usdMatch) {
          const usdRate = parseFloat(usdMatch[1].replace(',', ''));
          const result = {
            usd: usdRate,
            eur: Math.round(usdRate * 1.09), // 대략적 환산
            jpy: Math.round(usdRate * 0.67) / 100 * 100, // 100엔당
            source: 'naver',
            date: new Date().toISOString().split('T')[0],
          };
          cache = { data: result, timestamp: Date.now() };
          return Response.json({ data: result, cached: false });
        }
      }
    } catch {
      // 네이버도 실패
    }

    // 최종 폴백
    cache = { data: FALLBACK, timestamp: Date.now() };
    return Response.json({ data: FALLBACK, cached: false });
  } catch (error) {
    console.error('Exchange rate API error:', error);
    return Response.json({ data: FALLBACK, cached: false });
  }
}
