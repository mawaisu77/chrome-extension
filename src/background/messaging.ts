import {
  RuntimeMessageSchema,
  SyncStatusEventSchema,
  type RuntimeMessage,
  type RuntimeResult,
  type SyncStatusEvent
} from "../shared/contracts/messages";

const seenRequestIds = new Set<string>();

export function parseMessage(input: unknown): RuntimeMessage | null {
  const parsed = RuntimeMessageSchema.safeParse(input);
  if (!parsed.success) {
    return null;
  }
  return parsed.data;
}

export function guardIdempotency(requestId: string): RuntimeResult {
  if (seenRequestIds.has(requestId)) {
    return { ok: false, code: "DUPLICATE_REQUEST", message: "Request already processed." };
  }
  seenRequestIds.add(requestId);
  return { ok: true, code: "OK", message: "Accepted." };
}

export async function emitSyncStatus(tabId: number, event: SyncStatusEvent): Promise<void> {
  const parsed = SyncStatusEventSchema.parse(event);
  await chrome.tabs.sendMessage(tabId, parsed);
}
