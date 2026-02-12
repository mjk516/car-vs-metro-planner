export default function Disclaimer({ type = 'general' }) {
  const messages = {
    general: '본 서비스에서 제공하는 모든 정보는 참고용이며, 실제 비용은 개인 상황에 따라 다를 수 있습니다. 중요한 재정적 결정을 내리기 전에 전문가와 상담하시기를 권장합니다.',
    investment: '본 서비스에서 제공하는 투자 정보는 투자 권유가 아니며, 투자에 따른 손실은 투자자 본인에게 귀속됩니다. 과거의 수익률이 미래의 수익률을 보장하지 않습니다. 투자 결정 전 반드시 투자설명서를 확인하시고, 필요시 전문 투자상담사와 상담하시기 바랍니다.',
    car: '차량 가격 및 유지비 정보는 2024~2025년 기준 평균값이며, 실제 가격은 옵션, 지역, 시기에 따라 다를 수 있습니다. 정확한 견적은 공식 딜러를 통해 확인하시기 바랍니다.',
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-amber-800">유의사항</p>
          <p className="text-sm text-amber-700 mt-1 leading-relaxed">{messages[type]}</p>
        </div>
      </div>
    </div>
  );
}
