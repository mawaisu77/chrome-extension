import { SyncStudentCommandSchema } from "../../shared/contracts/messages";

function createRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

async function triggerSync(studentId: string): Promise<void> {
  const command = SyncStudentCommandSchema.parse({
    type: "SYNC_STUDENT",
    requestId: createRequestId(),
    studentId,
    source: "streamline-content"
  });
  await chrome.runtime.sendMessage(command);
}

document.addEventListener("click", (event) => {
  const target = event.target as HTMLElement | null;
  if (!target) {
    return;
  }

  const button = target.closest("[data-edplan-sync-student-id]") as HTMLElement | null;
  if (!button) {
    return;
  }

  const studentId = button.dataset.edplanSyncStudentId;
  if (!studentId) {
    return;
  }

  void triggerSync(studentId);
});
