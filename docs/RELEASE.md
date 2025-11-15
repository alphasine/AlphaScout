# AlphaScout Release Checklist

## 1. Prep
- [ ] Ensure `main` is clean and up to date.
- [ ] Update `package.json` version via `pnpm run update-version <x.y.z>`.
- [ ] Run `pnpm install`, `pnpm lint`, `pnpm type-check`, `pnpm build`.
- [ ] Load the unpacked `dist/` build in Chrome and smoke-test:
  - Gemini Planner + Groq Navigator flow
  - Speech-to-text interaction
  - Side panel follow-up task

## 2. Package & Upload
- [ ] `pnpm -F zipper zip` to create the Chrome Web Store upload zip in `dist-zip/`.
- [ ] Verify `dist/manifest.json` version and icons.
- [ ] Upload the zip to the Chrome Web Store dashboard, fill release notes, and submit for review.

## 3. GitHub Release
- [ ] Tag commit: `git tag v<x.y.z> && git push origin v<x.y.z>`.
- [ ] Draft GitHub Release using CHANGELOG highlights (link to Chrome Web Store listing once published).

## 4. Post-launch
- [ ] Update README badges/links if URLs changed.
- [ ] Share announcement (GitHub release, X/Discord message).
- [ ] Create tracking issue for any follow-up tasks discovered during release.
