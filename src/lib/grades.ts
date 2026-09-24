import type { Course, GradeEntry, LetterGrade } from "@/types";

export const GPA_MAX = 4.0;

const GRADE_POINTS: Record<LetterGrade, number> = {
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  D: 1.0,
  F: 0,
};

export function gradePoints(letter: LetterGrade): number {
  return GRADE_POINTS[letter];
}

/**
 * Credit-weighted GPA. Courses without a matching grade entry are ignored so
 * the average never silently counts a course as a zero.
 */
export function calculateGpa(grades: GradeEntry[], courses: Course[]): number {
  const creditsByCode = new Map(courses.map((course) => [course.code, course.credits]));

  let totalPoints = 0;
  let totalCredits = 0;

  for (const grade of grades) {
    const credits = creditsByCode.get(grade.courseCode);
    if (credits === undefined) continue;
    totalPoints += gradePoints(grade.letter) * credits;
    totalCredits += credits;
  }

  if (totalCredits === 0) return 0;
  return Math.round((totalPoints / totalCredits) * 100) / 100;
}
