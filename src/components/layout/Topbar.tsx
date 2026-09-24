"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, Menu, Search, X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { getPageTitle } from "@/lib/nav";
import type { Role } from "@/types";

interface TopbarProps {
  role: Role;
  userName: string;
}

export function Topbar({ role, userName }: TopbarProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  // Close the drawer when the route changes (including via the back button).
  // Adjusting state during render is the supported alternative to an effect.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setDrawerOpen(false);
  }

  // Close the drawer on Escape.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  return (
    <>
      <header className="flex h-16 items-center justify-between gap-3 border-b border-[#E4E2DA] bg-white px-4 sm:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
            className="rounded-md p-2 text-[#6B7280] hover:bg-[#FAFAF8] lg:hidden"
          >
            <Menu size={20} strokeWidth={1.75} />
          </button>
          <h1 className="truncate font-serif text-xl text-[#16233F]">{getPageTitle(pathname)}</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden items-center gap-2 rounded-md border border-[#E4E2DA] bg-[#FAFAF8] px-3 py-1.5 text-sm text-[#6B7280] md:flex">
            <Search size={16} strokeWidth={1.75} aria-hidden />
            <label htmlFor="portal-search" className="sr-only">
              Search courses and assignments
            </label>
            <input
              id="portal-search"
              type="search"
              placeholder="Search courses, assignments…"
              className="w-56 bg-transparent outline-none placeholder:text-[#9CA3AF]"
            />
          </div>
          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-md p-2 text-[#6B7280] hover:bg-[#FAFAF8]"
          >
            <Bell size={19} strokeWidth={1.75} />
            <span aria-hidden className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#B8563F]" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 h-full w-full bg-[#0F1B33]/60"
          />
          <div className="absolute inset-y-0 left-0 flex">
            <Sidebar role={role} userName={userName} onNavigate={() => setDrawerOpen(false)} />
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setDrawerOpen(false)}
              className="m-2 h-9 w-9 rounded-md bg-white/10 text-white"
            >
              <X size={18} strokeWidth={1.75} className="mx-auto" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Topbar;
