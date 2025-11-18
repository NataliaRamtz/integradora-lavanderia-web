import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, BarChart3, Users, TrendingUp, Zap, Shield, CheckCircle2 } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0E1624] text-[#F2F5FA]">
      <Header />
      <Hero />
      <Features />
      <Pricing />
      <Cta />
      <Footer />
    </div>
  );
}
//
const LaundryLogo = ({ size = 48 }: { size?: number }) => (
  <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="70" fill="#DFF3FF" stroke="#1C4E80" strokeWidth="4"/>
    <line x1="40" y1="70" x2="160" y2="70" stroke="#1C4E80" strokeWidth="4" strokeLinecap="round"/>
    <rect x="88" y="60" width="8" height="18" fill="#FCE5A7" stroke="#1C4E80" strokeWidth="3"/>
    <rect x="104" y="60" width="8" height="18" fill="#FCE5A7" stroke="#1C4E80" strokeWidth="3"/>
    <path d="M80 80 L120 80 L135 95 L135 140 L65 140 L65 95 Z"
          fill="#FFFFFF"
          stroke="#1C4E80"
          strokeWidth="4"
          strokeLinejoin="round"/>
    <path d="M40 115 C30 110 28 95 42 90 C55 95 55 112 40 115 Z"
          fill="#DFF3FF"
          stroke="#1C4E80"
          strokeWidth="4"
          strokeLinejoin="round"/>
    <path d="M160 115 C175 112 175 95 158 90 C145 95 147 110 160 115 Z"
          fill="#DFF3FF"
          stroke="#1C4E80"
          strokeWidth="4"
          strokeLinejoin="round"/>
  </svg>
);

const Header = () => (
  <header className="sticky top-0 z-50 border-b border-[#25354B]/50 bg-[#1B2A40]/95 backdrop-blur-xl backdrop-saturate-150">
    <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="relative flex h-12 w-12 items-center justify-center">
        <LaundryLogo size={48} />
        </div>
        <span className="text-xl font-bold tracking-tight text-[#F2F5FA]">LaundryPro</span>
      </div>
      <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
        <Link href="#features" className="text-[#BFC7D3] transition-all duration-200 hover:text-[#4C89D9] hover:scale-105">
          Características
        </Link>
        <Link href="#pricing" className="text-[#BFC7D3] transition-all duration-200 hover:text-[#4C89D9] hover:scale-105">
          Planes
        </Link>
        <Link href="/informacion#nosotros" className="text-[#BFC7D3] transition-all duration-200 hover:text-[#4C89D9] hover:scale-105">
          Nosotros
        </Link>
      </nav>
      <div className="flex items-center gap-3">
        <Button variant="ghost" asChild className="text-[#BFC7D3] hover:text-[#F2F5FA] hover:bg-[#25354B]/50">
          <Link href="/login">Iniciar sesión</Link>
        </Button>
        <Button asChild className="bg-gradient-to-r from-[#4C89D9] to-[#60C2D8] text-white shadow-lg shadow-[#4C89D9]/30 hover:shadow-xl hover:shadow-[#4C89D9]/40 hover:scale-105 transition-all duration-200">
          <Link href="/register">Comenzar gratis</Link>
        </Button>
      </div>
    </div>
  </header>
);

const Hero = () => (
  <section className="relative overflow-hidden px-4 py-24 sm:py-32">
    <div className="absolute inset-0 bg-gradient-to-br from-[#1B2A40]/50 via-transparent to-[#0E1624]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(76,137,217,0.1),transparent_50%)]" />
    <div className="container relative mx-auto text-center">
      <h1 className="mb-8 text-balance text-5xl font-extrabold leading-[1.1] tracking-tight text-[#F2F5FA] sm:text-6xl md:text-7xl lg:text-8xl">
        Gestiona tu lavandería
        <br />
        <span className="bg-gradient-to-r from-[#4C89D9] via-[#60C2D8] to-[#4C89D9] bg-clip-text text-transparent">
          con precisión
        </span>
      </h1>
      <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-[#BFC7D3] sm:text-2xl">
        LaundryPro gestiona pedidos, clientes, servicios y reportes para que tu negocio crezca con datos confiables y
        una experiencia moderna para tu equipo y tus clientes.
      </p>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button size="lg" asChild className="group h-14 w-full min-w-[220px] bg-gradient-to-r from-[#4C89D9] to-[#60C2D8] px-8 text-base font-semibold text-white shadow-2xl shadow-[#4C89D9]/40 transition-all duration-300 hover:scale-105 hover:shadow-[#4C89D9]/60 sm:w-auto">
          <Link href="/register" className="flex items-center">
            Comenzar ahora
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild className="h-14 w-full min-w-[220px] border-2 border-[#25354B] bg-[#1B2A40]/50 px-8 text-base font-semibold text-[#F2F5FA] backdrop-blur-sm transition-all duration-300 hover:border-[#4C89D9]/50 hover:bg-[#25354B]/50 hover:scale-105 sm:w-auto">
          <Link href="/informacion">Conocer LaundryPro</Link>
        </Button>
      </div>
      <div className="mx-auto mt-24 grid max-w-5xl gap-8 md:grid-cols-3">
        <Stat value="500+" label="Usuarios activos gestionando operaciones diarias" />
        <Stat value="50+" label="Lavanderías registradas y creciendo cada mes" />
        <Stat value="99.9%" label="Disponibilidad garantizada en nuestra infraestructura" />
      </div>
    </div>
  </section>
);

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="group relative space-y-4 rounded-3xl border-2 border-[#25354B]/60 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 p-10 backdrop-blur-md transition-all duration-500 hover:border-[#4C89D9] hover:bg-gradient-to-br hover:from-[#1B2A40] hover:via-[#25354B]/70 hover:to-[#1B2A40] hover:shadow-[0_0_40px_rgba(76,137,217,0.4)] hover:-translate-y-2 hover:scale-[1.02]">
    {/* Animated gradient overlay */}
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#4C89D9]/10 via-[#60C2D8]/5 to-[#4C89D9]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    {/* Glow effect */}
    <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-[#4C89D9]/20 via-[#60C2D8]/20 to-[#4C89D9]/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
    {/* Shine effect */}
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 -skew-x-12 translate-x-[-200%] transition-all duration-1000 group-hover:opacity-100 group-hover:translate-x-[200%]" />
    
    <div className="relative">
      {/* Number with enhanced styling */}
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-gradient-to-r from-[#4C89D9] to-[#60C2D8] blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
        <div className="relative text-6xl sm:text-7xl font-black bg-gradient-to-r from-[#4C89D9] via-[#60C2D8] to-[#4C89D9] bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_ease-in-out_infinite]">
          {value}
        </div>
      </div>
      {/* Decorative dots */}
      <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-gradient-to-r from-[#4C89D9] to-[#60C2D8] opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500" />
      <div className="absolute -bottom-2 -left-2 w-2 h-2 rounded-full bg-gradient-to-r from-[#60C2D8] to-[#4C89D9] opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500" />
    </div>
    
    <div className="relative text-sm leading-relaxed text-[#BFC7D3] group-hover:text-[#F2F5FA] transition-colors duration-500 font-medium">
      {label}
    </div>
    
    {/* Corner accent */}
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#4C89D9]/20 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
  </div>
);

const Features = () => (
  <section id="features" className="relative px-4 py-12 sm:py-16">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1B2A40]/20 to-transparent" />
    <div className="container relative mx-auto">
      <div className="mb-10 text-center">
        <h2 className="mb-4 text-4xl font-extrabold text-[#F2F5FA] sm:text-5xl md:text-6xl">
          Características principales
        </h2>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#BFC7D3] sm:text-xl">
          Diseñadas para el ritmo del día a día de tu equipo y con visión de expansión.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <Card
            key={feature.title}
            className="group relative overflow-hidden border border-[#25354B]/50 bg-[#1B2A40]/40 backdrop-blur-sm transition-all duration-300 hover:border-[#4C89D9]/50 hover:bg-[#1B2A40]/60 hover:shadow-2xl hover:shadow-[#4C89D9]/10 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CardContent className="relative p-8 flex flex-col items-center text-center">
              <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${feature.bg} shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl`}>
                <feature.icon className={`h-8 w-8 ${feature.color}`} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#F2F5FA]">{feature.title}</h3>
              <p className="leading-relaxed text-[#BFC7D3]">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

const Pricing = () => (
  <section id="pricing" className="relative px-4 py-12 sm:py-16">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1B2A40]/10 to-transparent" />
    <div className="container relative mx-auto">
      <div className="mb-16 text-center">
        <h2 className="mb-5 text-4xl font-extrabold text-[#F2F5FA] sm:text-5xl md:text-6xl">
          Planes flexibles
        </h2>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#BFC7D3] sm:text-xl">
          Escala a tu ritmo: paga solo por lo que tu operación necesita.
        </p>
      </div>
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        {PRICING.map((plan) => (
          <Card
            key={plan.title}
            className={`group relative overflow-hidden border-2 transition-all duration-300 hover:-translate-y-2 ${
              plan.highlight
                ? 'border-[#4C89D9]/60 bg-gradient-to-br from-[#1B2A40] to-[#25354B] shadow-2xl shadow-[#4C89D9]/20'
                : 'border-[#25354B]/50 bg-[#1B2A40]/40 hover:border-[#4C89D9]/40 hover:shadow-xl hover:shadow-[#4C89D9]/10'
            } backdrop-blur-sm`}
          >
            {plan.highlight && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4C89D9] via-[#60C2D8] to-[#4C89D9]" />
            )}
            <CardContent className="p-8">
              {plan.highlight && (
                <Badge className="mb-6 border border-[#4C89D9]/50 bg-[#4C89D9]/10 px-3 py-1 text-xs font-semibold text-[#60C2D8]">
                  Popular
                </Badge>
              )}
              <div className="mb-6">
                <h3 className="mb-2 text-2xl font-bold text-[#F2F5FA]">{plan.title}</h3>
                <p className="text-sm text-[#8FA1B7]">{plan.subtitle}</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-extrabold bg-gradient-to-r from-[#4C89D9] to-[#60C2D8] bg-clip-text text-transparent">{plan.price}</span>
                <span className="ml-2 text-lg text-[#BFC7D3]">{plan.period}</span>
              </div>
              <ul className="mb-8 space-y-4 text-left">
                {plan.features.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-[#BFC7D3]">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#6DF2A4]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full font-semibold transition-all duration-300 hover:scale-105 ${
                  plan.highlight
                    ? 'bg-gradient-to-r from-[#4C89D9] to-[#60C2D8] text-white shadow-lg shadow-[#4C89D9]/30 hover:shadow-xl hover:shadow-[#4C89D9]/40'
                    : 'border-2 border-[#25354B] bg-[#1B2A40]/50 text-[#F2F5FA] hover:border-[#4C89D9]/50 hover:bg-[#25354B]/50'
                }`}
                variant={plan.highlight ? 'default' : 'outline'}
                asChild
              >
                <Link href={plan.ctaHref}>{plan.ctaLabel}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

const Cta = () => (
  <section className="relative px-4 py-12 sm:py-16">
    <div className="absolute inset-0 bg-gradient-to-br from-[#1B2A40]/50 via-[#0E1624] to-[#1B2A40]/50" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(76,137,217,0.15),transparent_50%)]" />
    <div className="container relative mx-auto">
      <Card className="relative overflow-hidden border-2 border-[#4C89D9]/30 bg-gradient-to-br from-[#1B2A40] via-[#25354B]/50 to-[#1B2A40] shadow-2xl shadow-[#4C89D9]/20 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4C89D9]/10 via-transparent to-[#60C2D8]/10" />
        <CardContent className="relative py-16 text-center sm:py-20">
          <h2 className="mb-6 text-4xl font-extrabold text-[#F2F5FA] sm:text-5xl md:text-6xl">
            Impulsa tu lavandería con{' '}
            <span className="bg-gradient-to-r from-[#4C89D9] via-[#60C2D8] to-[#4C89D9] bg-clip-text text-transparent">
              LaundryPro
            </span>
          </h2>
          <p className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-[#BFC7D3] sm:text-xl">
            Te acompañamos desde el primer pedido hasta la expansión regional. Construimos esta plataforma porque creemos
            en el potencial de tu negocio.
          </p>
          <Button size="lg" asChild className="group h-14 bg-gradient-to-r from-[#6DF2A4] via-[#60C2D8] to-[#4C89D9] px-8 text-base font-semibold text-[#0E1624] shadow-2xl shadow-[#6DF2A4]/40 transition-all duration-300 hover:scale-105 hover:shadow-[#6DF2A4]/50">
            <Link href="/register" className="flex items-center justify-center">
              Crear cuenta gratis
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  </section>
);

const Footer = () => (
  <footer id="about" className="border-t border-[#25354B]/50 bg-[#1B2A40]/80 backdrop-blur-xl">
    <div className="container mx-auto px-6 py-16 lg:px-8">
      <div className="grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="mb-6 flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <LaundryLogo size={40} />
            </div>
            <span className="text-xl font-bold text-[#F2F5FA]">Amir</span>
          </div>
          <p className="text-sm leading-relaxed text-[#8FA1B7]">
            Creamos herramientas enfocadas en resolver los retos reales de las lavanderías modernas.
          </p>
        </div>
        <FooterColumn
          title="Producto"
          links={[
            { label: 'Características', href: '#features' },
            { label: 'Precios', href: '#pricing' },
            { label: 'Información', href: '/informacion' },
          ]}
        />
        <FooterColumn
          title="Compañía"
          links={[
            { label: 'Nosotros', href: '/informacion#nosotros' },
            { label: 'Contacto', href: '/informacion#contacto' },
          ]}
        />
        <FooterColumn
          title="Legal"
          links={[
            { label: 'Privacidad', href: '/informacion#privacidad' },
            { label: 'Términos', href: '/informacion#terminos' },
          ]}
        />
      </div>
      <div className="mt-12 border-t border-[#25354B]/50 pt-8 text-center text-sm text-[#8FA1B7]">
        © {new Date().getFullYear()} Amir. Todos los derechos reservados.
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
    <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-[#F2F5FA]">{title}</h4>
    <ul className="space-y-3 text-sm">
      {links.map((link) => (
        <li key={link.label}>
          <Link href={link.href} className="text-[#8FA1B7] transition-colors duration-200 hover:text-[#4C89D9]">
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
    bg: 'bg-[#4C89D9]/20 border border-[#4C89D9]/30',
    color: 'text-[#4C89D9]',
  },
  {
    title: 'Base de clientes',
    description: 'Historial detallado, preferencias y análisis para ofrecer experiencias personalizadas.',
    icon: Users,
    bg: 'bg-[#6DF2A4]/20 border border-[#6DF2A4]/30',
    color: 'text-[#6DF2A4]',
  },
  {
    title: 'Reportes avanzados',
    description: 'Visualiza KPIs, ingresos, productividad y proyecciones con dashboards intuitivos.',
    icon: TrendingUp,
    bg: 'bg-[#60C2D8]/20 border border-[#60C2D8]/30',
    color: 'text-[#60C2D8]',
  },
  {
    title: 'Automatización',
    description: 'Notificaciones, recordatorios y tareas recurrentes automatizadas para ahorrar tiempo.',
    icon: Zap,
    bg: 'bg-[#FFD97B]/20 border border-[#FFD97B]/30',
    color: 'text-[#FFD97B]',
  },
  {
    title: 'Seguridad robusta',
    description: 'Respaldo cifrado, control de acceso por roles y auditoría completa de acciones.',
    icon: Shield,
    bg: 'bg-[#FF8B6B]/20 border border-[#FF8B6B]/30',
    color: 'text-[#FF8B6B]',
  },
  {
    title: 'Experiencia fluida',
    description: 'UI moderna, responsiva y pensada para equipos que requieren productividad desde el día uno.',
    icon: CheckCircle2,
    bg: 'bg-[#4C89D9]/20 border border-[#4C89D9]/30',
    color: 'text-[#60C2D8]',
  },
] as const;

const PRICING = [
  {
    title: 'Freemium',
    subtitle: 'Perfecto para comenzar',
    price: '$0',
    period: '/mes',
    features: ['Hasta 20 órdenes/mes', '1 lavandería', '1 Reporte básico al mes'],
    ctaLabel: 'Comenzar gratis',
    ctaHref: '/register',
    highlight: false,
  },
  {
    title: 'Suscripción',
    subtitle: 'Escala con tu equipo',
    price: '$300',
    period: '/mes',
    features: ['Órdenes ilimitadas', 'Reportes avanzados', 'Soporte prioritario'],
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
