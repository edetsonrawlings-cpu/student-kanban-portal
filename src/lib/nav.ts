import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  Receipt,
  Settings,
  ShieldCheck,
} from "lucide-react";
import type { Route } from "next";
import type { Role } from "@/types";

export interface NavItem {
  label: string;
  /** Typed by `typedRoutes`, so a link to a route that does not exist fails the build. */
  href: Route;
  icon: React.ElementType;
  roles: Role[];
}

const ALL_ROLES: Role[] = ["STUDENT", "TEACHER", "ADMIN"];

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ALL_ROLES },
  { label: "Courses", href: "/courses", icon: BookOpen, roles: ALL_ROLES },
  { label: "Assignments", href: "/assignments", icon: ClipboardList, roles: ["STUDENT"] },
  { label: "Gradebook", href: "/gradebook", icon: GraduationCap, roles: ["STUDENT", "TEACHER"] },
  { label: "Announcements", href: "/announcements", icon: Megaphone, roles: ALL_ROLES },
  { label: "Fee Receipt", href: "/fee-receipt", icon: Receipt, roles: ["STUDENT"] },
  { label: "Admin", href: "/admin", icon: ShieldCheck, roles: ["ADMIN"] },
];

export const settingsNavItem: NavItem = {
  label: "Settings",
  href: "/settings",
  icon: Settings,
  roles: ALL_ROLES,
};

export function visibleNavItems(role: Role): NavItem[] {
  return navItems.filter((item) => item.roles.includes(role));
}

/**
 * Matches the item itself and its nested routes (`/courses/cs301`) without
 * matching a sibling that merely shares a prefix (`/coursework`).
 */
export function isActivePath(pathname: string | null | undefined, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getPageTitle(pathname: string | null | undefined): string {
  const match = [...navItems, settingsNavItem].find((item) => isActivePath(pathname, item.href));
  return match?.label ?? "Student Portal";
}
