"use client";

import { useActiveAccount } from "@/lib/use-active-account";
import type { DemoPortalUser } from "@/types";

interface ActiveTeacherState {
  teacherId: string;
  teacher: DemoPortalUser | undefined;
  teachers: DemoPortalUser[];
}

export function useActiveTeacher(): ActiveTeacherState {
  const { accountId, account, accounts } = useActiveAccount("TEACHER");

  return {
    teacherId: accountId,
    teacher: account,
    teachers: accounts,
  };
}