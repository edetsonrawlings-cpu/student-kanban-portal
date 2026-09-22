import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function GradebookPage() {
  const grades = [
    { subject: "Web Development (Agile)", grade: "A", percentage: "95%" },
    { subject: "Linear Algebra", grade: "A-", percentage: "91%" },
    { subject: "Academic Writing", grade: "B+", percentage: "88%" },
  ];

  return (
    <DashboardLayout pageTitle="Gradebook">
      <div className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl text-[#16233F]">Gradebook</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Track your academic performance and grades.</p>
        </div>

        <div className="bg-white rounded-xl border border-[#E4E2DA] overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm text-[#6B7280]">
            <thead className="bg-[#FAFAF8] text-xs text-[#6B7280] border-b border-[#E4E2DA]">
              <tr>
                <th className="p-4">Subject</th>
                <th className="p-4">Grade</th>
                <th className="p-4">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E2DA]">
              {grades.map((g) => (
                <tr key={g.subject}>
                  <td className="p-4 font-medium text-[#16233F]">{g.subject}</td>
                  <td className="p-4 font-bold text-emerald-600">{g.grade}</td>
                  <td className="p-4">{g.percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}