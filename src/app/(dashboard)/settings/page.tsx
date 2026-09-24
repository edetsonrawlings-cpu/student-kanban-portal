import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { currentStudent } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Settings" };

const fields = [
  { label: "Full name", value: currentStudent.name },
  { label: "Student ID", value: currentStudent.studentId },
  { label: "Program", value: currentStudent.program },
  { label: "Term", value: currentStudent.term },
  { label: "Role", value: currentStudent.role },
];

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Settings" description="Your account details and portal preferences." />

      <dl className="divide-y divide-[#E4E2DA] rounded-xl border border-[#E4E2DA] bg-white">
        {fields.map((field) => (
          <div key={field.label} className="flex flex-wrap justify-between gap-2 px-5 py-4">
            <dt className="text-sm text-[#6B7280]">{field.label}</dt>
            <dd className="text-sm font-medium text-[#16233F]">{field.value}</dd>
          </div>
        ))}
      </dl>

      <p className="rounded-xl border border-dashed border-[#E4E2DA] bg-white px-5 py-4 text-sm text-[#6B7280]">
        Editing your profile requires authentication, which is not wired up yet. See the
        &ldquo;Roadmap&rdquo; section of the README.
      </p>
    </div>
  );
}
