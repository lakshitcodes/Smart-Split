"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Home, Users } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";

/**
 * NotFound page — visually rich, responsive, accessible.
 * - Respects prefers-reduced-motion
 * - Uses your green/teal theme and `gradient-title` utility
 * - Buttons use shadcn Button component
 */
export default function NotFound() {
  const reduceMotion = useReducedMotion();

  // gentle looping animation for decorative elements
  const blobAnim = !reduceMotion
    ? {
        rotate: [0, 6, -4, 0],
        scale: [1, 1.03, 1],
        x: [0, 8, -6, 0],
      }
    : {};

  const cardsAnim = (i) =>
    !reduceMotion
      ? {
          y: [12, 0, 12],
          rotate: [-4 + i * 4, 6 - i * 2, -4 + i * 4],
        }
      : {};

  const coinAnim = !reduceMotion ? { y: [0, -8, 0], rotate: [0, 360] } : {};

  return (
    <main
      role="main"
      className="min-h-screen flex items-center justify-center bg-white py-12 px-4"
    >
      <div className="relative w-full max-w-3xl">
        {/* Decorative gradient blob behind content */}
        <motion.div
          aria-hidden
          initial={false}
          animate={blobAnim}
          transition={{ duration: 9, repeat: Infinity, repeatType: "mirror" }}
          className="absolute -inset-10 rounded-3xl blur-3xl opacity-20"
          style={{
            background: "linear-gradient(90deg,#16a34a,#0ea5a3)", // green -> teal
            zIndex: 0,
          }}
        />

        {/* Animated rupee coin */}
        <motion.div
          aria-hidden
          className="absolute right-6 top-6 z-20"
          animate={coinAnim}
          transition={{ duration: 2.4, repeat: Infinity, repeatType: "loop" }}
        >
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg flex items-center justify-center text-white font-semibold">
            ₹
          </div>
        </motion.div>

        {/* Floating cards cluster */}
        <div className="absolute left-6 -top-6 z-10 hidden sm:flex gap-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="rounded-xl shadow-xl"
              initial={false}
              animate={cardsAnim(i)}
              transition={{ duration: 2 + i * 0.2, repeat: Infinity }}
              style={{
                width: i === 1 ? 130 : 96,
                height: i === 1 ? 84 : 64,
                background:
                  i === 1
                    ? "linear-gradient(180deg,#10b981,#06b6d4)"
                    : "#ffffff",
                border: "1px solid rgba(0,0,0,0.04)",
              }}
            />
          ))}
        </div>

        {/* Main card */}
        <div className="relative z-30 bg-white border rounded-2xl shadow-lg p-6 sm:p-12 text-center">
          <h1 className="text-6xl sm:text-[6.5rem] md:text-[8rem] leading-none font-extrabold gradient-title">
            404
          </h1>

          <h2 className="mt-2 text-xl sm:text-2xl font-semibold">
            Oops — we couldn't find that page
          </h2>

          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Looks like the page you’re trying to reach has moved, was removed,
            or you typed the address wrong. Try going back home or check your
            contacts.
          </p>

          {/* CTA buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/" aria-label="Go home">
                <span className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Go home
                </span>
              </Link>
            </Button>

            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/contacts" aria-label="Go to contacts">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Contacts
                </span>
              </Link>
            </Button>
          </div>

          {/* subtle hint / actions */}
          <div className="mt-5 text-xs text-muted-foreground">
            Or try refreshing the page — if the problem persists, contact
            support.
          </div>
        </div>
      </div>
    </main>
  );
}
