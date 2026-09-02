# Smart Campus Network Monitoring System — Phase 1 Implementation Plan

## Overview

Build a polished, professional, modern React web application for a college Data Communication project. Phase 1 focuses on:

- Beautiful UI with a consistent, premium design system
- Firebase Authentication (email/password)
- Role-based experience (Admin vs User)
- Complete navigation and page structure
- Realistic mock monitoring data (no real backend)

The architecture is designed to cleanly accept a Flask monitoring backend in Phase 2 without any UI redesign.

---

## Open Questions

> [!IMPORTANT]
> **Firebase Project**: Do you already have a Firebase project created? If yes, please share the config values so they can be placed in the `.env` file. If no, I'll create placeholder config with clear instructions on where to fill them in.

> [!IMPORTANT]
> **Role Assignment Strategy (Phase 1)**: Since Firebase doesn't have a built-in role field, for Phase 1 the plan is to store user role in Firebase `displayName` metadata or use a simple hardcoded email-based admin detection (e.g., any email ending in `@admin.campus.edu` is admin). Which approach do you prefer?
> - Option A: First registered user OR emails containing `+admin` are treated as Admin (dev-only flag)
> - Option B: Specific hardcoded admin email(s) (you provide them)
> - Option C: Role stored in Firebase Firestore `users` collection (requires Firestore enabled)

> [!NOTE]
> **Phase 1 Scope Confirmed**: No Flask, no real LAN scanning, no SQLite, no real PC monitoring. All device/lab/alert data is mock. Firebase Auth is the only real backend service.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 + Vite |
| Routing | React Router v6 |
| Authentication | Firebase Authentication (email/password) |
| Styling | Vanilla CSS with CSS Custom Properties (design tokens) |
| Icons | Lucide React |
| Charts (Reports page) | Recharts |
| State Management | React Context (Auth + UI state) |
| Build Tool | Vite |
| Package Manager | npm |

---

## Project Structure

```
campus-pc-watch/
├── public/
│   └── favicon.svg              # Custom network/campus icon
├── src/
│   ├── main.jsx                 # Entry point
│   ├── App.jsx                  # Root component + routing
│   │
│   ├── styles/
│   │   ├── index.css            # Global reset + design tokens
│   │   ├── components.css       # Shared component styles
│   │   └── animations.css       # Micro-interaction keyframes
│   │
│   ├── firebase/
│   │   ├── config.js            # Firebase init (reads from .env)
│   │   └── auth.js              # Auth helper functions (login, register, logout, resetPassword)
│   │
│   ├── auth/
│   │   ├── AuthContext.jsx      # React Context for auth state
│   │   └── useAuth.js           # Custom hook
│   │
│   ├── routes/
│   │   ├── PublicRoute.jsx      # Redirect authenticated users away from /login
│   │   ├── ProtectedRoute.jsx   # Require auth, redirect to /login if not
│   │   └── RoleRoute.jsx        # Require specific role, redirect if wrong role
│   │
│   ├── mock/
│   │   ├── mockDevices.js       # 100 mock PCs across labs
│   │   ├── mockLabs.js          # Lab definitions with PC counts
│   │   ├── mockAlerts.js        # Mock alert records
│   │   ├── mockHistory.js       # Mock monitoring history/timeline
│   │   ├── mockUsers.js         # Mock user account records
│   │   └── mockReports.js       # Mock report statistics
│   │
│   ├── services/
│   │   └── dataService.js       # Abstraction layer — currently returns mock data,
│   │                            # future: replace with Firebase/API calls
│   │
│   ├── hooks/
│   │   ├── useDevices.js        # Hook to get devices (via dataService)
│   │   ├── useLabs.js           # Hook to get labs
│   │   ├── useAlerts.js         # Hook to get alerts
│   │   ├── useHistory.js        # Hook to get history
│   │   └── useReports.js        # Hook to get reports
│   │
│   ├── utils/
│   │   ├── formatters.js        # Time, date, status formatters
│   │   ├── statusUtils.js       # Status color/icon mapping
│   │   └── validators.js        # Form validation helpers
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── StatusBadge.jsx      # Online/Offline/Warning badge
│   │   │   ├── StatCard.jsx         # Summary number card (Total PCs, Online…)
│   │   │   ├── SearchInput.jsx      # Controlled search with icon
│   │   │   ├── FilterDropdown.jsx   # Select dropdown with label
│   │   │   ├── Modal.jsx            # Generic accessible modal
│   │   │   ├── ConfirmDialog.jsx    # Delete confirmation modal
│   │   │   ├── Toast.jsx            # Toast notification system
│   │   │   ├── LoadingState.jsx     # Spinner + label
│   │   │   ├── EmptyState.jsx       # Empty illustration + message
│   │   │   └── ErrorState.jsx       # Error display with retry
│   │   │
│   │   ├── layout/
│   │   │   ├── AppShell.jsx         # Authenticated layout wrapper
│   │   │   ├── Sidebar.jsx          # Desktop sidebar (collapsible)
│   │   │   ├── Topbar.jsx           # Top navigation bar
│   │   │   ├── PageHeader.jsx       # Page title + breadcrumb
│   │   │   └── Breadcrumbs.jsx      # Navigation breadcrumb
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DeviceTable.jsx      # Live device status table
│   │   │   ├── LabOverview.jsx      # Lab summary list/grid
│   │   │   ├── AlertCard.jsx        # Single alert item
│   │   │   └── ActivityItem.jsx     # Single activity timeline item
│   │   │
│   │   ├── devices/
│   │   │   ├── DeviceCard.jsx       # Card view of a single device
│   │   │   ├── DeviceForm.jsx       # Add/Edit device form
│   │   │   └── DeviceDetailPanel.jsx# Expanded device detail
│   │   │
│   │   └── common/
│   │       ├── ProfileMenu.jsx      # Topbar avatar/profile dropdown
│   │       └── LabCard.jsx          # Lab overview card
│   │
│   ├── layouts/
│   │   ├── AuthLayout.jsx       # Centered card layout for auth pages
│   │   └── DashboardLayout.jsx  # Sidebar + topbar + content layout
│   │
│   └── pages/
│       ├── public/
│       │   ├── LandingPage.jsx      # Public homepage
│       │   ├── LoginPage.jsx        # Login screen
│       │   ├── RegisterPage.jsx     # Registration screen
│       │   └── ForgotPasswordPage.jsx
│       │
│       ├── admin/
│       │   ├── AdminDashboard.jsx   # Main admin dashboard
│       │   ├── AdminDevices.jsx     # Device management table
│       │   ├── AdminDeviceDetail.jsx# Individual device detail
│       │   ├── AdminLabs.jsx        # Lab overview
│       │   ├── AdminAlerts.jsx      # Alert management
│       │   ├── AdminHistory.jsx     # Monitoring history
│       │   ├── AdminReports.jsx     # Reports + charts
│       │   ├── AdminUsers.jsx       # User list (admin only)
│       │   ├── AdminSettings.jsx    # Settings page
│       │   └── AdminProfile.jsx     # Admin profile
│       │
│       └── user/
│           ├── UserDashboard.jsx    # Read-only user dashboard
│           ├── UserDevices.jsx      # Read-only device list
│           ├── UserLabs.jsx         # Read-only lab view
│           ├── UserAlerts.jsx       # Read-only alerts
│           ├── UserHistory.jsx      # Read-only history
│           ├── UserReports.jsx      # Read-only reports
│           └── UserProfile.jsx      # User profile page
│
├── .env                         # Firebase config (gitignored)
├── .env.example                 # Template for .env
├── .gitignore                   # Gitignore (node_modules, .env, dist)
├── index.html
├── vite.config.js
└── package.json
```

---

## Design System

### Color Palette (CSS Custom Properties)

```css
/* Neutrals */
--color-bg:          #0f1117    /* Page background — very dark navy */
--color-surface:     #161b27    /* Card/panel surface */
--color-surface-2:   #1e2536    /* Elevated surface (modals, dropdowns) */
--color-border:      #2a3147    /* Subtle borders */
--color-border-light:#35405a    /* Hovered borders */

/* Text */
--color-text-primary:  #e8ecf0  /* Main readable text */
--color-text-secondary:#8a9bb8  /* Labels, secondary info */
--color-text-muted:    #5a6785  /* Timestamps, captions */

/* Brand Accent */
--color-accent:       #3b82f6   /* Primary blue — buttons, links, active nav */
--color-accent-dim:   #1d4ed8   /* Darker accent for hover */
--color-accent-glow:  rgba(59, 130, 246, 0.12)  /* Subtle accent glow bg */

/* Status */
--color-online:       #22c55e   /* Online green */
--color-online-bg:    rgba(34, 197, 94, 0.1)
--color-offline:      #ef4444   /* Offline red */
--color-offline-bg:   rgba(239, 68, 68, 0.1)
--color-warning:      #f59e0b   /* Warning amber */
--color-warning-bg:   rgba(245, 158, 11, 0.1)
--color-info:         #60a5fa   /* Info blue */
--color-info-bg:      rgba(96, 165, 250, 0.1)

/* Typography */
--font-sans: 'Inter', system-ui, sans-serif
--font-mono: 'JetBrains Mono', 'Fira Code', monospace

/* Spacing scale */
--space-1: 4px;   --space-2: 8px;   --space-3: 12px;
--space-4: 16px;  --space-5: 20px;  --space-6: 24px;
--space-8: 32px;  --space-10: 40px; --space-12: 48px;
--space-16: 64px;

/* Border radius */
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px

/* Shadows */
--shadow-sm: 0 1px 3px rgba(0,0,0,0.4)
--shadow-md: 0 4px 16px rgba(0,0,0,0.35)
--shadow-lg: 0 8px 32px rgba(0,0,0,0.4)

/* Transitions */
--transition-fast: 150ms ease
--transition-normal: 250ms ease
```

### Typography Scale

| Token | Size | Weight | Use |
|---|---|---|---|
| `--text-xs` | 11px | 400 | Captions, timestamps |
| `--text-sm` | 13px | 400/500 | Table cells, labels |
| `--text-base` | 15px | 400 | Body text |
| `--text-lg` | 18px | 500/600 | Card headings |
| `--text-xl` | 22px | 600 | Page section headings |
| `--text-2xl` | 28px | 700 | Stat numbers |
| `--text-3xl` | 36px | 700 | Auth headings |
| `--text-hero` | 52px | 800 | Landing hero |

---

## Mock Data Design

### mockDevices.js
100 PCs across 4 labs. Mix of statuses:
- Lab 1 (Computer Lab 1): PC-001 → PC-025 (24 online, 1 offline)
- Lab 2 (Computer Lab 2): PC-026 → PC-055 (28 online, 2 offline)
- Lab 3 (Computer Lab 3): PC-056 → PC-100 (42 online, 3 offline)
- Lab 4 (Server Room): SRV-001 → SRV-005 (all online)

Each device: `{ id, name, ip, lab, labId, status, lastSeen, description, addedAt }`

### mockLabs.js
```js
{ id, name, totalPCs, online, offline, location, description }
```

### mockAlerts.js
~20 alerts mixing HIGH/WARNING/INFO severities with realistic timestamps

### mockHistory.js
~100 history entries per device showing state transitions over 24h

### mockUsers.js
~8 mock users (2 admins, 6 regular users) with name, email, role, createdAt, status

### mockReports.js
Aggregated statistics for charts: uptime %, lab-wise availability, alert frequency by day

---

## Page-by-Page Specification

### 1. Landing Page `/`
**Layout**: Full-width public page, dark theme matching dashboard.

**Sections**:
1. **Navbar** — Logo + "Sign In" button
2. **Hero** — Left: headline + CTAs. Right: mock dashboard preview card (SVG/CSS composition showing a mini device table and stat numbers, NOT an image placeholder)
3. **Features** — 4 cards in a clean grid
4. **How It Works** — Numbered steps with icons, horizontal or vertical
5. **Footer** — Logo + links + copyright

**Hero visual strategy**: Create a CSS/HTML composition that looks like a real mini-dashboard preview — a dark card with stat numbers and colored status dots. No generic illustrations.

---

### 2. Auth Pages `/login`, `/register`, `/forgot-password`
**Layout**: Split screen — left panel (brand/product context), right panel (form).

Left panel: Product name, tagline, subtle network grid pattern (CSS-only), feature bullet points.
Right panel: Clean centered form with proper validation.

**Form behavior**:
- Inline validation on blur
- Loading spinner on submit
- Firebase error messages mapped to human-readable strings
- Success toast on registration
- Password visibility toggle using eye icon

---

### 3. Admin Dashboard `/admin/dashboard`
**Layout**: AppShell (Sidebar + Topbar + Content)

**Stat Cards Row**: Total PCs (100), Online (94), Offline (6), Active Alerts (3)
Each card: icon (Lucide), large number, label, subtle colored left-border accent

**Live Device Status Table**:
- Columns: PC Name, IP Address, Lab, Status, Last Seen, (Actions for admin)
- Pagination: 10 per page
- Status badge: colored dot + text
- Row hover highlight
- Sortable columns (client-side)

**Lab Overview**: Compact cards showing lab health at a glance (progress bar showing online/total ratio)

**Recent Alerts**: Last 5 alerts as inline cards with severity colors

**Recent Activity**: Timeline of last 10 monitoring events

---

### 4. Devices Page `/admin/devices`
**Controls**: Search bar + Status filter (All/Online/Offline) + Lab filter + Sort by

**Table**: Full device table with pagination
**Actions**: View (→ detail page), Edit (opens modal), Delete (opens confirm dialog)
**Add Device button**: Opens modal form with fields: PC Name, IP Address, Lab (dropdown), Description
**Bulk operations**: Select all + delete (stretch goal if time allows)

---

### 5. Device Detail `/admin/devices/:id`
**Layout**: Back button + Two-column layout
- Left: Device info card (name, IP, lab, status, description, addedAt)
- Right: Status timeline (last 24h events as a vertical timeline)
Below: Recent alerts for this device + Monitoring summary card

---

### 6. Labs Page `/admin/labs`
**Layout**: Responsive card grid (3 columns on desktop, 2 on tablet, 1 on mobile)
Each card: Lab name, location, total/online/offline counts, inline progress bar, "View Devices" link

---

### 7. Alerts Page `/admin/alerts`
**Controls**: Severity filter (All/HIGH/WARNING/INFO) + Lab filter + Date range + Search
**List**: Clean alert rows with:
- Left: Severity badge (colored pill)
- Middle: Device name, lab, message
- Right: Timestamp
- Hover: subtle background tint
**Empty state**: "No alerts matching your filters"

---

### 8. History Page `/admin/history`
**Controls**: Device selector + Lab selector + Status filter + Date picker
**View**: Timeline view (vertical, date-grouped) and/or table toggle
**Timeline entry**: Time → Device → Status change → Duration

---

### 9. Reports Page `/admin/reports`
**Top stats**: 4 summary cards
**Charts section** (max 2 charts):
1. Bar chart: Lab-wise availability %
2. Line chart: Device online count over last 7 days
**Summary table**: Lab | Total | Online | Offline | Uptime %

---

### 10. Users Page `/admin/users`
**Table**: Name, Email, Role badge, Status (Active/Inactive), Joined date
**Mock data**: 8 users
**No backend operations** — display-only in Phase 1

---

### 11. Settings Page `/admin/settings`
**Sections** (all UI-only, no backend):
- Monitoring Preferences (poll interval placeholder)
- Notification Preferences (email alerts toggle)
- Appearance (placeholder)
- Account (change password redirect)

Each section clearly labeled "Available in Phase 2" where applicable.

---

### 12. User Dashboard `/user/dashboard`
Same visual as admin dashboard but:
- No action buttons
- No Add/Edit/Delete
- Header says "Monitoring View"
- All data is read-only

---

### 13. User Profile `/user/profile`
- Display name, email, role from Firebase Auth
- Logout button
- "Reset Password" sends Firebase password reset email
- Account created date

---

## Route Architecture

```
App.jsx
├── <PublicRoute>  (redirect to dashboard if authenticated)
│   ├── /                     → LandingPage
│   ├── /login                → LoginPage
│   ├── /register             → RegisterPage
│   └── /forgot-password      → ForgotPasswordPage
│
├── <ProtectedRoute>  (require auth)
│   ├── <RoleRoute role="admin">
│   │   ├── /admin/dashboard  → AdminDashboard
│   │   ├── /admin/devices    → AdminDevices
│   │   ├── /admin/devices/:id → AdminDeviceDetail
│   │   ├── /admin/labs       → AdminLabs
│   │   ├── /admin/alerts     → AdminAlerts
│   │   ├── /admin/history    → AdminHistory
│   │   ├── /admin/reports    → AdminReports
│   │   ├── /admin/users      → AdminUsers
│   │   ├── /admin/settings   → AdminSettings
│   │   └── /admin/profile    → AdminProfile
│   │
│   └── <RoleRoute role="user">
│       ├── /user/dashboard   → UserDashboard
│       ├── /user/devices     → UserDevices
│       ├── /user/labs        → UserLabs
│       ├── /user/alerts      → UserAlerts
│       ├── /user/history     → UserHistory
│       ├── /user/reports     → UserReports
│       └── /user/profile     → UserProfile
│
└── * → 404 / redirect
```

---

## Firebase Authentication Integration

### `firebase/config.js`
- Reads all config from `import.meta.env.VITE_FIREBASE_*` variables
- Initializes Firebase app + Auth

### `firebase/auth.js`
```js
export const signIn(email, password)
export const signUp(email, password, displayName)
export const signOut()
export const sendPasswordReset(email)
export const getCurrentUser()
export const onAuthStateChange(callback)
```

### `auth/AuthContext.jsx`
- Provides: `{ user, userRole, loading, login, register, logout, resetPassword }`
- Role determination strategy (Phase 1): stored as custom claim via `displayName` field convention OR email-based admin detection
- Wraps entire app so all components can access auth state

### Role Assignment (Phase 1 Dev Strategy)
Admin detection: If the registered email contains `admin` as a subdomain (e.g., `admin@campus.edu`) OR matches a configurable list in `.env`:
```
VITE_ADMIN_EMAILS=admin@campus.edu,superadmin@campus.edu
```
This allows development without Firestore while keeping the architecture clean for Phase 2 Firestore-based role management.

---

## Component Inventory

### Reusable UI Components

| Component | Props | Notes |
|---|---|---|
| `StatusBadge` | `status: 'online'|'offline'|'warning'` | Dot + text, accessible |
| `StatCard` | `icon, value, label, trend?, variant?` | For dashboard summaries |
| `SearchInput` | `value, onChange, placeholder` | With search icon |
| `FilterDropdown` | `label, options, value, onChange` | Styled select |
| `Modal` | `isOpen, onClose, title, children` | Focus trap, backdrop |
| `ConfirmDialog` | `isOpen, onClose, onConfirm, message` | Delete confirmation |
| `Toast` | Auto-managed via context | Entrance/exit animation |
| `LoadingState` | `message?` | Spinner + text |
| `EmptyState` | `icon, title, message, action?` | For empty lists |
| `ErrorState` | `message, onRetry?` | Error display |
| `PageHeader` | `title, breadcrumbs?, actions?` | Top of every page |

### Layout Components

| Component | Description |
|---|---|
| `AppShell` | Combines Sidebar + Topbar + main content area |
| `Sidebar` | Navigation links + logo, collapsible, mobile drawer |
| `Topbar` | Page title area, search, notifications, profile menu |
| `AuthLayout` | Split-screen wrapper for auth pages |
| `ProfileMenu` | Dropdown with profile/logout options |

---

## Micro-interactions Specification

| Interaction | Behavior |
|---|---|
| Button hover | `translateY(-1px)` + slightly brighter background, 150ms |
| Card hover | `box-shadow` increases subtly, `translateY(-2px)`, 200ms |
| Table row hover | Light background tint (`--color-surface-2`) |
| Sidebar active item | Accent background + left border indicator |
| Sidebar collapse | Smooth `width` transition 250ms, icon-only mode |
| Modal open | Fade in + scale from 0.96 to 1.0, 200ms |
| Modal close | Fade out + scale to 0.96, 150ms |
| Toast entrance | Slide in from right, 300ms |
| Toast exit | Slide out to right + fade, 250ms |
| Status badge | No animation (static, clear) |
| Page transitions | Subtle fade-in on mount, 200ms |
| Form focus | Accent border color, no jarring effects |

---

## Accessibility Checklist

- [ ] All inputs have associated `<label>` elements
- [ ] Modals trap focus correctly
- [ ] All interactive elements reachable by keyboard (`Tab`)
- [ ] Focus ring visible on all focusable elements
- [ ] Status conveyed by text + color (not color alone)
- [ ] ARIA roles on modal, navigation, alerts
- [ ] Buttons have descriptive text or `aria-label`
- [ ] Color contrast: text on backgrounds passes WCAG AA
- [ ] Forms announce errors to screen readers

---

## Proposed Changes (Files to Create)

> [!NOTE]
> All files below are **new** (empty workspace). This is a full project bootstrap.

### Infrastructure
#### [NEW] `package.json` — Vite + React + Firebase + Lucide + Recharts dependencies
#### [NEW] `vite.config.js` — Vite configuration
#### [NEW] `index.html` — HTML entry point with Inter font from Google Fonts
#### [NEW] `.env` — Firebase config (gitignored)
#### [NEW] `.env.example` — Template with all required variable names
#### [NEW] `.gitignore` — Ignore node_modules, dist, .env

---

### Styles
#### [NEW] `src/styles/index.css` — Design tokens, global reset, base styles
#### [NEW] `src/styles/components.css` — Shared component styles
#### [NEW] `src/styles/animations.css` — Keyframe animations

---

### Firebase & Auth
#### [NEW] `src/firebase/config.js` — Firebase initialization
#### [NEW] `src/firebase/auth.js` — Auth helper functions
#### [NEW] `src/auth/AuthContext.jsx` — Auth context provider
#### [NEW] `src/auth/useAuth.js` — useAuth hook

---

### Routes
#### [NEW] `src/routes/PublicRoute.jsx`
#### [NEW] `src/routes/ProtectedRoute.jsx`
#### [NEW] `src/routes/RoleRoute.jsx`

---

### Mock Data
#### [NEW] `src/mock/mockDevices.js` — 100 PCs
#### [NEW] `src/mock/mockLabs.js` — 4 labs
#### [NEW] `src/mock/mockAlerts.js` — 20 alerts
#### [NEW] `src/mock/mockHistory.js` — History entries
#### [NEW] `src/mock/mockUsers.js` — 8 users
#### [NEW] `src/mock/mockReports.js` — Report statistics

---

### Services & Hooks
#### [NEW] `src/services/dataService.js` — Data abstraction layer
#### [NEW] `src/hooks/useDevices.js`
#### [NEW] `src/hooks/useLabs.js`
#### [NEW] `src/hooks/useAlerts.js`
#### [NEW] `src/hooks/useHistory.js`
#### [NEW] `src/hooks/useReports.js`

---

### Utilities
#### [NEW] `src/utils/formatters.js`
#### [NEW] `src/utils/statusUtils.js`
#### [NEW] `src/utils/validators.js`

---

### UI Components
#### [NEW] `src/components/ui/StatusBadge.jsx`
#### [NEW] `src/components/ui/StatCard.jsx`
#### [NEW] `src/components/ui/SearchInput.jsx`
#### [NEW] `src/components/ui/FilterDropdown.jsx`
#### [NEW] `src/components/ui/Modal.jsx`
#### [NEW] `src/components/ui/ConfirmDialog.jsx`
#### [NEW] `src/components/ui/Toast.jsx` + `src/components/ui/ToastContext.jsx`
#### [NEW] `src/components/ui/LoadingState.jsx`
#### [NEW] `src/components/ui/EmptyState.jsx`
#### [NEW] `src/components/ui/ErrorState.jsx`

---

### Layout Components
#### [NEW] `src/components/layout/AppShell.jsx`
#### [NEW] `src/components/layout/Sidebar.jsx`
#### [NEW] `src/components/layout/Topbar.jsx`
#### [NEW] `src/components/layout/PageHeader.jsx`
#### [NEW] `src/components/layout/Breadcrumbs.jsx`
#### [NEW] `src/layouts/AuthLayout.jsx`
#### [NEW] `src/layouts/DashboardLayout.jsx`

---

### Feature Components
#### [NEW] `src/components/dashboard/DeviceTable.jsx`
#### [NEW] `src/components/dashboard/LabOverview.jsx`
#### [NEW] `src/components/dashboard/AlertCard.jsx`
#### [NEW] `src/components/dashboard/ActivityItem.jsx`
#### [NEW] `src/components/devices/DeviceCard.jsx`
#### [NEW] `src/components/devices/DeviceForm.jsx`
#### [NEW] `src/components/devices/DeviceDetailPanel.jsx`
#### [NEW] `src/components/common/ProfileMenu.jsx`
#### [NEW] `src/components/common/LabCard.jsx`

---

### Public Pages
#### [NEW] `src/pages/public/LandingPage.jsx`
#### [NEW] `src/pages/public/LoginPage.jsx`
#### [NEW] `src/pages/public/RegisterPage.jsx`
#### [NEW] `src/pages/public/ForgotPasswordPage.jsx`

---

### Admin Pages
#### [NEW] `src/pages/admin/AdminDashboard.jsx`
#### [NEW] `src/pages/admin/AdminDevices.jsx`
#### [NEW] `src/pages/admin/AdminDeviceDetail.jsx`
#### [NEW] `src/pages/admin/AdminLabs.jsx`
#### [NEW] `src/pages/admin/AdminAlerts.jsx`
#### [NEW] `src/pages/admin/AdminHistory.jsx`
#### [NEW] `src/pages/admin/AdminReports.jsx`
#### [NEW] `src/pages/admin/AdminUsers.jsx`
#### [NEW] `src/pages/admin/AdminSettings.jsx`
#### [NEW] `src/pages/admin/AdminProfile.jsx`

---

### User Pages
#### [NEW] `src/pages/user/UserDashboard.jsx`
#### [NEW] `src/pages/user/UserDevices.jsx`
#### [NEW] `src/pages/user/UserLabs.jsx`
#### [NEW] `src/pages/user/UserAlerts.jsx`
#### [NEW] `src/pages/user/UserHistory.jsx`
#### [NEW] `src/pages/user/UserReports.jsx`
#### [NEW] `src/pages/user/UserProfile.jsx`

---

### Root
#### [NEW] `src/App.jsx` — All routes configured
#### [NEW] `src/main.jsx` — React + Firebase entry

---

## Verification Plan

### Automated
- `npm run build` — Verify zero build errors

### Manual Browser Testing
1. Visit `/` — Landing page renders correctly with hero + features + footer
2. Visit `/login` — Form validates, Firebase login works, redirects to correct dashboard by role
3. Visit `/register` — Form validates, user created in Firebase, role assigned, redirect works
4. Visit `/forgot-password` — Firebase password reset email sent, success message shown
5. Login as Admin → verify `/admin/dashboard` loads with stat cards + device table + mock data
6. Navigate all Admin sidebar links — all pages load without errors
7. Admin Devices page — search, filter, sort work; Add Device modal opens
8. Delete device — confirm dialog appears
9. Click device name → device detail page loads
10. Login as User → verify `/user/dashboard` loads — NO admin controls visible
11. Navigate all User sidebar links — all pages load
12. Attempt to visit `/admin/*` as regular user → redirect to `/user/dashboard`
13. Attempt to visit dashboard without auth → redirect to `/login`
14. Logout — redirected to landing page, session cleared
15. Test on tablet viewport (768px) — layout adjusts
16. Test on mobile (375px) — sidebar becomes drawer, tables scroll horizontally

---

## Execution Sequence

1. **Bootstrap project** — Vite + React + install dependencies
2. **Design system** — CSS tokens, global styles, animations
3. **Firebase setup** — config + auth helpers + AuthContext
4. **Mock data** — all mock files + dataService + hooks
5. **Core components** — UI primitives (StatusBadge, StatCard, Modal, Toast, etc.)
6. **Layouts** — AuthLayout + AppShell + Sidebar + Topbar
7. **Public pages** — Landing, Login, Register, ForgotPassword
8. **Route guards** — PublicRoute, ProtectedRoute, RoleRoute
9. **Admin pages** — Dashboard, Devices, DeviceDetail, Labs, Alerts, History, Reports, Users, Settings, Profile
10. **User pages** — Dashboard, Devices, Labs, Alerts, History, Reports, Profile
11. **Polish pass** — micro-interactions, responsive behavior, empty states, loading states
12. **Browser inspection** — full QA pass, fix any visual issues
13. **Final cleanup** — remove console logs, verify build

---

## Phase 2 Readiness Notes

The following architectural decisions ensure smooth Phase 2 integration:

| Concern | Phase 1 Approach | Phase 2 Swap |
|---|---|---|
| Data source | `src/mock/` files | Replace `dataService.js` to call Flask API or Firebase Firestore |
| Auth roles | Email-based dev detection | Replace with Firestore `users/{uid}.role` field or Firebase Custom Claims |
| Real-time updates | None (static mock data) | Add `useEffect` + WebSocket/SSE in hooks, no component changes needed |
| Device actions | Mock state changes | Wire to API endpoints |
| Report data | Mock statistics | Replace with aggregated Firestore queries |

