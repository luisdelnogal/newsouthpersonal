import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Error de autenticacion</CardTitle>
            <CardDescription>
              Ocurrio un problema al intentar autenticarte
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Puede que el enlace haya expirado o que haya un problema con tu cuenta.
              Intenta iniciar sesion nuevamente.
            </p>
            <Button asChild className="w-full">
              <Link href="/auth/login">
                Volver al inicio de sesion
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
