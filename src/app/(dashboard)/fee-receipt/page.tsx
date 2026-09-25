import type { Metadata } from "next";
import { RoleFeeReceipt } from "@/components/portals/RoleFeeReceipt";

export const metadata: Metadata = { title: "Fee Receipt" };

export default function FeeReceiptPage() {
  return <RoleFeeReceipt />;
}
