'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatWon } from '@/utils/format';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

export default function CostPieChart({ carCosts }) {
  const data = [
    { name: '감가상각', value: carCosts.depreciation },
    { name: '유류비', value: carCosts.fuelCost },
    { name: '보험료', value: carCosts.insurance },
    { name: '자동차세', value: carCosts.tax },
    { name: '정비비', value: carCosts.maintenance },
    { name: '주차비', value: carCosts.parking },
    { name: '기타', value: carCosts.misc },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-sm">{item.name}</p>
          <p className="text-sm text-gray-600">연간: {formatWon(item.value)}</p>
          <p className="text-sm text-gray-600">비중: {((item.value / total) * 100).toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <h3 className="text-lg font-bold mb-4">자가용 비용 구성</h3>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="h-52 w-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                paddingAngle={2}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-2">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index] }} />
              <span className="text-xs text-gray-600">{item.name}</span>
              <span className="text-xs font-medium ml-auto">{((item.value / total) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
