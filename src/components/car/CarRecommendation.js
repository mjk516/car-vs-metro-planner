'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CAR_CATEGORIES } from '@/data/car-data';
import { formatManWon, formatWon } from '@/utils/format';
import { calculateCarCosts } from '@/libs/calculation-engine';

export default function CarRecommendation() {
  const router = useRouter();
  const [inputs, setInputs] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('finance-input');
    if (!stored) {
      router.push('/input');
      return;
    }
    const parsed = JSON.parse(stored);
    setInputs(parsed);

    // 가격에 맞는 카테고리 자동 선택
    const category = CAR_CATEGORIES.find(
      (cat) => parsed.carPrice >= cat.minPrice && parsed.carPrice <= cat.maxPrice
    ) || CAR_CATEGORIES[0];
    setSelectedCategory(category.id);
  }, [router]);

  if (!inputs) return null;

  const matchedCategories = CAR_CATEGORIES.filter((cat) => {
    const budget = inputs.assets * 0.5; // 자산의 50%를 예산으로
    return cat.minPrice <= Math.max(budget, inputs.carPrice);
  });

  return (
    <div className="space-y-6">
      {/* 예산 정보 */}
      <div className="bg-blue-50 rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-2">예산 분석</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500">보유 자산</p>
            <p className="font-bold">{formatManWon(inputs.assets)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">권장 예산 (자산의 50%)</p>
            <p className="font-bold text-primary">{formatManWon(Math.round(inputs.assets * 0.5))}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">희망 차량 가격</p>
            <p className="font-bold">{formatManWon(inputs.carPrice)}</p>
          </div>
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CAR_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-primary text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-primary'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 차량 목록 */}
      {CAR_CATEGORIES.filter((cat) => cat.id === selectedCategory).map((category) => (
        <div key={category.id} className="space-y-4">
          <p className="text-sm text-gray-500">가격대: {category.priceRange}</p>
          {category.cars.map((car) => {
            const costs = calculateCarCosts({
              ...inputs,
              carPrice: car.price,
            });
            return (
              <div key={car.name} className="bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-bold">{car.name}</h4>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {car.type}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-primary">{formatManWon(car.price)}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {car.pros.map((pro) => (
                        <span key={pro} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">
                          {pro}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="md:text-right space-y-1">
                    <div className="text-sm">
                      <span className="text-gray-500">연비: </span>
                      <span className="font-medium">{car.fuelEfficiency}km/L</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">자동차세: </span>
                      <span className="font-medium">{formatWon(car.yearlyTax)}/년</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">예상 월비용: </span>
                      <span className="font-bold text-primary">{formatWon(costs.monthlyTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
