"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";

/**
 * SmartSplitSplash.jsx
 * - Fancy layered splash animation (JSX + Tailwind + Framer Motion)
 * - Props: logoSrc, appName, duration (ms), onFinish, showProgress
 */

export default function SmartSplitSplash({
  logoSrc,
  appName = "SmartSplit",
  duration = 2000,
  onFinish,
  showProgress = true,
}) {
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true); // 👈 control visibility
  const [reducedMotion, setReducedMotion] = useState(false);

  // pointer parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useTransform(mx, (v) => v / 20);
  const y = useTransform(my, (v) => v / 20);
  const rotateX = useTransform(my, (v) => -v / 40);
  const rotateY = useTransform(mx, (v) => v / 60);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(!!mq.matches);
      const handler = () => setReducedMotion(!!mq.matches);
      mq.addEventListener?.("change", handler);
      return () => mq.removeEventListener?.("change", handler);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const timer = setTimeout(() => {
      setVisible(false); // 👈 start exit animation
    }, duration);
    return () => clearTimeout(timer);
  }, [mounted, duration]);

  // call onFinish only after exit is done
  function handleExitComplete() {
    onFinish?.();
  }

  // letters for staggered reveal
  const letters = appName.split("");
  const particles = Array.from({ length: 12 });

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible && (
        <motion.div
          ref={containerRef}
          onMouseMove={(e) => {
            if (reducedMotion) return;
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;
            const cx = e.clientX - rect.left - rect.width / 2;
            const cy = e.clientY - rect.top - rect.height / 2;
            mx.set(cx);
            my.set(cy);
          }}
          onMouseLeave={() => {
            if (!reducedMotion) {
              mx.set(0);
              my.set(0);
            }
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.6, ease: "easeInOut" },
          }} // 👈 smooth exit
          className="fixed inset-0 z-[9999] flex items-center justify-center"
        >
          {/* Background: softer multi-color gradient (less green) */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-indigo-900 via-emerald-600 to-sky-500 opacity-95" />

          {/* faint grain + vignette overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <svg
              className="w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 1200 800"
            >
              <defs>
                <radialGradient id="v" cx="40%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.03)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
                </radialGradient>
                <filter id="gblur">
                  <feGaussianBlur stdDeviation="60" />
                </filter>
              </defs>

              {/* animated soft blobs — subtle movement */}
              <motion.ellipse
                cx="180"
                cy="170"
                rx="220"
                ry="160"
                style={{
                  fill: "rgba(255,255,255,0.03)",
                  filter: "url(#gblur)",
                }}
                animate={
                  reducedMotion
                    ? {}
                    : { cx: [180, 230, 180], cy: [170, 130, 170] }
                }
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.ellipse
                cx="1020"
                cy="610"
                rx="260"
                ry="200"
                style={{
                  fill: "rgba(255,255,255,0.03)",
                  filter: "url(#gblur)",
                }}
                animate={
                  reducedMotion
                    ? {}
                    : { cx: [1020, 980, 1020], cy: [610, 650, 610] }
                }
                transition={{
                  duration: 14,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <rect width="100%" height="100%" fill="url(#v)" />
            </svg>
          </div>

          {/* moving decorative elements (floating translucent cards / orbs) */}
          <div className="absolute inset-0 -z-5 pointer-events-none">
            {particles.map((_, i) => {
              const left = (i * 73) % 100;
              const delay = (i % 5) * 0.4;
              const size = 6 + (i % 5) * 4;
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white/6 backdrop-blur-sm"
                  style={{
                    width: `${size * 2}px`,
                    height: `${size * 2}px`,
                    left: `${left}%`,
                    top: `${(i * 37) % 95}%`,
                    transform: "translate(-50%,-50%)",
                  }}
                  animate={
                    reducedMotion
                      ? {}
                      : {
                          y: [0, -18, 0],
                          opacity: [0.7, 0.95, 0.7],
                          scale: [0.9, 1.05, 0.95],
                        }
                  }
                  transition={{
                    duration: 6 + (i % 4),
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay,
                  }}
                />
              );
            })}
          </div>

          {/* main content (logo + title) */}
          <motion.div
            className="relative flex flex-col items-center justify-center gap-6 px-6 py-8 max-w-[780px] w-full"
            style={!reducedMotion ? { x, y, rotateX, rotateY } : {}}
          >
            {/* Logo cluster: rings, stroke reveal, pulsing glow */}
            <div className="relative w-[180px] h-[180px] flex items-center justify-center">
              {/* outer rotating rings */}
              <motion.svg
                viewBox="0 0 130 130"
                className="absolute -inset-2 w-[210px] h-[210px]"
                initial={{ rotate: -30, opacity: 0.9 }}
                animate={reducedMotion ? {} : { rotate: [-30, 30, -30] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              >
                <defs>
                  <linearGradient id="ringG" x1="0" x2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
                  </linearGradient>
                </defs>
                <circle
                  cx="65"
                  cy="65"
                  r="54"
                  stroke="url(#ringG)"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.16"
                />
                <circle
                  cx="65"
                  cy="65"
                  r="38"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="2"
                  fill="none"
                />
              </motion.svg>

              {/* subtle rotating halo */}
              <motion.div
                className="absolute rounded-full w-[162px] h-[162px] opacity-50"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.06), transparent 30%)",
                }}
                animate={reducedMotion ? {} : { rotate: [0, 180, 360] }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              />

              {/* logo container */}
              <motion.div
                initial={{ scale: 0.75, y: 8, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="relative rounded-full bg-white/6 backdrop-blur-md flex items-center justify-center w-[148px] h-[148px] border border-white/8 overflow-hidden"
                style={{ boxShadow: "inset 0 6px 20px rgba(255,255,255,0.03)" }}
              >
                {logoSrc ? (
                  <motion.img
                    src={logoSrc}
                    alt={`${appName} logo`}
                    className="w-20 h-20 object-contain"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.9, ease: "backOut" }}
                  />
                ) : (
                  // SVG fallback with stroke reveal
                  <motion.svg
                    width="88"
                    height="88"
                    viewBox="0 0 100 100"
                    fill="none"
                    initial="hidden"
                    animate="visible"
                  >
                    <defs>
                      <linearGradient id="gS" x1="0" x2="1">
                        <stop offset="0%" stopColor="#CFFFD6" />
                        <stop offset="100%" stopColor="#34D399" />
                      </linearGradient>
                    </defs>

                    <motion.rect
                      x="12"
                      y="12"
                      width="76"
                      height="76"
                      rx="14"
                      stroke="url(#gS)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                      fill="rgba(255,255,255,0.04)"
                    />
                    <motion.path
                      d="M28 68 L46 28 L64 68"
                      stroke="#fff"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{
                        delay: 0.28,
                        duration: 0.7,
                        ease: "easeOut",
                      }}
                    />
                    <motion.path
                      d="M34 58 L66 58"
                      stroke="#fff"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{
                        delay: 0.45,
                        duration: 0.6,
                        ease: "easeOut",
                      }}
                    />
                  </motion.svg>
                )}

                {/* progress ring — animates once */}
                {showProgress && !reducedMotion && (
                  <motion.svg
                    className="absolute -bottom-4 -right-4 w-20 h-20"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="6"
                      fill="none"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="44"
                      stroke="white"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 44}
                      initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{
                        duration: duration / 1000,
                        ease: "easeOut",
                      }}
                      fill="none"
                    />
                  </motion.svg>
                )}
              </motion.div>
            </div>

            {/* title: staggered letters */}
            <div className="text-center mt-2">
              <motion.h1
                aria-label={appName}
                className="flex gap-1 justify-center text-3xl md:text-4xl font-extrabold tracking-tight text-white"
                initial="hidden"
                animate="visible"
              >
                {letters.map((ch, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    variants={{
                      hidden: { y: 18, opacity: 0, rotate: -6 },
                      visible: { y: 0, opacity: 1, rotate: 0 },
                    }}
                    transition={{
                      delay: 0.38 + i * 0.035,
                      duration: 0.48,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white/95 to-white/70">
                      {ch === " " ? "\u00A0" : ch}
                    </span>
                  </motion.span>
                ))}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="mt-3 text-sm md:text-base text-white/85 max-w-[44rem] mx-auto"
              >
                A clean, secure way to split groups, vote and manage shared
                decisions...
              </motion.p>
            </div>

            {/* lowered loading text (moved down) */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: Math.max(1.0, duration / 2000 - 0.1),
                duration: 0.6,
              }}
              className="absolute left-0 right-0 mx-auto -bottom-10 flex justify-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/12 backdrop-blur-sm border border-white/8 text-xs text-white/80">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="opacity-90"
                >
                  <path
                    d="M12 2v6"
                    stroke="white"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 12h12"
                    stroke="white"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 18v4"
                    stroke="white"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Loading personalized workspace…</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
