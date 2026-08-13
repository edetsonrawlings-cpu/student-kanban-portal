import type {
  Announcement,
  AssignmentSummary,
  Course,
  StudentSummary,
} from "@/types";

export const mockStudentSummary: StudentSummary = {
  gpa: 3.72,
  gpaMax: 4.0,
  enrolledCourses: 5,
  pendingAssignments: 4,
  attendanceRate: 94,
};

export const mockCourses: Course[] = [
  {
    id: "c1",
    code: "CS301",
    title: "Data Structures & Algorithms",
    instructor: "Dr. Amara Okafor",
    term: "Fall 2026",
    coverColor: "#16233F",
    progress: 68,
    nextSession: "Mon · 10:00 AM",
  },
  {
    id: "c2",
    code: "MATH214",
    title: "Linear Algebra",
    instructor: "Prof. Elena Ruiz",
    term: "Fall 2026",
    coverColor: "#4B7A6F",
    progress: 45,
    nextSession: "Tue · 1:00 PM",
  },
  {
    id: "c3",
    code: "ENG110",
    title: "Academic Writing",
    instructor: "Dr. Marcus Webb",
    term: "Fall 2026",
    coverColor: "#C9A227",
    progress: 82,
    nextSession: "Wed · 9:00 AM",
  },
  {
    id: "c4",
    code: "PHYS201",
    title: "Classical Mechanics",
    instructor: "Prof. Hana Kobayashi",
    term: "Fall 2026",
    coverColor: "#2F4470",
    progress: 30,
    nextSession: "Thu · 11:00 AM",
  },
  {
    id: "c5",
    code: "ECON150",
    title: "Microeconomics",
    instructor: "Dr. Samuel Osei",
    term: "Fall 2026",
    coverColor: "#B8563F",
    progress: 57,
    nextSession: "Fri · 2:00 PM",
  },
];

export const mockAssignments: AssignmentSummary[] = [
  {
    id: "a1",
    title: "Binary Search Trees — Problem Set 4",
    courseCode: "CS301",
    dueDate: "2026-08-15T23:59:00Z",
    status: "not_submitted",
    maxPoints: 100,
  },
  {
    id: "a2",
    title: "Eigenvalues Take-Home Quiz",
    courseCode: "MATH214",
    dueDate: "2026-08-16T17:00:00Z",
    status: "not_submitted",
    maxPoints: 50,
  },
  {
    id: "a3",
    title: "Rhetorical Analysis Essay",
    courseCode: "ENG110",
    dueDate: "2026-08-18T23:59:00Z",
    status: "submitted",
    maxPoints: 100,
  },
  {
    id: "a4",
    title: "Newton's Laws Lab Report",
    courseCode: "PHYS201",
    dueDate: "2026-08-12T23:59:00Z",
    status: "late",
    maxPoints: 80,
  },
  {
    id: "a5",
    title: "Supply & Demand Case Study",
    courseCode: "ECON150",
    dueDate: "2026-08-05T23:59:00Z",
    status: "graded",
    points: 91,
    maxPoints: 100,
  },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: "n1",
    title: "Midterm review session added",
    body: "An extra review session has been scheduled for Thursday at 5 PM in Room 204 ahead of the midterm.",
    courseCode: "CS301",
    postedAt: "2026-08-12T14:30:00Z",
    author: "Dr. Amara Okafor",
  },
  {
    id: "n2",
    title: "Problem Set 3 grades posted",
    body: "Grades and feedback for Problem Set 3 are now available in the gradebook.",
    courseCode: "MATH214",
    postedAt: "2026-08-11T09:15:00Z",
    author: "Prof. Elena Ruiz",
  },
  {
    id: "n3",
    title: "Campus library extended hours",
    body: "The main library will stay open until midnight through the end of midterms week.",
    courseCode: "ALL",
    postedAt: "2026-08-10T08:00:00Z",
    author: "Registrar's Office",
  },
];
