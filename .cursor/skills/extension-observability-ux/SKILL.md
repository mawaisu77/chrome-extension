---
name: extension-observability-ux
description: Add fail-loud observability and minimal, clear UX feedback for extension automation workflows. Use when implementing workflow status, structured logging, debug mode, and actionable error presentation.
---

# Extension Observability and UX

## Observability Requirements

- Emit structured logs for each workflow step:
  - start/end
  - retries
  - validation outcomes
  - terminal failures
- Include debug mode with richer tracing.
- Never log secrets, tokens, or unnecessary PII.

## Error Handling Rules

- Treat silent failure as a defect.
- Return explicit error codes and messages.
- Distinguish recoverable vs terminal errors.

## UX Minimum Contract

- Show current progress state.
- Show actionable errors with next steps.
- Show clear success confirmation.
- Require confirmation before irreversible/high-risk submissions.

## Quality Gate

Before merge or release:

- Verify logs are sufficient to diagnose failed runs.
- Verify user can identify what failed and why.
- Verify sensitive data is not exposed in telemetry or UI.
