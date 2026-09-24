import type { Metadata } from "next";
import NewStudentLanding from "@/components/marketing/NewStudentHero";

export const metadata: Metadata = {
  title: "Student Portal",
  description: "Register or sign in to access your courses, assignments and grades.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <NewStudentLanding />
    </main>
  );
}
