import { DEFAULT_KANBAN_LIMITS, parseKanbanLimits } from "@/lib/kanban";
import type { KanbanLimits, KanbanStatus } from "@/types";

const STORAGE_KEY = "student-kanban-portal:kanban-limits:v1";
const listeners = new Set<() => void>();
let snapshot: KanbanLimits = DEFAULT_KANBAN_LIMITS;

function readStoredLimits(): KanbanLimits | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? parseKanbanLimits(JSON.parse(stored)) : null;
  } catch {
    return null;
  }
}

if (typeof window !== "undefined") {
  snapshot = readStoredLimits() ?? DEFAULT_KANBAN_LIMITS;
}

export function subscribeToKanbanLimits(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getKanbanLimitsSnapshot(): KanbanLimits {
  return snapshot;
}

export function getKanbanLimitsServerSnapshot(): KanbanLimits {
  return DEFAULT_KANBAN_LIMITS;
}

export function setKanbanLimit(status: KanbanStatus, limit: number): void {
  if (!Number.isInteger(limit) || limit < 1 || limit > 99) return;
  snapshot = { ...snapshot, [status]: limit };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Keep limits usable in memory when storage is unavailable.
  }

  for (const listener of listeners) listener();
}

export function resetKanbanLimits(): void {
  snapshot = DEFAULT_KANBAN_LIMITS;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // The in-memory reset still succeeds when storage is unavailable.
  }

  for (const listener of listeners) listener();
}