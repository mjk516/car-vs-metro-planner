import InputField from './InputField';

export default function IncomeSection({ form, errors, onChange, fieldRefs }) {
  return (
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
          onChange={(v) => onChange('salary', v)}
          error={errors.salary}
          hint="세전 연봉 기준"
          ref={(el) => { fieldRefs.current.salary = el; }}
        />
        <InputField
          label="보유 자산"
          unit="만원"
          placeholder="예: 5,000"
          value={form.assets}
          onChange={(v) => onChange('assets', v)}
          error={errors.assets}
          hint="저축, 예금, 투자금 포함"
          ref={(el) => { fieldRefs.current.assets = el; }}
        />
        <InputField
          label="월 고정 지출"
          unit="만원"
          placeholder="예: 150"
          value={form.monthlyExpense}
          onChange={(v) => onChange('monthlyExpense', v)}
          error={errors.monthlyExpense}
          hint="월세, 식비, 통신비 등 (교통비 제외)"
          ref={(el) => { fieldRefs.current.monthlyExpense = el; }}
        />
      </div>
    </div>
  );
}
