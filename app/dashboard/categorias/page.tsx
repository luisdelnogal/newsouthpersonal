import { createClient } from '@/lib/supabase/server'
import { CategoryForm } from '@/components/categorias/category-form'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'

export default async function CategoriasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('type')
    .order('name')

  const ingresos = (categories || []).filter((c) => c.type === 'ingreso')
  const egresos = (categories || []).filter((c) => c.type === 'egreso')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Categorias
          </h1>
          <p className="text-sm text-muted-foreground">
            Administra las categorias de ingresos y egresos
          </p>
        </div>
        {profile?.role !== 'lectura' && (
          <CategoryForm userId={user!.id} />
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ArrowUpIcon className="size-4 text-income" />
              Ingresos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ingresos.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No hay categorias de ingreso
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {ingresos.map((cat) => (
                  <Badge
                    key={cat.id}
                    variant={cat.is_active ? 'default' : 'secondary'}
                    className={cat.is_active ? 'bg-income/10 text-income hover:bg-income/20' : ''}
                  >
                    {cat.name}
                    {!cat.is_active && ' (inactiva)'}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ArrowDownIcon className="size-4 text-expense" />
              Egresos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {egresos.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No hay categorias de egreso
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {egresos.map((cat) => (
                  <Badge
                    key={cat.id}
                    variant={cat.is_active ? 'default' : 'secondary'}
                    className={cat.is_active ? 'bg-expense/10 text-expense hover:bg-expense/20' : ''}
                  >
                    {cat.name}
                    {!cat.is_active && ' (inactiva)'}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
