export type Role = "STUDENT" | "TEACHER" | "ADMIN";

export interface Course {
  id: string;
  code: string;
  title: string;
  instructor: string;
  term: string;
  coverColor: string;
  progress: number; // 0-100
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

export interface Announcement {
  id: string;
  title: string;
  body: string;
  courseCode: string;
  postedAt: string; // ISO
  author: string;
}

export interface StudentSummary {
  gpa: number;
  gpaMax: number;
  enrolledCourses: number;
  pendingAssignments: number;
  attendanceRate: number; // 0-100
}
