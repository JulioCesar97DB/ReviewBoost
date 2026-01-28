# ⭐ ReviewBoost - Documento de Requisitos

**Proyecto:** ReviewBoost - Gestión de Reseñas para Negocios Locales  
**Autor:** Julio  
**Fecha:** Enero 2026  
**Versión:** 1.0

---

# 📋 Índice

1. [Visión General](#1-visión-general)
2. [Usuarios Objetivo](#2-usuarios-objetivo)
3. [Funcionalidades del MVP](#3-funcionalidades-del-mvp)
4. [Modelo de Datos](#4-modelo-de-datos)
5. [User Flows](#5-user-flows)
6. [Modelo de Negocio](#6-modelo-de-negocio)
7. [Métricas Clave](#7-métricas-clave)
8. [Análisis de Competencia](#8-análisis-de-competencia)
9. [Stack Tecnológico](#9-stack-tecnológico)
10. [Roadmap](#10-roadmap)

---

# 1. Visión General

## 1.1 ¿Qué es ReviewBoost?

**ReviewBoost** es una plataforma que ayuda a pequeños negocios locales a conseguir más reseñas positivas en Google, responder a reseñas de manera eficiente (con ayuda de AI), y monitorear su reputación online desde un solo dashboard simple.

## 1.2 Problema que Resuelve

| Problema | Impacto |
|----------|---------|
| Negocios no piden reseñas activamente | Pocas reseñas = menos confianza de clientes |
| Solo clientes enojados dejan reseñas | Rating bajo injustamente |
| No responden a reseñas | Clientes sienten que no les importa |
| No saben qué dicen de ellos online | Problemas sin detectar |
| Herramientas existentes son muy caras | No accesibles para small business ($200+/mes) |
| No tienen tiempo para gestionar reputación | Se descuida, afecta el negocio |

## 1.3 Propuesta de Valor

> **"Más reseñas de 5 estrellas. Menos esfuerzo. Tu reputación en automático."**

### Por qué es diferente

| Factor | ReviewBoost | Competidores |
|--------|-------------|--------------|
| Precio | $19-39/mes | $200-400/mes |
| Complejidad | 3 clicks para pedir reseñas | Dashboards complicados |
| Idioma | Bilingüe ES/EN | Solo inglés |
| AI | Respuestas contextuales | Plantillas genéricas |
| WhatsApp | Integrado | No disponible |
| Setup | 5 minutos | Horas de configuración |

## 1.4 Diferenciadores Clave

1. **Precio accesible** - $19-39/mes vs $200+/mes de competidores
2. **Bilingüe completo** - Español/inglés en todo
3. **AI responses** - Sugerencias que suenan humanas y culturalmente apropiadas
4. **WhatsApp integration** - Clave para mercado hispano
5. **Simplicidad extrema** - 3 clicks para pedir reseñas
6. **Enfoque local** - Florida primero, luego expandir

---

# 2. Usuarios Objetivo

## 2.1 Perfil Principal

### Demografía del Business Owner
- **Edad:** 30-60 años
- **Ubicación:** Florida (inicialmente)
- **Idioma:** Español y/o Inglés
- **Tech-savviness:** Básico a intermedio
- **Tiempo disponible:** Muy limitado

### Tipos de Negocios Target

| Prioridad | Tipo de Negocio | Por qué |
|-----------|-----------------|---------|
| P0 | Restaurantes y cafés | Alto volumen de clientes, reseñas críticas |
| P0 | Barberías y salones | Servicio personal, fidelización |
| P0 | Dentistas y doctores | Confianza es crucial |
| P1 | Talleres mecánicos | Mucha desconfianza, reseñas ayudan |
| P1 | Tiendas locales | Competencia con grandes cadenas |
| P1 | Servicios profesionales | Abogados, contadores |
| P2 | Gimnasios y fitness | Membresías, comunidad |
| P2 | Hoteles pequeños | Booking, TripAdvisor |

### Pain Points
- "Mis competidores tienen más reseñas que yo"
- "No sé cómo pedir reseñas sin ser molesto"
- "No tengo tiempo de responder cada reseña"
- "Recibí una reseña negativa injusta y no sé qué hacer"
- "Las herramientas que hay son muy caras"
- "No sé qué están diciendo de mi negocio"

### Jobs to be Done
1. Conseguir más reseñas positivas de clientes satisfechos
2. Responder a reseñas rápido y profesionalmente
3. Saber inmediatamente si alguien deja una mala reseña
4. Mejorar mi rating general en Google
5. Parecer profesional y que me importan mis clientes

---

# 3. Funcionalidades del MVP

## 3.1 Módulo de Solicitud de Reseñas

### Features Core (P0)

| Feature | Descripción | Criterios de Aceptación |
|---------|-------------|------------------------|
| Enviar por SMS | Mensaje con link directo a Google | SMS enviado en < 5 seg |
| Enviar por Email | Template personalizable | Email profesional |
| QR Code | Para imprimir/mostrar en local | QR genera link correcto, descargable |
| Link personalizado | URL corta para compartir | URL funciona, trackeable |
| Seleccionar contactos | De lista o agregar nuevo | Búsqueda, selección múltiple |
| Template de mensaje | Texto personalizable | Variables: {nombre}, {negocio} |

### Features Importantes (P1)

| Feature | Descripción |
|---------|-------------|
| Enviar por WhatsApp | Abre WhatsApp con mensaje |
| Bulk send | Enviar a múltiples contactos (hasta 50) |
| Programar envío | Enviar en X horas |
| Templates múltiples | Varios mensajes guardados |
| Preview antes de enviar | Ver mensaje final |

### Features Deseables (P2)

| Feature | Descripción |
|---------|-------------|
| Timing inteligente | Enviar en mejor momento |
| A/B testing | Probar diferentes mensajes |
| Secuencias | Reminder si no dejó reseña |

## 3.2 Módulo de Monitoreo de Reseñas

### Features Core (P0)

| Feature | Descripción | Criterios de Aceptación |
|---------|-------------|------------------------|
| Conectar Google Business | OAuth con Google | Flujo completo funciona |
| Ver todas las reseñas | Lista centralizada | Muestra todas las reseñas |
| Filtrar por rating | 1-5 estrellas | Filtros funcionan |
| Ordenar por fecha | Más recientes primero | Ordenamiento correcto |
| Alerta nueva reseña | Email cuando llega reseña | < 15 min de delay |
| Alerta reseña negativa | Notificación urgente (1-2 ⭐) | Push + email inmediato |

### Features Importantes (P1)

| Feature | Descripción |
|---------|-------------|
| Rating promedio | Mostrar promedio actual |
| Tendencia de rating | Gráfica últimos meses |
| Reseñas sin responder | Filtro/badge |
| Búsqueda en reseñas | Por texto/nombre |

### Features Deseables (P2)

| Feature | Descripción |
|---------|-------------|
| Múltiples plataformas | Yelp, Facebook, TripAdvisor |
| Sentiment analysis | Positivo/negativo/neutro |
| Word cloud | Palabras más mencionadas |

## 3.3 Módulo de Respuestas

### Features Core (P0)

| Feature | Descripción | Criterios de Aceptación |
|---------|-------------|------------------------|
| Responder desde dashboard | Sin ir a Google | Respuesta se publica en Google |
| Sugerencia AI | Generar respuesta automática | Contextual al review, natural |
| Templates de respuesta | Para casos comunes | CRUD, uso rápido |
| Editar antes de publicar | Modificar sugerencia | Editor de texto |
| Historial de respuestas | Ver qué se respondió | Lista con fechas |

### Features Importantes (P1)

| Feature | Descripción |
|---------|-------------|
| Respuesta en un click | Para reseñas 5⭐ simples |
| Tono de respuesta | Formal/casual/friendly |
| Respuestas bilingües | Detectar idioma, responder igual |
| Guardar borrador | No publicar aún |

## 3.4 Módulo de Analytics

### Features Core (P0)

| Feature | Descripción | Criterios de Aceptación |
|---------|-------------|------------------------|
| Dashboard principal | Resumen de reputación | Rating, total reviews, trend |
| Rating actual | Número grande visible | Sincronizado |
| Reseñas este mes | Contador | Actualizado |
| Tasa de respuesta | % respondidas | Calculado correctamente |

### Features Importantes (P1)

| Feature | Descripción |
|---------|-------------|
| Rating trend | Gráfica de evolución |
| Distribución | Pie chart de 1-5 ⭐ |
| Solicitudes enviadas | Cuántas y cuándo |
| Conversion rate | Solicitud → Reseña |

## 3.5 Módulo de Contactos

### Features Core (P0)

| Feature | Descripción |
|---------|-------------|
| Lista de contactos | Clientes para pedir reviews |
| Agregar contacto | Manual |
| Historial por contacto | Solicitudes enviadas |
| Buscar contacto | Por nombre/email/teléfono |

### Features Importantes (P1)

| Feature | Descripción |
|---------|-------------|
| Importar CSV | Subir lista existente |
| Importar de teléfono | Contactos del dispositivo |
| Tags/etiquetas | Organizar por tipo |

---

# 4. Modelo de Datos

## 4.1 Diagrama Entidad-Relación

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     users       │     │   businesses    │     │    reviews      │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │──┐  │ id (PK)         │──┐  │ id (PK)         │
│ email           │  │  │ user_id (FK)────│──┘  │ business_id(FK)─│──┐
│ password_hash   │  │  │ name            │     │ google_review_id│  │
│ full_name       │  │  │ google_place_id │     │ author_name     │  │
│ created_at      │  │  │ google_account  │     │ rating          │  │
└─────────────────┘  │  │ address         │     │ text            │  │
                     │  │ phone           │     │ published_at    │  │
                     │  │ logo_url        │     │ response_text   │  │
                     │  │ avg_rating      │     │ is_responded    │  │
                     │  │ total_reviews   │     │ sentiment       │  │
                     │  │ subscription    │     │ created_at      │  │
                     │  │ settings (JSON) │     └─────────────────┘  │
                     │  │ created_at      │              │           │
                     │  └─────────────────┘              │           │
                     │          │                        │           │
                     │          ▼                        │           │
                     │  ┌─────────────────┐              │           │
                     │  │    contacts     │              │           │
                     │  ├─────────────────┤              │           │
                     │  │ id (PK)         │              │           │
                     │  │ business_id(FK)─│──────────────┘           │
                     │  │ name            │                          │
                     │  │ email           │                          │
                     │  │ phone           │                          │
                     │  │ tags            │                          │
                     │  │ review_left     │                          │
                     │  │ created_at      │                          │
                     │  └─────────────────┘                          │
                     │          │                                    │
                     │          ▼                                    │
                     │  ┌─────────────────┐                          │
                     │  │ review_requests │                          │
                     │  ├─────────────────┤                          │
                     │  │ id (PK)         │                          │
                     │  │ business_id(FK)─│──────────────────────────┘
                     │  │ contact_id (FK) │
                     │  │ channel         │  (email, sms, whatsapp)
                     │  │ message         │
                     │  │ sent_at         │
                     │  │ opened_at       │
                     │  │ clicked_at      │
                     │  │ review_left     │
                     │  │ status          │
                     │  └─────────────────┘
                     │
                     │  ┌─────────────────┐
                     │  │   templates     │
                     │  ├─────────────────┤
                     └──│ business_id(FK) │
                        │ type            │  (request, response)
                        │ name            │
                        │ content         │
                        │ language        │
                        │ is_default      │
                        └─────────────────┘
```

## 4.2 Tablas Principales (SQL)

### businesses
```sql
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    phone VARCHAR(20),
    logo_url TEXT,
    
    -- Google Business Profile
    google_place_id VARCHAR(255),
    google_account_id VARCHAR(255),
    google_access_token TEXT,
    google_refresh_token TEXT,
    
    -- Stats (cached)
    avg_rating DECIMAL(2, 1) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    
    -- Subscription
    subscription VARCHAR(20) DEFAULT 'free',
    requests_this_month INTEGER DEFAULT 0,
    
    -- Settings
    settings JSONB DEFAULT '{
        "alerts_email": true,
        "alert_on_negative": true,
        "default_language": "es"
    }',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### reviews
```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    
    google_review_id VARCHAR(255) UNIQUE,
    author_name VARCHAR(255),
    author_photo_url TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    text TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Response
    response_text TEXT,
    response_at TIMESTAMP WITH TIME ZONE,
    is_responded BOOLEAN DEFAULT FALSE,
    
    -- Analysis
    sentiment VARCHAR(20), -- positive, neutral, negative
    language VARCHAR(5),
    
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reviews_business_date ON reviews(business_id, published_at DESC);
CREATE INDEX idx_reviews_not_responded ON reviews(business_id, is_responded) 
    WHERE is_responded = FALSE;
```

### review_requests
```sql
CREATE TABLE review_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id),
    
    channel VARCHAR(20) NOT NULL, -- email, sms, whatsapp
    recipient_name VARCHAR(255),
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(20),
    message TEXT NOT NULL,
    
    -- Tracking
    status VARCHAR(20) DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    review_left BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

# 5. User Flows

## 5.1 Pedir Reseñas a Clientes

```
[1. Dashboard]
     │
     ▼
[2. Tap "Pedir Reseñas"]
     │
     ▼
[3. Seleccionar destinatarios]
     │
     ├── [Contactos existentes] ──▶ Buscar, seleccionar
     └── [Agregar nuevo] ──▶ Nombre + Email/Teléfono
     │
     ▼
[4. Elegir canal]
     │
     ├── 📧 Email
     ├── 💬 SMS
     └── 📱 WhatsApp
     │
     ▼
[5. Personalizar mensaje] (opcional)
     │
     ▼
[6. Preview] ──▶ [Enviar]
     │
     ▼
[7. Confirmación: "X solicitudes enviadas"]
```

## 5.2 Responder a Reseña Nueva

```
[Nueva reseña llega]
     │
     ├──▶ Push: "Nueva reseña ⭐⭐⭐⭐"
     └──▶ Email alert
            │
            ▼
[Tap notificación] ──▶ [Ver reseña]
     │
     ▼
[Tap "Responder"]
     │
     ▼
[AI genera sugerencia]
     │
     ├── Analiza contenido
     ├── Detecta idioma
     └── Genera respuesta apropiada
     │
     ▼
[Usuario revisa/edita]
     │
     ▼
[Tap "Publicar"]
     │
     ▼
[Respuesta en Google] ✓
```

## 5.3 Alerta de Reseña Negativa

```
[Cliente deja 1-2 ⭐]
     │
     ▼
[Sistema detecta]
     │
     ▼
[ALERTA URGENTE]
     │
     ├── Push: "⚠️ Reseña negativa"
     ├── Email urgente
     └── Badge en app
            │
            ▼
[AI sugiere respuesta empática]
     │
     ├── Reconoce problema
     ├── Disculpa apropiada
     ├── Ofrece solución
     └── Invita a contactar
     │
     ▼
[Usuario personaliza y responde]
```

## 5.4 Setup Inicial

```
[1. Registro] ──▶ Email/Password o Google
     │
     ▼
[2. Conectar Google Business Profile]
     │
     └── OAuth ──▶ Seleccionar negocio
     │
     ▼
[3. Importar reseñas existentes]
     │
     ▼
[4. Configurar alertas]
     │
     ├── ¿Notificar cada reseña? [Sí/No]
     └── ¿Alerta especial negativas? [Sí/No]
     │
     ▼
[5. Personalizar mensaje de solicitud]
     │
     ▼
[6. ¡Listo!] ──▶ Dashboard
```

---

# 6. Modelo de Negocio

## 6.1 Planes de Suscripción

| Plan | Precio | Solicitudes/mes | Features |
|------|--------|-----------------|----------|
| **Free** | $0 | 10 | QR code, link, monitoreo básico, alertas email |
| **Starter** | $19/mes | 100 | + SMS, AI responses, templates, analytics |
| **Growth** | $39/mes | 300 | + 3 ubicaciones, bulk send, priority support |
| **Agency** | $99/mes | Ilimitado | + 10 ubicaciones, white-label, API |

## 6.2 Costos Variables

| Concepto | Costo | Quién paga |
|----------|-------|------------|
| SMS (Twilio) | ~$0.0079/msg | Incluido en plan |
| Email (Resend) | ~$0.001/email | Incluido |
| AI (OpenAI) | ~$0.002/respuesta | Incluido |

## 6.3 Unit Economics

| Métrica | Valor Esperado |
|---------|----------------|
| CAC | $15-25 |
| LTV | $200-350 |
| LTV:CAC | 10-15x |
| Churn mensual | 6-8% |
| ARPU | $28/mes |
| Conversion Free→Paid | 10-15% |

---

# 7. Métricas Clave

## 7.1 KPIs del Producto

| Métrica | Target MVP (3 meses) |
|---------|----------------------|
| Negocios registrados | 200 |
| Negocios conectados (Google) | 150 |
| Solicitudes enviadas | 5,000 |
| Reseñas generadas | 1,000 |
| Conversion rate (solicitud→reseña) | > 15% |

## 7.2 KPIs de Negocio

| Métrica | Target 6 meses |
|---------|----------------|
| MRR | $2,500 |
| Negocios pagos | 80 |
| Conversion Free→Paid | > 12% |
| Churn rate | < 8% |
| NPS | > 45 |

## 7.3 KPIs de Engagement

| Métrica | Target |
|---------|--------|
| DAU/MAU | > 25% |
| Response rate (reseñas) | > 60% |
| Time to response | < 24 horas |
| Solicitudes/negocio/mes | > 20 |

---

# 8. Análisis de Competencia

## 8.1 Competidores Directos

| Competidor | Precio | Fortaleza | Debilidad |
|------------|--------|-----------|-----------|
| **Birdeye** | $299+/mes | Muy completo | Muy caro, complejo |
| **Podium** | $249+/mes | Excelente UX | Caro, para grandes |
| **NiceJob** | $75+/mes | Automatización | Solo inglés |
| **Grade.us** | $90+/mes | White-label | No mobile-first |
| **ReviewTrackers** | $49+/mes | Multi-platform | No genera reviews |

## 8.2 Nuestra Diferenciación

| Factor | ReviewBoost | Competidores |
|--------|-------------|--------------|
| **Precio** | $19-39/mes | $200-400/mes |
| **Idioma** | Bilingüe ES/EN | Solo inglés |
| **Setup** | 5 minutos | Horas/días |
| **UX** | 3 clicks para solicitar | Múltiples pasos |
| **WhatsApp** | Integrado | No disponible |
| **AI responses** | Contextual, natural | Templates genéricos |

---

# 9. Stack Tecnológico

## 9.1 Core Stack

| Capa | Tecnología |
|------|------------|
| Frontend Web | Next.js 14 |
| Mobile | React Native + Expo |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand |
| Backend | Supabase |
| Database | PostgreSQL |
| Auth | Supabase Auth + Google OAuth |
| AI | OpenAI GPT-4 |
| Email | Resend |
| SMS | Twilio |
| Hosting | Vercel |

## 9.2 Integraciones

| Integración | Uso |
|-------------|-----|
| Google Business Profile API | Leer/responder reseñas |
| OpenAI | Generar respuestas AI |
| Twilio | Enviar SMS |
| Resend | Enviar emails |

## 9.3 Google Business Profile API

### Scopes:
```
https://www.googleapis.com/auth/business.manage
```

### Endpoints principales:
- `GET /accounts/{accountId}/locations/{locationId}/reviews`
- `PUT /accounts/{accountId}/locations/{locationId}/reviews/{reviewId}/reply`

### Consideraciones:
- Rate limits: 60 requests/min
- Polling cada 15 min (no hay webhooks)
- Refresh tokens para acceso continuo

---

# 10. Roadmap

## 10.1 Fases de Desarrollo

### Fase 1: MVP Core (6 semanas)

| Semana | Entregables |
|--------|-------------|
| 1 | Setup proyecto, Auth, Google OAuth |
| 2 | Conectar Google Business, sync reviews |
| 3 | Dashboard reseñas, filtros, alertas email |
| 4 | Solicitudes por email, templates |
| 5 | SMS con Twilio, QR code |
| 6 | AI responses con OpenAI, testing |

### Fase 2: Enhancement (3 semanas)

| Semana | Entregables |
|--------|-------------|
| 7 | Analytics, métricas, gráficas |
| 8 | App móvil (notificaciones) |
| 9 | Contactos management, import |

### Fase 3: Monetización (3 semanas)

| Semana | Entregables |
|--------|-------------|
| 10 | Stripe integration, planes |
| 11 | Límites por plan, upgrade flow |
| 12 | Onboarding mejorado, launch |

## 10.2 Milestones

| Milestone | Fecha | Criterio |
|-----------|-------|----------|
| Alpha | Semana 4 | 5 negocios de prueba |
| Beta | Semana 7 | 30 negocios, 500 solicitudes |
| Launch | Semana 12 | Monetización activa |

---

# 📎 Anexos

## A. Templates de Solicitud

### Email (Español)
```
Asunto: {nombre}, ¿qué tal tu experiencia en {negocio}?

Hola {nombre},

¡Gracias por visitarnos! Tu opinión es muy valiosa.

¿Podrías tomarte 30 segundos para dejarnos una reseña?

[BOTÓN: Dejar mi reseña]

¡Muchas gracias!
{negocio}
```

### SMS
```
Hola {nombre}! Gracias por tu visita a {negocio}. 
Tu opinión nos ayuda 🙏 ¿Nos dejas una reseña? 
Solo 30 seg → {link}
```

## B. Prompts de AI para Respuestas

### System Prompt
```
Eres un asistente que ayuda a responder reseñas de Google.
Genera respuestas:
- Profesionales pero cálidas
- Personalizadas al contenido
- Breves (2-4 oraciones)
- En el idioma de la reseña
- Agradecidas genuinamente

Para negativas: reconoce, disculpa, ofrece solución.
Para positivas: agradece, menciona algo específico.
```

## C. Ejemplos de Respuestas AI

### 5⭐ Positiva
```
¡Muchas gracias por tus palabras, {nombre}! 
Nos alegra que hayas disfrutado tu experiencia. 
¡Esperamos verte pronto! 🙏
```

### 1-2⭐ Negativa
```
{nombre}, lamentamos tu experiencia. Tomamos tus 
comentarios muy en serio. Por favor contáctanos al 
{teléfono} para hacer las cosas bien. Gracias por 
darnos la oportunidad de mejorar.
```

---

*Documento creado: Enero 2026*  
*Versión: 1.0*
