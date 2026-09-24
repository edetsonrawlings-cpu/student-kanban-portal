import type { Metadata } from "next";
import { CourseCard } from "@/components/courses/CourseCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { mockCourses, TERM } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Courses" };

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Enrolled Courses"
        description={`Your active courses for ${TERM}.`}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
