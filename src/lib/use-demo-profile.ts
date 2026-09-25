"use client";

import { useSyncExternalStore } from "react";
import {
  getDemoRoleServerSnapshot,
  getDemoRoleSnapshot,
  subscribeToDemoRole,
} from "@/lib/demo-role-store";
import {
  getDemoProfilesServerSnapshot,
  getDemoProfilesSnapshot,
  subscribeToDemoProfiles,
  type DemoProfiles,
} from "@/lib/demo-profile-store";
import { useActiveAccount } from "@/lib/use-active-account";
import type { DemoProfile } from "@/types";

export function useDemoProfiles(): DemoProfiles {
  return useSyncExternalStore(
    subscribeToDemoProfiles,
    getDemoProfilesSnapshot,
    getDemoProfilesServerSnapshot
  );
}

export function useDemoProfile(): DemoProfile {
  const role = useSyncExternalStore(
    subscribeToDemoRole,
    getDemoRoleSnapshot,
    getDemoRoleServerSnapshot
  );
  const profiles = useDemoProfiles();
  const { account } = useActiveAccount(role);

  if (account) {
    return {
      name: account.name,
      email: account.email,
      identifier: account.identifier ?? account.id,
      affiliation: account.department,
      role,
      term: profiles[role].term,
    };
  }

  return profiles[role];
}