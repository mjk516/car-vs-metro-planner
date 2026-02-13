import { CAR_COSTS } from '@/data/cost-constants';
import InputField from './InputField';

export default function OperatingCostSection({ form, errors, onChange }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
        <span className="w-7 h-7 bg-cyan-100 text-cyan-600 rounded-lg flex items-center justify-center text-sm font-bold">5</span>
        자가용 운영비 상세 설정
      </h3>
      <p className="text-xs text-gray-400 mb-4">
        기본값이 설정되어 있습니다. 본인 상황에 맞게 조정하세요.
      </p>

      <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <InputField
            label="평균 연비"
            unit="km/L"
            placeholder="예: 12.5"
            value={form.fuelEfficiency}
            onChange={(v) => onChange('fuelEfficiency', v)}
            type="number"
            hint={`기본값: ${CAR_COSTS.FUEL.avgFuelEfficiency} km/L`}
          />
          <InputField
            label="연간 보험료"
            unit="만원"
            placeholder="자동 계산"
            value={form.insuranceYearly}
            onChange={(v) => onChange('insuranceYearly', v)}
            hint="미입력 시 차량가격 기반 자동 계산"
          />
          <InputField
            label="연간 자동차세"
            unit="만원"
            placeholder="자동 계산"
            value={form.taxYearly}
            onChange={(v) => onChange('taxYearly', v)}
            hint="미입력 시 가격대별 자동 계산"
          />
          <InputField
            label="연간 정비비"
            unit="만원"
            placeholder="예: 80"
            value={form.maintenanceYearly}
            onChange={(v) => onChange('maintenanceYearly', v)}
            type="number"
            hint={`기본값: ${CAR_COSTS.MAINTENANCE.yearly / 10000}만원`}
          />
          <InputField
            label="월 주차비"
            unit="만원"
            placeholder="예: 12"
            value={form.parkingMonthly}
            onChange={(v) => onChange('parkingMonthly', v)}
            type="number"
            hint={`기본값: ${CAR_COSTS.PARKING.monthly / 10000}만원 (수도권)`}
          />
          <InputField
            label="월 기타비용"
            unit="만원"
            placeholder="예: 5"
            value={form.miscMonthly}
            onChange={(v) => onChange('miscMonthly', v)}
            type="number"
            hint={`세차, 통행료, 검사비 등. 기본값: ${CAR_COSTS.MISC.monthly / 10000}만원`}
          />
        </div>
    </div>
  );
}
