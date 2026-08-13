import { Megaphone } from "lucide-react";
import type { Announcement } from "@/types";

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

interface AnnouncementsFeedProps {
  announcements: Announcement[];
}

export function AnnouncementsFeed({ announcements }: AnnouncementsFeedProps) {
  return (
    <div className="rounded-lg border border-[#E4E2DA] bg-white">
      <div className="flex items-center gap-2 border-b border-[#E4E2DA] px-5 py-4">
        <Megaphone size={17} strokeWidth={1.75} className="text-[#C9A227]" />
        <h2 className="font-serif text-base text-[#16233F]">Recent Announcements</h2>
      </div>
      <ul className="divide-y divide-[#F0EEE7]">
        {announcements.map((a) => (
          <li key={a.id} className="px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-[#16233F]">{a.title}</p>
              <span className="shrink-0 text-xs text-[#9CA3AF]">{timeAgo(a.postedAt)}</span>
            </div>
            <p className="mt-1 text-sm text-[#6B7280]">{a.body}</p>
            <p className="mt-2 text-xs text-[#9CA3AF]">
              <span className="font-mono">{a.courseCode}</span> · {a.author}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
