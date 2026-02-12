'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceDot } from 'recharts';
import { formatManWon } from '@/utils/format';

export default function BreakEvenChart({ breakEvenData }) {
  const { data, breakEvenYear, totalCarCost, totalTransportCost } = breakEvenData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-sm mb-1">{label}년차</p>
          {payload.map((entry) => (
            <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
              {entry.name === 'car' ? '자가용' : '대중교통'}: {formatManWon(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <h3 className="text-lg font-bold mb-2">손익분기점 분석</h3>
      <p className="text-sm text-gray-500 mb-4">
        15년간 누적 비용 추이 (차량 구매비 포함, 매년 중고차 잔존가치 차감)
      </p>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="year"
              tickFormatter={(v) => `${v}년`}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickFormatter={(v) => `${v.toLocaleString()}`}
              tick={{ fontSize: 11 }}
              label={{ value: '만원', position: 'insideTopLeft', offset: -5, fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (value === 'car' ? '자가용 누적비용' : '대중교통 누적비용')}
            />
            <Line
              type="monotone"
              dataKey="car"
              name="car"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={{ fill: '#2563eb', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="transport"
              name="transport"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
            />
            {breakEvenYear && (
              <ReferenceDot
                x={breakEvenYear}
                y={data[breakEvenYear - 1]?.car}
                r={8}
                fill="#f59e0b"
                stroke="#fff"
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 분석 요약 */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500">자가용 {data.length}년 순비용</p>
          <p className="text-sm font-bold text-blue-600 mt-1">{formatManWon(totalCarCost)}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500">대중교통 {data.length}년 총비용</p>
          <p className="text-sm font-bold text-green-600 mt-1">{formatManWon(totalTransportCost)}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500">손익분기점</p>
          <p className="text-sm font-bold text-amber-600 mt-1">
            {breakEvenYear ? `${breakEvenYear}년차` : `${data.length}년 내 없음`}
          </p>
        </div>
      </div>
      {/* 잔존가치 참고 */}
      {data.length > 0 && (
        <p className="text-xs text-gray-400 mt-2 text-center">
          * 자가용 순비용 = 총 지출 + 잔여 대출금 - 중고차 매각 시 잔존가치 ({formatManWon(data[data.length - 1].resale)})
        </p>
      )}
    </div>
  );
}
