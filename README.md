# TourFlow admin dashboard

Internal administration application for TourFlow. It manages catalog content,
customers, bookings, reviews, and dashboard reporting through the TourFlow API.

## Stack

- React 19 and TypeScript
- Vite 8
- TanStack Router
- TanStack Query
- Tailwind CSS 4
- shadcn/ui primitives built on Radix UI
- React Hook Form and Zod
- Recharts

## Features

- Admin authentication and centralized unauthorized-session handling
- Revenue, booking, customer, and tour dashboard metrics
- Category, tour, and activity management
- Temporary image uploads with a 5 MB client-side limit
- Customer and booking listings with server pagination
- Booking status management and CSV export
- Review publishing, hiding, and deletion
- Responsive desktop and mobile navigation

## Getting started

### Requirements

- Node.js 20.19 or newer, or Node.js 22.12 or newer
- npm
- A running TourFlow API

Install dependencies:

```bash
npm install
```

Create `.env.local` in the project root:

```env
VITE_FETCH_URL=http://127.0.0.1:7000
```

Start the development server:

```bash
npm run dev
```

## Commands

```bash
npm run dev      # Start Vite in development mode
npm run lint     # Run ESLint
npm run build    # Type-check and create a production build
npm run preview  # Preview the production build
```

## Project structure

```text
src/
├── app/                  # Router, providers, navigation, and app layout logic
├── components/           # Shared application components
│   └── ui/               # shadcn/ui primitives with lowercase filenames
├── features/             # Feature-owned API, types, queries, and components
│   ├── activities/
│   ├── auth/
│   ├── bookings/
│   ├── categories/
│   ├── customers/
│   ├── dashboard/
│   ├── reviews/
│   └── tours/
├── hooks/                # Shared React hooks
├── lib/                  # API client, auth session, and shared utilities
├── index.css             # Tailwind theme and global styles
└── main.tsx              # Application bootstrap
```

Feature folders own their API functions, response/request types, query options,
and user interface. Shared primitives remain under `src/components`, while
application wiring remains under `src/app`.

## Data and authentication

All HTTP requests go through `src/lib/api/client.ts`. The API client attaches
the admin token using `x-access-token`. A `401` response clears the session and
returns the administrator to `/login`.

Listing screens display one-based page numbers and convert them to the API's
zero-based pagination in their query parameters.

Do not commit `.env.local` or other environment files.
