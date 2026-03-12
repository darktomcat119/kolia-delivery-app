# Kolia – African Food Delivery

Full-stack food delivery app: mobile app (Expo/React Native), Node backend, admin and restaurant web dashboards.

## Repo structure

| Folder    | Stack              | Description                    |
|-----------|--------------------|--------------------------------|
| `backend` | Node, Express      | API, auth, orders, Stripe      |
| `admin`   | React, Vite        | Admin dashboard (restaurants)  |
| `restaurant` | React, Vite     | Restaurant dashboard (menu, orders) |
| `mobile`  | Expo, React Native | Customer app (iOS/Android)     |
| `website` | —                  | Marketing site                 |
| `supabase`| SQL                | Migrations, seed               |

## Quick start

1. **Install all**
   ```bash
   npm run install:all
   ```

2. **Environment**
   - `backend`: copy `.env.example` to `.env`, set Supabase and Stripe keys.
   - `mobile`: set `EXPO_PUBLIC_API_URL` (and optional Stripe/Supabase) in env or `src/config/env.ts`.

3. **Run**
   - Everything: `npm run dev` (backend + admin + restaurant + mobile).
   - Or run separately:
     - `npm run dev:backend`
     - `npm run dev:admin`
     - `npm run dev:restaurant`
     - `npm run dev:mobile` (Expo)

4. **Mobile**
   - From repo root: `npm run dev:mobile` or `cd mobile && npx expo start`.
   - Scan QR with Expo Go, or run on simulator/device. See `mobile/docs/LUXURY_IMAGES_AND_EFFECTS.md` for UI/assets.

## Mobile app (luxury UI)

- **Screens**: Onboarding, auth (login/signup/forgot), home, search, orders, profile, restaurant detail, cart, checkout, order tracking/confirmation.
- **Assets**: `mobile/assets/onboarding/` (hero images), `mobile/assets/illustrations/`, `mobile/assets/decorative/`. See `mobile/assets/IMAGE_ATTRIBUTION.md` for credits.
- **Effects**: Gradient backgrounds, optional texture overlay, FlowingShapes, WarmthGlow, SpiceParticles, AfricanPatternOverlay. Details in `mobile/docs/LUXURY_IMAGES_AND_EFFECTS.md`.

## Backend

- Supabase for DB and auth. If requests time out (e.g. behind VPN), see `backend/SUPABASE_TROUBLESHOOTING.md`.
- Run connectivity check: `cd backend && npm run check-supabase`.
