import { z } from "zod";

export const SyncStudentCommandSchema = z.object({
  type: z.literal("SYNC_STUDENT"),
  requestId: z.string().min(8),
  studentId: z.string().min(1),
  source: z.literal("streamline-content")
});

export const SyncStatusEventSchema = z.object({
  type: z.literal("SYNC_STATUS"),
  requestId: z.string(),
  status: z.enum(["idle", "in_progress", "success", "error"]),
  step: z.string(),
  message: z.string(),
  code: z.string().optional()
});

export const ConfirmMatchRequestSchema = z.object({
  type: z.literal("CONFIRM_MATCH_REQUEST"),
  requestId: z.string(),
  candidates: z.array(z.object({
    id: z.string(),
    display: z.string()
  })).min(1)
});

export const ConfirmMatchResponseSchema = z.object({
  type: z.literal("CONFIRM_MATCH_RESPONSE"),
  requestId: z.string(),
  confirmedId: z.string().nullable()
});

export const RuntimeMessageSchema = z.discriminatedUnion("type", [
  SyncStudentCommandSchema,
  SyncStatusEventSchema,
  ConfirmMatchRequestSchema,
  ConfirmMatchResponseSchema
]);

export type SyncStudentCommand = z.infer<typeof SyncStudentCommandSchema>;
export type SyncStatusEvent = z.infer<typeof SyncStatusEventSchema>;
export type ConfirmMatchRequest = z.infer<typeof ConfirmMatchRequestSchema>;
export type ConfirmMatchResponse = z.infer<typeof ConfirmMatchResponseSchema>;
export type RuntimeMessage = z.infer<typeof RuntimeMessageSchema>;

export type RuntimeResult<T = Record<string, unknown>> = {
  ok: boolean;
  code: string;
  message: string;
  details?: T;
};
