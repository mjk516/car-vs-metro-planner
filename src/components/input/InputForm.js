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
  const savedForm = loadSavedForm();
  const [form, setForm] = useState(savedForm ? { ...INITIAL_STATE, ...savedForm } : INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const fieldRefs = useRef({});

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

    if (form.useLoan) {
      const dp = parseFloat(form.downPaymentPercent);
      if (isNaN(dp) || dp < 0 || dp > 100) newErrors.downPaymentPercent = '선수금 비율을 0~100% 사이로 입력해주세요.';
      const term = parseInt(form.loanTermMonths);
      if (isNaN(term) || term < 6 || term > 120) newErrors.loanTermMonths = '할부 기간을 6~120개월 사이로 입력해주세요.';
      const rate = parseFloat(form.loanRate);
      if (isNaN(rate) || rate < 0 || rate > 30) newErrors.loanRate = '금리를 0~30% 사이로 입력해주세요.';
    }

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

    const carPrice = parseFormattedNumber(form.carPrice);
    const data = {
      salary: parseFormattedNumber(form.salary),
      assets: parseFormattedNumber(form.assets),
      monthlyExpense: parseFormattedNumber(form.monthlyExpense),
      commuteDistance: parseFloat(form.commuteDistance),
      commuteFrequency: parseInt(form.commuteFrequency),
      weekendTripsPerMonth: parseInt(form.weekendTripsPerMonth) || 4,
      weekendTripDistance: parseFloat(form.weekendTripDistance) || 30,
      carPrice,
      useLoan: form.useLoan,
      downPaymentPercent: parseFloat(form.downPaymentPercent) || 30,
      loanTermMonths: parseInt(form.loanTermMonths) || 48,
      loanRate: parseFloat(form.loanRate) || 4.5,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <IncomeSection form={form} errors={errors} onChange={handleChange} fieldRefs={fieldRefs} />
      <CommuteSection form={form} errors={errors} onChange={handleChange} fieldRefs={fieldRefs} />
      <CarPriceSection form={form} errors={errors} onChange={handleChange} fieldRefs={fieldRefs} />
      <LoanSection form={form} errors={errors} onChange={handleChange} fieldRefs={fieldRefs} />
      <OperatingCostSection form={form} errors={errors} onChange={handleChange} />
      <button
        type="submit"
        className="w-full py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-blue-200 text-lg"
      >
        비용 분석 시작
      </button>
    </form>
  );
}
