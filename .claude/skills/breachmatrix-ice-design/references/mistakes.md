# Mistakes people and agents make (and the fix)

Each line was a real mistake during the build, or is one a fresh agent makes by default.
IDs in brackets are checked by `scripts/check_design.py`.

## Colour

| Wrong | Right |
|---|---|
| `color: #666` / `background: #f5f5f5` [C1] | `var(--fg-3)` / `var(--bg-sunk)` |
| Inventing `--grey-light`, `--text-muted`, `--primary` [C2] | the tokens in `tokens.md` only |
| A red primary button, or a red "Run" button [C3] | black (light) / white (dark) primary; red never fills a button |
| Red for anything that isn't missed/failed (headers, links, icons for fun) | red means broken ice; everything else is black, white and grey |
| Green/amber on the dashboard answer | the dashboard stays black, white and red |
| Full red `#E50914` for small red text | `--red-text` (`#B20710` light, `#FF4D57` dark) |
| Status shown as colour only (a coloured dot, a coloured row) | glyph + word, colour last |
| Gradients, glows, coloured shadows [C4] | flat fills, 1px hairlines |
| Pure white page with white panels and no border | panels always have a 1px `--border` |
| Inverting light to make dark | both themes come from the token file |

## Type

| Wrong | Right |
|---|---|
| Inter, Space Grotesk, IBM Plex, system serif [T1] | Geist + Geist Mono, nothing else |
| Bold 700 headings, ALL CAPS headings | 400–500, sentence case |
| Labels in sans, bold, or coloured | `.ds-label`: mono 12px caps 0.08em `--fg-3` |
| 15.5px, 18px, 21px and other one-offs [T2] | the scale in `typography-layout.md` |
| Numbers that jump as they change | `font-variant-numeric: tabular-nums` |

## Shape and layout

| Wrong | Right |
|---|---|
| `border-radius: 8px/12px/16px`, pills [S1] | 2 / 4 / 6px, 50% only for dots |
| Card shadows, hover shadows [S2] | border only; `--shadow-popup` only on popups/menus/toasts |
| Toolbar (title, search, filters) inside the table panel, touching its edges | the toolbar sits above the panel; the panel holds only the table and pager |
| Guessing a status colour (REVOKED grey for agents, NEW grey for rules) | copy the tone from `status-lookup.md` |
| Cards inside cards | one panel; a `--well` or a divider inside |
| A 240px side panel listing sub-pages | the 44px section tab bar |
| Duplicating the section tabs inside the page | the shell's tab bar is the only one |
| Theme toggle as a header button | a menu item in the profile menu |
| Page scrolls sideways at 1024 | tables fit or scroll inside their panel |
| Centred everything | left-aligned text; only empty states centre |

## Ice

| Wrong | Right |
|---|---|
| A random `#` sprinkle as background wallpaper | ice only in the places listed in `ice.md` §3 |
| Ice behind text, tables or inputs | ice sits in empty space (right of a head, foot of the rail…) |
| Re-implementing the engine "roughly" | copy `breachmatrix-ice.js` / `engine.ts`; never change its numbers |
| Ice canvas without `aria-hidden` [A1] | decorative canvases are hidden from assistive tech |
| Ice at 50–100% opacity | the engine caps plain ice at 0.35 |
| Dots or emoji for status [W1] | `#` `+` `×` `.` glyphs |
| A live status with a static glyph | add `is-pulse` / `is-live` so it forms `. : + * #` |
| The meter without its number | always print the number beside it |

## Motion

| Wrong | Right |
|---|---|
| Animation with no reduced-motion rule [M1] | every animation has an off switch |
| Hover lifts, scale, translate [M2] | hover changes background or colour only |
| Blur / frosted glass [M3] | none |
| `transition: all .3s` [M4] | the property + `var(--motion-fast)` |
| Sliding / bouncing page entrances | opacity fade, 200ms |
| `transform` on a page wrapper | breaks fixed popups; never on ancestors of a popup |

## Words

| Wrong | Right |
|---|---|
| Renaming a status ("Caught", "Blocked", "Partly caught") [W2] | the app's own words, `copy.md` |
| "Safe test attacks, not real ones" in the headline | the `SAFE SIMULATION` eyebrow tag + "How this is measured" |
| Raw errors: `TypeError: data is not iterable` | a sentence + what to do; details small |
| "OK", "Submit", "Click here" | verb + object |
| `1 items`, `3m Ago`, `collect completed` | plurals, lower-case "ago", whole sentences |

## Behaviour

| Wrong | Right |
|---|---|
| Popup that doesn't cover the rail/header | `.ds-scrim` is fixed, `z-index: var(--z-popup)` |
| Popup without Esc / focus trap / focus return | `BreachmatrixIce.openPopup` or `usePopupBehaviour` |
| Long output cut off inside a fixed box | the box keeps its size, the text scrolls inside it |
| Terminal output wrapping and breaking columns | `white-space: pre`, sideways scroll in the box |
| `<button>` without `type` [A2] | `type="button"` |
| `<img>` without `alt` [A3] | `alt=""` for decoration |
| Toasts top-right, full red/green fills | bottom-left beside the rail, neutral card, small status square |
