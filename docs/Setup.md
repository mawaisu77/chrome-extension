# Setup Guide

## Prerequisites
- Chrome latest stable.
- Node.js 20+ and npm.

## Local Setup
1. Run `npm install`.
2. Run `npm run build`.
3. Open `chrome://extensions`.
4. Turn on Developer mode.
5. Click "Load unpacked" and select `dist`.

## Required Auth State
- User must already be signed in to Streamline.
- User must already be signed in to EdPlan.

## Triggering Sync
- In Streamline pages, click any element with `data-edplan-sync-student-id="<studentId>"`.
