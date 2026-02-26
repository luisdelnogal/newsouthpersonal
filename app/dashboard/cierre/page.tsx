import { createClient } from '@/lib/supabase/server'
import { getMonthRange, formatCurrency } from '@/lib/format'
import { MonthSelector } from '@/components/cierre/month-selector'
import { CategoryPieChart } from '@/components/cierre/category-pie-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUpIcon, TrendingDownIcon, WalletIcon } from 'lucide-react'

interface CierrePageProps {
  searchParams: Promise<{ year?: string; month?: string }>
}

export default async function CierrePage({ searchParams }: CierrePageProps) {
  const params = await searchParams
  const now = new Date()
  const year = Number(params.year || now.getFullYear())
  const month = Number(params.month ?? now.getMonth())

  const { start, end, label } = getMonthRange(year, month)

  const supabase = await createClient()

  // Fetch all transactions for the month
  const { data: transactions } = await supabase
    .from('transactions')
    .select('id, type, amount, category_id, categories(name)')
    .gte('date', start)
    .lte('date', end)

  const allTx = transactions || []

  // Calculate totals
  const totalIncome = allTx
    .filter((t) => t.type === 'ingreso')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpense = allTx
    .filter((t) => t.type === 'egreso')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const balance = totalIncome - totalExpense

  // Aggregate by category
  function aggregateByCategory(type: 'ingreso' | 'egreso') {
    const map = new Map<string, number>()
    allTx
      .filter((t) => t.type === type)
      .forEach((t) => {
        const catName = (t.categories as unknown as { name: string })?.name || 'Sin categoria'
        map.set(catName, (map.get(catName) || 0) + Number(t.amount))
      })
    return Array.from(map.entries())
      .map(([name, amount]) => ({ name, amount, color: '' }))
      .sort((a, b) => b.amount - a.amount)
  }

  const incomeByCategory = aggregateByCategory('ingreso')
  const expenseByCategory = aggregateByCategory('egreso')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Cierre Mensual
          </h1>
          <p className="text-sm text-muted-foreground capitalize">
            {label}
          </p>
        </div>
        <MonthSelector />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Ingresos
            </CardTitle>
            <TrendingUpIcon className="size-4 text-income" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-income">
              {formatCurrency(totalIncome)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {allTx.filter((t) => t.type === 'ingreso').length} transacciones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Egresos
            </CardTitle>
            <TrendingDownIcon className="size-4 text-expense" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-expense">
              {formatCurrency(totalExpense)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {allTx.filter((t) => t.type === 'egreso').length} transacciones
            </p>
          </CardContent>
        </Card>

        <Card className={balance >= 0 ? 'border-income/30 bg-income/5' : 'border-expense/30 bg-expense/5'}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ganancia Real
            </CardTitle>
            <WalletIcon className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${balance >= 0 ? 'text-income' : 'text-expense'}`}>
              {formatCurrency(balance)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Margen: {totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : '0'}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryPieChart
          title="Ingresos por categoria"
          data={incomeByCategory}
        />
        <CategoryPieChart
          title="Egresos por categoria"
          data={expenseByCategory}
        />
      </div>

      {/* Detailed breakdown table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Desglose por categoria</CardTitle>
        </CardHeader>
        <CardContent>
          {expenseByCategory.length === 0 && incomeByCategory.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No hay transacciones en este periodo
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {incomeByCategory.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-income">Ingresos</h3>
                  <div className="flex flex-col gap-2">
                    {incomeByCategory.map((cat) => (
                      <div key={cat.name} className="flex items-center justify-between">
                        <span className="text-sm text-foreground">{cat.name}</span>
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-income"
                              style={{ width: `${(cat.amount / totalIncome) * 100}%` }}
                            />
                          </div>
                          <span className="w-28 text-right text-sm font-medium tabular-nums text-foreground">
                            {formatCurrency(cat.amount)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {expenseByCategory.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-expense">Egresos</h3>
                  <div className="flex flex-col gap-2">
                    {expenseByCategory.map((cat) => (
                      <div key={cat.name} className="flex items-center justify-between">
                        <span className="text-sm text-foreground">{cat.name}</span>
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-expense"
                              style={{ width: `${(cat.amount / totalExpense) * 100}%` }}
                            />
                          </div>
                          <span className="w-28 text-right text-sm font-medium tabular-nums text-foreground">
                            {formatCurrency(cat.amount)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
