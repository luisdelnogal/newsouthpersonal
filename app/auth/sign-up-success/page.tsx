import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SignUpSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            NewSouth
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Revisa tu email</CardTitle>
            <CardDescription>
              Te enviamos un link de confirmacion para activar tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Hace click en el enlace que te enviamos para confirmar tu email.
              Una vez confirmado, podras iniciar sesion y empezar a usar el sistema.
            </p>
            <Button asChild variant="outline" className="w-full">
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
