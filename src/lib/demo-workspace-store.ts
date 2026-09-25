import {
  mockAnnouncements,
  mockAssignments,
  mockCourses,
  mockPortalUsers,
  mockTeacherGrades,
} from "@/lib/mock-data";
import type { DemoWorkspace } from "@/types";

const STORAGE_KEY = "student-kanban-portal:demo-workspace:v3";

const seedWorkspace: DemoWorkspace = {
  announcements: mockAnnouncements,
  assignments: mockAssignments,
  courses: mockCourses,
  teacherGrades: mockTeacherGrades,
  users: mockPortalUsers,
};

const listeners = new Set<() => void>();
let snapshot = seedWorkspace;

function parseWorkspace(value: unknown): DemoWorkspace | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<DemoWorkspace>;
  if (
    !Array.isArray(candidate.announcements) ||
    !Array.isArray(candidate.assignments) ||
    !Array.isArray(candidate.courses) ||
    !Array.isArray(candidate.teacherGrades) ||
    !Array.isArray(candidate.users)
  ) {
    return null;
  }
  return candidate as DemoWorkspace;
}

function readStoredWorkspace(): DemoWorkspace | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? parseWorkspace(JSON.parse(stored)) : null;
  } catch {
    return null;
  }
}

if (typeof window !== "undefined") {
  snapshot = readStoredWorkspace() ?? seedWorkspace;
}

export function subscribeToDemoWorkspace(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getDemoWorkspaceSnapshot(): DemoWorkspace {
  return snapshot;
}

export function getDemoWorkspaceServerSnapshot(): DemoWorkspace {
  return seedWorkspace;
}

export function updateDemoWorkspace(update: (current: DemoWorkspace) => DemoWorkspace): void {
  snapshot = update(snapshot);

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Keep demo actions usable in memory when storage is unavailable.
  }

  for (const listener of listeners) listener();
}

export function resetDemoWorkspace(): void {
  updateDemoWorkspace(() => seedWorkspace);
}