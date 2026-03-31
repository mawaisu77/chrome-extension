# Troubleshooting Runbook

## Common Error Codes

- `SESSION_STREAMLINE_EXPIRED`: sign in to Streamline and retry.
- `SESSION_EDPLAN_EXPIRED`: refresh/sign in to EdPlan and retry.
- `API_UNAUTHORIZED`: verify Streamline session is still valid.
- `API_RATE_LIMITED`: wait and retry.
- `DOM_NO_MATCH`: no student found in EdPlan search.
- `DOM_ELEMENT_NOT_FOUND`: EdPlan selector changed or page state unexpected.
- `USER_CANCELLED`: user canceled ambiguous student selection.

## Debug Steps
1. Open extension popup and enable debug mode.
2. Retry sync while observing browser console logs tagged `[edplan-sync]`.
3. Confirm active authenticated tabs for both systems.
4. Validate target fields/selectors in EdPlan page.

## Safe Logging Rules
- Never log cookie values or auth tokens.
- Do not copy full student payloads to support channels.
