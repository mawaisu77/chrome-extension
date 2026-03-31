import { describe, expect, it } from "vitest";
import { searchAndFill } from "../../src/content/edplan/engine";

describe("edplan search and fill integration", () => {
  it("fails loudly when no search controls exist", async () => {
    document.body.innerHTML = "<div>No search form</div>";
    const result = await searchAndFill({
      studentId: "1",
      firstName: "Jane",
      lastName: "Doe"
    });
    expect(result.ok).toBe(false);
    expect(result.code).toBe("DOM_NO_MATCH");
  });
});
