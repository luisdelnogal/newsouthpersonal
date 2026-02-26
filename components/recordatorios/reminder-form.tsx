'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { PlusIcon } from 'lucide-react'

interface ReminderFormProps {
  userId: string
  categories: Array<{ id: string; name: string; type: string }>
}

export function ReminderForm({ userId, categories }: ReminderFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isRecurring, setIsRecurring] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const { error } = await supabase.from('payment_reminders').insert({
      title: formData.get('title') as string,
      description: formData.get('description') as string || null,
      amount: formData.get('amount') ? Number(formData.get('amount')) : null,
      due_date: formData.get('due_date') as string,
      is_recurring: isRecurring,
      recurrence_interval: isRecurring ? (formData.get('recurrence_interval') as string) : null,
      category_id: formData.get('category_id') as string || null,
      created_by: userId,
    })

    setLoading(false)

    if (error) {
      toast.error('Error al crear: ' + error.message)
      return
    }

    toast.success('Recordatorio creado')
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 size-4" />
          Nuevo recordatorio
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear recordatorio de pago</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Titulo</Label>
            <Input
              id="title"
              name="title"
              placeholder="Ej: Pago a proveedor X"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="amount">Monto ($)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="Opcional"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="due_date">Fecha de vencimiento</Label>
              <Input
                id="due_date"
                name="due_date"
                type="date"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Descripcion (opcional)</Label>
            <Input
              id="description"
              name="description"
              placeholder="Detalles del pago"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="category_id">Categoria (opcional)</Label>
            <Select name="category_id">
              <SelectTrigger>
                <SelectValue placeholder="Sin categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="is_recurring"
              checked={isRecurring}
              onCheckedChange={setIsRecurring}
            />
            <Label htmlFor="is_recurring">Es recurrente</Label>
          </div>

          {isRecurring && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="recurrence_interval">Frecuencia</Label>
              <Select name="recurrence_interval" required={isRecurring}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="quincenal">Quincenal</SelectItem>
                  <SelectItem value="mensual">Mensual</SelectItem>
                  <SelectItem value="bimestral">Bimestral</SelectItem>
                  <SelectItem value="trimestral">Trimestral</SelectItem>
                  <SelectItem value="anual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creando...' : 'Crear recordatorio'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
