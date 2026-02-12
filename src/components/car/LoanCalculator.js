'use client';

import { useState, useMemo } from 'react';
import { calculateLoan } from '@/libs/calculation-engine';
import { LOAN_RATES, LOAN_TERMS } from '@/data/car-data';
import { formatWon, formatManWon } from '@/utils/format';

export default function LoanCalculator({ carPrice }) {
  const [downPaymentPercent, setDownPaymentPercent] = useState(30);
  const [termMonths, setTermMonths] = useState(48);
  const [rateIndex, setRateIndex] = useState(0);

  const price = carPrice || 3000;
  const downPayment = Math.round(price * downPaymentPercent / 100);
  const rate = LOAN_RATES[rateIndex].rate;

  const result = useMemo(
    () => calculateLoan(price, downPayment, termMonths, rate),
    [price, downPayment, termMonths, rate]
  );

  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <h3 className="text-lg font-bold mb-4">할부 계산기</h3>

      <div className="space-y-5">
        {/* 차량 가격 */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">차량 가격</p>
          <p className="text-xl font-bold">{formatManWon(price)}</p>
        </div>

        {/* 선수금 비율 */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">선수금 비율</span>
            <span className="font-bold text-primary">{downPaymentPercent}% ({formatManWon(downPayment)})</span>
          </div>
          <input
            type="range"
            min={0}
            max={70}
            step={10}
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0%</span>
            <span>70%</span>
          </div>
        </div>

        {/* 할부 기간 */}
        <div>
          <p className="text-sm font-medium mb-2">할부 기간</p>
          <div className="flex gap-2">
            {LOAN_TERMS.map((term) => (
              <button
                key={term}
                onClick={() => setTermMonths(term)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  termMonths === term
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary'
                }`}
              >
                {term}개월
              </button>
            ))}
          </div>
        </div>

        {/* 이자율 */}
        <div>
          <p className="text-sm font-medium mb-2">할부 유형</p>
          <div className="space-y-2">
            {LOAN_RATES.map((option, i) => (
              <label
                key={i}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  rateIndex === i
                    ? 'border-primary bg-blue-50'
                    : 'border-gray-200 hover:border-primary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="loanRate"
                    checked={rateIndex === i}
                    onChange={() => setRateIndex(i)}
                    className="accent-primary"
                  />
                  <span className="text-sm">{option.label}</span>
                </div>
                <span className="text-sm font-bold text-primary">연 {option.rate}%</span>
              </label>
            ))}
          </div>
        </div>

        {/* 계산 결과 */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-5 text-white">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs opacity-80">월 납부액</p>
              <p className="text-lg font-bold mt-1">{formatWon(result.monthlyPayment)}</p>
            </div>
            <div>
              <p className="text-xs opacity-80">총 납부액</p>
              <p className="text-lg font-bold mt-1">{formatManWon(Math.round(result.totalPayment / 10000))}</p>
            </div>
            <div>
              <p className="text-xs opacity-80">총 이자</p>
              <p className="text-lg font-bold mt-1">{formatManWon(Math.round(result.totalInterest / 10000))}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
