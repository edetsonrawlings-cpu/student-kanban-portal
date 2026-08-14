export default function AnnouncementsPage() {
  const announcements = [
    { title: "Kanban Board Project Submission Ready", date: "Aug 14, 2026", desc: "Please ensure your Kanban workflow is pushed to GitHub prior to presentation." },
    { title: "Midterm Exam Schedule Posted", date: "Aug 10, 2026", desc: "Check the student portal portal calendar for exact exam room allocations." },
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Announcements</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Latest updates from your instructors and department.</p>
      </div>

      <div className="space-y-4">
        {announcements.map((item, index) => (
          <div key={index} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-slate-800 dark:text-slate-100">{item.title}</h2>
              <span className="text-xs text-slate-400">{item.date}</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}