import { describe, expect, it } from "vitest";
import {
  mockAnnouncements,
  mockAssignments,
  mockCourses,
  mockGrades,
  mockKanbanTasks,
  mockReceipt,
  mockStudentSummary,
  receiptTotal,
} from "@/lib/mock-data";

const courseCodes = new Set(mockCourses.map((course) => course.code));

describe("mock data is internally consistent", () => {
  it("derives the enrolled course count from the course list", () => {
    expect(mockStudentSummary.enrolledCourses).toBe(mockCourses.length);
  });

  it("derives the pending assignment count from the assignment statuses", () => {
    const expected = mockAssignments.filter(
      (a) => a.status === "not_submitted" || a.status === "late"
    ).length;
    expect(mockStudentSummary.pendingAssignments).toBe(expected);
  });

  it("derives the GPA from the gradebook", () => {
    expect(mockStudentSummary.gpa).toBeGreaterThan(0);
    expect(mockStudentSummary.gpa).toBeLessThanOrEqual(mockStudentSummary.gpaMax);
  });

  it("grades every enrolled course exactly once", () => {
    expect(mockGrades.map((g) => g.courseCode).sort()).toEqual([...courseCodes].sort());
  });

  it("only references known course codes", () => {
    for (const assignment of mockAssignments) {
      expect(courseCodes.has(assignment.courseCode)).toBe(true);
    }
    for (const task of mockKanbanTasks) {
      expect(courseCodes.has(task.courseCode)).toBe(true);
    }
    for (const announcement of mockAnnouncements) {
      expect(announcement.courseCode === "ALL" || courseCodes.has(announcement.courseCode)).toBe(
        true
      );
    }
  });

  it("uses unique ids", () => {
    const ids = [
      ...mockCourses.map((c) => c.id),
      ...mockAssignments.map((a) => a.id),
      ...mockKanbanTasks.map((t) => t.id),
      ...mockAnnouncements.map((a) => a.id),
    ];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("stores every date as a parseable ISO string", () => {
    const dates = [
      ...mockAssignments.map((a) => a.dueDate),
      ...mockKanbanTasks.map((t) => t.dueDate),
      ...mockAnnouncements.map((a) => a.postedAt),
      mockReceipt.issuedOn,
    ];
    for (const date of dates) {
      expect(Number.isNaN(Date.parse(date))).toBe(false);
    }
  });

  it("totals the receipt from its line items", () => {
    expect(receiptTotal).toBe(mockReceipt.items.reduce((sum, item) => sum + item.amount, 0));
  });
});
