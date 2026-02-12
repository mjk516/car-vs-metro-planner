'use client';

import { INVESTMENT_PROFILES } from '@/data/investment-data';
import { formatManWon, formatWon } from '@/utils/format';

const RISK_LABELS = ['', '낮음', '보통', '높음'];
const RISK_COLORS = ['', 'text-green-600 bg-green-50', 'text-amber-600 bg-amber-50', 'text-red-600 bg-red-50'];

export default function InvestmentStrategy({ savingsPerYear, recommendedProfile, monthlySavings }) {
  const profiles = Object.values(INVESTMENT_PROFILES);

  return (
    <div className="space-y-6">
      {/* 절약 금액 요약 */}
      <div className="bg-green-50 rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-3">절약 금액 분석</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">연간 절약 금액</p>
            <p className="text-2xl font-bold text-green-600">{formatManWon(savingsPerYear)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">월간 투자 가능 금액</p>
            <p className="text-2xl font-bold text-green-600">{formatWon(monthlySavings)}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          대중교통을 선택하여 절약한 금액을 투자하면, 10년 후 상당한 자산을 형성할 수 있습니다.
        </p>
      </div>

      {/* 투자 성향별 포트폴리오 */}
      <div>
        <h3 className="font-bold text-lg mb-4">투자 성향별 포트폴리오</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {profiles.map((profile) => {
            const isRecommended = profile.id === recommendedProfile;
            return (
              <div
                key={profile.id}
                className={`rounded-2xl border p-5 transition-shadow ${
                  isRecommended
                    ? 'border-primary bg-blue-50/50 shadow-md'
                    : 'border-border bg-white hover:shadow-md'
                }`}
              >
                {isRecommended && (
                  <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">추천</span>
                )}
                <h4 className="text-lg font-bold mt-2">{profile.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{profile.description}</p>

                <div className="flex items-center gap-2 mt-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${RISK_COLORS[profile.riskLevel]}`}>
                    위험도: {RISK_LABELS[profile.riskLevel]}
                  </span>
                  <span className="text-xs text-gray-500">
                    기대수익: {profile.expectedReturn}
                  </span>
                </div>

                {/* 자산 배분 바 */}
                <div className="mt-4">
                  <div className="flex h-3 rounded-full overflow-hidden">
                    <div className="bg-blue-500" style={{ width: `${profile.allocation.deposit}%` }} />
                    <div className="bg-green-500" style={{ width: `${profile.allocation.bond}%` }} />
                    <div className="bg-amber-500" style={{ width: `${profile.allocation.stock}%` }} />
                    <div className="bg-purple-500" style={{ width: `${profile.allocation.etc}%` }} />
                  </div>
                  <div className="grid grid-cols-2 gap-1 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full" />
                      예금 {profile.allocation.deposit}%
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      채권 {profile.allocation.bond}%
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-amber-500 rounded-full" />
                      주식 {profile.allocation.stock}%
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-purple-500 rounded-full" />
                      기타 {profile.allocation.etc}%
                    </span>
                  </div>
                </div>

                {/* 월 투자 배분 */}
                <div className="mt-4 pt-3 border-t border-gray-200 space-y-1">
                  <p className="text-xs font-medium text-gray-700">월 {formatWon(monthlySavings)} 배분</p>
                  <p className="text-xs text-gray-500">예금: {formatWon(Math.round(monthlySavings * profile.allocation.deposit / 100))}</p>
                  <p className="text-xs text-gray-500">채권: {formatWon(Math.round(monthlySavings * profile.allocation.bond / 100))}</p>
                  <p className="text-xs text-gray-500">주식: {formatWon(Math.round(monthlySavings * profile.allocation.stock / 100))}</p>
                  <p className="text-xs text-gray-500">기타: {formatWon(Math.round(monthlySavings * profile.allocation.etc / 100))}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
