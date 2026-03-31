import { fetchStudentPayload } from "./api";
import { emitSyncStatus, guardIdempotency, parseMessage } from "./messaging";
import { validateSessions } from "./session";
import { logEvent } from "../shared/observability/logger";
import type { RuntimeResult, SyncStudentCommand } from "../shared/contracts/messages";

type SyncStep = "preflight" | "fetching_data" | "searching_student" | "filling_form" | "complete";

async function findEdPlanTab(): Promise<chrome.tabs.Tab | undefined> {
  const tabs = await chrome.tabs.query({ url: ["https://*.edplan.example.com/*"] });
  return tabs.find((tab) => typeof tab.id === "number");
}

async function status(tabId: number, requestId: string, step: SyncStep, message: string, ok = true, code?: string) {
  await emitSyncStatus(tabId, {
    type: "SYNC_STATUS",
    requestId,
    status: ok ? (step === "complete" ? "success" : "in_progress") : "error",
    step,
    message,
    code
  });
}

async function runSync(command: SyncStudentCommand): Promise<RuntimeResult> {
  const idempotency = guardIdempotency(command.requestId);
  if (!idempotency.ok) {
    return idempotency;
  }

  const edplanTab = await findEdPlanTab();
  if (!edplanTab?.id) {
    return { ok: false, code: "EDPLAN_TAB_MISSING", message: "Open an authenticated EdPlan tab and retry." };
  }

  await status(edplanTab.id, command.requestId, "preflight", "Validating sessions.");
  const sessions = await validateSessions();
  if (!sessions.ok) {
    await status(edplanTab.id, command.requestId, "preflight", sessions.message, false, sessions.code);
    return sessions;
  }

  await status(edplanTab.id, command.requestId, "fetching_data", "Fetching student payload from Streamline.");
  const apiResult = await fetchStudentPayload(command.studentId);
  if (!apiResult.ok || !apiResult.details?.payload) {
    await status(edplanTab.id, command.requestId, "fetching_data", apiResult.message, false, apiResult.code);
    return apiResult;
  }

  await status(edplanTab.id, command.requestId, "searching_student", "Searching student in EdPlan.");
  const searchResult = await chrome.tabs.sendMessage(edplanTab.id, {
    type: "EDPLAN_SEARCH_AND_FILL",
    requestId: command.requestId,
    payload: apiResult.details.payload
  });

  if (!searchResult?.ok) {
    await status(edplanTab.id, command.requestId, "filling_form", searchResult?.message ?? "EdPlan automation failed.", false, searchResult?.code);
    return {
      ok: false,
      code: searchResult?.code ?? "UNKNOWN",
      message: searchResult?.message ?? "EdPlan automation failed."
    };
  }

  await status(edplanTab.id, command.requestId, "complete", "Sync completed successfully.");
  return { ok: true, code: "OK", message: "Sync complete." };
}

chrome.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
  const parsed = parseMessage(message);
  if (!parsed || parsed.type !== "SYNC_STUDENT") {
    return;
  }

  void runSync(parsed)
    .then((result) => {
      logEvent({
        level: result.ok ? "info" : "error",
        step: "sync",
        requestId: parsed.requestId,
        message: result.message,
        details: { code: result.code }
      });
      sendResponse(result);
    })
    .catch((error: unknown) => {
      logEvent({
        level: "error",
        step: "sync",
        requestId: parsed.requestId,
        message: "Unhandled sync failure.",
        details: { error: String(error) }
      });
      sendResponse({ ok: false, code: "UNKNOWN", message: "Unhandled sync failure." });
    });

  return true;
});
