# NatureScripts

AI-powered naturopathic consultation platform that creates personalized herbal wellness protocols using Claude.

## Features

### Free Tier
- **AI Consultations** -- Chat-based consultation with smart follow-up questions (5/week)
- **Personalized Protocols** -- Herbal recommendations with dosages, timing, and safety info
- **Remedy Database** -- Evidence-rated database of natural remedies with product links
- **Health Profile** -- Onboarding flow that builds your wellness profile
- **PDF Export** -- Download protocols as formatted PDFs

### Pro Tier ($12.99/month)
- Unlimited consultations
- **Symptom Tracking** -- Log symptoms daily and visualize trends over time
- **Protocol Adjustments** -- Modify existing protocols based on progress
- **Email Reminders** -- Weekly progress summaries and tracking nudges
- **Custom Remedies** -- Save and manage your own remedy notes

### Admin Dashboard
- User management and consultation viewer (anonymized)
- API usage analytics and cost tracking
- Stripe revenue integration
- Remedy database CRUD with bulk JSON import
- Training data export (JSONL)

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui + Radix UI |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth |
| AI | Anthropic Claude (via `@anthropic-ai/sdk`) |
| Payments | Stripe (subscriptions + billing portal) |
| Email | Resend |
| Analytics | PostHog |
| Charts | Recharts |
| PDF | jsPDF |
| Rate Limiting | In-memory + Upstash Redis |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Supabase account
- Anthropic API key
- Stripe account (for payments)
- Resend account (for emails, optional)

### Installation

```bash
git clone https://github.com/joelbyler272/naturescripts.git
cd naturescripts
npm install
cp .env.local.example .env.local
```

### Environment Variables

See `.env.local.example` for the full list. Key variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic (Claude AI)
ANTHROPIC_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=

# Email (Resend)
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

Run the SQL migration in your Supabase SQL Editor:

```bash
# The schema is in supabase/schema.sql
```

This creates:
- `profiles` -- User profiles with tier info
- `consultations` -- Consultation history and protocols
- `daily_usage` -- Usage tracking for rate limiting

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Stripe Webhook (Local Testing)

```bash
brew install stripe/stripe-cli/stripe
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Project Structure

```
app/
  (admin)/             # Admin dashboard (users, analytics, costs, revenue, remedies)
  (app)/               # Authenticated routes (dashboard, consultation, protocols, tracking, settings)
  (auth)/              # Sign-in, sign-up, email verification
  (legal)/             # Terms, privacy policy, medical disclaimer
  (marketing)/         # Landing page, about, pricing, FAQs, blog, contact
  (public)/            # Remedy database, health library
  api/                 # API routes (consultation, stripe, auth, admin, cron)
  onboarding/          # Guided onboarding chat flow

components/
  admin/               # Admin UI components
  app/                 # App shell, sidebar, navigation
  consultation/        # Chat interface
  error/               # Error boundaries
  onboarding/          # Onboarding chat and modals
  protocol/            # Protocol display and detail
  tracking/            # Symptom charts, supplement/habit trackers
  shared/              # Navigation, Footer, Logo
  ui/                  # shadcn/ui component library

lib/
  admin/               # Admin queries and API usage tracking
  analytics/           # PostHog event tracking
  anthropic/           # Claude SDK wrapper with cost logging
  auth/                # Auth context and utilities
  constants/           # Routes, limits, error codes, colors
  consultation/        # Protocol generation, prompts, affiliate links
  email/               # Resend templates (verification, reminders, summaries)
  hooks/               # React hooks (usage limits, tracking, protocols)
  onboarding/          # Onboarding state machine
  pdf/                 # PDF generation
  remedies/            # Remedy database queries
  stripe/              # Stripe checkout and portal utilities
  supabase/            # Database client and queries
  utils/               # Logger, rate limiting, helpers
```

## Key Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/onboarding` | Guided consultation and account creation |
| `/dashboard` | User dashboard with active protocol |
| `/consultation` | AI-powered consultation chat |
| `/protocols` | Past protocol history |
| `/protocols/[id]` | Protocol detail with supplements, habits, interactions |
| `/tracking` | Symptom, supplement, and habit tracking (Pro) |
| `/remedies` | Searchable remedy database |
| `/library` | Health guides and research articles |
| `/settings` | Profile, billing, and account management |
| `/upgrade` | Pro subscription page |
| `/admin` | Admin dashboard (authorized users only) |

## Architecture Decisions

- **Server/Client Split** -- Pages are server components for metadata, with client `*Content.tsx` components for interactivity
- **Fail-Closed Security** -- Database errors deny access rather than allow bypass
- **Rate Limiting** -- In-memory rate limiter with Upstash Redis support
- **Type Guards** -- Centralized protocol type detection for backward compatibility
- **Dev-Only Logging** -- Production logs don't leak sensitive data
- **Affiliate Integration** -- Amazon and iHerb affiliate links in product recommendations
- **Cron Jobs** -- `/api/cron/reminders` and `/api/cron/weekly-summary` for automated emails

## Deployment

Designed for Vercel deployment:

```bash
npm run build
```

Required:
- All variables from `.env.local.example` set in Vercel
- Stripe webhook endpoint: `https://your-domain.com/api/stripe/webhook`
- Cron jobs configured in `vercel.json` (if using Vercel Cron)

## License

Proprietary -- All rights reserved
