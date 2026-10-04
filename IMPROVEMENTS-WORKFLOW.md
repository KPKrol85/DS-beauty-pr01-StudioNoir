# Studio Noir — Workflow Improvements

**Analysis date:** 2026-10-04
**Project type:** Static multi-page website (Vite MPA build; vanilla HTML, CSS custom properties, and ES modules; service worker with a build-generated precache; Netlify configuration) — Polish-language demonstration site for a hair studio, KP_Code Digital Studio
**Analysis mode:** Evidence-based workflow improvement review
**Focus:** Project-wide workflow

## Improvement overview

Studio Noir's development workflow is small and mostly coherent: four npm scripts (`dev`, `build`, `preview`, `test:nav`), a lockfile-based install (`npm ci`), canonical sources clearly separated from ignored `dist/` output, and a production build that doubles as the project's static validator through three guards in `vite.config.js`. Delivery is documented as a manual Netlify workflow, and there is no CI.

The weaker areas are process knowledge that currently lives only in commit history, archived reports, or individual task prompts: which existing command proves which contract, when a change earns a changelog entry, how a completed improvement report is finalized and archived, and in what order a manual release is prepared. In addition, two agent instruction files (`AGENTS.md`, `CLAUDE.md`) carry overlapping project rules that have already diverged.

The proposals below make these existing practices explicit in the documents that already own them. None introduces a new tool, dependency, script, or CI job.

## Proposed improvements

### IMP-WORKFLOW-01 — Document which existing command verifies which project contract

- **Affected workflow:** Local verification before committing and before delivery.
- **Evidence:** `package.json:12-17`; `vite.config.js:27-81` (precache plugin: placeholder check at line 46, undeclared root page and missing offline-fallback checks at lines 59-67); `vite.config.js:97-121` (CSS custom-property guard); `README.md:104-117` and `README.md:296-309` (development commands); `README.md:166` and `README.md:358` (precache guards only); `playwright.config.js:1-22`; `docs/archive/improvements/IMPROVEMENTS-QUALITY-2026-10-04.md:103` (verification used in practice: `npm run build`, `npm run test:nav`, `git diff --check`).
- **Current workflow:** The README lists `npm run build` only as "production build into `dist/`". In practice the build is also the project's static validation step: it fails on missing service-worker placeholders, on root-level pages not declared as build inputs, on a precache without `/index.html` or `/offline.html`, and on undefined CSS custom properties without a fallback. The README describes the precache guards inside the PWA section but does not mention the CSS custom-property guard at all. `npm run test:nav` covers only the shared navigation contract; service-worker and offline behavior can be checked only in `npm run preview`. The verification set actually used is recorded in archived report statuses, not in a maintained document.
- **Proposed improvement:** Add a short verification subsection to the README (PL and EN, next to the existing development commands) that maps change types to the existing commands: CSS, HTML pages, or `public/` changes → `npm run build` (with the guards it enforces); navigation markup, `js/nav.js`, or navigation styles → `npm run test:nav`; service worker, precache, or offline behavior → `npm run build` followed by `npm run preview`; every change → `git diff --check`.
- **Expected practical value:** Each task can select the smallest sufficient check without rediscovering what the build validates, and the CSS guard becomes visible to anyone who reads only the README. This directly supports the focused-verification rule already present in both agent instruction files.
- **Implementation scope:** README only, both language sections. Do not add, rename, or combine npm scripts; do not change the guards, Playwright configuration, or test scope. Missing test coverage remains a Quality topic.
- **Acceptance criteria:** The README names every build-time guard currently implemented in `vite.config.js`, including the CSS custom-property guard; maps each existing command to the contract it verifies; states that `test:nav` covers only the shared navigation and that service-worker behavior requires `preview`; and introduces no command that `package.json` or the installed tooling does not provide.
- **Impact:** High
- **Effort:** Small

### IMP-WORKFLOW-02 — Define when a change requires a changelog entry

- **Affected workflow:** Changelog maintenance.
- **Evidence:** `docs/CHANGELOG.md:1-24`; Git history of `docs/CHANGELOG.md` (only `bbe8085`, `575621d`, `c0daaaf`, and `df38ba5` added entries after `46111cd`); `6f8dc3e` (added Playwright, `playwright.config.js`, `tests/nav.spec.js`, and the `test:nav` script with no changelog entry); UI cycle commits `4c4e78a`, `112a25c`, `4251ba2`, `1a77fbc`, `a1097d8`, `8860748`, `803bfbe` (no changelog entries); `AGENTS.md:52`; `CLAUDE.md:61`.
- **Current workflow:** The changelog states that it documents "all significant changes", but whether an entry is written depends on whether the individual task prompt asks for one, because both agent instruction files permit changelog updates only when the task explicitly includes them. As a result, four of the five completed quality improvements have entries while the fifth — which introduced the project's only test tooling — does not, and none of the seven completed UI improvements has one. Every entry sits under `[Unreleased]`.
- **Proposed improvement:** State a short inclusion rule in the changelog itself (for example: user-visible behavior, accessibility, build and tooling, deployment, and dependency changes are recorded; status-only documentation bookkeeping is not), and make "changelog entry: yes/no" an explicit decision when an implementation task is defined, so the existing "only when the task includes it" rule has a predictable outcome.
- **Expected practical value:** The changelog becomes a reliable record of significant completed work instead of a partial one, and implementation tasks no longer depend on remembering to request an entry.
- **Implementation scope:** A brief rule at the top of `docs/CHANGELOG.md`. Reconciling the gaps listed above (at minimum the Playwright test tooling) is an owner decision and can follow as a separate documentation task. Do not introduce versioning, release tags, or generated changelogs; keep the existing section structure.
- **Acceptance criteria:** `docs/CHANGELOG.md` states which kinds of change are recorded and which are not; the rule is consistent with `AGENTS.md:52` and `CLAUDE.md:61`; applying the rule to the commits listed under Evidence yields an unambiguous yes/no for each.
- **Impact:** Medium
- **Effort:** Small

### IMP-WORKFLOW-03 — Document the improvement-report lifecycle and archive convention

- **Affected workflow:** Improvement-cycle maintenance and archiving.
- **Evidence:** `docs/archive/improvements/IMPROVEMENTS-UI-2026-10-04.md:1-16`; `docs/archive/improvements/IMPROVEMENTS-QUALITY-2026-10-04.md:1-24`; commit `e1c884b` (rename from the root to `docs/archive/improvements/` with 25% content change: `Completion date` and `Status` fields added, "Proposed improvements" renamed to "Completed improvements", "Selection summary" replaced by "Completion summary", limitations rewritten); commits `3dba0f4` → `744da10` and `1fe91e9` → `e1c884b` (full UI and Quality cycles); no reference to the archive or improvement reports in `README.md`, `AGENTS.md`, or `CLAUDE.md`.
- **Current workflow:** Two complete cycles follow the same unwritten convention: the active report lives at the repository root; each implementation commit updates the item's `Status`; the finished report is finalized (completion date, status, completion summary, pre-implementation fields preserved for traceability) and moved to `docs/archive/improvements/IMPROVEMENTS-<CATEGORY>-<completion date>.md`. The filename date is the completion date, not the analysis date (the UI report was analyzed on 2026-09-28 and archived as `-2026-10-04`). The convention is recoverable only from Git history and the archived files themselves.
- **Proposed improvement:** Record the convention in one place that already owns project maintenance rules — the README "Utrzymanie projektu / Project Maintenance" section — covering the active-report location, per-item status updates, the finalization fields, the archive path and filename date, and that archiving happens only when every item is resolved.
- **Expected practical value:** The next cycle — including this report — can be finalized and archived consistently without reverse-engineering earlier commits, and the active workspace keeps only open reports.
- **Implementation scope:** A few lines in both README language sections. Do not create a new documentation file, restructure `docs/`, or edit the archived reports.
- **Acceptance criteria:** The README describes the existing lifecycle and the `docs/archive/improvements/IMPROVEMENTS-<CATEGORY>-<YYYY-MM-DD>.md` pattern, states which date the filename uses, and is consistent with both existing archived reports.
- **Impact:** Medium
- **Effort:** Small

### IMP-WORKFLOW-04 — Document the manual Netlify release sequence

- **Affected workflow:** Production build preparation and manual delivery.
- **Evidence:** `README.md:130-143` and `README.md:322-335`; `netlify.toml:1-8`; `AGENTS.md:51` ("Follow the existing Git and manual Netlify delivery workflow"); `README.md:116-117` (offline behavior is checked in preview); `public/sitemap.xml` (`lastmod` maintained by hand).
- **Current workflow:** The README describes two mechanisms side by side: `netlify.toml` defines a Netlify-side build (`npm run build`, publish `dist`), and a manual CLI publish (`npx netlify deploy --prod --dir=dist`) uploads the local `dist/` after `npm run build`. The agent instructions call the delivery workflow manual. The README does not say which mechanism is the one in use, and the documented manual path goes straight from build to production publish without a step confirming that `dist/` was built from the committed tree or that the preview, offline fallback, and 404 page were checked. The Netlify CLI is fetched by `npx` at run time and is not pinned by the repository.
- **Proposed improvement:** State which delivery path the project actually uses and document it as a short ordered sequence built from existing commands: clean working tree, `npm ci`, `npm run build`, `npm run preview` with the offline and `/404.html` checks the README already describes, then the publish command; optionally note the CLI's non-production deploy as a pre-check before `--prod`.
- **Expected practical value:** Reduces the chance of publishing a stale or uncommitted `dist/` and makes each manual release repeatable in the same order.
- **Implementation scope:** README deployment section in both languages. Requires one owner decision: which delivery path is canonical. Do not add deployment scripts, CI/CD, or a Netlify CLI dependency, and do not change `netlify.toml` or `public/_redirects`.
- **Acceptance criteria:** The README identifies the canonical delivery path; lists the release steps in order using only existing commands; includes the preview checks it already documents elsewhere; and states that the Netlify configuration alone does not confirm an active deployment, as it does now.
- **Impact:** Medium
- **Effort:** Small

### IMP-WORKFLOW-05 — Keep shared agent rules in one canonical instruction file

- **Affected workflow:** Agent-assisted development instructions.
- **Evidence:** `AGENTS.md:1-71`; `CLAUDE.md:1-116`; commits `1da8cc3` and `b141419` (`b141419` rewrote both files in one commit); `AGENTS.md:17-28` (project orientation and context files — absent from `CLAUDE.md`); `CLAUDE.md:63-72` (commit guidance — absent from `AGENTS.md`); `.gitignore` (`.claude/`, `.codex/` local agent directories).
- **Current workflow:** Two agents work on the repository, and each reads its own instruction file. Both files restate the same project rules — task approach, source-of-truth handling, no unrequested Git actions, focused verification, reporting — in different wording and structure, and they have already diverged: only `AGENTS.md` names the project's context files and current stack, and only `CLAUDE.md` contains the commit-message rules. Any rule change must be made twice.
- **Proposed improvement:** Designate one file as the canonical source for project-wide rules, merge the content that currently exists in only one of them, and reduce the other file to agent-specific additions plus a reference to (or an import of) the canonical file, using a mechanism the respective agent supports.
- **Expected practical value:** Both agents work from the same project contract, and future rule changes are made once.
- **Implementation scope:** `AGENTS.md` and `CLAUDE.md` only. Preserve every currently stated rule unless the owner removes it deliberately. If these files are generated from global KP_Code templates, the de-duplication belongs in the template, and the project-local change should only mirror it.
- **Acceptance criteria:** Each shared rule is stated in exactly one file; the other file contains only agent-specific content and an explicit reference to the canonical file; the project orientation and the commit guidance are available to both agents; no rule present before the change is lost without an explicit decision.
- **Impact:** Medium
- **Effort:** Small

## Selection summary

- **Why these five:** Each formalizes a practice the project already follows or relies on — the build as validator, the changelog, the improvement-report cycle, manual Netlify delivery, and agent instructions — where current evidence shows the practice is undocumented, inconsistently applied, or duplicated. All five are documentation-level changes to files that already own the topic.
- **Processes strengthened:** Verification selection (01), change history (02), improvement-cycle maintenance (03), release preparation (04), and agent-assisted task execution (05).
- **Dependencies:** 04 can reference the verification map from 01 but does not require it. 02 and 05 touch related rules (`AGENTS.md:52`, `CLAUDE.md:61`); implementing 05 first leaves one changelog rule to align with 02. 04 needs an owner decision on the canonical delivery path. 01 and 03 are fully independent.
- **Scope:** Five Small proposals, each verifiable by reading the changed document against the evidence above — a practical candidate backlog for a focused working session, without a guarantee that all five fit into one day.
- **Considered but not selected:** Pinning the Node.js version for local and Netlify builds — `package.json:9-11` declares `engines`, but the repository has no version file and the Netlify build environment's Node version cannot be verified from the repository. Adding an aggregate `check` or `test` script — with one spec and a build that already runs every static guard, current evidence does not show repeated manual orchestration. CI integration of the regression test — no CI exists, and the archived Quality report deliberately left it out of scope.

## Analysis limitations

- Dependencies are not installed (`node_modules/` is absent), so no build, test, or preview command was run. Statements about guard and command behavior come from `vite.config.js`, `package.json`, `playwright.config.js`, and archived verification records, not from fresh execution.
- The Netlify site configuration, its build environment, and whether a deployment is active are not visible from the repository and were not checked.
- Confirmed documentation defects found during the analysis are outside this report: the README links `[CHANGELOG.md](CHANGELOG.md)` and lists `CHANGELOG.md` at the root, although the file moved to `docs/CHANGELOG.md` in `46111cd` (`README.md:90`, `README.md:193`, `README.md:282`, `README.md:385`); the project-structure trees omit `docs/`, `LICENSE.md`, `AGENTS.md`, and `CLAUDE.md`; and `README.md:15` and `README.md:207` describe template placeholders such as `[Nazwa firmy]` in the legal pages, none of which are present in `privacy.html`, `terms.html`, or `cookies.html`.
