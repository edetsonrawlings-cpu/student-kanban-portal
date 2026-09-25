import type { Metadata } from "next";
import { RoleAnnouncements } from "@/components/portals/RoleAnnouncements";

export const metadata: Metadata = { title: "Announcements" };

export default function AnnouncementsPage() {
  return <RoleAnnouncements />;
}
