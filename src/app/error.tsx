"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FAFAF8] px-6 text-center text-[#16233F]">
      <p className="font-mono text-sm tracking-widest text-[#B8563F]">Error</p>
      <h1 className="font-serif text-3xl">Something went wrong</h1>
      <p className="max-w-md text-sm text-[#6B7280]">
        The portal hit an unexpected problem while rendering this page.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 rounded-md bg-[#16233F] px-4 py-2 text-sm text-white hover:bg-[#0F1B33]"
      >
        Try again
      </button>
    </main>
  );
}
