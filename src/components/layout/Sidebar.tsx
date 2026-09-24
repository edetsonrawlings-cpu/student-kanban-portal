"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { isActivePath, settingsNavItem, visibleNavItems } from "@/lib/nav";
import type { Role } from "@/types";

interface SidebarProps {
  role: Role;
  userName: string;
  className?: string;
  /** Called after a nav link is followed, so the mobile drawer can close. */
  onNavigate?: () => void;
}

export function Sidebar({ role, userName, className, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const items = visibleNavItems(role);
  const SettingsIcon = settingsNavItem.icon;
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <aside
      className={cn(
        "flex h-full w-64 shrink-0 flex-col border-r border-[#E4E2DA] bg-[#0F1B33] text-[#F3F1EA]",
        className
      )}
    >
      {/* Brand mark */}
      <div className="flex items-center gap-2 border-b border-white/10 px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C9A227] font-serif text-sm font-semibold text-[#C9A227]">
          SP
        </div>
        <span className="font-serif text-lg tracking-wide">Student Portal</span>
      </div>

      {/* Nav */}
      <nav aria-label="Main" className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
        {items.map((item) => {
          const active = isActivePath(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
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
          href={settingsNavItem.href}
          onClick={onNavigate}
          aria-current={isActivePath(pathname, settingsNavItem.href) ? "page" : undefined}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[#CBD2E0] hover:bg-white/5 hover:text-white"
        >
          <SettingsIcon size={18} strokeWidth={1.75} className="text-[#8B93A8]" />
          {settingsNavItem.label}
        </Link>
        {/* Sign-out is inert until authentication is wired up (see README). */}
        <Link
          href="/"
          onClick={onNavigate}
          className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-[#CBD2E0] hover:bg-white/5 hover:text-white"
        >
          <LogOut size={18} strokeWidth={1.75} className="text-[#8B93A8]" />
          Sign out
        </Link>

        <div className="mt-4 flex items-center gap-3 rounded-md bg-white/5 px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C9A227] text-xs font-semibold text-[#0F1B33]">
            {initials}
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

export default Sidebar;
