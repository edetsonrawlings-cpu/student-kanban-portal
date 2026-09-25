"use client";

import { useState } from "react";
import { CheckCircle2, Pencil, RotateCcw, Save, X } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { resetActiveAccounts } from "@/lib/demo-account-store";
import { resetDemoProfiles, updateDemoProfile } from "@/lib/demo-profile-store";
import { resetDemoWorkspace, updateDemoWorkspace } from "@/lib/demo-workspace-store";
import { resetKanbanLimits } from "@/lib/kanban-limit-store";
import { DEMO_TEACHER_USER_ID } from "@/lib/mock-data";
import { resetTasks } from "@/lib/task-store";
import { useActiveTeacher } from "@/lib/use-active-teacher";
import { useDemoProfile } from "@/lib/use-demo-profile";
import type { DemoProfile } from "@/types";

export function RoleSettings() {
  const profile = useDemoProfile();
  const { teacherId } = useActiveTeacher();
  const [resetDone, setResetDone] = useState(false);
  const identifierLabel = {
    STUDENT: "Student ID",
    TEACHER: "Faculty ID",
    ADMIN: "Staff ID",
  }[profile.role];
  const fields = [
    { label: "Full name", value: profile.name },
    { label: "Email", value: profile.email },
    { label: identifierLabel, value: profile.identifier },
    { label: "Affiliation", value: profile.affiliation },
    { label: "Term", value: profile.term },
    { label: "Demo role", value: profile.role },
  ];

  const handleReset = () => {
    resetDemoWorkspace();
    resetDemoProfiles();
    resetActiveAccounts();
    resetTasks();
    resetKanbanLimits();
    setResetDone(true);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title="Settings"
        description="Active demo profile and local portal preferences."
      />

      {profile.role === "TEACHER" ? (
        <TeacherProfileEditor key={teacherId} profile={profile} teacherId={teacherId} />
      ) : (
        <dl className="divide-y divide-[#E4E2DA] rounded-lg border border-[#E4E2DA] bg-white">
          {fields.map((field) => (
            <div key={field.label} className="flex flex-wrap justify-between gap-2 px-5 py-4">
              <dt className="text-sm text-[#6B7280]">{field.label}</dt>
              <dd className="text-sm font-medium text-[#16233F]">{field.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <section className="rounded-lg border border-[#E4E2DA] bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-lg text-[#16233F]">Reset demo data</h2>
            <p className="mt-1 max-w-xl text-sm text-[#6B7280]">
              Restore seeded assignments, grades, announcements, users, Kanban cards, and column limits before a new presentation.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-md border border-[#E4E2DA] px-3 py-2 text-sm font-semibold text-[#16233F] hover:bg-[#FAFAF8]"
          >
            {resetDone ? <CheckCircle2 size={16} className="text-emerald-600" aria-hidden /> : <RotateCcw size={16} aria-hidden />}
            {resetDone ? "Demo data reset" : "Reset local data"}
          </button>
        </div>
      </section>

      <p className="rounded-lg border border-dashed border-[#D6CFAE] bg-[#FFFDF5] px-5 py-4 text-sm text-[#6B5B24]">
        The role selector simulates three portal experiences in one browser. It does not create a
        login session or enforce server-side permissions.
      </p>
    </div>
  );
}

function TeacherProfileEditor({
  profile,
  teacherId,
}: Readonly<{ profile: DemoProfile; teacherId: string }>) {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [identifier, setIdentifier] = useState(profile.identifier);
  const [affiliation, setAffiliation] = useState(profile.affiliation);

  const cancelEditing = () => {
    setName(profile.name);
    setEmail(profile.email);
    setIdentifier(profile.identifier);
    setAffiliation(profile.affiliation);
    setEditing(false);
  };

  const handleSave = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextProfile = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      identifier: identifier.trim().toUpperCase(),
      affiliation: affiliation.trim(),
    };
    if (Object.values(nextProfile).some((value) => !value)) return;

    if (teacherId === DEMO_TEACHER_USER_ID) updateDemoProfile("TEACHER", nextProfile);
    updateDemoWorkspace((current) => ({
      ...current,
      announcements: current.announcements.map((announcement) =>
        announcement.author === profile.name
          ? { ...announcement, author: nextProfile.name }
          : announcement
      ),
      users: current.users.map((user) =>
        user.id === teacherId
          ? {
              ...user,
              name: nextProfile.name,
              email: nextProfile.email,
              identifier: nextProfile.identifier,
              department: nextProfile.affiliation,
            }
          : user
      ),
    }));
    setEditing(false);
    setSaved(true);
  };

  return (
    <section className="overflow-hidden rounded-lg border border-[#E4E2DA] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E4E2DA] px-5 py-4">
        <div>
          <h2 className="font-serif text-lg text-[#16233F]">Teacher profile</h2>
          <p className="text-xs text-[#6B7280]">Changes are saved locally across every portal.</p>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={() => {
              setName(profile.name);
              setEmail(profile.email);
              setIdentifier(profile.identifier);
              setAffiliation(profile.affiliation);
              setSaved(false);
              setEditing(true);
            }}
            className="inline-flex items-center gap-2 rounded-md border border-[#E4E2DA] px-3 py-2 text-sm font-semibold text-[#16233F] hover:bg-[#FAFAF8]"
          >
            <Pencil size={15} aria-hidden />
            Edit profile
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          <ProfileField label="Full name" htmlFor="teacher-name">
            <input
              id="teacher-name"
              required
              maxLength={80}
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="field-input"
            />
          </ProfileField>
          <ProfileField label="Email" htmlFor="teacher-email">
            <input
              id="teacher-email"
              type="email"
              required
              maxLength={120}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="field-input"
            />
          </ProfileField>
          <ProfileField label="Faculty ID" htmlFor="teacher-identifier">
            <input
              id="teacher-identifier"
              required
              maxLength={30}
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              className="field-input"
            />
          </ProfileField>
          <ProfileField label="Affiliation" htmlFor="teacher-affiliation">
            <input
              id="teacher-affiliation"
              required
              maxLength={100}
              value={affiliation}
              onChange={(event) => setAffiliation(event.target.value)}
              className="field-input"
            />
          </ProfileField>
          <div className="sm:col-span-2">
            <p className="text-xs font-medium text-[#6B7280]">Term</p>
            <p className="mt-1 rounded-md bg-[#FAFAF8] px-3 py-2 text-sm text-[#16233F]">{profile.term}</p>
          </div>
          <div className="flex justify-end gap-2 sm:col-span-2">
            <button
              type="button"
              onClick={cancelEditing}
              className="inline-flex items-center gap-2 rounded-md border border-[#E4E2DA] px-3 py-2 text-sm font-semibold text-[#6B7280] hover:bg-[#FAFAF8]"
            >
              <X size={15} aria-hidden />
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-[#16233F] px-3 py-2 text-sm font-semibold text-white hover:bg-[#0F1B33]"
            >
              <Save size={15} aria-hidden />
              Save changes
            </button>
          </div>
        </form>
      ) : (
        <dl className="divide-y divide-[#E4E2DA]">
          {[
            { label: "Full name", value: profile.name },
            { label: "Email", value: profile.email },
            { label: "Faculty ID", value: profile.identifier },
            { label: "Affiliation", value: profile.affiliation },
            { label: "Term", value: profile.term },
          ].map((field) => (
            <div key={field.label} className="flex flex-wrap justify-between gap-2 px-5 py-4">
              <dt className="text-sm text-[#6B7280]">{field.label}</dt>
              <dd className="text-sm font-medium text-[#16233F]">{field.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {saved && !editing && (
        <output className="flex items-center gap-2 border-t border-emerald-100 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 size={16} aria-hidden />
          Teacher information updated across the demo portals.
        </output>
      )}
    </section>
  );
}

function ProfileField({
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

export default RoleSettings;