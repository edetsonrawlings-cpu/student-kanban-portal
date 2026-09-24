"use client";

import { Printer } from "lucide-react";

/** The browser print dialog also offers "Save as PDF", so one action covers both. */
export function ReceiptActions() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex items-center gap-1.5 rounded-md bg-[#16233F] px-3 py-1.5 text-sm text-white hover:bg-[#0F1B33] print:hidden"
    >
      <Printer size={15} strokeWidth={1.75} aria-hidden />
      Print / Save as PDF
    </button>
  );
}

export default ReceiptActions;
