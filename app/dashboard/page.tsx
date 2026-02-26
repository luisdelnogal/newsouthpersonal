import { createClient } from '@/lib/supabase/server'
import { getCurrentMonthRange, formatShortDate } from '@/lib/format'
import { KpiCards } from '@/components/dashboard/kpi-cards'
import { IncomeExpenseChart } from '@/components/dashboard/income-expense-chart'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { start, end, label } = getCurrentMonthRange()

  // Fetch current month transactions
  const { data: monthTransactions } = await supabase
    .from('transactions')
    .select('id, type, amount, description, date, category_id, categories(name)')
    .gte('date', start)
    .lte('date', end)
    .order('date', { ascending: false })

  // Fetch pending reminders
  const { count: pendingReminders } = await supabase
    .from('payment_reminders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pendiente')

  // Calculate KPIs
  const totalIncome = (monthTransactions || [])
    .filter((t) => t.type === 'ingreso')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpense = (monthTransactions || [])
    .filter((t) => t.type === 'egreso')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const balance = totalIncome - totalExpense

  // Aggregate daily data for chart
  const dailyMap = new Map<string, { ingresos: number; egresos: number }>()
  for (const t of monthTransactions || []) {
    const existing = dailyMap.get(t.date) || { ingresos: 0, egresos: 0 }
    if (t.type === 'ingreso') {
      existing.ingresos += Number(t.amount)
    } else {
      existing.egresos += Number(t.amount)
    }
    dailyMap.set(t.date, existing)
  }

  const chartData = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]) => ({
      date: formatShortDate(date),
      ingresos: data.ingresos,
      egresos: data.egresos,
    }))

  // Recent transactions for the list
  const recentTransactions = (monthTransactions || []).slice(0, 8).map((t) => ({
    id: t.id,
    type: t.type as 'ingreso' | 'egreso',
    amount: Number(t.amount),
    description: t.description,
    date: t.date,
    category_name: (t.categories as unknown as { name: string })?.name || 'Sin categoria',
  }))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          Panel de Control
        </h1>
        <p className="text-sm text-muted-foreground">
          Resumen de {label}
        </p>
      </div>

      <KpiCards
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        balance={balance}
        pendingReminders={pendingReminders || 0}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <IncomeExpenseChart data={chartData} />
        </div>
        <div className="lg:col-span-2">
          <RecentTransactions transactions={recentTransactions} />
        </div>
      </div>
    </div>
  )
}
