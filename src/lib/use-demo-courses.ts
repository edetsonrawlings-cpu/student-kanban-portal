"use client";

import { useDemoWorkspace } from "@/lib/use-demo-workspace";
import { useDemoProfile } from "@/lib/use-demo-profile";
import { useActiveAccount } from "@/lib/use-active-account";
import { useActiveTeacher } from "@/lib/use-active-teacher";
import type { Course } from "@/types";

export function useDemoCourses(): Course[] {
  const workspace = useDemoWorkspace();
  const { accountId: activeStudentId } = useActiveAccount("STUDENT");
  const profile = useDemoProfile();
  const courses = workspace.courses.map((course) => {
    if (!course.instructorId) return course;
    const instructor = workspace.users.find((user) => user.id === course.instructorId);
    return instructor ? { ...course, instructor: instructor.name } : course;
  });
  return profile.role === "STUDENT"
    ? courses.filter((course) => !course.studentIds || course.studentIds.includes(activeStudentId))
    : courses;
}

export function useTeachingCourses(): Course[] {
  const courses = useDemoCourses();
  const { teacherId } = useActiveTeacher();
  return courses.filter((course) => course.instructorId === teacherId);
}