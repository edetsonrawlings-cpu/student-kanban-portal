export type Role = "STUDENT" | "TEACHER" | "ADMIN";

export interface StudentProfile {
  name: string;
  studentId: string;
  program: string;
  role: Role;
  term: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  instructor: string;
  term: string;
  coverColor: string;
  progress: number; // 0-100
  credits: number;
  nextSession?: string;
}

export type AssignmentStatus = "not_submitted" | "submitted" | "late" | "graded";

export interface AssignmentSummary {
  id: string;
  title: string;
  courseCode: string;
  dueDate: string; // ISO
  status: AssignmentStatus;
  points?: number;
  maxPoints: number;
}

/**
 * Kanban board task. Distinct from `AssignmentSummary` (which models the
 * submission lifecycle) because a board task models a *workflow* position,
 * but it shares the same `courseCode` key and ISO `dueDate` format so the
 * date helpers in `@/lib/utils` work on both.
 */
export type KanbanStatus = "todo" | "in-progress" | "testing" | "done";

export type TaskPriority = "High" | "Medium" | "Low";

export interface KanbanTask {
  id: string;
  title: string;
  courseCode: string;
  dueDate: string; // ISO
  priority: TaskPriority;
  status: KanbanStatus;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  courseCode: string; // course code, or "ALL" for campus-wide notices
  postedAt: string; // ISO
  author: string;
}

export type LetterGrade =
  | "A"
  | "A-"
  | "B+"
  | "B"
  | "B-"
  | "C+"
  | "C"
  | "C-"
  | "D"
  | "F";

export interface GradeEntry {
  courseCode: string;
  letter: LetterGrade;
  percentage: number; // 0-100
}

export interface StudentSummary {
  gpa: number;
  gpaMax: number;
  enrolledCourses: number;
  pendingAssignments: number;
  attendanceRate: number; // 0-100
}

export interface ReceiptLineItem {
  label: string;
  amount: number;
}

export interface FeeReceipt {
  receiptNo: string;
  issuedOn: string; // ISO
  term: string;
  paymentMethod: string;
  status: "Paid" | "Pending" | "Overdue";
  items: ReceiptLineItem[];
  currency: string;
}
