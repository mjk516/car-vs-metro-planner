'use client';

import { formatManWon, formatWon } from '@/utils/format';

export default function CostComparisonCard({ carCosts, transportCosts, loanCosts }) {
  // carCosts나 transportCosts가 없을 경우를 대비한 방어 코드
  if (!carCosts || !transportCosts) return null;

  const carMonthly = carCosts.monthlyTotal;
  const transportMonthly = transportCosts.monthlyTotal;
  const diff = carMonthly - transportMonthly;
  const cheaper = diff > 0 ? 'transport' : 'car';

  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <h3 className="text-lg font-bold mb-4">월간 비용 비교</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {/* 자가용 */}
        <div className={`rounded-xl p-5 ${cheaper === 'car' ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">자가용</span>
            {cheaper === 'car' && (
              <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">유리</span>
            )}
          </div>
          <p className="text-2xl font-bold text-foreground">{formatWon(carMonthly)}<span className="text-sm font-normal text-gray-500">/월</span></p>
          <p className="text-sm text-gray-500 mt-1">{formatManWon(Math.round(carCosts.yearlyTotal / 10000))}/년</p>
          
          <div className="mt-3 space-y-1.5 text-xs text-gray-500">
            {loanCosts && loanCosts.monthlyPayment > 0 ? (
              <>
                <CostRow 
                  label="할부 원금"
                  value={loanCosts.monthlyPayment - Math.round(loanCosts.totalInterest / (loanCosts.totalPayment / loanCosts.monthlyPayment))} 
                  isMonthly 
                />
                <CostRow 
                  label="할부 이자"
                  value={Math.round(loanCosts.totalInterest / (loanCosts.totalPayment / loanCosts.monthlyPayment))}
                  isMonthly 
                />
              </>
            ) : (
              <CostRow label="감가상각" value={carCosts.depreciation} />
            )}
            
            <CostRow label="유류비" value={carCosts.fuelCost} />
            <CostRow label="보험료" value={carCosts.insurance} />
            <CostRow label="자동차세" value={carCosts.tax} />
            <CostRow label="정비비" value={carCosts.maintenance} />
            <CostRow label="주차비" value={carCosts.parking} />
            <CostRow label="기타" value={carCosts.misc} />
          </div>
        </div>

        {/* 대중교통 */}
        <div className={`rounded-xl p-5 ${cheaper === 'transport' ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">대중교통</span>
            {cheaper === 'transport' && (
              <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">유리</span>
            )}
          </div>
          <p className="text-2xl font-bold text-foreground">{formatWon(transportMonthly)}<span className="text-sm font-normal text-gray-500">/월</span></p>
          <p className="text-sm text-gray-500 mt-1">{formatManWon(Math.round(transportCosts.yearlyTotal / 10000))}/년</p>
          <div className="mt-3 space-y-1.5 text-xs text-gray-500">
            <CostRow label="교통카드/정기권" value={transportCosts.monthlyPass * 12} />
            <CostRow label="택시 보조비" value={transportCosts.taxiMonthly * 12} />
            {/* 추가된 주말 외출 비용 항목 */}
            <CostRow label="주말 외출 비용" value={transportCosts.weekendMonthly * 12} />
          </div>
        </div>
      </div>

      <div className="mt-4 bg-gray-50 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-600">
          월간 비용 차이:{' '}
          <span className="font-bold text-lg text-foreground">{formatWon(Math.abs(diff))}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {cheaper === 'transport'
            ? `대중교통이 월 ${formatWon(Math.abs(diff))} 저렴합니다`
            : `자가용이 월 ${formatWon(Math.abs(diff))} 저렴합니다`}
        </p>
      </div>
    </div>
  );
}

function CostRow({ label, value, isMonthly }) {
  const safeValue = value || 0;
  const displayValue = isMonthly ? safeValue : Math.round(safeValue / 12);
  
  return (
    <div className="flex justify-between items-center gap-4 py-0.5">
      <span className="whitespace-nowrap flex-shrink-0">{label}</span>
      <span className="font-medium text-right">{formatWon(displayValue)}/월</span>
    </div>
  );
}