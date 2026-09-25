"use client";

import { CalendarDays, CheckCircle2, Hash, Landmark, Receipt } from "lucide-react";
import { ReceiptActions } from "@/components/ReceiptActions";
import { currentStudent, mockReceipt, receiptTotal } from "@/lib/mock-data";
import { useActiveAccount } from "@/lib/use-active-account";
import { formatCurrency, formatDate } from "@/lib/utils";

export function RoleFeeReceipt() {
  const { account: studentAccount } = useActiveAccount("STUDENT");
  const meta = [
    { label: "Receipt No.", value: mockReceipt.receiptNo, icon: Hash, mono: true },
    { label: "Issued On", value: formatDate(mockReceipt.issuedOn), icon: CalendarDays },
    { label: "Payment Method", value: mockReceipt.paymentMethod, icon: Landmark },
    { label: "Term", value: mockReceipt.term },
  ];
  const student = [
    { label: "Student Name", value: studentAccount?.name ?? currentStudent.name },
    {
      label: "Student ID",
      value: studentAccount?.identifier ?? currentStudent.studentId,
      mono: true,
    },
    { label: "Program", value: studentAccount?.department ?? currentStudent.program },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
          <Receipt size={16} strokeWidth={1.75} className="text-[#C9A227]" aria-hidden />
          Tuition fee statement for {mockReceipt.term}
        </div>
        <ReceiptActions />
      </div>

      <div className="overflow-hidden rounded-lg border border-[#E4E2DA] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#16233F] px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C9A227] font-serif text-sm font-semibold text-[#C9A227]">
              CP
            </div>
            <div>
              <p className="font-serif text-base leading-tight">Campus Portal University</p>
              <p className="text-xs text-[#CBD2E0]">Office of Student Accounts</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-[#4B7A6F]/20 px-3 py-1 text-xs font-medium text-[#8FCABB]">
            <CheckCircle2 size={13} strokeWidth={2} aria-hidden />
            {mockReceipt.status}
          </span>
        </div>

        <dl className="grid grid-cols-2 gap-4 border-b border-[#E4E2DA] px-6 py-5 sm:grid-cols-4">
          {meta.map(({ label, value, icon: Icon, mono }) => (
            <div key={label}>
              <dt className="flex items-center gap-1 text-xs uppercase tracking-wide text-[#9CA3AF]">
                {Icon && <Icon size={12} aria-hidden />} {label}
              </dt>
              <dd className={`mt-1 text-sm text-[#16233F] ${mono ? "font-mono" : ""}`}>{value}</dd>
            </div>
          ))}
        </dl>

        <dl className="grid grid-cols-1 gap-4 border-b border-[#E4E2DA] px-6 py-5 sm:grid-cols-3">
          {student.map(({ label, value, mono }) => (
            <div key={label}>
              <dt className="text-xs uppercase tracking-wide text-[#9CA3AF]">{label}</dt>
              <dd className={`mt-1 text-sm text-[#16233F] ${mono ? "font-mono" : "font-medium"}`}>
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="px-6 py-5">
          <table className="w-full text-sm">
            <caption className="sr-only">Fee breakdown</caption>
            <thead>
              <tr className="border-b border-[#E4E2DA] text-left text-xs uppercase tracking-wide text-[#9CA3AF]">
                <th scope="col" className="pb-2 font-medium">Description</th>
                <th scope="col" className="pb-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EEE7]">
              {mockReceipt.items.map((item) => (
                <tr key={item.label}>
                  <td className="py-2.5 text-[#16233F]">{item.label}</td>
                  <td className="py-2.5 text-right text-[#16233F]">
                    {formatCurrency(item.amount, mockReceipt.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 space-y-1.5 border-t border-[#E4E2DA] pt-4">
            <div className="flex justify-between text-sm text-[#6B7280]">
              <span>Subtotal</span>
              <span>{formatCurrency(receiptTotal, mockReceipt.currency)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-[#16233F]">
              <span>Amount Paid</span>
              <span className="text-[#4B7A6F]">{formatCurrency(receiptTotal, mockReceipt.currency)}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E4E2DA] bg-[#FAFAF8] px-6 py-4">
          <p className="text-xs text-[#9CA3AF]">
            This is a system-generated receipt and does not require a signature. For billing
            questions, contact the Office of Student Accounts.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RoleFeeReceipt;