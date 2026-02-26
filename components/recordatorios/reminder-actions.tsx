'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { CheckIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ReminderActionsProps {
  reminderId: string
}

export function ReminderActions({ reminderId }: ReminderActionsProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function markAsPaid() {
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('payment_reminders')
      .update({ status: 'pagado' })
      .eq('id', reminderId)

    setLoading(false)

    if (error) {
      toast.error('Error: ' + error.message)
      return
    }

    toast.success('Marcado como pagado')
    router.refresh()
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full"
      onClick={markAsPaid}
      disabled={loading}
    >
      <CheckIcon className="mr-2 size-3.5" />
      {loading ? 'Guardando...' : 'Marcar como pagado'}
    </Button>
  )
}
