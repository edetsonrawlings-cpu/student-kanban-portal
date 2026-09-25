import type { Metadata } from "next";
import { RoleCourses } from "@/components/portals/RoleCourses";

export const metadata: Metadata = { title: "Courses" };

export default function CoursesPage() {
  return <RoleCourses />;
}
