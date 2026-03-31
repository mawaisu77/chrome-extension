# Mapping Maintenance Guide

## Mapping File
- Template: `config/mapping.example.json`
- Runtime default mapping currently lives in `src/shared/mapping/defaultMapping.ts`

## Change Process
1. Add/adjust field mapping selector list in priority order (id, name, fallback).
2. Run tests: `npm run test`.
3. Validate in EdPlan test environment with one real sync.
4. Update release notes with mapping version impacts.

## Validation Rules
- Every mapping must include:
  - `sourceField`
  - non-empty `targetSelectors`
  - `type`
  - `transform`
- Required fields must fail sync if unresolved.
