# Typography, spacing, layout and hierarchy

## Type scale (the only sizes that exist)

Two families. **Geist** (sans) for reading, **Geist Mono** for anything a machine
produced or a label that names a thing. Never a third family.

| Role | Family | Weight | Size / line | Letter-spacing | Case | Colour | Class / where |
|---|---|---|---|---|---|---|---|
| Hero answer (dashboard only) | sans | 400 | `clamp(32px, 3.6vw, 54px)` / 1.06 | −0.035em | sentence | `--fg-1` | `.ice-h1` |
| Key number (dial) | sans | 300 | 76px | −0.04em | — | `--fg-1` | `.ice-num` |
| Big single metric | sans | 300 | 64px | −0.03em | — | `--fg-1` | detection rate on a detail page |
| Display number / greeting / sign-in headline | sans | 300 | 40px / 1–1.1 | −0.03em | sentence | `--fg-1` | licence counts, DIXIE greeting, sign-in |
| Stat number | sans | 300–400 | 32px / 1 | — | — | `--fg-1` | stat strips (tabular-nums) |
| Page title | sans | 500 | 28px / 1.2 | −0.01em | sentence | `--fg-1` | `.ice-head__title` |
| Sheet / popup title | sans | 500 | 22–26px / 1.2 | −0.015em | sentence | `--fg-1` | `.rdm-title` (26, 22 below 1240px) |
| Fact number (under hero) | sans | 400 | 22px / 1.2 | −0.02em | — | `--fg-1` | `.ice-fact b` |
| Section heading | sans | 500 | 20px / 1.3 | — | sentence | `--fg-1` | timeline title |
| Panel / toolbar title | sans | 500 | 16px / 1.3 | — | sentence | `--fg-1` | `.hk-toolbar__title` |
| Column title (sheet) | sans | 500 | 15px / 1.3 | — | sentence | `--fg-1` | `.rdm-col__title` |
| Lede (under a title) | sans | 400 | 15px / 1.5 (16px hero) | — | sentence | `--fg-2` | `.ice-head__lede`, `.ice-lede` |
| Body | sans | 400 | 14px / 1.55 | — | sentence | `--fg-2` | `body` |
| Table cell title | sans | 500 | 14px / 1.35 | — | as data | `--fg-1` | `.hk-cell-title` |
| Table cell | sans | 400 | 13px / 1.45 | — | as data | `--fg-2` | `.hk-table td` |
| **Label** | mono | 400 | 12px / 1.4 | 0.08em | UPPERCASE | `--fg-3` | `.ds-label` |
| **Button** | mono | 500 | 12px / 1 | 0.06em | UPPERCASE | per variant | `.ds-btn` |
| ID, hash, time, count | mono | 400 | 12–13px | — | as data | `--fg-3` / `--fg-2` | `.ds-id`, `.hk-num` (tabular-nums) |
| Status word (mono form) | mono | 400 | 12px | 0.04em | UPPERCASE | tone colour | `.hk-status--mono` |
| Terminal / code | mono | 400 | 12px / 1.65 | — | as data | `--fg-2` | `.rdm-pre` |
| Ice glyph mark | mono | 600 | 13px / 1 | — | — | tone colour | `.ice-mark`, `.hk-status::before` |
| Wordmark "HOSAKAI" | mono | 500 | 13px | 0.18em | UPPERCASE | `--fg-1` | `.shell-brand__word` |
| Tiny meta | mono | 400–500 | 11px | 0.06em | UPPERCASE | `--fg-3` | agents grid status, meter |

Rules that people get wrong:
- **Labels are mono, uppercase, 12px, letter-spaced 0.08em, grey.** Every eyebrow, column head, field label and caption. Never bold, never coloured.
- **Headings are sentence case**, weight 400–500. Never all-caps headings; never weight 700.
- **Numbers that line up use `font-variant-numeric: tabular-nums`.**
- Titles get `text-wrap: balance`; ledes get `text-wrap: pretty` and a 56–62ch max width.
- Weights in use: 300 (big numbers only), 400, 500, 600 (ice glyphs only). Never 700/800.

## Spacing

A 4px base. The steps in use: **4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40**.
Layout gaps prefer 8 / 12 / 16 / 24 / 40.

| Where | Value |
|---|---|
| Page padding (inside the page area) | 24px all round (16px under 760px) |
| Page max width | 1440px, centred |
| Panel padding | 20px (`.ds-panel`); tables pad cells 10px 16px |
| Gap between stacked sections | 24px |
| Gap between panels in a grid | 16px |
| Page head → content | 24px below its bottom border |
| Toolbar → tabs → table | 12px, 16px |
| Inline gaps (icon + text) | 6–8px |
| Button padding | 0 14px, height 36 (30 small, 28 inline) |

Use `gap` on flex/grid parents, not margins on children.

## The shell (every signed-in page)

```
┌──────────────────────────────────────────────────────────────────┐ 56px header (--bg, 1px bottom border)
│ [K] HOSAKAI   [ Search pages and actions      Ctrl K ]   …   (AN)▾│
├────┬─────────────────────────────────────────────────────────────┤
│ D  │ SECTION   Page · Page · Page                    : + # # ##  │ 44px section tabs (--bg-sunk), only if 2+ pages
│ B  ├─────────────────────────────────────────────────────────────┤
│ I  │                                                             │
│ A  │   page area: padding 24px, max-width 1440px, scrolls        │
│ R  │                                                             │
│ :  │                                                             │
│ +# │                                                             │
│ ## │                                                             │
│ U  │                                                             │
│ L  │                                                             │
└────┴─────────────────────────────────────────────────────────────┘
 56px icon rail (--bg-sunk): D DIXIE, B dashboard, I intel, A assessments, R rules on top;
 U account, L admin at the bottom; ice rising between the two groups
```

- **Header (56px):** HOSAKAI monogram (24px) + wordmark → search button (max 400px wide, shows `⌘K`/`Ctrl K`) → spacer → the assistant pill (if any) → profile avatar. The profile menu holds: name and email, **Dark/Light theme**, Account settings, divider, Sign out.
- **Icon rail (56px):** 40px square items, 18px icons stroke 1.75, `--fg-3`; hover `--surface-2`; active `--surface-3` + a 2px `--fg-1` bar on the left edge; tooltips to the right on hover/focus. A strip of rising ice fills the space between the two groups.
- **Section tabs (44px):** only for sections with 2+ pages. Section name as `.ds-label`, then links (14px, `--fg-2`; active `--fg-1` weight 500 with a 2px `--fg-1` underline on the bar's bottom line), ice drifting in at the far right. Never a 240px side panel; never duplicate these tabs inside the page.
- **Page area:** scrolls on its own; header, rail and tabs stay put. Page content must never carry `transform`, `filter`, `isolation` or `will-change`, because that traps fixed popups.

## Hierarchy: the order of a page, top to bottom

Every page answers in this order. Do not reorder.

1. **Where am I** — eyebrow (`.ds-label`, the section or the parent).
2. **What is this / what is the answer** — title (or, on the dashboard, the answer as a sentence).
3. **Why it matters / what to do** — one lede line, then at most two buttons (one primary).
4. **The numbers** — a few counts or facts (≤ 4), each clickable to its list.
5. **The detail** — tabs, toolbar (title + count + search), then the table or panels.
6. **The rest** — secondary panels, "How this is measured" notes, footers.

Within a row, the most important thing is on the left. Within a panel, the summary is
above the detail. Status is always **symbol + word**, never colour alone.

## Breakpoints

| Width | What changes |
|---|---|
| ≥ 1440 | the reference layout |
| 1280 | same layout, slightly tighter |
| 1240 | sheet header and boxes tighten (smaller title, 2-line descriptions) |
| 1024 | must still work with no sideways page scroll; tables fit or scroll inside their panel |
| 980 | the result sheet's two columns stack; the body scrolls |
| 760 | page padding 16px; page head stacks; field grids drop to 2 columns; key hints hide |
| 720 | section tabs hide the section name and the ice |

Check every page at **1440, 1280 and 1024** in **both themes**.
