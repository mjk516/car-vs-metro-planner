'use client';

import Link from 'next/link';

export default function RecommendationBanner({ result }) {
  const isCar = result.recommendation === 'car';

  return (
    <div className={`rounded-2xl p-6 ${isCar ? 'bg-gradient-to-r from-blue-600 to-blue-800' : 'bg-gradient-to-r from-green-600 to-green-800'} text-white`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-sm opacity-80 mb-1">분석 결과</p>
          <h2 className="text-2xl font-bold">
            {isCar ? '자가용 구매를 추천합니다' : '대중교통 이용을 추천합니다'}
          </h2>
          <p className="mt-2 text-sm opacity-90 max-w-lg">
            {isCar
              ? '통근 패턴과 재정 상황을 고려했을 때, 자가용이 더 합리적인 선택입니다. 맞춤 차량 추천을 확인해보세요.'
              : `대중교통을 이용하면 연간 약 ${result.savingsPerYear.toLocaleString()}만원을 절약할 수 있습니다. 절약한 금액으로 자산을 불릴 수 있는 투자 전략을 확인해보세요.`}
          </p>
        </div>
        <Link
          href={isCar ? '/car' : '/invest'}
          className={`flex-shrink-0 px-6 py-3 rounded-xl font-semibold transition-colors ${
            isCar
              ? 'bg-white text-blue-700 hover:bg-blue-50'
              : 'bg-white text-green-700 hover:bg-green-50'
          }`}
        >
          {isCar ? '차량 추천 보기' : '투자 전략 보기'}
        </Link>
      </div>

      {/* 판단 근거 */}
      <div className="mt-6 pt-4 border-t border-white/20">
        <p className="text-sm font-semibold mb-2 opacity-90">판단 근거</p>
        <div className="space-y-1.5">
          {result.reasons.map((reason, i) => (
            <div key={i} className="flex items-start gap-2 text-sm opacity-85">
              <span className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                reason.type === result.recommendation
                  ? 'bg-white/30'
                  : 'bg-white/10'
              }`}>
                {reason.type === result.recommendation ? '+' : '-'}
              </span>
              <span>{reason.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
