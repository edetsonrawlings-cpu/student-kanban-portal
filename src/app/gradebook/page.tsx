export default function GradebookPage() {
  const grades = [
    { subject: "Web Development (Agile)", grade: "A", percentage: "95%" },
    { subject: "Linear Algebra", grade: "A-", percentage: "91%" },
    { subject: "Academic Writing", grade: "B+", percentage: "88%" },
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Gradebook</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Track your academic performance and grades.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-4">Subject</th>
              <th className="p-4">Grade</th>
              <th className="p-4">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {grades.map((g, i) => (
              <tr key={i}>
                <td className="p-4 font-medium text-slate-900 dark:text-slate-100">{g.subject}</td>
                <td className="p-4 font-bold text-emerald-600">{g.grade}</td>
                <td className="p-4">{g.percentage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}