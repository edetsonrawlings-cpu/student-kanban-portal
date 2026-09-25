import { describe, expect, it } from "vitest";
import { parseDemoProfiles } from "@/lib/demo-profile-store";
import {
  DEFAULT_ACCOUNT_IDS,
  demoProfiles,
  mockAnnouncements,
  mockAssignments,
  mockCourses,
  mockGrades,
  mockKanbanTasks,
  mockPortalUsers,
  mockReceipt,
  mockStudentSummary,
  mockTeacherGrades,
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
    for (const grade of mockTeacherGrades) {
      expect(courseCodes.has(grade.courseCode)).toBe(true);
    }
  });

  it("uses unique ids", () => {
    const ids = [
      ...mockCourses.map((c) => c.id),
      ...mockAssignments.map((a) => a.id),
      ...mockKanbanTasks.map((t) => t.id),
      ...mockAnnouncements.map((a) => a.id),
      ...mockTeacherGrades.map((grade) => grade.id),
      ...mockPortalUsers.map((user) => user.id),
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

  it("seeds a complete portal development roadmap", () => {
    expect(mockKanbanTasks.length).toBeGreaterThanOrEqual(24);
    expect(new Set(mockKanbanTasks.map((task) => task.status))).toEqual(
      new Set(["todo", "in-progress", "testing", "done"])
    );
    expect(mockKanbanTasks.every((task) => task.courseCode === "CS301")).toBe(true);
  });

  it("defines one coherent profile for every demo role", () => {
    expect(Object.keys(demoProfiles).sort()).toEqual(["ADMIN", "STUDENT", "TEACHER"]);
    for (const [role, profile] of Object.entries(demoProfiles)) {
      expect(profile.role).toBe(role);
      expect(profile.name).not.toBe("");
      expect(profile.email).toContain("@");
      expect(profile.identifier).not.toBe("");
    }
  });

  it("accepts complete persisted profiles and rejects malformed ones", () => {
    expect(parseDemoProfiles(demoProfiles)).toEqual(demoProfiles);
    expect(parseDemoProfiles({ ...demoProfiles, TEACHER: { ...demoProfiles.TEACHER, email: null } })).toBeNull();
    expect(parseDemoProfiles({ ...demoProfiles, TEACHER: { ...demoProfiles.TEACHER, role: "ADMIN" } })).toBeNull();
  });

  it("keeps portal account emails unique", () => {
    const emails = mockPortalUsers.map((user) => user.email);
    expect(new Set(emails).size).toBe(emails.length);
  });

  it("links assigned courses only to known teacher accounts", () => {
    for (const course of mockCourses) {
      if (!course.instructorId) continue;
      const instructor = mockPortalUsers.find((user) => user.id === course.instructorId);
      expect(instructor?.role).toBe("TEACHER");
    }
  });

  it("provides multiple active accounts for every demo role", () => {
    for (const role of ["STUDENT", "TEACHER", "ADMIN"] as const) {
      const accounts = mockPortalUsers.filter(
        (user) => user.role === role && user.status === "ACTIVE"
      );
      expect(accounts.length).toBeGreaterThanOrEqual(2);
      expect(accounts.some((account) => account.id === DEFAULT_ACCOUNT_IDS[role])).toBe(true);
    }
  });

  it("creates one grade row per student in every seeded course", () => {
    const students = mockPortalUsers.filter((user) => user.role === "STUDENT");
    for (const course of mockCourses) {
      const rows = mockTeacherGrades.filter((grade) => grade.courseCode === course.code);
      expect(rows).toHaveLength(students.length);
      expect(new Set(rows.map((grade) => grade.studentId))).toEqual(
        new Set(students.map((student) => student.identifier))
      );
    }
  });
});
