import { describe, expect, it } from "vitest";
import { applyTransform } from "../../src/shared/mapping/transforms";
import { MappingConfigSchema } from "../../src/shared/mapping/schema";

describe("mapping transforms", () => {
  it("trims value", () => {
    expect(applyTransform("  Jane ", "trim")).toBe("Jane");
  });

  it("uppercases value", () => {
    expect(applyTransform("abc", "uppercase")).toBe("ABC");
  });
});

describe("mapping schema", () => {
  it("validates mapping config", () => {
    const parsed = MappingConfigSchema.safeParse({
      version: "1.0.0",
      fieldMappings: [
        {
          sourceField: "firstName",
          targetSelectors: ["#firstName"],
          required: true,
          type: "text",
          transform: "trim"
        }
      ]
    });
    expect(parsed.success).toBe(true);
  });
});
