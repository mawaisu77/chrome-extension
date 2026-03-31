import type { StudentPayload } from "../shared/contracts/student";
import { StudentPayloadSchema } from "../shared/contracts/student";
import type { RuntimeResult } from "../shared/contracts/messages";

const API_BASE = "https://api.streamline.example.com";

export type ApiResult = RuntimeResult<{ payload?: StudentPayload }>;

function classifyApiFailure(status: number): RuntimeResult {
  if (status === 401 || status === 403) {
    return { ok: false, code: "API_UNAUTHORIZED", message: "Streamline authorization failed." };
  }
  if (status === 429) {
    return { ok: false, code: "API_RATE_LIMITED", message: "Streamline API rate-limited request." };
  }
  return { ok: false, code: "API_NETWORK", message: `API request failed with status ${status}.` };
}

export async function fetchStudentPayload(studentId: string): Promise<ApiResult> {
  try {
    const response = await fetch(`${API_BASE}/students/${encodeURIComponent(studentId)}/sync`, {
      credentials: "include"
    });

    if (!response.ok) {
      return classifyApiFailure(response.status);
    }

    const data: unknown = await response.json();
    const parsed = StudentPayloadSchema.safeParse(data);
    if (!parsed.success) {
      return { ok: false, code: "API_INVALID_PAYLOAD", message: "Invalid student payload returned by API." };
    }

    return { ok: true, code: "OK", message: "Payload ready.", details: { payload: parsed.data } };
  } catch {
    return { ok: false, code: "API_NETWORK", message: "Unable to reach Streamline API." };
  }
}
