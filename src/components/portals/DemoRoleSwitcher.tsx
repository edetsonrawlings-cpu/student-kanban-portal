"use client";

import { useId } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Presentation, ShieldCheck, UserRoundCog } from "lucide-react";
import { setActiveAccountId } from "@/lib/demo-account-store";
import { setDemoRole } from "@/lib/demo-role-store";
import { useActiveAccount } from "@/lib/use-active-account";
import { useDemoProfile } from "@/lib/use-demo-profile";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

const ROLE_OPTIONS: { role: Role; label: string; icon: typeof GraduationCap }[] = [
  { role: "STUDENT", label: "Student", icon: GraduationCap },
  { role: "TEACHER", label: "Teacher", icon: Presentation },
  { role: "ADMIN", label: "Administrator", icon: ShieldCheck },
];

interface DemoRoleSwitcherProps {
  variant?: "select" | "tabs";
  className?: string;
  onRoleChange?: () => void;
}

export function DemoRoleSwitcher({
  variant = "select",
  className,
  onRoleChange,
}: Readonly<DemoRoleSwitcherProps>) {
  const selectId = useId();
  const router = useRouter();
  const profile = useDemoProfile();

  const selectRole = (role: Role) => {
    setDemoRole(role);
    onRoleChange?.();
    router.push("/dashboard");
  };

  if (variant === "tabs") {
    return (
      <fieldset
        className={cn(
          "grid grid-cols-3 gap-1 rounded-md border border-[#E4E2DA] bg-white p-1",
          className
        )}
      >
        <legend className="sr-only">Switch demo dashboard</legend>
        {ROLE_OPTIONS.map(({ role, label, icon: Icon }) => {
          const active = profile.role === role;
          return (
            <button
              key={role}
              type="button"
              aria-pressed={active}
              onClick={() => selectRole(role)}
              className={cn(
                "flex min-h-9 items-center justify-center gap-1.5 rounded px-2 text-xs font-semibold transition-colors sm:text-sm",
                active
                  ? "bg-[#16233F] text-white"
                  : "text-[#6B7280] hover:bg-[#FAFAF8] hover:text-[#16233F]"
              )}
            >
              <Icon size={15} strokeWidth={1.75} aria-hidden />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{role === "ADMIN" ? "Admin" : label}</span>
            </button>
          );
        })}
      </fieldset>
    );
  }

  return (
    <div className={cn("flex shrink-0 items-center gap-2 rounded-md border border-[#E4E2DA] bg-white px-2 py-1.5 text-[#6B7280]", className)}>
      <UserRoundCog size={16} strokeWidth={1.75} aria-hidden />
      <label htmlFor={selectId} className="sr-only">
        Demo portal role
      </label>
      <select
        id={selectId}
        value={profile.role}
        onChange={(event) => selectRole(event.target.value as Role)}
        className="max-w-28 bg-transparent text-xs font-semibold text-[#16233F] outline-none sm:max-w-none sm:text-sm"
      >
        {ROLE_OPTIONS.map(({ role, label }) => (
          <option key={role} value={role}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DemoRoleSwitcher;

export function DemoAccountSwitcher({
  role,
  className,
}: Readonly<{ role: Role; className?: string }>) {
  const selectId = useId();
  const { accountId, accounts } = useActiveAccount(role);
  const roleLabels: Record<Role, string> = {
    STUDENT: "student",
    TEACHER: "teacher",
    ADMIN: "administrator",
  };
  const AccountIcon = ROLE_OPTIONS.find((option) => option.role === role)?.icon ?? UserRoundCog;

  if (!accounts.length) return null;

  return (
    <div className={cn("flex shrink-0 items-center gap-2 rounded-md border border-[#E4E2DA] bg-white px-2 py-1.5 text-[#6B7280]", className)}>
      <AccountIcon size={16} strokeWidth={1.75} aria-hidden />
      <label htmlFor={selectId} className="sr-only">Active {roleLabels[role]} account</label>
      <select
        id={selectId}
        value={accountId}
        onChange={(event) => setActiveAccountId(role, event.target.value)}
        className="max-w-36 bg-transparent text-xs font-semibold text-[#16233F] outline-none sm:max-w-48 sm:text-sm"
      >
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>{account.name}</option>
        ))}
      </select>
    </div>
  );
}