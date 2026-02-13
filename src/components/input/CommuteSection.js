import InputField from './InputField';

/**
 * 이동 정보 입력 섹션 (출퇴근 + 주말)
 */
export default function CommuteSection({ form, errors, onChange, setFieldRef }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="w-7 h-7 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-sm font-bold">2</span>
        출퇴근 및 이동 정보
      </h3>
      
      <div className="space-y-4">
        <InputField
          label="편도 통근 거리"
          unit="km"
          placeholder="예: 15"
          value={form.commuteDistance}
          onChange={(v) => onChange('commuteDistance', v)}
          error={errors.commuteDistance}
          type="number"
          ref={(el) => setFieldRef('commuteDistance', el)}
        />
        
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 mb-1">주간 통근 횟수</label>
          <div className="flex gap-2 p-1 bg-gray-50 rounded-xl">
            {[3, 4, 5, 6, 7].map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => onChange('commuteFrequency', String(day))}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  form.commuteFrequency === String(day)
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {day}일
              </button>
            ))}
          </div>
        </div>

        {/* 주말 이동 정보 추가 섹션 */}
        <div className="pt-6 mt-6 border-t border-gray-100 space-y-4">
          <h4 className="text-sm font-bold text-gray-800">🗓️ 주말 및 공휴일 추가 이동</h4>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="월간 외출 횟수"
              unit="회"
              placeholder="예: 4"
              value={form.weekendTripsPerMonth}
              onChange={(v) => onChange('weekendTripsPerMonth', v)}
              ref={(el) => setFieldRef('weekendTripsPerMonth', el)}
            />
            <InputField
              label="1회 평균 거리"
              unit="km"
              placeholder="예: 30"
              value={form.weekendTripDistance}
              onChange={(v) => onChange('weekendTripDistance', v)}
              ref={(el) => setFieldRef('weekendTripDistance', el)}
            />
          </div>
          <p className="text-[11px] text-gray-400">
            * 주말 외출 시 발생하는 대중교통 이용료와 차량 운행 비용을 분석에 합산합니다.
          </p>
        </div>
      </div>
    </div>
  );
}