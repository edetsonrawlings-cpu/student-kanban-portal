"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { AlertCircle, CircleCheckBig, Plus, RotateCcw, SlidersHorizontal, Trash2 } from "lucide-react";
import {
  addTask,
  canMoveTaskToStatus,
  countTasksInStatus,
  filterTasks,
  getNextStatus,
  getPrevStatus,
  KANBAN_COLUMNS,
  moveTask,
  removeTask,
  sortByDueDate,
  TASK_PRIORITIES,
} from "@/lib/kanban";
import {
  getKanbanLimitsServerSnapshot,
  getKanbanLimitsSnapshot,
  resetKanbanLimits,
  setKanbanLimit,
  subscribeToKanbanLimits,
} from "@/lib/kanban-limit-store";
import { mockCourses } from "@/lib/mock-data";
import {
  getTasksServerSnapshot,
  getTasksSnapshot,
  setTasks,
  subscribeToTasks,
} from "@/lib/task-store";
import { useIsClient } from "@/lib/use-is-client";
import { cn, formatDueDate, isOverdue } from "@/lib/utils";
import type { KanbanStatus, TaskPriority } from "@/types";

const PRIORITY_BADGE: Record<TaskPriority, string> = {
  High: "bg-red-500/10 text-red-600 border-red-200",
  Medium: "bg-amber-500/10 text-amber-600 border-amber-200",
  Low: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
};

function columnTitle(status: KanbanStatus): string {
  return KANBAN_COLUMNS.find((column) => column.status === status)?.title ?? status;
}

export function KanbanBoard() {
  const tasks = useSyncExternalStore(
    subscribeToTasks,
    getTasksSnapshot,
    getTasksServerSnapshot
  );
  const limits = useSyncExternalStore(
    subscribeToKanbanLimits,
    getKanbanLimitsSnapshot,
    getKanbanLimitsServerSnapshot
  );
  // Deadlines depend on the current time, so they can only be compared once the
  // hydration render is over — otherwise server and client markup can diverge.
  const isClient = useIsClient();
  const [courseFilter, setCourseFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [limitsOpen, setLimitsOpen] = useState(false);
  const [limitMessage, setLimitMessage] = useState("");
  const [title, setTitle] = useState("");
  const [courseCode, setCourseCode] = useState(mockCourses[0].code);
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Medium");

  const visibleTasks = useMemo(
    () =>
      sortByDueDate(
        filterTasks(tasks, {
          courseCode: courseFilter || undefined,
          priority: (priorityFilter as TaskPriority) || undefined,
        })
      ),
    [tasks, courseFilter, priorityFilter]
  );
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const completion = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const handleCreate = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || !dueDate) return;
    if (countTasksInStatus(tasks, "todo") >= limits.todo) {
      setLimitMessage(
        `To Do is full (${countTasksInStatus(tasks, "todo")}/${limits.todo}). Increase its limit or move a task out.`
      );
      return;
    }

    setTasks((prev) =>
      addTask(prev, {
        id: crypto.randomUUID(),
        title: trimmed,
        courseCode,
        // `<input type="date">` yields `YYYY-MM-DD`; pin it to end of day UTC.
        dueDate: new Date(`${dueDate}T23:59:00Z`).toISOString(),
        priority,
        status: "todo",
      })
    );

    setTitle("");
    setDueDate("");
    setPriority("Medium");
    setFormOpen(false);
    setLimitMessage("");
  };

  const attemptMove = (taskId: string, status: KanbanStatus) => {
    if (!canMoveTaskToStatus(tasks, taskId, status, limits)) {
      setLimitMessage(
        `${columnTitle(status)} is full (${countTasksInStatus(tasks, status)}/${limits[status]}). Increase its limit or move a task out.`
      );
      return;
    }

    setTasks((current) =>
      canMoveTaskToStatus(current, taskId, status, limits)
        ? moveTask(current, taskId, status)
        : current
    );
    setLimitMessage("");
  };

  const handleDrop = (status: KanbanStatus) => {
    if (draggedId) attemptMove(draggedId, status);
    setDraggedId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 border-y border-[#E4E2DA] py-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-sm text-[#16233F]">
          <CircleCheckBig size={18} className="text-emerald-600" aria-hidden />
          <span className="font-semibold">Development progress</span>
          <span className="text-[#6B7280]">{completedTasks} of {tasks.length} complete</span>
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:ml-4">
          <progress
            className="portal-progress h-2 flex-1 overflow-hidden rounded-full"
            aria-label="Portal development progress"
            max={100}
            value={completion}
          >
            {completion}%
          </progress>
          <span className="w-10 text-right text-sm font-semibold text-[#16233F]">{completion}%</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="course-filter" className="text-xs font-medium text-[#6B7280]">
            Course
          </label>
          <select
            id="course-filter"
            value={courseFilter}
            onChange={(event) => setCourseFilter(event.target.value)}
            className="rounded-md border border-[#E4E2DA] bg-white px-2 py-1.5 text-sm text-[#16233F]"
          >
            <option value="">All courses</option>
            {mockCourses.map((course) => (
              <option key={course.code} value={course.code}>
                {course.code}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="priority-filter" className="text-xs font-medium text-[#6B7280]">
            Priority
          </label>
          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
            className="rounded-md border border-[#E4E2DA] bg-white px-2 py-1.5 text-sm text-[#16233F]"
          >
            <option value="">Any priority</option>
            {TASK_PRIORITIES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLimitsOpen((open) => !open)}
            aria-expanded={limitsOpen}
            className="flex items-center gap-1.5 rounded-md border border-[#E4E2DA] bg-white px-3 py-1.5 text-sm font-medium text-[#16233F] hover:bg-[#FAFAF8]"
          >
            <SlidersHorizontal size={15} strokeWidth={1.75} aria-hidden />
            Column limits
          </button>
          <button
            type="button"
            onClick={() => setFormOpen((open) => !open)}
            aria-expanded={formOpen}
            className="flex items-center gap-1.5 rounded-md bg-[#16233F] px-3 py-1.5 text-sm text-white hover:bg-[#0F1B33]"
          >
            <Plus size={15} strokeWidth={2} aria-hidden />
            New task
          </button>
        </div>
      </div>

      {limitsOpen && (
        <section
          aria-labelledby="column-limits-title"
          className="rounded-lg border border-[#E4E2DA] bg-white p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 id="column-limits-title" className="font-semibold text-[#16233F]">
                Work-in-progress limits
              </h3>
              <p className="mt-1 text-xs text-[#6B7280]">
                Existing cards stay in place if a limit is lowered. New cards cannot enter a full column.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                resetKanbanLimits();
                setLimitMessage("");
              }}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold text-[#6B7280] hover:bg-[#FAFAF8] hover:text-[#16233F]"
            >
              <RotateCcw size={14} aria-hidden />
              Reset limits
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {KANBAN_COLUMNS.map((column) => {
              const count = countTasksInStatus(tasks, column.status);
              return (
                <div key={column.status} className="rounded-md bg-[#FAFAF8] p-3">
                  <label
                    htmlFor={`limit-${column.status}`}
                    className="block text-xs font-semibold text-[#16233F]"
                  >
                    {column.title}
                  </label>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      id={`limit-${column.status}`}
                      type="number"
                      min={1}
                      max={99}
                      value={limits[column.status]}
                      aria-label={`Maximum tasks for ${column.title}`}
                      onChange={(event) => setKanbanLimit(column.status, Number(event.target.value))}
                      className="w-16 rounded-md border border-[#E4E2DA] bg-white px-2 py-1.5 text-sm font-semibold text-[#16233F] outline-none focus:border-[#2F4470]"
                    />
                    <span className="text-xs text-[#6B7280]">{count} now</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {limitMessage && (
        <div role="alert" className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden />
          <span>{limitMessage}</span>
        </div>
      )}

      {formOpen && (
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 gap-3 rounded-xl border border-[#E4E2DA] bg-white p-4 sm:grid-cols-2 lg:grid-cols-5"
        >
          <div className="lg:col-span-2">
            <label htmlFor="task-title" className="text-xs font-medium text-[#6B7280]">
              Title
            </label>
            <input
              id="task-title"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Write the sprint report"
              className="mt-1 w-full rounded-md border border-[#E4E2DA] px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label htmlFor="task-course" className="text-xs font-medium text-[#6B7280]">
              Course
            </label>
            <select
              id="task-course"
              value={courseCode}
              onChange={(event) => setCourseCode(event.target.value)}
              className="mt-1 w-full rounded-md border border-[#E4E2DA] px-2 py-1.5 text-sm"
            >
              {mockCourses.map((course) => (
                <option key={course.code} value={course.code}>
                  {course.code}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="task-due" className="text-xs font-medium text-[#6B7280]">
              Due date
            </label>
            <input
              id="task-due"
              type="date"
              required
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="mt-1 w-full rounded-md border border-[#E4E2DA] px-2 py-1.5 text-sm"
            />
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label htmlFor="task-priority" className="text-xs font-medium text-[#6B7280]">
                Priority
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(event) => setPriority(event.target.value as TaskPriority)}
                className="mt-1 w-full rounded-md border border-[#E4E2DA] px-2 py-1.5 text-sm"
              >
                {TASK_PRIORITIES.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="rounded-md bg-[#C9A227] px-3 py-1.5 text-sm font-medium text-[#0F1B33]"
            >
              Add
            </button>
          </div>
        </form>
      )}

      {/* Board */}
      <div className="kanban-grid grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {KANBAN_COLUMNS.map((column) => {
          const columnTasks = visibleTasks.filter((task) => task.status === column.status);
          const totalColumnTasks = countTasksInStatus(tasks, column.status);
          const atLimit = totalColumnTasks >= limits[column.status];
          const overLimit = totalColumnTasks > limits[column.status];
          let capacityBadge = "bg-slate-200 text-slate-600";
          if (atLimit) capacityBadge = "bg-amber-100 text-amber-800";
          if (overLimit) capacityBadge = "bg-red-100 text-red-700";

          return (
            <section
              key={column.status}
              aria-label={column.title}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(column.status)}
              className={cn(
                "kanban-column flex min-h-56 flex-col gap-3 rounded-xl bg-slate-100 p-4 md:min-h-[500px]",
                atLimit && "ring-1 ring-amber-300",
                overLimit && "ring-2 ring-red-400"
              )}
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <span aria-hidden className={cn("h-3 w-3 rounded-full", column.dot)} />
                  <h3 className="font-semibold text-slate-800">{column.title}</h3>
                </div>
                <span
                  title={`${totalColumnTasks} of ${limits[column.status]} tasks`}
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                    capacityBadge
                  )}
                >
                  {totalColumnTasks} / {limits[column.status]}
                </span>
              </div>

              <ul className="flex flex-col gap-3">
                {columnTasks.map((task) => {
                  const overdue = isClient && task.status !== "done" && isOverdue(task.dueDate);

                  return (
                    <li
                      key={task.id}
                      id={`task-${task.id}`}
                      draggable
                      onDragStart={() => setDraggedId(task.id)}
                      onDragEnd={() => setDraggedId(null)}
                      className={cn(
                        "scroll-mt-4 space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm target:ring-2 target:ring-[#2F4470]",
                        draggedId === task.id && "opacity-50"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-500">
                          {task.courseCode}
                        </span>
                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] font-bold",
                            PRIORITY_BADGE[task.priority]
                          )}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <h4 className="kanban-card-title text-sm font-medium text-slate-900">
                        {task.title}
                      </h4>

                      <div className="kanban-card-meta flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-500">
                        <span className={cn(overdue && "font-semibold text-red-600")}>
                          {overdue ? "Overdue · " : "Due "}
                          {formatDueDate(task.dueDate)}
                        </span>

                        <div className="flex gap-1">
                          {column.status !== "todo" && (
                            <button
                              type="button"
                              aria-label={`Move "${task.title}" to ${columnTitle(getPrevStatus(column.status))}`}
                              disabled={!canMoveTaskToStatus(tasks, task.id, getPrevStatus(column.status), limits)}
                              title={!canMoveTaskToStatus(tasks, task.id, getPrevStatus(column.status), limits)
                                ? `${columnTitle(getPrevStatus(column.status))} is full`
                                : undefined}
                              onClick={() => attemptMove(task.id, getPrevStatus(column.status))}
                              className="rounded bg-slate-100 px-2 py-1 text-[11px] text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-35"
                            >
                              <span aria-hidden>←</span>
                            </button>
                          )}
                          {column.status !== "done" && (
                            <button
                              type="button"
                              aria-label={`Move "${task.title}" to ${columnTitle(getNextStatus(column.status))}`}
                              disabled={!canMoveTaskToStatus(tasks, task.id, getNextStatus(column.status), limits)}
                              title={!canMoveTaskToStatus(tasks, task.id, getNextStatus(column.status), limits)
                                ? `${columnTitle(getNextStatus(column.status))} is full`
                                : undefined}
                              onClick={() => attemptMove(task.id, getNextStatus(column.status))}
                              className="rounded bg-slate-100 px-2 py-1 text-[11px] text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-35"
                            >
                              <span aria-hidden>→</span>
                            </button>
                          )}
                          <button
                            type="button"
                            aria-label={`Delete "${task.title}"`}
                            onClick={() => setTasks((prev) => removeTask(prev, task.id))}
                            className="rounded bg-slate-100 px-2 py-1 text-slate-600 transition hover:bg-red-100 hover:text-red-600"
                          >
                            <Trash2 size={12} strokeWidth={1.75} aria-hidden />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default KanbanBoard;
