import { describe, expect, it } from "vitest";
import { formatDate, formatDueDate, isOverdue, timeAgo } from "@/lib/utils";

describe("formatDueDate", () => {
  it("formats an ISO timestamp in UTC so SSR and hydration agree", () => {
    expect(formatDueDate("2026-09-26T23:59:00Z")).toBe("Sep 26, 11:59 PM");
  });

  it("does not shift the day for a midday timestamp", () => {
    expect(formatDueDate("2026-10-02T12:00:00Z")).toBe("Oct 2, 12:00 PM");
  });
});

describe("formatDate", () => {
  it("formats a date without a time component", () => {
    expect(formatDate("2026-09-10T00:00:00Z")).toBe("Sep 10, 2026");
  });
});

describe("isOverdue", () => {
  const now = Date.parse("2026-09-24T12:00:00Z");

  it("is true for a past deadline", () => {
    expect(isOverdue("2026-09-21T23:59:00Z", now)).toBe(true);
  });

  it("is false for a future deadline", () => {
    expect(isOverdue("2026-09-26T23:59:00Z", now)).toBe(false);
  });

  it("is false at the exact deadline", () => {
    expect(isOverdue("2026-09-24T12:00:00Z", now)).toBe(false);
  });
});

describe("timeAgo", () => {
  const now = Date.parse("2026-09-24T12:00:00Z");

  it("reports minutes as 'just now'", () => {
    expect(timeAgo("2026-09-24T11:30:00Z", now)).toBe("just now");
  });

  it("reports hours", () => {
    expect(timeAgo("2026-09-24T09:00:00Z", now)).toBe("3h ago");
  });

  it("reports days", () => {
    expect(timeAgo("2026-09-21T12:00:00Z", now)).toBe("3d ago");
  });

  it("falls back to an absolute date beyond a month", () => {
    expect(timeAgo("2026-06-01T12:00:00Z", now)).toBe("Jun 1, 2026");
  });
});
