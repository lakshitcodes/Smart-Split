# SmartSplit 💸

**AI-powered, real-time expense & settlement platform for groups and individuals.**
Keep shared spending tidy: clean net balances, directional settlements, automated reminders and AI monthly insights.

[🌐 Live Demo](https://smartsplit-lakshit.vercel.app) • [License](#license) • [LinkedIn](https://www.linkedin.com/in/jainlakshit)

---

## Table of contents

- [About](#about)
- [Why SmartSplit](#why-smartsplit)
- [Key features](#key-features)
- [Tech stack](#tech-stack)
- [Screenshots & visuals](#screenshots--visuals)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [How it works (Expense → Balance → Settlement)](#how-it-works-expense--balance--settlement)
- [AI insight flow](#ai-insight-flow)
- [Usage examples](#usage-examples)
- [Developer tips](#developer-tips)
- [Contributing](#contributing)
- [Contact](#contact)
- [License](#license)
- [Acknowledgments & future ideas](#acknowledgments--future-ideas)

---

## About

SmartSplit simplifies group money-management by combining a robust split/settlement engine with server-authoritative validation and AI-generated monthly summaries. Designed for roommates, travel groups, teams and anyone sharing expenses.

---

## Why SmartSplit

Shared expenses get messy: partial repayments, duplicate settlements, changing participants. SmartSplit offers:

- Real-time, per-user and per-relationship net balances.
- Directional settlement UI that prevents invalid payments.
- Automated reminders and AI insights to reduce friction and surprise.

---

## Key features

### Core expense & split engine

- **Split modes:** Equal / Percentage (with validation) / Exact amounts.
- **Dynamic participants:** auto-include creator; recompute splits when members change.
- **Accurate aggregation:** convex-style ledger for per-user and group balances.
- **Optimistic UI + server authority:** client pre-checks + server mutations enforce correctness.

### Settlement & integrity

- Directional (payer → payee) settlement UI only shows valid actions.
- Server rejects overpayments, reversed roles, or invalid amounts.
- Two-decimal truncation & tolerance thresholds to avoid floating rounding issues.
- Email notifications on settlement success.

### Intelligence & automation

- Weekly payment reminders (Inngest scheduled job).
- Monthly AI financial insights (Google Generative AI / Gemini) — trend deltas, category concentration, anomalies.
- Manual reminders with optional notes.

### Email & UX

- Branded HTML templates for transactional emails (expense, reminder, settlement, group invitation).
- Accessible UI patterns (Radix, focus management) and smooth animation (Framer Motion).
- Toasts, adaptive layouts, and consistent currency formatting.

### Security & validation

- Clerk for Email OTP, Google, Apple OAuth, magic links.
- Zod schemas + duplicate client/server validation.
- Server-side enforcement of all monetary and role constraints.

---

## Tech stack

| Layer                 | Tech                                              |
| --------------------- | ------------------------------------------------- |
| Framework             | Next.js (App Router, Turbopack)                   |
| Realtime backend / DB | Convex                                            |
| Auth                  | Clerk                                             |
| Jobs / Scheduling     | Inngest                                           |
| Email                 | Nodemailer + branded HTML templates               |
| UI                    | Tailwind CSS, Radix UI, Framer Motion             |
| Forms & validation    | React Hook Form + Zod                             |
| Charts                | Recharts                                          |
| AI                    | `@google/generative-ai` (Gemini)                  |
| Misc                  | date-fns, clsx, Sonner toasts, lucide-react icons |

---

## Screenshots & visuals

![App Overview](public/readme/image.png)
**Database Schema**
![Database Schema](public/readme/image-1.png)
**Person Page**
![Person Page](public/readme/image-2.png)
**Dashboard Page**
![Dashboard Page](public/readme/image-3.png)
**Contacts Page**
![Contacts Page](public/readme/image-4.png)
**Create Group Page**
![Create Group Page](public/readme/image-5.png)
**Group Information Page**
![Group Info](public/readme/image-6.png)
**Add Expense Page**
![Add Expense](public/readme/image-7.png)
**Settlement Page**
![Settlement Page](public/readme/image-8.png)
**Home Page**
![Home Page](public/readme/image-9.png)
**Monthly AI Insights Email**
![Monthly AI Insights](public/readme/image-10.png)
**Weekly Payment Reminders**
![Weekly Reminder](public/readme/image-11.png)
**Settlement Mail**
![Settlement Mail](public/readme/image-12.png)
**Payment Reminder Mail**
![Payment Reminder Mail](public/readme/image-13.png)
**New Expense Mail**
![New Expense Mail](public/readme/image-14.png)
**Group Creation Mail**

---

## Project structure

```
app/                # Next.js App Router pages & api routes
components/         # Reusable UI & domain components
convex/             # Convex functions (generated + custom queries/mutations)
lib/                # Utilities (formatting, email templates, AI helpers)
public/             # Static assets (logos, screenshots)
```

Key note: settlement logic lives in Convex mutations — server authoritative. UI mirrors validation for UX.

---

## Getting started

### 1. Clone

```bash
git clone https://github.com/lakshitcodes/smart-split.git
cd smart-split
```

### 2. Install

```bash
pnpm install   # or npm install / yarn
```

### 3. Environment

Create `.env.local` (never commit):

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
CONVEX_DEPLOYMENT= # convex deployment id or use `npx convex dev`
INNGEST_EVENT_KEY=...
GOOGLE_GENERATIVE_AI_API_KEY=...
EMAIL_SMTP_HOST=smtp.yourprovider.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=notifications@yourdomain.com
EMAIL_SMTP_PASS=your_smtp_password
EMAIL_FROM="SmartSplit Alerts <notifications@yourdomain.com>"
APP_BASE_URL=https://smartsplit-lakshit.vercel.app
```

> Use a dedicated sending mailbox and configure SPF/DKIM for deliverability.

### 4. Convex (local)

```bash
npx convex dev
```

### 5. Run

```bash
pnpm dev
# build
pnpm build && pnpm start
```

### 6. Lint

```bash
pnpm lint
```

---

## How it works (Expense → Balance → Settlement)

1. **Create expense** → choose split model (Equal / Percentage / Exact).
2. **Server stores raw splits** and derives per-user net balances via aggregation.
3. **Settlement** inserts settlement record via Convex mutation — server validates direction, outstanding exposure and clamps values.
4. **Notifications**: email pipeline fires transactional messages for expense/settlement/reminders.
5. **Periodic jobs** (Inngest) drive weekly reminders and monthly AI insight generation.

---

## AI insight flow

1. Aggregate monthly spend by category & user.
2. Build a structured prompt (month-over-month deltas, category concentration, anomalies).
3. Generate narrative via Google Generative AI (Gemini).
4. Curate & email as branded HTML to users.

---

## Usage examples

- **Record a settlement:** Person page → _Settle up_ → amount (auto-clamped) → confirm.
- **Create group expense:** Group → Add expense → Choose split → Save → notifications sent.
- **Send manual reminder:** Person page → Send Reminder → add note → send.

---

## Developer tips

- Mirror settlement validations on client & server — never rely on client-only checks.
- Always include yourself as a participant when creating expenses (enforced).
- Use `formatCurrency` util everywhere to maintain consistent formatting and avoid precision drift.
- Centralize email templates in `lib/email` and use absolute asset paths for images in email HTML.

---

## Contributing

1. Fork the repo
2. `git checkout -b feat/your-feature`
3. Implement, run lint/tests, commit with clear message
4. Push & open a PR

Please run lint and verify no runtime errors before requesting review.

---

## Contact

**Author:** Lakshit Jain
LinkedIn: [https://www.linkedin.com/in/jainlakshit](https://www.linkedin.com/in/jainlakshit)

---

## License

MIT — see `LICENSE` file.

---

## Acknowledgments & future ideas

Thanks to Convex, Clerk, Inngest, and Google Generative AI.

**Future ideas:** multi-currency support, mobile PWA offline mode, receipt OCR, expense tagging intelligence, predictive budgeting.

---
