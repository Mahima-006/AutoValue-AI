import { useEffect, useRef } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--color-surface-high)',
      border: '1px solid var(--color-outline-var)',
      borderRadius: 8, padding: '10px 14px', fontSize: 13,
    }}>
      <p style={{ color: 'var(--color-on-surface-var)', marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontVariantNumeric: 'tabular-nums', margin: '2px 0' }}>
          {p.name}: ₹{p.value?.toLocaleString('en-IN')}
        </p>
      ))}
    </div>
  )
}

export default function PriceChart({ data = [] }) {
  if (!data.length) return null

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(67,70,86,0.4)" />
        <XAxis
          dataKey="month"
          tick={{ fill: 'var(--color-outline)', fontSize: 10 }}
          tickLine={false}
          axisLine={{ stroke: 'var(--color-outline-var)' }}
          interval={2}
        />
        <YAxis
          tick={{ fill: 'var(--color-outline)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          width={48}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          formatter={(value) => (
            <span style={{ color: 'var(--color-on-surface-var)' }}>{value}</span>
          )}
        />
        <Line
          type="monotone"
          dataKey="predicted"
          name="Predicted"
          stroke="var(--color-primary-container)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: 'var(--color-primary-container)' }}
          animationDuration={1800}
          animationEasing="ease-out"
        />
        <Line
          type="monotone"
          dataKey="market_avg"
          name="Market Avg"
          stroke="var(--color-tertiary)"
          strokeWidth={2}
          strokeDasharray="5 3"
          dot={false}
          activeDot={{ r: 4, fill: 'var(--color-tertiary)' }}
          animationDuration={2200}
          animationEasing="ease-out"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
