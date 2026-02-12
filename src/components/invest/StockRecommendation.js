'use client';

import { useEffect, useState } from 'react';
import { RECOMMENDED_PRODUCTS } from '@/data/investment-data';

const RISK_BADGES = {
  1: { label: '저위험', color: 'bg-green-100 text-green-700' },
  2: { label: '중위험', color: 'bg-amber-100 text-amber-700' },
  3: { label: '고위험', color: 'bg-red-100 text-red-700' },
};

export default function StockRecommendation({ profile }) {
  const maxRisk = profile === 'conservative' ? 1 : profile === 'balanced' ? 2 : 3;
  const [stockPrices, setStockPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stocks')
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setStockPrices(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* 실시간 시세 상태 */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : Object.keys(stockPrices).length > 0 ? 'bg-green-400' : 'bg-gray-300'}`} />
        {loading ? '시세 불러오는 중...' : Object.keys(stockPrices).length > 0 ? '실시간 시세 반영됨' : '정적 데이터 표시 중'}
      </div>

      {/* ETF 추천 */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <h3 className="text-lg font-bold mb-1">추천 ETF</h3>
        <p className="text-sm text-gray-500 mb-4">분산 투자에 적합한 ETF 상품</p>
        <div className="space-y-3">
          {RECOMMENDED_PRODUCTS.etf
            .filter((item) => item.riskLevel <= maxRisk)
            .map((item) => (
              <ProductCard key={item.ticker} item={item} liveData={stockPrices[item.ticker]} />
            ))}
        </div>
      </div>

      {/* 개별 주식 추천 */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <h3 className="text-lg font-bold mb-1">추천 개별 종목</h3>
        <p className="text-sm text-gray-500 mb-4">성장성과 안정성을 고려한 우량주</p>
        <div className="space-y-3">
          {RECOMMENDED_PRODUCTS.stocks
            .filter((item) => item.riskLevel <= maxRisk)
            .map((item) => (
              <StockCard key={item.ticker} item={item} liveData={stockPrices[item.ticker]} />
            ))}
        </div>
      </div>

      {/* 채권/예금 */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <h3 className="text-lg font-bold mb-1">안전자산</h3>
        <p className="text-sm text-gray-500 mb-4">원금 보존을 위한 안전자산</p>
        <div className="space-y-3">
          {RECOMMENDED_PRODUCTS.deposit.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-green-600">{item.expectedReturn}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${RISK_BADGES[item.riskLevel].color}`}>
                  {RISK_BADGES[item.riskLevel].label}
                </span>
              </div>
            </div>
          ))}
          {RECOMMENDED_PRODUCTS.bond.map((item) => (
            <div key={item.ticker} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
              <div className="text-right">
                {stockPrices[item.ticker] ? (
                  <p className="text-sm font-bold text-green-600">
                    {stockPrices[item.ticker].price?.toLocaleString('ko-KR')}원
                  </p>
                ) : (
                  <p className="text-sm font-bold text-green-600">{item.expectedReturn}</p>
                )}
                <span className={`text-xs px-2 py-0.5 rounded-full ${RISK_BADGES[item.riskLevel].color}`}>
                  {RISK_BADGES[item.riskLevel].label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ item, liveData }) {
  const badge = RISK_BADGES[item.riskLevel];
  return (
    <div className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">{item.name}</p>
          <span className="text-xs text-gray-400">{item.ticker}</span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
        {item.category && (
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full mt-1 inline-block">
            {item.category}
          </span>
        )}
      </div>
      <div className="text-right ml-4">
        {liveData ? (
          <>
            <p className="text-sm font-bold text-foreground">
              {liveData.price?.toLocaleString('ko-KR')}원
            </p>
            <PriceChange change={liveData.change} changePercent={liveData.changePercent} />
          </>
        ) : (
          <p className="text-sm font-bold text-primary">{item.expectedReturn}</p>
        )}
        <span className={`text-xs px-2 py-0.5 rounded-full ${badge.color}`}>
          {badge.label}
        </span>
      </div>
    </div>
  );
}

function StockCard({ item, liveData }) {
  const badge = RISK_BADGES[item.riskLevel];
  return (
    <div className="p-4 border border-border rounded-xl hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold">{item.name}</p>
          <span className="text-xs text-gray-400">{item.ticker}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${badge.color}`}>
            {badge.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {liveData && (
            <span className="text-sm font-bold">
              {liveData.price?.toLocaleString('ko-KR')}원
            </span>
          )}
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {item.category}
          </span>
        </div>
      </div>
      {liveData && (
        <div className="mt-1.5">
          <PriceChange change={liveData.change} changePercent={liveData.changePercent} />
        </div>
      )}
      <p className="text-xs text-gray-500 mt-1">{item.description}</p>
      <div className="mt-2 bg-blue-50 rounded-lg p-2">
        <p className="text-xs text-blue-700">
          <span className="font-medium">추천 사유:</span> {item.reason}
        </p>
      </div>
    </div>
  );
}

function PriceChange({ change, changePercent }) {
  if (change == null) return null;
  const isUp = change > 0;
  const isFlat = change === 0;
  return (
    <span className={`text-xs font-medium ${isFlat ? 'text-gray-500' : isUp ? 'text-red-500' : 'text-blue-500'}`}>
      {isUp ? '+' : ''}{change?.toLocaleString('ko-KR')}원
      ({isUp ? '+' : ''}{changePercent?.toFixed(2)}%)
    </span>
  );
}
