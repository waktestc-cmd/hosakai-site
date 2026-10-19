# Page recipes: build each kind of page in this order

Every recipe starts from `assets/templates/starter.html` (plain HTML) or the React
`Layout` (`assets/react/Layout.tsx`). Fill the slots top to bottom. Do not add slots.
Golden screenshots to compare against are in `assets/golden/`.

## A. List page (Assessments, Runs, Rules, Intel events, Agents)

Golden: `list-light.png`, `list-dark.png`, `table-dark-1024.png`. Template: `starter.html`.

1. Shell with the section tabs (current page active).
2. Page head: eyebrow = section, title, one-line lede, ≤ 1 primary + 1 secondary action.
3. Optional stat strip: up to 4 counts (32px numbers over `.ds-label`), max 3 scrambled.
4. Toolbar: list title + count, spacer, search. It sits **above** the panel on the page background, never inside the panel.
5. Filter tabs (`.ds-tabs`) with counts if useful.
6. The table in a panel: title cell (name + mono sub-line) first, status as glyph + word, numbers mono; whole row clickable.
7. Pager at the panel's foot.
8. Empty / filtered-empty / loading / error: an `.ice-state` in place of the table body.

## B. Detail page (one assessment, one rule, one event)

1. Shell with section tabs (the parent page stays active).
2. Back link (`← Assessments`, `.hk-link`) above the page head.
3. Page head: eyebrow = parent ("Assessment", "Rules / Manage rule"), title = the item's name, lede = its key facts on one line ("Bundle_… · 15 techniques · 5 runs"), primary action.
4. Summary panel: the one big number (64px, weight 300) with its meaning, then ≤ 3 sub-counts with thin status rules, then one sentence + one secondary action ("1 attack was not detected. Review them and add detection rules. → Review results").
5. History / children: toolbar + tabs + table, as in recipe A.
6. Code (KQL, commands) in a `--well` box with a `$` prompt header and a Copy button.

## C. Result sheet (one test result, everything at once)

Golden: `result-sheet-light.png`, `result-sheet-dark.png`. Template: `result-sheet.html`.
Open it from a result row in one click; J/K step through results; Esc closes.
Follow `components.md` §13 exactly. Never split it into tabs; never make the sheet scroll
at 980×640 or larger.

## D. Dashboard overview (the answer page)

Golden: `dashboard-light.png`, `dashboard-dark.png`. Code: `assets/react/IceHero.tsx`,
`IceTimeline.tsx`, `dashboard-hero.css`. The dashboard keeps black, white and red only
(no green, no amber).

1. Section tabs: Overview · Tests · Score · Compare · Baseline.
2. Hero, left: eyebrow with `SAFE SIMULATION` → the answer (template in `copy.md`) → the numbers line → "Fix first: <name> →" (primary) + "Ask DIXIE" → facts (Missed with red dot · Detected on some machines · No answer yet · In the news) → "+ How this is measured".
3. Hero, right: the dial in its ice, caption `51 OF 100 · 26 OF 33 TEST ATTACKS DETECTED`.
4. Score over time: the heading is a sentence ("Up 38 points in 90 days."), range buttons, the chart.
5. Other dashboard pages hold the rest (the five steps, test list, score breakdown, compare, baseline); never stack them all on one page.

## E. Settings / admin / account

1. Shell with section tabs (Admin: Licenses · Agents · Join requests · Approvals · Tenants).
2. Page head with role chips as actions (neutral chips, mono).
3. Panels, each with a 16px/500 title row and its actions on the right.
4. Settings rows: icon square (32px, `--border`) · label + one-line help · control on the right.
5. Every destructive action opens a confirm popup (danger button inside).

## F. Sign-in, register, workspace setup

Golden: `sign-in-dark.png`. Two halves:
- Left: a **black brand panel in both themes** (`hk-theme-dark` scope): monogram top-left, an `IceField` `corner` band, then `AUTONOMOUS SECURITY TESTING` label, the headline in Geist 300 40px (one word may be `--red`), small footer `corp.local · autonomous red team` in mono.
- Right: the form on `--bg` following the theme: title 28px/500, one-line lede, `.hk-field`s with real labels, a full-width primary button, a quiet link line under it.
- Errors: an `.hk-note.is-error` above the form; field errors in `--red-text` under the field.

## G. Not found (404) and blocked states

Golden: `empty-state-dark.png`. Inside the shell when signed in: one `.ice-state` centred
in the page with `$ cd <the path>` typed, title "No such page", a line naming the path,
and "Go to dashboard" (primary). Signed out: the same on `--bg` with the monogram and a
"Sign in" link.

## H. Assistant (chat) page

- Landing: date eyebrow, greeting in 40px/300, one sentence on what it can do, the ask box headed by a typed `$ dixie ask` line and a `Ctrl K` hint, suggestion rows (plain rows with `→`), then context panels.
- Conversation: the transcript scrolls; the reply box is pinned, solid, the same 800px width as the transcript.
- Markdown answers are fully styled (headings, lists, code in wells, tables with mono heads).
- Error turns: one readable sentence + what to do, with a red cursor; never raw error text.
