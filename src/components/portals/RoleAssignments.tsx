"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { PageHeader } from "@/components/layout/PageHeader";
import { updateDemoWorkspace } from "@/lib/demo-workspace-store";
import { useDemoCourses, useTeachingCourses } from "@/lib/use-demo-courses";
import { useDemoProfile } from "@/lib/use-demo-profile";
import { useDemoWorkspace } from "@/lib/use-demo-workspace";
import { formatDueDate } from "@/lib/utils";

export function RoleAssignments() {
  const profile = useDemoProfile();
  const courses = useDemoCourses();
  const teachingCourses = useTeachingCourses();
  const workspace = useDemoWorkspace();
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [courseCode, setCourseCode] = useState(teachingCourses[0]?.code ?? courses[0].code);
  const selectedCourseCode = teachingCourses.some((course) => course.code === courseCode)
    ? courseCode
    : teachingCourses[0]?.code ?? "";
  const [dueDate, setDueDate] = useState("");
  const [maxPoints, setMaxPoints] = useState("100");

  if (profile.role === "STUDENT") {
    const enrolledCourseCodes = new Set(courses.map((course) => course.code));
    const studentAssignments = workspace.assignments
      .filter((assignment) => enrolledCourseCodes.has(assignment.courseCode))
      .filter((assignment) => assignment.status !== "graded")
      .sort((left, right) => Date.parse(left.dueDate) - Date.parse(right.dueDate));

    return (
      <div className="space-y-6">
        <PageHeader
          title="Campus Portal Development Board"
          description="Track the shared board and submit your course work from one place."
        />
        <section className="overflow-hidden rounded-lg border border-[#E4E2DA] bg-white">
          <div className="border-b border-[#E4E2DA] px-5 py-4">
            <h2 className="font-serif text-lg text-[#16233F]">Assignments to submit</h2>
            <p className="text-xs text-[#6B7280]">Submission status is shared across the student demo accounts.</p>
          </div>
          <ul className="divide-y divide-[#E4E2DA]">
            {studentAssignments.map((assignment) => {
              const submitted = assignment.status === "submitted";
              return (
                <li key={assignment.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-[#2F4470]">{assignment.courseCode}</span>
                      <h3 className="truncate text-sm font-medium text-[#16233F]">{assignment.title}</h3>
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-[#6B7280]">
                      <CalendarDays size={13} aria-hidden />
                      Due {formatDueDate(assignment.dueDate)}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={submitted}
                    onClick={() => updateDemoWorkspace((current) => ({
                      ...current,
                      assignments: current.assignments.map((item) => item.id === assignment.id
                        ? { ...item, status: "submitted" }
                        : item),
                    }))}
                    className="inline-flex items-center gap-1.5 rounded-md bg-[#16233F] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0F1B33] disabled:cursor-default disabled:bg-emerald-700"
                  >
                    <CheckCircle2 size={14} aria-hidden />
                    {submitted ? "Submitted" : "Submit assignment"}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
        <KanbanBoard />
      </div>
    );
  }

  if (profile.role === "ADMIN") {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Assignments"
          description="Assignment delivery is managed by teaching staff."
        />
        <div className="rounded-lg border border-[#E4E2DA] bg-white p-6 text-sm text-[#6B7280]">
          Switch to the Teacher portal to manage assignments, or return to the{" "}
          <Link href="/admin" className="font-medium text-[#2F4470] hover:underline">
            administration workspace
          </Link>.
        </div>
      </div>
    );
  }

  const courseCodes = new Set(teachingCourses.map((course) => course.code));
  const assignments = workspace.assignments
    .filter((assignment) => courseCodes.has(assignment.courseCode))
    .sort((left, right) => Date.parse(left.dueDate) - Date.parse(right.dueDate));

  const handleCreate = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const points = Number(maxPoints);
    if (!trimmedTitle || !dueDate || !courseCodes.has(selectedCourseCode) || points < 1) return;

    updateDemoWorkspace((current) => ({
      ...current,
      assignments: [
        ...current.assignments,
        {
          id: crypto.randomUUID(),
          title: trimmedTitle,
          courseCode: selectedCourseCode,
          dueDate: new Date(`${dueDate}T23:59:00Z`).toISOString(),
          status: "not_submitted",
          maxPoints: points,
        },
      ],
    }));
    setTitle("");
    setDueDate("");
    setMaxPoints("100");
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assignment manager"
        description="Publish course work and keep the student deadline view in sync."
        action={
          <button
            type="button"
            onClick={() => setFormOpen((open) => !open)}
            aria-expanded={formOpen}
            className="inline-flex items-center gap-2 rounded-md bg-[#16233F] px-3 py-2 text-sm font-medium text-white hover:bg-[#0F1B33]"
          >
            <Plus size={16} aria-hidden />
            New assignment
          </button>
        }
      />

      {formOpen && (
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 gap-4 rounded-lg border border-[#E4E2DA] bg-white p-5 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr_auto]"
        >
          <Field label="Title" htmlFor="assignment-title">
            <input
              id="assignment-title"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Accessibility audit"
              className="field-input"
            />
          </Field>
          <Field label="Course" htmlFor="assignment-course">
            <select
              id="assignment-course"
              value={selectedCourseCode}
              onChange={(event) => setCourseCode(event.target.value)}
              className="field-input"
            >
              {teachingCourses.map((course) => (
                <option key={course.id} value={course.code}>{course.code}</option>
              ))}
            </select>
          </Field>
          <Field label="Due date" htmlFor="assignment-due">
            <input
              id="assignment-due"
              type="date"
              required
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="field-input"
            />
          </Field>
          <Field label="Points" htmlFor="assignment-points">
            <input
              id="assignment-points"
              type="number"
              min="1"
              max="1000"
              required
              value={maxPoints}
              onChange={(event) => setMaxPoints(event.target.value)}
              className="field-input"
            />
          </Field>
          <button
            type="submit"
            className="self-end rounded-md bg-[#C9A227] px-4 py-2 text-sm font-semibold text-[#0F1B33]"
          >
            Publish
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-lg border border-[#E4E2DA] bg-white">
        <div className="border-b border-[#E4E2DA] px-5 py-4">
          <h2 className="font-serif text-lg text-[#16233F]">Published work</h2>
          <p className="text-xs text-[#6B7280]">{assignments.length} assignment(s) in your courses</p>
        </div>
        {assignments.length ? (
          <ul className="divide-y divide-[#E4E2DA]">
            {assignments.map((assignment) => (
              <li key={assignment.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[#2F4470]">{assignment.courseCode}</span>
                    <h3 className="truncate text-sm font-medium text-[#16233F]">{assignment.title}</h3>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-[#6B7280]">
                    <CalendarDays size={13} aria-hidden />
                    Due {formatDueDate(assignment.dueDate)} · {assignment.maxPoints} points
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => updateDemoWorkspace((current) => ({
                    ...current,
                    assignments: current.assignments.filter((item) => item.id !== assignment.id),
                  }))}
                  aria-label={`Delete ${assignment.title}`}
                  title="Delete assignment"
                  className="rounded-md p-2 text-[#6B7280] hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 size={16} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-8 text-sm text-[#6B7280]">No assignments published yet.</p>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: Readonly<{ label: string; htmlFor: string; children: React.ReactNode }>) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-xs font-medium text-[#6B7280]">{label}</label>
      {children}
    </div>
  );
}

export default RoleAssignments;