'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Suspense } from 'react'

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

function MonthSelectorInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  const selectedYear = Number(searchParams.get('year') || currentYear)
  const selectedMonth = Number(searchParams.get('month') ?? currentMonth)

  const years = Array.from({ length: 3 }, (_, i) => currentYear - i)

  function updateParams(year: number, month: number) {
    router.push(`/dashboard/cierre?year=${year}&month=${month}`)
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={String(selectedMonth)}
        onValueChange={(v) => updateParams(selectedYear, Number(v))}
      >
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {months.map((m, i) => (
            <SelectItem key={i} value={String(i)}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={String(selectedYear)}
        onValueChange={(v) => updateParams(Number(v), selectedMonth)}
      >
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function MonthSelector() {
  return (
    <Suspense fallback={<div className="h-9 w-64 animate-pulse rounded-md bg-muted" />}>
      <MonthSelectorInner />
    </Suspense>
  )
}
