import { DEFAULT_ACCOUNT_IDS } from "@/lib/mock-data";
import type { Role } from "@/types";

export type ActiveAccountIds = Record<Role, string>;

const STORAGE_KEY = "student-kanban-portal:active-accounts:v1";
const ROLES: Role[] = ["STUDENT", "TEACHER", "ADMIN"];
const listeners = new Set<() => void>();
let snapshot: ActiveAccountIds = { ...DEFAULT_ACCOUNT_IDS };

function parseActiveAccountIds(value: unknown): ActiveAccountIds | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Partial<Record<Role, unknown>>;
  if (!ROLES.every((role) => typeof candidate[role] === "string" && candidate[role].trim())) {
    return null;
  }
  return candidate as ActiveAccountIds;
}

function readStoredAccounts(): ActiveAccountIds | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? parseActiveAccountIds(JSON.parse(stored)) : null;
  } catch {
    return null;
  }
}

if (typeof window !== "undefined") {
  snapshot = readStoredAccounts() ?? { ...DEFAULT_ACCOUNT_IDS };
}

export function subscribeToActiveAccounts(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getActiveAccountsSnapshot(): ActiveAccountIds {
  return snapshot;
}

export function getActiveAccountsServerSnapshot(): ActiveAccountIds {
  return DEFAULT_ACCOUNT_IDS;
}

export function setActiveAccountId(role: Role, accountId: string): void {
  if (!accountId.trim()) return;
  snapshot = { ...snapshot, [role]: accountId };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Keep account switching usable in memory when storage is unavailable.
  }

  for (const listener of listeners) listener();
}

export function resetActiveAccounts(): void {
  snapshot = { ...DEFAULT_ACCOUNT_IDS };

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // The in-memory reset still succeeds when storage is unavailable.
  }

  for (const listener of listeners) listener();
}