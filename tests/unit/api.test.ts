import { describe, expect, it, vi } from "vitest";
import { fetchStudentPayload } from "../../src/background/api";

describe("api client", () => {
  it("returns normalized payload on success", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({
      ok: true,
      json: async () => ({
        studentId: "1",
        firstName: "Jane",
        lastName: "Doe"
      })
    })) as unknown as typeof fetch);

    const result = await fetchStudentPayload("1");
    expect(result.ok).toBe(true);
    expect(result.details?.payload?.firstName).toBe("Jane");
  });

  it("maps unauthorized status", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, status: 401 })) as unknown as typeof fetch);
    const result = await fetchStudentPayload("1");
    expect(result.code).toBe("API_UNAUTHORIZED");
  });
});
