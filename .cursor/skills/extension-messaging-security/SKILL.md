---
name: extension-messaging-security
description: Define secure, typed message contracts for Chrome extensions with runtime validation, idempotency guards, and explicit failure handling. Use when implementing service-worker/content-script communication or reviewing extension message flows.
---

# Extension Messaging Security

## Contract Design

- Define messages as discriminated TypeScript unions.
- Validate message shape at runtime before handling.
- Reject unknown message types explicitly.

## Reliability Requirements

- Include `requestId`/correlation ID in each command.
- Return structured result objects: `ok`, `code`, `message`, `details`.
- Handle ack, timeout, and retry behavior intentionally.
- Use idempotency guards to prevent duplicate execution.

## Security Requirements

- Never include credentials, tokens, or raw cookie material in messages.
- Validate source context and expected sender when relevant.
- Keep payloads minimal; pass only required fields.

## Failure Rules

- No silent failures.
- Log message lifecycle events without sensitive data.
- Surface user-friendly errors for terminal failures.
