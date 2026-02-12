'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { INVESTMENT_PROFILES } from '@/data/investment-data';
import { formatWon } from '@/utils/format';

const COLORS = {
  deposit: '#3b82f6',
  bond: '#10b981',
  stock: '#f59e0b',
  etc: '#8b5cf6',
};

const LABELS = {
  deposit: '예금/적금',
  bond: '채권',
  stock: '주식/ETF',
  etc: '기타 (금 등)',
};

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-sm">{item.name}</p>
        <p className="text-sm text-gray-600">비중: {item.value}%</p>
        <p className="text-sm text-gray-600">월 투자: {formatWon(item.amount)}</p>
      </div>
    );
  }
  return null;
}

export default function AllocationChart({ profileId, monthlySavings }) {
  const profile = INVESTMENT_PROFILES[profileId];
  if (!profile) return null;

  const data = Object.entries(profile.allocation).map(([key, value]) => ({
    name: LABELS[key],
    value,
    amount: Math.round(monthlySavings * value / 100),
    color: COLORS[key],
  }));

  // 10년 복리 예상 수익 계산
  const expectedReturnRate = profileId === 'conservative' ? 0.04
    : profileId === 'balanced' ? 0.065
    : 0.10;
  const monthlyRate = expectedReturnRate / 12;
  const months = 120; // 10년
  const futureValue = monthlySavings * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <h3 className="text-lg font-bold mb-1">자산 배분 현황</h3>
      <p className="text-sm text-gray-500 mb-4">{profile.name} 포트폴리오</p>

      <div className="flex flex-col items-center gap-4">
        <div className="h-48 w-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                dataKey="value"
                paddingAngle={3}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-gray-600">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="font-medium">{item.value}%</span>
                <span className="text-gray-400 ml-2">{formatWon(item.amount)}/월</span>
              </div>
            </div>
          ))}
        </div>

        {/* 10년 예상 수익 */}
        <div className="w-full bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-4 text-white text-center mt-2">
          <p className="text-xs opacity-80">10년 후 예상 자산 (복리 기준)</p>
          <p className="text-2xl font-bold mt-1">
            {(futureValue / 10000).toLocaleString('ko-KR', { maximumFractionDigits: 0 })}만원
          </p>
          <p className="text-xs opacity-70 mt-1">
            총 투자금: {((monthlySavings * months) / 10000).toLocaleString('ko-KR')}만원 | 기대수익률: 연 {(expectedReturnRate * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
