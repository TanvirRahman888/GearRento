<div align="center">
  <img src="public/GearRentoLogo.png" alt="GearRento logo" width="220" />

  # GearRento — Client Application

  **Rent Smarter. Build Bigger.**

  A responsive equipment-rental marketplace that connects renters with equipment owners across Bangladesh.

  **Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Better Auth · Swiper**
</div>

---

## Overview

**GearRento Client** is the frontend of the GearRento equipment-rental platform. Visitors can discover rental equipment, explore categories and locations, and compare daily rental prices. Authenticated users can access equipment details and the features available to their account role.

The frontend is built with the **Next.js App Router** and connects to a separate **Express.js + MongoDB** API for equipment, bookings, availability, and administrative operations. **Better Auth** manages authentication on the Next.js side.

> **Project status:** Actively developed. Some links, content, and workflows may still contain demo data; review the [Before going live](#before-going-live) checklist.

## Features

### Marketplace

- Responsive homepage with promotional Swiper banner slides.
- Browse equipment across **14 categories** and filter by Bangladesh division.
- Search by equipment name and filter by condition and daily rental price.
- Sort equipment by price and other supported API sort options.
- Discover **featured**, **top-priced**, and **recently added** equipment.
- Reusable product cards with photos, categories, rental prices, and availability information.
- Equipment details pages, with guest access redirected to sign-in by the application's route protection.

### Accounts and dashboards

- Email/password authentication using **Better Auth**; social sign-in depends on the configured provider(s).
- Role-based experiences for **customer**, **equipment owner**, and **administrator** accounts.
- Customer areas for bookings and rental history.
- Owner areas for adding equipment, managing listings, and handling rental activity.
- Admin areas for equipment approvals, featured equipment, user management, and platform administration.
- Profile management and responsive authenticated navigation.

### Website experience

- Light and dark themes powered by **next-themes** and semantic Tailwind color tokens.
- Homepage sections for categories, popular rentals, recently added equipment, benefits, owner onboarding, reviews, and FAQs.
- About Us, Contact Us, and custom 404 pages.
- Responsive header/footer with mobile navigation, contact details, and social links.
- Accessible UI patterns, reusable components, loading states, and toast notifications.

> **Important:** Customer testimonials and some contact/social details were introduced as **sample content**, not verified reviews or real support channels.

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | Next.js **16.4.6** (App Router) |
| Language | TypeScript **5** |
| UI | React **19.3.0** |
| Styling | Tailwind CSS **4.3.3**, shadcn, tw-animate-css |
| UI primitives | `@base-ui/react`, Lucide React |
| Authentication | Better Auth **1.7.26**, MongoDB adapter |
| Session-aware UI | Better Auth React client |
| Theme switching | `next-themes` |
| Carousels | Swiper **14.4.0** |
| Charts | Recharts **3.11.0** |
| Rich text editing | Tiptap **3** |
| Notifications | Sonner |
| Data source | Separate Express API and MongoDB Atlas |

The versions above reflect the `package.json` shared during development; check your current lockfile for installed versions. Footer brand icons may also use `react-icons` if you added that package after the original dependency list.

## Project structure

The exact contents may evolve; the following shows the main folders and files used in the client:

```text
gearrento-client/
├── public/
│   ├── about/                    # About Us imagery
│   ├── hero/                     # Homepage promotional banners
│   ├── GearRentoIcon.png
│   └── GearRentoLogo.png
├── src/
│   ├── app/
│   │   ├── (auth)/                # Login and registration pages
│   │   ├── (root)/                # Public-facing site layout/pages
│   │   │   ├── page.tsx          # Homepage
│   │   │   ├── equipment/        # Equipment listing/details
│   │   │   ├── about/
│   │   │   └── contact/
│   │   ├── (dashboard)/dashboard/ # Role-specific dashboard routes
│   │   ├── api/auth/[...all]/    # Better Auth handler
│   │   ├── globals.css           # Light/dark theme tokens
│   │   ├── layout.tsx
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── equipment/
│   │   ├── home/
│   │   ├── shared/
│   │   ├── ui/
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   ├── data/                      # Static section data
│   ├── lib/                       # Auth helpers, API utilities
│   ├── types/                     # Shared TypeScript types
│   └── proxy.ts                   # Route access checks (Next.js 16)
├── components.json
├── next.config.ts
├── package.json
└── README.md
```

## Getting started

### Requirements

- **Node.js**: Use a current supported LTS release compatible with Next.js 16 (Node.js 20.9+ minimum).
- **npm** (bundled with Node.js).
- A running **GearRento Express backend** and its MongoDB connection for dynamic equipment and booking data.

### 1. Install dependencies

Open a terminal in the client project directory:

```bash
npm install
```

If your footer uses React Icons and the package is missing:

```bash
npm install react-icons
```

### 2. Configure the environment

Create a `.env.local` file in the project root. **Use your actual configuration as the source of truth**—some authentication code may use `DB_USER`/`DB_PASS`, while another setup may use a full `MONGODB_URI`.

```dotenv
# Frontend / Better Auth
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=replace-with-a-generated-high-entropy-secret

# Express API (local development)
NEXT_PUBLIC_API_URL=http://localhost:5000
API_BASE_URL=http://localhost:5000

# Only if your Next.js Better Auth MongoDB adapter uses these
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
DB_NAME=GearRento

# Alternative: use this instead if your auth config reads MONGODB_URI
# MONGODB_URI=mongodb+srv://...
```

Generate a secret using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

**Security notes:**

- Never commit `.env`, `.env.local`, database credentials, or auth secrets.
- Keep `BETTER_AUTH_SECRET` stable within an environment; replacing it can invalidate existing sessions/tokens.
- Only environment variables prefixed with `NEXT_PUBLIC_` are intended to be exposed to browser code.
- Use **production HTTPS URLs** for the deployed frontend and API.
- Stripe secret keys and MongoDB credentials belonging to the **Express backend** must stay in backend-side environment settings.

### 3. Start the backend

Start your separate Express API using its own installation and environment instructions. In local development the client examples expect it at:

```text
http://localhost:5000
```

The backend's public health endpoint (`GET /`) should respond with a JSON message indicating that the GearRento API is running.

### 4. Start the frontend

```bash
npm run dev
```

Open **http://localhost:3000**.

### 5. Production build (local check)

```bash
npm run lint
npm run build
npm run start
```

`npm run lint` runs the ESLint script; `npm run start` serves an already-built production app.

## Available npm scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the development server |
| `npm run build` | Build the production application |
| `npm run start` | Start the production server after a build |
| `npm run lint` | Run ESLint |

## Routes and access

| Route | Purpose | Expected access |
| --- | --- | --- |
| `/` | Homepage | Public |
| `/equipment` | Browse and filter rental equipment | Public |
| `/equipment/[id]` | Individual equipment details | Login required by the configured proxy |
| `/about` | About GearRento | Public |
| `/contact` | Contact page | Public |
| `/login` | Sign in | Public |
| `/register` | Create an account | Public |
| `/dashboard` | Account dashboard | Authenticated |
| `/dashboard/my-bookings` | Customer bookings | Role-dependent |
| `/dashboard/my-equipment` | Owner equipment management | Role-dependent |
| `/dashboard/equipment-approvals` | Equipment review queue | Admin |
| `/dashboard/manage-users` | User management | Admin |

The dashboard has additional nested routes (availability, analytics, rental history, rental requests, profile, platform settings, and featured equipment). Access rules depend on the user's role and your authorization code.

### Authentication and authorization

- Better Auth handles login and sessions on the Next.js client.
- `src/proxy.ts` can redirect guests from protected pages to `/login?next=...`.
- A **cookie-existence check is not full session verification**. Sensitive server operations must verify an authenticated session.
- The backend uses JWT verification and role-based middleware for protected API operations.
- The backend's equipment details API was public in the shared server code, even if the frontend details route requires login. Protect the API separately if equipment details must truly be private.

## Backend API integration

The client consumes the separate GearRento API. Confirm your deployed API base URL matches your configured environment variables.

### Public equipment endpoints

| Endpoint | Usage |
| --- | --- |
| `GET /equipment` | Approved equipment listings |
| `GET /equipment?q=camera` | Search by name |
| `GET /equipment?category=Photography` | Filter by category |
| `GET /equipment?division=Dhaka` | Filter by division |
| `GET /equipment?sort=price-high` | Highest daily price first |
| `GET /equipment?sort=price-low` | Lowest daily price first |
| `GET /equipment?sort=oldest` | Older listings first |
| `GET /equipment/:id` | Approved equipment details |

The public listing response includes an `equipment` array and pagination metadata. Equipment items include fields such as `_id`, `name`, `categories`, `divisions`, `condition`, `imageUrls`, `dailyPrice`, `availableQuantity`, and `isFeatured`.

**Recently added sorting:** `sort=newest` requires the optional backend change discussed during development. Verify that you added it before relying on `/equipment?sort=newest` in the client.

### Owner / admin operations

The backend also has owner-only equipment creation and management, and admin equipment review endpoints, plus additional modular routes for booking, availability, featured listings, and platform administration. Read the backend README and source for exact request bodies, role requirements, and current route paths.

### CORS and API URLs

For a separately hosted Express backend, set its `CLIENT_URL` to the exact frontend origin (for example, `https://your-client.vercel.app`) and ensure the backend allows the needed methods/headers. Avoid trailing slashes when an origin-only value is expected.

## Theme and styling

GearRento uses semantic Tailwind tokens in `src/app/globals.css`.

| Token | Light mode | Dark mode |
| --- | --- | --- |
| Background | `#F6FAFB` | `#091821` |
| Foreground | `#122633` | `#F0F9FC` |
| Card | `#FFFFFF` | `#102733` |
| Primary | `#0E7490` | `#22D3EE` |
| CTA | `#FFB547` | `#FFB547` |

Prefer utility classes like `bg-background`, `text-foreground`, `bg-card`, `text-primary`, and `bg-cta` over hardcoded colors to preserve theme support. The theme switcher is implemented with `next-themes`.

## Images and media

- Brand assets: `public/GearRentoIcon.png` and `public/GearRentoLogo.png`.
- Promotional slides: `public/hero/`.
- About page illustrations: `public/about/`.
- Equipment photos come from backend `imageUrls`.

Files in `public/` are accessed from the site root, e.g.:

```tsx
import Image from "next/image";

<Image
  src="/GearRentoIcon.png"
  alt="GearRento icon"
  width={48}
  height={48}
/>
```

Image paths are **case-sensitive** in many production environments. For predictable deployment, prefer lowercase filenames with hyphens and make sure paths in the code match actual files.

For third-party image hosts, configure `images.remotePatterns` in `next.config.ts` or use `unoptimized` when appropriate.

## Deployment (Vercel)

1. Push the **client** project to a Git repository (exclude `.env*` secrets).
2. Import it in [Vercel](https://vercel.com/new) as a **Next.js** project.
3. If the client is inside a monorepo, select its folder as the **Root Directory**.
4. Configure production environment variables—especially `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and the backend API URL variables.
5. Set `BETTER_AUTH_URL` to the frontend's actual HTTPS origin.
6. Configure the **backend** to allow the deployed frontend origin through CORS.
7. Deploy, then test public browsing, login, protected routes, booking flows, and images.

> **Do not reuse the backend's Express `vercel.json` in this Next.js client.** Vercel should detect and build the frontend as a Next.js application.

## Troubleshooting

| Problem | What to check |
| --- | --- |
| `BetterAuthError: You are using the default secret` | Set a strong `BETTER_AUTH_SECRET` in local and deployment environments. |
| Equipment list is empty | Backend availability, API URL, MongoDB connection, approved listing status, CORS. |
| Images return 404 | Exact filename, capitalization, spaces, and `public/` path. |
| External product images fail | Remote image configuration or image host restrictions. |
| Login works locally but not in production | `BETTER_AUTH_URL`, trusted origins, cookie settings, deployment environment variables. |
| Protected page redirects repeatedly | Session configuration, proxy matcher, auth state, safe `next` redirects. |
| `sort=newest` does not work | Confirm the backend implements that additional sort option. |
| Incorrect colors in dark mode | Use semantic theme classes and verify the theme provider wraps the app. |

## Before going live

- [ ] Replace sample customer reviews with genuine, permissioned testimonials, or keep them clearly labeled as examples.
- [ ] Replace demo phone number, email, address, and social profile URLs.
- [ ] Confirm the equipment-owner application CTA points to an existing route.
- [ ] Verify all contact and payment workflows have their intended production behavior.
- [ ] Review auth session verification and role-based permissions end to end.
- [ ] Test inventory availability and booking/payment handling with the deployed backend.
- [ ] Add required legal pages, policies, and support information.
- [ ] Test accessibility, responsive layouts, keyboard navigation, and both themes.
- [ ] Confirm deployment secrets are stored only in secure environment settings.

## Related documentation

- [Next.js](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Better Auth](https://www.better-auth.com/docs)
- [Swiper React](https://swiperjs.com/react)
- [Vercel](https://vercel.com/docs)

---

<div align="center">
  <strong>GearRento</strong> — Rent Smarter. Build Bigger.
</div>
