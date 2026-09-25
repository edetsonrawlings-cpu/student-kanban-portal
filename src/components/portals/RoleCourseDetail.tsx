"use client";

import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { AssignmentStatusCard } from "@/components/dashboard/AssignmentStatusCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { percentageToLetterGrade } from "@/lib/grades";
import { DEMO_STUDENT_USER_ID, mockGrades } from "@/lib/mock-data";
import { useActiveAccount } from "@/lib/use-active-account";
import { useActiveTeacher } from "@/lib/use-active-teacher";
import { useDemoCourses } from "@/lib/use-demo-courses";
import { useDemoProfile } from "@/lib/use-demo-profile";
import { useDemoWorkspace } from "@/lib/use-demo-workspace";
import type { Course } from "@/types";

export function RoleCourseDetailById({ courseId }: Readonly<{ courseId: string }>) {
  const courses = useDemoCourses();
  const course = courses.find((item) => item.id === courseId);

  if (!course) {
    return (
      <div className="space-y-4">
        <PageHeader title="Course not found" description="This course is not available in the local demo catalog." />
        <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm text-[#2F4470] hover:underline">
          <ArrowLeft size={15} strokeWidth={1.75} aria-hidden />
          Return to courses
        </Link>
      </div>
    );
  }

  return <RoleCourseDetail course={course} />;
}

export function RoleCourseDetail({ course }: Readonly<{ course: Course }>) {
  const profile = useDemoProfile();
  const { accountId: activeStudentId, account: activeStudent } = useActiveAccount("STUDENT");
  const { teacherId } = useActiveTeacher();
  const workspace = useDemoWorkspace();
  const assignments = workspace.assignments.filter((item) => item.courseCode === course.code);
  const classRecords = workspace.teacherGrades.filter((item) => item.courseCode === course.code);
  const gradedRecords = classRecords.filter(
    (record): record is typeof record & { percentage: number } => record.percentage !== null
  );
  const classAverage = gradedRecords.length
    ? Math.round(gradedRecords.reduce((sum, item) => sum + item.percentage, 0) / gradedRecords.length)
    : null;
  const studentId = activeStudent?.identifier ?? activeStudent?.id;
  const studentTeacherGrade = classRecords.find((item) => item.studentId === studentId);
  const staticGrade = activeStudentId === DEMO_STUDENT_USER_ID
    ? mockGrades.find((item) => item.courseCode === course.code)
    : undefined;
  const studentScore = studentTeacherGrade ? studentTeacherGrade.percentage : staticGrade?.percentage ?? null;
  const studentLetter = studentScore === null ? null : percentageToLetterGrade(studentScore);
  const teacherOwnsCourse = profile.role === "TEACHER" && course.instructorId === teacherId;

  return (
    <div className="space-y-6">
      <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm text-[#2F4470] hover:underline">
        <ArrowLeft size={15} strokeWidth={1.75} aria-hidden />
        All courses
      </Link>

      <PageHeader
        title={course.title}
        description={`${course.code} · ${course.instructor} · ${course.term}`}
        action={teacherOwnsCourse ? (
          <div className="flex gap-2">
            <Link href="/assignments" className="rounded-md border border-[#E4E2DA] bg-white px-3 py-2 text-sm font-medium text-[#16233F] hover:bg-[#FAFAF8]">
              Assignments
            </Link>
            <Link href="/gradebook" className="rounded-md bg-[#16233F] px-3 py-2 text-sm font-medium text-white hover:bg-[#0F1B33]">
              Gradebook
            </Link>
          </div>
        ) : undefined}
      />

      {profile.role === "TEACHER" && !teacherOwnsCourse && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          This course is outside your teaching assignment and is shown read-only in demo mode.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {profile.role === "STUDENT" && (
          <>
            <CourseMetric label="Progress" value={`${course.progress}%`} />
            <CourseMetric label="Credits" value={String(course.credits)} />
            <CourseMetric
              label="Current grade"
              value={studentScore === null ? "Pending" : `${studentLetter} · ${studentScore}%`}
            />
          </>
        )}
        {profile.role === "TEACHER" && (
          <>
            <CourseMetric label="Enrolled students" value={String(classRecords.length)} />
            <CourseMetric label="Class average" value={classAverage === null ? "—" : `${classAverage}%`} />
            <CourseMetric label="Published work" value={String(assignments.length)} />
          </>
        )}
        {profile.role === "ADMIN" && (
          <>
            <CourseMetric label="Credits" value={String(course.credits)} />
            <CourseMetric label="Term progress" value={`${course.progress}%`} />
            <CourseMetric label="Assignments" value={String(assignments.length)} />
          </>
        )}
      </div>

      {course.nextSession && (
        <p className="flex items-center gap-1.5 text-sm text-[#6B7280]">
          <Clock size={15} strokeWidth={1.75} aria-hidden />
          Next session: {course.nextSession}
        </p>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-lg text-[#16233F]">Assignments</h2>
            <p className="text-xs text-[#6B7280]">Live from the shared demo workspace</p>
          </div>
          {teacherOwnsCourse && (
            <Link href="/assignments" className="text-sm text-[#2F4470] hover:underline">Manage</Link>
          )}
        </div>
        {assignments.length > 0 ? (
          <div className="space-y-3">
            {assignments.map((assignment) => (
              <AssignmentStatusCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-[#E4E2DA] bg-white p-5 text-sm text-[#6B7280]">
            No assignments recorded for this course yet.
          </p>
        )}
      </section>
    </div>
  );
}

function CourseMetric({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-lg border border-[#E4E2DA] bg-white p-5">
      <p className="text-xs uppercase text-[#9CA3AF]">{label}</p>
      <p className="font-serif text-2xl text-[#16233F]">{value}</p>
    </div>
  );
}

export default RoleCourseDetail;