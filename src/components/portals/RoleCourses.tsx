"use client";

import { CourseCard } from "@/components/courses/CourseCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { TERM } from "@/lib/mock-data";
import { useDemoCourses, useTeachingCourses } from "@/lib/use-demo-courses";
import { useDemoProfile } from "@/lib/use-demo-profile";

export function RoleCourses() {
  const profile = useDemoProfile();
  const allCourses = useDemoCourses();
  const teachingCourses = useTeachingCourses();
  const courses = profile.role === "TEACHER"
    ? teachingCourses
    : allCourses;
  const copy = {
    STUDENT: {
      title: "Enrolled courses",
      description: `Your active courses for ${TERM}.`,
    },
    TEACHER: {
      title: "Teaching courses",
      description: `Courses assigned to you for ${TERM}.`,
    },
    ADMIN: {
      title: "Course catalog",
      description: `Institution-wide active courses for ${TERM}.`,
    },
  }[profile.role];

  return (
    <div className="space-y-6">
      <PageHeader title={copy.title} description={copy.description} />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            progressLabel={profile.role === "STUDENT" ? "Progress" : "Term progress"}
          />
        ))}
      </div>
    </div>
  );
}

export default RoleCourses;