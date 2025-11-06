import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, Users, Shield, Zap, BarChart3, CheckCircle2, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">LaundryPro</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Características
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Planes
            </Link>
            <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Nosotros
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/registro">Comenzar Gratis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Plataforma de Gestión Inteligente</Badge>
        <h1 className="mb-6 text-balance text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
          Gestiona tu lavandería
          <br />
          <span className="text-primary">de forma profesional</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
          LaundryPro es la solución completa para administrar pedidos, clientes, servicios y reportes de tu negocio de
          lavandería en un solo lugar.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild className="min-w-[200px]">
            <Link href="/registro">
              Comenzar Ahora
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="min-w-[200px] bg-transparent">
            <Link href="/login">Ver Demo</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-3">
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">1,250+</div>
            <div className="text-sm text-muted-foreground">Usuarios Activos</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">58</div>
            <div className="text-sm text-muted-foreground">Lavanderías Registradas</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">99.9%</div>
            <div className="text-sm text-muted-foreground">Tiempo de Actividad</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Características Principales</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Todo lo que necesitas para llevar tu lavandería al siguiente nivel
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Gestión de Pedidos</h3>
              <p className="text-muted-foreground">
                Administra todos tus pedidos en tiempo real con estados personalizables y seguimiento completo.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Base de Clientes</h3>
              <p className="text-muted-foreground">
                Mantén un registro detallado de tus clientes con historial de pedidos y preferencias.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Reportes Avanzados</h3>
              <p className="text-muted-foreground">
                Analiza el rendimiento de tu negocio con reportes detallados y gráficos interactivos.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                <Zap className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Automatización</h3>
              <p className="text-muted-foreground">
                Automatiza tareas repetitivas y notificaciones para ahorrar tiempo y mejorar la eficiencia.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Seguridad</h3>
              <p className="text-muted-foreground">
                Protección de datos de nivel empresarial con encriptación y copias de seguridad automáticas.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                <CheckCircle2 className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Fácil de Usar</h3>
              <p className="text-muted-foreground">
                Interfaz intuitiva y moderna que no requiere capacitación técnica para comenzar.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Planes Flexibles</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Elige el plan que mejor se adapte a las necesidades de tu negocio
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {/* Freemium */}
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4">
                <h3 className="text-2xl font-bold">Freemium</h3>
                <p className="text-sm text-muted-foreground">Para comenzar</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/mes</span>
              </div>
              <ul className="mb-6 space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                  <span className="text-sm">Hasta 50 órdenes/mes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                  <span className="text-sm">1 lavandería</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                  <span className="text-sm">Reportes básicos</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/registro">Comenzar Gratis</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card className="border-2 border-primary shadow-lg">
            <CardContent className="pt-6">
              <Badge className="mb-4">POPULAR</Badge>
              <div className="mb-4">
                <h3 className="text-2xl font-bold">Suscripción</h3>
                <p className="text-sm text-muted-foreground">Para crecer</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-muted-foreground">/mes</span>
              </div>
              <ul className="mb-6 space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                  <span className="text-sm">Órdenes ilimitadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                  <span className="text-sm">Hasta 30 lavanderías</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                  <span className="text-sm">Reportes avanzados</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                  <span className="text-sm">Soporte prioritario</span>
                </li>
              </ul>
              <Button className="w-full" asChild>
                <Link href="/registro">Comenzar Ahora</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Commission */}
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4">
                <h3 className="text-2xl font-bold">Comisión</h3>
                <p className="text-sm text-muted-foreground">Paga por uso</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">5%</span>
                <span className="text-muted-foreground">/transacción</span>
              </div>
              <ul className="mb-6 space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                  <span className="text-sm">Sin límite de órdenes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                  <span className="text-sm">Lavanderías ilimitadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                  <span className="text-sm">Todas las funciones</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/registro">Contactar Ventas</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="py-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">¿Listo para comenzar?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Únete a cientos de lavanderías que ya confían en LaundryPro para gestionar su negocio
            </p>
            <Button size="lg" asChild>
              <Link href="/registro">
                Crear Cuenta Gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">LaundryPro</span>
              </div>
              <p className="text-sm text-muted-foreground">
                La plataforma completa para gestionar tu lavandería de forma profesional.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Producto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground">
                    Características
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground">
                    Precios
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-foreground">
                    Demo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#about" className="hover:text-foreground">
                    Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Términos
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            © 2025 LaundryPro. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
