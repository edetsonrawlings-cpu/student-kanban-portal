"use client";

import { useSyncExternalStore } from "react";
import {
  getDemoWorkspaceServerSnapshot,
  getDemoWorkspaceSnapshot,
  subscribeToDemoWorkspace,
} from "@/lib/demo-workspace-store";
import type { DemoWorkspace } from "@/types";

export function useDemoWorkspace(): DemoWorkspace {
  return useSyncExternalStore(
    subscribeToDemoWorkspace,
    getDemoWorkspaceSnapshot,
    getDemoWorkspaceServerSnapshot
  );
}