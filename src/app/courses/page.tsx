export default function CoursesPage() {
  const courses = [
    { code: "CS301", name: "Web Development & Agile Methods", instructor: "Dr. Smith", status: "Active" },
    { code: "MATH214", name: "Linear Algebra", instructor: "Prof. Johnson", status: "Active" },
    { code: "ENG110", name: "Academic Writing", instructor: "Dr. Davis", status: "Active" },
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Enrolled Courses</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Overview of your active academic courses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.code} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-full">{course.code}</span>
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">{course.name}</h2>
            <p className="text-xs text-slate-500">{course.instructor}</p>
          </div>
        ))}
      </div>
    </div>
  );
}