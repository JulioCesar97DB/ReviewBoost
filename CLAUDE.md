# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Instrucciones para Claude

### Estándares de Código TypeScript
- **No comentarios innecesarios:** No crear comentarios en el código a menos que sea absolutamente necesario para explicar lógica compleja.
- **No usar `any`:** Nunca declarar variables, parámetros o retornos con tipo `any`. Siempre definir tipos explícitos o inferidos correctamente.
- **Tipos estrictos:** Usar interfaces y types para definir estructuras de datos. Preferir `unknown` sobre `any` cuando el tipo es desconocido.
- **Patrones de diseño:** Implementar los mejores patrones de diseño según el contexto (Singleton, Factory, Repository, etc.).
- **Código limpio:** Seguir principios SOLID, DRY, y mantener funciones pequeñas y con responsabilidad única.

### Uso Obligatorio de MCPs
- **Next.js MCP:** Usar `nextjs_index` y `nextjs_call` para diagnosticar errores, verificar rutas y estado del servidor de desarrollo.
- **Supabase MCP:** Usar las herramientas de Supabase (`mcp__supabase__*`) para operaciones de base de datos, migraciones, y consultas SQL.
- **Memory MCP (server-memory):** Usar `mcp__server-memory__*` para guardar y recuperar contexto importante del proyecto, decisiones de arquitectura, y conocimiento adquirido durante las sesiones.

### Convenciones TypeScript
```typescript
// ✅ Correcto
interface User {
  id: string;
  name: string;
  email: string;
}

const fetchUser = async (id: string): Promise<User> => { ... }

// ❌ Incorrecto
const fetchUser = async (id: any): Promise<any> => { ... }
// comentario obvio: esta función obtiene un usuario
```

## Project Overview

ReviewBoost is a monorepo containing two applications:
- **web/** - Next.js 15+ full-stack app with Supabase authentication
- **mobile/** - React Native/Expo app for cross-platform mobile

## Development Commands

### Web (`/web`)
```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Production build
npm run lint     # ESLint check
```

### Mobile (`/mobile`)
```bash
npm start        # Start Expo dev server
npm run ios      # Run on iOS simulator
npm run android  # Run on Android emulator
npm run web      # Run in browser
npm run lint     # Expo linter
```

## Architecture

### Web Application
- **Framework:** Next.js with App Router and Server Components
- **Auth:** Supabase SSR with cookie-based session management
- **UI:** shadcn/ui components (Radix UI primitives) with Tailwind CSS
- **Theming:** CSS variables with next-themes for dark/light mode

**Key paths:**
- `app/auth/` - Authentication routes (login, signup, forgot-password, callback)
- `app/dashboard/` - Protected routes (requires authentication)
- `lib/supabase/` - Supabase client setup (client.ts for browser, server.ts for SSR)
- `components/ui/` - shadcn/ui component library
- `proxy.ts` - Middleware for Supabase session updates

**Auth pattern:** Protected routes fetch user via `createClient()` from `lib/supabase/server.ts` and redirect to `/auth/login` if not authenticated.

### Mobile Application
- **Framework:** Expo 54 with Expo Router (file-based routing)
- **Navigation:** Tab-based layout in `app/(tabs)/`
- **Theming:** React Navigation theme system with light/dark support
- **Performance:** New Architecture enabled, React Compiler active

**Key paths:**
- `app/(tabs)/` - Tab screens (Home, Explore)
- `components/ui/` - Custom themed components
- `hooks/` - Custom hooks including useColorScheme
- `constants/theme.ts` - Color definitions

## TypeScript Configuration

Both apps use strict TypeScript. Path alias `@/*` maps to project root in web app.

## Environment Variables

Web app requires in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
