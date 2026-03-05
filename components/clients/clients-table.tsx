"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type ClientRow = {
  id: string
  name: string
  cuit: string | null
  email: string | null
  phone: string | null
  address: string | null
  notes: string | null
  is_active: boolean
}

export function ClientsTable({ clients, userRole }: { clients: ClientRow[]; userRole: string }) {
  const router = useRouter()

  const handleDeactivate = async (id: string) => {
    if (!confirm("¿Desactivar este cliente?")) return

    const supabase = createClient()
    const { error } = await supabase.from("clients").update({ is_active: false }).eq("id", id)

    if (error) {
      toast.error("Error: " + error.message)
      return
    }

    toast.success("Cliente desactivado")
    router.refresh()
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>CUIT</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {clients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No hay clientes
              </TableCell>
            </TableRow>
          ) : (
            clients.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.cuit || "-"}</TableCell>
                <TableCell>{c.email || "-"}</TableCell>
                <TableCell>{c.phone || "-"}</TableCell>
                <TableCell>{c.is_active ? "Activo" : "Inactivo"}</TableCell>
                <TableCell className="text-right">
                  {userRole !== "lectura" && c.is_active && (
                    <Button variant="destructive" size="sm" onClick={() => handleDeactivate(c.id)}>
                      Desactivar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}