import type { Role } from "@/types";

const STORAGE_KEY = "student-kanban-portal:demo-role:v1";
const DEFAULT_ROLE: Role = "STUDENT";
const ROLES: Role[] = ["STUDENT", "TEACHER", "ADMIN"];

const listeners = new Set<() => void>();
let snapshot: Role = DEFAULT_ROLE;

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && ROLES.includes(value as Role);
}

function readStoredRole(): Role {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isRole(stored) ? stored : DEFAULT_ROLE;
  } catch {
    return DEFAULT_ROLE;
  }
}

if (typeof window !== "undefined") {
  snapshot = readStoredRole();
}

export function subscribeToDemoRole(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getDemoRoleSnapshot(): Role {
  return snapshot;
}

export function getDemoRoleServerSnapshot(): Role {
  return DEFAULT_ROLE;
}

export function setDemoRole(role: Role): void {
  snapshot = role;

  try {
    window.localStorage.setItem(STORAGE_KEY, role);
  } catch {
    // Keep the role switcher usable in memory when storage is unavailable.
  }

  for (const listener of listeners) listener();
}