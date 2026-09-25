import type { Metadata } from "next";
import { RoleSettings } from "@/components/portals/RoleSettings";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return <RoleSettings />;
}
