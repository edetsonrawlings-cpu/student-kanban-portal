"use client";

import { useState } from "react";

type Priority = "High" | "Medium" | "Low";
type Status = "todo" | "in-progress" | "done";

interface Task {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  priority: Priority;
  status: Status;
}

const initialTasks: Task[] = [
  { id: "1", title: "Build Binary Search Tree", course: "CS301 - Data Structures", dueDate: "Oct 24", priority: "High", status: "todo" },
  { id: "2", title: "Linear Systems Problem Set 4", course: "MATH214 - Linear Algebra", dueDate: "Oct 26", priority: "Medium", status: "todo" },
  { id: "3", title: "Research Paper Outline", course: "ENG110 - Academic Writing", dueDate: "Oct 28", priority: "Low", status: "in-progress" },
  { id: "4", title: "Lab Report 2: Pendulum Motion", course: "PHYS201 - Classical Mechanics", dueDate: "Oct 22", priority: "High", status: "in-progress" },
  { id: "5", title: "Supply & Demand Analysis", course: "ECON150 - Microeconomics", dueDate: "Oct 18", priority: "Low", status: "done" },
];

export default function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const moveTask = (id: string, newStatus: Status) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status: newStatus } : task))
    );
  };

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case "High":
        return "bg-red-500/10 text-red-600 border-red-200";
      case "Medium":
        return "bg-amber-500/10 text-amber-600 border-amber-200";
      case "Low":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
    }
  };

  const renderColumn = (status: Status, title: string, color: string) => {
    const columnTasks = tasks.filter((t) => t.status === status);

    return (
      <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl flex flex-col gap-3 min-h-[500px]">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${color}`} />
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            {columnTasks.length}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {columnTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold text-slate-500">{task.course}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              <h3 className="font-medium text-sm text-slate-900 dark:text-slate-100">{task.title}</h3>
              
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-500">
                <span>Due {task.dueDate}</span>
                
                <div className="flex gap-1">
                  {status !== "todo" && (
                    <button
                      onClick={() => moveTask(task.id, status === "done" ? "in-progress" : "todo")}
                      className="px-2 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 transition"
                    >
                      ←
                    </button>
                  )}
                  {status !== "done" && (
                    <button
                      onClick={() => moveTask(task.id, status === "todo" ? "in-progress" : "done")}
                      className="px-2 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 transition"
                    >
                      →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Assignments Kanban Board</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Track and manage your coursework tasks across stages.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderColumn("todo", "To Do", "bg-amber-500")}
        {renderColumn("in-progress", "In Progress", "bg-blue-500")}
        {renderColumn("done", "Completed", "bg-emerald-500")}
      </div>
    </div>
  );
}