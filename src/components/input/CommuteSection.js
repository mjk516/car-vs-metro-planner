import InputField from './InputField';

export default function CommuteSection({ form, errors, onChange, fieldRefs }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="w-7 h-7 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-sm font-bold">2</span>
        통근 및 주행 정보
      </h3>

      {/* 평일 통근 */}
      <p className="text-sm font-medium text-gray-500 mb-2">평일 통근</p>
      <div className="grid md:grid-cols-2 gap-4">
        <InputField
          label="편도 통근 거리"
          unit="km"
          placeholder="예: 15"
          value={form.commuteDistance}
          onChange={(v) => onChange('commuteDistance', v)}
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
                onClick={() => onChange('commuteFrequency', day.toString())}
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

      {/* 주말/공휴일 */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <p className="text-sm font-medium text-gray-500 mb-2">주말 / 공휴일 주행</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">월 평균 외출 횟수</label>
            <div className="flex gap-2">
              {[0, 2, 4, 6, 8].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onChange('weekendTripsPerMonth', n.toString())}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                    parseInt(form.weekendTripsPerMonth) === n
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-green-500'
                  }`}
                >
                  {n === 0 ? '없음' : `${n}회`}
                </button>
              ))}
            </div>
            <p className="text-gray-400 text-xs mt-1">쇼핑, 나들이, 여가 등 차량 이용 횟수</p>
          </div>
          <InputField
            label="1회 평균 왕복 주행거리"
            unit="km"
            placeholder="예: 30"
            value={form.weekendTripDistance}
            onChange={(v) => onChange('weekendTripDistance', v)}
            type="number"
            hint="왕복 기준 (예: 마트 10km + 돌아오기 10km = 20km)"
          />
        </div>
      </div>
    </div>
  );
}
