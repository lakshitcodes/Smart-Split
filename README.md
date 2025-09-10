<div align="center">
	<img src="public/logos/logo-s.png" alt="SmartSplit Logo" width="120" />
	<h1>SmartSplit</h1>
	<p><strong>AI‑powered, real‑time expense & settlement platform for groups and individuals.</strong></p>
	<p>
		<a href="https://smartsplit-lakshit.vercel.app" target="_blank"><b>🌐 Live Demo</b></a>
	</p>
	<p>
		<a href="#features">Features</a> •
		<a href="#getting-started">Getting Started</a> •
		<a href="#project-structure">Structure</a> •
		<a href="#usage">Usage</a> •
		<a href="#contributing">Contributing</a>
	</p>
</div>

---

## 🧾 Project Overview

SmartSplit helps friends, roommates, travel groups, and teams track shared expenses, settle balances intelligently, and stay informed through automated email reminders and AI‑powered monthly spending insights. It replaces manual spreadsheets and confusing paybacks with clean net balances, directional settlements, and intelligent validation to prevent overpayment or duplicate settlement flows.

### Why it exists

Managing shared expenses gets messy: partial repayments, changing group members, reminders, and tracking who owes whom in multiple contexts (1:1 and groups). SmartSplit unifies all these with:

- Real-time balance calculation (per user & per group)
- Guarded settlement logic (direction + max outstanding validation on client & server)
- Automated transactional & insight emails
- AI monthly summaries for spending awareness

## ✨ Features

### Core Expense & Split Engine

- Create expenses with three splitting modes:
  - Equal – evenly across all participants (auto recompute on add/remove)
  - Percentage – validates total = 100% (tolerance aware)
  - Exact Amounts – validates sum matches total (±0.01 tolerance)
- Dynamic participant management (auto-includes creator)
- Per-user & per-relationship net balance derivation (Convex aggregation)
- Group context support with isolated balance ledgers
- Optimistic UI + server‑authoritative mutation validation

### Settlement Flow

- Directionally constrained settlements (only the valid payer option is shown)
- Max outstanding enforcement (server + client clamp)
- Two‑decimal truncation to avoid floating inflation
- Group + 1:1 settlement parity
- Email notifications upon successful settlement

### Intelligence & Automation

- Weekly payment reminder job (Inngest scheduled)
- Monthly AI financial insight email (category trends, anomalies)
- Manual on-demand reminder with optional note
- Invite workflow (email based) for onboarding new users

### Gemini (Google Generative AI) Integration

- Uses Google Gemini via `@google/generative-ai` to generate narrative monthly insight summaries
- Prompt includes: month-over-month deltas, category concentration, anomaly detection heuristics
- Output curated and mailed as branded HTML
- Future-ready: can be extended to predictive budgeting or anomaly flagging

### Email System

- Templates for: New Expense, New Group, Settlement, Weekly Reminder, Monthly AI Insight, Invitation, Manual Reminder
- Nodemailer transport with dedicated sender identity (improves deliverability)
- Absolute asset paths for consistent logo rendering in clients

### UX / UI Polish

- Animated mount/unmount & staggered lists (Framer Motion)
- Accessible focus & keyboard flows (Radix primitives)
- Toast states (success / error / capped warning)
- Adaptive layout (buttons reorganize with breakpoint-aware grid/flex)
- Consistent currency formatting via shared utility

### Security & Auth

- Clerk: Email OTP + Google + Apple OAuth
- Magic link / URL login support
- Segregated server functions with validation (Convex arg schemas)
- No overpayment or cross-direction tampering (server enforced)

### Data Integrity & Validation

- Zod schemas for all critical form payloads
- Dual-layer validation (client pre-check + server authoritative)
- Tolerance thresholds for floating precision issues

### Developer Experience

- Modular email template helpers in `lib/email`
- Reusable form + selector components
- Clean separation of UI + data operations

### Settlement Integrity Summary

- Server rejects: overpayment, reversed roles, zero/negative values
- Client clamps + guides user before hitting server for better UX
- Ensures predictable balance evolution without double counting

## 🧠 Tech Stack

| Layer                 | Technology                                                       |
| --------------------- | ---------------------------------------------------------------- |
| Framework             | Next.js (App Router, Turbopack)                                  |
| Realtime backend / DB | Convex                                                           |
| Auth                  | Clerk                                                            |
| Scheduling / Jobs     | Inngest                                                          |
| Email                 | Nodemailer + custom HTML templates                               |
| UI                    | Tailwind CSS v4, Radix UI primitives, custom animated components |
| Forms & Validation    | React Hook Form + Zod                                            |
| Charts                | Recharts                                                         |
| Animation             | Framer Motion                                                    |
| AI                    | @google/generative-ai (monthly insight generation)               |
| Icons                 | lucide-react                                                     |
| Misc                  | Sonner (toasts), date-fns, clsx, class-variance-authority        |

## 📸 Screenshots & Visuals

> All existing images retained below. You may reorder or replace with higher fidelity exports later.

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

## 🗂 Project Structure

```
app/                # Next.js App Router pages & routes
components/         # Reusable UI + domain components (forms, selectors, lists)
convex/             # Convex functions (_generated API + custom queries/mutations)
lib/                # Utility libs (formatting, email templates, category helpers)
public/             # Static assets (logos, svg)
```

Key concepts:

- Settlement logic lives in Convex mutations ensuring server authority
- Form components use controlled + schema-guided validation
- Direction & clamping logic duplicated client/server for UX + integrity
- Email templates centralized under `lib/email`

## ⚙️ Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/lakshitcodes/smart-split.git
cd smart-split
pnpm install # or npm install / yarn
```

### 2. Environment Variables

Create a `.env.local` (never commit) with at least:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
CONVEX_DEPLOYMENT= # your convex deployment id or use `npx convex dev`
INNGEST_EVENT_KEY=...
GOOGLE_GENERATIVE_AI_API_KEY=...
EMAIL_SMTP_HOST=smtp.yourprovider.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=notifications@yourdomain.com
EMAIL_SMTP_PASS=your_smtp_password
EMAIL_FROM="SmartSplit Alerts <notifications@yourdomain.com>"
APP_BASE_URL=https://smartsplit-lakshit.vercel.app
```

> A dedicated mailbox is used for Nodemailer sending (avoid personal inbox). Configure SPF/DKIM for deliverability.

### 3. Convex Dev

```bash
npx convex dev
```

### 4. Run App

```bash
pnpm dev
```

### 5. Build & Start

```bash
pnpm build && pnpm start
```

### 6. Lint

```bash
pnpm lint
```

## 🔐 Auth Notes

- Supports Email OTP, Google, Apple
- Magic/URL login supported
- Clerk session tokens gate Convex functions

## 🧮 How It Works (Expense → Balance → Settlement)

1. User creates expense with chosen split model (equal / percentage / exact)
2. Server stores raw splits; per-user net balance derived via aggregation
3. Settlements mutate balances by inserting settlement records; server validates direction & remaining exposure
4. Email pipeline fires transactional notifications
5. Periodic jobs (Inngest) trigger AI monthly insight generation & weekly reminders

## 🤖 AI Insight Flow

1. Aggregate monthly spend + categories
2. Generate prompt for Generative AI
3. Produce narrative (spend trends, category spikes, suggestions)
4. Email to user

## 🧪 Usage Examples

### Record a Settlement

1. Navigate to a person or group page
2. Click “Settle up”
3. Enter amount (auto-clamped) and confirm

### Create Group Expense

1. Create/select group
2. Add expense → choose split type
3. Save → notifications send automatically

### Send Manual Reminder

1. Open person page
2. Click “Send Reminder” → optional note → send

## 🛠 Development Tips

- Keep settlement validations mirrored both ends
- Always add yourself as a participant by default (already enforced)
- Use `formatCurrency` util for all monetary display

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit: `git commit -m "feat: add X"`
4. Push: `git push origin feat/your-feature`
5. Open a Pull Request

Please run lint and ensure no type or runtime errors before submitting. Issues & enhancements welcome.

## 📬 Contact

**Author:** Lakshit Jain  
LinkedIn: https://www.linkedin.com/in/jainlakshit

## 📄 License

This project is licensed under the MIT License – see the `LICENSE` file for details.

## 🏷 Badges (Add once available)

```
![Build](https://img.shields.io/github/actions/workflow/status/lakshitcodes/smart-split/ci.yml)
![License](https://img.shields.io/github/license/lakshitcodes/smart-split)
![Stars](https://img.shields.io/github/stars/lakshitcodes/smart-split)
```

## 🙏 Acknowledgments

- Convex team for the elegant realtime backend
- Clerk for seamless auth flows
- Google Generative AI for insight generation
- Radix UI & Tailwind for accessible composable UI

---
