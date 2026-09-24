import { describe, expect, it } from "vitest";
import {
  addTask,
  filterTasks,
  getNextStatus,
  getPrevStatus,
  KANBAN_COLUMNS,
  moveTask,
  parseTasks,
  removeTask,
  sortByDueDate,
} from "@/lib/kanban";
import type { KanbanTask } from "@/types";

function task(overrides: Partial<KanbanTask> = {}): KanbanTask {
  return {
    id: "t1",
    title: "Task",
    courseCode: "CS301",
    dueDate: "2026-09-26T23:59:00Z",
    priority: "Medium",
    status: "todo",
    ...overrides,
  };
}

describe("status transitions", () => {
  it("walks forward through every column", () => {
    expect(getNextStatus("todo")).toBe("in-progress");
    expect(getNextStatus("in-progress")).toBe("testing");
    expect(getNextStatus("testing")).toBe("done");
  });

  it("walks backward through every column", () => {
    expect(getPrevStatus("done")).toBe("testing");
    expect(getPrevStatus("testing")).toBe("in-progress");
    expect(getPrevStatus("in-progress")).toBe("todo");
  });

  it("clamps at both ends instead of wrapping around", () => {
    expect(getNextStatus("done")).toBe("done");
    expect(getPrevStatus("todo")).toBe("todo");
  });

  it("covers exactly the rendered columns", () => {
    expect(KANBAN_COLUMNS.map((column) => column.status)).toEqual([
      "todo",
      "in-progress",
      "testing",
      "done",
    ]);
  });
});

describe("board mutations", () => {
  const tasks = [task({ id: "a" }), task({ id: "b", status: "done" })];

  it("moves only the targeted task and does not mutate the input", () => {
    const next = moveTask(tasks, "a", "testing");
    expect(next.find((t) => t.id === "a")?.status).toBe("testing");
    expect(next.find((t) => t.id === "b")?.status).toBe("done");
    expect(tasks[0].status).toBe("todo");
  });

  it("is a no-op when the id is unknown", () => {
    expect(moveTask(tasks, "missing", "done")).toEqual(tasks);
  });

  it("removes a task", () => {
    expect(removeTask(tasks, "a").map((t) => t.id)).toEqual(["b"]);
  });

  it("appends a task without mutating the input", () => {
    const next = addTask(tasks, task({ id: "c" }));
    expect(next).toHaveLength(3);
    expect(tasks).toHaveLength(2);
  });
});

describe("filterTasks", () => {
  const tasks = [
    task({ id: "a", courseCode: "CS301", priority: "High" }),
    task({ id: "b", courseCode: "MATH214", priority: "High" }),
    task({ id: "c", courseCode: "CS301", priority: "Low" }),
  ];

  it("returns everything when no filter is set", () => {
    expect(filterTasks(tasks, {})).toHaveLength(3);
  });

  it("filters by course", () => {
    expect(filterTasks(tasks, { courseCode: "CS301" }).map((t) => t.id)).toEqual(["a", "c"]);
  });

  it("combines course and priority", () => {
    expect(filterTasks(tasks, { courseCode: "CS301", priority: "High" }).map((t) => t.id)).toEqual([
      "a",
    ]);
  });
});

describe("sortByDueDate", () => {
  it("orders by deadline, then by priority", () => {
    const tasks = [
      task({ id: "late", dueDate: "2026-10-05T00:00:00Z" }),
      task({ id: "early-low", dueDate: "2026-10-01T00:00:00Z", priority: "Low" }),
      task({ id: "early-high", dueDate: "2026-10-01T00:00:00Z", priority: "High" }),
    ];
    expect(sortByDueDate(tasks).map((t) => t.id)).toEqual(["early-high", "early-low", "late"]);
  });
});

describe("parseTasks", () => {
  it("accepts a well-formed payload", () => {
    expect(parseTasks([task()])).toEqual([task()]);
  });

  it("rejects payloads that are not arrays", () => {
    expect(parseTasks({})).toBeNull();
    expect(parseTasks(null)).toBeNull();
  });

  it("rejects entries with an unknown status or priority", () => {
    expect(parseTasks([{ ...task(), status: "archived" }])).toBeNull();
    expect(parseTasks([{ ...task(), priority: "Urgent" }])).toBeNull();
  });

  it("rejects entries with missing fields", () => {
    expect(parseTasks([{ id: "a" }])).toBeNull();
  });

  it("drops unknown extra properties", () => {
    expect(parseTasks([{ ...task(), rogue: "value" }])).toEqual([task()]);
  });
});
