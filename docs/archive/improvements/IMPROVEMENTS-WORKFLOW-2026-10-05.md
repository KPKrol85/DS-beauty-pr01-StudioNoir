# Studio Noir — Workflow Improvements

**Analysis date:** 2026-10-04

**Completed and archived:** 2026-10-05

**Status:** COMPLETED — all five selected improvements closed.

**Scope:** Project-wide development workflow, verification, documentation, release preparation, and agent instructions.

## Overview

Five workflow improvements were completed, covering verification guidance, changelog maintenance, improvement-report archiving, manual Netlify releases, and shared agent instructions.

The work documented established engineering practices without introducing new dependencies, npm scripts, CI infrastructure, or deployment automation.

The project owner subsequently adopted a simplified documentation model. This retained the core workflow while replacing lengthy completed-improvement records with concise summaries and keeping `AGENTS.md` focused on stable agent guardrails.

## Completed improvements

### IMP-WORKFLOW-01 — Document which existing command verifies which project contract

- **Status:** COMPLETED — implemented and verified.
- **Result:** Added Polish and English README guidance mapping existing commands to their verification responsibilities. Documented `npm run build` and its service-worker, page-input, offline-fallback, and CSS custom-property guards; `npm run test:nav` for navigation regression; `npm run preview` for production PWA checks; and `git diff --check` for patch validation. Preserved existing scripts and tooling.
- **Verification:** Static inspection confirmed the README descriptions against `package.json`, `vite.config.js`, and `playwright.config.js`. No new tests, scripts, or build guards were introduced. Commands were not rerun for this documentation change.
- **Impact:** High
- **Effort:** Small

### IMP-WORKFLOW-02 — Define when a change requires a changelog entry

- **Status:** COMPLETED — implemented and verified.
- **Result:** Added an entry policy to `docs/CHANGELOG.md` defining significant changes and excluding routine documentation bookkeeping and minor implementation details. Established an explicit `Changelog: yes` or `Changelog: no` decision for implementation tasks. Preserved the existing changelog structure and task-scoped editing rules.
- **Verification:** Static inspection confirmed the policy and its distinction between significant changes and administrative updates. Historical gaps, including the original Playwright tooling addition, were not reconciled during this improvement.
- **Impact:** Medium
- **Effort:** Small

### IMP-WORKFLOW-03 — Document the improvement-report lifecycle and archive convention

- **Status:** COMPLETED — implemented and verified.
- **Result:** Documented the active-report location, completion requirements, archive destination, and completion-date filename convention in both README languages. The original detailed completion-record format was subsequently superseded by the owner-approved concise `Status`, `Result`, `Verification`, `Impact`, and `Effort` records in `AGENTS.md`.
- **Verification:** Static inspection confirmed the archive structure and original lifecycle guidance in both README languages; no runtime checks were needed. When this record was standardized (2026-10-10), README still contained the earlier detailed-record instructions pending separate synchronization.
- **Impact:** Medium
- **Effort:** Small

### IMP-WORKFLOW-04 — Document the manual Netlify release sequence

- **Status:** COMPLETED — implemented and verified.
- **Result:** Established manual Netlify CLI deployment of the locally generated `dist/` as the documented canonical release path. Added an ordered procedure in both README languages: clean working tree, `npm ci`, `npm run build`, production preview with PWA/offline/404 checks, and `npx netlify deploy --prod --dir=dist`. Preserved `netlify.toml`, routing configuration, and existing build tooling.
- **Verification:** Static inspection confirmed the documented commands, their order, and consistency with repository configuration. The README distinguishes local Vite preview from Netlify-specific routing and headers. No production release was performed or verified during this documentation task.
- **Impact:** Medium
- **Effort:** Small

### IMP-WORKFLOW-05 — Keep shared agent rules in one canonical instruction file

- **Status:** COMPLETED — implemented and verified.
- **Result:** Consolidated shared development instructions in `AGENTS.md` and reduced `CLAUDE.md` to an `@AGENTS.md` import of the canonical file. The owner subsequently simplified `AGENTS.md` to stable engineering guardrails, verification expectations, delivery safety, reporting rules, and concise completed-improvement records, leaving architecture and conventions to the repository and approved task scope.
- **Verification:** Static inspection confirmed that `CLAUDE.md` imports `AGENTS.md` without duplicate project rules, and that the simplified contract preserved source-of-truth handling, scope control, accessibility safeguards, focused verification, and restrictions on unrequested repository actions. No application tests were necessary.
- **Impact:** Medium
- **Effort:** Small

## Excluded observations

The original workflow review identified additional concerns outside its five approved improvements:

- **Historical changelog gaps:** Earlier significant changes were not consistently recorded. Backfilling them requires a separate decision.
- **Node.js version pinning:** The repository declared supported engine ranges, but adding a dedicated version file or verifying the Netlify build environment was not included.
- **Aggregate checks and CI:** A combined verification script and automatic execution of Playwright were considered but not implemented.
- **README documentation accuracy:** The original analysis identified outdated changelog references, incomplete project trees, and incorrect descriptions of legal-page placeholders. These were corrected separately in later documentation work.

These are historical observations and scope decisions, not confirmation of current defects.

Aligning the original improvement-report lifecycle guidance with the newer completion-record standard in `AGENTS.md` was a separate documentation task outside the completed workflow cycle.

## Verification limitations

The original workflow analysis relied on repository inspection without installed dependencies. No build, browser tests, production preview, or deployment were performed during discovery.

The completed improvements primarily changed documentation. Their verification consisted of checking instructions against existing scripts, source files, configuration, and repository structure.

The documented Netlify release procedure was not executed as part of the workflow cycle. Repository configuration alone does not establish the status of a live deployment.

No additional runtime tests were performed solely for this archival standardization.

This document records historical workflow decisions and their subsequent evolution. Current repository files and the approved task scope remain the technical source of truth.
