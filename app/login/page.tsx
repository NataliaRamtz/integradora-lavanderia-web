"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { AuthApiError } from "@supabase/supabase-js"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { authService } from "@/src/modules/auth/application/auth.service"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)

    startTransition(async () => {
      try {
        await authService.signInWithPassword({ email, password })

        // Optional rememberMe logic (cookie handled by auth helpers)
        if (rememberMe) {
          localStorage.setItem("laundrypro:remember-email", email)
        } else {
          localStorage.removeItem("laundrypro:remember-email")
        }

        const roleRecord = await authService.getCurrentRole()
        if (roleRecord?.rol === "superadmin") {
          router.replace("/dashboard")
          return
        }
        if (roleRecord?.rol === "encargado") {
          router.replace("/lavanderia/dashboard")
          return
        }
        router.replace("/dashboard")
      } catch (error) {
        let message = "No fue posible iniciar sesión. Verifica tus datos." 
        if (error instanceof AuthApiError) {
          message = error.message === "Invalid login credentials" ? "Credenciales incorrectas." : error.message
        } else if (error instanceof Error) {
          message = error.message
        }
        setErrorMessage(message)
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Link
        href="/"
        className="absolute top-4 left-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al inicio
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">LaundryPro</CardTitle>
          <CardDescription>Ingresa a tu cuenta para continuar</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  Recordarme
                </Label>
              </div>
              <Link href="/recuperar-contrasena" className="text-sm text-blue-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              ¿No tienes una cuenta?{" "}
              <Link href="/registro" className="text-blue-600 hover:underline font-medium">
                Regístrate aquí
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
