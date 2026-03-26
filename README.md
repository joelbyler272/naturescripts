# NatureScripts

AI-powered naturopathic consultation platform that creates personalized herbal wellness protocols using Claude.

## Features

### Free Tier
- **AI Consultations** -- Chat-based consultation with smart follow-up questions (5/week)
- **Personalized Protocols** -- Herbal recommendations with dosages, timing, daily schedule, and safety info
- **Remedy Database** -- Evidence-rated database of 36+ natural remedies with pharmaceutical equivalents and product links
- **Health Profile** -- Onboarding flow that builds your wellness profile
- **Wellness Intake** -- 5-step assessment covering personal info, diet, lifestyle, mental health, and goals
- **PDF Export** -- Download protocols as formatted PDFs
- **Health Quizzes** -- Stress, sleep, and digestion assessments with personalized remedy suggestions
- **Remedy Favorites** -- Save remedies for quick reference

### Pro Tier ($12.99/month)
- Unlimited consultations
- **Symptom Tracking** -- Log symptoms daily and visualize trends over time
- **Protocol Adjustments** -- Modify existing protocols based on progress
- **Email Reminders** -- Weekly progress summaries and tracking nudges
- **Custom Remedies** -- Save and manage your own remedy notes

### Document Intelligence
- **Document Upload** -- Upload lab reports and medical documents (PDF, JPG, PNG)
- **AI Lab Report Interpreter** -- Claude-powered extraction of lab markers with reference ranges and status
- **Medical Document Simplifier** -- Plain-English translations of complex medical documents
- **Wellness Suggestions** -- Natural remedy recommendations based on lab findings

### Dashboard & Engagement
- **Wellness Score** -- Aggregate 0-100 score across 6 categories (nutrition, activity, sleep, stress, mindfulness, hydration)
- **Health Map** -- Radar chart visualization of wellness categories
- **Daily Remedy Spotlight** -- Featured remedy that rotates daily
- **Daily Tips** -- Rotating natural health tips

### Admin Dashboard
- User management and consultation viewer (anonymized)
- API usage analytics and cost tracking
- Stripe revenue integration
- Remedy database CRUD with bulk JSON import and pharmaceutical equivalents
- Training data export (JSONL)

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui + Radix UI |
| Database | Supabase (PostgreSQL + RLS) |
| Storage | Supabase Storage (health documents) |
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

Run the SQL migrations in your Supabase SQL Editor in order:

```
supabase/migrations/
  001_health_profile.sql          -- Health conditions, medications, supplements
  002_onboarding.sql              -- Onboarding tracking
  003_daily_usage.sql             -- Usage rate limiting
  004_remedies.sql                -- Remedy database table
  005_tracking.sql                -- Symptom, supplement, habit logs
  006_consultation_history.sql    -- Consultation history RPC
  007_usage_rpc.sql               -- Usage check/increment RPCs
  008_weekly_limit.sql            -- Weekly limit enforcement
  009_pharma_equivalents.sql      -- Pharmaceutical equivalents on remedies
  010_expanded_profile.sql        -- Personal info (age, gender, height, weight, lifestyle)
  011_intake_expansion.sql        -- Full intake fields (diet, mental, goals)
  012_documents_and_favorites.sql -- Document storage, lab results, favorites, wellness scores
```

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
  (app)/               # Authenticated routes
    consultation/      # AI consultation chat
    dashboard/         # User dashboard with wellness score, health map, tips
    documents/         # Document upload and AI interpretation
    intake/            # 5-step wellness intake wizard
    protocols/         # Protocol history and detail with daily schedule
    quizzes/           # Health quizzes (stress, sleep, digestion)
    settings/          # Profile, health data, billing, account
    tracking/          # Symptom, supplement, and habit tracking (Pro)
    upgrade/           # Pro subscription
  (auth)/              # Sign-in, sign-up, email verification
  (legal)/             # Terms, privacy policy, medical disclaimer
  (marketing)/         # Landing page, about, pricing, FAQs, blog, contact
  (public)/            # Remedy database, health library
  api/                 # API routes (consultation, documents, stripe, auth, admin, cron)
  onboarding/          # Guided onboarding chat flow

components/
  admin/               # Admin UI components
  app/                 # App shell, sidebar, navigation
  consultation/        # Chat interface
  dashboard/           # Wellness score ring, health map radar chart
  error/               # Error boundaries
  intake/              # Intake wizard step components
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
  documents/           # Document storage, AI interpreter prompts
  email/               # Resend templates (verification, reminders, summaries)
  hooks/               # React hooks (usage limits, tracking, protocols)
  intake/              # Intake wizard types and option constants
  onboarding/          # Onboarding state machine
  pdf/                 # PDF generation
  quizzes/             # Quiz engine with scored health assessments
  remedies/            # Remedy database queries, favorites
  stripe/              # Stripe checkout and portal utilities
  supabase/            # Database client and queries
  utils/               # Logger, rate limiting, helpers
  wellness/            # Wellness score algorithm (6 categories)
```

## Key Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/onboarding` | Guided consultation and account creation |
| `/dashboard` | User dashboard with wellness score, health map, tips, and protocols |
| `/consultation` | AI-powered consultation chat |
| `/protocols` | Past protocol history |
| `/protocols/[id]` | Protocol detail with daily schedule, supplements, interactions |
| `/intake` | 5-step wellness intake (personal, diet, lifestyle, mental, goals) |
| `/documents` | Upload and manage health documents |
| `/documents/[id]` | Document detail with AI interpretation |
| `/quizzes` | Health quizzes with scored results |
| `/tracking` | Symptom, supplement, and habit tracking (Pro) |
| `/remedies` | Searchable remedy database with favorites |
| `/remedies/[slug]` | Remedy detail with pharmaceutical equivalents |
| `/library` | Health guides and research articles |
| `/settings` | Profile, health data, billing, and account management |
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
- **Prompt Security** -- Health data wrapped in XML tags, injection-resistant prompts
- **Supabase RLS** -- Row-level security on all user tables, including document storage

## Deployment

Designed for Vercel deployment:

```bash
npm run build
```

Required:
- All variables from `.env.local.example` set in Vercel
- Stripe webhook endpoint: `https://your-domain.com/api/stripe/webhook`
- Cron jobs configured in `vercel.json` (if using Vercel Cron)
- Supabase migrations run in order (001-012)

## License

Proprietary -- All rights reserved
