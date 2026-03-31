import { describe, expect, it } from "vitest";
import { guardIdempotency, parseMessage } from "../../src/background/messaging";

describe("messaging", () => {
  it("parses valid message", () => {
    const parsed = parseMessage({
      type: "SYNC_STUDENT",
      requestId: "req-12345678",
      studentId: "S1",
      source: "streamline-content"
    });
    expect(parsed?.type).toBe("SYNC_STUDENT");
  });

  it("rejects duplicate request", () => {
    const first = guardIdempotency("req-dup");
    const second = guardIdempotency("req-dup");
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(false);
  });
});
