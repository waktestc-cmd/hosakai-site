# Tokens: every value, and what it is for

The only source of these values is `assets/css/tokens.css`. Copy that file; never
retype it. This page explains each token so you pick the right one.

**Rule of use:** every colour, size, radius, duration and layer in your code is a
`var(--token)`. No hex, rgb or hsl anywhere except `tokens.css`. The checker
(`scripts/check_design.py`, rules C1/C2) fails on anything else.

## Themes

- Light is the default. The root element carries `class="light"` or `class="dark"`.
- The user's choice is stored in `localStorage["theme-preference"]` = `"light"` | `"dark"`.
- The switch lives in the **profile menu** (top right), as a menu item "Dark theme" / "Light theme". It is never a separate header button.
- Both themes are designed. Never derive one from the other by inverting.

## Colour

All text pairs pass WCAG AA (4.5:1 for text, 3:1 for UI marks). Ratios were measured on
the darkest and lightest ground each token sits on.

### Neutrals

| Token | Light | Dark | Use it for | Never use it for |
|---|---|---|---|---|
| `--bg` | `#FFFFFF` | `#000000` | the page, the header | panels (use `--surface`) |
| `--bg-sunk` | `#F6F6F7` | `#000000` | the frame: icon rail, section tab bar; the result sheet's ground | text |
| `--well` | `#F6F6F7` | `#000000` | code, command output, KQL, JSON boxes inside a panel | page backgrounds |
| `--surface` | `#FFFFFF` | `#0B0B0B` | panels, tables, popups, inputs, toasts (light) | the page ground |
| `--surface-2` | `#F6F6F7` | `#141414` | hover on rows, buttons and menu items; table group rows | selected state |
| `--surface-3` | `#ECECEE` | `#1C1C1C` | selected / active (rail item, list item); menus; toasts (dark) | hover |
| `--border` | `#DEDEDF` | `#2A2A2A` | 1px hairlines: panels, tables, dividers | input borders |
| `--border-control` | `#7C7C84` | `#6A6A66` | input, checkbox and secondary-button borders (3:1) | dividers |
| `--fg-1` | `#0C0C0E` | `#F5F5F1` | headings, values, primary button fill (light) | — |
| `--fg-2` | `#52525A` | `#C8C8C3` | body text, ledes, descriptions | headings |
| `--fg-3` | `#64646B` | `#9C9C97` | labels, meta, column heads, placeholders | body paragraphs |
| `--fg-4` | `#9D9DA4` | `#6A6A66` | disabled controls only | any text that must be read |
| `--accent` | `#050506` | `#F5F5F1` | selection highlight, alternative primary fill | colour coding |
| `--accent-fg` | `#FFFFFF` | `#000000` | text on `--accent` | — |
| `--focus` | `#141417` | `#F5F5F1` | 2px focus outlines | decoration |
| `--scrim` | `rgba(12,12,14,.5)` | `rgba(0,0,0,.72)` | behind popups | — |
| `--shadow-popup` | soft 2-layer | `none` | popups, menus, toasts in light only | panels, cards, buttons |

### Red (the brand, and "missed")

Netflix red `#E50914` is the brand. Inside the product it means one thing:
**missed / failed / went unnoticed / broken ice**. Because it carries meaning, it is
rare. A screen with no failures shows no red except the logo area.

| Token | Light | Dark | Use it for |
|---|---|---|---|
| `--red` | `#E50914` | `#E50914` | marks ≤ 8px (dots, dial segments, ice glyphs), 1–3px borders and underlines, large text ≥ 24px |
| `--red-text` | `#B20710` | `#FF4D57` | red text under 24px ("NOT DETECTED", error titles, counts) |
| `--red-surface` | `#FBE3E4` | `#3A0B10` | the background of an error banner or a "missed" pill |

**Buttons are never filled red.** Not the primary, not "Run", not "Delete". Destructive
buttons use `.ds-btn--danger` (red border on `--red-surface`, `--fg-1` text).

### Green and amber (operational states on working pages)

Used for status on working pages: assessments, runs, rules, intel sync, admin, agents.
Not on the dashboard answer (the dashboard tells its story in black, white and red).

| Token | Light | Dark | Use it for |
|---|---|---|---|
| `--green` | `#1A7F4B` | `#3DD68C` | the `#` mark, icons and borders for done / healthy / detected |
| `--green-text` | `#166B3F` | `#3DD68C` | the status word for done / healthy |
| `--green-surface` | `#E3F4EA` | `#0B2A1A` | the square behind a success toast icon |
| `--amber` | `#B86E00` | `#F5A524` | the `+` mark, icons and borders for running / waiting / pending |
| `--amber-text` | `#8A5200` | `#F5A524` | the status word for running / waiting |
| `--amber-surface` | `#FBEFD9` | `#2E2108` | the square behind a warning toast icon |

Things the old app showed grey stay grey (`--fg-3`): "No change", "Not activated",
"Dismissed", "Not run", "Skipped", "Cancelled".

### Picking a colour: decision table

| You are drawing… | Use |
|---|---|
| page background | `--bg` |
| the rail or the section tab bar | `--bg-sunk` |
| a box that groups content | `--surface` + 1px `--border` + `--r-panel` |
| a code / output / JSON box inside a box | `--well` |
| a heading or a number | `--fg-1` |
| a sentence | `--fg-2` |
| a label, column head, timestamp, ID | `--fg-3` (in `.ds-label` or `.ds-id`) |
| something that succeeded | `--green` mark + `--green-text` word |
| something running or waiting | `--amber` mark + `--amber-text` word |
| something missed or failed | `--red` mark + `--red-text` word |
| something not run / unknown | `--fg-3` mark and word |
| a hovered row | `--surface-2` |
| the selected item | `--surface-3` (+ a 2px `--fg-1` edge where the pattern has one) |

## Type

| Token | Value |
|---|---|
| `--font-sans` | `"Geist", system-ui, -apple-system, "Segoe UI", sans-serif` |
| `--font-mono` | `"Geist Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace` |

Load both from Google Fonts, weights Geist 300/400/500/600 and Geist Mono 400/500:
`https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap`

The full type scale is in `typography-layout.md`.

## Shape

| Token | Value | Use |
|---|---|---|
| `--r-chip` | 2px | chips, tags, kbd, MITRE ID boxes |
| `--r-control` | 4px | buttons, inputs, menu items, rail items, icon buttons |
| `--r-panel` | 6px | panels, tables, popups, toasts, sheets |
| `50%` | — | status dots and avatars only |

Nothing else. No 8px, 10px, 12px or "rounded-lg".

## Motion

| Token | Value | Use |
|---|---|---|
| `--motion-fast` | 120ms | hover, press, colour changes |
| `--motion-base` | 200ms | page arrival fade, tabs |
| `--motion-slow` | 320ms | popups arriving |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | anything that eases |

The ice and terminal timings are fixed constants, listed in `ice.md`.

## Layers (z-index)

| Token | Value | Layer |
|---|---|---|
| `--z-sticky` | 10 | sticky table heads |
| `--z-rail` | 20 | icon rail |
| `--z-header` | 30 | header |
| `--z-dixie` | 40 | assistant pill |
| `--z-popover` | 50 | menus, tooltips |
| `--z-popup` | 60 | popups and their scrim |
| `--z-toast` | 70 | toasts |

## Layout

| Token | Value |
|---|---|
| `--header-h` | 56px |
| `--rail-w` | 56px |
