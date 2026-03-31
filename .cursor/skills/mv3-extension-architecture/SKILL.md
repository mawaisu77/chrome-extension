---
name: mv3-extension-architecture
description: Design Chrome Extension Manifest V3 architecture with least-privilege permissions, clear module boundaries, and service-worker/content-script separation. Use when creating or refactoring extension structure, manifest permissions, and runtime boundaries.
---

# MV3 Extension Architecture

## Scope

Use this skill for foundational extension architecture decisions.

## Required Workflow

1. Restate the implementation task.
2. Identify dependencies and risks.
3. Propose a step-by-step plan.
4. Implement only after scope is clear.

## MV3 Baseline

- Use `background.service_worker` for orchestration and privileged APIs.
- Keep DOM access in content scripts only.
- Keep extension UI concerns in popup/options modules.
- Use a dedicated messaging layer between service worker and content scripts.

## Least-Privilege Manifest Rules

- Request only required permissions.
- Restrict `host_permissions` to exact domains/patterns needed.
- Avoid broad host wildcards unless strictly necessary.
- Prefer `activeTab` when it satisfies the workflow.

## Boundary Rules

- Do not assume shared execution context between page scripts and extension scripts.
- Keep side-effectful business logic in well-defined modules.
- Avoid monolithic files; separate orchestration, adapters, and helpers.

## Suggested Module Layout

- `manifest/`
- `background/`
- `content/`
- `messaging/`
- `api/`
- `mapping/`
- `observability/`
- `ui/`
