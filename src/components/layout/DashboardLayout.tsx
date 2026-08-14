"use client";

import { Bell, Search } from "lucide-react";
import { Sidebar } from "./Sidebar";
import type { Role } from "@/types";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: Role;
  userName?: string;
  pageTitle?: string;
}

export function DashboardLayout({
  children,
  role = "STUDENT",
  userName = "Ama Serwaa",
  pageTitle = "Dashboard",
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#FAFAF8] text-[#16233F]">
      <Sidebar role={role} userName={userName} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-[#E4E2DA] bg-white px-8">
          <h1 className="font-serif text-xl text-[#16233F]">{pageTitle}</h1>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-md border border-[#E4E2DA] bg-[#FAFAF8] px-3 py-1.5 text-sm text-[#6B7280] md:flex">
              <Search size={16} strokeWidth={1.75} />
              <input
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
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#B8563F]" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-8 py-8">{children}</main>
      </div>
    </div>
  );
}

// Default export provided alongside the named export above so both
// `import DashboardLayout from "..."` and `import { DashboardLayout } from "..."` work.
export default DashboardLayout;
