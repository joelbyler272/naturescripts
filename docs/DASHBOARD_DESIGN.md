# Dashboard Design Decisions

*Based on Ramp.com analysis - January 25, 2026*
*Updated: January 25, 2026 - Final app shell spec*

---

## App Shell Architecture

NatureScripts uses a **proper app shell** for authenticated users - not a website with navigation, but a dedicated application experience.

### Key Decisions
- ✅ Left sidebar navigation (collapsible)
- ✅ No top nav bar
- ✅ No footer
- ✅ User initials avatar for settings/profile
- ✅ Time-based personalized greeting

---

## Layout Specification

### Expanded Sidebar
```
┌────────────────┬─────────────────────────────────────────────┐
│                │                                         [JB]│
│  NS            │                                             │
│                │  Good morning, Joel                         │
│  ────────────  │                                             │
│                │                                             │
│  [≡] Dashboard │  ┌─────────────────────────────────────────┐│
│  [📋] Protocols│  │                                         ││
│  [📚] Library  │  │  Main Content Area                      ││
│  [📈] Tracking │  │                                         ││
│                │  │                                         ││
│                │  └─────────────────────────────────────────┘│
│                │                                             │
│  ────────────  │                                             │
│  [◀] Collapse  │                                             │
└────────────────┴─────────────────────────────────────────────┘
```

### Collapsed Sidebar
```
┌────┬──────────────────────────────────────────────────────────┐
│ NS │                                                      [JB]│
│    │                                                          │
│ ── │  Good morning, Joel                                      │
│[≡] │                                                          │
│[📋]│  ┌──────────────────────────────────────────────────────┐│
│[📚]│  │                                                      ││
│[📈]│  │  Main Content Area                                   ││
│    │  │                                                      ││
│    │  └──────────────────────────────────────────────────────┘│
│ ── │                                                          │
│[▶] │                                                          │
└────┴──────────────────────────────────────────────────────────┘
```

---

## Element Specifications

### Left Sidebar

| Element | Spec |
|---------|------|
| **Width (expanded)** | 240px |
| **Width (collapsed)** | 64px |
| **Background** | White or very light grey |
| **Border** | Right border, subtle (border-border/50) |

### NS Logo
- **Design:** "N" in black (font-bold), "S" in sage green (font-normal)
- **Behavior:** Clicks to `/dashboard` (home)
- **Position:** Top of sidebar

### Navigation Items
| Route | Label | Icon |
|-------|-------|------|
| `/dashboard` | Dashboard | LayoutDashboard or Home |
| `/protocols` | Protocols | FileText or ClipboardList |
| `/remedies` | Library | BookOpen or Library |
| `/tracking` | Tracking | TrendingUp or Activity |

- Active state: Sage green background tint, sage text
- Hover state: Light grey background
- Collapsed: Icons only, tooltip on hover

### Collapse Button
- **Position:** Bottom of sidebar
- **Expanded state:** Shows "Collapse" with left arrow
- **Collapsed state:** Shows right arrow only
- **Behavior:** Toggles sidebar width, saves preference to localStorage

### User Avatar (JB)
- **Position:** Top-right corner of main content area
- **Design:** Circle with user initials, sage green background, white text
- **Size:** 40px diameter
- **Behavior:** Opens dropdown or navigates to `/settings`
- **Dropdown options:** Settings, Profile, Sign out

### Greeting
- **Logic:**
  - 5am - 12pm: "Good morning, {firstName}"
  - 12pm - 5pm: "Good afternoon, {firstName}"
  - 5pm - 5am: "Good evening, {firstName}"
- **Position:** Top of main content area, below user avatar line
- **Typography:** text-2xl or text-3xl, font-semibold

---

## Main Content Area

### Dashboard (`/dashboard`)
Primary content when user lands:

1. **Greeting header** (as specified above)
2. **Active Protocol Card** (if user has one in progress)
   - Protocol name
   - Days active
   - Quick actions (View, Log symptoms)
3. **Quick Actions** (if no active protocol)
   - Start New Consultation (primary CTA)
   - Browse Library
4. **Recent Consultations** (activity feed)
   - List of past protocols
   - Date, status badge (Active/Completed)
   - Click to view details
5. **Daily Limit Banner** (free tier only)
   - Shows X/3 consultations used today

---

## Mobile Behavior

| Viewport | Sidebar Behavior |
|----------|------------------|
| Desktop (>1024px) | Sidebar visible, collapsible |
| Tablet (768-1024px) | Sidebar collapsed by default |
| Mobile (<768px) | Sidebar hidden, hamburger menu opens as overlay |

---

## Files to Create

### New App Layout
- `app/(app)/layout.tsx` - App shell with sidebar

### New Components
- `components/app/AppSidebar.tsx` - Collapsible left sidebar
- `components/app/NSLogo.tsx` - NS logo component
- `components/app/UserAvatar.tsx` - Initials circle with dropdown
- `components/app/WelcomeHeader.tsx` - Time-based greeting
- `components/app/ActiveProtocolCard.tsx` - Current protocol status
- `components/app/ActivityFeed.tsx` - Recent consultations list

### Updated
- `app/(app)/dashboard/page.tsx` - New dashboard layout

### Keep Existing
- `components/app/DailyLimitBanner.tsx`
- `components/protocol/ProtocolCard.tsx`

---

## Design Tokens

```tsx
// Sidebar
const SIDEBAR_WIDTH_EXPANDED = 240;
const SIDEBAR_WIDTH_COLLAPSED = 64;

// Colors (from existing design system)
const sage = '#6B8E7F';
const sageLight = '#E8F0EC';

// Transitions
const SIDEBAR_TRANSITION = 'width 200ms ease-in-out';
```

---

*This document is the source of truth for dashboard implementation.*
