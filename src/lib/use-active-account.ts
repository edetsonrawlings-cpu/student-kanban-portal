"use client";

import { useSyncExternalStore } from "react";
import {
  getActiveAccountsServerSnapshot,
  getActiveAccountsSnapshot,
  subscribeToActiveAccounts,
} from "@/lib/demo-account-store";
import { useDemoWorkspace } from "@/lib/use-demo-workspace";
import type { DemoPortalUser, Role } from "@/types";

interface ActiveAccountState {
  accountId: string;
  account: DemoPortalUser | undefined;
  accounts: DemoPortalUser[];
}

export function useActiveAccount(role: Role): ActiveAccountState {
  const selectedAccounts = useSyncExternalStore(
    subscribeToActiveAccounts,
    getActiveAccountsSnapshot,
    getActiveAccountsServerSnapshot
  );
  const workspace = useDemoWorkspace();
  const accounts = workspace.users.filter(
    (user) => user.role === role && user.status === "ACTIVE"
  );
  const account = accounts.find((user) => user.id === selectedAccounts[role]) ?? accounts[0];

  return {
    accountId: account?.id ?? selectedAccounts[role],
    account,
    accounts,
  };
}