'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="font-bold text-lg mb-2">TenerifeHomes</h3>
            <p className="text-gray-400 text-sm">
              Plataforma inmobiliaria integral para agentes y agencias en Canarias
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wide mb-4 text-gray-300">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/legal/aviso-legal" className="text-gray-400 hover:text-white transition">
                  Aviso Legal
                </Link>
              </li>
              <li>
                <Link href="/legal/privacidad" className="text-gray-400 hover:text-white transition">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="text-gray-400 hover:text-white transition">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link href="/legal/terminos" className="text-gray-400 hover:text-white transition">
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wide mb-4 text-gray-300">
              Contacto
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">
                <a href="mailto:info@tenerifehomes.com" className="hover:text-white transition">
                  info@tenerifehomes.com
                </a>
              </li>
              <li className="text-gray-400">Tenerife, Islas Canarias</li>
            </ul>
          </div>

          {/* Spacer for layout */}
          <div />
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-gray-400 text-sm">
            © 2026 TenerifeHomes. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
