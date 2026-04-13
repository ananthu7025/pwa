# TechCheck PWA

A production-ready field technician check-in Progressive Web App built with **Next.js 14**, **Tailwind CSS**, and **next-pwa**.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Generate app icons (SVG placeholders)
node generate-icons.js

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 PWA Installation

1. Build for production: `npm run build && npm start`
2. Open in Chrome on Android (or Safari on iOS)
3. Tap **"Add to Home Screen"** from the browser menu
4. The app banner also appears automatically in the app

For iOS, open in Safari → Share → Add to Home Screen.

---

## 📂 Project Structure

```
checkin-pwa/
├── app/
│   ├── layout.tsx          # Root layout (PWA meta, fonts, providers)
│   ├── globals.css         # Tailwind + theme variables + animations
│   ├── page.tsx            # Root redirect (login / dashboard)
│   ├── not-found.tsx       # 404 page
│   ├── login/
│   │   └── page.tsx        # Login screen
│   ├── dashboard/
│   │   └── page.tsx        # Home / dashboard
│   ├── checkin/
│   │   └── page.tsx        # Full check-in flow (map → verify → poll → result)
│   └── profile/
│       └── page.tsx        # User profile + logout
│
├── components/
│   ├── layout/
│   │   └── AppShell.tsx    # Bottom nav + header shell
│   └── ui/
│       ├── Button.tsx      # Reusable button (variants + loading)
│       ├── Card.tsx        # Surface card (glass / solid)
│       ├── Input.tsx       # Form input with label/error/icon
│       ├── MapView.tsx     # Leaflet map (lazy loaded, SSR safe)
│       ├── Skeleton.tsx    # Skeleton loaders
│       ├── Toast.tsx       # Toast notifications + context
│       └── InstallBanner.tsx  # PWA install prompt
│
├── services/
│   ├── api.ts              # Axios client, all API calls, token helpers
│   └── auth-context.tsx    # Auth state, login/logout, JWT rehydration
│
├── hooks/
│   ├── useGeolocation.ts   # navigator.geolocation wrapper
│   ├── usePolling.ts       # Generic polling hook (5s approval check)
│   └── useInstallPrompt.ts # beforeinstallprompt PWA hook
│
├── utils/
│   └── index.ts            # vibrate, haversine, formatDistance, cx
│
├── middleware.ts            # Protected route middleware (JWT cookie check)
├── next.config.js           # next-pwa + Next.js config
├── public/
│   ├── manifest.json        # PWA manifest
│   └── icons/               # App icons (generate with generate-icons.js)
│
├── tailwind.config.ts
├── tsconfig.json
└── generate-icons.js        # SVG icon generator script
```

---

## 🔐 Authentication

- `POST /api/mobile/auth/login` with `{ email, password }`
- JWT stored in cookie (`tc_jwt`) with `localStorage` fallback
- Middleware automatically redirects unauthenticated users to `/login`
- Token decoded client-side to extract user info (no `/me` endpoint needed)

---

## 📍 Check-In Flow

```
Dashboard → /checkin
  ├─ Load office location (GET /checkin/office-location)
  ├─ Show Leaflet map with office marker
  ├─ Tap "Check In Here"
  ├─ navigator.geolocation.getCurrentPosition()
  ├─ POST /checkin/verify-location { latitude, longitude }
  │   ├─ status: "approved"  → ✅ Success screen
  │   ├─ status: "pending"   → ⏳ Poll every 5s
  │   │     GET /checkin/request-status/:requestId
  │   │     ├─ approved → ✅ Success
  │   │     └─ rejected → ❌ Rejected
  │   └─ status: "rejected"  → ❌ Rejected screen
  └─ (error) → Show error, retry available
```

---

## ⚙️ Environment Variables

No `.env` required by default. The API base URL is hardcoded:
```
https://trip-ledge.vercel.app/api/mobile
```

To override, edit `services/api.ts` → `BASE_URL`.

---

## 🎨 Design System

| Token | Value |
|---|---|
| Brand | `#4f46e5` (indigo) |
| Background | `#0f172a` |
| Surface | `#1e293b` |
| Success | `#10b981` |
| Danger | `#ef4444` |
| Warning | `#f59e0b` |

---

## 📦 Building for Production

```bash
npm run build
npm start
```

The service worker is generated automatically by `next-pwa` in production builds. It is **disabled in development** to avoid caching issues.

---

## 🛠 Icon Generation

```bash
node generate-icons.js   # Creates SVG icons in public/icons/
```

For production PNG icons (required for full PWA compliance):
```bash
npm install -g sharp-cli
npx sharp -i public/icons/icon-512x512.svg -o public/icons/ --format png
```

Or use a tool like [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator).

---

## 📋 PWA Checklist

- [x] `manifest.json` with all icon sizes
- [x] Service worker (next-pwa auto-generated)
- [x] `display: standalone`
- [x] `theme-color` meta tag
- [x] Safe area insets (notch support)
- [x] No viewport scaling
- [x] Offline map tile caching
- [x] Install prompt handling
- [x] Apple Web App meta tags

---

## 🧪 Testing on Mobile

1. Deploy to a HTTPS domain (Vercel: `vercel deploy`)
2. Open in mobile Chrome/Safari
3. The install banner will appear, or use "Add to Home Screen"

> **Note:** PWA install prompts only work on HTTPS. Use `ngrok` or Vercel for local mobile testing.
