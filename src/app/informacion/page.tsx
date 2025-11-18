import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Clock, Shield, FileText, Users, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

export default function InformacionPage() {
  return (
    <div className="min-h-screen bg-[#0E1624] text-[#F2F5FA]">
      <header className="sticky top-0 z-50 border-b border-[#25354B]/50 bg-[#1B2A40]/95 backdrop-blur-xl backdrop-saturate-150">
        <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center">
              <LaundryLogo size={48} />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#F2F5FA]">LaundryPro</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <Link href="/#features" className="text-[#BFC7D3] transition-all duration-200 hover:text-[#4C89D9] hover:scale-105">
              Características
            </Link>
            <Link href="/#pricing" className="text-[#BFC7D3] transition-all duration-200 hover:text-[#4C89D9] hover:scale-105">
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

      <div className="container mx-auto px-6 lg:px-8 pt-6">
        <Button variant="ghost" asChild className="text-[#BFC7D3] hover:text-[#F2F5FA] hover:bg-[#25354B]/50">
          <Link href="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
      </div>

      <main className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4 text-[#F2F5FA] sm:text-6xl">
            Conoce más sobre{' '}
            <span className="bg-gradient-to-r from-[#4C89D9] via-[#60C2D8] to-[#4C89D9] bg-clip-text text-transparent">
              LaundryPro
            </span>
          </h1>
          <p className="text-xl text-[#BFC7D3] max-w-2xl mx-auto">
            Información importante sobre nuestra plataforma, políticas y cómo contactarnos
          </p>
        </div>

        {/* Nosotros Section */}
        <section id="nosotros" className="mb-20 scroll-mt-20">
          <Card className="group relative overflow-hidden border border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/60 via-[#25354B]/40 to-[#1B2A40]/60 backdrop-blur-sm transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-2xl hover:shadow-[#4C89D9]/10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CardContent className="relative p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4C89D9]/20 to-[#60C2D8]/20 border border-[#4C89D9]/30">
                  <Heart className="h-7 w-7 text-[#4C89D9]" />
                </div>
                <h2 className="text-4xl font-extrabold text-[#F2F5FA]">Nosotros</h2>
              </div>
              <div className="space-y-6 text-[#BFC7D3] leading-relaxed">
                <p className="text-lg">
                  LaundryPro es una plataforma diseñada específicamente para modernizar la gestión de lavanderías. Nuestra misión es
                  proporcionar herramientas intuitivas y poderosas que permitan a los dueños y encargados de lavanderías gestionar
                  sus operaciones de manera eficiente.
                </p>
                <p>
                  Fundada con la visión de transformar la industria de servicios de lavandería, Amir combina tecnología
                  moderna con un entendimiento profundo de las necesidades del negocio. Creemos que cada lavandería merece tener
                  acceso a herramientas profesionales que impulsen su crecimiento.
                </p>
                <p>
                  Nuestro equipo está comprometido con la innovación continua y el soporte excepcional. Trabajamos día a día para
                  mejorar la experiencia tanto de los administradores como de los clientes finales, con{' '}
                  <span className="text-[#60C2D8] font-semibold">pasión y dedicación</span> en cada línea de código.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contacto Section */}
        <section id="contacto" className="mb-20 scroll-mt-20">
          <Card className="group relative overflow-hidden border border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/60 via-[#25354B]/40 to-[#1B2A40]/60 backdrop-blur-sm transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-2xl hover:shadow-[#4C89D9]/10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CardContent className="relative p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#60C2D8]/20 to-[#4C89D9]/20 border border-[#60C2D8]/30">
                  <Mail className="h-7 w-7 text-[#60C2D8]" />
                </div>
                <h2 className="text-4xl font-extrabold text-[#F2F5FA]">Contacto</h2>
              </div>
              <div className="space-y-6 text-[#BFC7D3]">
                <p className="text-lg">
                  Estamos aquí para ayudarte. Si tienes preguntas, sugerencias o necesitas soporte, no dudes en contactarnos.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-[#1B2A40]/40 border border-[#25354B]/50 hover:border-[#4C89D9]/50 transition-all duration-300">
                    <Mail className="h-5 w-5 text-[#4C89D9] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-[#8FA1B7] mb-1">Email</p>
                      <a href="mailto:soporte@amir.com" className="text-[#60C2D8] hover:text-[#4C89D9] font-semibold transition-colors">
                        soporte@laundrypro.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-[#1B2A40]/40 border border-[#25354B]/50 hover:border-[#4C89D9]/50 transition-all duration-300">
                    <Phone className="h-5 w-5 text-[#4C89D9] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-[#8FA1B7] mb-1">Teléfono</p>
                      <a href="tel:+525512345678" className="text-[#60C2D8] hover:text-[#4C89D9] font-semibold transition-colors">
                        +52 55 1234 5678
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-[#1B2A40]/40 border border-[#25354B]/50 hover:border-[#4C89D9]/50 transition-all duration-300 md:col-span-2">
                    <Clock className="h-5 w-5 text-[#4C89D9] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-[#8FA1B7] mb-1">Horario de atención</p>
                      <p className="text-[#BFC7D3] font-semibold">Lunes a Viernes, 9:00 AM - 6:00 PM (GMT-6)</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[#8FA1B7]">
                  Para consultas técnicas o problemas con tu cuenta, te recomendamos contactarnos por email para una respuesta más
                  rápida y detallada.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Privacidad Section */}
        <section id="privacidad" className="mb-20 scroll-mt-20">
          <Card className="group relative overflow-hidden border border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/60 via-[#25354B]/40 to-[#1B2A40]/60 backdrop-blur-sm transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-2xl hover:shadow-[#4C89D9]/10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CardContent className="relative p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6DF2A4]/20 to-[#60C2D8]/20 border border-[#6DF2A4]/30">
                  <Shield className="h-7 w-7 text-[#6DF2A4]" />
                </div>
                <h2 className="text-4xl font-extrabold text-[#F2F5FA]">Política de Privacidad</h2>
              </div>
              <div className="space-y-6 text-[#BFC7D3] leading-relaxed">
                <p className="text-lg">
                  En LaundryPro, nos comprometemos a proteger tu privacidad y la de tus clientes. Esta política describe cómo
                  recopilamos, usamos y protegemos tu información.
                </p>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold mt-8 mb-4 text-[#F2F5FA] flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#4C89D9] to-[#60C2D8] rounded-full" />
                    Información que recopilamos
                  </h3>
                  <ul className="space-y-3 ml-6">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#4C89D9] mt-2 flex-shrink-0" />
                      <span>Información de cuenta: nombre, email, teléfono y datos de perfil</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#4C89D9] mt-2 flex-shrink-0" />
                      <span>Datos de operación: pedidos, clientes, servicios y transacciones</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#4C89D9] mt-2 flex-shrink-0" />
                      <span>Información técnica: dirección IP, tipo de navegador, dispositivo</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#4C89D9] mt-2 flex-shrink-0" />
                      <span>Cookies y tecnologías similares para mejorar la experiencia</span>
                    </li>
                  </ul>

                  <h3 className="text-2xl font-bold mt-8 mb-4 text-[#F2F5FA] flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#4C89D9] to-[#60C2D8] rounded-full" />
                    Cómo usamos tu información
                  </h3>
                  <ul className="space-y-3 ml-6">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#60C2D8] mt-2 flex-shrink-0" />
                      <span>Proporcionar y mejorar nuestros servicios</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#60C2D8] mt-2 flex-shrink-0" />
                      <span>Procesar transacciones y gestionar pedidos</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#60C2D8] mt-2 flex-shrink-0" />
                      <span>Enviar notificaciones y actualizaciones importantes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#60C2D8] mt-2 flex-shrink-0" />
                      <span>Analizar el uso de la plataforma para mejoras continuas</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#60C2D8] mt-2 flex-shrink-0" />
                      <span>Cumplir con obligaciones legales y prevenir fraudes</span>
                    </li>
                  </ul>

                  <h3 className="text-2xl font-bold mt-8 mb-4 text-[#F2F5FA] flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#4C89D9] to-[#60C2D8] rounded-full" />
                    Protección de datos
                  </h3>
                  <p>
                    Implementamos medidas de seguridad técnicas y organizativas para proteger tu información contra acceso no
                    autorizado, pérdida o destrucción. Utilizamos cifrado SSL/TLS para todas las comunicaciones y almacenamos los
                    datos en servidores seguros.
                  </p>

                  <h3 className="text-2xl font-bold mt-8 mb-4 text-[#F2F5FA] flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#4C89D9] to-[#60C2D8] rounded-full" />
                    Tus derechos
                  </h3>
                  <p>
                    Tienes derecho a acceder, corregir, eliminar o exportar tus datos personales en cualquier momento. Puedes hacerlo
                    desde la sección de configuración de tu cuenta o contactándonos directamente.
                  </p>
                </div>

                <p className="text-sm text-[#8FA1B7] mt-8 pt-6 border-t border-[#25354B]/50">
                  Última actualización: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Términos Section */}
        <section id="terminos" className="mb-20 scroll-mt-20">
          <Card className="group relative overflow-hidden border border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/60 via-[#25354B]/40 to-[#1B2A40]/60 backdrop-blur-sm transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-2xl hover:shadow-[#4C89D9]/10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CardContent className="relative p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFD97B]/20 to-[#4C89D9]/20 border border-[#FFD97B]/30">
                  <FileText className="h-7 w-7 text-[#FFD97B]" />
                </div>
                <h2 className="text-4xl font-extrabold text-[#F2F5FA]">Términos y Condiciones</h2>
              </div>
              <div className="space-y-6 text-[#BFC7D3] leading-relaxed">
                <p className="text-lg">
                  Al utilizar LaundryPro, aceptas estos términos y condiciones. Por favor, léelos cuidadosamente antes de usar
                  nuestros servicios.
                </p>

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold mt-8 mb-4 text-[#F2F5FA] flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#4C89D9] to-[#60C2D8] rounded-full" />
                    Uso del servicio
                  </h3>
                  <ul className="space-y-3 ml-6">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#4C89D9] mt-2 flex-shrink-0" />
                      <span>Debes ser mayor de edad o tener autorización para crear una cuenta</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#4C89D9] mt-2 flex-shrink-0" />
                      <span>Eres responsable de mantener la confidencialidad de tus credenciales</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#4C89D9] mt-2 flex-shrink-0" />
                      <span>No debes usar el servicio para actividades ilegales o no autorizadas</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#4C89D9] mt-2 flex-shrink-0" />
                      <span>Debes proporcionar información precisa y actualizada</span>
                    </li>
                  </ul>

                  <h3 className="text-2xl font-bold mt-8 mb-4 text-[#F2F5FA] flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#4C89D9] to-[#60C2D8] rounded-full" />
                    Planes y pagos
                  </h3>
                  <p>
                    Ofrecemos diferentes planes de suscripción. Los pagos se procesan de forma segura y puedes cancelar tu
                    suscripción en cualquier momento desde la configuración de tu cuenta. Los reembolsos se manejan caso por caso según
                    nuestras políticas.
                  </p>

                  <h3 className="text-2xl font-bold mt-8 mb-4 text-[#F2F5FA] flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#4C89D9] to-[#60C2D8] rounded-full" />
                    Limitación de responsabilidad
                  </h3>
                  <p>
                    LaundryPro se proporciona "tal cual" sin garantías expresas o implícitas. No nos hacemos responsables por pérdidas
                    indirectas, incidentales o consecuentes derivadas del uso o la imposibilidad de usar el servicio.
                  </p>

                  <h3 className="text-2xl font-bold mt-8 mb-4 text-[#F2F5FA] flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#4C89D9] to-[#60C2D8] rounded-full" />
                    Modificaciones
                  </h3>
                  <p>
                    Nos reservamos el derecho de modificar estos términos en cualquier momento. Te notificaremos sobre cambios
                    significativos por email o mediante avisos en la plataforma. El uso continuado del servicio después de los cambios
                    constituye tu aceptación de los nuevos términos.
                  </p>

                  <h3 className="text-2xl font-bold mt-8 mb-4 text-[#F2F5FA] flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#4C89D9] to-[#60C2D8] rounded-full" />
                    Terminación
                  </h3>
                  <p>
                    Podemos suspender o terminar tu cuenta si violas estos términos o si detectamos actividad fraudulenta. Tú
                    también puedes cerrar tu cuenta en cualquier momento desde la configuración.
                  </p>
                </div>

                <p className="text-sm text-[#8FA1B7] mt-8 pt-6 border-t border-[#25354B]/50">
                  Última actualización: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}

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

const Footer = () => (
  <footer id="about" className="border-t border-[#25354B]/50 bg-[#1B2A40]/80 backdrop-blur-xl">
    <div className="container mx-auto px-6 py-16 lg:px-8">
      <div className="grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="mb-6 flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <LaundryLogo size={40} />
            </div>
            <span className="text-xl font-bold text-[#F2F5FA]">LaundryPro</span>
          </div>
          <p className="text-sm leading-relaxed text-[#8FA1B7]">
            Creamos herramientas enfocadas en resolver los retos reales de las lavanderías modernas.
          </p>
        </div>
        <FooterColumn
          title="Producto"
          links={[
            { label: 'Características', href: '/#features' },
            { label: 'Precios', href: '/#pricing' },
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
        © {new Date().getFullYear()} LaundryPro. Todos los derechos reservados.
      </div>
    </div>
  </footer>
);
