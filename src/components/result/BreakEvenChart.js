'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceDot } from 'recharts';
import { formatManWon } from '@/utils/format';

export default function BreakEvenChart({ breakEvenData }) {
  const { data, breakEvenYear, totalCarCost, totalTransportCost } = breakEvenData;

  const lastData = data[data.length - 1];
  const totalCarGross = lastData?.carGross ?? 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const gross = payload.find((p) => p.dataKey === 'carGross');
      const net = payload.find((p) => p.dataKey === 'car');
      const trans = payload.find((p) => p.dataKey === 'transport');
      const resale = gross && net ? gross.value - net.value : 0;

      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg min-w-[200px]">
          <p className="font-semibold text-sm mb-2 pb-1 border-b border-gray-100">{label}년차</p>
          {gross && (
            <p className="text-sm text-blue-400">
              자가용 총 지출: {formatManWon(gross.value)}
            </p>
          )}
          {resale > 0 && (
            <p className="text-sm text-amber-500">
              - 차량 잔존가치: {formatManWon(Math.round(resale))}
            </p>
          )}
          {net && (
            <p className="text-sm font-semibold text-blue-600">
              = 자가용 순비용: {formatManWon(net.value)}
            </p>
          )}
          <div className="my-1.5 border-t border-gray-100" />
          {trans && (
            <p className="text-sm font-semibold text-green-600">
              대중교통 누적비용: {formatManWon(trans.value)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const legendPayload = [
    { value: '자가용 총 지출 (매각 전)', type: 'line', color: '#93bbfb', id: 'carGross' },
    { value: '자가용 순비용 (매각 후)', type: 'line', color: '#2563eb', id: 'car' },
    { value: '대중교통 누적비용', type: 'line', color: '#10b981', id: 'transport' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <h3 className="text-lg font-bold mb-2">손익분기점 분석</h3>
      <p className="text-sm text-gray-500 mb-4">
        15년간 누적 비용 추이 — 두 파란 선 사이 간격이 차량의 자산 가치(중고차 매각가)입니다
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
            <Tooltip content={CustomTooltip} />
            <Legend payload={legendPayload} />

            {/* 자가용 총 지출 (매각 전) - 연한 파란색 점선 */}
            <Line
              type="monotone"
              dataKey="carGross"
              name="carGross"
              stroke="#93bbfb"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={{ fill: '#93bbfb', r: 3 }}
              activeDot={{ r: 5 }}
            />
            {/* 자가용 순비용 (매각 후) - 진한 파란색 실선 */}
            <Line
              type="monotone"
              dataKey="car"
              name="car"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={{ fill: '#2563eb', r: 4 }}
              activeDot={{ r: 6 }}
            />
            {/* 대중교통 누적비용 - 녹색 실선 */}
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
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-blue-50/60 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500">자가용 {data.length}년 총 지출</p>
          <p className="text-sm font-bold text-blue-400 mt-1">{formatManWon(totalCarGross)}</p>
        </div>
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

      {/* 잔존가치 안내 */}
      {lastData && lastData.resale > 0 && (
        <div className="mt-3 bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500">
            {data.length}년 후 예상 차량 잔존가치 (중고차 매각가):{' '}
            <span className="font-semibold text-amber-600">{formatManWon(lastData.resale)}</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            * 자가용 순비용 = 총 지출 - 차량 매각 시 잔존가치 (차량은 자산이므로 처분 시 회수 가능)
          </p>
        </div>
      )}
    </div>
  );
}
