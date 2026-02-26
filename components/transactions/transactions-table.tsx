'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/format'
import { Trash2Icon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Transaction {
  id: string
  type: 'ingreso' | 'egreso'
  amount: number
  description: string | null
  date: string
  payment_method: string
  category_name: string
  created_by_name: string
}

interface TransactionsTableProps {
  transactions: Transaction[]
  userRole: string
}

const paymentMethodLabels: Record<string, string> = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  cheque: 'Cheque',
  tarjeta: 'Tarjeta',
  otro: 'Otro',
}

export function TransactionsTable({ transactions, userRole }: TransactionsTableProps) {
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()

  async function handleDelete(id: string) {
    setDeleting(id)
    const supabase = createClient()
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    setDeleting(null)

    if (error) {
      toast.error('Error al eliminar: ' + error.message)
      return
    }

    toast.success('Transaccion eliminada')
    router.refresh()
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <p className="text-sm text-muted-foreground">
          No hay transacciones para mostrar
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Usa el boton &quot;Nueva transaccion&quot; para registrar un movimiento
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">Tipo</TableHead>
            <TableHead>Descripcion</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Medio</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            {userRole === 'admin' && <TableHead className="w-10" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>
                <div className={`flex size-7 items-center justify-center rounded-md ${
                  tx.type === 'ingreso' ? 'bg-income/10' : 'bg-expense/10'
                }`}>
                  {tx.type === 'ingreso' ? (
                    <ArrowUpIcon className="size-3.5 text-income" />
                  ) : (
                    <ArrowDownIcon className="size-3.5 text-expense" />
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {tx.description || '-'}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="text-xs">
                  {tx.category_name}
                </Badge>
              </TableCell>
              <TableCell className="text-sm tabular-nums">
                {formatDate(tx.date)}
              </TableCell>
              <TableCell className="text-sm">
                {paymentMethodLabels[tx.payment_method] || tx.payment_method}
              </TableCell>
              <TableCell className={`text-right font-semibold tabular-nums ${
                tx.type === 'ingreso' ? 'text-income' : 'text-expense'
              }`}>
                {tx.type === 'ingreso' ? '+' : '-'}{formatCurrency(tx.amount)}
              </TableCell>
              {userRole === 'admin' && (
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground hover:text-destructive"
                        disabled={deleting === tx.id}
                      >
                        <Trash2Icon className="size-3.5" />
                        <span className="sr-only">Eliminar transaccion</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar transaccion</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta accion no se puede deshacer. Se eliminara permanentemente esta transaccion.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(tx.id)}>
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
