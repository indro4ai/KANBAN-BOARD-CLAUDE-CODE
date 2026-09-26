import { describe, expect, it } from "vitest";
import { authenticate, DEMO_CREDENTIALS } from "@/lib/auth";

describe("authenticate", () => {
  it("returns the demo user for the demo credentials", () => {
    expect(authenticate(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password)).toEqual({
      name: "Alex Morgan",
      email: DEMO_CREDENTIALS.email,
    });
  });

  it("ignores surrounding whitespace and case in the email", () => {
    expect(authenticate("  Demo@Kanban.dev ", DEMO_CREDENTIALS.password)).not.toBeNull();
  });

  it("rejects a wrong password", () => {
    expect(authenticate(DEMO_CREDENTIALS.email, "wrong")).toBeNull();
  });

  it("rejects an unknown email", () => {
    expect(authenticate("someone@example.com", DEMO_CREDENTIALS.password)).toBeNull();
  });
});
