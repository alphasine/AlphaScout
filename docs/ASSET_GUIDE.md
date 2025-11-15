# AlphaScout Asset Guide

## Logo/Icon Set (you create)
1. Design a square logo that works at 32px and 128px.
2. Export PNGs with transparent background:
   - `chrome-extension/public/icon-32.png`
   - `chrome-extension/public/icon-128.png`
3. After exporting, run `pnpm build` and verify the icon updates in the extension and Chrome Web Store preview.

## Screenshots & Marketing Graphics
1. Use the latest dev build (`pnpm dev`) and create demo data (Gemini planner + Groq navigator).
2. Capture at least:
   - Side panel conversation view
   - Options page provider settings
   - Speech-to-text permission screen
3. Store high-resolution PNGs in `docs/assets/` and reference them in README/Chrome Web Store listing.

## Chrome Web Store Copy
- **Short description (max 132 chars):** “AlphaScout is a local-first AI agent that automates websites using Gemini & Groq.”
- **Full description outline:**
  1. Elevator pitch (privacy, local execution).
  2. Key features (multi-agent flow, speech-to-text, playback).
  3. Setup steps (enter API keys, configure planner/navigator).
  4. Privacy statement (no cloud storage, open source).
- Link to [`PRIVACY.md`](../PRIVACY.md) under privacy section.
