"use client";

import { useDeferredValue, useState } from "react";
import { BookOpen, CheckCircle2, Pencil, Search, ShieldAlert, UserCheck, UserRoundPlus, UsersRound, X } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { AdminCourseManager } from "@/components/portals/AdminCourseManager";
import { setActiveAccountId } from "@/lib/demo-account-store";
import { updateDemoWorkspace } from "@/lib/demo-workspace-store";
import { useActiveAccount } from "@/lib/use-active-account";
import { useDemoCourses } from "@/lib/use-demo-courses";
import { useDemoProfile } from "@/lib/use-demo-profile";
import { useDemoWorkspace } from "@/lib/use-demo-workspace";
import type { Role } from "@/types";

const ROLE_LABELS: Record<Role, string> = {
  STUDENT: "Student",
  TEACHER: "Teacher",
  ADMIN: "Administrator",
};

const IDENTIFIER_LABELS: Record<Role, string> = {
  STUDENT: "Student ID",
  TEACHER: "Faculty ID",
  ADMIN: "Staff ID",
};

const IDENTIFIER_PLACEHOLDERS: Record<Role, string> = {
  STUDENT: "STU-2026-100",
  TEACHER: "FAC-2026-100",
  ADMIN: "Optional",
};

export function AdminWorkspace() {
  const profile = useDemoProfile();
  const { accountId: activeAdminId } = useActiveAccount("ADMIN");
  const workspace = useDemoWorkspace();
  const courses = useDemoCourses();
  const [formOpen, setFormOpen] = useState(false);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const [roleFilter, setRoleFilter] = useState<Role | "">("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState<Role>("STUDENT");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingEmail, setEditingEmail] = useState("");
  const [editingIdentifier, setEditingIdentifier] = useState("");
  const [editingDepartment, setEditingDepartment] = useState("");
  const [editError, setEditError] = useState("");

  if (profile.role !== "ADMIN") {
    return (
      <div className="space-y-6">
        <PageHeader title="Administration" description="This workspace is shown in the Administrator demo portal." />
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <ShieldAlert size={19} className="mt-0.5 shrink-0" aria-hidden />
          <p>
            Choose <strong>Administrator</strong> in the role selector to demonstrate this interface.
            This local switch changes the UI only; it is intentionally not real authentication.
          </p>
        </div>
      </div>
    );
  }

  const activeUsers = workspace.users.filter((user) => user.status === "ACTIVE").length;
  const suspendedUsers = workspace.users.length - activeUsers;
  const students = workspace.users.filter((user) => user.role === "STUDENT").length;
  const teachers = workspace.users.filter((user) => user.role === "TEACHER").length;
  const filteredUsers = workspace.users.filter((user) => {
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesQuery = !deferredQuery
      || `${user.name} ${user.email} ${user.department}`.toLowerCase().includes(deferredQuery);
    return matchesRole && matchesQuery;
  });

  const handleCreate = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedIdentifier = identifier.trim().toUpperCase();
    const trimmedDepartment = department.trim();
    if (!trimmedName || !trimmedEmail || !trimmedDepartment) return;
    if (role !== "ADMIN" && !trimmedIdentifier) {
      setFormError(role === "TEACHER"
        ? "A faculty ID is required for a professor."
        : "A student ID is required for a student.");
      return;
    }
    if (workspace.users.some((user) => user.email.toLowerCase() === trimmedEmail)) {
      setFormError("This email address already belongs to a portal user.");
      return;
    }
    if (
      trimmedIdentifier
      && workspace.users.some((user) => user.identifier?.toUpperCase() === trimmedIdentifier)
    ) {
      setFormError("This faculty or user ID already exists.");
      return;
    }

    const userId = `user-${crypto.randomUUID()}`;

    updateDemoWorkspace((current) => ({
      ...current,
      users: [
        ...current.users,
        {
          id: userId,
          name: trimmedName,
          email: trimmedEmail,
          identifier: trimmedIdentifier || undefined,
          department: trimmedDepartment,
          role,
          status: "ACTIVE",
        },
      ],
      teacherGrades: role === "STUDENT"
        ? [
            ...current.teacherGrades,
            ...current.courses.map((course) => ({
              id: `grade-${crypto.randomUUID()}`,
              studentId: trimmedIdentifier || userId,
              studentName: trimmedName,
              courseCode: course.code,
              percentage: null,
            })),
          ]
        : current.teacherGrades,
    }));
    setActiveAccountId(role, userId);
    setName("");
    setEmail("");
    setIdentifier("");
    setDepartment("");
    setRole("STUDENT");
    setFormError("");
    setFormSuccess(`${trimmedName} added as ${ROLE_LABELS[role].toLowerCase()}.`);
    setFormOpen(false);
  };

  const beginStudentEdit = (userId: string) => {
    const user = workspace.users.find((item) => item.id === userId && item.role !== "ADMIN");
    if (!user) return;
    setEditingStudentId(user.id);
    setEditingName(user.name);
    setEditingEmail(user.email);
    setEditingIdentifier(user.identifier ?? "");
    setEditingDepartment(user.department);
    setEditError("");
  };

  const cancelStudentEdit = () => {
    setEditingStudentId(null);
    setEditError("");
  };

  const saveStudentEdit = () => {
    if (!editingStudentId) return;
    const editingUser = workspace.users.find((user) => user.id === editingStudentId);
    const trimmedName = editingName.trim();
    const trimmedEmail = editingEmail.trim().toLowerCase();
    const trimmedIdentifier = editingIdentifier.trim().toUpperCase();
    const trimmedDepartment = editingDepartment.trim();
    if (!trimmedName || !trimmedEmail || !trimmedIdentifier || !trimmedDepartment) {
      setEditError("All profile fields are required.");
      return;
    }
    const duplicateEmail = workspace.users.some(
      (user) => user.id !== editingStudentId && user.email.toLowerCase() === trimmedEmail
    );
    if (duplicateEmail) {
      setEditError("This email address already belongs to another account.");
      return;
    }
    const duplicateIdentifier = workspace.users.some(
      (user) => user.id !== editingStudentId && user.identifier?.toUpperCase() === trimmedIdentifier
    );
    if (duplicateIdentifier) {
      setEditError("This student ID already exists.");
      return;
    }

    updateDemoWorkspace((current) => {
      const student = current.users.find((user) => user.id === editingStudentId);
      const previousIdentifier = student?.identifier ?? student?.id ?? editingStudentId;

      return {
        ...current,
        users: current.users.map((user) =>
          user.id === editingStudentId
            ? {
                ...user,
                name: trimmedName,
                email: trimmedEmail,
                identifier: trimmedIdentifier,
                department: trimmedDepartment,
              }
            : user
        ),
        teacherGrades: current.teacherGrades.map((grade) =>
          grade.studentId === previousIdentifier
            ? {
                ...grade,
                studentId: trimmedIdentifier,
                studentName: trimmedName,
              }
            : grade
        ),
      };
    });

    setFormSuccess(`${trimmedName} ${editingUser?.role === "TEACHER" ? "teacher" : "student"} profile updated.`);
    setEditingStudentId(null);
    setEditError("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administration"
        description="Manage the local demo directory and monitor portal access."
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setRole("TEACHER");
                setFormError("");
                setFormSuccess("");
                setFormOpen((open) => !open);
              }}
              aria-expanded={formOpen}
              className="inline-flex items-center gap-2 rounded-md bg-[#16233F] px-3 py-2 text-sm font-medium text-white hover:bg-[#0F1B33]"
            >
              <UserRoundPlus size={16} aria-hidden />
              Add professor
            </button>
            <button
              type="button"
              onClick={() => {
                setRole("STUDENT");
                setFormError("");
                setFormSuccess("");
                setFormOpen((open) => !open);
              }}
              aria-expanded={formOpen}
              className="inline-flex items-center gap-2 rounded-md border border-[#E4E2DA] bg-white px-3 py-2 text-sm font-medium text-[#16233F] hover:bg-[#FAFAF8]"
            >
              <UsersRound size={16} aria-hidden />
              Add student
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Active users" value={String(activeUsers)} icon={UserCheck} />
        <SummaryCard label="Students" value={String(students)} icon={UsersRound} accent="#4B7A6F" />
        <SummaryCard label="Teachers" value={String(teachers)} icon={UserRoundPlus} accent="#2F4470" />
        <SummaryCard label="Courses" value={String(courses.length)} icon={BookOpen} accent="#C9A227" />
        <SummaryCard label="Suspended" value={String(suspendedUsers)} icon={ShieldAlert} accent="#B8563F" />
      </div>

      {formOpen && (
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 gap-4 rounded-lg border border-[#E4E2DA] bg-white p-5 md:grid-cols-2 xl:grid-cols-[1.1fr_1.4fr_1fr_1.1fr_1fr_auto]"
        >
          <AdminField label="Full name" htmlFor="admin-user-name">
            <input id="admin-user-name" required value={name} onChange={(event) => setName(event.target.value)} className="field-input" />
          </AdminField>
          <AdminField label="Email" htmlFor="admin-user-email">
            <input id="admin-user-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="field-input" />
          </AdminField>
          <AdminField
            label={IDENTIFIER_LABELS[role]}
            htmlFor="admin-user-identifier"
          >
            <input
              id="admin-user-identifier"
              required={role !== "ADMIN"}
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder={IDENTIFIER_PLACEHOLDERS[role]}
              className="field-input uppercase"
            />
          </AdminField>
          <AdminField label="Department" htmlFor="admin-user-department">
            <input id="admin-user-department" required value={department} onChange={(event) => setDepartment(event.target.value)} className="field-input" />
          </AdminField>
          <AdminField label="Role" htmlFor="admin-user-role">
            <select id="admin-user-role" value={role} onChange={(event) => setRole(event.target.value as Role)} className="field-input">
              {Object.entries(ROLE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </AdminField>
          <button type="submit" className="self-end rounded-md bg-[#C9A227] px-4 py-2 text-sm font-semibold text-[#0F1B33]">
            Create
          </button>
          {formError && <p role="alert" className="text-sm font-medium text-red-700 md:col-span-2 xl:col-span-6">{formError}</p>}
        </form>
      )}

      {formSuccess && (
        <output className="flex items-center gap-2 rounded-md border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 size={16} aria-hidden />
          {formSuccess}
        </output>
      )}

      <AdminCourseManager />

      <section className="overflow-hidden rounded-lg border border-[#E4E2DA] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#E4E2DA] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-lg text-[#16233F]">User directory</h2>
            <p className="text-xs text-[#6B7280]">{filteredUsers.length} matching account(s)</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative">
              <span className="sr-only">Search users</span>
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search users"
                className="w-full rounded-md border border-[#E4E2DA] py-2 pl-9 pr-3 text-sm outline-none focus:border-[#2F4470] sm:w-56"
              />
            </label>
            <label>
              <span className="sr-only">Filter by role</span>
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value as Role | "")}
                className="w-full rounded-md border border-[#E4E2DA] bg-white px-3 py-2 text-sm text-[#16233F] outline-none focus:border-[#2F4470] sm:w-auto"
              >
                <option value="">All roles</option>
                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[48rem] text-left text-sm text-[#6B7280]">
            <caption className="sr-only">Portal user directory</caption>
            <thead className="border-b border-[#E4E2DA] bg-[#FAFAF8] text-xs uppercase">
              <tr>
                <th scope="col" className="p-4">User</th>
                <th scope="col" className="p-4">Department</th>
                <th scope="col" className="p-4">Role</th>
                <th scope="col" className="p-4">Status</th>
                <th scope="col" className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E2DA]">
              {filteredUsers.map((user) => {
                const isCurrentDemoAdmin = user.id === activeAdminId;
                return (
                  <tr key={user.id}>
                    <td className="p-4">
                      {editingStudentId === user.id ? (
                        <div className="space-y-2">
                          <input
                            value={editingName}
                            onChange={(event) => setEditingName(event.target.value)}
                            className="field-input py-1.5 text-sm"
                            aria-label="Profile full name"
                          />
                          <input
                            type="email"
                            value={editingEmail}
                            onChange={(event) => setEditingEmail(event.target.value)}
                            className="field-input py-1.5 text-xs"
                            aria-label="Profile email"
                          />
                          <input
                            value={editingIdentifier}
                            onChange={(event) => setEditingIdentifier(event.target.value)}
                            className="field-input py-1.5 font-mono text-xs uppercase"
                            aria-label="Profile identifier"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="font-medium text-[#16233F]">{user.name}</p>
                          <p className="text-xs">
                            {user.email}{user.identifier ? ` · ${user.identifier}` : ""}
                          </p>
                        </>
                      )}
                    </td>
                    <td className="p-4">
                      {editingStudentId === user.id ? (
                        <input
                          value={editingDepartment}
                          onChange={(event) => setEditingDepartment(event.target.value)}
                          className="field-input py-1.5 text-sm"
                          aria-label="Profile department"
                        />
                      ) : user.department}
                    </td>
                    <td className="p-4">{ROLE_LABELS[user.role]}</td>
                    <td className="p-4">
                      <span className={user.status === "ACTIVE"
                        ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                        : "rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700"
                      }>
                        {user.status === "ACTIVE" ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {user.role !== "ADMIN" && (
                          editingStudentId === user.id ? (
                            <>
                              <button
                                type="button"
                                onClick={saveStudentEdit}
                                className="rounded-md bg-[#16233F] px-3 py-1.5 text-xs font-semibold text-white"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={cancelStudentEdit}
                                className="rounded-md border border-[#E4E2DA] px-2 py-1.5 text-xs font-semibold text-[#6B7280]"
                                aria-label="Cancel student edit"
                              >
                                <X size={14} aria-hidden />
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => beginStudentEdit(user.id)}
                              className="rounded-md border border-[#E4E2DA] px-2 py-1.5 text-xs font-semibold text-[#16233F] hover:bg-[#FAFAF8]"
                              aria-label={`Edit ${user.name}`}
                            >
                              <Pencil size={13} aria-hidden />
                            </button>
                          )
                        )}
                        <button
                          type="button"
                          disabled={isCurrentDemoAdmin || editingStudentId === user.id}
                          title={isCurrentDemoAdmin ? "Current demo administrator" : undefined}
                          onClick={() => updateDemoWorkspace((current) => ({
                            ...current,
                            users: current.users.map((item) => item.id === user.id
                              ? { ...item, status: item.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" }
                              : item),
                          }))}
                          className="rounded-md border border-[#E4E2DA] px-3 py-1.5 text-xs font-semibold text-[#16233F] hover:bg-[#FAFAF8] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {user.status === "ACTIVE" ? "Suspend" : "Reactivate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {editError && <p role="alert" className="border-t border-[#F3D0D0] bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{editError}</p>}
      </section>

      <p className="rounded-lg border border-dashed border-[#D6CFAE] bg-[#FFFDF5] px-5 py-4 text-sm text-[#6B5B24]">
        Demo mode: these controls update local browser data. Real authorization must be enforced on
        the server before this interface is connected to production accounts.
      </p>
    </div>
  );
}

function AdminField({
  label,
  htmlFor,
  children,
}: Readonly<{ label: string; htmlFor: string; children: React.ReactNode }>) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-xs font-medium text-[#6B7280]">{label}</label>
      {children}
    </div>
  );
}

export default AdminWorkspace;