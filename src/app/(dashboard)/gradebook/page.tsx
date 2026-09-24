import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { getCourseByCode, mockGrades, mockStudentSummary } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Gradebook" };

export default function GradebookPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Gradebook"
        description={`Credit-weighted GPA: ${mockStudentSummary.gpa.toFixed(2)} / ${mockStudentSummary.gpaMax.toFixed(1)}`}
      />

      <div className="overflow-x-auto rounded-xl border border-[#E4E2DA] bg-white shadow-sm">
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
            {mockGrades.map((grade) => {
              const course = getCourseByCode(grade.courseCode);
              return (
                <tr key={grade.courseCode}>
                  <td className="p-4 font-medium text-[#16233F]">{course?.title ?? grade.courseCode}</td>
                  <td className="p-4 font-mono text-xs">{grade.courseCode}</td>
                  <td className="p-4">{course?.credits ?? "—"}</td>
                  <td className="p-4 font-bold text-emerald-600">{grade.letter}</td>
                  <td className="p-4">{grade.percentage}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
