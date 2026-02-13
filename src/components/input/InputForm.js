'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { formatNumberInput, parseFormattedNumber } from '@/utils/format';
import { CAR_COSTS } from '@/data/cost-constants';
import IncomeSection from './IncomeSection';
import CommuteSection from './CommuteSection';
import CarPriceSection from './CarPriceSection';
import LoanSection from './LoanSection';
import OperatingCostSection from './OperatingCostSection';

const SESSION_KEY = 'finance-input-form';

const INITIAL_STATE = {
  salary: '',
  assets: '',
  monthlyExpense: '',
  commuteDistance: '',
  commuteFrequency: '5',
  weekendTripsPerMonth: '4',
  weekendTripDistance: '30',
  carPrice: '',
  useLoan: false,
  downPaymentPercent: '30',
  loanTermMonths: '48',
  loanRate: '4.5',
  fuelEfficiency: String(CAR_COSTS.FUEL.avgFuelEfficiency),
  insuranceYearly: '',
  taxYearly: '',
  maintenanceYearly: String(CAR_COSTS.MAINTENANCE.yearly / 10000),
  parkingMonthly: String(CAR_COSTS.PARKING.monthly / 10000),
  miscMonthly: String(CAR_COSTS.MISC.monthly / 10000),
};

const FORMATTED_FIELDS = ['salary', 'assets', 'monthlyExpense', 'carPrice', 'insuranceYearly', 'taxYearly'];

function loadSavedForm() {
  if (typeof window === 'undefined') return null;
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

export default function InputForm() {
  const router = useRouter();
  
  /**
   * 💡 해결책: 지연 초기화만 사용하고 useEffect를 완전히 제거합니다.
   * 이렇게 하면 'setState within an effect' 경고 자체가 발생할 수 없습니다.
   */
  const [form, setForm] = useState(() => {
    if (typeof window === 'undefined') return INITIAL_STATE;
    const saved = loadSavedForm();
    return saved ? { ...INITIAL_STATE, ...saved } : INITIAL_STATE;
  });

  const [errors, setErrors] = useState({});
  const fieldRefs = useRef({});

  const setFieldRef = (name, el) => {
    if (el) {
      fieldRefs.current[name] = el;
    }
  };

  const saveToSession = (nextForm) => {
    if (typeof window === 'undefined') return;
    try { 
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextForm)); 
    } catch {}
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
    const commuteDistance = parseFloat(form.commuteDistance);
    const carPrice = parseFormattedNumber(form.carPrice);

    if (!salary || salary < 100) newErrors.salary = '연봉을 100만원 이상 입력해주세요.';
    if (!commuteDistance || commuteDistance <= 0) newErrors.commuteDistance = '통근 거리를 입력해주세요.';
    if (!carPrice || carPrice < 500) newErrors.carPrice = '희망 차량 가격을 500만원 이상 입력해주세요.';

    setErrors(newErrors);

    const errorKeys = Object.keys(newErrors);
    if (errorKeys.length > 0) {
      const el = fieldRefs.current[errorKeys[0]];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = el.querySelector('input');
        if (input) setTimeout(() => input.focus(), 400);
      }
    }

    return errorKeys.length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      ...form,
      salary: parseFormattedNumber(form.salary),
      assets: parseFormattedNumber(form.assets),
      monthlyExpense: parseFormattedNumber(form.monthlyExpense),
      commuteDistance: parseFloat(form.commuteDistance),
      commuteFrequency: parseInt(form.commuteFrequency),
      weekendTripsPerMonth: parseInt(form.weekendTripsPerMonth),
      weekendTripDistance: parseFloat(form.weekendTripDistance),
      carPrice: parseFormattedNumber(form.carPrice),
    };

    localStorage.setItem('finance-input', JSON.stringify(data));
    router.push('/result');
  };

  /**
   * 💡 suppressHydrationWarning을 사용하여 서버/클라이언트 데이터 차이로 인한 에러를 무시합니다.
   * input 폼에서는 가장 흔하고 안전한 방식입니다.
   */
  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-6" 
      suppressHydrationWarning
    >
      <IncomeSection 
        form={form} 
        errors={errors} 
        onChange={handleChange} 
        setFieldRef={setFieldRef} 
      />
      <CommuteSection 
        form={form} 
        errors={errors} 
        onChange={handleChange} 
        setFieldRef={setFieldRef} 
      />
      <CarPriceSection 
        form={form} 
        errors={errors} 
        onChange={handleChange} 
        setFieldRef={setFieldRef} 
      />
      <LoanSection 
        form={form} 
        errors={errors} 
        onChange={handleChange} 
        setFieldRef={setFieldRef} 
      />
      <OperatingCostSection 
        form={form} 
        errors={errors} 
        onChange={handleChange} 
      />
      <button
        type="submit"
        className="w-full py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-blue-200 text-lg"
      >
        비용 분석 시작
      </button>
    </form>
  );
}