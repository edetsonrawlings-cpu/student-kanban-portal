"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * `false` during server rendering and during the hydration render, `true`
 * afterwards. Use it to gate anything that reads the current time or the
 * browser environment, so the two renders produce identical markup.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}
