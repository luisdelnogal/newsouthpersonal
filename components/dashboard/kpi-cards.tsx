'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUpIcon, TrendingDownIcon, WalletIcon, AlertTriangleIcon } from 'lucide-react'
import { formatCurrency } from '@/lib/format'

interface KpiCardsProps {
  totalIncome: number
  totalExpense: number
  balance: number
  pendingReminders: number
}

export function KpiCards({ totalIncome, totalExpense, balance, pendingReminders }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Ingresos del mes
          </CardTitle>
          <TrendingUpIcon className="size-4 text-income" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-income">
            {formatCurrency(totalIncome)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Egresos del mes
          </CardTitle>
          <TrendingDownIcon className="size-4 text-expense" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-expense">
            {formatCurrency(totalExpense)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Ganancia real
          </CardTitle>
          <WalletIcon className="size-4 text-primary" />
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-income' : 'text-expense'}`}>
            {formatCurrency(balance)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Pagos pendientes
          </CardTitle>
          <AlertTriangleIcon className={`size-4 ${pendingReminders > 0 ? 'text-warning' : 'text-muted-foreground'}`} />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-foreground">
            {pendingReminders}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
