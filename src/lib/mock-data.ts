import { calculateGpa, GPA_MAX } from "@/lib/grades";
import type {
  Announcement,
  AssignmentSummary,
  Course,
  FeeReceipt,
  GradeEntry,
  KanbanTask,
  StudentProfile,
  StudentSummary,
} from "@/types";

/**
 * Single source of truth for the demo data rendered across the portal.
 *
 * Every page reads from here — do not re-declare course codes, grades or
 * deadlines inside a page, otherwise the dashboard totals stop matching the
 * detail screens. Swap these constants for Prisma queries (see
 * `prisma/schema.prisma` and `src/lib/prisma.ts`) once the database is wired.
 */

export const TERM = "Fall 2026";

export const currentStudent: StudentProfile = {
  name: "Ama Serwaa",
  studentId: "STU-20263301",
  program: "B.Sc. Computer Science — Year 3",
  role: "STUDENT",
  term: TERM,
};

export const mockCourses: Course[] = [
  {
    id: "c1",
    code: "CS301",
    title: "Web Development & Agile Methods",
    instructor: "Dr. Amara Okafor",
    term: TERM,
    coverColor: "#16233F",
    progress: 68,
    credits: 3,
    nextSession: "Mon · 10:00 AM",
  },
  {
    id: "c2",
    code: "MATH214",
    title: "Linear Algebra",
    instructor: "Prof. Elena Ruiz",
    term: TERM,
    coverColor: "#4B7A6F",
    progress: 45,
    credits: 4,
    nextSession: "Tue · 1:00 PM",
  },
  {
    id: "c3",
    code: "ENG110",
    title: "Academic Writing",
    instructor: "Dr. Marcus Webb",
    term: TERM,
    coverColor: "#C9A227",
    progress: 82,
    credits: 3,
    nextSession: "Wed · 9:00 AM",
  },
  {
    id: "c4",
    code: "PHYS201",
    title: "Classical Mechanics",
    instructor: "Prof. Hana Kobayashi",
    term: TERM,
    coverColor: "#2F4470",
    progress: 30,
    credits: 4,
    nextSession: "Thu · 11:00 AM",
  },
  {
    id: "c5",
    code: "ECON150",
    title: "Microeconomics",
    instructor: "Dr. Samuel Osei",
    term: TERM,
    coverColor: "#B8563F",
    progress: 57,
    credits: 3,
    nextSession: "Fri · 2:00 PM",
  },
];

export function getCourseByCode(code: string): Course | undefined {
  return mockCourses.find((course) => course.code === code);
}

export const mockAssignments: AssignmentSummary[] = [
  {
    id: "a1",
    title: "Sprint 2 Retrospective Report",
    courseCode: "CS301",
    dueDate: "2026-09-26T23:59:00Z",
    status: "not_submitted",
    maxPoints: 100,
  },
  {
    id: "a2",
    title: "Eigenvalues Take-Home Quiz",
    courseCode: "MATH214",
    dueDate: "2026-09-28T17:00:00Z",
    status: "not_submitted",
    maxPoints: 50,
  },
  {
    id: "a3",
    title: "Rhetorical Analysis Essay",
    courseCode: "ENG110",
    dueDate: "2026-10-02T23:59:00Z",
    status: "submitted",
    maxPoints: 100,
  },
  {
    id: "a4",
    title: "Newton's Laws Lab Report",
    courseCode: "PHYS201",
    dueDate: "2026-09-21T23:59:00Z",
    status: "late",
    maxPoints: 80,
  },
  {
    id: "a5",
    title: "Supply & Demand Case Study",
    courseCode: "ECON150",
    dueDate: "2026-09-18T23:59:00Z",
    status: "graded",
    points: 91,
    maxPoints: 100,
  },
];

/** Starting state of the Kanban board; the board then persists to localStorage. */
export const mockKanbanTasks: KanbanTask[] = [
  {
    id: "t1",
    title: "Create login page & database schema",
    courseCode: "CS301",
    dueDate: "2026-09-26T23:59:00Z",
    priority: "High",
    status: "todo",
  },
  {
    id: "t2",
    title: "Linear systems problem set 4",
    courseCode: "MATH214",
    dueDate: "2026-09-28T17:00:00Z",
    priority: "Medium",
    status: "todo",
  },
  {
    id: "t3",
    title: "Outline the rhetorical analysis essay",
    courseCode: "ENG110",
    dueDate: "2026-10-09T23:59:00Z",
    priority: "Low",
    status: "todo",
  },
  {
    id: "t4",
    title: "Implement student registration flow",
    courseCode: "CS301",
    dueDate: "2026-10-02T23:59:00Z",
    priority: "High",
    status: "in-progress",
  },
  {
    id: "t5",
    title: "Verify the payment module",
    courseCode: "CS301",
    dueDate: "2026-09-21T23:59:00Z",
    priority: "High",
    status: "testing",
  },
  {
    id: "t6",
    title: "Design homepage & write documentation",
    courseCode: "CS301",
    dueDate: "2026-09-18T23:59:00Z",
    priority: "Low",
    status: "done",
  },
];

export const mockGrades: GradeEntry[] = [
  { courseCode: "CS301", letter: "A", percentage: 95 },
  { courseCode: "MATH214", letter: "A-", percentage: 91 },
  { courseCode: "ENG110", letter: "B+", percentage: 88 },
  { courseCode: "PHYS201", letter: "B", percentage: 84 },
  { courseCode: "ECON150", letter: "A-", percentage: 90 },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: "n1",
    title: "Kanban board project submission is open",
    body: "Push your Kanban workflow to GitHub before the presentation and share the repository link in class.",
    courseCode: "CS301",
    postedAt: "2026-09-22T14:30:00Z",
    author: "Dr. Amara Okafor",
  },
  {
    id: "n2",
    title: "Problem Set 3 grades posted",
    body: "Grades and feedback for Problem Set 3 are now available in the gradebook.",
    courseCode: "MATH214",
    postedAt: "2026-09-21T09:15:00Z",
    author: "Prof. Elena Ruiz",
  },
  {
    id: "n3",
    title: "Midterm exam schedule posted",
    body: "Check the portal calendar for exact exam room allocations and reporting times.",
    courseCode: "ALL",
    postedAt: "2026-09-18T08:00:00Z",
    author: "Registrar's Office",
  },
  {
    id: "n4",
    title: "Campus library extended hours",
    body: "The main library will stay open until midnight through the end of midterms week.",
    courseCode: "ALL",
    postedAt: "2026-09-15T08:00:00Z",
    author: "Registrar's Office",
  },
];

export const mockReceipt: FeeReceipt = {
  receiptNo: "RCT-2026-00842",
  issuedOn: "2026-09-10T00:00:00Z",
  term: TERM,
  paymentMethod: "Bank Transfer",
  status: "Paid",
  currency: "USD",
  items: [
    { label: "Tuition Fee", amount: 3200 },
    { label: "Library & Resources Fee", amount: 120 },
    { label: "Technology Fee", amount: 150 },
    { label: "Student Activity Fee", amount: 80 },
    { label: "Examination Fee", amount: 60 },
  ],
};

export const receiptTotal = mockReceipt.items.reduce((sum, item) => sum + item.amount, 0);

export const pendingAssignments = mockAssignments.filter(
  (assignment) => assignment.status === "not_submitted" || assignment.status === "late"
);

// Derived from the data above so the dashboard tiles can never drift from the
// courses, grades and assignments rendered on the detail pages.
export const mockStudentSummary: StudentSummary = {
  gpa: calculateGpa(mockGrades, mockCourses),
  gpaMax: GPA_MAX,
  enrolledCourses: mockCourses.length,
  pendingAssignments: pendingAssignments.length,
  attendanceRate: 94,
};
