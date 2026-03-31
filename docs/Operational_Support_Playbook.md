# Operational Support Playbook

## Incident Triage

1. Capture timestamp, request ID, and user-reported step.
2. Retrieve logs with matching request ID.
3. Categorize by domain:
   - Session
   - API
   - DOM
   - User state

## Severity Guide

- Sev-1: widespread sync failures or data integrity risk.
- Sev-2: partial feature outage with known workaround.
- Sev-3: isolated user/environment issue.

## Response Actions

- Session issues: verify login state and cookie availability.
- API issues: validate endpoint availability and response schema.
- DOM issues: compare selectors against current EdPlan UI.
- User flow issues: verify ambiguous-match confirmation behavior.

## Communication Template

- What failed
- Affected users/scope
- Mitigation in place
- ETA for fix or rollback decision
