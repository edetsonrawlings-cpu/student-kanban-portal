import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function AnnouncementsPage() {
  const announcements = [
    { title: "Kanban Board Project Submission Ready", date: "Aug 14, 2026", desc: "Please ensure your Kanban workflow is pushed to GitHub prior to presentation." },
    { title: "Midterm Exam Schedule Posted", date: "Aug 10, 2026", desc: "Check the student portal portal calendar for exact exam room allocations." },
  ];

  return (
    <DashboardLayout pageTitle="Announcements">
      <div className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl text-[#16233F]">Announcements</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Latest updates from your instructors and department.</p>
        </div>

        <div className="space-y-4">
          {announcements.map((item) => (
            <div key={item.title} className="bg-white p-5 rounded-xl border border-[#E4E2DA] shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-[#16233F]">{item.title}</h3>
                <span className="text-xs text-[#9CA3AF]">{item.date}</span>
              </div>
              <p className="text-sm text-[#6B7280]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}