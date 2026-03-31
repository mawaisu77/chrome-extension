---
name: api-mapping-integrity
description: Build resilient API-to-form workflows with schema validation, timeout-aware API handling, config-driven field mappings, and strict data-integrity gates. Use when integrating third-party APIs with browser automation pipelines.
---

# API Mapping Integrity

## API Integration Rules

- Use async/await with explicit timeout wrappers.
- Handle network errors, timeout errors, invalid JSON, and non-2xx responses separately.
- Validate response schema before consuming any field.

## Mapping Rules

- Keep field mappings in config (JSON or schema-backed TS object).
- Do not hardcode mapping logic into UI/DOM procedures.
- Validate mapping config on startup and before execution.

## Data Integrity Gates

Block submission when:

- required source fields are missing
- mapping lookup fails
- target form field is unresolved
- entity/student match is ambiguous without explicit confirmation
- pre-submit verification fails

## Fail-Loud Behavior

- Report exact gate that failed.
- Include actionable recovery guidance.
- Never proceed on partial confidence.
