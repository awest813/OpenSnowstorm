# OpenSnow — Diablo Roadmap

This roadmap tracks modernization and reliability work for the browser-based Diablo runtime.

Status legend:
- ✅ Done
- 🚧 In Progress
- 🔲 Planned
- ⏸ Deferred

---

## 2026 Strategic Objectives

1. **Stabilize architecture boundaries** between app shell, worker, storage, and transports. ✅
2. **Modernize the toolchain** to reduce contributor setup friction and build times. ✅
3. **Increase multiplayer reliability** with better diagnostics and recovery UX. ✅
4. **Improve accessibility and mobile UX** without regressing core gameplay behavior. 🚧
5. **Raise confidence** through targeted unit, integration, and regression coverage. 🚧

---

## Phase 0 — Completed Foundations

- ✅ Worker extraction and loader boundary setup (`src/api/loader.js`, `src/api/game.worker.js`)
- ✅ Input module extraction for file drop and event listener lifecycle
- ✅ Unit tests for packet handling, codec, and key extracted modules
- ✅ Save manager and UI decomposition started from monolithic app flow
- ✅ Build and architecture docs established (`README.md`, `docs/build-guide.md`, architecture docs)

---

## Phase 1 — Application Surface Decomposition

**Goal:** keep `App.js` focused on composition, routing of intent, and top-level state.

### Completed
- ✅ Touch control state machine extraction
- ✅ Keyboard and mouse handler extraction
- ✅ Session lifecycle extraction into dedicated engine/session module
- ✅ Error overlay and save manager isolation
- ✅ Loading/start screen isolation from core orchestration logic

- ✅ Extract touch state machine from `App.js` into `src/input/touchControls` with unit tests
- ✅ Extract game session lifecycle (start / stop / reset / error) into `src/engine/session.js`
- ✅ Extract save-file management UI into `src/ui/SaveManager` (self-contained, own state)
- ✅ Extract error reporting overlay into `src/ui/ErrorOverlay`
- ✅ Extract MPQ compression UI into `src/ui/MpqCompressor` (moved from `src/mpqcmp/index.js`)
- ✅ Introduce centralized error reporter with diagnostics sink (`src/api/errorReporter.js`)
- ✅ Extract keyboard handling into `src/input/keyboard.js` with unit tests
- ✅ Extract mouse handling into `src/input/mouseHandlers.js` with unit tests
- ✅ Extract loading and start screen UI into `src/ui/LoadingScreen` and `src/ui/StartScreen`
- ✅ `App.js` LOC reduced by 45% (693 → 381 lines); all extracted modules have unit tests
- ✅ Introduce formal session context (React Context) so UI components don't depend on `App` internals

---

## Phase 2 — Toolchain Modernization

**Goal:** replace legacy CRA/Webpack-4 constraints with a maintainable modern stack.

- ✅ Evaluate Vite + React 18 migration track (preferred) vs Webpack 5 fallback — Vite 6 chosen
- ✅ Migrate bundler — Webpack 4 → Vite 6; workers use `?worker`, WASM uses `?url`, `.jscc` files wrapped via custom Vite plugin; build: 149 modules in ~1.6s
- ✅ Upgrade React from 16 to 18 (createRoot, IS_REACT_ACT_ENVIRONMENT, updated tests)
- ✅ Upgrade Jest to 29 + jsdom 20+ (moduleNameMapper for binary assets, transform API, window.location fix)
- ✅ Replace legacy ESLint plugin set (eslint@5 + babel-eslint) with eslint@8 + @babel/eslint-parser + react/react-hooks/jsx-a11y plugins; lint step added to CI
- ✅ Measure and record before/after: prod build was ~60s (Webpack 4) → ~1.6s (Vite 6); dev startup: cold HMR now ~300ms vs ~15s
- ✅ Verify `--openssl-legacy-provider` workaround is no longer needed — removed from CI; Node 20 → 22
- ✅ Document new contributor setup steps (see `docs/build-guide.md`; clone-to-running target met)

---

## Phase 3 — Runtime Boundary Hardening

**Goal:** prevent lifecycle leaks and reduce implicit coupling across modules.

- ✅ Define formal worker message types (request / response / event schemas) — `src/api/workerMessages.js`
- ✅ Add adapter shim so existing implicit messages continue to work during migration — `WorkerToMain` / `MainToWorker` constants used in both `loader.js` and `game.worker.js`
- ✅ Split loader adapters: separate render, audio, fs, and transport concerns — `renderAdapter.js`, `audioAdapter.js`, `fsAdapter.js`, `transportAdapter.js`
- ✅ Introduce explicit lifecycle disposal (interval cleanup, listener teardown, worker terminate) — `transportAdapter.dispose()` + `dispose()` path in `loader.js`
- ✅ Add worker startup/shutdown integration tests (no leaked intervals or listeners after teardown) — `transportAdapter.test.js`, `renderAdapter.test.js`, `audioAdapter.test.js`, `fsAdapter.test.js`, `workerMessages.test.js`
- ✅ Add storage service API with explicit operations (list / import / export / delete / clear) — `fs.list()` added to both live and fallback implementations
- ✅ Make storage errors surface to UI instead of silently falling back to in-memory stubs — `fs.initError` exposed; `App.js` renders a storage warning banner

---

## Phase 4 — Multiplayer Reliability and Visibility

**Goal:** make multiplayer failures diagnosable and recoverable by users.

- ✅ Introduce transport abstraction (`Transport` interface with PeerJS/WebSocket adapters) — `src/api/transports/index.js`, `peerjsTransport.js`, `websocketTransport.js`
- ✅ Add structured connection lifecycle logging and error categorization — `src/api/multiplayerDiagnostics.js` + transport lifecycle hooks
- ✅ Expose connection status in UI (`connecting`, `connected`, `retrying`, `failed`) — `src/ui/MultiplayerStatusBanner.js`
- ✅ Add guided recovery actions (retry, reconnect, copy session ID, share link) — banner actions wired through loader transport controls
- ✅ Add handshake/version checks to reduce protocol mismatch failures — diagnostics classify reject/version protocol mismatch paths
- ✅ Add compatibility regression tests for common join/host flows — `src/api/transports/peerjsTransport.test.js`, `src/api/transports/websocketTransport.test.js`, `src/api/transports/index.test.js`
- ✅ Publish self-host relay server documentation for advanced users — `docs/self-host-relay.md`

---

## Phase 5 — UX, Accessibility, and Performance

**Goal:** iterative improvements that preserve gameplay correctness.

### Mobile & Touch
- ✅ Layout presets for touch controls (`default`, `compact`, `thumb` presets)
- ✅ Better two-finger pan sensitivity calibration (low/normal/high thresholds)
- ✅ Gesture conflict handling (tap/pan/long-press)
- ✅ First-run onboarding for MPQ import on mobile (dismissible and persisted)

### Accessibility
- ✅ Keyboard-operable overlay controls
- ✅ Focus trap + return-focus behavior for dialogs
- ✅ Improved ARIA labeling and semantic landmarks in app chrome
- ✅ Optional high-contrast UI mode (outside core game rendering)

### UI Polish
- ✅ Diablo-themed start screen with game title header
- ✅ Smooth button transitions and hover animations
- ✅ Improved dialog visual hierarchy and typography
- ✅ Enhanced loading screen progress indicator styling
- ✅ Consistent gold/dark color palette across all overlays

### Performance
- ✅ Reduce startup main-thread blocking
- 🔲 Profile worker hotspots and optimize render patch pipeline
- ✅ Lazy-load MPQ compression tooling (loaded only when compressor UI opens)
- ✅ Add bundle-size budget checks in CI (`npm run check:bundle-budget`)

### PWA & Offline
- 🔲 Clear service-worker update UX
- 🔲 Reliable offline shareware mode with deterministic precache
- 🔲 Better timing for install prompt surfacing

---

## Phase 6 — Community and Ecosystem Growth

**Goal:** lower the barrier to contribution, improve documentation coverage, and build toward a sustainable maintenance model.

### Documentation
- 🔲 Interactive architecture diagram (Mermaid or equivalent, embedded in docs)
- 🔲 Troubleshooting FAQ for common MPQ import and browser compatibility issues
- 🔲 Video walkthrough of contributor setup and first PR workflow
- 🔲 Changelog generation from conventional commit messages

### Developer Experience
- 🔲 Devcontainer / Codespaces support for zero-setup contributor onboarding
- 🔲 Pre-commit hooks for lint and format checks (Husky or equivalent)
- 🔲 Per-PR bundle size reporting (comment on PR with size diff vs base)
- 🔲 Automated dependency update PRs (Renovate or Dependabot configuration)

### Testing & Quality
- 🔲 E2E smoke tests for critical flows (shareware load, save import, MPQ import)
- 🔲 Visual regression tests for start screen and overlay components
- 🔲 Code coverage thresholds enforced in CI

### Feature Expansion
- 🔲 Save file browser with player stats and class icons
- 🔲 In-app changelog / release notes overlay (shown on version bump)
- 🔲 Keyboard shortcut reference overlay (accessible from start screen)
- ⏸ Gamepad/controller input mapping
- ⏸ Optional cloud save sync (would require backend)

---

## Deferred / Under Consideration

- ⏸ TypeScript migration (revisit after toolchain stabilization)
- ⏸ Advanced low-latency audio scheduling improvements
- ⏸ Official Dockerized relay reference deployment

---

## Safe Fix Roadmap — Performance + High/Medium Impact Improvements

**Objective:** deliver measurable responsiveness and reliability gains without changing gameplay rules or risky engine internals.

### Prioritization rules
- **High impact (H):** expected user-facing improvement to load time, frame pacing, connection stability, or crash rate.
- **Medium impact (M):** meaningful quality, DX, or reliability improvement with narrower scope.
- **Safety bar:** default to incremental, reversible changes with feature flags or clear rollback path.

### Track A — Performance fixes (safe-first)

#### A1. Startup and load-time wins (H)
- 🔲 **Defer non-critical initialization until after first frame** (analytics/diagnostics hydration, optional UI helpers).
  - Success metric: lower Time to Interactive and faster first render on mid-tier mobile.
  - Safety: gate each deferred task behind explicit `postStart` hooks.
- 🔲 **Add route/component-level lazy boundaries for non-core overlays** (help/about/changelog panels if bundled in main path).
  - Success metric: reduced initial JS payload.
  - Safety: keep preload fallback for common path to avoid UX regressions.
- 🔲 **Precompute and cache deterministic derived UI state** used during loading/start screen.
  - Success metric: lower render churn before session start.
  - Safety: memoized selectors with unit snapshots.

#### A2. Runtime frame stability (H)
- 🔲 **Profile and cap expensive overlay re-renders** (status banners, dialogs, touch controls) with memoization and stable callbacks.
  - Success metric: fewer long tasks and reduced dropped frames on touch devices.
  - Safety: add focused interaction tests for affected controls.
- 🔲 **Batch non-urgent UI state updates** from worker/transport events where possible.
  - Success metric: fewer React commits under multiplayer event bursts.
  - Safety: preserve ordering guarantees for gameplay-critical events.
- 🔲 **Throttle debug/diagnostic logging in hot paths** while preserving structured error events.
  - Success metric: lower CPU overhead in sustained sessions.
  - Safety: keep full logs behind opt-in debug mode.

#### A3. Memory and resource lifecycle (M)
- 🔲 **Add periodic leak checks in dev/test for listeners, timers, and worker handles** after session teardown.
  - Success metric: zero growth after repeated start/stop cycles.
  - Safety: no production behavior changes; test-only guardrails.
- 🔲 **Audit binary buffer retention in file import/export flow** to ensure prompt release.
  - Success metric: lower memory spikes during MPQ/save operations.
  - Safety: add regression tests around repeated imports.

### Track B — Other safe high/medium impact fixes

#### B1. Reliability and recovery (H)
- 🔲 **Connection recovery hardening**: exponential backoff caps + clearer terminal failure states.
  - Success metric: improved reconnect success rate and fewer user-abandoned sessions.
  - Safety: retain manual reconnect and rollback to current strategy via config toggle.
- 🔲 **Storage readiness checks before session start** with actionable preflight messages.
  - Success metric: fewer mid-session storage errors.
  - Safety: read-only preflight first, no migration side effects.

#### B2. Quality guardrails in CI (M)
- 🔲 **Performance budget gates for critical bundles and worker payload** (warning then fail threshold).
  - Success metric: prevent slow bundle creep.
  - Safety: phased rollout (warn-only for first week).
- 🔲 **Add smoke benchmark script** (cold start, session start, teardown loop) for trend tracking.
  - Success metric: detectable regressions before release.
  - Safety: non-blocking reporting initially.

#### B3. Accessibility + UX polish with low risk (M)
- 🔲 **Reduce motion option for non-gameplay UI animations**.
  - Success metric: better comfort and accessibility compliance.
  - Safety: scoped to overlays/chrome; no core renderer impact.
- 🔲 **Improve error message taxonomy** (network/storage/import) with direct next steps.
  - Success metric: faster user recovery and fewer duplicate bug reports.
  - Safety: text/UX-only changes plus snapshot tests.

### Suggested execution order (safe rollout)
1. **Weeks 1–2:** baseline profiling + instrumentation; land A1 quick wins and B2 warn-only budgets.
2. **Weeks 3–4:** land A2 render/update optimizations with targeted regression tests.
3. **Weeks 5–6:** ship B1 reliability improvements and A3 memory guardrails.
4. **Weeks 7–8:** complete B3 UX/accessibility items and tighten CI thresholds from warn to fail where stable.

### Definition of done for this roadmap slice
- At least **3 high-impact items** shipped with before/after measurements.
- No gameplay behavior regressions in smoke + unit/integration checks.
- New guardrails (budget/benchmark/leak checks) enabled in CI to keep gains durable.

---

## Contribution alignment

If you want to contribute against this roadmap:

1. Choose a 🔲 planned item and open a scoped issue first.
2. Describe expected behavior changes and risks.
3. Land work in small PRs with tests where feasible.
4. Update docs when workflows, setup, or user-visible behavior changes.
5. Prefer adding tests alongside feature work; the test suite should grow, not shrink.
