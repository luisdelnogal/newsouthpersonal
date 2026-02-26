'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/format'
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'

interface Transaction {
  id: string
  type: 'ingreso' | 'egreso'
  amount: number
  description: string | null
  date: string
  category_name: string
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Ultimos movimientos</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No hay transacciones registradas todavia
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3">
                <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                  tx.type === 'ingreso' ? 'bg-income/10' : 'bg-expense/10'
                }`}>
                  {tx.type === 'ingreso' ? (
                    <ArrowUpIcon className="size-4 text-income" />
                  ) : (
                    <ArrowDownIcon className="size-4 text-expense" />
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {tx.description || tx.category_name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {tx.category_name} &middot; {formatDate(tx.date)}
                  </span>
                </div>
                <span className={`text-sm font-semibold tabular-nums ${
                  tx.type === 'ingreso' ? 'text-income' : 'text-expense'
                }`}>
                  {tx.type === 'ingreso' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
