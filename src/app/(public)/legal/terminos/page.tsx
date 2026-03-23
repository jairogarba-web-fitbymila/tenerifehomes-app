import Link from 'next/link'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Términos y Condiciones | HabiBook',
  description: 'Términos y condiciones de uso de la plataforma HabiBook',
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Link */}
        <Link href="/" className="inline-block text-blue-600 hover:text-blue-800 mb-8">
          ← Volver al inicio
        </Link>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold mb-8">Términos y Condiciones</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Introducción y Aceptación de Términos</h2>
            <p className="text-gray-700 mb-4">
              Bienvenido a HabiBook. Al registrarse, acceder y utilizar esta plataforma inmobiliaria, usted acepta estar sujeto a estos Términos y Condiciones, así como a todas nuestras políticas incluida la Política de Privacidad.
            </p>
            <p className="text-gray-700 mb-4">
              Si no está de acuerdo con cualquier parte de estos términos, le recomendamos que no utilice nuestra plataforma. El uso continuado implica aceptación completa.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Definiciones</h2>
            <p className="text-gray-700 mb-4">
              Para propósitos de estos términos:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li><strong>"Plataforma"</strong> - El sitio web y la aplicación de HabiBook</li>
              <li><strong>"Usuario" o "Agente"</strong> - Usted, como agente o agencia inmobiliaria registrado</li>
              <li><strong>"Contenido"</strong> - Textos, imágenes, videos, anuncios de propiedades publicados en la plataforma</li>
              <li><strong>"Servicios"</strong> - Los servicios ofrecidos por HabiBook incluyendo alojamiento de propiedades, CRM, portales</li>
              <li><strong>"HabiBook"</strong> - La plataforma inmobiliaria y su operador</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Requisitos para Usar la Plataforma</h2>
            <p className="text-gray-700 mb-4">
              Para registrarse como usuario, debe:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Ser mayor de 18 años</li>
              <li>Ser agente inmobiliario, corredor de seguros inmobiliario, gestor inmobiliario o representante de una agencia</li>
              <li>Proporcionar información veraz, exacta y completa</li>
              <li>Mantener la confidencialidad de su contraseña</li>
              <li>Aceptar esta términos y condiciones y nuestra política de privacidad</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Proceso de Registro</h2>
            <p className="text-gray-700 mb-4">
              El registro implica:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
              <li>Proporcionar información profesional veraz</li>
              <li>Crear una cuenta con email y contraseña únicos</li>
              <li>Confirmar su email mediante un enlace de verificación</li>
              <li>Aceptar estos términos y condiciones</li>
            </ol>
            <p className="text-gray-700 mb-4">
              HabiBook se reserva el derecho de rechazar registros que no cumplan con los requisitos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Responsabilidades del Usuario/Agente</h2>
            <p className="text-gray-700 mb-4">
              Como usuario de HabiBook, usted es responsable de:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Mantener su cuenta activa con información actualizada</li>
              <li>Proteger su contraseña y no compartirla con terceros</li>
              <li>Garantizar que el contenido que publica es legal y correcto</li>
              <li>Cumplir con todas las leyes aplicables en publicación de propiedades</li>
              <li>No utilizar la plataforma para actividades ilegales o no autorizadas</li>
              <li>Publicar fotos de calidad y descripciones precisas de las propiedades</li>
              <li>Actualizar regularmente los anuncios de propiedades</li>
              <li>Responder a las consultas de los clientes en tiempo oportuno</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Prohibiciones Explícitas</h2>
            <p className="text-gray-700 mb-4">
              Está absolutamente prohibido:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Publicar propiedades que no tiene derecho a comercializar</li>
              <li>Proporcionar información falsa o engañosa</li>
              <li>Copiar o reproducir contenido de otros usuarios sin autorización</li>
              <li>Realizar transacciones ilegales o fraude</li>
              <li>Acoso, amenazas o lenguaje ofensivo hacia otros usuarios</li>
              <li>Spam, phishing o ataques de seguridad</li>
              <li>Modificar o interferir con la plataforma</li>
              <li>Eludir sistemas de seguridad o autenticación</li>
              <li>Recolectar datos de otros usuarios sin consentimiento</li>
              <li>Vender o compartir información de clientes sin consentimiento</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Contenido y Propiedad Intelectual</h2>
            <p className="text-gray-700 mb-4">
              Al publicar contenido en HabiBook:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Garantiza que es propietario o tiene licencia para usar ese contenido</li>
              <li>Otorga a HabiBook una licencia global para mostrar, distribuir y promocionar el contenido</li>
              <li>Declara que el contenido no viola derechos de terceros</li>
              <li>Es responsable de cualquier reclamación por infracción de derechos</li>
            </ul>
            <p className="text-gray-700 mb-4">
              HabiBook no es propietario del contenido que publica, pero puede utilizarlo para mejorar la plataforma.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Precios y Tarifas</h2>
            <p className="text-gray-700 mb-4">
              Nuestras tarifas están disponibles en la sección de precios de la plataforma:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Los precios incluirán IGIC (Impuesto General Indirecto Canario) según corresponda</li>
              <li>Los precios están sujetos a cambio con notificación previa</li>
              <li>Los cambios de precio no afectarán a suscripciones activas (salvo renovación)</li>
              <li>Se aceptan pagos por transferencia bancaria, tarjeta de crédito y métodos alternativos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Período de Prueba y Suscripción</h2>
            <p className="text-gray-700 mb-4">
              Si se ofrece un período de prueba gratuito:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Es válido por el período especificado (ej: 14 días, 30 días)</li>
              <li>Se requiere método de pago válido para acceder</li>
              <li>Si no cancela antes de finalizar, se le cobrará la tarifa de suscripción</li>
              <li>Puede cancelar en cualquier momento antes de que termine el período de prueba</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Cancelación y Reembolsos</h2>
            <p className="text-gray-700 mb-4">
              Política de cancelación:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Puede cancelar su suscripción en cualquier momento desde su cuenta</li>
              <li>La cancelación entra en vigor al final del período de facturación actual</li>
              <li>No ofrecemos reembolsos prorrateados para cancelaciones a mitad de ciclo</li>
              <li>Podrá descargar sus datos antes de la cancelación final</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">11. Garantía Limitada</h2>
            <p className="text-gray-700 mb-4">
              HabiBook proporciona la plataforma "tal cual":
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Sin garantías explícitas o implícitas de disponibilidad continua</li>
              <li>Sin garantía de que el servicio cumplirá todos sus requisitos</li>
              <li>Sin garantía sobre la precisión de datos generados por terceros</li>
              <li>Nos esforzamos por mantener 99% de disponibilidad pero no garantizamos uptime</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">12. Limitación de Responsabilidad</h2>
            <p className="text-gray-700 mb-4">
              En ningún caso HabiBook será responsable de:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Daños directos, indirectos, incidentales o consecuentes</li>
              <li>Pérdida de datos, ingresos o beneficios</li>
              <li>Interrupciones o fallos de servicio</li>
              <li>Acciones de otros usuarios o terceros</li>
              <li>Violaciones de seguridad o acceso no autorizado</li>
            </ul>
            <p className="text-gray-700 mb-4">
              La responsabilidad total de HabiBook no excederá el monto total pagado en los últimos 12 meses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">13. Suspensión y Terminación de Cuenta</h2>
            <p className="text-gray-700 mb-4">
              HabiBook puede suspender o terminar su cuenta si:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Viola estos términos y condiciones</li>
              <li>Realiza actividades fraudulentas o ilegales</li>
              <li>Incumple con pagos adeudados</li>
              <li>Publica contenido prohibido o ilegal</li>
              <li>Presenta conducta abusiva hacia otros usuarios</li>
            </ul>
            <p className="text-gray-700 mb-4">
              La terminación será notificada por email, y tendrá 30 días para descargar sus datos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">14. Modificación de Términos</h2>
            <p className="text-gray-700 mb-4">
              HabiBook se reserva el derecho de:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Modificar estos términos en cualquier momento</li>
              <li>Notificará cambios significativos por email o en la plataforma</li>
              <li>El uso continuado tras notificación implica aceptación</li>
              <li>Cambios menores pueden implementarse sin notificación previa</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">15. Soporte Técnico</h2>
            <p className="text-gray-700 mb-4">
              HabiBook proporciona soporte técnico:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Por correo electrónico: info@habibook.com</li>
              <li>Tiempo de respuesta: dentro de 48 horas hábiles</li>
              <li>Disponible para usuarios de planes pagados</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">16. Leyes Aplicables y Jurisdicción</h2>
            <p className="text-gray-700 mb-4">
              Estos términos se rigen por la ley española, específicamente por la legislación vigente en las Islas Canarias. Cualquier disputa será resuelta ante los tribunales competentes de Tenerife.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">17. Resolución de Conflictos</h2>
            <p className="text-gray-700 mb-4">
              Ante cualquier controversia:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
              <li>Intente resolver el conflicto directamente con HabiBook por email</li>
              <li>Si no se resuelve en 30 días, puede solicitar mediación</li>
              <li>Como último recurso, puede acudir a los tribunales competentes</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">18. Divisibilidad</h2>
            <p className="text-gray-700 mb-4">
              Si alguna disposición de estos términos es inválida o no ejecutable, las demás disposiciones permanecerán en pleno efecto, y se realizarán ajustes mínimos para hacer válida la disposición problemática.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">19. Contacto</h2>
            <p className="text-gray-700 mb-4">
              Para consultas sobre estos términos:
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Email:</strong> info@habibook.com<br />
              <strong>Ubicación:</strong> Tenerife, Islas Canarias, España
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
