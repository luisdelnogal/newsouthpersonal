'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface CategoryBreakdown {
  name: string
  amount: number
  color: string
}

interface CategoryPieChartProps {
  title: string
  data: CategoryBreakdown[]
}

const COLORS = [
  'oklch(0.55 0.12 175)',
  'oklch(0.70 0.14 75)',
  'oklch(0.50 0.04 250)',
  'oklch(0.65 0.08 150)',
  'oklch(0.65 0.16 30)',
  'oklch(0.60 0.10 280)',
  'oklch(0.55 0.12 120)',
  'oklch(0.70 0.10 350)',
]

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-card p-3 shadow-md">
        <p className="text-sm font-medium text-card-foreground">{payload[0].name}</p>
        <p className="text-sm text-muted-foreground">{formatCurrency(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export function CategoryPieChart({ title, data }: CategoryPieChartProps) {
  const total = data.reduce((sum, d) => sum + d.amount, 0)

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-sm text-muted-foreground">
            Sin datos para este periodo
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={2}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                formatter={(value: string, entry) => {
                  const item = data.find((d) => d.name === value)
                  const pct = item ? ((item.amount / total) * 100).toFixed(0) : '0'
                  return `${value} (${pct}%)`
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-center">
          <span className="text-sm text-muted-foreground">Total: </span>
          <span className="text-sm font-semibold text-foreground">{formatCurrency(total)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
