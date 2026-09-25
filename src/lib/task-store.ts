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
const STORAGE_KEY = "student-kanban-portal:tasks:v2";
const CHANNEL_NAME = "student-kanban-portal:tasks";

const listeners = new Set<() => void>();
const channel = typeof window !== "undefined" && "BroadcastChannel" in window
  ? new BroadcastChannel(CHANNEL_NAME)
  : null;

function notifyListeners(): void {
  for (const listener of listeners) listener();
}

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

  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    let nextTasks: KanbanTask[] | null;
    try {
      nextTasks = parseTasks(JSON.parse(event.newValue));
    } catch {
      return;
    }
    if (!nextTasks) return;
    snapshot = nextTasks;
    notifyListeners();
  });

  channel?.addEventListener("message", (event: MessageEvent<unknown>) => {
    const nextTasks = parseTasks(event.data);
    if (!nextTasks) return;
    snapshot = nextTasks;
    notifyListeners();
  });
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
    channel?.postMessage(snapshot);
  } catch {
    // Storage full or blocked (private mode): keep the board usable in memory.
  }

  notifyListeners();
}

export function resetTasks(): void {
  setTasks(() => mockKanbanTasks);
}
