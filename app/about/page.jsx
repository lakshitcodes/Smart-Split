"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Github,
  Linkedin,
  ExternalLink,
  Users,
  CreditCard,
  Bell,
  Database,
  BarChart2,
  Heart,
  Server,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SettlingNotes from "@/components/hero";

/**
 * AboutPage — polished, responsive, animated About / Project page for SmartSplit.
 * - Responsive layout (mobile-first)
 * - Detailed Tech Stack & Key Functions (Convex endpoints + purpose)
 * - Removed screenshots per request
 * - Placeholder for GIF at /public/gifs/hero.gif
 * - Accessible, reduced-motion aware
 */
export default function AboutPage() {
  const reduceMotion = useReducedMotion();

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  const item = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 overflow-clip sm:mt-10">
      <div className="relative max-w-6xl mx-auto">
        {/* Decorative animated blob */}
        <motion.div
          aria-hidden
          initial={false}
          animate={
            !reduceMotion ? { rotate: [0, 6, -6, 0], scale: [1, 1.02, 1] } : {}
          }
          transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
          className="pointer-events-none absolute -inset-12 rounded-3xl blur-3xl opacity-18"
          style={{
            background: "linear-gradient(90deg,#16A34A,#06B6D4)",
            zIndex: 0,
          }}
        />

        {/* HERO */}
        <section className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
          {/* Left: headline + CTAs */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="space-y-6"
          >
            <motion.h1
              variants={item}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight gradient-title"
            >
              SmartSplit
              <span className="block text-lg md:text-xl font-medium text-muted-foreground mt-2">
                Split bills. Settle fast. Keep friendships intact.
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="max-w-xl text-muted-foreground text-lg"
            >
              SmartSplit combines a crisp UX with server-authoritative
              validation — so shared expenses are transparent, settlements are
              safe, and reminders actually get results.
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-3">
              <Button asChild>
                <Link
                  href="https://smartsplit-lakshit.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" /> Live demo
                  </span>
                </Link>
              </Button>

              <Button variant="outline" asChild>
                <Link
                  href="https://github.com/lakshitcodes/smart-split"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="flex items-center gap-2">
                    <Github className="h-4 w-4" /> Source
                  </span>
                </Link>
              </Button>

              <Button variant="ghost" asChild>
                <Link
                  href="https://www.linkedin.com/in/jainlakshit"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4" /> Connect
                  </span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right: Animated hero card / GIF placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br from-white/60 to-white/40 p-4 mx-auto">
              <div className="rounded-xl bg-gradient-to-br from-green-50 to-teal-50 p-6 flex items-center gap-4">
                <div className="flex-shrink-0 h-16 w-16 rounded-lg bg-white/90 flex items-center justify-center shadow">
                  <span className="text-2xl font-bold text-green-600">₹</span>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Net balances, simplified
                  </div>
                  <div className="mt-1 font-semibold text-lg">
                    Clear balances • Smart suggestions
                  </div>
                </div>
              </div>

              <div className="mt-4">
                {/* GIF placeholder — drop a GIF at public/gifs/hero.gif to show it */}
                <div className="h-44 rounded-lg bg-gradient-to-br from-white to-gray-50 border flex items-center justify-center overflow-hidden">
                  <SettlingNotes />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* WHY / FEATURES */}
        <section className="relative z-10 mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-semibold mb-4"
          >
            Why SmartSplit
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-600" /> Expense
                  Engine
                </CardTitle>
              </CardHeader>
              <CardContent>
                Create expenses with Equal / Percentage / Exact splits. Rounding
                diffs automatically allocate to the payer to ensure totals
                always match.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-teal-600" /> Visual
                  Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                Monthly trends and per-user balances are presented with clear
                visuals so you can quickly understand flows and spot anomalies.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-amber-600" /> Reminders
                </CardTitle>
              </CardHeader>
              <CardContent>
                Send manual reminders with optional notes, or rely on scheduled
                weekly reminders to nudge outstanding payers automatically.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-sky-600" />{" "}
                  Server-authoritative
                </CardTitle>
              </CardHeader>
              <CardContent>
                All critical checks and final balance mutations run on the
                server (Convex) — preventing reversed payments, overpayments and
                race conditions.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" /> Group-first UX
                </CardTitle>
              </CardHeader>
              <CardContent>
                Built for groups with member lists, roles, and simple invite
                flows — onboarding is fast and intuitive.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" /> Friendly Design
                </CardTitle>
              </CardHeader>
              <CardContent>
                Subtle animations, clear copy and pragmatic defaults keep
                interactions calm so money conversations stay friendly.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* TECH STACK (detailed) */}
        <section className="relative z-10 mb-12">
          <h3 className="text-2xl font-semibold mb-4">Tech stack</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Frontend</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                  <li>
                    <strong>Next.js (App Router)</strong> — React + SSR +
                    routing.
                  </li>
                  <li>
                    <strong>Tailwind CSS</strong> — utility-first styling;
                    `gradient-title` utility for headings.
                  </li>
                  <li>
                    <strong>shadcn/ui + Radix</strong> — accessible primitives
                    (Dialog, Tabs, Avatar, Cards).
                  </li>
                  <li>
                    <strong>Framer Motion</strong> — micro-interactions and
                    accessible animations.
                  </li>
                  <li>
                    <strong>Recharts</strong> — charts for monthly / trend
                    visualizations.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Backend & Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                  <li>
                    <strong>Convex</strong> — functions + realtime DB;
                    authoritative server mutations for expenses & settlements.
                  </li>
                  <li>
                    <strong>Inngest</strong> — scheduled jobs (weekly reminders,
                    monthly insight generation).
                  </li>
                  <li>
                    <strong>Nodemailer</strong> — SMTP transport for
                    transactional mail templates (or use a transactional
                    provider in prod).
                  </li>
                  <li>
                    <strong>Clerk</strong> — authentication (Email OTP, OAuth
                    providers).
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Utilities & Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                  <li>
                    <strong>date-fns</strong> — date formatting.
                  </li>
                  <li>
                    <strong>zod</strong> — schema validation for forms and
                    server args.
                  </li>
                  <li>
                    <strong>Sonner</strong> — toast notifications.
                  </li>
                  <li>
                    <strong>lucide-react</strong> — icons.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI & Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                  <li>
                    <strong>Google Generative / Gemini</strong> — monthly
                    narrative insights (category trends, anomalies).
                  </li>
                  <li>
                    Templates are curated and sent as branded HTML—keeps email
                    appearance consistent with the app.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Key functions / endpoints */}
        <section className="relative z-10 mb-12">
          <h3 className="text-2xl font-semibold mb-4">
            Key functions (what they do)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense APIs</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-3 text-muted-foreground">
                  <li>
                    <code>api.expenses.createExpense</code> — Create a new
                    expense, compute splits (equal/percentage/exact) and persist
                    it.
                  </li>
                  <li>
                    <code>api.expenses.deleteExpense</code> — Delete an expense;
                    authorized only for creator or payer.
                  </li>
                  <li>
                    <code>api.expenses.getExpensesBetweenUsers</code> — Fetch
                    1:1 expense history and related settlements.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Settlement & Group APIs</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-3 text-muted-foreground">
                  <li>
                    <code>api.settlements.createSettlement</code> — Record a
                    settlement; server validates direction and clamps to
                    outstanding exposure.
                  </li>
                  <li>
                    <code>api.groups.getGroupExpenses</code> — Get a group's
                    expenses, members, balances and settlements for the group
                    page.
                  </li>
                  <li>
                    <code>api.groups.deleteGroup</code> — Delete a group
                    (server-side removes related records; guarded by
                    authorization checks).
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications & Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-3 text-muted-foreground">
                  <li>
                    <code>api.emails.sendEmail</code> — Transactional email
                    sender used by jobs & actions.
                  </li>
                  <li>
                    <code>inngest.send-payment-reminders</code> — Scheduled job
                    that composes payment reminder emails weekly.
                  </li>
                  <li>
                    <code>api.inngest.getUsersWithOutstandingDebts</code> —
                    Query used by the job to find users to remind.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User & Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-3 text-muted-foreground">
                  <li>
                    <code>api.users.getCurrentUser</code> — Client-side query
                    for session user metadata.
                  </li>
                  <li>
                    <code>api.dashboard.getUserBalances</code> &{" "}
                    <code>api.dashboard.getMonthlySpending</code> — Aggregations
                    powering the dashboard charts.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="relative z-10 mb-12">
          <h3 className="text-2xl font-semibold mb-4">
            How it works (simplified)
          </h3>
          <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
            <li>
              <strong>Create expense</strong> — choose split type; client
              validates and shows suggested splits.
            </li>
            <li>
              <strong>Server stores</strong> — Convex saves raw splits and
              derives per-user balances.
            </li>
            <li>
              <strong>Settle</strong> — Insert settlement record; server
              enforces direction and exposure checks.
            </li>
            <li>
              <strong>Notify</strong> — Email pipeline sends transactional
              messages (settlement confirmations, reminders, insights).
            </li>
          </ol>
        </section>

        {/* Security & privacy */}
        <section className="relative z-10 mb-12">
          <h3 className="text-2xl font-semibold mb-4">Security & privacy</h3>
          <p className="text-sm text-muted-foreground mb-3">
            SmartSplit treats financial flows seriously:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground">
            <li>
              Server-side validation for all monetary mutations (Convex
              mutations are authoritative).
            </li>
            <li>
              Least-privilege for API keys and separate inbox for transactional
              mail.
            </li>
            <li>
              Do not store sensitive card data — payments are handled via
              external providers (links to Pay/UIs).
            </li>
            <li>
              GDPR mindful: store only what's necessary and follow your privacy
              policy.
            </li>
          </ul>
        </section>

        {/* CONTACT / CTA */}
        <section className="relative z-10 grid grid-cols-3 gap-6 items-start mb-10">
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Get in touch</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Questions, feedback or want help running this for your group?
                I'm available — shoot a message or open the repo.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link
                    href="https://github.com/lakshitcodes/smart-split"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="flex items-center gap-2">
                      <Github className="h-4 w-4" /> View code
                    </span>
                  </Link>
                </Button>

                <Button variant="outline" asChild>
                  <Link
                    href="https://www.linkedin.com/in/jainlakshit"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4" /> Connect
                    </span>
                  </Link>
                </Button>

                <Button variant="ghost" asChild>
                  <a
                    href="mailto:jainlakshit849@gmail.com"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" /> Email
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
