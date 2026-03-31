import type { RuntimeResult } from "../shared/contracts/messages";

const STREAMLINE_COOKIE_NAME = "streamline_session";
const EDPLAN_COOKIE_NAME = "edplan_session";

async function hasCookie(url: string, name: string): Promise<boolean> {
  const cookie = await chrome.cookies.get({ url, name });
  return Boolean(cookie?.value);
}

export async function validateSessions(): Promise<RuntimeResult> {
  const streamlineOk = await hasCookie("https://app.streamline.example.com", STREAMLINE_COOKIE_NAME);
  if (!streamlineOk) {
    return {
      ok: false,
      code: "SESSION_STREAMLINE_EXPIRED",
      message: "Streamline session expired. Sign in and retry."
    };
  }

  const edplanOk = await hasCookie("https://portal.edplan.example.com", EDPLAN_COOKIE_NAME);
  if (!edplanOk) {
    return {
      ok: false,
      code: "SESSION_EDPLAN_EXPIRED",
      message: "EdPlan session expired. Refresh/sign in and retry."
    };
  }

  return { ok: true, code: "OK", message: "Sessions valid." };
}
