'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { PlusIcon } from 'lucide-react'
interface Category {
  id: string
  name: string
  type: 'ingreso' | 'egreso'
}

interface Client {
  id: string
  name: string
}

interface TransactionFormProps {
  categories: Category[]
  clients: Client[]
  userId: string
}
export function TransactionForm({ categories,clients,userId }: TransactionFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<'ingreso' | 'egreso'>('egreso')
  const [hasRemito, setHasRemito] = useState(false)
  const [clientId, setClientId] = useState<string | null>(null)
  const [remitoNumber, setRemitoNumber] = useState("")

  const router = useRouter()
  
  const filteredCategories = categories.filter((c) => c.type === type)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const { error } = await supabase.from('transactions').insert({
     type,
     amount: Number(formData.get('amount')),
     description: (formData.get('description') as string) || null,
     category_id: formData.get('category_id') as string,
     date: formData.get('date') as string,
     payment_method: formData.get('payment_method') as string,
     created_by: userId,

    client_id: clientId,
     remito_number: hasRemito ? (remitoNumber.trim() || null) : null,
   })

    setLoading(false)

    if (error) {
      toast.error('Error al guardar: ' + error.message)
      return
    }

    toast.success('Transaccion registrada')
    setOpen(false)

    setClientId(null)
    setHasRemito(false)
    setRemitoNumber("")

    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 size-4" />
          Nueva transaccion
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar transaccion</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={type === 'ingreso' ? 'default' : 'outline'}
              className={type === 'ingreso' ? 'flex-1 bg-income text-primary-foreground hover:bg-income/90' : 'flex-1'}
              onClick={() => setType('ingreso')}
            >
              Ingreso
            </Button>
            <Button
              type="button"
              variant={type === 'egreso' ? 'default' : 'outline'}
              className={type === 'egreso' ? 'flex-1 bg-expense text-primary-foreground hover:bg-expense/90' : 'flex-1'}
              onClick={() => setType('egreso')}
            >
              Egreso
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">Monto ($)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="category_id">Categoria</Label>
            <Select name="category_id" required>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoria" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No hay categorias para este tipo
                  </SelectItem>
                ) : (
                  filteredCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>


          <div className="flex flex-col gap-2">
            <Label>Cliente (opcional)</Label>

            <Select
              value={clientId ?? "none"}
               onValueChange={(v) => setClientId(v === "none" ? null : v)}
            >
             <SelectTrigger>
              <SelectValue placeholder="Seleccionar cliente" />
             </SelectTrigger>
   
             <SelectContent>
              <SelectItem value="none">Sin cliente</SelectItem>

              {clients.map((c) => (
               <SelectItem key={c.id} value={c.id}>
                {c.name}
               </SelectItem>
             ))}
           </SelectContent>
         </Select>
       </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Descripcion (opcional)</Label>
            <Input
              id="description"
              name="description"
              type="text"
              placeholder="Ej: Compra de harina"
            />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
             <div className="flex flex-col">
               <span className="text-sm font-medium">¿Tiene remito?</span>
               <span className="text-xs text-muted-foreground">
                Activá para cargar el número de remito
               </span>
             </div>

          <input
             type="checkbox"
             checked={hasRemito}
             onChange={(e) => setHasRemito(e.target.checked)}
           />
         </div>

          {hasRemito && (
             <div className="flex flex-col gap-2">
               <Label htmlFor="remito_number">Número de remito</Label>
               <Input
                 id="remito_number"
                 type="text"
                 placeholder="Ej: 0001-000123"
                 value={remitoNumber}
                 onChange={(e) => setRemitoNumber(e.target.value)}
               />
             </div>
            )}
                    

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="payment_method">Medio de pago</Label>
              <Select name="payment_method" defaultValue="efectivo">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="transferencia">Transferencia</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="tarjeta">Tarjeta</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Guardando...' : 'Guardar transaccion'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
