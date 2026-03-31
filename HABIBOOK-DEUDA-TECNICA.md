# HabiBook — Limpieza de Deuda Tecnica

## OBJETIVO
Limpiar TODA la deuda tecnica del proyecto. El proyecto debe compilar sin errores de TypeScript y pasar ESLint sin warnings. Al terminar, las muletas `ignoreBuildErrors` e `ignoreDuringBuilds` se eliminan y el build sigue pasando limpio.

## CONTEXTO
- Proyecto: Next.js 14.2.20 App Router + Supabase SSR + Tailwind
- 93 archivos TypeScript/TSX en /src
- Actualmente: `typescript: { ignoreBuildErrors: true }` y `eslint: { ignoreDuringBuilds: true }` en next.config.js
- No hay archivo .eslintrc — usa la config por defecto de eslint-config-next
- tsconfig.json tiene `strict: true` (bien)

## INSTRUCCIONES PASO A PASO

### PASO 1 — Diagnostico inicial
```bash
cd /Users/jairogarba/proyectos/tenerifehomes-app
npx tsc --noEmit 2>&1 | tee /tmp/ts-errors.log
npx next lint 2>&1 | tee /tmp/eslint-errors.log
wc -l /tmp/ts-errors.log /tmp/eslint-errors.log
```
Cuenta errores totales y clasifícalos por tipo (tipos faltantes, any implícito, imports rotos, unused vars, etc).

### PASO 2 — Generar tipos de Supabase actualizados
```bash
npx supabase gen types typescript --project-id lsrnbgfiftcslqccowfz > src/types/database.ts
```
Muchos errores de tipo vendrán de tipos desactualizados de la DB. Regenerar primero.

### PASO 3 — Corregir errores de TypeScript
Arregla TODOS los errores que reportó `tsc --noEmit`. Prioridad:
1. **Imports rotos** — archivos que importan cosas que no existen o paths incorrectos
2. **Tipos faltantes** — añadir types/interfaces donde falten
3. **any implícito** — tipar explícitamente (NO usar `any` como escape, usar tipos reales)
4. **Null checks** — añadir comprobaciones de null/undefined donde TypeScript lo pida
5. **Unused variables** — eliminar o usar (prefijo _ si es callback obligatorio)

Reglas:
- NO uses `// @ts-ignore` ni `// @ts-expect-error` — corrige el error real
- NO uses `as any` — busca el tipo correcto
- Si un tipo viene de Supabase, usa los tipos generados en database.ts
- Si necesitas crear interfaces nuevas, ponlas en `src/types/`

### PASO 4 — Crear archivo .eslintrc.json
```json
{
  "extends": "next/core-web-vitals",
  "rules": {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "react/no-unescaped-entities": "off"
  }
}
```

### PASO 5 — Corregir errores de ESLint
Ejecuta `npx next lint` y corrige todos los errores. Los warnings de unused vars corrígelos eliminando la variable o usándola.

### PASO 6 — Quitar las muletas de next.config.js
Cambia:
```js
typescript: { ignoreBuildErrors: true },
eslint: { ignoreDuringBuilds: true },
```
A:
```js
typescript: { ignoreBuildErrors: false },
eslint: { ignoreDuringBuilds: false },
```

### PASO 7 — Build final de verificacion
```bash
npm run build
```
El build DEBE pasar sin errores. Si falla, corrige lo que falle. NO vuelvas a poner ignoreBuildErrors.

### PASO 8 — Commit
```bash
git add -A
git commit -m "chore: remove technical debt - fix all TypeScript and ESLint errors, disable ignoreBuildErrors"
```

## CRITERIO DE EXITO
- `npx tsc --noEmit` = 0 errores
- `npx next lint` = 0 errores (warnings OK si son menores)
- `npm run build` = SUCCESS con ignoreBuildErrors: false
- CERO uso de `@ts-ignore`, `@ts-expect-error`, o `as any`
- No hay variables/imports sin usar

## LO QUE NO DEBES TOCAR
- No cambies lógica de negocio, solo tipos y lint
- No añadas features nuevas
- No modifiques estilos ni UI
- No cambies dependencias ni versions de paquetes
- No toques la estructura de carpetas
