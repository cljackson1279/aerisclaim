"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Platform", href: "#platform" },
  { label: "How It Works", href: "#workflow" },
  { label: "Capabilities", href: "#features" },
  { label: "Company", href: "#" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#09090B]/96 backdrop-blur-md border-b border-[#1E1E26]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-[60px] items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <span className="flex h-[26px] w-[26px] items-center justify-center rounded-sm bg-[#C01028]">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path d="M7 5V9M5 7H9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
            <span className="text-[14px] font-semibold tracking-[0.01em] text-zinc-100">
              AerisClaim
            </span>
          </Link>

          {/* Center nav */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[13px] text-zinc-500 hover:text-zinc-200 transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden sm:block text-[13px] text-zinc-500 hover:text-zinc-200 transition-colors duration-150 px-3 py-1.5"
            >
              Sign in
            </Link>
            <Link
              href="#demo"
              className="inline-flex items-center gap-1.5 bg-[#C01028] hover:bg-[#A00C22] text-white text-[12px] font-semibold px-4 py-2 rounded-sm transition-colors duration-150"
            >
              Book a Demo
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
