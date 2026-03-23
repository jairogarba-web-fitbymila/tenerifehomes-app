import Link from 'next/link'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Política de Privacidad | HabiBook',
  description: 'Política de privacidad y tratamiento de datos de HabiBook',
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Link */}
        <Link href="/" className="inline-block text-blue-600 hover:text-blue-800 mb-8">
          ← Volver al inicio
        </Link>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold mb-8">Política de Privacidad</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Responsable del Tratamiento de Datos</h2>
            <p className="text-gray-700 mb-4">
              <strong>Entidad:</strong> HabiBook
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Ubicación:</strong> Tenerife, Islas Canarias, España
            </p>
            <p className="text-gray-700">
              <strong>Email de contacto:</strong> info@habibook.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Cumplimiento RGPD</h2>
            <p className="text-gray-700 mb-4">
              HabiBook cumple en todo momento con el Reglamento (UE) 2016/679, Reglamento General de Protección de Datos (RGPD), así como con la Ley Orgánica 3/2018, de 5 de diciembre (LOPDGDD) y demás normativa vigente en materia de protección de datos personales.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Datos que Recopilamos</h2>
            <p className="text-gray-700 mb-4">
              Recopilamos los siguientes tipos de datos personales:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li><strong>Datos de registro:</strong> Nombre, apellidos, email, teléfono, nombre del negocio/agencia</li>
              <li><strong>Datos de perfil:</strong> Información profesional, ubicación, especialidades inmobiliarias</li>
              <li><strong>Datos de contacto:</strong> Dirección de correo electrónico, número de teléfono</li>
              <li><strong>Datos de uso:</strong> Información sobre cómo utiliza la plataforma (logs, navegación)</li>
              <li><strong>Datos de pago:</strong> Información de transacciones (sin guardar datos bancarios directamente)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Base Legal del Tratamiento</h2>
            <p className="text-gray-700 mb-4">
              Tratamos sus datos personales sobre las siguientes bases legales:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li><strong>Ejecución de contrato:</strong> Para prestar los servicios de la plataforma</li>
              <li><strong>Consentimiento:</strong> Para comunicaciones comerciales y marketing directo</li>
              <li><strong>Obligación legal:</strong> Para cumplir con obligaciones fiscales y legales</li>
              <li><strong>Interés legítimo:</strong> Para mejorar nuestros servicios y prevenir fraude</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Finalidad del Tratamiento</h2>
            <p className="text-gray-700 mb-4">
              Sus datos se utilizan para:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Crear y gestionar su cuenta en la plataforma</li>
              <li>Prestar los servicios contratados</li>
              <li>Procesar pagos y facturación</li>
              <li>Enviar notificaciones sobre cambios en los servicios</li>
              <li>Responder a sus consultas y solicitudes de soporte</li>
              <li>Analizar el uso de la plataforma para mejorar nuestros servicios</li>
              <li>Cumplir con obligaciones legales y fiscales</li>
              <li>Prevenir actividades fraudulentas o ilegales</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Destinatarios de los Datos</h2>
            <p className="text-gray-700 mb-4">
              Sus datos personales pueden ser compartidos con:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li><strong>Proveedores de servicios:</strong> Hosting, bases de datos, servicios de email</li>
              <li><strong>Autoridades públicas:</strong> Cuando sea requerido por ley</li>
              <li><strong>Partners comerciales:</strong> Solo con su consentimiento explícito</li>
              <li><strong>Plataformas de pago:</strong> Para procesar transacciones económicas</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Transferencia Internacional de Datos</h2>
            <p className="text-gray-700 mb-4">
              Los datos personales se almacenan y procesan principalmente dentro de la Unión Europea. En caso de transferencias fuera de la UE, se implementan medidas de protección conforme a las normas del RGPD, incluyendo cláusulas contractuales estándar aprobadas por la Comisión Europea.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Retención de Datos</h2>
            <p className="text-gray-700 mb-4">
              Mantenemos sus datos personales durante el tiempo necesario para:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Prestar los servicios contratados mientras su cuenta esté activa</li>
              <li>Cumplir con obligaciones legales (hasta 10 años para datos fiscales)</li>
              <li>Resolver disputas o reclamaciones</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Una vez finalizada la relación contractual, los datos se eliminarán o anonimizarán, excepto donde la ley exija su conservación.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Derechos ARCO</h2>
            <p className="text-gray-700 mb-4">
              Conforme al RGPD y LOPDGDD, usted tiene derecho a:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li><strong>Acceso (A):</strong> Obtener información sobre sus datos y cómo los procesamos</li>
              <li><strong>Rectificación (R):</strong> Corregir datos inexactos o incompletos</li>
              <li><strong>Cancelación (C):</strong> Solicitar la eliminación de sus datos</li>
              <li><strong>Oposición (O):</strong> Oponerse al tratamiento de sus datos en ciertos casos</li>
              <li><strong>Portabilidad:</strong> Recibir sus datos en un formato estructurado y transferirlos</li>
              <li><strong>Limitación:</strong> Limitar el tratamiento de sus datos</li>
              <li><strong>No ser sometido:</strong> A decisiones automatizadas que produzcan efectos legales</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Ejercicio de Derechos</h2>
            <p className="text-gray-700 mb-4">
              Para ejercer cualquiera de los derechos anteriores, puede enviar una solicitud escrita a:
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Email:</strong> info@habibook.com
            </p>
            <p className="text-gray-700 mb-4">
              Responderemos a su solicitud en un plazo máximo de 30 días hábiles desde su recepción.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">11. Política de Cookies</h2>
            <p className="text-gray-700 mb-4">
              Utilizamos cookies para mejorar la experiencia del usuario. Consulte nuestra{' '}
              <Link href="/legal/cookies" className="text-blue-600 hover:text-blue-800">
                Política de Cookies
              </Link>{' '}
              para obtener más información.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">12. Medidas de Seguridad</h2>
            <p className="text-gray-700 mb-4">
              HabiBook implementa medidas técnicas y organizativas para proteger sus datos personales contra acceso no autorizado, alteración, divulgación o destrucción, incluyendo:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Encriptación de datos en tránsito y en reposo</li>
              <li>Autenticación de usuario mediante contraseñas seguras</li>
              <li>Acceso restringido a datos solo para personal autorizado</li>
              <li>Auditorías de seguridad regulares</li>
              <li>Protección antivirus y firewall</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">13. Denuncia ante Autoridad de Control</h2>
            <p className="text-gray-700 mb-4">
              Si considera que el tratamiento de sus datos viola sus derechos, puede presentar una reclamación ante la Autoridad de Protección de Datos competente. En España, la autoridad de control es la Agencia Española de Protección de Datos (AEPD).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">14. Cambios en la Política</h2>
            <p className="text-gray-700 mb-4">
              HabiBook se reserva el derecho de modificar esta política en cualquier momento. Los cambios significativos se comunicarán por email o mediante notificación en el sitio web. El uso continuado del sitio implica aceptación de los cambios.
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
