import { createClient } from '@/lib/supabase/server'
import { TransactionForm } from '@/components/transactions/transaction-form'
import { TransactionsTable } from '@/components/transactions/transactions-table'

export default async function TransaccionesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch categories for the form
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, type')
    .eq('is_active', true)
    .order('name')

  // Fetch user profile for role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single()

  // Fetch transactions with category and creator info
  const { data: transactions } = await supabase
    .from('transactions')
    .select('id, type, amount, description, date, payment_method, created_by, categories(name), profiles(full_name)')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(100)

  const formattedTransactions = (transactions || []).map((t) => ({
    id: t.id,
    type: t.type as 'ingreso' | 'egreso',
    amount: Number(t.amount),
    description: t.description,
    date: t.date,
    payment_method: t.payment_method,
    category_name: (t.categories as unknown as { name: string })?.name || 'Sin categoria',
    created_by_name: (t.profiles as unknown as { full_name: string })?.full_name || 'Desconocido',
  }))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Transacciones
          </h1>
          <p className="text-sm text-muted-foreground">
            Registra y consulta todos los movimientos de tu negocio
          </p>
        </div>
        {profile?.role !== 'lectura' && (
          <TransactionForm
            categories={(categories || []) as Array<{ id: string; name: string; type: 'ingreso' | 'egreso' }>}
            userId={user!.id}
          />
        )}
      </div>

      <TransactionsTable
        transactions={formattedTransactions}
        userRole={profile?.role || 'lectura'}
      />
    </div>
  )
}
