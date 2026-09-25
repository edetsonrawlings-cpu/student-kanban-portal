import { calculateGpa, GPA_MAX } from "@/lib/grades";
import type {
  Announcement,
  AssignmentSummary,
  Course,
  DemoProfile,
  DemoPortalUser,
  FeeReceipt,
  GradeEntry,
  KanbanTask,
  StudentProfile,
  StudentSummary,
  TeacherGradeRecord,
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
export const DEFAULT_ACCOUNT_IDS = {
  STUDENT: "u1",
  TEACHER: "u8",
  ADMIN: "u9",
} as const;
export const DEMO_STUDENT_USER_ID = DEFAULT_ACCOUNT_IDS.STUDENT;
export const DEMO_TEACHER_USER_ID = DEFAULT_ACCOUNT_IDS.TEACHER;
export const DEMO_ADMIN_USER_ID = DEFAULT_ACCOUNT_IDS.ADMIN;

export const currentStudent: StudentProfile = {
  name: "Ama Serwaa",
  studentId: "STU-20263301",
  program: "B.Sc. Computer Science — Year 3",
  role: "STUDENT",
  term: TERM,
};

export const demoProfiles: Record<DemoProfile["role"], DemoProfile> = {
  STUDENT: {
    name: currentStudent.name,
    email: "ama.serwaa@students.ictu.edu",
    identifier: currentStudent.studentId,
    affiliation: currentStudent.program,
    role: "STUDENT",
    term: TERM,
  },
  TEACHER: {
    name: "Dr. Amara Okafor",
    email: "amara.okafor@ictu.edu",
    identifier: "FAC-2026-014",
    affiliation: "School of ICT · Web Development",
    role: "TEACHER",
    term: TERM,
  },
  ADMIN: {
    name: "Nadia Mensah",
    email: "nadia.mensah@ictu.edu",
    identifier: "ADM-2026-003",
    affiliation: "Academic Administration",
    role: "ADMIN",
    term: TERM,
  },
};

export const mockCourses: Course[] = [
  {
    id: "c1",
    code: "CS301",
    title: "Web Development & Agile Methods",
    instructor: "Dr. Amara Okafor",
    instructorId: DEMO_TEACHER_USER_ID,
    studentIds: ["u1", "u2", "u3", "u4", "u5", "u6", "u7"],
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
    instructorId: "u10",
    studentIds: ["u1", "u2", "u3", "u4", "u5", "u6", "u7"],
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
    instructorId: "u11",
    studentIds: ["u1", "u2", "u3", "u4", "u5", "u6", "u7"],
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
    instructorId: "u12",
    studentIds: ["u1", "u2", "u3", "u4", "u5", "u6", "u7"],
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
    instructorId: "u13",
    studentIds: ["u1", "u2", "u3", "u4", "u5", "u6", "u7"],
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
    id: "portal-auth-session",
    title: "Implement real authentication and server sessions",
    courseCode: "CS301",
    dueDate: "2026-10-04T23:59:00Z",
    priority: "High",
    status: "todo",
  },
  {
    id: "portal-rbac",
    title: "Enforce server-side authorization for every role",
    courseCode: "CS301",
    dueDate: "2026-10-05T23:59:00Z",
    priority: "High",
    status: "todo",
  },
  {
    id: "portal-database",
    title: "Connect Prisma to PostgreSQL and run migrations",
    courseCode: "CS301",
    dueDate: "2026-10-07T23:59:00Z",
    priority: "High",
    status: "todo",
  },
  {
    id: "portal-api-persistence",
    title: "Replace local demo stores with API persistence",
    courseCode: "CS301",
    dueDate: "2026-10-10T23:59:00Z",
    priority: "High",
    status: "todo",
  },
  {
    id: "portal-account-recovery",
    title: "Add password reset and account recovery flows",
    courseCode: "CS301",
    dueDate: "2026-10-12T23:59:00Z",
    priority: "Medium",
    status: "todo",
  },
  {
    id: "portal-audit-log",
    title: "Record an audit log for administrator actions",
    courseCode: "CS301",
    dueDate: "2026-10-14T23:59:00Z",
    priority: "Medium",
    status: "todo",
  },
  {
    id: "portal-vercel",
    title: "Configure and verify the Vercel backup deployment",
    courseCode: "CS301",
    dueDate: "2026-09-27T23:59:00Z",
    priority: "High",
    status: "in-progress",
  },
  {
    id: "portal-e2e",
    title: "Automate end-to-end tests for all three portals",
    courseCode: "CS301",
    dueDate: "2026-09-28T23:59:00Z",
    priority: "High",
    status: "in-progress",
  },
  {
    id: "portal-form-feedback",
    title: "Add validation and feedback states to every form",
    courseCode: "CS301",
    dueDate: "2026-09-29T23:59:00Z",
    priority: "Medium",
    status: "in-progress",
  },
  {
    id: "portal-enrollment",
    title: "Expand course roster and enrollment management",
    courseCode: "CS301",
    dueDate: "2026-10-01T23:59:00Z",
    priority: "Medium",
    status: "in-progress",
  },
  {
    id: "portal-loading-errors",
    title: "Add loading and error states to role workflows",
    courseCode: "CS301",
    dueDate: "2026-10-02T23:59:00Z",
    priority: "High",
    status: "in-progress",
  },
  {
    id: "portal-migration-plan",
    title: "Prepare production data seed and migration plan",
    courseCode: "CS301",
    dueDate: "2026-10-03T23:59:00Z",
    priority: "Medium",
    status: "in-progress",
  },
  {
    id: "portal-test-role-navigation",
    title: "Validate switching between every role dashboard",
    courseCode: "CS301",
    dueDate: "2026-09-25T23:59:00Z",
    priority: "High",
    status: "testing",
  },
  {
    id: "portal-test-data-sync",
    title: "Regression-test assignments, grades and announcements sync",
    courseCode: "CS301",
    dueDate: "2026-09-25T23:59:00Z",
    priority: "High",
    status: "testing",
  },
  {
    id: "portal-test-responsive",
    title: "Audit mobile, tablet and projector layouts",
    courseCode: "CS301",
    dueDate: "2026-09-26T23:59:00Z",
    priority: "Medium",
    status: "testing",
  },
  {
    id: "portal-test-production",
    title: "Run production preflight on the presentation laptop",
    courseCode: "CS301",
    dueDate: "2026-09-26T23:59:00Z",
    priority: "High",
    status: "testing",
  },
  {
    id: "portal-test-accessibility",
    title: "Complete keyboard and screen-reader accessibility audit",
    courseCode: "CS301",
    dueDate: "2026-09-27T23:59:00Z",
    priority: "High",
    status: "testing",
  },
  {
    id: "portal-test-reset",
    title: "Verify local data reset and recovery after reload",
    courseCode: "CS301",
    dueDate: "2026-09-27T23:59:00Z",
    priority: "Medium",
    status: "testing",
  },
  {
    id: "portal-done-scaffold",
    title: "Scaffold Next.js App Router, TypeScript and Tailwind",
    courseCode: "CS301",
    dueDate: "2026-09-10T23:59:00Z",
    priority: "High",
    status: "done",
  },
  {
    id: "portal-done-shell",
    title: "Build the responsive shell, navigation and search",
    courseCode: "CS301",
    dueDate: "2026-09-12T23:59:00Z",
    priority: "High",
    status: "done",
  },
  {
    id: "portal-done-student",
    title: "Implement the Student dashboard and academic pages",
    courseCode: "CS301",
    dueDate: "2026-09-15T23:59:00Z",
    priority: "High",
    status: "done",
  },
  {
    id: "portal-done-kanban",
    title: "Implement Kanban create, filter, move and delete flows",
    courseCode: "CS301",
    dueDate: "2026-09-17T23:59:00Z",
    priority: "High",
    status: "done",
  },
  {
    id: "portal-done-teacher",
    title: "Build Teacher assignments, gradebook and announcements",
    courseCode: "CS301",
    dueDate: "2026-09-20T23:59:00Z",
    priority: "High",
    status: "done",
  },
  {
    id: "portal-done-admin",
    title: "Build Admin user directory and account controls",
    courseCode: "CS301",
    dueDate: "2026-09-22T23:59:00Z",
    priority: "High",
    status: "done",
  },
  {
    id: "portal-done-data-flow",
    title: "Link role workflows through one shared local workspace",
    courseCode: "CS301",
    dueDate: "2026-09-23T23:59:00Z",
    priority: "High",
    status: "done",
  },
  {
    id: "portal-done-quality",
    title: "Add unit tests, CI checks and production preflight",
    courseCode: "CS301",
    dueDate: "2026-09-24T23:59:00Z",
    priority: "High",
    status: "done",
  },
  {
    id: "portal-done-dashboards",
    title: "Connect Student, Teacher and Admin dashboards",
    courseCode: "CS301",
    dueDate: "2026-09-25T23:59:00Z",
    priority: "High",
    status: "done",
  },
  {
    id: "portal-done-presentation",
    title: "Add presentation mode and oral demo runbook",
    courseCode: "CS301",
    dueDate: "2026-09-25T23:59:00Z",
    priority: "Medium",
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

export const mockPortalUsers: DemoPortalUser[] = [
  {
    id: "u1",
    name: "FOUATEU KEUTRA GLORY CARLA",
    email: "fouateu.keutra@students.ictu.edu",
    identifier: "STU-20263301",
    role: "STUDENT",
    department: "Computer Science",
    status: "ACTIVE",
  },
  {
    id: "u2",
    name: "EDETSON RAWLINGS",
    email: "edetson.rawlings@students.ictu.edu",
    identifier: "STU-20263117",
    role: "STUDENT",
    department: "Computer Science",
    status: "ACTIVE",
  },
  {
    id: "u3",
    name: "MELOH TAGNE SERENA",
    email: "meloh.tagneserena@students.ictu.edu",
    identifier: "STU-20263408",
    role: "STUDENT",
    department: "Computer Science",
    status: "ACTIVE",
  },
  {
    id: "u4",
    name: "BAYIGA BOGMIS IVAN",
    email: "bayiga.bogmis@students.ictu.edu",
    identifier: "STU-20263092",
    role: "STUDENT",
    department: "Computer Science",
    status: "ACTIVE",
  },
  {
    id: "u5",
    name: "MBOUENDEU YOSSA PAUL NELSON ENZO",
    email: "mbouendeu.yossa@students.ictu.edu",
    identifier: "STU-20263551",
    role: "STUDENT",
    department: "Computer Science",
    status: "ACTIVE",
  },
  {
    id: "u6",
    name: "NZELLE TRACY ESAMBE",
    email: "nzelle.tracy@students.ictu.edu",
    identifier: "STU-20263612",
    role: "STUDENT",
    department: "Computer Science",
    status: "ACTIVE",
  },
  {
    id: "u7",
    name: "Meva'a Laurette Sarah",
    email: "mevaa.laurette@students.ictu.edu",
    identifier: "STU-20263705",
    role: "STUDENT",
    department: "Computer Science",
    status: "ACTIVE",
  },
  {
    id: DEMO_TEACHER_USER_ID,
    name: demoProfiles.TEACHER.name,
    email: demoProfiles.TEACHER.email,
    identifier: demoProfiles.TEACHER.identifier,
    role: "TEACHER",
    department: "School of ICT",
    status: "ACTIVE",
  },
  {
    id: DEMO_ADMIN_USER_ID,
    name: demoProfiles.ADMIN.name,
    email: demoProfiles.ADMIN.email,
    identifier: demoProfiles.ADMIN.identifier,
    role: "ADMIN",
    department: "Academic Administration",
    status: "ACTIVE",
  },
  {
    id: "u10",
    name: "Prof. Elena Ruiz",
    email: "elena.ruiz@ictu.edu",
    identifier: "FAC-2026-021",
    role: "TEACHER",
    department: "Department of Mathematics",
    status: "ACTIVE",
  },
  {
    id: "u11",
    name: "Dr. Marcus Webb",
    email: "marcus.webb@ictu.edu",
    identifier: "FAC-2026-032",
    role: "TEACHER",
    department: "Academic Writing Center",
    status: "ACTIVE",
  },
  {
    id: "u12",
    name: "Prof. Hana Kobayashi",
    email: "hana.kobayashi@ictu.edu",
    identifier: "FAC-2026-044",
    role: "TEACHER",
    department: "Department of Physics",
    status: "ACTIVE",
  },
  {
    id: "u13",
    name: "Dr. Samuel Osei",
    email: "samuel.osei@ictu.edu",
    identifier: "FAC-2026-057",
    role: "TEACHER",
    department: "School of Economics",
    status: "ACTIVE",
  },
  {
    id: "u14",
    name: "Kwame Boateng",
    email: "kwame.boateng@ictu.edu",
    identifier: "ADM-2026-011",
    role: "ADMIN",
    department: "Academic Services",
    status: "ACTIVE",
  },
];

const GRADE_OFFSETS = [0, 8, 13, 4, 0];
const gradeStudents = mockPortalUsers.filter((user) => user.role === "STUDENT");

export const mockTeacherGrades: TeacherGradeRecord[] = mockCourses.flatMap((course) => {
  const seedPercentage = mockGrades.find((grade) => grade.courseCode === course.code)?.percentage ?? 85;
  return gradeStudents.map((student, index) => ({
    id: `tg-${course.code}-${student.id}`,
    studentId: student.identifier ?? student.id,
    studentName: student.name,
    courseCode: course.code,
    percentage: index === gradeStudents.length - 1
      ? null
      : Math.max(0, seedPercentage - GRADE_OFFSETS[index]),
  }));
});

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
