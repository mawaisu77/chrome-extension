# EdPlan MV3 Sync Extension

Chrome Extension (Manifest V3) that synchronizes student data from Streamline into EdPlan through authenticated browser sessions and DOM automation.

## Quick Start

1. Install dependencies:
   - `npm install`
2. Build extension:
   - `npm run build`
3. Load unpacked:
   - Open `chrome://extensions`
   - Enable developer mode
   - Load `dist/`

## Architecture

- `src/background`: orchestrator, session checks, API integration, messaging guards.
- `src/content/streamline`: trigger bridge from Streamline UI.
- `src/content/edplan`: search and form-fill automation engine.
- `src/shared`: contracts, mapping, error models, observability logger.
- `src/ui`: popup and in-page overlay status surfaces.

## Scripts

- `npm run build`: build unpacked extension in `dist`.
- `npm run package`: produce versioned zip artifact.
- `npm run test`: run Vitest suite.
- `npm run lint`: run ESLint.

## Security Notes

- No credential storage or credential prompts.
- Session context is browser-managed.
- Logs redact known sensitive keys.
