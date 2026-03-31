import { z } from "zod";

export const FieldMappingSchema = z.object({
  sourceField: z.string(),
  targetSelectors: z.array(z.string()).min(1),
  required: z.boolean().default(false),
  type: z.enum(["text", "select", "checkbox"]).default("text"),
  transform: z.enum(["none", "uppercase", "trim"]).default("none")
});

export const MappingConfigSchema = z.object({
  version: z.string(),
  fieldMappings: z.array(FieldMappingSchema)
});

export type FieldMapping = z.infer<typeof FieldMappingSchema>;
export type MappingConfig = z.infer<typeof MappingConfigSchema>;
