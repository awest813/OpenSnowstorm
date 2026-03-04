## 2026-03-04 - Screen Reader Compatibility for Loading Bars
**Learning:** Loading progress bars that only rely on visual width scaling (`span` with dynamic `%` width) completely hide their progress context from screen readers. Since loading states can persist for several seconds (e.g., MPQ compression), this creates an ambiguous "dead zone" for visually impaired users.
**Action:** Always append `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` to dynamic width progress spans.
