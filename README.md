# Equiply Client

**Project name:** Equiply — Equipment Rental Platform  
**Purpose:** A Next.js frontend where customers browse and book equipment, owners list gear, and admins manage the marketplace with secure payments and role-based dashboards.

## Live URL

- Local: [http://localhost:3000](http://localhost:3000)
- Production: _Add your deployed client URL here after hosting (Vercel recommended)._

## Key Features

- Public home page with featured equipment, categories, Why Choose Us, reviews, and Framer Motion animations
- All Equipment page with server-side search, filters, price range, and sorting
- Private equipment details, favorites, booking modal, and Stripe Checkout flow
- Role-based dashboards for Customer, Owner, and Admin
- Email/password auth + Google social login (BetterAuth bridge)
- JWT session cookies for private-route protection on reload
- Toast feedback, loading page, error page, and 404 page
- imgbb image upload support for owner equipment listings
- Responsive layout for mobile, tablet, and desktop

## Tech Stack / NPM Packages

- `next` — App Router frontend
- `react`, `react-dom` — UI
- `typescript` — typed client code
- `better-auth` — Google social auth client
- `framer-motion` — home section animations
- `lucide-react` — icons
- `react-hot-toast` — success/error toasts
- `@react-oauth/google` — optional Google helper package

## Environment Variables

Copy `.env.local.example` to `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Accounts (local seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@equiply.test` | `Admin123` |
| Owner | `owner@equiply.test` | `Owner123` |

Register a new Customer from `/register`, or promote any user to Owner/Admin from the Admin dashboard.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm start` — start production build
- `npm run lint` — lint the project

## Notes

- Equipment details, payment, and dashboard routes are private.
- Logged-in users keep access after reload via auth cookies + JWT.
- Keep secrets only in `.env.local` (never commit real keys).
