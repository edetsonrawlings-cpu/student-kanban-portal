import type { Metadata } from "next";
import { RoleAssignments } from "@/components/portals/RoleAssignments";

export const metadata: Metadata = { title: "Assignments" };

export default function AssignmentsPage() {
  return <RoleAssignments />;
}
