"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Megaphone,
  Receipt,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: Role[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["STUDENT", "TEACHER", "ADMIN"] },
  { label: "Courses", href: "/courses", icon: BookOpen, roles: ["STUDENT", "TEACHER", "ADMIN"] },
  { label: "Assignments", href: "/assignments", icon: ClipboardList, roles: ["STUDENT"] },
  { label: "Gradebook", href: "/gradebook", icon: GraduationCap, roles: ["STUDENT", "TEACHER"] },
  { label: "Announcements", href: "/announcements", icon: Megaphone, roles: ["STUDENT", "TEACHER", "ADMIN"] },
  { label: "Fee Receipt", href: "/fee-receipt", icon: Receipt, roles: ["STUDENT"] },
  { label: "Admin", href: "/admin", icon: ShieldCheck, roles: ["ADMIN"] },
];

interface SidebarProps {
  role?: Role;
  userName?: string;
}

export function Sidebar({ role = "STUDENT", userName = "Ama Serwaa" }: SidebarProps) {
  const pathname = usePathname();
  const visibleItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-[#E4E2DA] bg-[#0F1B33] text-[#F3F1EA]">
      {/* Brand mark */}
      <div className="flex items-center gap-2 border-b border-white/10 px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C9A227] text-sm font-serif font-semibold text-[#C9A227]">
          SP
        </div>
        <span className="font-serif text-lg tracking-wide">Student Portal</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        {visibleItems.map((item) => {
          const active = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-[#C9A227]/15 text-[#C9A227]"
                  : "text-[#CBD2E0] hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon
                size={18}
                strokeWidth={1.75}
                className={cn(active ? "text-[#C9A227]" : "text-[#8B93A8] group-hover:text-white")}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer / account */}
      <div className="border-t border-white/10 px-3 py-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[#CBD2E0] hover:bg-white/5 hover:text-white"
        >
          <Settings size={18} strokeWidth={1.75} className="text-[#8B93A8]" />
          Settings
        </Link>
        <button
          type="button"
          className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-[#CBD2E0] hover:bg-white/5 hover:text-white"
        >
          <LogOut size={18} strokeWidth={1.75} className="text-[#8B93A8]" />
          Sign out
        </button>

        <div className="mt-4 flex items-center gap-3 rounded-md bg-white/5 px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C9A227] text-xs font-semibold text-[#0F1B33]">
            {userName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{userName}</p>
            <p className="truncate text-xs capitalize text-[#8B93A8]">{role.toLowerCase()}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

// Default export provided alongside the named export above so both
// `import Sidebar from "..."` and `import { Sidebar } from "..."` work.
export default Sidebar;
