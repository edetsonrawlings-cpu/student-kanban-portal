"use client";

import { useState } from "react";
import { Plus, Send, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { updateDemoWorkspace } from "@/lib/demo-workspace-store";
import { useDemoCourses, useTeachingCourses } from "@/lib/use-demo-courses";
import { useDemoProfile } from "@/lib/use-demo-profile";
import { useDemoWorkspace } from "@/lib/use-demo-workspace";
import { formatDate } from "@/lib/utils";

export function RoleAnnouncements() {
  const profile = useDemoProfile();
  const courses = useDemoCourses();
  const teachingCourses = useTeachingCourses();
  const workspace = useDemoWorkspace();
  const [composerOpen, setComposerOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [courseCode, setCourseCode] = useState(courses[0].code);
  const selectedCourseCode = teachingCourses.some((course) => course.code === courseCode)
    ? courseCode
    : teachingCourses[0]?.code ?? "";
  const canPublish = profile.role !== "STUDENT";

  const visibleAnnouncements = workspace.announcements
    .filter((announcement) => {
      if (profile.role !== "TEACHER") return true;
      return announcement.courseCode === "ALL"
        || teachingCourses.some((course) => course.code === announcement.courseCode);
    })
    .sort((left, right) => Date.parse(right.postedAt) - Date.parse(left.postedAt));

  const handlePublish = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();
    if (!canPublish || !trimmedTitle || !trimmedBody) return;

    const targetCourse = profile.role === "ADMIN" ? "ALL" : selectedCourseCode;
    if (!targetCourse) return;
    updateDemoWorkspace((current) => ({
      ...current,
      announcements: [
        {
          id: crypto.randomUUID(),
          title: trimmedTitle,
          body: trimmedBody,
          courseCode: targetCourse,
          postedAt: new Date().toISOString(),
          author: profile.name,
        },
        ...current.announcements,
      ],
    }));
    setTitle("");
    setBody("");
    setComposerOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={canPublish ? "Announcement center" : "Announcements"}
        description={canPublish
          ? "Publish updates that appear in the relevant portal dashboards."
          : "Latest updates from your instructors and department."
        }
        action={canPublish ? (
          <button
            type="button"
            onClick={() => setComposerOpen((open) => !open)}
            aria-expanded={composerOpen}
            className="inline-flex items-center gap-2 rounded-md bg-[#16233F] px-3 py-2 text-sm font-medium text-white hover:bg-[#0F1B33]"
          >
            <Plus size={16} aria-hidden />
            New announcement
          </button>
        ) : undefined}
      />

      {composerOpen && canPublish && (
        <form onSubmit={handlePublish} className="rounded-lg border border-[#E4E2DA] bg-white p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_12rem]">
            <div>
              <label htmlFor="announcement-title" className="text-xs font-medium text-[#6B7280]">Title</label>
              <input
                id="announcement-title"
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="What should the portal know?"
                className="field-input"
              />
            </div>
            {profile.role === "TEACHER" ? (
              <div>
                <label htmlFor="announcement-course" className="text-xs font-medium text-[#6B7280]">Audience</label>
                <select
                  id="announcement-course"
                  value={selectedCourseCode}
                  onChange={(event) => setCourseCode(event.target.value)}
                  className="field-input"
                >
                  {teachingCourses.map((course) => (
                    <option key={course.id} value={course.code}>{course.code}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <p className="text-xs font-medium text-[#6B7280]">Audience</p>
                <p className="mt-1 rounded-md bg-[#FAFAF8] px-3 py-2 text-sm text-[#16233F]">
                  All portal users
                </p>
              </div>
            )}
          </div>
          <div className="mt-4">
            <label htmlFor="announcement-body" className="text-xs font-medium text-[#6B7280]">Message</label>
            <textarea
              id="announcement-body"
              required
              rows={4}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Write a concise update..."
              className="field-input resize-y"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-[#C9A227] px-4 py-2 text-sm font-semibold text-[#0F1B33]"
            >
              <Send size={15} aria-hidden />
              Publish
            </button>
          </div>
        </form>
      )}

      <ul className="space-y-4">
        {visibleAnnouncements.map((item) => {
          const canDelete = profile.role === "ADMIN"
            || (profile.role === "TEACHER" && item.author === profile.name);
          return (
            <li key={item.id} className="space-y-2 rounded-lg border border-[#E4E2DA] bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#EFEDE6] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#6B7280]">
                      {item.courseCode}
                    </span>
                    <h3 className="font-semibold text-[#16233F]">{item.title}</h3>
                  </div>
                  <p className="mt-1 text-xs text-[#9CA3AF]">{formatDate(item.postedAt)} · {item.author}</p>
                </div>
                {canDelete && (
                  <button
                    type="button"
                    onClick={() => updateDemoWorkspace((current) => ({
                      ...current,
                      announcements: current.announcements.filter((announcement) => announcement.id !== item.id),
                    }))}
                    aria-label={`Delete ${item.title}`}
                    title="Delete announcement"
                    className="shrink-0 rounded-md p-2 text-[#6B7280] hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 size={16} aria-hidden />
                  </button>
                )}
              </div>
              <p className="text-sm leading-6 text-[#6B7280]">{item.body}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default RoleAnnouncements;