import type { Metadata } from "next";
import { RoleGradebook } from "@/components/portals/RoleGradebook";

export const metadata: Metadata = { title: "Gradebook" };

export default function GradebookPage() {
  return <RoleGradebook />;
}
