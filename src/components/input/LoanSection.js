'use client';

import InputField from './InputField';

/**
 * 할부 및 금융 정보 입력 섹션
 * 부모(InputForm)로부터 form, errors, onChange, setFieldRef를 전달받습니다.
 */
export default function LoanSection({ form, errors, onChange, setFieldRef }) {
  // 방어 로직: form 객체가 아직 로드되지 않았을 경우 렌더링을 방지합니다.
  if (!form) {
    return null;
  }

  // 할부 미사용 시 (전액 일시불 구매)
  if (!form.useLoan) {
    return (
      <div className="bg-white rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="w-7 h-7 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-sm font-bold">
              4
            </span>
            {/* 💡 에러 해결: 제목을 "할부 상세 설정"으로 통일 */}
            할부 상세 설정
          </h3>
          <button
            type="button"
            onClick={() => onChange('useLoan', true)}
            className="text-sm text-primary font-semibold hover:underline"
          >
            할부 계산하기
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          현재 전액 일시불 구매로 설정되어 있습니다.
        </p>
      </div>
    );
  }

  // 할부 사용 시 상세 설정 화면
  return (
    <div className="bg-white rounded-2xl border border-border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span className="w-7 h-7 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-sm font-bold">
            4
          </span>
          할부 상세 설정
        </h3>
        <button
          type="button"
          onClick={() => onChange('useLoan', false)}
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          일시불로 변경
        </button>
      </div>

      <div className="space-y-4">
        {/* 선수금 비율 입력 */}
        <InputField
          label="선수금 비율"
          unit="%"
          type="number"
          placeholder="예: 30"
          value={form.downPaymentPercent || ''}
          onChange={(v) => onChange('downPaymentPercent', v)}
          error={errors?.downPaymentPercent}
          hint="차량 가격 대비 먼저 지불할 금액의 비율"
          ref={(el) => setFieldRef('downPaymentPercent', el)}
        />

        {/* 할부 기간 선택 (그리드 스타일) */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">할부 기간</label>
          <div className="grid grid-cols-3 gap-2">
            {[12, 24, 36, 48, 60, 72].map((month) => (
              <button
                key={month}
                type="button"
                onClick={() => onChange('loanTermMonths', String(month))}
                className={`py-2.5 text-sm font-medium rounded-xl border transition-all ${
                  form.loanTermMonths === String(month)
                    ? 'bg-primary border-primary text-white shadow-md'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                }`}
              >
                {month}개월
              </button>
            ))}
          </div>
          <div ref={(el) => setFieldRef('loanTermMonths', el)} />
        </div>

        {/* 할부 금리 입력 */}
        <InputField
          label="할부 금리"
          unit="%"
          type="number"
          step="0.1"
          placeholder="예: 4.5"
          value={form.loanRate || ''}
          onChange={(v) => onChange('loanRate', v)}
          error={errors?.loanRate}
          hint="연 이자율 기준"
          ref={(el) => setFieldRef('loanRate', el)}
        />
      </div>

      {/* 안내 문구 */}
      <div className="p-4 bg-gray-50 rounded-xl">
        <p className="text-[11px] text-gray-500 leading-relaxed">
          * 입력하신 할부 조건은 월 납입금 계산에 반영되며, 이는 주말 및 공휴일 이동을 포함한 전체 유지비 분석에 사용됩니다.
        </p>
      </div>
    </div>
  );
}