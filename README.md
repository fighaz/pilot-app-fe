# Susi Air Pilot App — Frontend (Nuxt 3)

Mobile web app for Susi Air pilots: view the monthly duty schedule, track flight
hours against regulatory limits, and monitor document expiries. Built as the
frontend part of the Susi Air Fullstack Developer Technical Test.

Backend repository: `pilot-app-be` (NestJS, exposes the REST API this app consumes).

## Tech Stack

- **Nuxt 3** with Composition API and `<script setup>`
- **TypeScript** throughout
- **Pinia** for state management (`@pinia/nuxt`)
- **SCSS** with global design tokens
- **Chart.js + vue-chartjs** for the flight hours trend chart
- **lucide-vue-next** for line icons
- **Plus Jakarta Sans** (Google Fonts)

## Setup

Requirements: Node.js 20+.

```bash
# install dependencies
npm install

# copy env template and adjust if needed
cp .env.example .env

# start the dev server on http://localhost:3000
npm run dev
```

Make sure the backend (`pilot-app-be`) is running first (see its README). The
dev setup assumes the API on `http://localhost:3001` (set as `PORT` in the
backend `.env`); start it with:

```bash
cd pilot-app-be
npm install
cp .env.example .env   # sekali saja — pastikan PORT=3001
npm run start:dev
```

### Production

```bash
npm run build
node .output/server/index.mjs
```

### Other commands

```bash
npm run typecheck   # vue-tsc type checking
npm run generate    # static generation
npm run preview     # preview production build
```

## Environment Variables

| Variable                | Default                   | Description                                                                 |
| ----------------------- | ------------------------- | --------------------------------------------------------------------------- |
| `NUXT_PUBLIC_API_BASE`  | `http://localhost:3001`   | Base URL of the NestJS backend.                                             |
| `NUXT_PUBLIC_TODAY`     | `2026-05-15`              | Reference "today" for frontend-side concerns (initial schedule month). Must mirror the backend `TODAY` value — see decisions below. |

## Login

A single hardcoded pilot account is accepted by the backend:

- Username: `johndoe`
- Password: `susiairtest`

## Screens

1. **Sign In** (`/login`) — username/password form with a clear error message on
   bad credentials. JWT is stored in a cookie (12 h, matching the token TTL).
2. **Home** (`/`)
   - Header: greeting, pilot name, total flight hours, avatar (`/pilot/me`)
   - Hours to Limit: four limit cards (Daily 8 h / Weekly 40 h / Monthly 100 h /
     Annual 1050 h) with progress bars and safe/near/over indicators, plus the
     rolling-sum trend chart with a 1w/1m/3m/6m/1y toggle (default 1w). The chart
     shows 15 days with today centered, a dashed red limit line, and a Y max per
     toggle. All values come from `/flight-hours/summary` — the rolling sum is
     computed entirely on the server.
   - My Documents: list with expiry badges colored by urgency
     (green = safe, amber = expiring soon, red = expired). Status is computed by
     the API.
   - Bottom navigation: Home, Schedule, Logbook, More.
3. **Schedule** (`/schedule`) — monthly calendar with previous/next month buttons;
   every navigation calls `/schedules?year=YYYY&month=MM`. Days are colored by
   `base_color` from the API; each day shows a tick when
   `count_logbooks === count_schedules`, otherwise the number of remaining
   duties. A legend from the API sits below the calendar. Tapping a date opens a
   placeholder detail page (`/schedule/:date`) — "Detail page coming soon".
4. **Logbook** (`/logbook`) — preview of the last 14 days from `/flight-hours`
   (kept intentionally light; the full logbook screen is out of scope).
5. **More** (`/more`) — pilot summary and sign out.

## Architecture

```
├── assets/scss/main.scss     # design tokens + global styles (Susi Air palette)
├── components/
│   ├── AppBottomNav.vue      # Home / Schedule / Logbook / More
│   ├── AppHeader.vue         # greeting, name, total hours, avatar
│   ├── LimitCard.vue         # one Hours-to-Limit card
│   ├── TrendChart.vue        # Chart.js rolling-sum line + limit line
│   ├── DocumentsList.vue     # documents with status badges
│   ├── ScheduleCalendar.vue  # month grid, base colors, tick/remaining badge
│   └── CalendarLegend.vue    # duty-type legend from the API
├── composables/useApi.ts     # $fetch wrapper: base URL, Bearer token, 401 handling
├── layouts/                  # default (with bottom nav) + blank (login)
├── middleware/auth.global.ts # route guard: everything requires a token
├── pages/                    # login, home, schedule, schedule/[date], logbook, more
├── stores/                   # Pinia: auth, pilot, flightHours, documents, schedule
├── types/api.ts              # response types mirroring the backend
└── utils/date.ts             # deterministic calendar helpers (no system clock)
```

## Key Decisions

- **No mock data in the frontend.** Every value rendered comes from the API;
  the initial schedule month is derived from the configured `today`, not from data.
- **"Today" is config, not the clock.** Following the brief, the frontend never
  uses `new Date()` for business "today". `NUXT_PUBLIC_TODAY` (default
  `2026-05-15`) mirrors the backend `TODAY` and is only used to pick the initial
  calendar month. Date math helpers use `Date.UTC` purely for deterministic
  calendar calculations (leap years, weekdays).
- **Token storage: cookie.** The JWT is kept in a `pilot_token` cookie with a
  12 h TTL and `sameSite: lax`, so the session survives reloads and the global
  route middleware can check it during SSR. `localStorage` would make the
  middleware client-only.
- **Global auth middleware + central 401 handling.** All routes except
  `/login` require a token. Additionally, any API response with status 401
  clears the session and redirects to `/login` (`useApi`).
- **Rolling sum stays on the server.** The chart and the four limit cards only
  render what `/flight-hours/summary` returns (points, limit, y-max, cards) —
  no math is duplicated on the client.
- **Chart above the limit line.** The Y axis uses `suggestedMax` from the API
  (45/125/325/625/1200 h per toggle). If a rolling sum exceeds it, Chart.js
  expands the axis gracefully instead of clipping or breaking the layout —
  values above the red line stay visible.
- **Future dates in the chart.** The API returns rolling sums for future days
  using existing data; the chart simply renders them (they flatten toward the
  planned schedule), consistent with the backend's documented decision.
- **Schedule month switching always calls the API** (no client caching between
  months), and out-of-order responses are guarded by comparing the requested
  year/month with the response.
- **Chart.js instead of a hand-rolled SVG chart** — reliable axis handling,
  tooltips, and responsive behavior for little code, which matters for the
  limit-line/y-max requirements.
- **Loading/error/empty states** on every data surface, with skeletons for the
  home screen and inline retry buttons on API errors.

## Design

- Susi Air palette from the brief: navy `#0E2138`, brand red `#E63757`,
  background `#F5F6F8`, success `#1FBF8F`, warning `#F59E0B`,
  chart accent `#22C5E8`.
- Plus Jakarta Sans, bold weights for numerical data.
- Rounded corners (12–16 px cards, pill buttons), subtle card shadows, line
  icons, mobile-first layout capped at 480 px for a phone-like feel on desktop.
- Susi Air logo asset from susiair.com (`public/susi-air-logo.png`).

## With More Time

- Move data fetching into `useAsyncData` for SSR-rendered content instead of
  client-side fetching after mount
- Refresh-token flow and nicer session expiry handling
- Unit/component tests (Vitest + Vue Test Utils) and E2E (Playwright)
- Offline caching of the schedule, i18n, dark mode
- Accessibility pass (focus management, ARIA refinements on the calendar)
