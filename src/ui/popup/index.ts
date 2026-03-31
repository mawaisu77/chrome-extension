type PopupState = {
  debug: boolean;
  lastStatus: string;
};

const statusEl = document.getElementById("status");
const debugButton = document.getElementById("debugToggle");

async function loadState(): Promise<PopupState> {
  const result = await chrome.storage.local.get(["debug", "lastStatus"]);
  return {
    debug: Boolean(result.debug),
    lastStatus: typeof result.lastStatus === "string" ? result.lastStatus : "Idle"
  };
}

async function render(): Promise<void> {
  const state = await loadState();
  if (statusEl) {
    statusEl.textContent = state.lastStatus + (state.debug ? " (debug enabled)" : "");
  }
}

if (debugButton) {
  debugButton.addEventListener("click", async () => {
    const state = await loadState();
    await chrome.storage.local.set({ debug: !state.debug });
    await render();
  });
}

void render();
