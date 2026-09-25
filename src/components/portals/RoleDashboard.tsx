"use client";

import Link from "next/link";
import {
  BookOpen,
  CalendarCheck2,
  ClipboardCheck,
  ClipboardList,
  ShieldCheck,
  UserCheck,
  UsersRound,
} from "lucide-react";
import { AnnouncementsFeed } from "@/components/dashboard/AnnouncementsFeed";
import { AssignmentStatusCard } from "@/components/dashboard/AssignmentStatusCard";
import { CourseCard } from "@/components/courses/CourseCard";
import { GpaSeal } from "@/components/dashboard/GpaSeal";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { DemoRoleSwitcher } from "@/components/portals/DemoRoleSwitcher";
import { calculateGpa, percentageToLetterGrade } from "@/lib/grades";
import { DEMO_STUDENT_USER_ID, mockGrades, mockStudentSummary, TERM } from "@/lib/mock-data";
import { useActiveAccount } from "@/lib/use-active-account";
import { useDemoCourses, useTeachingCourses } from "@/lib/use-demo-courses";
import { useDemoProfile } from "@/lib/use-demo-profile";
import { useDemoWorkspace } from "@/lib/use-demo-workspace";

export function RoleDashboard() {
  const profile = useDemoProfile();
  const { accountId: activeStudentId, account: activeStudent } = useActiveAccount("STUDENT");
  const allCourses = useDemoCourses();
  const teachingCourses = useTeachingCourses();
  const workspace = useDemoWorkspace();

  if (profile.role === "TEACHER") {
    const courses = teachingCourses;
    const courseCodes = new Set(courses.map((course) => course.code));
    const assignments = workspace.assignments.filter((item) => courseCodes.has(item.courseCode));
    const grades = workspace.teacherGrades.filter((item) => courseCodes.has(item.courseCode));
    const students = new Set(grades.map((grade) => grade.studentId)).size;
    const pendingGrades = grades.filter((item) => item.percentage === null).length;

    return (
      <div className="space-y-8">
        <DashboardGreeting
          title={`Good morning, ${profile.name}`}
          description={`Teaching overview for ${TERM}. Demo changes are saved in this browser.`}
          role="Teacher portal"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Teaching courses" value={String(courses.length)} icon={BookOpen} />
          <SummaryCard
            label="Students"
            value={String(students)}
            icon={UsersRound}
            accent="#4B7A6F"
          />
          <SummaryCard
            label="Assignments"
            value={String(assignments.length)}
            icon={ClipboardList}
            accent="#B8563F"
          />
          <SummaryCard
            label="Awaiting grades"
            value={String(pendingGrades)}
            icon={ClipboardCheck}
            accent="#C9A227"
          />
        </div>

        <section>
          <SectionHeading title="Your teaching" href="/courses" linkLabel="Manage courses" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => <CourseCard key={course.id} course={course} />)}
          </div>
        </section>

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
          <section>
            <SectionHeading title="Assignment schedule" href="/assignments" linkLabel="Manage" />
            <div className="space-y-3">
              {assignments.map((assignment) => (
                <AssignmentStatusCard key={assignment.id} assignment={assignment} />
              ))}
            </div>
          </section>
          <section>
            <SectionHeading title="Course announcements" href="/announcements" linkLabel="Publish" />
            <AnnouncementsFeed
              announcements={workspace.announcements
                .filter((item) => item.courseCode === "ALL" || courseCodes.has(item.courseCode))
                .slice(0, 3)}
            />
          </section>
        </div>
      </div>
    );
  }

  if (profile.role === "ADMIN") {
    const activeUsers = workspace.users.filter((user) => user.status === "ACTIVE").length;
    const suspendedUsers = workspace.users.length - activeUsers;
    const teachers = workspace.users.filter((user) => user.role === "TEACHER").length;

    return (
      <div className="space-y-8">
        <DashboardGreeting
          title={`Welcome, ${profile.name}`}
          description={`Institution operations for ${TERM}.`}
          role="Administrator portal"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Active users" value={String(activeUsers)} icon={UserCheck} />
          <SummaryCard
            label="Teaching staff"
            value={String(teachers)}
            icon={UsersRound}
            accent="#4B7A6F"
          />
          <SummaryCard
            label="Active courses"
            value={String(allCourses.length)}
            icon={BookOpen}
            accent="#C9A227"
          />
          <SummaryCard
            label="Suspended"
            value={String(suspendedUsers)}
            icon={ShieldCheck}
            accent="#B8563F"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_1fr]">
          <section className="overflow-hidden rounded-lg border border-[#E4E2DA] bg-white">
            <div className="flex items-center justify-between border-b border-[#E4E2DA] px-5 py-4">
              <div>
                <h2 className="font-serif text-lg text-[#16233F]">Recent accounts</h2>
                <p className="text-xs text-[#6B7280]">Current demo directory</p>
              </div>
              <Link href="/admin" className="text-sm text-[#2F4470] hover:underline">
                Manage
              </Link>
            </div>
            <ul className="divide-y divide-[#E4E2DA]">
              {workspace.users.slice(0, 5).map((user) => (
                <li key={user.id} className="flex items-center justify-between gap-4 px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#16233F]">{user.name}</p>
                    <p className="truncate text-xs text-[#6B7280]">{user.department}</p>
                  </div>
                  <span className="rounded-full bg-[#EFEDE6] px-2.5 py-1 text-xs font-semibold text-[#6B7280]">
                    {user.role.toLowerCase()}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <SectionHeading title="Institution announcements" href="/announcements" linkLabel="Publish" />
            <AnnouncementsFeed
              announcements={workspace.announcements
                .filter((item) => item.courseCode === "ALL")
                .slice(0, 3)}
            />
          </section>
        </div>
      </div>
    );
  }

  const effectiveGrades = allCourses.flatMap((course) => {
    const studentId = activeStudent?.identifier ?? activeStudent?.id;
    const teacherRecord = workspace.teacherGrades.find(
      (record) => record.studentId === studentId && record.courseCode === course.code
    );
    if (teacherRecord) {
      if (teacherRecord.percentage === null) return [];
      return [{
        courseCode: course.code,
        percentage: teacherRecord.percentage,
        letter: percentageToLetterGrade(teacherRecord.percentage),
      }];
    }
    const seedGrade = activeStudentId === DEMO_STUDENT_USER_ID
      ? mockGrades.find((grade) => grade.courseCode === course.code)
      : undefined;
    return seedGrade ? [seedGrade] : [];
  });
  const summary = {
    ...mockStudentSummary,
    gpa: calculateGpa(effectiveGrades, allCourses),
  };
  const firstName = profile.name.split(" ")[0];
  const upcoming = workspace.assignments
    .filter((assignment) => assignment.status === "not_submitted" || assignment.status === "late")
    .slice(0, 4);

  return (
    <div className="space-y-8">
      <DashboardGreeting
        title={`Welcome back, ${firstName}`}
        description="Here's what's on your plate this week."
        role="Student portal"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-4 rounded-lg border border-[#E4E2DA] bg-white p-5">
          <GpaSeal gpa={summary.gpa} gpaMax={summary.gpaMax} />
          <div>
            <p className="text-xs uppercase tracking-wide text-[#9CA3AF]">Current GPA</p>
            <p className="mt-0.5 text-xs text-[#6B7280]">Cumulative, {TERM}</p>
          </div>
        </div>
        <SummaryCard label="Enrolled courses" value={String(allCourses.length)} icon={BookOpen} />
        <SummaryCard
          label="Pending assignments"
          value={String(upcoming.length)}
          icon={ClipboardList}
          accent="#B8563F"
        />
        <SummaryCard
          label="Attendance rate"
          value={`${summary.attendanceRate}%`}
          icon={CalendarCheck2}
          accent="#4B7A6F"
        />
      </div>

      <section>
        <SectionHeading title="Your courses" href="/courses" linkLabel="View all" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allCourses.map((course) => <CourseCard key={course.id} course={course} />)}
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <section>
          <SectionHeading title="Upcoming deadlines" href="/assignments" linkLabel="View all" />
          <div className="space-y-3">
            {upcoming.map((assignment) => (
              <AssignmentStatusCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        </section>
        <section>
          <SectionHeading title="Recent announcements" href="/announcements" linkLabel="View all" />
          <AnnouncementsFeed announcements={workspace.announcements.slice(0, 3)} />
        </section>
      </div>
    </div>
  );
}

function DashboardGreeting({
  title,
  description,
  role,
}: Readonly<{ title: string; description: string; role: string }>) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="font-serif text-2xl text-[#16233F]">{title}</h2>
        <p className="mt-1 text-sm text-[#6B7280]">{description}</p>
      </div>
      <div className="space-y-2">
        <p className="text-right text-xs font-semibold text-[#806817]">{role} · Demo mode</p>
        <DemoRoleSwitcher variant="tabs" className="w-full sm:w-[23rem]" />
      </div>
    </div>
  );
}

function SectionHeading({
  title,
  href,
  linkLabel,
}: Readonly<{ title: string; href: "/courses" | "/assignments" | "/announcements"; linkLabel: string }>) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="font-serif text-lg text-[#16233F]">{title}</h2>
      <Link href={href} className="text-sm text-[#2F4470] hover:underline">
        {linkLabel}
      </Link>
    </div>
  );
}

export default RoleDashboard;