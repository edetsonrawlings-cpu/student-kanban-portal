"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BookPlus, CheckCircle2, Pencil, Plus } from "lucide-react";
import { updateDemoWorkspace } from "@/lib/demo-workspace-store";
import { TERM } from "@/lib/mock-data";
import { useActiveTeacher } from "@/lib/use-active-teacher";
import { useDemoCourses } from "@/lib/use-demo-courses";
import { useDemoWorkspace } from "@/lib/use-demo-workspace";
import { cn } from "@/lib/utils";

const COURSE_COLORS = ["#16233F", "#2F4470", "#4B7A6F", "#B8563F", "#C9A227"];

export function AdminCourseManager() {
  const workspace = useDemoWorkspace();
  const courses = useDemoCourses();
  const { teacherId: activeTeacherId } = useActiveTeacher();
  const activeTeachers = workspace.users.filter(
    (user) => user.role === "TEACHER" && user.status === "ACTIVE"
  );
  const [formOpen, setFormOpen] = useState(false);
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [credits, setCredits] = useState("3");
  const [term, setTerm] = useState(TERM);
  const [nextSession, setNextSession] = useState("");
  const [coverColor, setCoverColor] = useState(COURSE_COLORS[0]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editingTeacherId, setEditingTeacherId] = useState("");
  const [editingStudentIds, setEditingStudentIds] = useState<string[]>([]);
  const activeStudents = workspace.users.filter(
    (user) => user.role === "STUDENT" && user.status === "ACTIVE"
  );
  let selectedTeacherId = activeTeachers[0]?.id ?? "";
  if (activeTeachers.some((teacher) => teacher.id === activeTeacherId)) {
    selectedTeacherId = activeTeacherId;
  }
  if (activeTeachers.some((teacher) => teacher.id === teacherId)) {
    selectedTeacherId = teacherId;
  }

  const handleCreate = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedCode = code.trim().toUpperCase();
    const trimmedTitle = title.trim();
    const trimmedTerm = term.trim();
    const trimmedSession = nextSession.trim();
    const creditValue = Number(credits);
    const teacher = activeTeachers.find((item) => item.id === selectedTeacherId);

    if (!teacher) {
      setError("Add an active teacher before creating a course.");
      return;
    }
    if (courses.some((course) => course.code.toUpperCase() === normalizedCode)) {
      setError(`Course code ${normalizedCode} already exists.`);
      return;
    }
    if (!normalizedCode || !trimmedTitle || !trimmedTerm || !Number.isInteger(creditValue)) return;

    const course = {
      id: `course-${crypto.randomUUID()}`,
      code: normalizedCode,
      title: trimmedTitle,
      instructor: teacher.name,
      instructorId: teacher.id,
      term: trimmedTerm,
      coverColor,
      progress: 0,
      credits: creditValue,
      nextSession: trimmedSession || undefined,
    };
    updateDemoWorkspace((current) => ({
      ...current,
      courses: [...current.courses, course],
      teacherGrades: [
        ...current.teacherGrades,
        ...current.users
          .filter((user) => user.role === "STUDENT")
          .map((student) => ({
            id: `grade-${crypto.randomUUID()}`,
            studentId: student.identifier ?? student.id,
            studentName: student.name,
            courseCode: normalizedCode,
            percentage: null,
          })),
      ],
    }));

    setCode("");
    setTitle("");
    setCredits("3");
    setTerm(TERM);
    setNextSession("");
    setCoverColor(COURSE_COLORS[0]);
    setError("");
    setSuccess(`${normalizedCode} created and assigned to ${teacher.name}.`);
    setFormOpen(false);
  };

  const beginCourseEdit = (courseId: string) => {
    const course = courses.find((item) => item.id === courseId);
    if (!course) return;
    setEditingCourseId(course.id);
    setEditingTeacherId(course.instructorId ?? "");
    setEditingStudentIds(course.studentIds ?? activeStudents.map((student) => student.id));
    setError("");
  };

  const saveCourseEdit = () => {
    if (!editingCourseId) return;
    const teacher = activeTeachers.find((item) => item.id === editingTeacherId);
    if (!teacher) {
      setError("Select an active professor.");
      return;
    }

    updateDemoWorkspace((current) => {
      const course = current.courses.find((item) => item.id === editingCourseId);
      if (!course) return current;
      const currentGrades = current.teacherGrades.filter((grade) => grade.courseCode === course.code);
      const selectedGrades = editingStudentIds.flatMap((studentId) => {
        const student = current.users.find((user) => user.id === studentId);
        if (!student) return [];
        return [currentGrades.find((grade) => grade.studentId === (student.identifier ?? student.id)) ?? {
          id: `grade-${crypto.randomUUID()}`,
          studentId: student.identifier ?? student.id,
          studentName: student.name,
          courseCode: course.code,
          percentage: null,
        }];
      });

      return {
        ...current,
        courses: current.courses.map((item) => item.id === editingCourseId
          ? { ...item, instructor: teacher.name, instructorId: teacher.id, studentIds: editingStudentIds }
          : item),
        teacherGrades: [
          ...current.teacherGrades.filter((grade) => grade.courseCode !== course.code),
          ...selectedGrades,
        ],
      };
    });
    setSuccess("Course professor and student roster updated.");
    setEditingCourseId(null);
  };

  return (
    <section className="overflow-hidden rounded-lg border border-[#E4E2DA] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E4E2DA] px-5 py-4">
        <div>
          <h2 className="font-serif text-lg text-[#16233F]">Course management</h2>
          <p className="text-xs text-[#6B7280]">{courses.length} active course(s) in the shared catalog</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setError("");
            setSuccess("");
            setFormOpen((open) => !open);
          }}
          aria-expanded={formOpen}
          className="inline-flex items-center gap-2 rounded-md bg-[#16233F] px-3 py-2 text-sm font-semibold text-white hover:bg-[#0F1B33]"
        >
          <BookPlus size={16} aria-hidden />
          Create course
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleCreate} className="border-b border-[#E4E2DA] bg-[#FAFAF8] p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <CourseField label="Course code" htmlFor="course-code">
              <input
                id="course-code"
                required
                maxLength={12}
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="e.g. CS405"
                className="field-input uppercase"
              />
            </CourseField>
            <CourseField label="Course title" htmlFor="course-title">
              <input
                id="course-title"
                required
                maxLength={100}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Cloud Architecture"
                className="field-input"
              />
            </CourseField>
            <CourseField label="Professor" htmlFor="course-teacher">
              <select
                id="course-teacher"
                required
                disabled={!activeTeachers.length}
                value={selectedTeacherId}
                onChange={(event) => setTeacherId(event.target.value)}
                className="field-input disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                {!activeTeachers.length && <option value="">No active professor</option>}
                {activeTeachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                ))}
              </select>
            </CourseField>
            <CourseField label="Credits" htmlFor="course-credits">
              <input
                id="course-credits"
                type="number"
                required
                min={1}
                max={12}
                value={credits}
                onChange={(event) => setCredits(event.target.value)}
                className="field-input"
              />
            </CourseField>
            <CourseField label="Term" htmlFor="course-term">
              <input
                id="course-term"
                required
                maxLength={40}
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                className="field-input"
              />
            </CourseField>
            <CourseField label="Next session" htmlFor="course-session">
              <input
                id="course-session"
                maxLength={50}
                value={nextSession}
                onChange={(event) => setNextSession(event.target.value)}
                placeholder="e.g. Mon · 2:00 PM"
                className="field-input"
              />
            </CourseField>
            <fieldset className="md:col-span-2">
              <legend className="text-xs font-medium text-[#6B7280]">Course color</legend>
              <div className="mt-2 flex h-9 items-center gap-2">
                {COURSE_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Use course color ${color}`}
                    aria-pressed={coverColor === color}
                    onClick={() => setCoverColor(color)}
                    className={cn(
                      "h-7 w-7 rounded-full border-2 border-white ring-1 ring-[#D5D1C6]",
                      coverColor === color && "ring-2 ring-offset-2 ring-[#16233F]"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </fieldset>
          </div>

          {error && <p role="alert" className="mt-4 text-sm font-medium text-red-700">{error}</p>}
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="rounded-md border border-[#E4E2DA] bg-white px-4 py-2 text-sm font-semibold text-[#6B7280]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!activeTeachers.length}
              className="inline-flex items-center gap-2 rounded-md bg-[#C9A227] px-4 py-2 text-sm font-semibold text-[#0F1B33] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={15} aria-hidden />
              Add course
            </button>
          </div>
        </form>
      )}

      {success && (
        <output className="flex items-center gap-2 border-b border-emerald-100 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 size={16} aria-hidden />
          {success}
        </output>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[42rem] text-left text-sm text-[#6B7280]">
          <caption className="sr-only">Shared course catalog</caption>
          <thead className="border-b border-[#E4E2DA] bg-[#FAFAF8] text-xs uppercase">
            <tr>
              <th scope="col" className="p-4">Course</th>
              <th scope="col" className="p-4">Professor</th>
              <th scope="col" className="p-4">Students</th>
              <th scope="col" className="p-4">Term</th>
              <th scope="col" className="p-4">Credits</th>
              <th scope="col" className="p-4 text-right">Open</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E2DA]">
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="p-4">
                  <p className="font-medium text-[#16233F]">{course.title}</p>
                  <p className="font-mono text-xs">{course.code}</p>
                </td>
                <td className="p-4">
                  {editingCourseId === course.id ? (
                    <select
                      value={editingTeacherId}
                      onChange={(event) => setEditingTeacherId(event.target.value)}
                      className="field-input min-w-44 py-1.5 text-xs"
                      aria-label={`Professor for ${course.code}`}
                    >
                      {activeTeachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                      ))}
                    </select>
                  ) : course.instructor}
                </td>
                <td className="p-4 align-top">
                  {editingCourseId === course.id ? (
                    <div className="max-h-32 min-w-56 space-y-1 overflow-y-auto">
                      {activeStudents.map((student) => (
                        <label key={student.id} className="flex items-center gap-2 text-xs text-[#16233F]">
                          <input
                            type="checkbox"
                            checked={editingStudentIds.includes(student.id)}
                            onChange={(event) => setEditingStudentIds((current) => event.target.checked
                              ? [...current, student.id]
                              : current.filter((id) => id !== student.id))}
                          />
                          <span>{student.name}</span>
                        </label>
                      ))}
                    </div>
                  ) : `${course.studentIds?.length ?? activeStudents.length} enrolled`}
                </td>
                <td className="p-4">{course.term}</td>
                <td className="p-4">{course.credits}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-1">
                    {editingCourseId === course.id ? (
                      <>
                        <button type="button" onClick={saveCourseEdit} className="rounded-md bg-[#16233F] px-2 py-1.5 text-xs font-semibold text-white">Save</button>
                        <button type="button" onClick={() => setEditingCourseId(null)} className="rounded-md border border-[#E4E2DA] px-2 py-1.5 text-xs font-semibold text-[#6B7280]">Cancel</button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => beginCourseEdit(course.id)}
                        aria-label={`Edit ${course.code}`}
                        className="inline-flex rounded-md p-2 text-[#16233F] hover:bg-[#FAFAF8]"
                      >
                        <Pencil size={15} aria-hidden />
                      </button>
                    )}
                    <Link
                      href={`/courses/${course.id}`}
                      aria-label={`Open ${course.code}`}
                      className="inline-flex rounded-md p-2 text-[#2F4470] hover:bg-[#FAFAF8]"
                    >
                      <ArrowUpRight size={16} aria-hidden />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CourseField({
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

export default AdminCourseManager;