import { parseTasks } from "@/lib/kanban";
import { mockKanbanTasks } from "@/lib/mock-data";
import type { KanbanTask } from "@/types";

/**
 * Kanban board persistence.
 *
 * Exposed as an external store (`useSyncExternalStore`) rather than as state
 * loaded from an effect: React renders the server snapshot during hydration and
 * only then swaps in the browser snapshot, which keeps the markup identical on
 * both sides while still restoring the saved board.
 */
const STORAGE_KEY = "student-kanban-portal:tasks:v1";

const listeners = new Set<() => void>();

function readStoredTasks(): KanbanTask[] | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return parseTasks(JSON.parse(raw));
  } catch {
    // Corrupted payload, or storage disabled: fall back to the seed board.
    return null;
  }
}

let snapshot: KanbanTask[] = mockKanbanTasks;

if (typeof window !== "undefined") {
  snapshot = readStoredTasks() ?? mockKanbanTasks;
}

export function subscribeToTasks(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getTasksSnapshot(): KanbanTask[] {
  return snapshot;
}

export function getTasksServerSnapshot(): KanbanTask[] {
  return mockKanbanTasks;
}

export function setTasks(update: (current: KanbanTask[]) => KanbanTask[]): void {
  snapshot = update(snapshot);

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Storage full or blocked (private mode): keep the board usable in memory.
  }

  for (const listener of listeners) listener();
}
