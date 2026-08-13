import Link from "next/link";
import { Clock, ArrowUpRight } from "lucide-react";
import type { Course } from "@/types";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-[#E4E2DA] bg-white transition-shadow hover:shadow-md"
    >
      {/* Cover strip */}
      <div
        className="flex h-20 items-start justify-between px-4 py-3"
        style={{ backgroundColor: course.coverColor }}
      >
        <span className="rounded bg-white/15 px-2 py-0.5 font-mono text-xs tracking-wide text-white">
          {course.code}
        </span>
        <ArrowUpRight
          size={16}
          className="text-white/70 opacity-0 transition-opacity group-hover:opacity-100"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-serif text-base leading-snug text-[#16233F]">{course.title}</h3>
          <p className="mt-0.5 text-xs text-[#6B7280]">{course.instructor}</p>
        </div>

        {/* Progress */}
        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-[#9CA3AF]">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EFEDE6]">
            <div
              className="h-full rounded-full"
              style={{ width: `${course.progress}%`, backgroundColor: course.coverColor }}
            />
          </div>
        </div>

        {course.nextSession && (
          <div className="mt-auto flex items-center gap-1.5 text-xs text-[#6B7280]">
            <Clock size={13} strokeWidth={1.75} />
            {course.nextSession}
          </div>
        )}
      </div>
    </Link>
  );
}
