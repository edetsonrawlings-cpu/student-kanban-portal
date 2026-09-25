import { describe, expect, it } from "vitest";
import { calculateGpa, gradePoints, percentageToLetterGrade } from "@/lib/grades";
import type { Course, GradeEntry } from "@/types";

function course(code: string, credits: number): Course {
  return {
    id: code,
    code,
    title: code,
    instructor: "Instructor",
    term: "Fall 2026",
    coverColor: "#000000",
    progress: 0,
    credits,
  };
}

describe("calculateGpa", () => {
  it("weights each course by its credits", () => {
    const courses = [course("A", 3), course("B", 1)];
    const grades: GradeEntry[] = [
      { courseCode: "A", letter: "A", percentage: 95 },
      { courseCode: "B", letter: "F", percentage: 20 },
    ];
    // (4.0 * 3 + 0 * 1) / 4
    expect(calculateGpa(grades, courses)).toBe(3);
  });

  it("ignores grades for courses the student is not enrolled in", () => {
    const grades: GradeEntry[] = [
      { courseCode: "A", letter: "A", percentage: 95 },
      { courseCode: "GHOST", letter: "F", percentage: 0 },
    ];
    expect(calculateGpa(grades, [course("A", 3)])).toBe(4);
  });

  it("returns 0 rather than NaN when there is nothing to average", () => {
    expect(calculateGpa([], [])).toBe(0);
  });

  it("rounds to two decimals", () => {
    const courses = [course("A", 3), course("B", 4), course("C", 3)];
    const grades: GradeEntry[] = [
      { courseCode: "A", letter: "A", percentage: 95 },
      { courseCode: "B", letter: "A-", percentage: 91 },
      { courseCode: "C", letter: "B+", percentage: 88 },
    ];
    expect(calculateGpa(grades, courses)).toBe(3.67);
  });
});

describe("gradePoints", () => {
  it("maps letters onto the 4.0 scale", () => {
    expect(gradePoints("A")).toBe(4);
    expect(gradePoints("B+")).toBe(3.3);
    expect(gradePoints("F")).toBe(0);
  });
});

describe("percentageToLetterGrade", () => {
  it("maps boundary percentages onto the letter scale", () => {
    expect(percentageToLetterGrade(93)).toBe("A");
    expect(percentageToLetterGrade(90)).toBe("A-");
    expect(percentageToLetterGrade(87)).toBe("B+");
    expect(percentageToLetterGrade(60)).toBe("D");
    expect(percentageToLetterGrade(59)).toBe("F");
  });
});
