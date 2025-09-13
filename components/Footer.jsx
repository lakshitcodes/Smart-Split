"use client";

import React from "react";
import Link from "next/link";
import { Linkedin, Github, UserPlus, Info, Download } from "lucide-react";

export default function Footer({ onInvite }) {
  return (
    <footer className="bottom-0 border-t bg-gray-50 py-10 flex justify-center text-center items-center mb-10 sm:mb-0">
      <div className="w-full max-w-4/5">
        <div className="rounded-xl border bg-white shadow-sm p-6 flex flex-col md:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left: Made by */}
          <div className="min-w-1/3 text-sm text-muted-foreground flex items-center justify-center md:justify-start">
            <span>
              Made with <span className="text-red-500">❤️</span> by{" "}
              <span className="font-medium">Lakshit Jain</span>
            </span>
          </div>

          {/* Middle: Actions */}
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-end gap-3 w-full">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  onInvite ? onInvite() : (window.location.href = "/invite")
                }
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-white border border-gray-200 shadow-sm hover:bg-gradient-to-r hover:from-green-500 hover:to-teal-500 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-green-200"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Invite Friends</span>
                <span className="sm:hidden">Invite</span>
              </button>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-white border border-gray-200 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-green-200 hover:bg-gradient-to-r hover:from-green-500 hover:to-teal-500 hover:text-white"
              >
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">About</span>
                <span className="sm:hidden">About</span>
              </Link>
            </div>
            <div className=" flex gap-3">
              <a
                href="https://www.linkedin.com/in/jainlakshit/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-blue-50 transition focus:outline-none focus:ring-2 focus:ring-green-200"
              >
                <Linkedin className="w-5 h-5 text-[#0A66C2]" />
              </a>

              <a
                href="https://github.com/lakshitcodes/smart-split"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-green-200"
              >
                <Github className="w-5 h-5 text-gray-700" />
              </a>
              <a
                href="/install"
                rel="noopener noreferrer"
                aria-label="Install App"
                className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-green-50 transition focus:outline-none focus:ring-2 focus:ring-green-200"
              >
                <Download className="w-5 h-5 text-emerald-700" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom small text */}
        <div className="mt-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} — built by Lakshit Jain. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
