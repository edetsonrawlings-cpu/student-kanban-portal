import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { mockAnnouncements } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Announcements" };

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        description="Latest updates from your instructors and department."
      />

      <ul className="space-y-4">
        {mockAnnouncements.map((item) => (
          <li
            key={item.id}
            className="space-y-2 rounded-xl border border-[#E4E2DA] bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-[#16233F]">{item.title}</h3>
              <span className="text-xs text-[#9CA3AF]">{formatDate(item.postedAt)}</span>
            </div>
            <p className="text-sm text-[#6B7280]">{item.body}</p>
            <p className="text-xs text-[#9CA3AF]">
              <span className="font-mono">{item.courseCode}</span> · {item.author}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
