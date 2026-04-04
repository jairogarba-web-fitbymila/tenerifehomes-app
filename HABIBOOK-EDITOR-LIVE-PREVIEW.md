# HabiBook — Editor con Live Preview

## OBJETIVO
Rediseñar la página del editor de website (`/dashboard/website`) para que tenga un layout split-screen con live preview en tiempo real. El agente edita a la izquierda y ve su web actualizarse instantáneamente a la derecha, sin necesidad de guardar ni abrir otra pestaña.

## MOCKUP DE REFERENCIA
Abrir el archivo `mockup-editor-live-preview.html` en la raíz del proyecto. Este HTML muestra exactamente el layout, la interacción y el comportamiento esperado. Úsalo como guía visual absoluta.

## ARQUITECTURA ACTUAL (no romper)
- Editor principal: `src/app/(dashboard)/dashboard/website/page.tsx`
- Sub-editors: `testimonials/page.tsx`, `services/page.tsx`, `zones/page.tsx`
- Template renderer: `src/components/templates/TemplateRenderer.tsx` (491 líneas, 6 plantillas)
- Tipos: `src/components/templates/types.ts` (TemplateData, TemplateAgent, TemplateProperty, TEMPLATE_LIST)
- APIs: `/api/dashboard/hero`, `/api/dashboard/sections`, `/api/dashboard/profile`, `/api/dashboard/upload`
- API pública: `/api/agent/[slug]` — agrega todos los datos del agente para renderizar
- Demo data: `src/lib/demo-data.ts`
- DB tables: `agent_profiles`, `hero_config`, `agent_sections`, `testimonials`, `services`, `zones`, `properties`, `team_members`

## QUÉ CONSTRUIR

### 1. Layout split-screen en `/dashboard/website/page.tsx`
Reemplazar el layout actual por un split-screen:
- **Panel izquierdo (420px fijo):** Editor con 3 pestañas
- **Panel derecho (flex):** Live preview con TemplateRenderer

### 2. Tres pestañas en el panel izquierdo

**Pestaña "Diseño":**
- Selector de plantilla (grid 3 columnas con swatches de color de cada plantilla)
- Selector de paleta de colores (círculos clicables)
- Al cambiar plantilla o paleta, el preview se actualiza instantáneamente

**Pestaña "Contenido":**
- Hero: imagen de fondo (upload drag-drop), titular (input, max 100), subtítulo (textarea, max 200), texto CTA (input, max 50)
- Sobre mí: foto de perfil (upload), nombre/empresa (input), biografía (textarea)
- Contadores de caracteres en cada campo
- Cada campo actualiza el preview en tiempo real mientras se escribe (onChange, no onBlur)

**Pestaña "Secciones":**
- Lista de todas las secciones con toggle on/off
- Icono de drag handle (⠿) para reordenar (si el drag-and-drop es complejo, dejarlo visual pero sin funcionalidad de arrastre por ahora — priorizar los toggles)
- Enlace "Editar →" en secciones que tienen sub-editor (testimonios, servicios, zonas)
- Al activar/desactivar una sección, el preview muestra/oculta esa sección instantáneamente

### 3. Live preview con TemplateRenderer
- Usar el componente `TemplateRenderer` existente en el panel derecho
- Alimentarlo con un objeto `TemplateData` construido desde el estado local del formulario (NO desde la API)
- Los datos que el agente aún no ha editado se cargan inicialmente desde la API (`/api/agent/[slug]`)
- Cada cambio en cualquier campo del editor actualiza el estado → React re-renderiza el TemplateRenderer → el agente ve el cambio al instante

### 4. Barra de herramientas del preview
- Label "Vista previa en vivo"
- Botones Desktop / Tablet / Móvil que cambian el max-width del contenedor del preview:
  - Desktop: 100%
  - Tablet: 768px
  - Móvil: 390px
- Botón "Pantalla completa" que abre el preview en un modal fullscreen

### 5. Barra superior
- Logo HabiBook + breadcrumb "/ Dashboard / Editor de Sitio Web"
- Indicador de estado: "Guardado" (verde) / "Sin guardar" (amarillo) / "Guardando..." (gris)
- Botón "Ver web pública" → abre `/agent/{slug}` en nueva pestaña
- Botón "Guardar cambios" → guarda todos los datos modificados en batch (hero + profile + sections)

### 6. Auto-guardado y feedback
- Tracking de cambios: comparar estado actual vs estado cargado de la API
- Mostrar indicador "Sin guardar" cuando hay cambios pendientes
- Al hacer clic en "Guardar cambios": guardar todo en paralelo (Promise.all de las APIs necesarias)
- Después de guardar: mostrar "Guardado ✓" durante 2 segundos
- Si el usuario intenta salir con cambios sin guardar, mostrar confirmación

## ESPECIFICACIONES TÉCNICAS

### Estado del componente
```typescript
interface EditorState {
  // Pestaña activa
  activeTab: 'design' | 'content' | 'sections';

  // Datos del agente (cargados de API al montar)
  agent: TemplateAgent;

  // Hero
  hero: {
    headline: string;
    subtitle: string;
    cta_text: string;
    background_image_url: string;
    overlay_opacity: number;
  };

  // Secciones
  sections: Array<{
    section_key: string;
    is_active: boolean;
    display_order: number;
    custom_title: string;
  }>;

  // Propiedades (read-only en el editor, se gestionan en /dashboard/properties)
  properties: TemplateProperty[];

  // Testimonios, servicios, zonas (read-only aquí, se editan en sub-páginas)
  testimonials: any[];
  services: any[];
  zones: any[];
  team: any[];

  // UI
  previewDevice: 'desktop' | 'tablet' | 'mobile';
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
}
```

### Construcción del TemplateData para el preview
```typescript
// Construir el objeto TemplateData desde el estado del editor
function buildPreviewData(state: EditorState): TemplateData {
  return {
    agent: state.agent,
    hero: state.hero,
    properties: state.properties,
    testimonials: state.testimonials,
    services: state.services,
    zones: state.zones,
    team: state.team,
    sections: state.sections.filter(s => s.is_active),
  };
}
```

### Carga inicial de datos
Al montar el componente:
1. Obtener el slug del agente autenticado
2. Llamar a `/api/agent/[slug]` para obtener todos los datos
3. Popular el estado del editor con estos datos
4. El preview se renderiza inmediatamente con los datos actuales

### Guardado
Al hacer clic en "Guardar cambios":
```typescript
async function handleSave() {
  setIsSaving(true);
  await Promise.all([
    fetch('/api/dashboard/hero', { method: 'PUT', body: JSON.stringify(state.hero) }),
    fetch('/api/dashboard/profile', { method: 'PUT', body: JSON.stringify(state.agent) }),
    fetch('/api/dashboard/sections', { method: 'PUT', body: JSON.stringify(state.sections) }),
  ]);
  setIsDirty(false);
  setIsSaving(false);
  setLastSaved(new Date());
}
```

## ESTILOS
- Usar Tailwind CSS (ya instalado en el proyecto)
- El mockup HTML tiene los estilos exactos — traducir a clases de Tailwind
- Colores principales: bg-white, border-slate-200, text-slate-900, text-blue-500
- Responsive: en pantallas < 900px, ocultar el panel de preview y mostrar solo el editor (el mockup tiene esta lógica)

## LO QUE NO DEBES HACER
- NO crear componentes nuevos para las plantillas — usa el TemplateRenderer que ya existe
- NO cambiar la estructura de las sub-páginas de testimonials/services/zones — esas funcionan bien
- NO modificar las APIs existentes — el contrato de datos no cambia
- NO añadir dependencias nuevas a menos que sea estrictamente necesario
- NO implementar drag-and-drop real para reordenar secciones (complejidad alta, poco valor ahora) — deja los iconos de drag visual pero sin funcionalidad de arrastre
- NO tocar el TemplateRenderer.tsx ni los tipos — solo consúmelos

## CRITERIO DE ÉXITO
1. El layout es split-screen con editor a la izquierda y preview a la derecha
2. Escribir en cualquier campo del editor actualiza el preview instantáneamente (sin guardar)
3. Cambiar de plantilla actualiza el preview instantáneamente
4. Activar/desactivar secciones muestra/oculta las secciones en el preview
5. Los botones Desktop/Tablet/Móvil cambian el ancho del preview
6. El botón "Guardar cambios" persiste los datos en Supabase
7. El indicador muestra correctamente el estado de guardado
8. `npm run build` pasa sin errores
9. El editor se ve y se comporta como el mockup HTML de referencia

## ORDEN DE TRABAJO
1. Refactorizar el layout de `page.tsx` a split-screen
2. Implementar las 3 pestañas con su contenido
3. Conectar el TemplateRenderer en el panel derecho con los datos del estado
4. Implementar la actualización en tiempo real (onChange → estado → re-render)
5. Implementar la barra de herramientas del preview (device selector)
6. Implementar guardado en batch + indicadores
7. Verificar con `npm run build`
