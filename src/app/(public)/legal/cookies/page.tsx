import Link from 'next/link'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Política de Cookies | TenerifeHomes',
  description: 'Información sobre el uso de cookies en TenerifeHomes',
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Link */}
        <Link href="/" className="inline-block text-blue-600 hover:text-blue-800 mb-8">
          ← Volver al inicio
        </Link>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold mb-8">Política de Cookies</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. ¿Qué son las Cookies?</h2>
            <p className="text-gray-700 mb-4">
              Las cookies son pequeños ficheros de texto que se guardan en el dispositivo del usuario cuando navega por un sitio web. Se utilizan para recordar información sobre el usuario y sus preferencias, permitiendo una experiencia más personalizada y eficiente.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Tipos de Cookies que Utilizamos</h2>
            <p className="text-gray-700 mb-4">
              En TenerifeHomes utilizamos diferentes tipos de cookies:
            </p>

            <h3 className="text-xl font-semibold mb-3">2.1 Cookies Técnicas o Necesarias</h3>
            <p className="text-gray-700 mb-4">
              Son aquellas esenciales para el funcionamiento del sitio web. Permiten la navegación y el acceso a áreas protegidas del sitio. No requieren consentimiento previo:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Autenticación del usuario</li>
              <li>Preferencias de seguridad</li>
              <li>Control de sesiones</li>
              <li>Equilibrio de carga de servidores</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.2 Cookies de Rendimiento</h3>
            <p className="text-gray-700 mb-4">
              Recopilan información sobre cómo se utiliza nuestro sitio web (páginas visitadas, tiempo en cada página, errores). Esta información nos ayuda a mejorar el servicio:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Google Analytics - análisis de tráfico</li>
              <li>Monitoreo de errores</li>
              <li>Análisis de velocidad de carga</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.3 Cookies Funcionales</h3>
            <p className="text-gray-700 mb-4">
              Permiten proporcionar funcionalidades mejoradas y personalizadas:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Recordar preferencias del usuario</li>
              <li>Idioma seleccionado</li>
              <li>Zona horaria</li>
              <li>Productos visualizados recientemente</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.4 Cookies de Publicidad</h3>
            <p className="text-gray-700 mb-4">
              Se utilizan para mostrar anuncios relevantes y medir su eficacia:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Google Ads</li>
              <li>Facebook Pixel</li>
              <li>Retargeting publicitario</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Proveedores de Cookies</h2>
            <p className="text-gray-700 mb-4">
              Algunos de nuestros proveedores terceros que utilizan cookies son:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li><strong>Google LLC</strong> - Analytics, Google Maps, reCAPTCHA</li>
              <li><strong>Meta Platforms, Inc.</strong> - Facebook Pixel</li>
              <li><strong>Proveedores de Hosting</strong> - Cookies de sesión</li>
              <li><strong>Servicios de CDN</strong> - Optimización de contenido</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Consentimiento de Cookies</h2>
            <p className="text-gray-700 mb-4">
              En su primera visita a nuestro sitio web, aparecerá un banner de consentimiento de cookies. A través de este:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Puede aceptar todas las cookies</li>
              <li>Rechazar cookies no esenciales</li>
              <li>Personalizar qué tipos de cookies desea permitir</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Las cookies técnicas siempre estarán activas, ya que son necesarias para el funcionamiento del sitio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Duración de las Cookies</h2>
            <p className="text-gray-700 mb-4">
              Las cookies tienen diferentes duraciones:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li><strong>Cookies de sesión:</strong> Se eliminan cuando cierra el navegador</li>
              <li><strong>Cookies persistentes:</strong> Permanecen en el dispositivo hasta 2 años</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Control de Cookies</h2>
            <p className="text-gray-700 mb-4">
              Usted puede controlar las cookies a través de:
            </p>

            <h3 className="text-xl font-semibold mb-3">6.1 Configuración del Navegador</h3>
            <p className="text-gray-700 mb-4">
              La mayoría de navegadores le permite controlar las cookies. Consulte la ayuda de su navegador:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Chrome: Configuración → Privacidad y seguridad → Cookies</li>
              <li>Firefox: Preferencias → Privacidad → Cookies</li>
              <li>Safari: Preferencias → Privacidad → Cookies</li>
              <li>Edge: Configuración → Privacidad → Cookies</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">6.2 Herramientas de Terceros</h3>
            <p className="text-gray-700 mb-4">
              Puede utilizar herramientas como:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Your Online Choices (www.youronlinechoices.eu)</li>
              <li>Network Advertising Initiative (optout.networkadvertising.org)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Cookies de Terceros</h2>
            <p className="text-gray-700 mb-4">
              Algunos de nuestros partners pueden establecer cookies desde sus servidores. No tenemos control total sobre estas cookies, pero hemos seleccionado partners de confianza que cumpen con normativas de protección de datos.
            </p>
            <p className="text-gray-700 mb-4">
              Puede revisar las políticas de cookies de terceros en sus sitios web.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Impacto de Rechazar Cookies</h2>
            <p className="text-gray-700 mb-4">
              Si rechaza cookies no esenciales:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>El sitio seguirá siendo funcional</li>
              <li>Algunas características personalizadas pueden no estar disponibles</li>
              <li>Verá anuncios menos relevantes</li>
              <li>No se recopilarán datos analíticos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Cambiar Preferencias de Cookies</h2>
            <p className="text-gray-700 mb-4">
              Puede cambiar sus preferencias de cookies en cualquier momento:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>A través del banner de consentimiento (si vuelve a aparecer)</li>
              <li>En la sección de "Preferencias de Cookies" de la plataforma</li>
              <li>Contactando a info@tenerifehomes.com</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Privacidad y Protección de Datos</h2>
            <p className="text-gray-700 mb-4">
              Para obtener información completa sobre cómo procesamos sus datos personales, consulte nuestra{' '}
              <Link href="/legal/privacidad" className="text-blue-600 hover:text-blue-800">
                Política de Privacidad
              </Link>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">11. Contacto</h2>
            <p className="text-gray-700 mb-4">
              Si tiene preguntas sobre nuestra política de cookies, puede contactarnos:
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong> info@tenerifehomes.com
            </p>
          </section>

          <section className="mb-8">
            <p className="text-gray-500 text-sm">
              Última actualización: Marzo 2026
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
