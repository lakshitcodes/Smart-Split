"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsContents,
} from "@/components/animate-ui/components/animate/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Chrome,
  Apple,
  ChevronLeft,
  ChevronRight,
  DownloadCloud,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { useRouter } from "next/navigation";

/**
 * InstallPWA.jsx
 * - Single-file React component that provides:
 *   • Tabs for Android / iOS
 *   • Horizontal scroll-snap gallery (swipe / wheel / trackpad)
 *   • Full-height, non-truncated images (object-cover)
 *   • Sticky steps list (click a step to jump)
 *   • Prev/Next overlay controls + progress
 *   • Clean, modern gradient background and glass card styling
 *
 * Usage: drop this file under /components or /app, ensure your images are
 * at /public/install-dir/android/{a.jpg...e.jpg}. Adjust imgNames if needed.
 */

const imgNames = ["a.jpg", "b.jpg", "c.jpg", "d.jpg", "e.jpg"];
const imgNames2 = ["a.jpg", "b.jpg", "c.jpg", "d.jpg", "e.jpg", "f.jpg"];
const androidImages = imgNames.map((n) => ({
  src: `/install-dir/android/${n}`,
  alt: `Android step ${n}`,
}));
const iosImages = imgNames2.map((n) => ({
  src: `/install-dir/ios/${n}`,
  alt: `iOS step ${n}`,
})); // using same images for now

export default function InstallPWA() {
  const router = useRouter();
  const androidSteps = [
    "If install popup appears — press it",
    "Click on Install",
    "Open from home screen after install",
    "Menu → Install App (if popup didn't show)",
    "Confirm & enjoy",
  ];

  const iosSteps = [
    "Click the three dots (or directly share icon if present)",
    "Chose the share option",
    "Click on more",
    "Scroll and tap 'Add to Home Screen'",
    "Edit name (optional) and tap Add",
    "The app appears on your home screen",
  ];

  return (
    <section className="min-h-screen py-8 px-4 md:pt-24">
      <Button
        variant="outline"
        size="sm"
        className="mb-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold gradient-title">
            Install SmartSplit (PWA)
          </h2>
          <p className="text-sm mt-2 max-w-2xl mx-auto text-gray-700">
            Quick visual walkthrough to add SmartSplit to your home screen.
            Swipe or use the arrows — the gallery snaps to each step for a
            natural feel.
          </p>
        </div>

        <div className="bg-white/6 rounded-3xl p-6 backdrop-blur-md shadow-xl border border-white/10 bg-gradient-to-br from-emerald-700 via-teal-600 to-sky-700">
          <Tabs defaultValue="android" className="w-full">
            <div className="max-w-md mx-auto mb-6">
              <TabsList className="grid grid-cols-2 gap-2">
                <TabsTrigger
                  value="android"
                  className="flex items-center justify-center gap-2"
                >
                  <div className="h-4 w-4 flex items-center justify-center pb-0.5">
                    <svg
                      fill="#000000"
                      viewBox="0 0 32 32"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <title>android</title>{" "}
                        <path d="M23.35 12.653l2.496-4.323c0.044-0.074 0.070-0.164 0.070-0.26 0-0.287-0.232-0.519-0.519-0.519-0.191 0-0.358 0.103-0.448 0.257l-0.001 0.002-2.527 4.377c-1.887-0.867-4.094-1.373-6.419-1.373s-4.532 0.506-6.517 1.413l0.098-0.040-2.527-4.378c-0.091-0.156-0.259-0.26-0.45-0.26-0.287 0-0.519 0.232-0.519 0.519 0 0.096 0.026 0.185 0.071 0.262l-0.001-0.002 2.496 4.323c-4.286 2.367-7.236 6.697-7.643 11.744l-0.003 0.052h29.991c-0.41-5.099-3.36-9.429-7.57-11.758l-0.076-0.038zM9.098 20.176c-0 0-0 0-0 0-0.69 0-1.249-0.559-1.249-1.249s0.559-1.249 1.249-1.249c0.69 0 1.249 0.559 1.249 1.249v0c-0.001 0.689-0.559 1.248-1.249 1.249h-0zM22.902 20.176c-0 0-0 0-0 0-0.69 0-1.249-0.559-1.249-1.249s0.559-1.249 1.249-1.249c0.69 0 1.249 0.559 1.249 1.249v0c-0.001 0.689-0.559 1.248-1.249 1.249h-0z"></path>{" "}
                      </g>
                    </svg>
                  </div>{" "}
                  Android (Chrome)
                </TabsTrigger>
                <TabsTrigger
                  value="ios"
                  className="flex items-center justify-center gap-2"
                >
                  <div className="h-4 w-4 flex items-center justify-center pb-0.5">
                    <svg
                      fill="#000000"
                      width="76px"
                      height="76px"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"></path>{" "}
                      </g>
                    </svg>
                  </div>{" "}
                  iOS (Safari)
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContents>
              <TabsContent value="android">
                <Gallery
                  title="Android — Quick install via Chrome"
                  images={androidImages}
                  steps={androidSteps}
                />
              </TabsContent>
              <TabsContent value="ios">
                <Gallery
                  title="iOS — Add to Home Screen (Safari)"
                  images={iosImages}
                  steps={iosSteps}
                />
              </TabsContent>
            </TabsContents>
          </Tabs>
        </div>
      </div>
    </section>
  );
}

function Gallery({ title, images = [], steps = [] }) {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const [active, setActive] = useState(0);

  // compute active slide by measuring distance of slide centers to container center (X axis)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      let nearest = 0;
      let nearestDist = Infinity;

      itemRefs.current.forEach((el, idx) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const elCenter = r.left + r.width / 2;
        const dist = Math.abs(elCenter - centerX);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = idx;
        }
      });

      setActive((prev) => (prev === nearest ? prev : nearest));
    };

    // listen for both scroll and resize (a resize can change centers)
    container.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      container.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [images.length]);

  const goTo = (i) => {
    const el = itemRefs.current[i];
    if (!el || !containerRef.current) return;
    el.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
    setActive(i);
  };

  const prev = () => goTo(Math.max(0, active - 1));
  const next = () => goTo(Math.min(images.length - 1, active + 1));

  return (
    <div className="flex flex-col">
      {/* Gallery */}

      <div className="flex flex-col items-center justify-center mb-3">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={prev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={next}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="hidden sm:inline-flex"
            size="sm"
            onClick={() => alert("Follow the highlighted step to install")}
          >
            <DownloadCloud className="h-4 w-4 mr-2" /> Quick help
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-5 gap-4">
        <div className="md:col-span-3">
          <div className="relative md:px-15">
            {/* prettier-ignore */}
            <div
            ref={containerRef}
            tabIndex={0}
            aria-label="Install steps gallery"
            className="w-full overflow-x-auto scroll-smooth snap-x snap-mandatory flex gap-6 pb-8 pt-1 px-4 rounded-2xl"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {images.map((img, idx) => (
              <motion.div
                key={idx}
                ref={(el) => (itemRefs.current[idx] = el)}
                className={`snap-center flex-shrink-0 min-w-[100%] lg:min-w-[60%] h-[700px] lg:h-[640px] rounded-2xl overflow-hidden relative shadow-2xl bg-black`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={img.src}
                    alt={img.alt || `Step ${idx + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw"
                    className="object-cover"
                    priority={idx === 0}
                  />
                </div>

                <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/40 backdrop-blur rounded-md text-white">
                  <div className="flex items-center justify-start">
                    <div className="text-sm font-medium">Step {idx + 1}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

            {/* Left/Right overlays for big screens (larger hit area) */}
            <div className="hidden lg:flex absolute inset-y-0 left-0 items-center pointer-events-none">
              <div className="p-2 pointer-events-auto">
                <button
                  onClick={prev}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>

            <div className="hidden lg:flex absolute inset-y-0 right-0 items-center pointer-events-none">
              <div className="p-2 pointer-events-auto">
                <button
                  onClick={next}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>

            {/* Dots / progress */}
            <div className="mt-3 flex items-center justify-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to step ${i + 1}`}
                  className={`h-3 w-3 rounded-full transition-all ${i === active ? "bg-white scale-110" : "bg-white/40"}`}
                />
              ))}
            </div>

            <div className="mt-2 text-center text-white/90">
              Step {active + 1} of {images.length}
            </div>
          </div>
        </div>

        {/* Steps list */}
        <div className="md:col-span-2 md:pt-20 md:items-center md:justify-center">
          <aside>
            <Card className="sticky top-6 bg-white/20 border border-white/10">
              <CardContent>
                <h4 className="font-semibold mb-2 text-white">Steps</h4>
                <ol className="list-decimal list-inside space-y-3 text-sm">
                  {steps.map((s, i) => (
                    <li
                      key={i}
                      onClick={() => goTo(i)}
                      className={`p-2 rounded-md cursor-pointer transition-colors text-white/90 ${active === i ? "bg-white/10 border border-white/20" : "hover:bg-white/5"}`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="text-sm font-medium text-white/90">
                          {s}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="mt-4">
                  <Button asChild>
                    <a
                      className="w-full flex items-center justify-center gap-2"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      <DownloadCloud className="h-4 w-4" /> Show me how (short)
                    </a>
                  </Button>
                </div>

                <div className="mt-3 text-xs text-white/70">
                  Tip: swipe left/right on touch, use the arrows on desktop, or
                  click a step to jump. The gallery uses horizontal scroll-snap
                  so partial scrolls snap to the nearest image.
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
