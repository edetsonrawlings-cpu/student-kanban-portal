import type { KanbanStatus, KanbanTask, TaskPriority } from "@/types";

export const KANBAN_COLUMNS: { status: KanbanStatus; title: string; dot: string }[] = [
  { status: "todo", title: "To Do", dot: "bg-amber-500" },
  { status: "in-progress", title: "In Progress", dot: "bg-blue-500" },
  { status: "testing", title: "Testing", dot: "bg-purple-500" },
  { status: "done", title: "Done", dot: "bg-emerald-500" },
];

const ORDER: KanbanStatus[] = KANBAN_COLUMNS.map((column) => column.status);

export const TASK_PRIORITIES: TaskPriority[] = ["High", "Medium", "Low"];

export function getNextStatus(current: KanbanStatus): KanbanStatus {
  const index = ORDER.indexOf(current);
  return ORDER[Math.min(index + 1, ORDER.length - 1)];
}

export function getPrevStatus(current: KanbanStatus): KanbanStatus {
  const index = ORDER.indexOf(current);
  return ORDER[Math.max(index - 1, 0)];
}

export function moveTask(
  tasks: KanbanTask[],
  id: string,
  status: KanbanStatus
): KanbanTask[] {
  return tasks.map((task) => (task.id === id ? { ...task, status } : task));
}

export function removeTask(tasks: KanbanTask[], id: string): KanbanTask[] {
  return tasks.filter((task) => task.id !== id);
}

export function addTask(tasks: KanbanTask[], task: KanbanTask): KanbanTask[] {
  return [...tasks, task];
}

export interface TaskFilters {
  courseCode?: string;
  priority?: TaskPriority;
}

export function filterTasks(tasks: KanbanTask[], filters: TaskFilters): KanbanTask[] {
  return tasks.filter((task) => {
    if (filters.courseCode && task.courseCode !== filters.courseCode) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    return true;
  });
}

/** Earliest deadline first, then highest priority. */
export function sortByDueDate(tasks: KanbanTask[]): KanbanTask[] {
  const weight: Record<TaskPriority, number> = { High: 0, Medium: 1, Low: 2 };
  return [...tasks].sort((a, b) => {
    const delta = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    return delta !== 0 ? delta : weight[a.priority] - weight[b.priority];
  });
}

/**
 * Narrows unknown input (e.g. a `localStorage` payload written by an older
 * build) down to tasks this version understands.
 */
export function parseTasks(value: unknown): KanbanTask[] | null {
  if (!Array.isArray(value)) return null;

  const tasks: KanbanTask[] = [];
  for (const entry of value) {
    if (typeof entry !== "object" || entry === null) return null;
    const task = entry as Partial<KanbanTask>;
    if (
      typeof task.id !== "string" ||
      typeof task.title !== "string" ||
      typeof task.courseCode !== "string" ||
      typeof task.dueDate !== "string" ||
      !TASK_PRIORITIES.includes(task.priority as TaskPriority) ||
      !ORDER.includes(task.status as KanbanStatus)
    ) {
      return null;
    }
    tasks.push({
      id: task.id,
      title: task.title,
      courseCode: task.courseCode,
      dueDate: task.dueDate,
      priority: task.priority as TaskPriority,
      status: task.status as KanbanStatus,
    });
  }

  return tasks;
}
