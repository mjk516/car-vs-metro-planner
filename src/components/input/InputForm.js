'use client';

import { useState, useEffect, useRef, forwardRef } from 'react';
import { useRouter } from 'next/navigation';
import { formatNumberInput, parseFormattedNumber } from '@/utils/format';
import { CAR_CATEGORIES } from '@/data/car-data';
import { CAR_COSTS } from '@/data/cost-constants';

const SESSION_KEY = 'finance-input-form';

const INITIAL_STATE = {
  salary: '',
  assets: '',
  monthlyExpense: '',
  commuteDistance: '',
  commuteFrequency: '5',
  carPrice: '',
  // 할부 옵션
  useLoan: false,
  downPaymentPercent: '30',
  loanTermMonths: '48',
  loanRate: '4.5',
  // 운영비 상세 (기본값 세팅)
  fuelEfficiency: String(CAR_COSTS.FUEL.avgFuelEfficiency),
  insuranceYearly: '',
  taxYearly: '',
  maintenanceYearly: String(CAR_COSTS.MAINTENANCE.yearly / 10000),
  parkingMonthly: String(CAR_COSTS.PARKING.monthly / 10000),
  miscMonthly: String(CAR_COSTS.MISC.monthly / 10000),
};

// 숫자 포맷이 필요한 필드
const FORMATTED_FIELDS = ['salary', 'assets', 'monthlyExpense', 'carPrice', 'insuranceYearly', 'taxYearly'];

export default function InputForm() {
  const router = useRouter();
  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [showDetailCosts, setShowDetailCosts] = useState(false);
  const fieldRefs = useRef({});

  // sessionStorage에서 이전 입력값 복원
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm((prev) => ({ ...prev, ...parsed }));
        if (parsed.insuranceYearly || parsed.taxYearly || parsed.useLoan) {
          setShowDetailCosts(true);
        }
      }
    } catch {}
  }, []);

  // sessionStorage에 저장하는 헬퍼 (useEffect 대신 직접 호출)
  const saveToSession = (nextForm) => {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextForm)); } catch {}
  };

  const handleChange = (field, value) => {
    setForm((prev) => {
      const next = FORMATTED_FIELDS.includes(field)
        ? { ...prev, [field]: formatNumberInput(value) }
        : { ...prev, [field]: value };
      saveToSession(next);
      return next;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const salary = parseFormattedNumber(form.salary);
    const assets = parseFormattedNumber(form.assets);
    const monthlyExpense = parseFormattedNumber(form.monthlyExpense);
    const commuteDistance = parseFloat(form.commuteDistance);
    const commuteFrequency = parseInt(form.commuteFrequency);
    const carPrice = parseFormattedNumber(form.carPrice);

    if (!salary || salary < 100) newErrors.salary = '연봉을 100만원 이상 입력해주세요.';
    if (assets === undefined || assets < 0) newErrors.assets = '보유 자산을 입력해주세요.';
    if (!monthlyExpense && monthlyExpense !== 0) newErrors.monthlyExpense = '월 고정 지출을 입력해주세요.';
    if (!commuteDistance || commuteDistance <= 0) newErrors.commuteDistance = '통근 거리를 입력해주세요.';
    if (!commuteFrequency || commuteFrequency < 1 || commuteFrequency > 7) newErrors.commuteFrequency = '주 1~7회로 입력해주세요.';
    if (!carPrice || carPrice < 500) newErrors.carPrice = '희망 차량 가격을 500만원 이상 입력해주세요.';

    // 할부 옵션 검증
    if (form.useLoan) {
      const dp = parseFloat(form.downPaymentPercent);
      if (isNaN(dp) || dp < 0 || dp > 100) newErrors.downPaymentPercent = '선수금 비율을 0~100% 사이로 입력해주세요.';
      const term = parseInt(form.loanTermMonths);
      if (isNaN(term) || term < 6 || term > 120) newErrors.loanTermMonths = '할부 기간을 6~120개월 사이로 입력해주세요.';
      const rate = parseFloat(form.loanRate);
      if (isNaN(rate) || rate < 0 || rate > 30) newErrors.loanRate = '금리를 0~30% 사이로 입력해주세요.';
    }

    setErrors(newErrors);

    // 첫 번째 에러 필드로 스크롤 및 포커스
    const errorKeys = Object.keys(newErrors);
    if (errorKeys.length > 0) {
      const firstErrorKey = errorKeys[0];
      const el = fieldRefs.current[firstErrorKey];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = el.querySelector('input');
        if (input) {
          setTimeout(() => input.focus(), 400);
        }
      }
    }

    return errorKeys.length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const carPrice = parseFormattedNumber(form.carPrice);
    const data = {
      salary: parseFormattedNumber(form.salary),
      assets: parseFormattedNumber(form.assets),
      monthlyExpense: parseFormattedNumber(form.monthlyExpense),
      commuteDistance: parseFloat(form.commuteDistance),
      commuteFrequency: parseInt(form.commuteFrequency),
      carPrice,
      // 할부 옵션
      useLoan: form.useLoan,
      downPaymentPercent: parseFloat(form.downPaymentPercent) || 30,
      loanTermMonths: parseInt(form.loanTermMonths) || 48,
      loanRate: parseFloat(form.loanRate) || 4.5,
      // 운영비 상세 (입력이 있는 경우만)
      fuelEfficiency: parseFloat(form.fuelEfficiency) || undefined,
      insuranceYearly: form.insuranceYearly ? parseFormattedNumber(form.insuranceYearly) : undefined,
      taxYearly: form.taxYearly ? parseFormattedNumber(form.taxYearly) : undefined,
      maintenanceYearly: form.maintenanceYearly ? parseFloat(form.maintenanceYearly) : undefined,
      parkingMonthly: form.parkingMonthly ? parseFloat(form.parkingMonthly) : undefined,
      miscMonthly: form.miscMonthly ? parseFloat(form.miscMonthly) : undefined,
    };

    localStorage.setItem('finance-input', JSON.stringify(data));
    router.push('/result');
  };

  const selectCarPrice = (price) => {
    handleChange('carPrice', price.toString());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 소득/자산 섹션 */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="w-7 h-7 bg-blue-100 text-primary rounded-lg flex items-center justify-center text-sm font-bold">1</span>
          소득 및 자산 정보
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <InputField
            label="연봉"
            unit="만원"
            placeholder="예: 4,000"
            value={form.salary}
            onChange={(v) => handleChange('salary', v)}
            error={errors.salary}
            hint="세전 연봉 기준"
            ref={(el) => { fieldRefs.current.salary = el; }}
          />
          <InputField
            label="보유 자산"
            unit="만원"
            placeholder="예: 5,000"
            value={form.assets}
            onChange={(v) => handleChange('assets', v)}
            error={errors.assets}
            hint="저축, 예금, 투자금 포함"
            ref={(el) => { fieldRefs.current.assets = el; }}
          />
          <InputField
            label="월 고정 지출"
            unit="만원"
            placeholder="예: 150"
            value={form.monthlyExpense}
            onChange={(v) => handleChange('monthlyExpense', v)}
            error={errors.monthlyExpense}
            hint="월세, 식비, 통신비 등 (교통비 제외)"
            ref={(el) => { fieldRefs.current.monthlyExpense = el; }}
          />
        </div>
      </div>

      {/* 통근 정보 섹션 */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="w-7 h-7 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-sm font-bold">2</span>
          통근 정보
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <InputField
            label="편도 통근 거리"
            unit="km"
            placeholder="예: 15"
            value={form.commuteDistance}
            onChange={(v) => handleChange('commuteDistance', v)}
            error={errors.commuteDistance}
            type="number"
            ref={(el) => { fieldRefs.current.commuteDistance = el; }}
          />
          <div ref={(el) => { fieldRefs.current.commuteFrequency = el; }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">주간 통근 횟수</label>
            <div className="flex gap-2">
              {[3, 4, 5, 6, 7].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleChange('commuteFrequency', day.toString())}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                    parseInt(form.commuteFrequency) === day
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary'
                  }`}
                >
                  주 {day}회
                </button>
              ))}
            </div>
            {errors.commuteFrequency && (
              <p className="text-red-500 text-xs mt-1">{errors.commuteFrequency}</p>
            )}
          </div>
        </div>
      </div>

      {/* 차량 가격 섹션 */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="w-7 h-7 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center text-sm font-bold">3</span>
          희망 차량 가격대
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {CAR_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => selectCarPrice(Math.round((cat.minPrice + cat.maxPrice) / 2))}
              className={`p-3 rounded-xl border text-left transition-colors ${
                parseFormattedNumber(form.carPrice) >= cat.minPrice &&
                parseFormattedNumber(form.carPrice) <= cat.maxPrice
                  ? 'border-primary bg-blue-50'
                  : 'border-gray-200 hover:border-primary'
              }`}
            >
              <p className="text-sm font-semibold">{cat.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{cat.priceRange}</p>
            </button>
          ))}
        </div>
        <InputField
          label="희망 차량 가격 (직접 입력)"
          unit="만원"
          placeholder="예: 3,000"
          value={form.carPrice}
          onChange={(v) => handleChange('carPrice', v)}
          error={errors.carPrice}
          hint="비교 분석에 사용될 차량 가격"
          ref={(el) => { fieldRefs.current.carPrice = el; }}
        />
      </div>

      {/* 할부 옵션 섹션 */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="w-7 h-7 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-sm font-bold">4</span>
          구매 방식
        </h3>

        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => handleChange('useLoan', false)}
            className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-colors ${
              !form.useLoan
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-600 border-gray-200 hover:border-primary'
            }`}
          >
            일시불 구매
          </button>
          <button
            type="button"
            onClick={() => handleChange('useLoan', true)}
            className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-colors ${
              form.useLoan
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-600 border-gray-200 hover:border-primary'
            }`}
          >
            할부 구매
          </button>
        </div>

        {form.useLoan && (
          <div className="grid md:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
            <div ref={(el) => { fieldRefs.current.downPaymentPercent = el; }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">선수금 비율</label>
              <div className="relative">
                <input
                  type="number"
                  value={form.downPaymentPercent}
                  onChange={(e) => handleChange('downPaymentPercent', e.target.value)}
                  className={`w-full px-4 py-2.5 pr-12 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${
                    errors.downPaymentPercent ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                  min="0"
                  max="100"
                  step="5"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">%</span>
              </div>
              <div className="flex gap-1 mt-1.5">
                {[10, 20, 30, 50].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleChange('downPaymentPercent', String(v))}
                    className={`flex-1 py-0.5 rounded text-xs border transition-colors ${
                      parseFloat(form.downPaymentPercent) === v
                        ? 'bg-primary text-white border-primary'
                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-primary'
                    }`}
                  >
                    {v}%
                  </button>
                ))}
              </div>
              {errors.downPaymentPercent && <p className="text-red-500 text-xs mt-1">{errors.downPaymentPercent}</p>}
            </div>

            <div ref={(el) => { fieldRefs.current.loanTermMonths = el; }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">할부 기간</label>
              <div className="relative">
                <input
                  type="number"
                  value={form.loanTermMonths}
                  onChange={(e) => handleChange('loanTermMonths', e.target.value)}
                  className={`w-full px-4 py-2.5 pr-12 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${
                    errors.loanTermMonths ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                  min="6"
                  max="120"
                  step="6"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">개월</span>
              </div>
              <div className="flex gap-1 mt-1.5">
                {[24, 36, 48, 60].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleChange('loanTermMonths', String(v))}
                    className={`flex-1 py-0.5 rounded text-xs border transition-colors ${
                      parseInt(form.loanTermMonths) === v
                        ? 'bg-primary text-white border-primary'
                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-primary'
                    }`}
                  >
                    {v}개월
                  </button>
                ))}
              </div>
              {errors.loanTermMonths && <p className="text-red-500 text-xs mt-1">{errors.loanTermMonths}</p>}
            </div>

            <div ref={(el) => { fieldRefs.current.loanRate = el; }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">연 이자율</label>
              <div className="relative">
                <input
                  type="number"
                  value={form.loanRate}
                  onChange={(e) => handleChange('loanRate', e.target.value)}
                  className={`w-full px-4 py-2.5 pr-12 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${
                    errors.loanRate ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                  min="0"
                  max="30"
                  step="0.1"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">%</span>
              </div>
              <div className="flex gap-1 mt-1.5">
                {[3.5, 4.5, 5.5, 7.0].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleChange('loanRate', String(v))}
                    className={`flex-1 py-0.5 rounded text-xs border transition-colors ${
                      parseFloat(form.loanRate) === v
                        ? 'bg-primary text-white border-primary'
                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-primary'
                    }`}
                  >
                    {v}%
                  </button>
                ))}
              </div>
              {errors.loanRate && <p className="text-red-500 text-xs mt-1">{errors.loanRate}</p>}
            </div>
          </div>
        )}
      </div>

      {/* 운영비 상세 설정 (접이식) */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <button
          type="button"
          onClick={() => setShowDetailCosts(!showDetailCosts)}
          className="w-full flex items-center justify-between"
        >
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="w-7 h-7 bg-cyan-100 text-cyan-600 rounded-lg flex items-center justify-center text-sm font-bold">5</span>
            자가용 운영비 상세 설정
          </h3>
          <span className={`text-gray-400 transition-transform ${showDetailCosts ? 'rotate-180' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </button>
        <p className="text-xs text-gray-400 mt-1">
          기본값이 설정되어 있습니다. 본인 상황에 맞게 조정하세요.
        </p>

        {showDetailCosts && (
          <div className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
            <InputField
              label="평균 연비"
              unit="km/L"
              placeholder="예: 12.5"
              value={form.fuelEfficiency}
              onChange={(v) => handleChange('fuelEfficiency', v)}
              type="number"
              hint={`기본값: ${CAR_COSTS.FUEL.avgFuelEfficiency} km/L`}
            />
            <InputField
              label="연간 보험료"
              unit="만원"
              placeholder="자동 계산"
              value={form.insuranceYearly}
              onChange={(v) => handleChange('insuranceYearly', v)}
              hint="미입력 시 차량가격 기반 자동 계산"
            />
            <InputField
              label="연간 자동차세"
              unit="만원"
              placeholder="자동 계산"
              value={form.taxYearly}
              onChange={(v) => handleChange('taxYearly', v)}
              hint="미입력 시 가격대별 자동 계산"
            />
            <InputField
              label="연간 정비비"
              unit="만원"
              placeholder="예: 80"
              value={form.maintenanceYearly}
              onChange={(v) => handleChange('maintenanceYearly', v)}
              type="number"
              hint={`기본값: ${CAR_COSTS.MAINTENANCE.yearly / 10000}만원`}
            />
            <InputField
              label="월 주차비"
              unit="만원"
              placeholder="예: 12"
              value={form.parkingMonthly}
              onChange={(v) => handleChange('parkingMonthly', v)}
              type="number"
              hint={`기본값: ${CAR_COSTS.PARKING.monthly / 10000}만원 (수도권)`}
            />
            <InputField
              label="월 기타비용"
              unit="만원"
              placeholder="예: 5"
              value={form.miscMonthly}
              onChange={(v) => handleChange('miscMonthly', v)}
              type="number"
              hint={`세차, 통행료, 검사비 등. 기본값: ${CAR_COSTS.MISC.monthly / 10000}만원`}
            />
          </div>
        )}
      </div>

      {/* 제출 버튼 */}
      <button
        type="submit"
        className="w-full py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-blue-200 text-lg"
      >
        비용 분석 시작
      </button>
    </form>
  );
}

const InputField = forwardRef(function InputField({ label, unit, placeholder, value, onChange, error, hint, type = 'text' }, ref) {
  return (
    <div ref={ref}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 pr-12 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${
            error ? 'border-red-400 bg-red-50' : 'border-gray-200'
          }`}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">{unit}</span>
      </div>
      {hint && !error && <p className="text-gray-400 text-xs mt-1">{hint}</p>}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
});
