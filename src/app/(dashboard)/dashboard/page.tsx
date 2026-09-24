import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, CalendarCheck2, ClipboardList } from "lucide-react";
import { AnnouncementsFeed } from "@/components/dashboard/AnnouncementsFeed";
import { AssignmentStatusCard } from "@/components/dashboard/AssignmentStatusCard";
import { GpaSeal } from "@/components/dashboard/GpaSeal";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { CourseCard } from "@/components/courses/CourseCard";
import {
  currentStudent,
  mockAnnouncements,
  mockCourses,
  mockStudentSummary,
  pendingAssignments,
  TERM,
} from "@/lib/mock-data";

export const metadata: Metadata = { title: "Dashboard" };

export default function StudentDashboardPage() {
  const summary = mockStudentSummary;
  const firstName = currentStudent.name.split(" ")[0];
  const upcoming = pendingAssignments.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h2 className="font-serif text-2xl text-[#16233F]">Welcome back, {firstName} 👋</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Here&apos;s what&apos;s on your plate this week.
        </p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-4 rounded-lg border border-[#E4E2DA] bg-white p-5">
          <GpaSeal gpa={summary.gpa} gpaMax={summary.gpaMax} />
          <div>
            <p className="text-xs uppercase tracking-wide text-[#9CA3AF]">Current GPA</p>
            <p className="mt-0.5 text-xs text-[#6B7280]">Cumulative, {TERM}</p>
          </div>
        </div>
        <SummaryCard
          label="Enrolled Courses"
          value={String(summary.enrolledCourses)}
          icon={BookOpen}
          accent="#2F4470"
        />
        <SummaryCard
          label="Pending Assignments"
          value={String(summary.pendingAssignments)}
          icon={ClipboardList}
          accent="#B8563F"
        />
        <SummaryCard
          label="Attendance Rate"
          value={`${summary.attendanceRate}%`}
          icon={CalendarCheck2}
          accent="#4B7A6F"
        />
      </div>

      {/* Courses */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-lg text-[#16233F]">Your Courses</h2>
          <Link href="/courses" className="text-sm text-[#2F4470] hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Deadlines + Announcements */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-lg text-[#16233F]">Upcoming Deadlines</h2>
            <Link href="/assignments" className="text-sm text-[#2F4470] hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {upcoming.map((assignment) => (
              <AssignmentStatusCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-lg text-[#16233F]">Recent Announcements</h2>
            <Link href="/announcements" className="text-sm text-[#2F4470] hover:underline">
              View all
            </Link>
          </div>
          <AnnouncementsFeed announcements={mockAnnouncements.slice(0, 3)} />
        </section>
      </div>
    </div>
  );
}
