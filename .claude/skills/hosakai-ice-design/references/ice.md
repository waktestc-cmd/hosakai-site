# The ice: concept, symbols, placement, motion

## The idea in one paragraph

Your defences are **the ice**. HOSAKAI runs safe test attacks through it and shows
where it **held** and where it **broke**. The ice is drawn with the characters
`. : + * #` (thin to solid). Because the characters already mean "how solid", they
are used two ways: as **texture** (a field of glyphs drawn on a canvas) and as
**language** (a single glyph next to every status word). The concept comes from
memorable.sh: black and white, a field of mono characters, near-square corners.

If you remember one thing: **the ice is never random decoration. Dense means held,
red means broken, thin means not known yet.**

## 1. The symbol language (status)

Every status in the app is **one glyph + the app's own word**. Never colour alone,
never a dot, never an emoji.

| Glyph | Meaning | Colour (glyph) | Colour (word) | Tone class | Examples of the word (keep the app's words) |
|---|---|---|---|---|---|
| `#` | solid ice: done, detected, healthy, ready | `--green` | `--green-text` | `is-ok` | Detected, Executed, Completed, Active, Online, Published, Ready, Approved |
| `+` | ice forming: running, waiting, checking | `--amber` | `--amber-text` | `is-run` | Running, Pending, Checking…, Waiting telemetry, Draft, Pending approval |
| `×` | broken ice: missed, failed, error | `--red` | `--red-text` | `is-bad` | Not detected, Missed, Failed, Provider error, Offline, Rejected, an agent's REVOKED |
| `.` | no ice yet: not run, idle, unknown | `--fg-3` | `--fg-3` | `is-idle` | Not run, Not executed, Skipped, No change, Not activated, Dismissed |

Which tone a word gets depends on its area. Copy it from `status-lookup.md`; never decide it here.

**Live states** (still happening: running, checking, waiting) animate the glyph through
`. : + * #` every 1.4s in 5 steps (`.ice-mark.is-live`, or `.hk-status.is-pulse`).
Under reduced motion the glyph stays `+`.

How to write it:

```html
<!-- preferred: the status class draws the glyph itself -->
<span class="hk-status is-ok">Executed</span>
<span class="hk-status is-run is-pulse">Running</span>
<span class="hk-status is-bad">Failed</span>
<span class="hk-status is-idle">Not executed</span>
<span class="hk-status hk-status--mono is-bad">NOT DETECTED</span>   <!-- mono caps form for verdicts -->

<!-- or a standalone mark beside any word -->
<span class="ice-mark is-ok" aria-hidden="true"></span> Detected
```

The word must still make sense with the glyph hidden (screen readers ignore it).

## 2. Meters drawn in ice

Any proportion is drawn as `#` for the filled share and `·` for the rest, in mono.

```html
<span data-ice-meter="67" data-cells="16" data-tone="ok"></span> <span class="hk-num">67%</span>
```

| Use | cells | tone |
|---|---|---|
| a percentage in a table cell | 10–16 | `ok` / `run` / `bad` by meaning, `plain` if neutral |
| a share in a stat block | 24 | tone of the thing counted |
| a big posture meter | 32 | by band: strong `ok`, moderate `run`, weak `bad` |
| severity (4 levels) | 4 | `plain` (severity is not a failure) |

Always print the number beside the meter. The meter is a picture of the number.

## 3. The texture: where ice appears

| Place | Piece | Shape | Amount | Notes |
|---|---|---|---|---|
| Icon rail, between the groups | `IceField` | `rise` | 0.8 | on every page |
| Section tab bar, right end | `IceField` | `drift` | 0.9 | flex: 1 after the tabs |
| Page head, right 65% | `PageHead` (`.ice-head__ice`) | `drift` | 0.9 | behind empty space, never behind the title |
| Empty / loading / error states | `IceState` | `even` | 0.6 | with a typed `$ command` and one sentence |
| Sign-in brand panel | `IceField` | `corner` | 1 | its own band between logo and headline |
| Dashboard dial | custom (see `assets/react/IceHero.tsx`) | ring | — | dense around the ring, red next to missed marks |
| Timeline chart | custom (see `assets/react/IceTimeline.tsx`) | between line and 100 | — | the open ground still to win |
| Result sheet, under the header | `IceBand` | `held` / `broken` / `open` | 2.8 / 1.8 / 0.8 | dense when detected; red gap when missed |

Never put ice:
- behind words, numbers, tables or form fields (it must sit in empty space);
- as a page background filling everything;
- in buttons, inputs, menus, toasts (toasts use a single `#` mark only);
- above 0.35 opacity (the engine caps it; do not override).

Ice canvases are always `aria-hidden="true"` and `pointer-events: none`.

## 4. The engine: fixed numbers (do not change)

The engine is `assets/js/hosakai-ice.js` (plain JS) or `assets/react/engine.ts` (React).
Both use exactly these values.

| Constant | Value | What it does |
|---|---|---|
| Characters | `" .:+*#"` | index 0 is blank; never reorder or add |
| Cell | 14px (12px for the band) | grid step between glyphs |
| Glyph size | `round(cell × 0.86)` px, the canvas's `font-family` (Geist Mono) | |
| Noise | `frac(sin(x·127.1 + y·311.7 + k·74.7) · 43758.5453)` | stable per cell |
| Draw a cell when | `noise ≤ density × 0.55 + 0.004` | sparse where density is low |
| Opacity | `(0.07 + 0.28 × min(1, density)) × settle` | max 0.35 |
| Accent (red) cells | drawn when `noise ≤ 0.7`, opacity 0.75, level 0.9 (`#`) | |
| Settle-in | 1100ms; each cell appears at `settle × 1.6 − noise × 0.6` | the field fades in unevenly |
| Turnover | every 420ms, 6% of cells pick a new character | "the ice moving" |
| Stops when | off screen (IntersectionObserver), tab hidden, `prefers-reduced-motion` | drawn once, still |
| Colours | glyph = the canvas's CSS `color`; accent = its `border-top-color` | themes need no code |

Density shapes (u, v are 0..1 across and down the box):

| Shape | Formula | Looks like |
|---|---|---|
| `rise` | `v^2.2` | thick at the bottom, gone by the top |
| `drift` | `u^2.4 × (0.55 + 0.45·sin(π·v))` | thick on the right, fading left |
| `corner` | `max(0, 1 − dist((u,v),(1,0)) / 1.05)^1.8` | thick at the top-right corner |
| `even` | `0.35` | an even sprinkle |

Band states: `held` amount 2.8, no accent; `broken` amount 1.8, accent cells where
`0.4 + 0.05·sin(0.37x) < u < 0.6 − 0.05·sin(0.37x)` (a ragged gap in the middle);
`open` amount 0.8.

The dial's own ice (dashboard only; copy `assets/react/IceHero.tsx`, do not re-derive):
- `R = 0.43 × dial width`; cells inside `1.06R` are skipped (the dial stays clean).
- `ring = exp(−(d − 1.2R)² / (2·(0.32R)²))`, `field = 0.015 + 0.2·ring`; a cell is drawn when `noise ≤ field·2.2 + 0.02`.
- Opacity `0.06 + 0.24·ring` (× settle). Cells within `1.55R` whose angle falls on a missed test's arc (±0.05 rad) are red at 0.7.
- Every 9th tick, red cells with `hash(x, y, tick) < 0.35` glitch for one frame: drawn at level 0.5, opacity 0.35, shifted 3px right.

## 5. Terminal touches (motion)

All decorative, all off under reduced motion, all play once except the ice itself
and live status glyphs.

| Effect | Where | Exact behaviour |
|---|---|---|
| Typed prompt | empty/loading/error states, command lines, log headers | `$ ` in `--red-text`, then the command typed 1 char / 28ms, then an 8×15px `--fg-1` block cursor that blinks 3 times (1s, steps) and stays solid. Error states draw the cursor in `--red`. |
| Scramble | at most 3 key numbers per page (dial score, top counts) | for 520ms the not-yet-fixed characters are random from `#*+:.0123456789`, fixing left to right; screen readers get the real value |
| Ice settle + turnover | every ice field | see the engine table |
| Forming glyph | live statuses | `. : + * #`, 1.4s, `steps(1)` |
| Missed-mark glitch | dashboard dial only | every 9th 420ms tick |
| Page arrival | page content | opacity 0 → 1, 200ms. **Opacity only**: never translate, scale or blur |
| Popup arrival | popups | opacity fade, 320ms |

Never: bouncing, sliding cards, hover lifts, parallax, glow, pulsing shadows, confetti,
loops longer than the live state they show.
