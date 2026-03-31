SCOPE OF WORK
EdPlan Chrome Extension — Data Sync Automation
Prepared for Upwork Contractor Engagement

Document Version
1.0
Date
March 27, 2026
Project Type
Chrome Browser Extension
Platform
Google Chrome / Chromium
Engagement Type
Fixed-Price or Hourly (TBD)
Status
Open for Bids

1. Project Overview
This project involves the design and development of a Google Chrome browser extension that enables automated data synchronization from a Special Education (SPED) product into EdPlan, a third-party IEP management platform, without requiring any storage or handling of EdPlan user credentials.

EdPlan does not currently expose a public API for third-party integration. This extension bridges that gap by automating browser-level interactions with EdPlan's existing web UI on behalf of an authenticated user — functioning as a productivity tool, not a security bypass.

2. Background & Technical Context
EdPlan is a legacy, server-rendered web application. Based on evaluation of its student search interface, the following is confirmed:

	•	Standard HTML form inputs (no JavaScript framework), making DOM automation straightforward and stable
	•	Student search supports PA Secure ID #, Student ID, First Name, and Last Name as lookup fields
	•	The UI is unlikely to change frequently given its legacy architecture, reducing ongoing maintenance risk
	•	No iframe embedding is expected to be possible due to standard X-Frame-Options security headers

Security Architecture Note
The extension never intercepts, reads, stores, or transmits EdPlan login credentials. The user authenticates with EdPlan directly through their normal browser login. The extension activates only after a valid session cookie is already present, detected via domain monitoring on EdPlan's URL pattern.

2.1 Streamline Session Architecture
Because the user is already logged into Streamline as part of their normal workflow, the extension can leverage that existing authenticated session directly — no second login or credential handling is required on the Streamline side either.

The extension reads the active Streamline session cookie from the browser and uses it to make authenticated API calls to the Streamline backend to retrieve the student data needed for the sync. The recommended architecture is:

Sync Flow
1.  Streamline session cookie   →   extension reads token
2.  Extension calls Streamline API   →   fetches student data
3.  Streamline UI sends student ID   →   triggers sync
4.  Extension navigates EdPlan   →   fills fields automatically

This means the Streamline frontend only needs to tell the extension which student to sync — not pass the full data payload. The extension owns the data-fetching responsibility independently, keeping the UI integration lightweight.

Pre-Flight Session Check
Before attempting any sync, the extension must verify that both the Streamline session and the EdPlan session are active and valid. If either is expired, it must identify which session needs refreshing and prompt the user accordingly — rather than failing mid-sync without explanation.

3. Scope of Work

3.1 Deliverables

#
Deliverable
Description
1
Extension Setup & Architecture
Manifest v3 Chrome extension scaffold, build pipeline, private distribution package
2
EdPlan Session Detection
Detect active EdPlan login session; activate extension only when authenticated
3
Student Record Matching
Auto-search EdPlan by PA Secure ID, Student ID, or name; handle ambiguous/no-match states
4
Data Mapping & Form Fill
Map fields from your product to EdPlan form inputs; automated population and submission
5
Your Product Integration
Session cookie detection for Streamline; authenticated API calls to Streamline backend; messaging bridge from Streamline UI to trigger sync by student ID
6
Pre-Flight Checks & Error Handling
Verify both Streamline and EdPlan sessions before sync; detect DOM changes, login timeouts, failed matches; surface clear user-facing error states
7
User Confirmation Flow
Pause-and-confirm UI for ambiguous student matches; progress indicator during sync
8
Testing & QA
Chrome testing, edge case coverage, regression test suite
9
Documentation & Handoff
Technical docs, field mapping reference, deployment guide for enterprise Chrome policy rollout

3.2 Functional Requirements

1
The extension must activate only on authenticated EdPlan sessions — it must not prompt for or intercept login credentials at any point.
2
Upon receiving a sync trigger from the SPED product, the extension must navigate to EdPlan's student search page and attempt to locate the correct student record automatically.
3
Student matching must prioritize PA Secure ID # (exact match), fall back to Student ID (exact match), and finally fall back to First + Last Name with a mandatory user confirmation step.
4
When multiple search results are returned, the extension must pause and present a confirmation UI to the user before proceeding — it must never auto-select from ambiguous results.
5
When no matching student record is found, the extension must surface a clear error message and halt the sync without writing any data.
6
Data from the SPED product must be mapped to the correct EdPlan form fields. The field mapping must be configurable (not hardcoded) to allow updates without a full extension release.
7
The extension must provide a visible progress indicator during the sync operation so the user can monitor each step.
8
The extension must detect and gracefully handle EdPlan session timeouts, prompting the user to re-authenticate rather than failing silently.
9
The extension must include DOM change detection. If a required EdPlan field cannot be located, it must log the failure and notify the user rather than silently skipping the field.
10
All communication between the SPED web application and the extension must use Chrome's official extension messaging API (chrome.runtime.sendMessage). No credentials or sensitive PII should be transmitted beyond what is necessary to identify the student record.
11
The extension must be packaged for distribution as an unlisted Chrome extension and/or deployable via Google Workspace / Chrome Enterprise policy for school district IT environments.
12
The extension must read the active Streamline session cookie on the Streamline domain and use it to authenticate requests to the Streamline API to retrieve student records — the user must not be required to log into Streamline a second time.
13
Before initiating any sync, the extension must perform a pre-flight check verifying that both the Streamline session and the EdPlan session are active and valid. If either session is expired, the extension must clearly identify which session needs to be refreshed and prompt the user accordingly.
14
The Streamline frontend must only be required to pass a student identifier (e.g. student ID) to the extension to trigger a sync. The extension is responsible for fetching the full data payload from the Streamline API independently using the session token.

3.3 Non-Functional Requirements

1
Compatibility: Must function correctly in Google Chrome (latest 2 stable versions).
2
Manifest Version: Must be built using Manifest V3 (MV2 is deprecated and will cease to be supported).
3
Performance: Sync operations should complete within a reasonable time per record. Delays caused by EdPlan page load times are acceptable; delays caused by extension logic are not.
4
Security: No EdPlan credentials may be stored locally or transmitted to any external server at any point. Extension permissions must be scoped exclusively to the EdPlan domain.
5
Reliability: The extension must fail loudly — any unexpected state should surface a user-facing error rather than silently completing a partial sync.
6
Maintainability: Field mappings must be managed via a configuration file or admin interface, not hardcoded, to allow non-developer updates when EdPlan UI changes occur.

4. Out of Scope
The following items are explicitly excluded from this engagement unless separately agreed in writing:

	•	Background or scheduled syncing without an active, user-authenticated browser session
	•	Non-Chrome browser support (Firefox, Safari, Edge)
	•	Direct EdPlan API integration (no API is available at this time)
	•	Reading or extracting data from EdPlan back into the SPED product (write direction only, unless separately scoped)
	•	EdPlan account management, user provisioning, or school/district configuration
	•	Any modification to the SPED product's backend infrastructure
	•	Ongoing maintenance or support following project handoff (can be separately contracted)

5. Technical Stack & Constraints
The contractor is expected to make appropriate technology decisions within the following constraints:

	•	Chrome Extension Manifest V3 — required, not optional
	•	JavaScript / TypeScript — either is acceptable; TypeScript preferred for maintainability
	•	No external credential storage — no backend service may store EdPlan session data or user identifiers beyond what Chrome manages natively
	•	Source code must be delivered in a private Git repository with clear commit history
	•	The build process must produce both a development (unpacked) and production (zipped) distribution artifact

6. Assumptions & Dependencies

Assumption
Risk if Invalid
EdPlan's student search page structure matches the screenshot provided — standard HTML form with named input fields
Discovery/remapping work required before development can begin on student matching module
EdPlan does not employ CAPTCHA or advanced bot detection on its student search or IEP edit workflows
May require human-in-the-loop confirmation steps for each navigation action, increasing sync time
The SPED product can be updated to send student data and sync triggers to the extension via Chrome's messaging API
Requires coordinated development on the SPED product side; should be confirmed before contractor engagement begins
The contractor will be given a test EdPlan environment or guided session to map the relevant pages and fields prior to development
Without EdPlan access, field mapping will be based on screenshots alone, increasing rework risk
Target users operate in a Google Chrome browser environment managed by a school district
If users are on unmanaged devices, enterprise policy distribution may not be available

7. Suggested Milestones & Payment Structure
The following milestone structure is recommended for a fixed-price engagement. We ask that contractors include a proposed timeline against each milestone as part of their bid. Adjust percentages based on final negotiation.

#
Milestone
Deliverable / Acceptance Criteria
1
Project Kickoff & Discovery
EdPlan field mapping document, extension architecture plan
2
Core Extension — Session Detection & Search
Working extension that detects EdPlan session and executes student search
3
Data Entry Automation
Automated form fill from Streamline data with field mapping config
4
Messaging Bridge & User Confirmation Flow
Streamline integration, pre-flight session checks, progress UI, ambiguous match handling
5
Testing, QA & Documentation
Test suite, deployment guide, final packaged extension

8. Contractor Requirements
Candidates should be able to demonstrate the following:

	•	Proven experience building and publishing Chrome extensions using Manifest V3
	•	Portfolio links or GitHub repositories showing prior extension work are required
	•	Proficiency in JavaScript or TypeScript with DOM manipulation experience
	•	Ability to reliably select, read, and write to form elements in legacy HTML applications
	•	Understanding of Chrome extension security model
	•	Comfortable scoping permissions, content scripts, service workers, and messaging APIs
	•	Experience with browser automation patterns
	•	Familiarity with approaches used to interact programmatically with web UIs (similar to Playwright/Puppeteer logic, but within an extension context)
	•	Clear written communication in English
	•	This project requires active collaboration to refine field mappings and handle edge cases — communication quality matters

9. What We Will Provide

	•	Access to a test EdPlan environment or facilitated screen-share session to map all relevant pages and fields
	•	Documentation of all student data fields in the SPED product that need to be synced to EdPlan
	•	Access to the SPED product's frontend codebase for integration of the Chrome messaging bridge
	•	A designated technical point of contact available for questions throughout the engagement
	•	Timely review and feedback at each milestone — target 48-hour turnaround on milestone reviews

10. Intellectual Property
All work product, source code, and documentation produced under this engagement is considered work-for-hire and will be the exclusive property of the contracting company upon final payment. The contractor may not reuse, resell, or publish any portion of the deliverables without written consent.

Questions Before Bidding?
We encourage contractors to ask clarifying questions before submitting a proposal. We are happy to provide a screen-share walkthrough of the EdPlan interface and the SPED product to help you scope accurately. Proposals submitted with a detailed technical approach will be prioritized over those with only a price quote.
