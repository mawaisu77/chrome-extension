import { defaultMapping } from "../../shared/mapping/defaultMapping";
import { applyTransform } from "../../shared/mapping/transforms";
import type { StudentPayload } from "../../shared/contracts/student";
import type { RuntimeResult } from "../../shared/contracts/messages";
import { asAppError, setInputValue, waitForElement } from "./dom";

type SearchOutcome =
  | { kind: "single" }
  | { kind: "multiple"; candidates: Array<{ id: string; display: string }> }
  | { kind: "none" };

async function resolveField(selectors: string[]): Promise<HTMLInputElement | null> {
  const immediate = document.querySelector(selectors.join(",")) as HTMLInputElement | null;
  if (immediate) {
    return immediate;
  }
  return (await waitForElement(selectors, 600)) as HTMLInputElement | null;
}

async function performStudentSearch(payload: StudentPayload): Promise<SearchOutcome> {
  const secureIdField = await resolveField(["#paSecureId", "input[name='paSecureId']"]);
  const studentIdField = await resolveField(["#studentId", "input[name='studentId']"]);
  const firstNameField = await resolveField(["#firstNameSearch", "input[name='firstName']"]);
  const lastNameField = await resolveField(["#lastNameSearch", "input[name='lastName']"]);
  const searchButton = (await waitForElement(["#searchButton", "button[type='submit']"], 600)) as HTMLButtonElement | null;

  if (!searchButton) {
    return { kind: "none" };
  }

  if (payload.paSecureId && secureIdField) {
    secureIdField.value = payload.paSecureId;
  } else if (studentIdField) {
    studentIdField.value = payload.studentId;
  } else if (firstNameField && lastNameField) {
    firstNameField.value = payload.firstName;
    lastNameField.value = payload.lastName;
  } else {
    return { kind: "none" };
  }

  searchButton.click();
  await new Promise((resolve) => setTimeout(resolve, 500));

  const rows = Array.from(document.querySelectorAll("table tr[data-student-id]"));
  if (rows.length === 0) {
    return { kind: "none" };
  }
  if (rows.length > 1) {
    return {
      kind: "multiple",
      candidates: rows.map((row) => ({
        id: row.getAttribute("data-student-id") ?? "",
        display: row.textContent?.trim() ?? "Unknown"
      }))
    };
  }
  return { kind: "single" };
}

async function fillMappedFields(payload: StudentPayload): Promise<RuntimeResult> {
  const data = payload as unknown as Record<string, string | undefined>;
  for (const field of defaultMapping.fieldMappings) {
    const target = await waitForElement(field.targetSelectors);
    if (!target) {
      if (field.required) {
        const error = asAppError("DOM_ELEMENT_NOT_FOUND", `Required target not found: ${field.sourceField}`, {
          selectors: field.targetSelectors
        });
        return { ok: false, code: error.code, message: error.message, details: error.details };
      }
      continue;
    }

    const rawValue = data[field.sourceField];
    if (!rawValue && field.required) {
      return { ok: false, code: "API_INVALID_PAYLOAD", message: `Missing required source field: ${field.sourceField}` };
    }
    if (!rawValue) {
      continue;
    }

    const value = applyTransform(rawValue, field.transform);
    const success = setInputValue(target, value);
    if (!success) {
      return { ok: false, code: "DOM_ELEMENT_NOT_FOUND", message: `Failed to set field ${field.sourceField}.` };
    }
  }

  const submitButton = await waitForElement(["#submitButton", "button[type='submit']"]);
  if (!submitButton) {
    return { ok: false, code: "DOM_ELEMENT_NOT_FOUND", message: "Submit button missing." };
  }
  (submitButton as HTMLButtonElement).click();
  return { ok: true, code: "OK", message: "Form submitted." };
}

export async function searchAndFill(payload: StudentPayload): Promise<RuntimeResult> {
  const outcome = await performStudentSearch(payload);
  if (outcome.kind === "none") {
    return { ok: false, code: "DOM_NO_MATCH", message: "No student found in EdPlan." };
  }
  if (outcome.kind === "multiple") {
    const confirm = window.confirm(
      `Multiple students found (${outcome.candidates.length}). Continue with the first match?`
    );
    if (!confirm) {
      return { ok: false, code: "USER_CANCELLED", message: "User cancelled ambiguous match selection." };
    }
  }

  return fillMappedFields(payload);
}
