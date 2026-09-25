import type { Metadata } from "next";
import { AdminWorkspace } from "@/components/portals/AdminWorkspace";

export const metadata: Metadata = { title: "Admin" };

export default function AdminPage() {
  return <AdminWorkspace />;
}
