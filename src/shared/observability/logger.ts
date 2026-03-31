type LogLevel = "info" | "warning" | "error";

export type LogEvent = {
  level: LogLevel;
  step: string;
  requestId?: string;
  message: string;
  details?: Record<string, unknown>;
};

const REDACT_KEYS = ["token", "cookie", "authorization", "password"];

function sanitize(details?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!details) {
    return undefined;
  }
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(details)) {
    out[key] = REDACT_KEYS.includes(key.toLowerCase()) ? "[REDACTED]" : value;
  }
  return out;
}

export function logEvent(event: LogEvent): void {
  const payload = { ...event, details: sanitize(event.details), ts: new Date().toISOString() };
  const fn = event.level === "error" ? console.error : console.log;
  fn("[edplan-sync]", payload);
}
