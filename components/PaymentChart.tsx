'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

type ChartPoint = { month: number; balance: number };

export default function PaymentChart({
  data,
  yLabel,
  formatValue,
}: {
  data: ChartPoint[];
  yLabel: string;
  formatValue: (n: number) => string;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
        <defs>
          <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopOpacity={0.8} />
            <stop offset="100%" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis
          tickFormatter={(v) =>
            formatValue(v).replace(/[^\d.,-]/g, '')
          }
          label={{ value: yLabel, angle: -90, position: 'insideLeft' }}
        />
        <Tooltip
          formatter={(value: any) => [formatValue(value as number), 'Balance']}
          labelFormatter={(label) => `Month ${label}`}
        />
        <Area
          type="monotone"
          dataKey="balance"
          strokeOpacity={1}
          fillOpacity={0.2}
          fill="url(#balanceGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
