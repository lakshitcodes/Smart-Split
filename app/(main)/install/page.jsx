"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Chrome, Safari } from "lucide-react";
import Image from "next/image";

export default function InstallPWA() {
  const stepsChrome = [
    {
      img: "/readme/image-1.png",
      desc: "Open the app in Chrome and tap the three-dot menu in the top-right.",
    },
    {
      img: "/readme/image-2.png",
      desc: "Select 'Install App' from the dropdown menu.",
    },
    {
      img: "/readme/image-3.png",
      desc: "Confirm installation in the popup dialog.",
    },
    {
      img: "/readme/image-4.png",
      desc: "The app will now appear on your home screen for quick access.",
    },
  ];

  const stepsSafari = [
    {
      img: "/readme/image-5.png",
      desc: "Open the app in Safari and tap the share icon at the bottom.",
    },
    {
      img: "/readme/image-8.png",
      desc: "Scroll down and tap 'Add to Home Screen'.",
    },
    {
      img: "/readme/image-6.png",
      desc: "Edit the name if you want, then tap 'Add'.",
    },
    {
      img: "/readme/image-7.png",
      desc: "The app is now available on your iOS home screen like a native app.",
    },
  ];

  const renderSteps = (steps) => (
    <Accordion type="single" collapsible className="w-full">
      {steps.map((step, idx) => (
        <AccordionItem value={`step-${idx}`} key={idx}>
          <AccordionTrigger className="text-base font-semibold">
            Step {idx + 1}
          </AccordionTrigger>
          <AccordionContent>
            <Card className="overflow-hidden border">
              <CardContent className="p-4 space-y-3">
                <div className="relative w-full h-72 rounded-lg overflow-hidden shadow">
                  <Image
                    src={step.img}
                    alt={`Step ${idx + 1}`}
                    fill
                    className="object-contain bg-gray-50"
                  />
                </div>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Install SmartSplit on Your Device
      </h2>
      <Tabs defaultValue="chrome" className="w-full">
        <TabsList className="flex justify-center mb-8">
          <TabsTrigger value="chrome" className="flex items-center gap-2">
            <Chrome className="h-4 w-4" /> Chrome
          </TabsTrigger>
          <TabsTrigger value="safari" className="flex items-center gap-2">
            <Safari className="h-4 w-4" /> Safari (iOS)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chrome">{renderSteps(stepsChrome)}</TabsContent>
        <TabsContent value="safari">{renderSteps(stepsSafari)}</TabsContent>
      </Tabs>
    </section>
  );
}
