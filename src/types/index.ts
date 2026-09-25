export type Role = "STUDENT" | "TEACHER" | "ADMIN";

export interface DemoProfile {
  name: string;
  email: string;
  identifier: string;
  affiliation: string;
  role: Role;
  term: string;
}

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
  instructorId?: string;
  studentIds?: string[];
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

export type KanbanLimits = Record<KanbanStatus, number>;

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

export interface TeacherGradeRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseCode: string;
  percentage: number | null;
}

export interface DemoPortalUser {
  id: string;
  name: string;
  email: string;
  identifier?: string;
  role: Role;
  department: string;
  status: "ACTIVE" | "SUSPENDED";
}

export interface DemoWorkspace {
  announcements: Announcement[];
  assignments: AssignmentSummary[];
  courses: Course[];
  teacherGrades: TeacherGradeRecord[];
  users: DemoPortalUser[];
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
