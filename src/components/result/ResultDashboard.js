'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { makeRecommendation } from '@/libs/calculation-engine';
import CostComparisonCard from './CostComparisonCard';
import BreakEvenChart from './BreakEvenChart';
import CostPieChart from './CostPieChart';
import DepreciationChart from './DepreciationChart'; 
import RecommendationBanner from './RecommendationBanner';
import { formatManWon, formatPercent } from '@/utils/format';

export default function ResultDashboard() {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [inputs, setInputs] = useState(null);
  const [fuelSource, setFuelSource] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('finance-input');
    if (!stored) {
      router.push('/input');
      return;
    }
    const parsed = JSON.parse(stored);
    let currentInputs = { ...parsed };

    fetch('/api/fuel-price')
      .then((res) => res.json())
      .then((json) => {
        if (json.data?.gasoline) {
          currentInputs.fuelPrice = json.data.gasoline;
          setFuelSource(json.data.source);
        }
      })
      .catch(() => {
        console.error('유가 정보를 가져오는데 실패했습니다.');
      })
      .finally(() => {
        setInputs(currentInputs);
        setResult(makeRecommendation(currentInputs));
      });
  }, [router]);

  if (!result || !inputs) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 mt-3">분석 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 유가 데이터 출처 표시 */}
      {fuelSource && (
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          {fuelSource === 'opinet' ? 'OPINET 실시간 유가 반영' : '기본 유가 데이터 사용'}
        </div>
      )}

      {/* 입력 정보 요약 */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <h3 className="text-lg font-bold mb-3">입력 정보 요약</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <SummaryItem label="연봉" value={formatManWon(inputs.salary)} />
          <SummaryItem label="보유 자산" value={formatManWon(inputs.assets)} />
          <SummaryItem label="월 고정지출" value={formatManWon(inputs.monthlyExpense)} />
          <SummaryItem label="편도 통근거리" value={`${inputs.commuteDistance}km`} />
          <SummaryItem label="주간 통근횟수" value={`주 ${inputs.commuteFrequency}회`} />
          
          <SummaryItem 
            label="주말/휴일 외출" 
            value={`월 ${inputs.weekendTripsPerMonth}회 (회당 ${inputs.weekendTripDistance}km)`} 
          />

          <SummaryItem label="희망 차량가격" value={formatManWon(inputs.carPrice)} />

          {/* 💡 보험료: 직접 입력값이 없으면 엔진에서 계산된 결과값(result.carCosts.insurance)을 표시 */}
          <SummaryItem 
            label="연 예상 보험료" 
            value={inputs.insuranceYearly 
              ? formatManWon(inputs.insuranceYearly) 
              : `${formatManWon(Math.round(result.carCosts.insurance / 10000))} (자동산출)`} 
          />
          
          {/* 💡 자동차세: 직접 입력값이 없으면 엔진에서 계산된 결과값(result.carCosts.tax)을 표시 */}
          <SummaryItem 
            label="연 예상 자동차세" 
            value={inputs.taxYearly 
              ? formatManWon(inputs.taxYearly) 
              : `${formatManWon(Math.round(result.carCosts.tax / 10000))} (자동산출)`} 
          />

          {inputs.useLoan && (
            <SummaryItem
              label="구매 방식"
              value={`할부 (선수금 ${inputs.downPaymentPercent}%, ${inputs.loanTermMonths}개월, ${inputs.loanRate}%)`}
            />
          )}
        </div>
      </div>

      <RecommendationBanner result={result} />

      {/* 재정 부담률 분석 */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <h3 className="text-lg font-bold mb-4">재정 부담률 분석</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <GaugeCard label="연봉 대비 자가용 비용" value={result.affordability.salaryRatio} limit={30} isBurden={result.affordability.isSalaryBurden} />
          <GaugeCard label="자산 대비 차량 가격" value={result.affordability.assetRatio} limit={50} isBurden={result.affordability.isAssetBurden} />
        </div>
      </div>

      {/* 월간 비용 비교 카드 */}
      <CostComparisonCard 
        carCosts={result.carCosts} 
        transportCosts={result.transportCosts} 
        loanCosts={result.loanCosts} 
      />

      {/* 차트 영역 레이아웃 변경 */}
      <div className="space-y-6">
        <BreakEvenChart breakEvenData={result.breakEven} />
        
        <div className="grid md:grid-cols-2 gap-6">
          <CostPieChart 
            carCosts={result.carCosts} 
            loanCosts={result.loanCosts} 
          />
          <DepreciationChart 
            breakEvenData={result.breakEven} 
            initialCarPrice={inputs.carPrice} 
            loanCosts={result.loanCosts}
          />
        </div>
      </div>

      {/* 다시 분석 버튼 */}
      <div className="text-center pt-4 pb-12">
        <button
          onClick={() => router.push('/input')}
          className="px-6 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          다른 조건으로 다시 분석하기
        </button>
      </div>
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-bold mt-0.5">{value}</p>
    </div>
  );
}

function GaugeCard({ label, value, limit, isBurden }) {
  const percentage = Math.min(value, 100);
  return (
    <div className={`rounded-xl p-4 ${isBurden ? 'bg-red-50' : 'bg-green-50'}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className={`text-lg font-bold ${isBurden ? 'text-red-600' : 'text-green-600'}`}>
          {formatPercent(value)}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all ${isBurden ? 'bg-red-500' : 'bg-green-500'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs mt-1.5 text-gray-500">
        {isBurden ? `권장 ${limit}% 이하 - 부담이 큽니다` : `권장 ${limit}% 이하 - 적정 수준`}
      </p>
    </div>
  );
}