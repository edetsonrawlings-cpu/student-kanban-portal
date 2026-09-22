import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function CoursesPage() {
  const courses = [
    { code: "CS301", name: "Web Development & Agile Methods", instructor: "Dr. Smith", status: "Active" },
    { code: "MATH214", name: "Linear Algebra", instructor: "Prof. Johnson", status: "Active" },
    { code: "ENG110", name: "Academic Writing", instructor: "Dr. Davis", status: "Active" },
  ];

  return (
    <DashboardLayout pageTitle="Courses">
      <div className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl text-[#16233F]">Enrolled Courses</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Overview of your active academic courses.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.code} className="bg-white p-6 rounded-xl border border-[#E4E2DA] shadow-sm space-y-3">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{course.code}</span>
              <h3 className="font-semibold text-[#16233F]">{course.name}</h3>
              <p className="text-xs text-[#6B7280]">{course.instructor}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}