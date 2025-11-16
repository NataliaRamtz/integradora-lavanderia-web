import Link from 'next/link';
import { Shirt, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function InformacionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-50 dark:text-slate-50 text-slate-900">
      <header className="border-b border-slate-800 dark:border-slate-800 border-slate-200 bg-slate-950/85 dark:bg-slate-950/85 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60 supports-[backdrop-filter]:dark:bg-slate-950/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500 shadow-lg shadow-sky-500/40">
              <Shirt className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-50 dark:text-slate-50 text-slate-900">LaundryPro</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <section id="nosotros" className="mb-16 scroll-mt-20">
          <h1 className="text-4xl font-bold mb-6 text-slate-50 dark:text-slate-50 text-slate-900">Nosotros</h1>
          <div className="space-y-4 text-slate-300 dark:text-slate-300 text-slate-700">
            <p>
              LaundryPro es una plataforma diseñada específicamente para modernizar la gestión de lavanderías. Nuestra misión es
              proporcionar herramientas intuitivas y poderosas que permitan a los dueños y encargados de lavanderías gestionar
              sus operaciones de manera eficiente.
            </p>
            <p>
              Fundada con la visión de transformar la industria de servicios de lavandería, LaundryPro combina tecnología
              moderna con un entendimiento profundo de las necesidades del negocio. Creemos que cada lavandería merece tener
              acceso a herramientas profesionales que impulsen su crecimiento.
            </p>
            <p>
              Nuestro equipo está comprometido con la innovación continua y el soporte excepcional. Trabajamos día a día para
              mejorar la experiencia tanto de los administradores como de los clientes finales.
            </p>
          </div>
        </section>

        <section id="contacto" className="mb-16 scroll-mt-20">
          <h2 className="text-3xl font-bold mb-6 text-slate-50 dark:text-slate-50 text-slate-900">Contacto</h2>
          <div className="space-y-4 text-slate-300 dark:text-slate-300 text-slate-700">
            <p>
              Estamos aquí para ayudarte. Si tienes preguntas, sugerencias o necesitas soporte, no dudes en contactarnos.
            </p>
            <div className="space-y-2">
              <p>
                <strong className="text-slate-100 dark:text-slate-100 text-slate-900">Email:</strong>{' '}
                <a href="mailto:soporte@laundrypro.com" className="text-sky-400 dark:text-sky-400 text-sky-600 hover:underline">
                  soporte@laundrypro.com
                </a>
              </p>
              <p>
                <strong className="text-slate-100 dark:text-slate-100 text-slate-900">Teléfono:</strong>{' '}
                <a href="tel:+525512345678" className="text-sky-400 dark:text-sky-400 text-sky-600 hover:underline">
                  +52 55 1234 5678
                </a>
              </p>
              <p>
                <strong className="text-slate-100 dark:text-slate-100 text-slate-900">Horario de atención:</strong> Lunes a
                Viernes, 9:00 AM - 6:00 PM (GMT-6)
              </p>
            </div>
            <p>
              Para consultas técnicas o problemas con tu cuenta, te recomendamos contactarnos por email para una respuesta más
              rápida y detallada.
            </p>
          </div>
        </section>

        <section id="privacidad" className="mb-16 scroll-mt-20">
          <h2 className="text-3xl font-bold mb-6 text-slate-50 dark:text-slate-50 text-slate-900">Política de Privacidad</h2>
          <div className="space-y-4 text-slate-300 dark:text-slate-300 text-slate-700">
            <p>
              En LaundryPro, nos comprometemos a proteger tu privacidad y la de tus clientes. Esta política describe cómo
              recopilamos, usamos y protegemos tu información.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-100 dark:text-slate-100 text-slate-900">
              Información que recopilamos
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Información de cuenta: nombre, email, teléfono y datos de perfil</li>
              <li>Datos de operación: pedidos, clientes, servicios y transacciones</li>
              <li>Información técnica: dirección IP, tipo de navegador, dispositivo</li>
              <li>Cookies y tecnologías similares para mejorar la experiencia</li>
            </ul>
            <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-100 dark:text-slate-100 text-slate-900">
              Cómo usamos tu información
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Proporcionar y mejorar nuestros servicios</li>
              <li>Procesar transacciones y gestionar pedidos</li>
              <li>Enviar notificaciones y actualizaciones importantes</li>
              <li>Analizar el uso de la plataforma para mejoras continuas</li>
              <li>Cumplir con obligaciones legales y prevenir fraudes</li>
            </ul>
            <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-100 dark:text-slate-100 text-slate-900">
              Protección de datos
            </h3>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas para proteger tu información contra acceso no
              autorizado, pérdida o destrucción. Utilizamos cifrado SSL/TLS para todas las comunicaciones y almacenamos los
              datos en servidores seguros.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-100 dark:text-slate-100 text-slate-900">Tus derechos</h3>
            <p>
              Tienes derecho a acceder, corregir, eliminar o exportar tus datos personales en cualquier momento. Puedes hacerlo
              desde la sección de configuración de tu cuenta o contactándonos directamente.
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-400 text-slate-600 mt-6">
              Última actualización: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </section>

        <section id="terminos" className="mb-16 scroll-mt-20">
          <h2 className="text-3xl font-bold mb-6 text-slate-50 dark:text-slate-50 text-slate-900">Términos y Condiciones</h2>
          <div className="space-y-4 text-slate-300 dark:text-slate-300 text-slate-700">
            <p>
              Al utilizar LaundryPro, aceptas estos términos y condiciones. Por favor, léelos cuidadosamente antes de usar
              nuestros servicios.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-100 dark:text-slate-100 text-slate-900">
              Uso del servicio
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Debes ser mayor de edad o tener autorización para crear una cuenta</li>
              <li>Eres responsable de mantener la confidencialidad de tus credenciales</li>
              <li>No debes usar el servicio para actividades ilegales o no autorizadas</li>
              <li>Debes proporcionar información precisa y actualizada</li>
            </ul>
            <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-100 dark:text-slate-100 text-slate-900">
              Planes y pagos
            </h3>
            <p>
              Ofrecemos diferentes planes de suscripción. Los pagos se procesan de forma segura y puedes cancelar tu
              suscripción en cualquier momento desde la configuración de tu cuenta. Los reembolsos se manejan caso por caso según
              nuestras políticas.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-100 dark:text-slate-100 text-slate-900">
              Limitación de responsabilidad
            </h3>
            <p>
              LaundryPro se proporciona "tal cual" sin garantías expresas o implícitas. No nos hacemos responsables por pérdidas
              indirectas, incidentales o consecuentes derivadas del uso o la imposibilidad de usar el servicio.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-100 dark:text-slate-100 text-slate-900">
              Modificaciones
            </h3>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Te notificaremos sobre cambios
              significativos por email o mediante avisos en la plataforma. El uso continuado del servicio después de los cambios
              constituye tu aceptación de los nuevos términos.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-100 dark:text-slate-100 text-slate-900">
              Terminación
            </h3>
            <p>
              Podemos suspender o terminar tu cuenta si violas estos términos o si detectamos actividad fraudulenta. Tú
              también puedes cerrar tu cuenta en cualquier momento desde la configuración.
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-400 text-slate-600 mt-6">
              Última actualización: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

