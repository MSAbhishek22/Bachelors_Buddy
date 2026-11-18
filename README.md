# BachelorBuddy — Split Expenses, Live in Harmony

**Your friendly expense tracker for shared living — split expenses, track budgets, and live harmoniously with your roommates.**

## What it does

- **Room-based splitting** — create a room for your flat, add your roommates (at least 2 members), and split shared expenses fairly; housemates can also join with a room code.
- **Dashboard** — a demo room and a live dashboard view of the room's expenses and balances.
- **Visual analytics** — charts and graphs (Analytics view) that show spending patterns at a glance.
- **Personal view** — a separate Personal section alongside the shared room views.
- **Friendly by design** — glassmorphism cards, toast feedback, and a sunrise-gradient landing page built to be readable at a glance.

State is managed in the browser via a React app context (`src/contexts/AppContext`) — this is a front-end MVP, so rooms and expenses live in client-side state.

## Tech stack

- **Next.js 15** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS 4** with **shadcn/ui** components (Radix UI) and **Lucide** icons
- **Recharts** for analytics, **Framer Motion / Motion** for animation, **Sonner** for toasts
- Forms with **React Hook Form** + **Zod**

## How to run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — create a room from the landing page, or open the demo room to explore the dashboard.

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # lint
```

## Project layout

```
src/app/         Routes: home (create/join room), dashboard, analytics, personal
src/components/  UI components (shadcn/ui) and app components
src/contexts/    App context holding rooms and expenses
src/hooks/, src/lib/  Hooks and utilities
```
