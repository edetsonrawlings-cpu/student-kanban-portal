import { getPrismaClient } from "../src/lib/prisma";
import {
  currentStudent,
  mockAnnouncements,
  mockAssignments,
  mockCourses,
  mockGrades,
} from "../src/lib/mock-data";
import type { AssignmentStatus } from "../src/types";

/**
 * Seeds the database with the same demo data the UI renders from
 * `src/lib/mock-data.ts`, so switching a page from mock data to Prisma does not
 * change what is on screen.
 *
 * Run with: `npx prisma db seed`
 */

const prisma = getPrismaClient();

const SUBMISSION_STATUS: Record<AssignmentStatus, "NOT_SUBMITTED" | "SUBMITTED" | "LATE" | "GRADED"> =
  {
    not_submitted: "NOT_SUBMITTED",
    submitted: "SUBMITTED",
    late: "LATE",
    graded: "GRADED",
  };

async function main() {
  const student = await prisma.profile.upsert({
    where: { email: "ama.serwaa@example.edu" },
    update: {},
    create: {
      email: "ama.serwaa@example.edu",
      fullName: currentStudent.name,
      role: "STUDENT",
      studentId: currentStudent.studentId,
      bio: currentStudent.program,
    },
  });

  for (const course of mockCourses) {
    const email = `${course.instructor.toLowerCase().replace(/[^a-z]+/g, ".")}@example.edu`;

    const instructor = await prisma.profile.upsert({
      where: { email },
      update: {},
      create: { email, fullName: course.instructor, role: "TEACHER" },
    });

    const record = await prisma.course.upsert({
      where: { code: course.code },
      update: { title: course.title, term: course.term, credits: course.credits },
      create: {
        code: course.code,
        title: course.title,
        term: course.term,
        credits: course.credits,
        coverColor: course.coverColor,
        instructorId: instructor.id,
      },
    });

    await prisma.enrollment.upsert({
      where: { studentId_courseId: { studentId: student.id, courseId: record.id } },
      update: {},
      create: { studentId: student.id, courseId: record.id, status: "ACTIVE" },
    });

    for (const assignment of mockAssignments.filter((a) => a.courseCode === course.code)) {
      const created = await prisma.assignment.create({
        data: {
          courseId: record.id,
          title: assignment.title,
          maxPoints: assignment.maxPoints,
          dueDate: new Date(assignment.dueDate),
        },
      });

      const submission = await prisma.submission.create({
        data: {
          assignmentId: created.id,
          studentId: student.id,
          status: SUBMISSION_STATUS[assignment.status],
          submittedAt: assignment.status === "not_submitted" ? null : new Date(assignment.dueDate),
        },
      });

      if (assignment.status === "graded" && assignment.points !== undefined) {
        await prisma.grade.create({
          data: {
            submissionId: submission.id,
            pointsEarned: assignment.points,
            gradedById: instructor.id,
          },
        });
      }
    }

    for (const announcement of mockAnnouncements.filter((a) => a.courseCode === course.code)) {
      await prisma.announcement.create({
        data: {
          title: announcement.title,
          body: announcement.body,
          audience: "COURSE",
          courseId: record.id,
          authorId: instructor.id,
          createdAt: new Date(announcement.postedAt),
        },
      });
    }
  }

  console.log(
    `Seeded ${mockCourses.length} courses, ${mockAssignments.length} assignments and ${mockGrades.length} grade entries.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
