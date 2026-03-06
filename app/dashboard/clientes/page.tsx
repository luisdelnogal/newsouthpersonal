import { createClient } from "@/lib/supabase/server"
import { ClientForm } from "@/components/clients/client-form"
import { ClientsTable } from "@/components/clients/clients-table"

export default async function ClientesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single()

  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, cuit, email, phone, address, notes, is_active, created_at")
    .order("name")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Clientes
          </h1>
          <p className="text-sm text-muted-foreground">
            Administrá tus clientes para asociarlos a ingresos/egresos
          </p>
        </div>

        {profile?.role !== "lectura" && (
          <ClientForm userId={user!.id} />
        )}
      </div>

      <ClientsTable
        clients={(clients || []) as any[]}
        userRole={profile?.role || "lectura"}
      />
    </div>
  )
}