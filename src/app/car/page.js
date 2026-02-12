'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from '@/components/common/StepIndicator';
import Disclaimer from '@/components/common/Disclaimer';
import CarRecommendation from '@/components/car/CarRecommendation';
import LoanCalculator from '@/components/car/LoanCalculator';

export default function CarPage() {
  const router = useRouter();
  const [carPrice, setCarPrice] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('finance-input');
    if (!stored) {
      router.push('/input');
      return;
    }
    const parsed = JSON.parse(stored);
    setCarPrice(parsed.carPrice);
  }, [router]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <StepIndicator currentStep={3} />

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">맞춤 차량 추천</h1>
        <p className="text-gray-500 mt-2">
          예산과 통근 패턴에 맞는 차량을 추천합니다.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <CarRecommendation />
        </div>
        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <LoanCalculator carPrice={carPrice} />
          </div>
        </div>
      </div>

      <Disclaimer type="car" />

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
