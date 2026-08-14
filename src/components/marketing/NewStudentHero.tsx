"use client";

import { useState } from "react";
import { Menu, X, ArrowRight, ShieldCheck, Leaf } from "lucide-react";

/**
 * NewStudentHero
 * -----------------------------------------------------------------------
 * Header + hero section for The ICT University landing / login portal.
 * Self-contained: drop it at the top of any page. No external image
 * asset is required — the arch motif and greenery are drawn with CSS/SVG
 * so the section renders correctly with zero setup.
 * -----------------------------------------------------------------------
 */

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Programs", href: "#programs" },
  { label: "Admissions", href: "#admissions" },
  { label: "Contact", href: "#contact" },
];

export function UniversityHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-20 border-b border-black/5 bg-[#FBF9F3]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1F3A2E] text-[#E8F0EA]">
            <ShieldCheck size={18} strokeWidth={2} />
          </span>
          <span className="font-serif text-[15px] font-semibold leading-tight text-[#1F3A2E] sm:text-base">
            The ICT University
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#3F4A44] transition-colors hover:text-[#E8792C]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href="#login"
            className="rounded-full border border-[#1F3A2E]/15 px-4 py-2 text-sm font-medium text-[#1F3A2E] transition-colors hover:bg-[#1F3A2E]/5"
          >
            Log In
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-[#1F3A2E] md:hidden"
        >
          {open ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="border-t border-black/5 bg-[#FBF9F3] px-5 pb-5 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-sm font-medium text-[#3F4A44] hover:bg-[#1F3A2E]/5"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#login"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full border border-[#1F3A2E]/15 px-4 py-2.5 text-center text-sm font-medium text-[#1F3A2E]"
            >
              Log In
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

export function NewStudentHero() {
  return (
    <section className="relative overflow-hidden bg-[#F2EEE1]">
      {/* Decorative arch backdrop — soft pastel green/beige, no external image needed */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <svg
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id="skyFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F5F1E4" />
              <stop offset="100%" stopColor="#E4E9DD" />
            </linearGradient>
          </defs>
          <rect width="1200" height="600" fill="url(#skyFade)" />
          {/* row of arches */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path
              key={i}
              d={`M ${i * 220 - 40} 600 L ${i * 220 - 40} 340 A 90 90 0 0 1 ${i * 220 + 140} 340 L ${i * 220 + 140} 600 Z`}
              fill="none"
              stroke="#B9C6AE"
              strokeWidth="14"
              opacity="0.55"
            />
          ))}
        </svg>
      </div>

      {/* Decorative foliage accents ("plants" motif) */}
      <Leaf
        aria-hidden
        size={120}
        strokeWidth={1}
        className="pointer-events-none absolute -left-6 bottom-0 rotate-12 text-[#8FA487]/40"
      />
      <Leaf
        aria-hidden
        size={90}
        strokeWidth={1}
        className="pointer-events-none absolute -right-4 top-6 -rotate-12 text-[#8FA487]/30"
      />

      <div className="relative mx-auto flex max-w-6xl items-center px-5 py-16 sm:px-8 sm:py-24 md:min-h-[520px]">
        {/* Overlay card */}
        <div className="w-full max-w-md rounded-2xl bg-white/90 p-6 shadow-[0_8px_30px_rgba(31,58,46,0.12)] backdrop-blur-sm sm:p-8">
          <h1 className="font-serif text-3xl font-bold leading-tight text-[#E8792C] sm:text-4xl">
            New Student
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[#2B332E] sm:text-base">
            Start your journey here. Register to become a student to study one of our numerous
            courses.
          </p>
          <a
            href="#signup"
            className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[#E8792C] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#D4691F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8792C] focus-visible:ring-offset-2"
          >
            Sign Up
            <ArrowRight
              size={16}
              strokeWidth={2.25}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </div>
    </section>
  );
}

/**
 * Combined default export — header + hero together, ready to place at the
 * top of a landing page or login portal.
 */
export default function NewStudentLanding() {
  return (
    <>
      <UniversityHeader />
      <NewStudentHero />
    </>
  );
}
