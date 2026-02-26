'use client'

import { signup } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SignUpForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            CuentasClaras
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Crea tu cuenta para comenzar
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Registrarse</CardTitle>
            <CardDescription>
              El primer usuario registrado sera el administrador
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {decodeURIComponent(error)}
              </div>
            )}
            <form action={signup} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="full_name">Nombre completo</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="Juan Perez"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Contrasena</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Minimo 6 caracteres"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" className="w-full">
                Crear cuenta
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {'Ya tenes cuenta? '}
              <Link href="/auth/login" className="font-medium text-primary underline-offset-4 hover:underline">
                Inicia sesion
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Cargando...</p>
      </main>
    }>
      <SignUpForm />
    </Suspense>
  )
}
