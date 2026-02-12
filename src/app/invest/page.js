'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { makeRecommendation, recommendInvestmentProfile } from '@/libs/calculation-engine';
import StepIndicator from '@/components/common/StepIndicator';
import Disclaimer from '@/components/common/Disclaimer';
import InvestmentStrategy from '@/components/invest/InvestmentStrategy';
import StockRecommendation from '@/components/invest/StockRecommendation';
import AllocationChart from '@/components/invest/AllocationChart';

export default function InvestPage() {
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('finance-input');
    if (!stored) {
      router.push('/input');
      return;
    }
    const inputs = JSON.parse(stored);
    const result = makeRecommendation(inputs);
    const profile = recommendInvestmentProfile(inputs.salary, inputs.assets);
    const monthlySavings = Math.round(
      (result.carCosts.yearlyTotal - result.transportCosts.yearlyTotal) / 12
    );

    setData({
      inputs,
      result,
      profile,
      savingsPerYear: result.savingsPerYear > 0 ? result.savingsPerYear : Math.round((result.carCosts.yearlyTotal - result.transportCosts.yearlyTotal) / 10000),
      monthlySavings: Math.max(monthlySavings, 0),
    });
  }, [router]);

  if (!data) {
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <StepIndicator currentStep={3} />

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">투자 전략 추천</h1>
        <p className="text-gray-500 mt-2">
          대중교통 선택으로 절약한 금액을 투자하여 자산을 키우는 전략입니다.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <InvestmentStrategy
            savingsPerYear={data.savingsPerYear}
            recommendedProfile={data.profile}
            monthlySavings={data.monthlySavings}
          />
          <StockRecommendation profile={data.profile} />
        </div>
        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <AllocationChart profileId={data.profile} monthlySavings={data.monthlySavings} />
          </div>
        </div>
      </div>

      <Disclaimer type="investment" />

      <div className="text-center mt-6">
        <button
          onClick={() => router.push('/result')}
          className="px-6 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          분석 결과로 돌아가기
        </button>
      </div>
    </div>
  );
}
