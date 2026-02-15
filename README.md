# NatureScripts

AI-powered naturopathic consultation platform that creates personalized herbal wellness protocols.

## Features

- **AI Consultations** — Chat-based consultation that asks smart follow-up questions
- **Personalized Protocols** — Herbal recommendations with dosages, timing, and safety info
- **Remedy Database** — Evidence-rated database of natural remedies
- **Usage Limits** — Free tier (3/day) with Pro subscription for unlimited access
- **Stripe Payments** — Subscription billing with customer portal

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Payments | Stripe |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account (for payments)

### Installation

```bash
# Clone the repo
git clone https://github.com/joelbyler272/naturescripts.git
cd naturescripts

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local
```

### Environment Variables

Add these to your `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRO_PRICE_ID=price_xxx

# Optional
DEV_EMAILS=dev@example.com
ADMIN_EMAILS=admin@example.com
```

### Database Setup

Run the SQL migration in your Supabase SQL Editor:

```bash
# The schema is in supabase/schema.sql
```

This creates:
- `profiles` — User profiles with tier info
- `consultations` — Consultation history and protocols
- `daily_usage` — Usage tracking for rate limiting

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Stripe Webhook (Local Testing)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login and forward webhooks
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Project Structure

```
├── app/
│   ├── (app)/           # Authenticated app routes
│   │   ├── dashboard/   # Main dashboard
│   │   ├── consultation/# AI chat interface
│   │   ├── protocols/   # Protocol history & detail
│   │   ├── settings/    # User settings
│   │   └── upgrade/     # Pro upgrade page
│   ├── (auth)/          # Login/signup pages
│   ├── (marketing)/     # Landing page
│   ├── (public)/        # Public pages (remedies, library)
│   └── api/             # API routes
│       └── stripe/      # Stripe checkout, portal, webhook
├── components/
│   ├── app/             # App shell, navigation, sidebar
│   ├── consultation/    # Chat interface components
│   ├── protocol/        # Protocol display components
│   └── ui/              # shadcn/ui components
├── lib/
│   ├── auth/            # Auth context
│   ├── constants/       # Routes, limits, error codes
│   ├── hooks/           # React hooks
│   ├── supabase/        # Database client & queries
│   └── utils/           # Utilities (logger, rate limit, etc.)
└── types/               # TypeScript definitions
```

## Key Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/dashboard` | User dashboard with protocols |
| `/consultation` | Start a new consultation |
| `/protocols` | View past protocols |
| `/protocols/[id]` | Protocol detail page |
| `/remedies` | Remedy database |
| `/settings` | User settings & billing |
| `/upgrade` | Pro subscription page |

## Development History

All features were developed through the following PRs (all merged to main):

| PR | Description |
|----|-------------|
| #1 | Folder structure reorganization |
| #2 | Landing page redesign |
| #3 | Dashboard & app shell |
| #4 | Consultation flow with smart questions |
| #5 | Remedy database with evidence ratings |
| #6 | Supabase authentication |
| #7 | Database for consultations & usage limits |
| #8 | Performance fixes (fonts, null handling) |
| #9 | Polish, Stripe, mobile responsiveness |
| #10 | Production readiness audit (security, a11y) |
| #11 | Audit round 2 (fail-closed, React.memo) |
| #12 | Audit round 3 (rate limiting, type guards) |

## Architecture Decisions

- **Server/Client Split** — Pages are server components for metadata, with client `*Content.tsx` components for interactivity
- **Fail-Closed Security** — Database errors deny access rather than allow bypass
- **Rate Limiting** — In-memory rate limiter (upgradeable to Redis)
- **Type Guards** — Centralized protocol type detection for backward compatibility
- **Dev-Only Logging** — Production logs don't leak sensitive data

## Deployment

The app is designed for Vercel deployment:

```bash
# Build
npm run build

# The app uses Edge Runtime for middleware
```

Required Vercel environment variables:
- All variables from `.env.local.example`
- Set up Stripe webhook endpoint: `https://your-domain.com/api/stripe/webhook`

## License

Proprietary - All rights reserved

---

Built with Next.js 14, TypeScript, Tailwind CSS, Supabase, and Stripe
