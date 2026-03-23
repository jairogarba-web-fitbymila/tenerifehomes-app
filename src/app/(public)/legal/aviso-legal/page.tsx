import Link from 'next/link'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Aviso Legal | HabiBook',
  description: 'Aviso legal e información de identificación de HabiBook',
}

export default function AvisoLegalPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Link */}
        <Link href="/" className="inline-block text-blue-600 hover:text-blue-800 mb-8">
          ← Volver al inicio
        </Link>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold mb-8">Aviso Legal</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Identificación de la Empresa</h2>
            <p className="text-gray-700 mb-4">
              Conforme a lo dispuesto en la Ley 34/1988, de 11 de noviembre, sobre publicidad y responsabilidad en la comunicación comercial, se facilitan a continuación los siguientes datos de identificación:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li><strong>Denominación Social:</strong> HabiBook</li>
              <li><strong>Ubicación:</strong> Tenerife, Islas Canarias, España</li>
              <li><strong>Correo Electrónico de Contacto:</strong> info@habibook.com</li>
              <li><strong>Descripción del Servicio:</strong> Plataforma inmobiliaria integral para agentes y agencias en Canarias</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Propiedad Intelectual</h2>
            <p className="text-gray-700 mb-4">
              Todos los contenidos de este sitio web, incluyendo pero no limitado a textos, imágenes, gráficos, logos, iconos, código HTML, CSS y JavaScript, están protegidos por las leyes de propiedad intelectual y derechos de autor.
            </p>
            <p className="text-gray-700 mb-4">
              HabiBook es titular de todos los derechos de propiedad intelectual sobre los contenidos de este sitio web, salvo aquellos que hayan sido cedidos por terceros. Se prohíbe expresamente:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Reproducir, copiar, distribuir o transmitir contenidos sin autorización explícita</li>
              <li>Modificar, adaptar, traducir o crear trabajos derivados</li>
              <li>Utilizar el contenido con fines comerciales sin consentimiento</li>
              <li>Retirar o alterar avisos de derechos de autor o marcas registradas</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Condiciones de Uso</h2>
            <p className="text-gray-700 mb-4">
              El acceso y uso de este sitio web implica la aceptación de estos términos y condiciones. HabiBook se reserva el derecho de modificar estos términos en cualquier momento. Se recomienda revisar periódicamente esta página para verificar cambios.
            </p>
            <p className="text-gray-700 mb-4">
              El usuario se compromete a utilizar este sitio web de conformidad con las leyes aplicables y se abstiene de:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Realizar actos que violen derechos de terceros</li>
              <li>Transmitir virus, malware o cualquier código malicioso</li>
              <li>Intentar acceder de forma no autorizada a sistemas o redes</li>
              <li>Interferir con la operación normal del sitio web</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Responsabilidad Civil</h2>
            <p className="text-gray-700 mb-4">
              HabiBook no será responsable por:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Daños directos o indirectos causados por el acceso o uso del sitio web</li>
              <li>Pérdida de datos, ingresos o beneficios</li>
              <li>Interrupciones o fallos en el servicio</li>
              <li>Contenidos alojados por terceros en el sitio web</li>
            </ul>
            <p className="text-gray-700 mb-4">
              En ningún caso la responsabilidad de HabiBook superará el importe de los pagos realizados por el usuario en los últimos 12 meses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Exención de Garantías</h2>
            <p className="text-gray-700 mb-4">
              Este sitio web se proporciona "tal cual" sin garantías de ningún tipo, ya sean explícitas o implícitas. HabiBook no garantiza:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Que el servicio cumplirá con requisitos específicos</li>
              <li>La precisión, integridad o actualidad del contenido</li>
              <li>La ausencia de errores o fallos de seguridad</li>
              <li>Compatibilidad con todos los navegadores o dispositivos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Enlaces Externos</h2>
            <p className="text-gray-700 mb-4">
              Este sitio web puede contener enlaces a sitios web de terceros. HabiBook no es responsable del contenido, precisión, legalidad o cualquier otro aspecto de estos sitios externos. La inclusión de un enlace no implica aprobación o asociación con el sitio vinculado.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Impuestos</h2>
            <p className="text-gray-700 mb-4">
              Los precios indicados en el sitio web no incluyen IGIC (Impuesto General Indirecto Canario) u otros impuestos aplicables, salvo que se indique expresamente lo contrario. El IGIC será aplicable conforme a la legislación tributaria vigente en las Islas Canarias.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Ley Aplicable y Jurisdicción</h2>
            <p className="text-gray-700 mb-4">
              Este aviso legal se rige por la legislación española, específicamente por las leyes aplicables en las Islas Canarias. Cualquier controversia derivada del acceso o uso de este sitio web será resuelta por los tribunales competentes de Tenerife.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Contacto para Consultas Legales</h2>
            <p className="text-gray-700 mb-4">
              Para cualquier consulta relativa a este aviso legal, puede contactar a:
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong> info@habibook.com
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
