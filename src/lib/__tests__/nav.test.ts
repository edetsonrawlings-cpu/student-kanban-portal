import { describe, expect, it } from "vitest";
import { isRole } from "@/lib/demo-role-store";
import { getPageTitle, isActivePath, navItems, visibleNavItems } from "@/lib/nav";

describe("isRole", () => {
  it("accepts the three demo roles", () => {
    expect(isRole("STUDENT")).toBe(true);
    expect(isRole("TEACHER")).toBe(true);
    expect(isRole("ADMIN")).toBe(true);
  });

  it("rejects unknown or malformed values", () => {
    expect(isRole("SUPER_ADMIN")).toBe(false);
    expect(isRole("student")).toBe(false);
    expect(isRole(null)).toBe(false);
  });
});

describe("visibleNavItems", () => {
  it("hides student-only entries from an admin", () => {
    const labels = visibleNavItems("ADMIN").map((item) => item.label);
    expect(labels).toContain("Admin");
    expect(labels).not.toContain("Assignments");
    expect(labels).not.toContain("Fee Receipt");
  });

  it("hides the admin entry from a student", () => {
    const labels = visibleNavItems("STUDENT").map((item) => item.label);
    expect(labels).toContain("Assignments");
    expect(labels).not.toContain("Admin");
  });

  it("shows teaching tools without student finance or administration", () => {
    const labels = visibleNavItems("TEACHER").map((item) => item.label);
    expect(labels).toContain("Assignments");
    expect(labels).toContain("Gradebook");
    expect(labels).not.toContain("Fee Receipt");
    expect(labels).not.toContain("Admin");
    expect(visibleNavItems("TEACHER").every((item) => navItems.includes(item))).toBe(true);
  });
});

describe("isActivePath", () => {
  it("matches the exact route", () => {
    expect(isActivePath("/courses", "/courses")).toBe(true);
  });

  it("matches nested routes", () => {
    expect(isActivePath("/courses/c1", "/courses")).toBe(true);
  });

  it("does not match a sibling route sharing a prefix", () => {
    expect(isActivePath("/coursework", "/courses")).toBe(false);
  });

  it("handles a missing pathname", () => {
    expect(isActivePath(null, "/courses")).toBe(false);
  });
});

describe("getPageTitle", () => {
  it("derives the topbar title from the route", () => {
    expect(getPageTitle("/dashboard")).toBe("Dashboard");
    expect(getPageTitle("/fee-receipt")).toBe("Fee Receipt");
    expect(getPageTitle("/courses/c1")).toBe("Courses");
    expect(getPageTitle("/settings")).toBe("Settings");
  });

  it("falls back for an unknown route", () => {
    expect(getPageTitle("/nowhere")).toBe("Campus Portal");
  });
});
