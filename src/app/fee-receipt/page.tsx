import {
  Receipt,
  Download,
  Printer,
  CheckCircle2,
  Landmark,
  CalendarDays,
  Hash,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Mock data — swap for a server-side fetch (Prisma / Supabase) once
// billing records are wired up.
const receipt = {
  receiptNo: "RCT-2026-00842",
  issuedOn: "2026-08-10",
  studentName: "Ama Serwaa",
  studentId: "STU-20263301",
  program: "B.Sc. Computer Science — Year 3",
  term: "Fall 2026",
  paymentMethod: "Bank Transfer",
  status: "Paid" as const,
  items: [
    { label: "Tuition Fee", amount: 3200 },
    { label: "Library & Resources Fee", amount: 120 },
    { label: "Technology Fee", amount: 150 },
    { label: "Student Activity Fee", amount: 80 },
    { label: "Examination Fee", amount: 60 },
  ],
  amountPaid: 3610,
  currency: "USD",
};

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
}

export default function FeeReceiptPage() {
  const subtotal = receipt.items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <DashboardLayout role="STUDENT" pageTitle="Fee Receipt">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <Receipt size={16} strokeWidth={1.75} className="text-[#C9A227]" />
            Tuition fee statement for {receipt.term}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md border border-[#E4E2DA] bg-white px-3 py-1.5 text-sm text-[#16233F] hover:bg-[#FAFAF8]"
            >
              <Printer size={15} strokeWidth={1.75} />
              Print
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md bg-[#16233F] px-3 py-1.5 text-sm text-white hover:bg-[#0F1B33]"
            >
              <Download size={15} strokeWidth={1.75} />
              Download PDF
            </button>
          </div>
        </div>

        {/* Receipt card */}
        <div className="overflow-hidden rounded-lg border border-[#E4E2DA] bg-white">
          {/* Ledger header strip */}
          <div className="flex items-center justify-between bg-[#16233F] px-6 py-5 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C9A227] text-sm font-serif font-semibold text-[#C9A227]">
                SP
              </div>
              <div>
                <p className="font-serif text-base leading-tight">Student Portal University</p>
                <p className="text-xs text-[#CBD2E0]">Office of Student Accounts</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-[#4B7A6F]/20 px-3 py-1 text-xs font-medium text-[#8FCABB]">
              <CheckCircle2 size={13} strokeWidth={2} />
              {receipt.status}
            </span>
          </div>

          {/* Meta row */}
          <div className="grid grid-cols-2 gap-4 border-b border-[#E4E2DA] px-6 py-5 sm:grid-cols-4">
            <div>
              <p className="flex items-center gap-1 text-xs uppercase tracking-wide text-[#9CA3AF]">
                <Hash size={12} /> Receipt No.
              </p>
              <p className="mt-1 font-mono text-sm text-[#16233F]">{receipt.receiptNo}</p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-xs uppercase tracking-wide text-[#9CA3AF]">
                <CalendarDays size={12} /> Issued On
              </p>
              <p className="mt-1 text-sm text-[#16233F]">
                {new Date(receipt.issuedOn).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-xs uppercase tracking-wide text-[#9CA3AF]">
                <Landmark size={12} /> Payment Method
              </p>
              <p className="mt-1 text-sm text-[#16233F]">{receipt.paymentMethod}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-[#9CA3AF]">Term</p>
              <p className="mt-1 text-sm text-[#16233F]">{receipt.term}</p>
            </div>
          </div>

          {/* Student info */}
          <div className="grid grid-cols-1 gap-4 border-b border-[#E4E2DA] px-6 py-5 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#9CA3AF]">Student Name</p>
              <p className="mt-1 text-sm font-medium text-[#16233F]">{receipt.studentName}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-[#9CA3AF]">Student ID</p>
              <p className="mt-1 font-mono text-sm text-[#16233F]">{receipt.studentId}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-[#9CA3AF]">Program</p>
              <p className="mt-1 text-sm text-[#16233F]">{receipt.program}</p>
            </div>
          </div>

          {/* Line items */}
          <div className="px-6 py-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E4E2DA] text-left text-xs uppercase tracking-wide text-[#9CA3AF]">
                  <th className="pb-2 font-medium">Description</th>
                  <th className="pb-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EEE7]">
                {receipt.items.map((item) => (
                  <tr key={item.label}>
                    <td className="py-2.5 text-[#16233F]">{item.label}</td>
                    <td className="py-2.5 text-right text-[#16233F]">
                      {formatCurrency(item.amount, receipt.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="mt-4 space-y-1.5 border-t border-[#E4E2DA] pt-4">
              <div className="flex justify-between text-sm text-[#6B7280]">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal, receipt.currency)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#16233F]">
                <span>Amount Paid</span>
                <span className="text-[#4B7A6F]">
                  {formatCurrency(receipt.amountPaid, receipt.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="border-t border-[#E4E2DA] bg-[#FAFAF8] px-6 py-4">
            <p className="text-xs text-[#9CA3AF]">
              This is a system-generated receipt and does not require a signature. For billing
              questions, contact the Office of Student Accounts.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
