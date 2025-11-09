"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { authService } from "@/src/modules/auth/application/auth.service"

type FormState = {
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
  laundryName: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormState>({
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    laundryName: "",
  })

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden")
      return
    }
    if (!formData.acceptTerms) {
      setErrorMessage("Debes aceptar los términos y condiciones")
      return
    }

    startTransition(async () => {
      try {
        await authService.signUpWithPassword({
          email: formData.email,
          password: formData.password,
          laundryName: formData.laundryName,
        })

        router.replace("/login?signup=success")
      } catch (error) {
        console.error("Signup error", error)
        const message =
          error instanceof Error ? error.message : "No fue posible completar el registro. Intenta más tarde."
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

      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Crear Cuenta en LaundryPro</CardTitle>
          <CardDescription>Completa el formulario para solicitar acceso.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="laundryName">Nombre de la Lavandería</Label>
                <Input
                  id="laundryName"
                  placeholder="Clean & Fresh"
                  value={formData.laundryName}
                  onChange={(event) => updateField("laundryName", event.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(event) => updateField("confirmPassword", event.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => updateField("acceptTerms", Boolean(checked))}
              />
              <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
                Acepto los{" "}
                <Link href="/terminos" className="text-blue-600 hover:underline">
                  términos y condiciones
                </Link>
                {" "}y la{" "}
                <Link href="/privacidad" className="text-blue-600 hover:underline">
                  política de privacidad
                </Link>
              </Label>
            </div>
            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
            <p className="text-xs text-muted-foreground">
              Un administrador completará la asignación de rol y permisos una vez revisada la solicitud.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Procesando..." : "Crear Cuenta"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Inicia sesión aquí
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
