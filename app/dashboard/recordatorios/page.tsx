import { createClient } from '@/lib/supabase/server'
import { ReminderForm } from '@/components/recordatorios/reminder-form'
import { formatCurrency, formatDate } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BellIcon, CheckCircle2Icon, AlertTriangleIcon, ClockIcon } from 'lucide-react'
import { ReminderActions } from '@/components/recordatorios/reminder-actions'

export default async function RecordatoriosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, type')
    .eq('type', 'egreso')
    .eq('is_active', true)
    .order('name')

  const { data: reminders } = await supabase
    .from('payment_reminders')
    .select('*, categories(name)')
    .order('due_date', { ascending: true })

  const today = new Date().toISOString().split('T')[0]

  const statusConfig = {
    pendiente: { label: 'Pendiente', icon: ClockIcon, className: 'bg-warning/10 text-warning' },
    pagado: { label: 'Pagado', icon: CheckCircle2Icon, className: 'bg-income/10 text-income' },
    vencido: { label: 'Vencido', icon: AlertTriangleIcon, className: 'bg-expense/10 text-expense' },
  }

  const recurrenceLabels: Record<string, string> = {
    semanal: 'Semanal',
    quincenal: 'Quincenal',
    mensual: 'Mensual',
    bimestral: 'Bimestral',
    trimestral: 'Trimestral',
    anual: 'Anual',
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Recordatorios de Pago
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestiona vencimientos y pagos recurrentes
          </p>
        </div>
        {profile?.role !== 'lectura' && (
          <ReminderForm
            userId={user!.id}
            categories={(categories || []) as Array<{ id: string; name: string; type: string }>}
          />
        )}
      </div>

      {(!reminders || reminders.length === 0) ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <BellIcon className="mb-3 size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No hay recordatorios creados
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reminders.map((r) => {
            const isOverdue = r.status === 'pendiente' && r.due_date < today
            const effectiveStatus = isOverdue ? 'vencido' : r.status as keyof typeof statusConfig
            const config = statusConfig[effectiveStatus]
            const StatusIcon = config.icon

            return (
              <Card key={r.id} className={isOverdue ? 'border-expense/30' : ''}>
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="flex-1">
                    <CardTitle className="text-sm font-semibold">
                      {r.title}
                    </CardTitle>
                    {r.description && (
                      <p className="mt-1 text-xs text-muted-foreground">{r.description}</p>
                    )}
                  </div>
                  <Badge variant="secondary" className={config.className}>
                    <StatusIcon className="mr-1 size-3" />
                    {config.label}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Vencimiento</span>
                      <span className="font-medium tabular-nums">{formatDate(r.due_date)}</span>
                    </div>
                    {r.amount && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Monto</span>
                        <span className="font-semibold tabular-nums">{formatCurrency(Number(r.amount))}</span>
                      </div>
                    )}
                    {(r.categories as unknown as { name: string })?.name && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Categoria</span>
                        <span className="text-sm">{(r.categories as unknown as { name: string }).name}</span>
                      </div>
                    )}
                    {r.is_recurring && r.recurrence_interval && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Recurrencia</span>
                        <Badge variant="outline" className="text-xs">
                          {recurrenceLabels[r.recurrence_interval] || r.recurrence_interval}
                        </Badge>
                      </div>
                    )}
                  </div>
                  {profile?.role !== 'lectura' && r.status !== 'pagado' && (
                    <div className="mt-3">
                      <ReminderActions reminderId={r.id} />
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
