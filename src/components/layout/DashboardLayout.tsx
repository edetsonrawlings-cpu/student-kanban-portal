import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Portal shell (sidebar + topbar). Rendered once by the `(dashboard)` route
 * group layout, so pages only render their own content. This stays a server
 * component: only `Sidebar` and `Topbar` need client-side interactivity.
 */
export function DashboardLayout({
  children,
}: Readonly<DashboardLayoutProps>) {
  return (
    <div className="flex min-h-screen bg-[#FAFAF8] text-[#16233F]">
      <Sidebar
        className="portal-sidebar hidden h-screen sticky top-0 lg:flex"
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="portal-main flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
