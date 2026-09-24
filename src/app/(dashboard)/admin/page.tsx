import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { mockAnnouncements, mockCourses } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Admin" };

export default function AdminPage() {
  const stats = [
    { label: "Courses", value: mockCourses.length },
    { label: "Instructors", value: new Set(mockCourses.map((c) => c.instructor)).size },
    { label: "Announcements", value: mockAnnouncements.length },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Admin" description="Institution-wide overview." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-[#E4E2DA] bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-[#9CA3AF]">{stat.label}</p>
            <p className="font-serif text-2xl text-[#16233F]">{stat.value}</p>
          </div>
        ))}
      </div>

      <p className="rounded-xl border border-dashed border-[#E4E2DA] bg-white px-5 py-4 text-sm text-[#6B7280]">
        This page is reachable by anyone today. Role enforcement needs server-side authentication
        &mdash; the sidebar only hides the link, it does not protect the route.
      </p>
    </div>
  );
}
