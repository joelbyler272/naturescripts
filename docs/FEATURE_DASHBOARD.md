# Dashboard Feature Branch

## Overview
This branch contains dashboard-related improvements and new features for the authenticated user experience.

## Current State
The existing dashboard (`app/(app)/dashboard/page.tsx`) includes:
- Welcome header with user name
- Daily limit banner (free tier)
- Quick actions: Start Consultation, Explore Remedies
- Past consultations list with ProtocolCard components

## Key Files
```
app/(app)/
├── dashboard/page.tsx      # Main dashboard
├── consultation/page.tsx   # Consultation chat interface
├── protocols/
│   ├── page.tsx           # Protocol list
│   └── [id]/page.tsx      # Protocol detail
├── tracking/              # Pro feature: symptom tracking
├── settings/              # User settings
└── upgrade/               # Pro upgrade page

components/
├── app/                   # App-specific components
├── consultation/          # Chat interface components
├── protocol/              # Protocol display components
└── tracking/              # Tracking/charts components
```

## Data Structures
See `lib/data/hardcoded.ts` for mock data:
- `MOCK_USER` - Current user info
- `MOCK_CONSULTATIONS` - Past consultations with protocols
- `MOCK_CHAT_MESSAGES` - Chat interface messages
- `MOCK_HERBS` - Herbal database
- `MOCK_SYMPTOM_DATA` - Tracking chart data

## Development
```bash
git checkout feature/dashboard
npm run dev
# Visit http://localhost:3000/dashboard
```

## TODO
- [ ] Decide on feature priorities
- [ ] Implement chosen improvements
- [ ] Update this README with changes
