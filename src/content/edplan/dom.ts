import type { AppError } from "../../shared/errors";

export async function waitForElement(
  selectors: string[],
  timeoutMs = 4000,
  intervalMs = 150
): Promise<Element | null> {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el) {
        return el;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return null;
}

export function asAppError(code: AppError["code"], message: string, details?: Record<string, unknown>): AppError {
  return { code, message, recoverable: false, details };
}

export function setInputValue(element: Element, value: string): boolean {
  if (!(element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement)) {
    return false;
  }

  element.focus();
  if (element instanceof HTMLInputElement && element.type === "checkbox") {
    element.checked = value === "true";
  } else {
    element.value = value;
  }
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}
