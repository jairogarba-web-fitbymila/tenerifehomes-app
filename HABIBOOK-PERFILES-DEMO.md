# HabiBook — Perfiles Demo en Base de Datos

## OBJETIVO
Crear 6 agentes demo REALES en la base de datos de Supabase con datos completos y realistas — propiedades con fotos, hero configurado, testimonios, servicios, zonas, secciones activas, y equipo (para plantillas corporate). Cada demo debe funcionar como una web real accesible via subdominio (demo-luxury.habibook.com, etc.) o slug (/agent/victoria-laurent).

## CONTEXTO
- Ya existe `src/lib/demo-data.ts` con datos de las 6 personas ficticias — usarlo como BASE
- Ya existe la ruta `/demos/[template]` que muestra demos con datos hardcodeados
- Lo que falta es que estos demos estén EN SUPABASE como agentes reales con todos sus datos
- Supabase project ID: lsrnbgfiftcslqccowfz
- Las tablas relevantes: agent_profiles, hero_config, agent_sections, properties, testimonials, services, zones, team_members

## DECISIONES DE PRODUCTO
1. Los demos son agentes reales en la BD, no datos hardcodeados
2. Cada demo tiene datos completos y creíbles — propiedades con fotos reales de Unsplash, testimonios de clientes inventados pero creíbles, servicios profesionales, zonas de Tenerife reales
3. Los demos deben marcar is_demo = true (o tener un flag) para que no aparezcan en el buscador público como agentes reales
4. Cada demo debe tener su slug funcional: victoria-laurent, antonio-reyes, tenerife-prime, maison-tenerife, roberto-fernandez, island-properties

## INSTRUCCIONES

### PASO 1 — Añadir campo is_demo a agent_profiles
```sql
ALTER TABLE public.agent_profiles ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT FALSE;
COMMENT ON COLUMN public.agent_profiles.is_demo IS 'Flag para perfiles de demostración. Los demos no aparecen en búsquedas públicas.';
```
Después regenera los tipos:
```bash
mkdir -p src/types && npx supabase gen types typescript --project-id lsrnbgfiftcslqccowfz > src/types/database.ts
```

### PASO 2 — Crear script de seed
Crear `scripts/seed-demos.ts` (o .mjs) que se ejecute con Node y cargue los 6 perfiles demo en Supabase. El script debe:

1. Conectar a Supabase usando la service_role key del .env.local (SUPABASE_SERVICE_ROLE_KEY)
2. Para CADA uno de los 6 demos:
   a. Crear/upsert el agent_profile con is_demo = true
   b. Crear/upsert el hero_config
   c. Crear las secciones activas (agent_sections)
   d. Crear las propiedades (6-8 por agente)
   e. Crear testimonios (3-5 por agente)
   f. Crear servicios (4-6 por agente)
   g. Crear zonas (3-4 por agente)
   h. Crear team_members (solo para corporate, boutique, network)

3. Usar UPSERT para que el script sea idempotente (ejecutable múltiples veces sin duplicar)

### PASO 3 — Datos de los 6 demos
Usar los datos de `src/lib/demo-data.ts` como base y AMPLIAR con lo que falta.

**DEMO 1: Luxury — Victoria Laurent**
- Slug: victoria-laurent
- Template: luxury
- Datos del agente: Ya en demo-data.ts
- Propiedades: Ya tiene 6. Todas de venta, precios entre 890K-4.5M€
- Testimonios a crear:
  - "Victoria encontró nuestra villa soñada en Abama en apenas 2 semanas. Su conocimiento del mercado de lujo es excepcional." — Pierre & Marie Dupont, Francia, 5★
  - "Profesionalismo discreto y eficaz. Vendió nuestra propiedad por encima del precio pedido." — James & Sarah Miller, UK, 5★
  - "Service exceptionnel. Victoria parle couramment français et comprend parfaitement les besoins des acheteurs internationaux." — Laurent Beaumont, Monaco, 5★
- Servicios: Búsqueda exclusiva de propiedades, Asesoramiento en inversión premium, Gestión integral de compraventa, Servicio post-venta VIP
- Zonas: Costa Adeje, Abama (Guía de Isora), La Caleta, Bahía del Duque

**DEMO 2: Mediterranean — Antonio Reyes**
- Slug: antonio-reyes
- Template: mediterranean
- Datos del agente: Ya en demo-data.ts
- Propiedades: Ya tiene 6 (incluye alquileres)
- Testimonios a crear:
  - "Antonio nos guió en cada paso. Compramos nuestro primer piso en Tenerife gracias a su paciencia y honestidad." — Michael & Anna Weber, Alemania, 5★
  - "15 años en el mercado se notan. Conoce cada calle de Los Cristianos." — Carmen Rodríguez, España, 5★
  - "Very trustworthy agent. He found us the perfect apartment within our budget." — David Thompson, UK, 4★
- Servicios: Compraventa residencial, Alquileres vacacionales y larga temporada, Asesoramiento hipotecario, Gestión de reformas
- Zonas: Los Cristianos, Arona, Adeje, Playa de las Américas

**DEMO 3: Corporate — Tenerife Prime Real Estate**
- Slug: tenerife-prime
- Template: corporate
- Datos del agente: Ya en demo-data.ts
- Propiedades: Ya tiene propiedades. Ampliar a 8 variadas (oficinas, pisos, villas)
- Equipo: 4-6 miembros con nombres, roles, fotos de Unsplash, idiomas
  - Carlos Méndez (Director, ES/EN/DE), Elena Volkov (Agente Senior, ES/RU/EN), Thomas Becker (Agente Internacional, DE/EN/ES), María García (Coordinadora, ES/EN/FR)
- Testimonios: 4 de clientes corporativos/inversores
- Servicios: Inversión inmobiliaria, Gestión de carteras, Asesoramiento fiscal no residentes, Relocation services, Gestión de alquileres
- Zonas: Costa Adeje, Santa Cruz, La Orotava, Puerto de la Cruz

**DEMO 4: Boutique — Maison Tenerife**
- Slug: maison-tenerife
- Template: boutique
- Datos del agente: Ya en demo-data.ts
- Propiedades: 6-8 propiedades selectas, mix venta + alquiler vacacional
- Equipo: 3 personas (pareja fundadora + asistente)
  - Sophie Martín (Co-fundadora, FR/ES/EN), Alejandro Ruiz (Co-fundador, ES/FR/EN), Claire Petit (Asistente, FR/EN)
- Testimonios: 3 testimonios muy personales
- Servicios: Selección curada de propiedades, Acompañamiento personalizado, Decoración y staging, Gestión de alquiler vacacional
- Zonas: Guía de Isora, Alcalá, San Juan, Playa San Juan

**DEMO 5: Classic — Roberto Fernández**
- Slug: roberto-fernandez
- Template: classic
- Datos del agente: Ya en demo-data.ts
- Propiedades: 6-8 propiedades (zona norte, más clásicas — fincas, casas canarias)
- Testimonios: 4 de clientes de larga data
  - "Roberto vendió la casa de mis padres y 15 años después me ayudó a comprar la mía." etc.
- Servicios: Compraventa de inmuebles, Valoraciones profesionales, Herencias y sucesiones, Gestión de fincas rústicas
- Zonas: La Laguna, Santa Cruz, La Orotava, Tacoronte

**DEMO 6: Network — Island Properties Group**
- Slug: island-properties
- Template: network (corporate-network en el code)
- Datos del agente: Ya en demo-data.ts
- Propiedades: 10-12 propiedades variadas, incluyendo alquileres
- Equipo: 6 personas con fotos y roles
- Testimonios: 5 variados
- Servicios: Compraventa residencial y comercial, Alquileres vacacionales, Property management, Inversión extranjera, Asesoramiento legal y fiscal, Mudanzas y relocation
- Zonas: Sur (Costa Adeje, Arona, Granadilla), Norte (Puerto de la Cruz, La Orotava), Metro (Santa Cruz, La Laguna)

### PASO 4 — Secciones activas por demo
Cada demo debe tener agent_sections creados con las secciones apropiadas activadas:

Todas las demos: nav, hero, properties_sale, about, services, testimonials, contact_form, footer
Demos con alquileres (mediterranean, boutique, network): + properties_rent_vacation, properties_rent_long
Demos con equipo (corporate, boutique, network): + team
Demos con zonas (todas): + zones
Classic: + stats (premios y reconocimientos)

### PASO 5 — Excluir demos del buscador público
Modificar la query de `/search` y `/api/search` (si existe) para filtrar `is_demo = false` o `is_demo IS NULL`.
Modificar el sitemap.ts para excluir agentes demo.
Los demos SÍ deben ser accesibles via su slug directo (/agent/victoria-laurent) para poder mostrarlos.

### PASO 6 — Actualizar página /demos
La página `/demos` ya existe. Actualizarla para que en vez de usar datos hardcodeados de demo-data.ts, muestre links directos a los perfiles REALES de los demos en /agent/{slug}.
Así el visitante ve demos con datos de la BD real, no datos estáticos.
Mantener la página de `/demos/[template]` como fallback con los datos de demo-data.ts por si los datos de Supabase no están disponibles.

### PASO 7 — Ejecutar el script de seed
```bash
npx tsx scripts/seed-demos.ts
```
O si no funciona tsx:
```bash
node --loader ts-node/esm scripts/seed-demos.ts
```
Verificar que los 6 demos se crearon correctamente consultando la BD.

### PASO 8 — Verificar
```bash
npx tsc --noEmit
npm run build
```
Build DEBE pasar sin errores.

### PASO 9 — Commit
```bash
git add -A
git commit -m "feat: add 6 realistic demo agent profiles with full data in Supabase"
```

## FOTOS DE UNSPLASH PARA PROPIEDADES Y PERSONAS
Usar URLs directas de Unsplash (ya se usan en demo-data.ts). Formato: https://images.unsplash.com/photo-XXXXX?w=800

Para personas del equipo, usar fotos profesionales variadas (hombres, mujeres, diversidad de edades y etnias):
- https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400 (mujer profesional)
- https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400 (hombre traje)
- https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400 (hombre casual)
- https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400 (mujer sonriente)
- https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400 (hombre negocios)
- https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400 (mujer joven)

Para propiedades, usar fotos reales de casas/villas/pisos variados.

## LO QUE NO DEBES HACER
- NO modifiques el TemplateRenderer ni las plantillas
- NO cambies la estructura de las APIs
- NO uses datos falsos obvios (Lorem ipsum, test, etc.) — todo debe parecer REAL
- NO uses `as any` ni `@ts-ignore`
- NO crees usuarios auth para los demos — solo registros en agent_profiles (sin user_id real)

## CRITERIO DE ÉXITO
1. 6 agentes demo accesibles via /agent/{slug}
2. Cada demo tiene propiedades, testimonios, servicios, zonas, hero y secciones
3. Los demos NO aparecen en búsquedas públicas
4. La página /demos muestra links a los perfiles reales
5. `npm run build` = SUCCESS
6. Los datos son creíbles y profesionales
