import type { StudentPayload } from "../../shared/contracts/student";
import { searchAndFill } from "./engine";

type EdPlanMessage = {
  type: "EDPLAN_SEARCH_AND_FILL";
  requestId: string;
  payload: StudentPayload;
};

type StatusMessage = {
  type: "SYNC_STATUS";
  requestId: string;
  status: "idle" | "in_progress" | "success" | "error";
  step: string;
  message: string;
};

function renderOverlay(event: StatusMessage): void {
  let root = document.getElementById("edplan-sync-overlay");
  if (!root) {
    root = document.createElement("div");
    root.id = "edplan-sync-overlay";
    root.className = "edplan-sync-overlay";
    document.body.appendChild(root);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL("overlay.css");
    document.head.appendChild(link);
  }
  root.textContent = `[${event.status}] ${event.step}: ${event.message}`;
}

chrome.runtime.onMessage.addListener((message: EdPlanMessage | StatusMessage, _sender, sendResponse) => {
  if (message.type === "EDPLAN_SEARCH_AND_FILL") {
    void searchAndFill(message.payload).then(sendResponse);
    return true;
  }
  if (message.type === "SYNC_STATUS") {
    renderOverlay(message);
  }
});
