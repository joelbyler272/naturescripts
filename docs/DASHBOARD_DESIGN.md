# Dashboard Design Decisions

*Based on Ramp.com analysis - January 25, 2026*

## Navigation Pattern: Hybrid Approach

### What Ramp Does
- Left sidebar for authenticated users
- Collapsible sections (Home → Overview, My expenses, My travel)
- User menu in top-right corner

### Our Decision: Keep Top Nav + Contextual Elements

| Aspect | Ramp | NatureScripts | Rationale |
|--------|------|---------------|-----------|
| Primary Nav | Left sidebar | **Keep top nav** | NatureScripts is consultation-focused, not transaction-heavy like Ramp |
| User Menu | Top-right dropdown | ✅ Keep as-is | Works well |
| Sub-navigation | Sidebar nested items | Tab bar or breadcrumbs | Simpler hierarchy |

### Why Not Full Sidebar?
- Ramp users navigate between many sections frequently (expenses, travel, cards)
- NatureScripts users primarily: Start consultation → Review protocol → Track progress
- A sidebar adds complexity without proportional benefit for our use case

### What We're Adopting from Ramp
- ✅ Personalized greeting header
- ✅ Action-oriented quick actions (like Ramp's "Request" button panel)
- ✅ Activity feed with recent items
- ✅ Empty state handling ("You're all caught up!")

---

## Route Structure: Keep /dashboard

| Route | Purpose |
|-------|---------|
| `/dashboard` | Main home after login (keep) |
| `/consultation` | Start/manage consultations |
| `/protocols` | View saved protocols |
| `/tracking` | Health tracking (Pro) |
| `/settings` | User settings |

The `/dashboard` vs `/home` choice is mostly semantic. Our current structure is cleaner since we have a marketing `/` (home) route.

---

## Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│  [Logo]  Dashboard  Protocols  Library       [User ▾]   │  ← Top Nav (keep)
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Good morning, Joel 👋                                  │  ← Personalized greeting
│  Ready for your next consultation?                      │
│                                                         │
│  ┌─────────────────────────────────┐  ┌──────────────┐ │
│  │ [Prompt/Banner]                 │  │ Quick Actions│ │  ← Right sidebar
│  │ Complete your health profile    │  │              │ │
│  │ to get better recommendations   │  └──────────────┘ │
│  └─────────────────────────────────┘  │ [Start New]  │ │
│                                        │ [View Proto] │ │
│  ┌─────────────────────────────────┐  │ [Track]      │ │
│  │ You're all caught up! ✓        │  └──────────────┘ │  ← Empty state
│  │ (or active protocol progress)   │                    │
│  └─────────────────────────────────┘                    │
│                                                         │
│  Recent Consultations          [View all →]             │  ← Activity feed
│  ┌─────────────────────────────────────────────────────┐│
│  │ 🌿 Digestive Support Protocol    Jan 20 • Active    ││
│  │ 🌿 Sleep Optimization            Jan 15 • Completed ││
│  │ 🌿 Stress Management             Jan 10 • Completed ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

---

## Implementation Plan

### Files to Create/Update

**Updated:**
- `app/(app)/dashboard/page.tsx` - Main dashboard with new layout

**New Components:**
- `components/app/WelcomeHeader.tsx` - Personalized time-based greeting
- `components/app/QuickActions.tsx` - Right sidebar action panel
- `components/app/ActivityFeed.tsx` - Recent consultations list
- `components/app/ContextualBanner.tsx` - Prompts like "Complete your profile"
- `components/app/EmptyState.tsx` - "You're all caught up!" component

### Keep Existing
- Top navigation pattern
- Route structure
- Design system (sage green #6B8E7F, Inter + Crimson Pro fonts)
- DailyLimitBanner (free tier)
- ProtocolCard component

---

## Component Specifications

### WelcomeHeader
```tsx
// Time-based greeting
// Morning: "Good morning, {name} 👋"
// Afternoon: "Good afternoon, {name}"
// Evening: "Good evening, {name}"
// Subtext: Contextual based on state
// - Has active protocol: "Your {protocol_name} protocol is in progress"
// - No protocols: "Ready for your first consultation?"
// - Returning user: "Ready for your next consultation?"
```

### QuickActions
```tsx
// Sticky right sidebar (desktop) or horizontal cards (mobile)
// Actions:
// - Start New Consultation (primary, sage green)
// - View Protocols (secondary)
// - Track Progress (Pro badge if free tier)
```

### ActivityFeed
```tsx
// Recent consultations with:
// - Icon (🌿 or herb emoji)
// - Protocol title
// - Date
// - Status badge (Active, Completed)
// - Click to view protocol detail
// Max 5 items, "View all" link if more
```

### ContextualBanner
```tsx
// Dismissible prompts based on user state:
// - "Complete your health profile for better recommendations"
// - "Upgrade to Pro for unlimited consultations"
// - "Your Digestive Support protocol has been active for 7 days"
```

### EmptyState
```tsx
// When no recent activity:
// - Checkmark icon
// - "You're all caught up!"
// - Subtle CTA to start consultation
```

---

*This document serves as the source of truth for dashboard implementation.*
