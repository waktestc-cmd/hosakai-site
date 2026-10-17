# Components: exact markup and rules

Every component below exists in the CSS files in `assets/css/`. Use the markup as
written. If something you need is not here, compose it from these parts; do not
invent a new look. Contents:

1. Buttons · 2. Icon buttons and links · 3. Labels, IDs, keys · 4. Inputs and fields ·
5. Panels and notes · 6. Tables · 7. Tabs · 8. Status, marks, meters · 9. Page head ·
10. Toolbar · 11. Empty, loading and error states · 12. Popups · 13. The result sheet ·
14. Toasts · 15. Profile menu · 16. Dashboard hero (dial, facts, timeline)

---

## 1. Buttons

```html
<button type="button" class="ds-btn ds-btn--primary">Run assessment</button>
<button type="button" class="ds-btn ds-btn--secondary">Export</button>
<button type="button" class="ds-btn ds-btn--danger">Revoke agent</button>
<button type="button" class="ds-btn ds-btn--secondary ds-btn--sm">Copy</button>
```

| Variant | Light | Dark | When |
|---|---|---|---|
| primary | black fill `--fg-1`, white text | white fill, black text | the one main action of the area |
| secondary | transparent, `--border-control` border, `--fg-1` text | same | every other action |
| danger | `--red` border on `--red-surface`, `--fg-1` text | same | destructive confirmations only (Revoke, Delete) inside a popup |

- Height 36 (sm 30). Mono 12px, weight 500, UPPERCASE, letter-spacing 0.06em. Radius 4px. Icons 14px, gap 8.
- **At most one primary per page area** (page head, popup footer, sheet footer).
- **Never a red-filled button.** Never a gradient, shadow or rounded-full button.
- Hover: primary goes to `--fg-2`; secondary gets `--surface-2`. No movement.
- Disabled: opacity 0.5, `cursor: not-allowed`.
- Focus: 2px `--focus` outline, offset 2px.

## 2. Icon buttons and links

```html
<button type="button" class="hk-icon-btn" aria-label="Close"><i data-lucide="x" width="16" height="16"></i></button>
<button type="button" class="hk-icon-btn is-danger" aria-label="Delete run"><i data-lucide="trash-2" width="16" height="16"></i></button>
<button type="button" class="hk-link">Open in Rules</button>
```

32px square, transparent until hover. Every icon-only button has an `aria-label`.

## 3. Labels, IDs, keys

```html
<p class="ds-label">Last checked</p>          <!-- mono 12px caps, --fg-3 -->
<span class="ds-id">T1558.003</span>          <!-- mono 12px, tabular -->
<kbd class="ds-kbd">Ctrl K</kbd>              <!-- show ⌘K on Mac -->
```

## 4. Inputs and fields

```html
<label class="hk-field">
  <span class="ds-label hk-field__label">Assessment name</span>
  <input class="ds-input" id="name" type="text" />
  <span class="hk-field__hint">Shown in reports.</span>
</label>
<p class="hk-error-text">Enter a name.</p>

<label class="hk-search">
  <i data-lucide="search" width="15" height="15"></i>
  <span class="ds-sr-only">Search assessments</span>
  <input class="ds-input" type="search" placeholder="Search assessments…" />
</label>
```

Inputs: 36px, `--border-control` border, `--surface` fill, 14px sans, placeholder `--fg-3`,
focus = 2px `--focus` outline. Labels are real `<label>`s tied to their input.

## 5. Panels and notes

```html
<section class="hk-panel">…</section>                 <!-- or .ds-panel for padded 20px -->
<div class="hk-note"><i data-lucide="info" width="16" height="16"></i><span>One sentence.</span></div>
<div class="hk-note is-warn">…</div>  <div class="hk-note is-error">…</div>
```

A panel is `--surface`, 1px `--border`, radius 6px, **no shadow**. Do not nest panels
inside panels; use a `--well` box or a divider instead.

## 6. Tables

```html
<section class="hk-panel">
  <div class="hk-table-scroll">
    <table class="hk-table">
      <thead><tr><th>Assessment</th><th>Status</th><th>Runs</th></tr></thead>
      <tbody>
        <tr class="is-clickable" tabindex="0">
          <td><span class="hk-cell-title">Q3 AD Resilience</span><span class="hk-cell-sub">Bundle_1780348743982</span></td>
          <td><span class="hk-status is-ok">Executed</span></td>
          <td class="hk-num">5</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="hk-pager">…</div>
</section>
```

- Head row 40px, mono 12px caps `--fg-3`. Body rows 56px, 13px `--fg-2`; the row title 14px/500 `--fg-1` with a mono sub-line.
- Hover/focus row: `--surface-2`. Clickable rows are focusable and open on Enter.
- Numbers right where they compare, mono, tabular.
- At 1024 the page must not scroll sideways: the table fits, or scrolls inside `.hk-table-scroll`.

## 7. Tabs

```html
<div class="ds-tabs hk-tabs" role="tablist" aria-label="Filter by status">
  <button type="button" class="ds-tab" role="tab" aria-selected="true">All <span class="ds-tab__count">12</span></button>
  <button type="button" class="ds-tab" role="tab" aria-selected="false">Running</button>
</div>
```

In-page tabs filter or switch views of one thing. Pages of a section are **section tabs
in the shell** (see `typography-layout.md`), never in-page tabs.

## 8. Status, marks, meters

See `ice.md` §1–2 for the full table. Summary:

```html
<span class="hk-status is-ok">Detected</span>
<span class="hk-status is-run is-pulse">Checking…</span>
<span class="hk-status is-bad">Not detected</span>
<span class="hk-status is-idle">Not run</span>
<span data-ice-meter="80" data-cells="10"></span> <span class="hk-num">80%</span>
```

## 9. Page head (top of every page without a hero)

```html
<header class="ice-head">
  <canvas aria-hidden="true" class="ice-patch ice-head__ice" data-ice="drift" data-ice-amount="0.9"></canvas>
  <div class="ice-head__text">
    <p class="ds-label ice-head__eyebrow">Intel / Events</p>
    <h1 class="ice-head__title">Intelligence events</h1>
    <p class="ice-head__lede">Investigate observed campaigns, actors and techniques from connected sources.</p>
  </div>
  <div class="ice-head__actions"><button type="button" class="ds-btn ds-btn--primary">…</button></div>
</header>
```

Eyebrow = where you are. Title = what this is (sentence case, no full stop). Lede = one
sentence on what you can do here. Actions sit bottom-right (≤ 1 primary + 1 secondary).

## 10. Toolbar

```html
<div class="hk-toolbar">
  <h2 class="hk-toolbar__title">All assessments<span class="hk-toolbar__count">3</span></h2>
  <span class="hk-toolbar__spacer"></span>
  <label class="hk-search">…</label>
</div>
```

The toolbar is a sibling placed **before** the `.ds-panel` that holds the table, never a child of it.

## 11. Empty, loading and error states

```html
<div class="ice-state">                                <!-- add is-compact inside small boxes; is-error for errors -->
  <canvas aria-hidden="true" class="ice-patch" data-ice="even" data-ice-amount="0.6"></canvas>
  <div class="ice-state__body">
    <p data-prompt="hosakai runs --list"></p>
    <p class="ice-state__title">No runs yet</p>
    <div class="ice-state__more">Run this assessment to see which attacks your tools detect.
      <button type="button" class="ds-btn ds-btn--secondary ds-btn--sm">Run assessment</button></div>
  </div>
</div>
```

| State | Prompt | Title | More |
|---|---|---|---|
| empty | `hosakai <thing> --list` | "No <things> yet" | how to get the first one, + one button |
| filtered empty | `hosakai <thing> --filter <x>` | "Nothing matches" | "Clear the filter to see all <things>." |
| loading | `hosakai <thing> --fetch` | "Loading <things>…" | — |
| error (`is-error`) | `hosakai <thing>` | what failed, in plain words | what to do + "Try again"; the server's text only small, under "Details:" |

Never show raw error text (`TypeError: …`, "is not iterable") as the message.

## 12. Popups

```html
<div class="ds-scrim hk-scrim" data-popup hidden>
  <div class="ds-popup hk-pop" role="dialog" aria-modal="true" aria-labelledby="pop-title" tabindex="-1" style="width:min(520px,100%)">
    <header class="hk-pop__head">
      <span class="hk-pop__icon is-danger"><i data-lucide="ban" width="16" height="16"></i></span>
      <div class="hk-pop__titles"><h2 id="pop-title" class="hk-pop__title">Revoke agent</h2><p class="hk-pop__sub">DC01 · dc01-agent</p></div>
      <button type="button" class="hk-icon-btn" data-popup-close aria-label="Close"><i data-lucide="x" width="16" height="16"></i></button>
    </header>
    <div class="hk-pop__body"><p>This ends the agent's session. It will need a new licence key.</p></div>
    <footer class="hk-pop__foot">
      <button type="button" class="ds-btn ds-btn--secondary" data-popup-close>Cancel</button>
      <button type="button" class="ds-btn ds-btn--danger">Revoke agent</button>
    </footer>
  </div>
</div>
<script>HosakaiIce.openPopup(document.querySelector('[data-popup]'))</script>
```

Behaviour (the helper does all of it; in React use `assets/react/` patterns):
covers header and rail; Esc closes; focus moves in, stays in (Tab wraps), returns to the
opener on close; the page behind does not scroll; content scrolls **inside** the body.
Widths: 520 default, 640 for forms with lists. The popup must never be inside an
element with `transform`, `filter` or `isolation`.

## 13. The result sheet (one result, everything in view)

The full-screen sheet for one test result. Copy `assets/react/ResultDetailModal.tsx` +
`assets/css/result-sheet.css`. Anatomy, top to bottom:

1. **Header (`--surface`)**: row 1 = MITRE ID chip + tactic label … prev / `02 / 09` / next | close. Row 2 = title (26px) · affected object · started · duration · tool (label over value) · verdict box on the far right: `# COMPLETED → × NOT DETECTED` (mono 14px caps, glyph-coloured).
2. **Ice band** (24px): `held` / `broken` / `open` by the detection result.
3. **Body: two columns, `1.12fr | 0.88fr`, gap 16**, on `--bg-sunk`:
   - Left "Execution evidence": Execution details box (description ≤ 3 lines, the command as a typed `$` line, 8 fields in a 4×2 grid) → Output (1.55fr) beside Assessment (1fr), each scrolling inside → Raw payload, collapsed (`+ RAW PAYLOAD`), opens to ≤ min(20vh,180px).
   - Right "Detection evidence" + status: Provider check box (sentence + fields) → Detection query box (grows) → Provider response (0.6 share) / Detection payload.
4. **Footer**: `J next  K previous  Esc close` hints left; the one primary action right.

Rules: the sheet itself never scrolls at ≥ 980×640; each box keeps its place and scrolls
inside; terminal text does not wrap (`white-space: pre`, sideways scroll); boxes are
`--surface` with a 2px inset left accent in the status colour on the two "check" boxes.

## 14. Toasts

Bottom-left, 16px right of the rail, never over the header. A neutral card
(`--surface`; `--surface-3` in dark), radius 6, a 22px status square on the left:
green `✓` done, amber `!` warning, red `×` failed, mono `#` for plain messages. Close
button top-right. Newest in front; the stack opens on hover.

- React: `assets/react/sonner.tsx` (Sonner, `position="bottom-left"`, no `richColors`).
- Plain HTML: `HosakaiIce.toast({ title, description, tone: "ok"|"warn"|"error"|"info" })`.

Words: past tense for done ("Assessment created"), what happened + what to do for errors.

## 15. Profile menu

Avatar (28px circle, initials, mono) + chevron. Menu (240px, `--surface-3`, radius 6):
name + email → **Dark theme / Light theme** → Account settings → divider → Sign out.
Esc and outside click close it.

## 16. Dashboard hero

Copy, don't rebuild: `assets/react/IceHero.tsx`, `IceTimeline.tsx`, `dashboard-hero.css`.

- Grid `1.05fr | 0.95fr`, gap 40, padding 32 0.
- Left: eyebrow (`SECURITY OVERVIEW · SAFE SIMULATION · BASELINE V1 · CHECKED 3 DAYS AGO`) → the answer h1 (`clamp(32px,3.6vw,54px)`, weight 400, −0.035em) with the key phrase underlined 3px `--red`, offset 8px → lede (16px, `--fg-2`, max 56ch) → actions (primary "Fix first: …", secondary "Ask DIXIE") → facts row (22px numbers over `.ds-label`s, each a button; a 6px red dot after the Missed count) → "+ How this is measured".
- Right: the dial in its ice. SVG viewBox 300×300: track circle r128 stroke 2 `--border`; score arc r128 stroke 4 `--fg-1` from 12 o'clock clockwise; one segment per suite on r108, split into one 12px-stroke mark per test (gap 0.035 rad between suites, 0.006 between tests). Marks: held `--fg-1`; missed `--red`; detected on some machines dashed 3 2; what-if dotted 1 2; no answer `--fg-3` dashed 2 3; not released `--border` 1.5px. Number 76px weight 300 at y168; `OF 100` mono 13px at y194. Caption under it in `.ds-label`.
- Under it: "Score over time" (20px heading, 30D/90D/180D segmented buttons + date range), the line chart (viewBox 1000×240, line `--fg-1`, area 6% `--fg-1`, ice in the ground between the line and 100).
