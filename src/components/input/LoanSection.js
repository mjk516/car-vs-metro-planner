export default function LoanSection({ form, errors, onChange, fieldRefs }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="w-7 h-7 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-sm font-bold">4</span>
        구매 방식
      </h3>

      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={() => onChange('useLoan', false)}
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
          onClick={() => onChange('useLoan', true)}
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
          <QuickInputField
            label="선수금 비율"
            unit="%"
            value={form.downPaymentPercent}
            onChange={(v) => onChange('downPaymentPercent', v)}
            error={errors.downPaymentPercent}
            options={[10, 20, 30, 50]}
            optionLabel={(v) => `${v}%`}
            selectedValue={parseFloat(form.downPaymentPercent)}
            inputProps={{ min: '0', max: '100', step: '5' }}
            ref={(el) => { fieldRefs.current.downPaymentPercent = el; }}
          />
          <QuickInputField
            label="할부 기간"
            unit="개월"
            value={form.loanTermMonths}
            onChange={(v) => onChange('loanTermMonths', v)}
            error={errors.loanTermMonths}
            options={[24, 36, 48, 60]}
            optionLabel={(v) => `${v}개월`}
            selectedValue={parseInt(form.loanTermMonths)}
            inputProps={{ min: '6', max: '120', step: '6' }}
            ref={(el) => { fieldRefs.current.loanTermMonths = el; }}
          />
          <QuickInputField
            label="연 이자율"
            unit="%"
            value={form.loanRate}
            onChange={(v) => onChange('loanRate', v)}
            error={errors.loanRate}
            options={[3.5, 4.5, 5.5, 7.0]}
            optionLabel={(v) => `${v}%`}
            selectedValue={parseFloat(form.loanRate)}
            inputProps={{ min: '0', max: '30', step: '0.1' }}
            ref={(el) => { fieldRefs.current.loanRate = el; }}
          />
        </div>
      )}
    </div>
  );
}

import { forwardRef } from 'react';

const QuickInputField = forwardRef(function QuickInputField(
  { label, unit, value, onChange, error, options, optionLabel, selectedValue, inputProps },
  ref,
) {
  return (
    <div ref={ref}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-2.5 pr-12 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${
            error ? 'border-red-400 bg-red-50' : 'border-gray-200'
          }`}
          {...inputProps}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">{unit}</span>
      </div>
      <div className="flex gap-1 mt-1.5">
        {options.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(String(v))}
            className={`flex-1 py-0.5 rounded text-xs border transition-colors ${
              selectedValue === v
                ? 'bg-primary text-white border-primary'
                : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-primary'
            }`}
          >
            {optionLabel(v)}
          </button>
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
});
