import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Sparkles, ArrowRight, BarChart3, Users, TrendingUp, Zap, Shield, CheckCircle2 } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import type { Database } from '@/lib/supabase/database.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    const { data } = await supabase
      .from('roles_app')
      .select('rol, lavanderia_id')
      .eq('usuario_id', session.user.id)
      .eq('activo', true)
      .limit(10);

    type RoleRow = Pick<Database['public']['Tables']['roles_app']['Row'], 'rol' | 'lavanderia_id'>;
    const roles = (data ?? []) as RoleRow[];

    const isSuperAdmin = roles.some((role) => role.rol === 'superadmin');
    redirect(isSuperAdmin ? '/admin' : '/staff');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <Header />
      <Hero />
      <Features />
      <Pricing />
      <Cta />
      <Footer />
    </div>
  );
}

const Header = () => (
  <header className="border-b border-slate-800 bg-slate-950/85 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
    <div className="container mx-auto flex h-16 items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500 shadow-lg shadow-sky-500/40">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">LaundryPro</span>
      </div>
      <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
        <Link href="#features" className="text-slate-400 transition hover:text-slate-100">
          Características
        </Link>
        <Link href="#pricing" className="text-slate-400 transition hover:text-slate-100">
          Planes
        </Link>
        <Link href="#about" className="text-slate-400 transition hover:text-slate-100">
          Nosotros
        </Link>
      </nav>
      <div className="flex items-center gap-3">
        <Button variant="ghost" asChild>
          <Link href="/login">Iniciar sesión</Link>
        </Button>
        <Button asChild>
          <Link href="/register">Comenzar gratis</Link>
        </Button>
      </div>
    </div>
  </header>
);

const Hero = () => (
  <section className="container mx-auto px-4 py-20 text-center">
    <Badge className="mb-4 border border-sky-500/50 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20">
      Plataforma de gestión inteligente
    </Badge>
    <h1 className="mb-6 text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
      Gestiona tu lavandería
      <br />
      <span className="text-sky-400">con precisión y pasión</span>
    </h1>
    <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-300 sm:text-xl">
      LaundryPro centraliza pedidos, clientes, servicios y reportes para que tu negocio crezca con datos confiables y
      una experiencia moderna para tu equipo y tus clientes.
    </p>
    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
      <Button size="lg" asChild className="w-full min-w-[200px] sm:w-auto">
        <Link href="/register">
          Comenzar ahora
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
      <Button
        size="lg"
        variant="outline"
        asChild
        className="w-full min-w-[200px] border-sky-500/50 bg-transparent text-slate-100 sm:w-auto"
      >
        <Link href="/login">Ver demo</Link>
      </Button>
    </div>
    <div className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-3">
      <Stat value="1,250+" label="Usuarios activos gestionando operaciones diarias" />
      <Stat value="58" label="Lavanderías registradas y creciendo cada mes" />
      <Stat value="99.9%" label="Disponibilidad garantizada en nuestra infraestructura" />
    </div>
  </section>
);

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="space-y-2">
    <div className="text-4xl font-bold text-sky-400">{value}</div>
    <div className="text-sm text-slate-400">{label}</div>
  </div>
);

const Features = () => (
  <section id="features" className="container mx-auto px-4 py-20">
    <div className="mb-12 text-center">
      <h2 className="mb-4 text-3xl font-bold md:text-4xl">Características principales</h2>
      <p className="mx-auto max-w-2xl text-slate-300">
        Diseñadas para el ritmo del día a día de tu equipo y con visión de expansión.
      </p>
    </div>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {FEATURES.map((feature) => (
        <Card
          key={feature.title}
          className="border border-slate-800 bg-slate-950/60 transition-all hover:border-sky-500/60 hover:shadow-lg hover:shadow-sky-500/10"
        >
          <CardContent className="pt-6">
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${feature.bg}`}>
              <feature.icon className={`h-6 w-6 ${feature.color}`} />
            </div>
            <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
            <p className="text-slate-400">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
);

const Pricing = () => (
  <section id="pricing" className="container mx-auto px-4 py-20">
    <div className="mb-12 text-center">
      <h2 className="mb-4 text-3xl font-bold md:text-4xl">Planes flexibles</h2>
      <p className="mx-auto max-w-2xl text-slate-300">
        Escala a tu ritmo: paga solo por lo que tu operación necesita.
      </p>
    </div>
    <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
      {PRICING.map((plan) => (
        <Card
          key={plan.title}
          className={`border ${
            plan.highlight ? 'border-sky-500 shadow-2xl shadow-sky-500/20' : 'border-slate-800'
          } bg-slate-950/70`}
        >
          <CardContent className="pt-6">
            {plan.highlight && (
              <Badge className="mb-4 border border-sky-500/50 bg-sky-500/10 text-sky-300">Popular</Badge>
            )}
            <div className="mb-4">
              <h3 className="text-2xl font-bold">{plan.title}</h3>
              <p className="text-sm text-slate-400">{plan.subtitle}</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-slate-400">{plan.period}</span>
            </div>
            <ul className="mb-6 space-y-3 text-left">
              {plan.features.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-sky-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full" variant={plan.highlight ? 'default' : 'outline'} asChild>
              <Link href={plan.ctaHref}>{plan.ctaLabel}</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
);

const Cta = () => (
  <section className="container mx-auto px-4 py-20">
    <Card className="border border-sky-500/60 bg-gradient-to-br from-sky-500/10 via-sky-500/5 to-sky-500/20">
      <CardContent className="py-12 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">Impulsa tu lavandería con LaundryPro</h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-200">
          Te acompañamos desde el primer pedido hasta la expansión regional. Construimos esta plataforma porque creemos
          en el potencial de tu negocio.
        </p>
        <Button size="lg" asChild>
          <Link href="/register">
            Crear cuenta gratis
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  </section>
);

const Footer = () => (
  <footer id="about" className="border-t border-slate-800 bg-slate-950/90">
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">LaundryPro</span>
          </div>
          <p className="text-sm text-slate-400">
            Creamos herramientas enfocadas en resolver los retos reales de las lavanderías modernas.
          </p>
        </div>
        <FooterColumn
          title="Producto"
          links={[
            { label: 'Características', href: '#features' },
            { label: 'Precios', href: '#pricing' },
            { label: 'Demo', href: '/login' },
          ]}
        />
        <FooterColumn
          title="Compañía"
          links={[
            { label: 'Nosotros', href: '#about' },
            { label: 'Blog', href: '#' },
            { label: 'Contacto', href: '#' },
          ]}
        />
        <FooterColumn
          title="Legal"
          links={[
            { label: 'Privacidad', href: '#' },
            { label: 'Términos', href: '#' },
          ]}
        />
      </div>
      <div className="mt-10 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} LaundryPro. Todos los derechos reservados.
      </div>
    </div>
  </footer>
);

type FooterColumnProps = {
  title: string;
  links: { label: string; href: string }[];
};

const FooterColumn = ({ title, links }: FooterColumnProps) => (
  <div>
    <h4 className="mb-4 font-semibold text-slate-100">{title}</h4>
    <ul className="space-y-2 text-sm text-slate-400">
      {links.map((link) => (
        <li key={link.label}>
          <Link href={link.href} className="transition hover:text-slate-100">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const FEATURES = [
  {
    title: 'Gestión de pedidos',
    description: 'Centraliza pedidos con estados inteligentes, tiempos estimados y actualizaciones en tiempo real.',
    icon: BarChart3,
    bg: 'bg-blue-500/10 border border-blue-500/30',
    color: 'text-blue-300',
  },
  {
    title: 'Base de clientes',
    description: 'Historial detallado, preferencias y análisis para ofrecer experiencias personalizadas.',
    icon: Users,
    bg: 'bg-emerald-500/10 border border-emerald-500/30',
    color: 'text-emerald-300',
  },
  {
    title: 'Reportes avanzados',
    description: 'Visualiza KPIs, ingresos, productividad y proyecciones con dashboards intuitivos.',
    icon: TrendingUp,
    bg: 'bg-purple-500/10 border border-purple-500/30',
    color: 'text-purple-300',
  },
  {
    title: 'Automatización',
    description: 'Notificaciones, recordatorios y tareas recurrentes automatizadas para ahorrar tiempo.',
    icon: Zap,
    bg: 'bg-yellow-500/10 border border-yellow-500/30',
    color: 'text-yellow-300',
  },
  {
    title: 'Seguridad robusta',
    description: 'Respaldo cifrado, control de acceso por roles y auditoría completa de acciones.',
    icon: Shield,
    bg: 'bg-red-500/10 border border-red-500/30',
    color: 'text-red-300',
  },
  {
    title: 'Experiencia fluida',
    description: 'UI moderna, responsiva y pensada para equipos que requieren productividad desde el día uno.',
    icon: CheckCircle2,
    bg: 'bg-indigo-500/10 border border-indigo-500/30',
    color: 'text-indigo-300',
  },
] as const;

const PRICING = [
  {
    title: 'Freemium',
    subtitle: 'Perfecto para comenzar',
    price: '$0',
    period: '/mes',
    features: ['Hasta 50 órdenes/mes', '1 lavandería', 'Reportes básicos'],
    ctaLabel: 'Comenzar gratis',
    ctaHref: '/register',
    highlight: false,
  },
  {
    title: 'Suscripción',
    subtitle: 'Escala con tu equipo',
    price: '$49',
    period: '/mes',
    features: ['Órdenes ilimitadas', 'Hasta 30 lavanderías', 'Reportes avanzados', 'Soporte prioritario'],
    ctaLabel: 'Comenzar ahora',
    ctaHref: '/register',
    highlight: true,
  },
  {
    title: 'Comisión',
    subtitle: 'Modelo flexible',
    price: '5%',
    period: '/transacción',
    features: ['Sin límite de órdenes', 'Lavanderías ilimitadas', 'Todas las funciones avanzadas'],
    ctaLabel: 'Contactar ventas',
    ctaHref: '/register',
    highlight: false,
  },
] as const;
