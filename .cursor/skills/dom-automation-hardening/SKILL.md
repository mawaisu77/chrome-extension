---
name: dom-automation-hardening
description: Implement robust DOM automation for unstable third-party web apps with selector fallback, bounded waits, retries, and post-action verification. Use when building or debugging content-script form automation and data-entry reliability.
---

# DOM Automation Hardening

## Core Rule

Never assume DOM stability or immediate element availability.

## Selector Priority

1. Stable `id`
2. Stable `name`
3. Label-linked selector
4. Narrow, constrained fallback selector

## Interaction Contract

- Wait for element existence with timeout.
- Wait for interactable state (visible/enabled/not blocked).
- Perform the action.
- Verify the resulting state (value changed, selection applied, checkbox state updated).

## Reliability Controls

- Use bounded retries for transient failures.
- Add jitter/backoff between retries.
- Fail loudly on timeout, missing element, or ambiguous matches.
- Include actionable diagnostics (field key, selector strategy, last error category).

## Safety Rules

- Do not submit when required target fields cannot be resolved.
- Do not continue automation after critical field failure.
- Stop and report when DOM changes invalidate mappings.
