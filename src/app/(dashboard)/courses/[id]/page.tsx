import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AssignmentStatusCard } from "@/components/dashboard/AssignmentStatusCard";
import { mockAssignments, mockCourses, mockGrades } from "@/lib/mock-data";

interface CoursePageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return mockCourses.map((course) => ({ id: course.id }));
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { id } = await params;
  const course = mockCourses.find((item) => item.id === id);
  return { title: course ? `${course.code} · ${course.title}` : "Course" };
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { id } = await params;
  const course = mockCourses.find((item) => item.id === id);
  if (!course) notFound();

  const grade = mockGrades.find((item) => item.courseCode === course.code);
  const assignments = mockAssignments.filter((item) => item.courseCode === course.code);

  return (
    <div className="space-y-6">
      <Link
        href="/courses"
        className="inline-flex items-center gap-1.5 text-sm text-[#2F4470] hover:underline"
      >
        <ArrowLeft size={15} strokeWidth={1.75} aria-hidden />
        All courses
      </Link>

      <PageHeader
        title={course.title}
        description={`${course.code} · ${course.instructor} · ${course.term}`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#E4E2DA] bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-[#9CA3AF]">Progress</p>
          <p className="font-serif text-2xl text-[#16233F]">{course.progress}%</p>
        </div>
        <div className="rounded-xl border border-[#E4E2DA] bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-[#9CA3AF]">Credits</p>
          <p className="font-serif text-2xl text-[#16233F]">{course.credits}</p>
        </div>
        <div className="rounded-xl border border-[#E4E2DA] bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-[#9CA3AF]">Current Grade</p>
          <p className="font-serif text-2xl text-[#16233F]">
            {grade ? `${grade.letter} · ${grade.percentage}%` : "—"}
          </p>
        </div>
      </div>

      {course.nextSession && (
        <p className="flex items-center gap-1.5 text-sm text-[#6B7280]">
          <Clock size={15} strokeWidth={1.75} aria-hidden />
          Next session: {course.nextSession}
        </p>
      )}

      <section>
        <h3 className="mb-3 font-serif text-lg text-[#16233F]">Assignments</h3>
        {assignments.length > 0 ? (
          <div className="space-y-3">
            {assignments.map((assignment) => (
              <AssignmentStatusCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#6B7280]">No assignments recorded for this course yet.</p>
        )}
      </section>
    </div>
  );
}
