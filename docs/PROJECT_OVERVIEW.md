# NatureScripts - Project Overview

## Vision
NatureScripts is an AI-powered naturopathic consultation platform that provides personalized herbal protocols based on user symptoms and health concerns. Think of it as having a knowledgeable herbalist available 24/7.

## Core Value Proposition
- **~3 minute consultations** - Quick, conversational AI intake
- **3-part protocols** - Herbs, diet changes, lifestyle adjustments
- **150+ herb database** - Evidence-based recommendations with safety checks
- **Not a replacement for doctors** - Educational tool, always includes disclaimers

## Target Users
1. **Health-curious individuals** - Want natural approaches but don't know where to start
2. **Supplement skeptics** - Need evidence-based reasoning, not just "take this herb"
3. **Busy professionals** - Don't have time for lengthy naturopath appointments
4. **Cost-conscious** - Can't afford $200+ consultations regularly

## Business Model
- **Free Tier:** 3 consultations/day, basic protocol output, herb database access
- **Pro Tier ($9/month):** Unlimited consultations, symptom tracking, progress insights, protocol history

---

## Product Structure

### Marketing Site (Public)
- Landing page - Convert visitors to users
- Remedy database - SEO, builds trust, shows expertise
- Herb library - Educational content

### Web App (Authenticated)
- **Home/Dashboard** - Starting point, show recent activity, quick actions
- **Consultation** - AI chat interface, the core product
- **Protocols** - Saved consultation results, can revisit
- **Tracking (Pro)** - Log symptoms, see progress over time
- **Settings** - Account, preferences
- **Upgrade** - Free → Pro conversion

---

## Design Philosophy

### Inspired By
- **Superpower.com** - Clean, premium health tech aesthetic
- **Ramp** - Web app structure, sidebar navigation, activity-focused dashboard

### Design System
- **Primary Color:** Sage green (#6B8E7F) - Used sparingly as accent
- **Typography:** Inter (UI) + Crimson Pro (headings)
- **Aesthetic:** Clean, trustworthy, medical-but-approachable
- **Spacing:** Generous whitespace, 112px section padding on marketing pages

### Key Principles
1. **Trust first** - This is health-related, must feel credible
2. **Simplicity** - Don't overwhelm with options
3. **Action-oriented** - Always clear what to do next
4. **Safety prominent** - Disclaimers, contraindications visible

---

## Current Development Status

### Completed
- [x] Initial Next.js setup with Tailwind + shadcn/ui
- [x] Folder structure reorganization (app groups)
- [x] Basic routing and page shells
- [x] Mock data for development
- [x] Design system (colors, fonts)

### In Progress
- [ ] Landing page redesign (PR #2 - feature/landing-page-redesign)
- [ ] Dashboard/web app experience (PR #3 - feature/dashboard)

### Upcoming
- [ ] Consultation chat interface improvements
- [ ] Protocol output design
- [ ] Authentication (Clerk or similar)
- [ ] AI integration (Claude API)
- [ ] Database (likely Supabase)
- [ ] Payment (Stripe)

---

## Repository Structure

```
naturescripts/
├── app/
│   ├── (marketing)/     # Landing page
│   ├── (public)/        # Remedies, library (no auth required)
│   ├── (app)/           # Dashboard, consultation, protocols (auth required)
│   └── (legal)/         # Privacy, terms
├── components/
│   ├── app/             # App-specific (Navigation, DailyLimitBanner)
│   ├── consultation/    # Chat interface
│   ├── protocol/        # Protocol display
│   ├── tracking/        # Charts, symptom logging
│   ├── landing/         # Marketing page components
│   ├── shared/          # Used everywhere
│   └── ui/              # shadcn/ui primitives
├── lib/
│   ├── constants/       # Routes, colors
│   └── data/            # Mock/hardcoded data
└── docs/                # Project documentation
```

---

## Open Questions / Decisions Needed

### Navigation Pattern
- Current: Top navigation for authenticated users
- Considering: Left sidebar (like Ramp) for better scalability

### Route Naming
- Current: `/dashboard`
- Considering: `/home` (more welcoming, like Ramp)

### Subdomain vs Path
- Current: `naturescripts.com/dashboard`
- Considering: `app.naturescripts.com` (cleaner separation)

---

## Links

- **Repository:** https://github.com/joelbyler272/naturescripts
- **PR #2 (Landing Page):** https://github.com/joelbyler272/naturescripts/pull/2
- **PR #3 (Dashboard):** https://github.com/joelbyler272/naturescripts/pull/3

---

*Last updated: January 25, 2026*
