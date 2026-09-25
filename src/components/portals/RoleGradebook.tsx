"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { calculateGpa, percentageToLetterGrade } from "@/lib/grades";
import { updateDemoWorkspace } from "@/lib/demo-workspace-store";
import { DEMO_STUDENT_USER_ID, mockGrades } from "@/lib/mock-data";
import { useActiveAccount } from "@/lib/use-active-account";
import { useDemoCourses, useTeachingCourses } from "@/lib/use-demo-courses";
import { useDemoProfile } from "@/lib/use-demo-profile";
import { useDemoWorkspace } from "@/lib/use-demo-workspace";
import type { GradeEntry, LetterGrade } from "@/types";

interface DisplayGrade {
  courseCode: string;
  letter: LetterGrade | null;
  percentage: number | null;
}

export function RoleGradebook() {
  const profile = useDemoProfile();
  const { accountId: activeStudentId, account: activeStudent } = useActiveAccount("STUDENT");
  const courses = useDemoCourses();
  const teachingCourses = useTeachingCourses();
  const workspace = useDemoWorkspace();

  if (profile.role === "TEACHER") {
    const courseCodes = new Set(teachingCourses.map((course) => course.code));
    const records = workspace.teacherGrades.filter((record) => courseCodes.has(record.courseCode));
    const graded = records.filter(
      (record): record is typeof record & { percentage: number } => record.percentage !== null
    );
    const classAverage = graded.length
      ? Math.round(graded.reduce((sum, record) => sum + record.percentage, 0) / graded.length)
      : null;

    return (
      <div className="space-y-6">
        <PageHeader
          title="Class gradebook"
          description="Enter percentages directly. Changes are saved locally and reflected in the student demo."
          action={
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 size={14} aria-hidden />
              Saved locally
            </span>
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Metric label="Students" value={String(records.length)} />
          <Metric label="Class average" value={classAverage === null ? "—" : `${classAverage}%`} />
          <Metric label="Pending" value={String(records.length - graded.length)} />
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#E4E2DA] bg-white shadow-sm">
          <table className="w-full min-w-[42rem] text-left text-sm text-[#6B7280]">
            <caption className="sr-only">Editable grades for students in your courses</caption>
            <thead className="border-b border-[#E4E2DA] bg-[#FAFAF8] text-xs uppercase text-[#6B7280]">
              <tr>
                <th scope="col" className="p-4">Student</th>
                <th scope="col" className="p-4">ID</th>
                <th scope="col" className="p-4">Course</th>
                <th scope="col" className="p-4">Score</th>
                <th scope="col" className="p-4">Letter</th>
                <th scope="col" className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E2DA]">
              {records.map((record) => (
                <tr key={record.id}>
                  <td className="p-4 font-medium text-[#16233F]">{record.studentName}</td>
                  <td className="p-4 font-mono text-xs">{record.studentId}</td>
                  <td className="p-4 font-mono text-xs">{record.courseCode}</td>
                  <td className="p-4">
                    <label htmlFor={`grade-${record.id}`} className="sr-only">
                      Grade for {record.studentName} in {record.courseCode}
                    </label>
                    <div className="flex w-24 items-center rounded-md border border-[#E4E2DA] bg-white px-2 focus-within:border-[#2F4470] focus-within:ring-2 focus-within:ring-[#2F4470]/15">
                      <input
                        id={`grade-${record.id}`}
                        type="number"
                        min="0"
                        max="100"
                        value={record.percentage ?? ""}
                        placeholder="—"
                        onChange={(event) => {
                          const value = event.target.value;
                          const percentage = value === ""
                            ? null
                            : Math.max(0, Math.min(100, Number(value)));
                          updateDemoWorkspace((current) => ({
                            ...current,
                            teacherGrades: current.teacherGrades.map((item) =>
                              item.id === record.id ? { ...item, percentage } : item
                            ),
                          }));
                        }}
                        className="w-full bg-transparent py-1.5 text-right text-sm font-semibold text-[#16233F] outline-none"
                      />
                      <span className="text-xs text-[#9CA3AF]">%</span>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-[#16233F]">
                    {record.percentage === null ? "—" : percentageToLetterGrade(record.percentage)}
                  </td>
                  <td className="p-4">
                    <span className={record.percentage === null
                      ? "rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700"
                      : "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                    }>
                      {record.percentage === null ? "Pending" : "Graded"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (profile.role === "ADMIN") {
    return (
      <div className="space-y-6">
        <PageHeader title="Gradebook" description="Academic grading is managed by teaching staff." />
        <p className="rounded-lg border border-[#E4E2DA] bg-white p-6 text-sm text-[#6B7280]">
          Switch to the Teacher portal to demonstrate grade entry, or open the{" "}
          <Link href="/admin" className="font-medium text-[#2F4470] hover:underline">admin workspace</Link>.
        </p>
      </div>
    );
  }

  const displayGrades: DisplayGrade[] = courses.map((course) => {
    const studentId = activeStudent?.identifier ?? activeStudent?.id;
    const teacherRecord = workspace.teacherGrades.find(
      (record) => record.studentId === studentId && record.courseCode === course.code
    );
    if (teacherRecord) {
      if (teacherRecord.percentage === null) {
        return { courseCode: course.code, letter: null, percentage: null };
      }
      return {
        courseCode: course.code,
        percentage: teacherRecord.percentage,
        letter: percentageToLetterGrade(teacherRecord.percentage),
      };
    }
    const seedGrade = activeStudentId === DEMO_STUDENT_USER_ID
      ? mockGrades.find((grade) => grade.courseCode === course.code)
      : undefined;
    return seedGrade ?? { courseCode: course.code, letter: null, percentage: null };
  });
  const completedGrades: GradeEntry[] = displayGrades.flatMap((grade) =>
    grade.letter === null || grade.percentage === null
      ? []
      : [{ courseCode: grade.courseCode, letter: grade.letter, percentage: grade.percentage }]
  );
  const gpa = calculateGpa(completedGrades, courses);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gradebook"
        description={`Credit-weighted GPA: ${gpa.toFixed(2)} / 4.0`}
      />

      <div className="overflow-x-auto rounded-lg border border-[#E4E2DA] bg-white shadow-sm">
        <table className="w-full min-w-[32rem] text-left text-sm text-[#6B7280]">
          <caption className="sr-only">Grades for each enrolled course</caption>
          <thead className="border-b border-[#E4E2DA] bg-[#FAFAF8] text-xs text-[#6B7280]">
            <tr>
              <th scope="col" className="p-4">Course</th>
              <th scope="col" className="p-4">Code</th>
              <th scope="col" className="p-4">Credits</th>
              <th scope="col" className="p-4">Grade</th>
              <th scope="col" className="p-4">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E2DA]">
            {displayGrades.map((grade) => {
              const course = courses.find((item) => item.code === grade.courseCode);
              return (
                <tr key={grade.courseCode}>
                  <td className="p-4 font-medium text-[#16233F]">{course?.title ?? grade.courseCode}</td>
                  <td className="p-4 font-mono text-xs">{grade.courseCode}</td>
                  <td className="p-4">{course?.credits ?? "—"}</td>
                  <td className="p-4 font-bold text-emerald-600">{grade.letter ?? "Pending"}</td>
                  <td className="p-4">{grade.percentage === null ? "—" : `${grade.percentage}%`}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Metric({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-lg border border-[#E4E2DA] bg-white p-5">
      <p className="text-xs uppercase text-[#9CA3AF]">{label}</p>
      <p className="font-serif text-2xl text-[#16233F]">{value}</p>
    </div>
  );
}

export default RoleGradebook;