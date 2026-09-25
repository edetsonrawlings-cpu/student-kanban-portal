"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Maximize2, Menu, Minimize2, Search, X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { DemoAccountSwitcher, DemoRoleSwitcher } from "@/components/portals/DemoRoleSwitcher";
import { getPageTitle } from "@/lib/nav";
import { getTasksServerSnapshot, getTasksSnapshot, subscribeToTasks } from "@/lib/task-store";
import { useDemoCourses, useTeachingCourses } from "@/lib/use-demo-courses";
import { useDemoProfile } from "@/lib/use-demo-profile";
import { useDemoWorkspace } from "@/lib/use-demo-workspace";

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const profile = useDemoProfile();
  const courses = useDemoCourses();
  const teachingCourses = useTeachingCourses();
  const workspace = useDemoWorkspace();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);
  const tasks = useSyncExternalStore(subscribeToTasks, getTasksSnapshot, getTasksServerSnapshot);
  const searchTerm = query.trim().toLowerCase();
  const searchableCourses = profile.role === "TEACHER"
    ? teachingCourses
    : courses;
  const searchableCourseCodes = new Set(searchableCourses.map((course) => course.code));
  const searchableAssignments = profile.role === "ADMIN"
    ? []
    : workspace.assignments.filter((assignment) => searchableCourseCodes.has(assignment.courseCode));
  const searchableTasks = profile.role === "STUDENT" ? tasks : [];
  const results: { id: string; label: string; href: Route }[] = searchTerm ? [
    ...searchableCourses
      .filter((course) => `${course.code} ${course.title}`.toLowerCase().includes(searchTerm))
      .map((course) => ({
        id: `course-${course.id}`,
        label: `${course.code} - ${course.title}`,
        href: `/courses/${course.id}` as Route,
      })),
    ...searchableAssignments
      .filter((assignment) => `${assignment.courseCode} ${assignment.title}`.toLowerCase().includes(searchTerm))
      .flatMap((assignment) => {
        const course = courses.find((item) => item.code === assignment.courseCode);
        return course ? [{
          id: `assignment-${assignment.id}`,
          label: `${assignment.courseCode} - ${assignment.title}`,
          href: `/courses/${course.id}` as Route,
        }] : [];
      }),
    ...searchableTasks
      .filter((task) => `${task.courseCode} ${task.title}`.toLowerCase().includes(searchTerm))
      .map((task) => ({
        id: `task-${task.id}`,
        label: `${task.courseCode} - ${task.title}`,
        href: `/assignments#task-${task.id}` as Route,
      })),
  ] : [];

  // Close the drawer when the route changes (including via the back button).
  // Adjusting state during render is the supported alternative to an effect.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setDrawerOpen(false);
    setSearchOpen(false);
    setQuery("");
  }

  // Close the drawer on Escape.
  useEffect(() => {
    if (!drawerOpen && !searchOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen, searchOpen]);

  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        delete document.documentElement.dataset.presentation;
        setPresentationMode(false);
      }
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      delete document.documentElement.dataset.presentation;
    };
  }, []);

  const togglePresentationMode = async () => {
    if (presentationMode) {
      delete document.documentElement.dataset.presentation;
      setPresentationMode(false);
      if (document.fullscreenElement) await document.exitFullscreen();
      return;
    }

    document.documentElement.dataset.presentation = "true";
    setPresentationMode(true);
    if (document.fullscreenEnabled) {
      await document.documentElement.requestFullscreen().catch(() => undefined);
    }
  };

  return (
    <>
      <header className="portal-topbar flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-[#E4E2DA] bg-white px-4 py-3 sm:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
            className="portal-menu-trigger rounded-md p-2 text-[#6B7280] hover:bg-[#FAFAF8] lg:hidden"
          >
            <Menu size={20} strokeWidth={1.75} />
          </button>
          <h1 className="truncate font-serif text-xl text-[#16233F]">{getPageTitle(pathname)}</h1>
        </div>

        <div className="flex w-full min-w-0 flex-wrap items-center justify-end gap-2 sm:w-auto sm:flex-1 sm:flex-nowrap sm:gap-4">
          <form
            role="search"
            className="portal-search order-last flex basis-full relative min-w-0 flex-1 items-center gap-2 rounded-md border border-[#E4E2DA] bg-[#FAFAF8] px-3 py-1.5 text-sm text-[#6B7280] sm:order-none sm:basis-auto sm:max-w-sm"
            onSubmit={(event) => {
              event.preventDefault();
              if (results[0]) {
                router.push(results[0].href);
                setSearchOpen(false);
                setQuery("");
              }
            }}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setSearchOpen(false);
            }}
          >
            <Search size={16} strokeWidth={1.75} aria-hidden />
            <label htmlFor="portal-search" className="sr-only">
              Search courses and assignments
            </label>
            <input
              id="portal-search"
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              aria-controls={searchOpen && searchTerm ? "portal-search-results" : undefined}
              placeholder="Search courses, assignments…"
              className="w-full min-w-0 bg-transparent outline-none placeholder:text-[#9CA3AF]"
            />
            {searchOpen && searchTerm && (
              <div id="portal-search-results" className="absolute inset-x-0 top-full z-40 mt-2 max-h-80 overflow-y-auto rounded-md border border-[#E4E2DA] bg-white p-2 shadow-lg">
                <output className="block px-2 py-1 text-xs text-[#6B7280]">
                  {results.length ? `${results.length} results` : "No results found."}
                </output>
                <ul>
                  {results.map((result) => (
                    <li key={result.id}>
                      <Link href={result.href} onClick={() => { setSearchOpen(false); setQuery(""); }} className="block rounded-md px-2 py-2 text-[#16233F] hover:bg-[#FAFAF8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2F4470] [overflow-wrap:anywhere]">
                        {result.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </form>
          <DemoRoleSwitcher onRoleChange={() => setDrawerOpen(false)} />
          <DemoAccountSwitcher role={profile.role} />
          <Link
            href="/announcements"
            aria-label="Notifications"
            title="Notifications"
            className="relative rounded-md p-2 text-[#6B7280] hover:bg-[#FAFAF8]"
          >
            <Bell size={19} strokeWidth={1.75} />
            <span aria-hidden className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#B8563F]" />
          </Link>
          <button
            type="button"
            aria-label={presentationMode ? "Exit presentation mode" : "Enter presentation mode"}
            aria-pressed={presentationMode}
            title={presentationMode ? "Exit presentation mode" : "Enter presentation mode"}
            onClick={togglePresentationMode}
            className="rounded-md p-2 text-[#6B7280] hover:bg-[#FAFAF8]"
          >
            {presentationMode ? (
              <Minimize2 size={19} strokeWidth={1.75} />
            ) : (
              <Maximize2 size={19} strokeWidth={1.75} />
            )}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 h-full w-full bg-[#0F1B33]/60"
          />
          <div className="absolute inset-y-0 left-0 flex">
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setDrawerOpen(false)}
              className="m-2 h-9 w-9 rounded-md bg-white/10 text-white"
            >
              <X size={18} strokeWidth={1.75} className="mx-auto" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Topbar;
