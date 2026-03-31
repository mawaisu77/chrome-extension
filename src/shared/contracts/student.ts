import { z } from "zod";

export const StudentPayloadSchema = z.object({
  studentId: z.string(),
  paSecureId: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string().optional(),
  gradeLevel: z.string().optional()
});

export type StudentPayload = z.infer<typeof StudentPayloadSchema>;
