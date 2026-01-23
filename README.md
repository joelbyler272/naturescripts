# NatureScripts - AI-Powered Naturopathic Consultation Platform

## Phase 1: Skeleton Build (COMPLETE)

This is a fully navigable Next.js skeleton app with all pages, components, and UI elements built out. No backend logic has been implemented yet - this phase focuses on the complete user experience with hardcoded data.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Charts:** Recharts
- **Icons:** Lucide React
- **Font:** Inter (Google Fonts)

## Design System

### Colors
- **Primary (Sage):** `#6B8E7F` - Main brand color
- **Secondary (Earth):** `#C9A66B` - Accent earth tones
- **Accent (Forest):** `#2F4F4F` - Deep forest green
- **Background (Cream):** `#FAFAF8` - Off-white background
- **Text (Charcoal):** `#2C2C2C` - Dark gray text

### Typography
- **Font Family:** Inter
- **Headings:** Bold
- **Body:** Normal weight

## Project Structure

```
naturescripts/
├── app/
│   ├── (auth)/              # Auth pages (sign-up, sign-in, verify-email)
│   ├── (dashboard)/         # Authenticated pages
│   │   ├── dashboard/       # Main dashboard
│   │   ├── consultation/    # AI consultation chat
│   │   ├── protocol/[id]/   # Protocol display
│   │   ├── herbs/           # Herbal database
│   │   ├── tracking/        # Progress tracking (Pro)
│   │   ├── upgrade/         # Pricing page
│   │   └── settings/        # User settings
│   ├── terms/               # Legal pages
│   ├── privacy/
│   ├── disclaimer/
│   ├── api/                 # Placeholder API routes
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── landing/             # Landing page sections
│   ├── consultation/        # Consultation components
│   ├── protocol/            # Protocol display components
│   ├── tracking/            # Tracking components
│   └── shared/              # Reusable components
├── lib/
│   ├── data/               # Hardcoded data
│   ├── supabase/           # Supabase client (placeholder)
│   ├── stripe/             # Stripe client (placeholder)
│   ├── anthropic/          # Anthropic API client (placeholder)
│   └── utils/              # Utility functions
├── types/
│   └── index.ts            # TypeScript type definitions
└── .env.local.example      # Environment variable template
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Explore the App

#### Public Pages (No Auth Required)
- `/` - Landing page with hero, features, testimonials, FAQ
- `/sign-up` - Sign up form (non-functional)
- `/sign-in` - Sign in form (non-functional)
- `/verify-email` - Email verification waiting page
- `/terms` - Terms of Service
- `/privacy` - Privacy Policy
- `/disclaimer` - Medical Disclaimer

#### Authenticated Pages (Skeleton assumes logged in)
- `/dashboard` - Main dashboard with past consultations
- `/consultation` - AI consultation chat interface (hardcoded messages)
- `/protocol/[id]` - Detailed protocol display
- `/herbs` - Herbal database with search
- `/herbs/[slug]` - Individual herb detail page (e.g., `/herbs/ashwagandha`)
- `/tracking` - Progress tracking dashboard (Pro feature)
- `/upgrade` - Pro tier upgrade page
- `/settings` - User settings (profile, billing, account)

## Hardcoded Data

All data is currently hardcoded in `lib/data/hardcoded.ts`:

- **User:** Free tier user named "Jordan"
- **Consultations:** 2 past consultations with full protocols
- **Herbs:** 5 herbs (Ashwagandha, Rhodiola, Turmeric, Ginger, Milk Thistle)
- **Chat Messages:** Example consultation conversation
- **Symptom Data:** 7 days of tracking data for charts
- **Testimonials:** 3 user testimonials
- **FAQ:** 5 common questions

## Key Features Built

### Landing Page
- Hero section with search bar
- How It Works (4 steps)
- Testimonials (3 cards)
- FAQ (accordion)
- CTA section

### Dashboard
- Daily limit banner (Free tier)
- Quick actions (Start consultation, Browse herbs)
- Past consultations list
- Protocol cards

### Consultation
- Chat interface with user/AI messages
- Message input and send
- Privacy notice

### Protocol Display
- Pattern analysis
- Herbal recommendations with dosages
- Dietary shifts (add/remove)
- Lifestyle practices
- Testing recommendations
- Safety warnings and disclaimers

### Herbal Database
- Search functionality
- Herb cards with evidence levels
- Detailed herb pages with:
  - Benefits
  - Dosage
  - Contraindications
  - Drug interactions
  - Side effects

### Tracking (Pro Feature)
- Tabbed interface (Symptoms, Supplements, Habits)
- Line chart with symptom trends
- Progress insights
- Adherence tracking

### Settings
- Profile management
- Subscription/billing
- Account security
- Delete account

## What's NOT Implemented (Phase 2)

- Authentication (Supabase)
- API routes logic
- Database operations
- AI consultation with Anthropic
- Stripe checkout
- Email sending
- PDF generation
- User session management
- Data validation
- Error handling
- Loading states

## Environment Setup (For Phase 2)

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

You'll need:
- Supabase project credentials
- Anthropic API key
- Stripe API keys and webhook secret
- Resend API key for emails

## Database Schema (For Phase 2)

See `types/index.ts` for the complete type definitions. Key tables to create in Supabase:

- `users`
- `consultations`
- `daily_usage`
- `subscriptions`
- `symptom_tracking`
- `supplement_tracking`
- `habit_tracking`
- `herb_database`

## Design Principles

- **Health-focused:** Calming sage green color palette
- **Trustworthy:** Clear disclaimers and safety information
- **Professional:** Clean, modern UI with proper medical disclaimers
- **Accessible:** Good contrast, clear typography, responsive design

## Next Steps (Phase 2)

1. Set up Supabase database and tables
2. Implement authentication flows
3. Connect Anthropic API for AI consultations
4. Add Stripe payment integration
5. Implement email sending with Resend
6. Add PDF generation for protocols
7. Implement progress tracking data persistence
8. Add error handling and loading states
9. Set up middleware for protected routes
10. Deploy to production

## Notes

- All forms currently just console.log() on submit
- Navigation assumes user is logged in for dashboard routes
- API routes return 501 (Not Implemented) status
- No actual data persistence
- Pro features are visible to all users in skeleton

## License

Proprietary - All rights reserved

---

Built with Next.js 14, TypeScript, and Tailwind CSS
