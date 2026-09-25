import { demoProfiles } from "@/lib/mock-data";
import type { DemoProfile, Role } from "@/types";

export type DemoProfiles = Record<Role, DemoProfile>;

const STORAGE_KEY = "student-kanban-portal:demo-profiles:v1";
const ROLES: Role[] = ["STUDENT", "TEACHER", "ADMIN"];
const listeners = new Set<() => void>();
let snapshot: DemoProfiles = demoProfiles;

function isProfile(value: unknown, role: Role): value is DemoProfile {
  if (typeof value !== "object" || value === null) return false;
  const profile = value as Partial<DemoProfile>;
  return profile.role === role
    && typeof profile.name === "string"
    && profile.name.trim().length > 0
    && typeof profile.email === "string"
    && profile.email.trim().length > 0
    && typeof profile.identifier === "string"
    && profile.identifier.trim().length > 0
    && typeof profile.affiliation === "string"
    && profile.affiliation.trim().length > 0
    && typeof profile.term === "string"
    && profile.term.trim().length > 0;
}

export function parseDemoProfiles(value: unknown): DemoProfiles | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Partial<Record<Role, unknown>>;
  if (!ROLES.every((role) => isProfile(candidate[role], role))) return null;
  return candidate as DemoProfiles;
}

function readStoredProfiles(): DemoProfiles | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? parseDemoProfiles(JSON.parse(stored)) : null;
  } catch {
    return null;
  }
}

if (typeof window !== "undefined") {
  snapshot = readStoredProfiles() ?? demoProfiles;
}

export function subscribeToDemoProfiles(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getDemoProfilesSnapshot(): DemoProfiles {
  return snapshot;
}

export function getDemoProfilesServerSnapshot(): DemoProfiles {
  return demoProfiles;
}

export function updateDemoProfile(
  role: Role,
  update: Partial<Omit<DemoProfile, "role">>
): void {
  snapshot = {
    ...snapshot,
    [role]: { ...snapshot[role], ...update, role },
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Keep profile editing usable in memory when storage is unavailable.
  }

  for (const listener of listeners) listener();
}

export function resetDemoProfiles(): void {
  snapshot = demoProfiles;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // The in-memory reset still succeeds when storage is unavailable.
  }

  for (const listener of listeners) listener();
}