import { BookOpen, ClipboardList, CalendarCheck2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { GpaSeal } from "@/components/dashboard/GpaSeal";
import { CourseCard } from "@/components/courses/CourseCard";
import { AssignmentStatusCard } from "@/components/dashboard/AssignmentStatusCard";
import { AnnouncementsFeed } from "@/components/dashboard/AnnouncementsFeed";
import {
  mockAnnouncements,
  mockAssignments,
  mockCourses,
  mockStudentSummary,
} from "@/lib/mock-data";

export default function StudentDashboardPage() {
  const summary = mockStudentSummary;
  const upcoming = mockAssignments
    .filter((a) => a.status === "not_submitted" || a.status === "late")
    .slice(0, 4);

  return (
    <DashboardLayout role="STUDENT" pageTitle="Dashboard">
      <div className="space-y-8">
        {/* Greeting */}
        <div>
          <h2 className="font-serif text-2xl text-[#16233F]">Welcome back, Ama 👋</h2>
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
              <p className="mt-0.5 text-xs text-[#6B7280]">Cumulative, Fall 2026</p>
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
            <a href="/courses" className="text-sm text-[#2F4470] hover:underline">
              View all
            </a>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>

        {/* Deadlines + Announcements */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-serif text-lg text-[#16233F]">Upcoming Deadlines</h2>
              <a href="/assignments" className="text-sm text-[#2F4470] hover:underline">
                View all
              </a>
            </div>
            <div className="space-y-3">
              {upcoming.map((assignment) => (
                <AssignmentStatusCard key={assignment.id} assignment={assignment} />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-serif text-lg text-[#16233F]">&nbsp;</h2>
            </div>
            <AnnouncementsFeed announcements={mockAnnouncements} />
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
