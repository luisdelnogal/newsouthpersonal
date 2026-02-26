import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UsersIcon, ShieldIcon, UserIcon, EyeIcon } from 'lucide-react'

export default async function UsuariosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at')

  const roleConfig = {
    admin: { label: 'Administrador', icon: ShieldIcon, className: 'bg-primary/10 text-primary' },
    operador: { label: 'Operador', icon: UserIcon, className: 'bg-income/10 text-income' },
    lectura: { label: 'Solo lectura', icon: EyeIcon, className: 'bg-muted text-muted-foreground' },
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Usuarios
        </h1>
        <p className="text-sm text-muted-foreground">
          {currentProfile?.role === 'admin'
            ? 'Gestiona los usuarios del sistema'
            : 'Lista de usuarios del sistema'}
        </p>
      </div>

      {(!profiles || profiles.length === 0) ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <UsersIcon className="mb-3 size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No hay usuarios registrados
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {profiles.map((p) => {
            const config = roleConfig[p.role as keyof typeof roleConfig] || roleConfig.lectura
            const RoleIcon = config.icon
            const isCurrentUser = p.id === user!.id

            return (
              <Card key={p.id} className={isCurrentUser ? 'border-primary/30' : ''}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold">
                    {p.full_name || 'Sin nombre'}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs font-normal text-muted-foreground">(vos)</span>
                    )}
                  </CardTitle>
                  <Badge variant="secondary" className={config.className}>
                    <RoleIcon className="mr-1 size-3" />
                    {config.label}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Miembro desde {new Intl.DateTimeFormat('es-AR', { 
                      day: '2-digit', 
                      month: 'long', 
                      year: 'numeric' 
                    }).format(new Date(p.created_at))}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
