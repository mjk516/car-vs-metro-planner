'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { formatManWon } from '@/utils/format';

export default function DepreciationChart({ breakEvenData, initialCarPrice, loanCosts }) {
  // 데이터가 없으면 렌더링하지 않음
  if (!breakEvenData || !breakEvenData.data) return null;

  const startPrice = initialCarPrice; // 만원 단위
  
  // 데이터 가공: 0년차(신차)부터 시작하는 데이터셋 생성
  const chartData = [
    { 
      year: '신차', 
      resaleValue: startPrice, 
      depreciation: 0, 
      paidPrincipal: 0 
    },
    ...breakEvenData.data.slice(0, 10).map((item) => {
      let cumulativePaidPrincipal = 0;

      if (loanCosts) {
        // 월 할부 원금 = (총 상환액 - 총 이자) / 총 개월 수
        const totalPrincipal = (loanCosts.totalPayment - loanCosts.totalInterest) / 10000; // 만원 단위
        const totalMonths = loanCosts.totalPayment / loanCosts.monthlyPayment;
        const monthsPassed = item.year * 12;

        // 경과 연수에 따른 누적 상환 원금 (총 원금을 넘지 않도록 제한)
        cumulativePaidPrincipal = Math.min(
          (totalPrincipal / totalMonths) * monthsPassed,
          totalPrincipal
        );
      }

      // 이전 연도 잔존가치 찾기 (감가액 계산용)
      const prevYearData = item.year === 1 
        ? startPrice 
        : breakEvenData.data.find(d => d.year === item.year - 1)?.resale;

      return {
        year: `${item.year}년`,
        resaleValue: item.resale, // 해당 연도 잔존가치
        depreciation: prevYearData - item.resale, // 해당 연도 감가액
        paidPrincipal: Math.round(cumulativePaidPrincipal)
      };
    })
  ];

  return (
    <div className="bg-white rounded-2xl border border-border p-6 space-y-8">
      <div>
        <h3 className="text-lg font-bold mb-1">자산 가치 및 감가상각 분석</h3>
        <p className="text-sm text-gray-500">
          차량의 잔존가치 하락과 {loanCosts ? '할부 원금 상환' : '자산 변화'} 추이를 분석합니다.
        </p>
      </div>

      {/* 가치 변화 그래프 (Area + Line) */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="colorResale" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="year" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}만`} />
            <Tooltip 
              formatter={(val, name) => [
                `${Math.round(val).toLocaleString()} 만원`, 
                name === 'resaleValue' ? '중고차 시세' : '누적 원금상환'
              ]}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            {/* 잔존가치 영역 */}
            <Area 
              type="monotone" 
              dataKey="resaleValue" 
              stroke="#6366f1" 
              fillOpacity={1} 
              fill="url(#colorResale)" 
              strokeWidth={3}
              name="resaleValue"
            />
            {/* 할부 시 누적 상환액 선 */}
            {loanCosts && (
              <Line 
                type="monotone" 
                dataKey="paidPrincipal" 
                stroke="#10b981" 
                strokeWidth={2} 
                strokeDasharray="5 5"
                dot={{ r: 3, fill: '#10b981' }}
                name="paidPrincipal"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* 상세 데이터 표 */}
      <div className="overflow-x-auto border border-gray-100 rounded-xl">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium">
            <tr>
              <th className="px-4 py-3 font-semibold">보유 기간</th>
              <th className="px-4 py-3 text-right font-semibold">예상 시세</th>
              <th className="px-4 py-3 text-right font-semibold">연간 감가액</th>
              {loanCosts && <th className="px-4 py-3 text-right font-semibold text-green-700">원금 상환(누적)</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {chartData.map((item) => (
              <tr key={item.year} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-700">
                  {item.year === '신차' ? '구매 시점' : item.year}
                </td>
                <td className="px-4 py-3 text-right text-blue-600 font-bold">
                  {formatManWon(item.resaleValue)}
                </td>
                <td className="px-4 py-3 text-right text-red-500">
                  {item.depreciation > 0 ? `-${formatManWon(item.depreciation)}` : '-'}
                </td>
                {loanCosts && (
                  <td className="px-4 py-3 text-right text-green-600 font-medium">
                    {item.year === '신차' ? '-' : formatManWon(item.paidPrincipal)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* 분석 팁 */}
      <div className="bg-blue-50 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
        <strong>💡 데이터 분석 팁:</strong>
        <ul className="list-disc ml-4 mt-1 space-y-1">
          <li><strong>중고차 시세</strong>가 급격히 떨어지는 초기 1~3년이 감가상각 부담이 가장 큰 시기입니다.</li>
          {loanCosts && (
            <li>
              <strong>원금 상환액</strong>이 중고차 시세보다 아래에 있다면, 차량 매각 시 할부금을 모두 갚고도 현금이 남는 
              <span className="font-bold"> {'\'정(+)의 자산\''} </span> 구간입니다.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}