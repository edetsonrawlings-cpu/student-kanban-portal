import type { Metadata } from "next";
import { RoleCourseDetailById } from "@/components/portals/RoleCourseDetail";
import { mockCourses } from "@/lib/mock-data";

interface CoursePageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return mockCourses.map((course) => ({ id: course.id }));
}

export async function generateMetadata({ params }: Readonly<CoursePageProps>): Promise<Metadata> {
  const { id } = await params;
  const course = mockCourses.find((item) => item.id === id);
  return { title: course ? `${course.code} · ${course.title}` : "Course" };
}

export default async function CourseDetailPage({ params }: Readonly<CoursePageProps>) {
  const { id } = await params;
  return <RoleCourseDetailById courseId={id} />;
}
