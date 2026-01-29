# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**ReviewBoost** is a review management platform for local businesses that helps them get more positive reviews, respond efficiently with AI assistance, and monitor their online reputation from a simple dashboard.

### Monorepo Structure

```
ReviewBoost/
├── web/                 # Next.js 16 full-stack web application
├── mobile/              # Expo React Native mobile app
├── CLAUDE.md            # This file - project context for Claude
├── ReviewBoost-Requirements.md  # Full product requirements
└── .gitignore           # Consolidated gitignore
```

---

## Current Progress & Roadmap

### ✅ Completed (Phase 0 - Foundation)

| Feature                   | Web | Mobile | Notes                                     |
| ------------------------- | --- | ------ | ----------------------------------------- |
| Project setup             | ✅  | ✅     | Next.js 16, Expo 54                       |
| Authentication UI         | ✅  | ✅     | Login, Sign-up, Forgot Password           |
| Supabase Auth integration | ✅  | ✅     | SSR (web), SecureStore (mobile)           |
| Route protection          | ✅  | ✅     | Middleware/Guards                         |
| Theme system              | ✅  | ✅     | Orange/amber palette, dark/light mode     |
| Landing page              | ✅  | N/A    | Hero, Features, Pricing, FAQ, CTA         |
| Dashboard UI              | ✅  | ✅     | Stats, Quick Actions, Rating Distribution |
| Reviews list UI           | ✅  | ✅     | Filters, mock data                        |
| Requests list UI          | ✅  | ✅     | Status tracking                           |
| Contacts list UI          | ✅  | ✅     | Search, send request                      |
| Settings UI               | ✅  | ✅     | Profile, preferences, integrations        |

### 🔲 Pending (Phase 1 - MVP Core)

| Feature                       | Priority | Description                                                                 |
| ----------------------------- | -------- | --------------------------------------------------------------------------- |
| Database schema               | P0       | Create Supabase tables (businesses, reviews, contacts, requests, templates) |
| Google Business Profile OAuth | P0       | Connect business to Google                                                  |
| Sync reviews from Google      | P0       | Fetch and store reviews                                                     |
| Email alerts                  | P0       | New review notifications                                                    |
| Send review requests (Email)  | P0       | With templates                                                              |
| Send review requests (SMS)    | P0       | Twilio integration                                                          |
| QR Code generation            | P0       | For physical display                                                        |
| AI response suggestions       | P0       | OpenAI integration                                                          |
| Respond to reviews            | P0       | Post response to Google                                                     |

### 🔲 Pending (Phase 2 - Enhancement)

| Feature              | Priority | Description                   |
| -------------------- | -------- | ----------------------------- |
| Analytics dashboard  | P1       | Charts, trends, metrics       |
| WhatsApp integration | P1       | Send requests via WhatsApp    |
| Contact import (CSV) | P1       | Bulk import contacts          |
| Multiple templates   | P1       | Save/manage message templates |
| Push notifications   | P1       | Mobile alerts                 |

### 🔲 Pending (Phase 3 - Monetization)

| Feature                | Priority | Description                                     |
| ---------------------- | -------- | ----------------------------------------------- |
| Stripe integration     | P2       | Payment processing                              |
| Subscription plans     | P2       | Free, Starter ($19), Growth ($39), Agency ($99) |
| Usage limits           | P2       | Requests per month by plan                      |
| Multi-location support | P2       | For Growth/Agency plans                         |

---

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

---

## Architecture

### Web Application

| Aspect     | Technology                                 |
| ---------- | ------------------------------------------ |
| Framework  | Next.js 16 (App Router, Server Components) |
| Auth       | Supabase SSR with cookie-based sessions    |
| UI         | shadcn/ui (Radix UI) + Tailwind CSS        |
| Theming    | CSS variables + next-themes                |
| Middleware | `proxy.ts` for session management          |

**Key paths:**

```
web/
├── app/
│   ├── page.tsx              # Landing page
│   ├── auth/                 # Auth routes (login, sign-up, forgot-password)
│   └── dashboard/            # Protected routes
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── landing/              # Landing page sections
│   └── dashboard/            # Dashboard components
├── lib/supabase/
│   ├── client.ts             # Browser client
│   └── server.ts             # SSR client
└── proxy.ts                  # Auth middleware
```

### Mobile Application

| Aspect      | Technology                        |
| ----------- | --------------------------------- |
| Framework   | Expo 54 + Expo Router             |
| Auth        | Supabase + ExpoSecureStore        |
| Navigation  | Tab-based (5 tabs)                |
| Theming     | React Navigation themes           |
| Performance | New Architecture + React Compiler |

**Key paths:**

```
mobile/
├── app/
│   ├── (auth)/               # Auth screens (login, sign-up, forgot-password)
│   ├── (tabs)/               # Tab screens (dashboard, reviews, requests, contacts, settings)
│   └── _layout.tsx           # Root layout with auth guards
├── components/
│   ├── ui/                   # Button, Input, Card
│   ├── dashboard/            # Stats, Reviews, Quick Actions
│   └── logo.tsx              # App logo
├── constants/theme.ts        # Color palette
├── lib/supabase.ts           # Supabase client
└── providers/auth-provider.tsx
```

---

## Design System

### Color Palette (HSL)

| Token       | Light               | Dark        |
| ----------- | ------------------- | ----------- |
| Primary     | 32 95% 50% (Orange) | 32 90% 55%  |
| Background  | 40 33% 98%          | 240 10% 8%  |
| Card        | 0 0% 100%           | 240 10% 11% |
| Border      | 40 15% 90%          | 240 8% 18%  |
| Success     | 142 71% 45%         | 142 71% 50% |
| Warning     | 45 93% 47%          | 45 93% 50%  |
| Destructive | 0 72% 51%           | 0 62% 45%   |

### UI Components

**Web (shadcn/ui):** Button, Card, Input, Label, Badge, Checkbox, Dropdown Menu, Avatar, Separator

**Mobile (Custom):** Button, Input, Card, Logo, StatsCard, RecentReviews, QuickActions, RatingDistribution

---

## Environment Variables

### Web (`web/.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

### Mobile (`mobile/.env`)

```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

---

## TypeScript Standards

### Rules

- **No `any`:** Always use explicit types or `unknown`
- **No unnecessary comments:** Code should be self-documenting
- **Strict types:** Use interfaces and types for data structures
- **SOLID principles:** Single responsibility, clean functions

### Example

```typescript
// ✅ Correct
interface User {
  id: string;
  name: string;
  email: string;
}

const fetchUser = async (id: string): Promise<User> => { ... }

// ❌ Incorrect
const fetchUser = async (id: any): Promise<any> => { ... }
```

---

## MCP Tools Usage

### Supabase MCP

Use `mcp__supabase__*` tools for:

- Database operations and migrations
- SQL queries
- Project management

### Next.js MCP

Use `nextjs_index` and `nextjs_call` for:

- Diagnosing errors
- Verifying routes
- Dev server status

### Memory MCP

Use `mcp__server-memory__*` for:

- Storing project context
- Architecture decisions
- Session knowledge

---

## Database Schema (Planned)

```sql
-- Core tables (to be created)
businesses    -- User's business profiles
reviews       -- Synced from Google
contacts      -- Customer contact list
review_requests -- Sent review requests
templates     -- Message templates
```

See `ReviewBoost-Requirements.md` section 4 for full schema.

---

## External Integrations (Planned)

| Service                     | Purpose                | Status     |
| --------------------------- | ---------------------- | ---------- |
| Google Business Profile API | Read/respond reviews   | 🔲 Pending |
| OpenAI GPT-4                | AI response generation | 🔲 Pending |
| Twilio                      | SMS sending            | 🔲 Pending |
| Resend                      | Email sending          | 🔲 Pending |
| Stripe                      | Payments               | 🔲 Pending |

---

## Git Conventions

### Commit Format

```
type(scope): description

feat(web): add login page
feat(mobile): add dashboard components
fix(web): resolve hydration error
chore: update gitignore
```

### Branch Strategy

- `main` - Production-ready code
- Feature branches as needed

---

_Last updated: January 2026_
