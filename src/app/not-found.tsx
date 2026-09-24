import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FAFAF8] px-6 text-center text-[#16233F]">
      <p className="font-mono text-sm tracking-widest text-[#C9A227]">404</p>
      <h1 className="font-serif text-3xl">This page isn&apos;t in the catalogue</h1>
      <p className="max-w-md text-sm text-[#6B7280]">
        The page you were looking for may have been moved, or the link is out of date.
      </p>
      <Link
        href="/dashboard"
        className="mt-2 rounded-md bg-[#16233F] px-4 py-2 text-sm text-white hover:bg-[#0F1B33]"
      >
        Back to the dashboard
      </Link>
    </main>
  );
}
