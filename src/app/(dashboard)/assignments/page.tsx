import type { Metadata } from "next";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "Assignments" };

export default function AssignmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Kanban Board"
        description="Drag a card between columns, or use the arrow buttons. Your board is saved in this browser."
      />
      <KanbanBoard />
    </div>
  );
}
