# Design Guidelines - Itamar Imóveis: Sistema de Status de Corretores

## Design Approach
**System-Based Approach:** Material Design principles adapted for administrative productivity tool
- Justification: Utility-focused internal application requiring efficiency, clarity, and immediate learnability
- Primary Goal: Enable secretaries to quickly update and monitor broker status with zero friction
- Visual Priority: Functional clarity over decorative elements

## Core Design Elements

### A. Color Palette

**Dark Mode Primary Colors:**
- Background: 220 15% 12% (deep slate)
- Surface: 220 15% 18% (elevated slate)
- Surface Variant: 220 12% 22% (cards/components)

**Status Colors (Critical for Function):**
- Online: 142 76% 45% (vibrant green) 
- Offline: 0 72% 55% (clear red)
- Idle/Away: 45 93% 58% (amber warning)

**Brand Accent:**
- Primary: 210 100% 50% (professional blue - real estate trust)
- On Primary: 0 0% 100% (white text)

**Light Mode:**
- Background: 210 20% 98%
- Surface: 0 0% 100%
- Primary: 210 85% 45%

### B. Typography

**Font Stack:**
- Primary: 'Inter' via Google Fonts (clean, professional, excellent readability)
- Fallback: -apple-system, system-ui, sans-serif

**Type Scale:**
- Headings: 600 weight, tracking-tight
- Body: 400 weight, line-height relaxed (1.6)
- Labels: 500 weight, text-sm, uppercase tracking-wide
- Status badges: 600 weight, text-xs

### C. Layout System

**Spacing Primitives:**
- Core units: p-2, p-4, p-6, p-8 (doubling scale)
- Consistent gap spacing: gap-4 for lists, gap-6 for major sections
- Container: max-w-7xl mx-auto px-4

**Grid Structure:**
- Desktop: 3-column broker cards (grid-cols-3)
- Tablet: 2-column (md:grid-cols-2)
- Mobile: Single column (grid-cols-1)

### D. Component Library

**Broker Status Cards:**
- Elevated surface with subtle shadow
- Large circular avatar (64px diameter)
- Prominent status indicator (12px dot, absolute positioned top-right of avatar)
- Toggle switch (modern iOS-style) for quick status change
- Hover state: subtle scale (scale-105) and shadow increase

**Status Indicators:**
- Badge style: Rounded-full pill with icon + text
- Online: Green dot + "Online" text
- Offline: Red dot + "Offline" text  
- Position: Overlaid on avatar or adjacent

**Action Buttons:**
- Primary: Filled blue button for main actions (Add Broker)
- Secondary: Outline style for edit operations
- Destructive: Red outline for delete
- Size: py-2.5 px-6 (comfortable touch targets)

**Data Display:**
- Clean table alternative: Card-based list view
- Each card contains: Avatar, Name (text-lg font-semibold), Status badge, Toggle control
- Secondary info (email, phone) in muted text-sm below name

**Navigation:**
- Simple top bar: Logo left, action buttons right
- No complex navigation needed (single-page dashboard)

### E. Interactive Patterns

**Real-time Updates:**
- Smooth transition when status changes (transition-all duration-300)
- Visual feedback: Brief pulse animation on status badge when updated
- Toast notifications in top-right for successful operations

**Toggle Interaction:**
- Large, accessible switch component (min 48px touch target)
- Immediate visual feedback on click
- Color change matches new status (green/red)
- No confirmation needed for toggle (instant update)

**Loading States:**
- Skeleton screens for initial load (pulse animation)
- Spinner only for explicit actions (adding/deleting brokers)

## Functional Design Priorities

**Dashboard Layout:**
- Header: "Itamar Imóveis - Status de Corretores" + Add Broker button
- Filter tabs: All / Online / Offline (quick filtering)
- Main area: Grid of broker cards with real-time status
- Empty state: Helpful illustration + "Adicionar Primeiro Corretor" CTA

**Status Management:**
- One-click toggle is primary interaction (largest visual element on card)
- Visual distinction must be immediate (color + icon + text)
- Current status always clearly visible before interaction

**Administrative Functions:**
- "Adicionar Corretor" modal: Simple form (Name, Email, Phone, Photo URL)
- Edit: Inline or modal with same form fields
- Delete: Confirmation modal to prevent accidents

**Accessibility:**
- High contrast ratios (WCAG AA minimum)
- Toggle switches keyboard accessible
- Clear focus indicators (ring-2 ring-blue-500)
- Status communicated via color + icon + text (not color alone)

## Images

**No hero image required** - This is a functional dashboard tool, not a marketing page. Focus visual budget on:
- Broker profile photos (user-uploaded or default avatar SVG)
- Empty state illustration (friendly graphic encouraging first broker addition)
- Status icons (Heroicons: CheckCircle for online, XCircle for offline)

**Icon Library:** Heroicons (outline style for UI chrome, solid for status indicators)