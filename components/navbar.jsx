"use client";

import React from "react";

import { Home, Users, CirclePlus, UserPlus2, LogIn } from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "./animate-ui/components/animate/tabs";
import { Authenticated, Unauthenticated } from "convex/react";

const routeToTab = (pathname) => {
  if (pathname.startsWith("/dashboard")) return "dashboard";
  if (
    pathname.startsWith("/contacts") ||
    pathname.startsWith("/groups/") ||
    pathname.startsWith("/person/") ||
    pathname.startsWith("/settlements")
  ) {
    return "contacts";
  }
  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up"))
    return "sign-in";
  if (pathname.startsWith("/expenses/new")) return "addexpense";
  if (pathname.startsWith("/profile") || pathname.startsWith("/account"))
    return "profile";
  return "dashboard";
};

const BottomNavbar = () => {
  const pathname = usePathname();
  const activeTab = routeToTab(pathname);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-xl rounded-t-2xl md:hidden">
      <Tabs value={activeTab} className="w-full">
        <TabsList className="w-full flex justify-around px-4 py-7">
          <TabsTrigger value="dashboard" asChild>
            <Link
              href="/dashboard"
              className="flex flex-col items-center gap-0.5"
            >
              <Home className="h-8 w-8" />
              <span className="text-[10px] font-medium">Dashboard</span>
            </Link>
          </TabsTrigger>

          <TabsTrigger value="contacts" asChild>
            <Link
              href="/contacts"
              className="flex flex-col items-center gap-0.5"
            >
              <Users className="h-8 w-8" />
              <span className="text-[10px] font-medium">Contacts</span>
            </Link>
          </TabsTrigger>

          <TabsTrigger value="addexpense" asChild>
            <Link
              href="/expenses/new"
              className="flex flex-col items-center gap-0.5"
            >
              <CirclePlus className="h-8 w-8" />
              <span className="text-[10px] font-medium">Add Expense</span>
            </Link>
          </TabsTrigger>

          <TabsTrigger value="newgroup" asChild>
            <Link
              href="/contacts?createGroup=true"
              className="flex flex-col items-center gap-0.5"
            >
              <UserPlus2 className="h-8 w-8" />
              <span className="text-[10px] font-medium">New Group</span>
            </Link>
          </TabsTrigger>

          <Authenticated>
            <TabsTrigger value="profile" asChild>
              <span className="flex flex-col items-center gap-0.5">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox:
                        "h-8 w-8 rounded-full border-2 border-emerald-500",
                    },
                  }}
                />
              </span>
            </TabsTrigger>
          </Authenticated>

          <Unauthenticated>
            <TabsTrigger value="sign-in" asChild>
              <Link
                href="/sign-in"
                className="flex flex-col items-center gap-0.5"
              >
                <LogIn className="h-8 w-8" />
                <span className="text-[10px] font-medium">Get Started</span>
              </Link>
            </TabsTrigger>
          </Unauthenticated>
        </TabsList>
      </Tabs>
    </nav>
  );
};

export default BottomNavbar;
