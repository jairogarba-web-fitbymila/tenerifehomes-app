# HabiBook — Multiidioma Completo

## OBJETIVO
Implementar soporte multiidioma real en HabiBook: interfaz traducida + contenido del agente traducido automáticamente con IA. Detección automática del idioma del visitante + selector manual. ES + EN gratis para todos, resto de idiomas como módulo premium.

## CONTEXTO DEL PROYECTO
- Next.js 14.2.20 App Router + Supabase SSR + Tailwind
- Supabase project ID: lsrnbgfiftcslqccowfz
- ignoreBuildErrors: false — el build DEBE pasar limpio
- La página /agent/[slug] es ahora un server component (refactorizado en el paso de SEO)
- Ya existe: tabla translation_queue, API básica en /api/modules/multiidioma/, module-engine.ts con getEnabledLanguages()
- Ya existe: diccionario de 12 keys UI traducidas y 10 property features
- NO existe: framework i18n, selector de idioma, traducción con IA, almacenamiento de traducciones de contenido

## DECISIONES DE PRODUCTO (cerradas, NO cambiar)
1. **Idiomas:** 10 — ES, EN, DE, FR, IT, PT, NL, RU, SV, NO
2. **Gratis:** ES + EN para todos los agentes
3. **Premium:** DE, FR, IT, PT, NL, RU, SV, NO — requiere módulo multiidioma activo
4. **Detección:** Automática por Accept-Language del navegador + selector manual con banderas
5. **Traducción IA:** OpenAI GPT-4o-mini (asíncrono, al guardar contenido)
6. **Almacenamiento:** Traducciones en tabla dedicada (no columnas por idioma)
7. **UI del selector:** Dropdown con banderas en el nav de la web del agente

## ARQUITECTURA

### Almacenamiento de traducciones
Usar una tabla genérica `content_translations` para TODO el contenido traducido:

```sql
CREATE TABLE IF NOT EXISTS public.content_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES public.agent_profiles(id) ON DELETE CASCADE,
  source_table TEXT NOT NULL,        -- 'agent_profiles', 'properties', 'services', 'testimonials', 'zones', 'hero_config'
  source_id UUID NOT NULL,           -- ID del registro original
  source_field TEXT NOT NULL,         -- 'bio', 'title', 'description', 'quote', etc.
  source_language TEXT NOT NULL DEFAULT 'es',
  target_language TEXT NOT NULL,      -- 'en', 'de', 'fr', etc.
  translated_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed', -- 'pending', 'processing', 'completed', 'error'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(source_table, source_id, source_field, target_language)
);

-- Índices para queries rápidas
CREATE INDEX IF NOT EXISTS idx_translations_lookup
  ON public.content_translations(agent_id, source_table, source_id, target_language);
CREATE INDEX IF NOT EXISTS idx_translations_pending
  ON public.content_translations(status) WHERE status = 'pending';

-- RLS
ALTER TABLE public.content_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents can read own translations" ON public.content_translations
  FOR SELECT USING (agent_id = auth.uid() OR true); -- Public read for website visitors

CREATE POLICY "Agents can manage own translations" ON public.content_translations
  FOR ALL USING (agent_id = auth.uid());
```

### Diccionario de UI (interfaz estática)
Crear archivo `src/lib/i18n/translations.ts` con TODAS las strings de UI de las plantillas:

```typescript
export const UI_TRANSLATIONS: Record<string, Record<string, string>> = {
  es: {
    'nav.home': 'Inicio',
    'nav.properties': 'Propiedades',
    'nav.services': 'Servicios',
    'nav.about': 'Sobre nosotros',
    'nav.contact': 'Contacto',
    'nav.team': 'Equipo',
    'properties.for_sale': 'En venta',
    'properties.for_rent': 'En alquiler',
    'properties.rent_vacation': 'Alquiler vacacional',
    'properties.rent_long': 'Larga temporada',
    'properties.bedrooms': 'Habitaciones',
    'properties.bathrooms': 'Baños',
    'properties.area': 'Superficie',
    'properties.price': 'Precio',
    'properties.featured': 'Propiedades destacadas',
    'properties.view_all': 'Ver todas las propiedades',
    'properties.details': 'Ver detalles',
    'properties.new': 'Nueva',
    'properties.exclusive': 'Exclusiva',
    'properties.reduced': 'Rebajada',
    'contact.title': 'Contacto',
    'contact.name': 'Nombre',
    'contact.email': 'Email',
    'contact.phone': 'Teléfono',
    'contact.message': 'Mensaje',
    'contact.send': 'Enviar mensaje',
    'contact.schedule': 'Agendar visita',
    'contact.whatsapp': 'Contactar por WhatsApp',
    'about.title': 'Sobre mí',
    'about.experience': 'años de experiencia',
    'about.languages': 'Idiomas',
    'services.title': 'Servicios',
    'testimonials.title': 'Testimonios',
    'team.title': 'Nuestro equipo',
    'zones.title': 'Zonas',
    'footer.powered_by': 'Powered by',
    'footer.rights': 'Todos los derechos reservados',
    'search.placeholder': 'Buscar propiedades...',
    'search.filters': 'Filtros',
    'search.results': 'resultados',
    'valuation.title': 'Valoración gratuita',
    'valuation.cta': 'Solicitar valoración',
  },
  en: {
    'nav.home': 'Home',
    'nav.properties': 'Properties',
    'nav.services': 'Services',
    'nav.about': 'About us',
    'nav.contact': 'Contact',
    'nav.team': 'Team',
    'properties.for_sale': 'For sale',
    'properties.for_rent': 'For rent',
    'properties.rent_vacation': 'Holiday rental',
    'properties.rent_long': 'Long term',
    'properties.bedrooms': 'Bedrooms',
    'properties.bathrooms': 'Bathrooms',
    'properties.area': 'Area',
    'properties.price': 'Price',
    'properties.featured': 'Featured properties',
    'properties.view_all': 'View all properties',
    'properties.details': 'View details',
    'properties.new': 'New',
    'properties.exclusive': 'Exclusive',
    'properties.reduced': 'Reduced',
    'contact.title': 'Contact',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.message': 'Message',
    'contact.send': 'Send message',
    'contact.schedule': 'Schedule visit',
    'contact.whatsapp': 'Contact via WhatsApp',
    'about.title': 'About me',
    'about.experience': 'years of experience',
    'about.languages': 'Languages',
    'services.title': 'Services',
    'testimonials.title': 'Testimonials',
    'team.title': 'Our team',
    'zones.title': 'Zones',
    'footer.powered_by': 'Powered by',
    'footer.rights': 'All rights reserved',
    'search.placeholder': 'Search properties...',
    'search.filters': 'Filters',
    'search.results': 'results',
    'valuation.title': 'Free valuation',
    'valuation.cta': 'Request valuation',
  },
  de: {
    'nav.home': 'Startseite',
    'nav.properties': 'Immobilien',
    'nav.services': 'Dienstleistungen',
    'nav.about': 'Über uns',
    'nav.contact': 'Kontakt',
    'nav.team': 'Team',
    'properties.for_sale': 'Zum Verkauf',
    'properties.for_rent': 'Zur Miete',
    'properties.rent_vacation': 'Ferienvermietung',
    'properties.rent_long': 'Langzeitmiete',
    'properties.bedrooms': 'Schlafzimmer',
    'properties.bathrooms': 'Badezimmer',
    'properties.area': 'Fläche',
    'properties.price': 'Preis',
    'properties.featured': 'Ausgewählte Immobilien',
    'properties.view_all': 'Alle Immobilien ansehen',
    'properties.details': 'Details ansehen',
    'properties.new': 'Neu',
    'properties.exclusive': 'Exklusiv',
    'properties.reduced': 'Reduziert',
    'contact.title': 'Kontakt',
    'contact.name': 'Name',
    'contact.email': 'E-Mail',
    'contact.phone': 'Telefon',
    'contact.message': 'Nachricht',
    'contact.send': 'Nachricht senden',
    'contact.schedule': 'Besichtigung vereinbaren',
    'contact.whatsapp': 'Per WhatsApp kontaktieren',
    'about.title': 'Über mich',
    'about.experience': 'Jahre Erfahrung',
    'about.languages': 'Sprachen',
    'services.title': 'Dienstleistungen',
    'testimonials.title': 'Bewertungen',
    'team.title': 'Unser Team',
    'zones.title': 'Gebiete',
    'footer.powered_by': 'Powered by',
    'footer.rights': 'Alle Rechte vorbehalten',
    'search.placeholder': 'Immobilien suchen...',
    'search.filters': 'Filter',
    'search.results': 'Ergebnisse',
    'valuation.title': 'Kostenlose Bewertung',
    'valuation.cta': 'Bewertung anfordern',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.properties': 'Propriétés',
    'nav.services': 'Services',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.team': 'Équipe',
    'properties.for_sale': 'À vendre',
    'properties.for_rent': 'À louer',
    'properties.rent_vacation': 'Location vacances',
    'properties.rent_long': 'Location longue durée',
    'properties.bedrooms': 'Chambres',
    'properties.bathrooms': 'Salles de bain',
    'properties.area': 'Surface',
    'properties.price': 'Prix',
    'properties.featured': 'Propriétés en vedette',
    'properties.view_all': 'Voir toutes les propriétés',
    'properties.details': 'Voir les détails',
    'properties.new': 'Nouveau',
    'properties.exclusive': 'Exclusif',
    'properties.reduced': 'Réduit',
    'contact.title': 'Contact',
    'contact.name': 'Nom',
    'contact.email': 'Email',
    'contact.phone': 'Téléphone',
    'contact.message': 'Message',
    'contact.send': 'Envoyer le message',
    'contact.schedule': 'Planifier une visite',
    'contact.whatsapp': 'Contacter par WhatsApp',
    'about.title': 'À propos de moi',
    'about.experience': "ans d'expérience",
    'about.languages': 'Langues',
    'services.title': 'Services',
    'testimonials.title': 'Témoignages',
    'team.title': 'Notre équipe',
    'zones.title': 'Zones',
    'footer.powered_by': 'Powered by',
    'footer.rights': 'Tous droits réservés',
    'search.placeholder': 'Rechercher des propriétés...',
    'search.filters': 'Filtres',
    'search.results': 'résultats',
    'valuation.title': 'Estimation gratuite',
    'valuation.cta': 'Demander une estimation',
  },
};

// Para IT, PT, NL, RU, SV, NO: generar con OpenAI en el primer deploy o hardcodear.
// Por ahora, fallback a inglés si no existe la traducción.

export const SUPPORTED_LANGUAGES = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
] as const;

export const FREE_LANGUAGES = ['es', 'en'];

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

export function t(key: string, lang: string): string {
  return UI_TRANSLATIONS[lang]?.[key] || UI_TRANSLATIONS['en']?.[key] || UI_TRANSLATIONS['es']?.[key] || key;
}
```

## INSTRUCCIONES PASO A PASO

### PASO 1 — Crear tabla content_translations en Supabase
Ejecuta el SQL del bloque de arriba (CREATE TABLE content_translations + índices + RLS).
Usa la Supabase CLI o el Management API. Después regenera los tipos:
```bash
mkdir -p src/types && npx supabase gen types typescript --project-id lsrnbgfiftcslqccowfz > src/types/database.ts
```

### PASO 2 — Crear sistema de i18n local
Crear `src/lib/i18n/translations.ts` con el contenido descrito arriba (UI_TRANSLATIONS, SUPPORTED_LANGUAGES, FREE_LANGUAGES, t() function).

Crear `src/lib/i18n/index.ts` que re-exporte todo:
```typescript
export { UI_TRANSLATIONS, SUPPORTED_LANGUAGES, FREE_LANGUAGES, t } from './translations';
export type { LanguageCode } from './translations';
```

### PASO 3 — Crear API de traducción con OpenAI
Crear `src/app/api/translate/route.ts`:

```typescript
// POST: Traduce contenido del agente con OpenAI GPT-4o-mini
// Body: { agent_id, source_table, source_id, source_field, source_text, source_language, target_languages: string[] }
//
// Flujo:
// 1. Verificar que el agente tiene permiso para los idiomas solicitados (ES+EN gratis, resto requiere módulo multiidioma)
// 2. Crear registros en content_translations con status 'pending'
// 3. Llamar a OpenAI para traducir el texto a cada idioma target
// 4. Actualizar registros con el texto traducido y status 'completed'
// 5. Si falla, marcar status 'error' con error_message
//
// Prompt de OpenAI:
// "You are a professional real estate translator. Translate the following text from {source_language} to {target_language}.
//  The text is from a real estate agent's website in Tenerife, Spain.
//  Keep the tone professional and maintain any proper nouns, addresses, and technical real estate terms.
//  Only return the translated text, nothing else."
//
// Usar gpt-4o-mini para bajo coste.
// La API key de OpenAI debe estar en process.env.OPENAI_API_KEY
```

IMPORTANTE: Si no existe OPENAI_API_KEY en las variables de entorno, el endpoint debe devolver un error claro diciendo que falta la key, NO fallar silenciosamente.

### PASO 4 — Hook de traducción automática al guardar
Modificar las APIs de guardado existentes para que al guardar contenido, se encolen traducciones automáticamente:

**APIs a modificar:**
- `PUT /api/dashboard/hero` — al guardar headline, subtitle, cta_text → traducir
- `PUT /api/dashboard/profile` — al guardar bio, quote → traducir
- `POST/PUT` de testimonials, services, zones — al guardar → traducir campos de texto

**Patrón:**
Después de guardar exitosamente en la tabla principal, hacer un fetch interno a `/api/translate` con los campos que cambiaron. NO bloquear la respuesta al agente — usar un `fetch` sin await o un `Promise.resolve().then(...)` para que la traducción sea async.

```typescript
// Ejemplo en PUT /api/dashboard/hero
// Después de guardar en hero_config:
const fieldsToTranslate = ['headline', 'subtitle', 'cta_text'];
// Fire and forget — no bloquear respuesta
void fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/translate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    agent_id: agentId,
    source_table: 'hero_config',
    source_id: heroId,
    fields: fieldsToTranslate.map(f => ({ field: f, text: heroData[f] })),
    source_language: 'es',
    target_languages: enabledLanguages.filter(l => l !== 'es'),
  }),
});
```

### PASO 5 — API para obtener traducciones
Crear `src/app/api/translations/[agent_id]/route.ts`:

```typescript
// GET: Obtener todas las traducciones de un agente para un idioma
// Query params: ?lang=en
// Devuelve un objeto organizado por tabla y campo:
// {
//   hero_config: { [heroId]: { headline: "...", subtitle: "...", cta_text: "..." } },
//   agent_profiles: { [agentId]: { bio: "...", quote: "..." } },
//   properties: { [propId]: { title: "...", description: "..." }, ... },
//   services: { [serviceId]: { title: "...", description: "..." }, ... },
//   testimonials: { [testId]: { quote: "..." }, ... },
//   zones: { [zoneId]: { name: "...", description: "..." }, ... },
// }
```

### PASO 6 — Componente LanguageSelector
Crear `src/components/LanguageSelector.tsx`:
- Client component
- Dropdown con banderas y nombre del idioma
- Muestra solo los idiomas disponibles para ese agente (ES+EN siempre, premium si tiene módulo)
- Al cambiar idioma:
  - Guarda la preferencia en localStorage (key: `habibook_lang`)
  - Añade ?lang=XX al URL (para compartir links en un idioma)
  - Dispara un evento/callback para que el parent recargue traducciones

### PASO 7 — Detección automática de idioma
En el server component de `/agent/[slug]/page.tsx`:
1. Leer el query param `?lang=XX` — si existe, usar ese idioma
2. Si no hay query param, leer el header `Accept-Language` del request
3. Mapear el idioma detectado a uno de los 10 soportados
4. Si el idioma detectado no está disponible para ese agente (es premium y no tiene módulo), fallback a 'es'
5. Pasar el idioma resuelto al client component

```typescript
import { headers } from 'next/headers';

function detectLanguage(searchParams: { lang?: string }, agentLanguages: string[]): string {
  // 1. Query param explícito
  if (searchParams.lang && agentLanguages.includes(searchParams.lang)) {
    return searchParams.lang;
  }

  // 2. Accept-Language header
  const headersList = headers();
  const acceptLang = headersList.get('accept-language') || '';
  const browserLangs = acceptLang.split(',').map(l => l.split(';')[0].trim().slice(0, 2));

  for (const lang of browserLangs) {
    if (agentLanguages.includes(lang)) return lang;
  }

  // 3. Fallback
  return 'es';
}
```

### PASO 8 — Integrar traducciones en el TemplateRenderer
El AgentPageClient.tsx debe:
1. Recibir `lang` y `translations` como props (además de `data`)
2. Pasar `lang` y `translations` al TemplateRenderer
3. En el TemplateRenderer, usar `t(key, lang)` para textos de UI
4. Para contenido del agente, buscar en el objeto `translations` por tabla/id/campo
5. Si no hay traducción disponible, mostrar el texto original (español)

**Crear helper:**
```typescript
// src/lib/i18n/content.ts
export function getTranslatedContent(
  translations: TranslationsMap | null,
  table: string,
  id: string,
  field: string,
  original: string
): string {
  return translations?.[table]?.[id]?.[field] || original;
}
```

### PASO 9 — Integrar el LanguageSelector en las plantillas
Añadir el `<LanguageSelector>` en la barra de navegación de CADA plantilla dentro del TemplateRenderer.
Posición: a la derecha del nav, antes de los links o al final.
Solo mostrar si el agente tiene más de 1 idioma disponible.

### PASO 10 — Actualizar module-engine.ts
Actualizar la función `getEnabledLanguages` para reflejar el modelo ES+EN gratis:

```typescript
export function getEnabledLanguages(modules: ActiveModule[]): string[] {
  const freeLanguages = ['es', 'en'];
  if (hasModule(modules, MODULE.MULTIIDIOMA)) {
    return ['es', 'en', 'de', 'fr', 'it', 'pt', 'nl', 'ru', 'sv', 'no'];
  }
  return freeLanguages;
}
```

### PASO 11 — Dashboard: panel de gestión de traducciones
Actualizar `/dashboard/modules/multiidioma/page.tsx` para mostrar:
- Estado de las traducciones por idioma (cuántas completadas, pendientes, con error)
- Botón "Retraducir todo" que re-encola todas las traducciones
- Vista previa del contenido traducido
- Indicador visual de qué idiomas están activos

### PASO 12 — Instalar dependencia de OpenAI
```bash
npm install openai
```

### PASO 13 — Verificación
```bash
npx tsc --noEmit
npx next lint
npm run build
```
Los tres DEBEN pasar sin errores.

### PASO 14 — Commit
```bash
git add -A
git commit -m "feat(i18n): implement full multilingual system - auto-detection, OpenAI translation, language selector, ES+EN free"
```

## VARIABLE DE ENTORNO NECESARIA
La API key de OpenAI debe estar configurada:
```
OPENAI_API_KEY=sk-...
```
Si no está configurada, el sistema de traducción no funcionará pero el resto de la app sigue funcionando. El endpoint /api/translate debe devolver error 500 con mensaje "OPENAI_API_KEY not configured".

## LO QUE NO DEBES HACER
- NO instales next-intl, next-i18next ni ningún framework de i18n pesado — usamos solución propia ligera
- NO cambies la estructura de URLs (no añadas /[locale]/ a las rutas)
- NO modifiques la lógica visual de las plantillas más allá de añadir el LanguageSelector y usar las funciones de traducción
- NO crees columnas por idioma en las tablas existentes (title_en, title_de, etc.) — todo va en content_translations
- NO bloquees las respuestas de las APIs de guardado esperando a que la traducción termine
- NO uses `as any` ni `@ts-ignore`
- NO hardcodees la API key de OpenAI — usa process.env.OPENAI_API_KEY

## CRITERIO DE ÉXITO
1. `npm run build` = SUCCESS
2. La web del agente detecta automáticamente el idioma del visitante
3. Hay un selector de idioma con banderas en el nav
4. Los textos de UI (botones, labels) se muestran en el idioma seleccionado
5. Al guardar contenido, se encolan traducciones automáticamente
6. Las traducciones aparecen en content_translations con status 'completed'
7. El contenido traducido se muestra al visitante en su idioma
8. ES + EN funcionan para todos los agentes
9. Los demás idiomas solo funcionan si el agente tiene módulo multiidioma activo
10. Si falta OPENAI_API_KEY, el sistema degrada gracefully (muestra contenido original)
