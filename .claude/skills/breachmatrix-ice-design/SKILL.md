---
name: breachmatrix-ice-design
description: The BREACHMATRIX "ice" design system as a deterministic rulebook - exact tokens, Geist type scale, the # ice texture and its engine, the # + × . status glyphs, ice meters, motion, shell, page recipes, copy rules, ready-made CSS/JS/React files and a checker script. Use this skill for ANY UI work on BREACHMATRIX or anything that should look like it - building or restyling a page, screen, component, popup, table, dashboard, empty state, toast, sign-in or report; reviewing UI for design consistency; or when someone mentions the ice concept, the # texture, Netflix red, black/white security UI, memorable.sh style, or "make it look like BREACHMATRIX". Use it even for small UI tweaks, because the rules are exact and easy to get wrong from memory.
---

# BREACHMATRIX ice design: the rulebook

This skill reproduces the approved BREACHMATRIX design exactly. It is written so that a
beginner designer or any model gets the same result every time. **Do not design. Look
things up and copy.** Every value you need is in a file here; if you find yourself
choosing a colour, a size, a radius, a duration or a word from taste, stop and look it up.

Why so strict: the look depends on many small exact numbers (a 0.08em label spacing, a
0.35 ice opacity cap, 2/4/6px radii, red used only for "missed"). Getting any one wrong
by intuition is the most common failure. Copying never drifts.

## The concept in 30 seconds

- **Your defences are the ice.** BREACHMATRIX runs safe test attacks through it and shows where it held and where it broke.
- The ice is drawn with the characters `. : + * #` (thin → solid). They appear as **texture** (a moving field of glyphs in empty space) and as **language** (one glyph beside every status).
- Palette: black, white, a grey ramp, and **Netflix red `#E50914`, which means "missed / broken"**. Green and amber mark operational states on working pages.
- Type: **Geist** for reading, **Geist Mono** for labels, IDs, numbers and anything a machine produced.
- It is a web app, not a website: a fixed header, an icon rail, section tabs, and the page scrolls inside.
- Calm and exact: square-ish corners (2/4/6px), 1px hairlines, no shadows except on popups, no gradients, no glows, no lifts.

## The 15 laws (memorise these; the checker enforces most)

1. **Tokens only.** Every colour, radius, duration and z-index is a `var(--token)` from `assets/css/tokens.css`. No hex/rgb outside that file.
2. **Red means broken.** `--red` marks missed, failed or not-detected things (≤ 8px marks, thin borders, underlines, big text). **Buttons are never red.** Small red text uses `--red-text`.
3. **Status = glyph + the app's own word.** `#` done (green) · `+` running (amber, animates while live) · `×` failed/missed (red) · `.` not run (grey). Never colour alone, never dots, never emoji. **Never judge the tone yourself: copy it from `references/status-lookup.md`** (REVOKED is red for an agent, grey for a rule).
4. **Keep the app's names.** Never rename a status, page or column; existing users must not be surprised (`references/copy.md`).
5. **Two fonts, one scale.** Geist + Geist Mono; only the sizes in `references/typography-layout.md`. Labels are mono 12px UPPERCASE 0.08em `--fg-3`.
6. **Radii are 2, 4, 6px** (chip, control, panel); 50% only for dots and avatars.
7. **Panels have a 1px border, never a shadow.** Shadows only on popups, menus and toasts (light theme).
8. **One primary button per area.** Primary is black on light, white on dark; buttons are mono 12px caps.
9. **The ice is placed, not sprinkled.** Only where `references/ice.md` §3 lists it, only in empty space, `aria-hidden`, opacity ≤ 0.35, drawn by the shipped engine with its numbers unchanged.
10. **Motion is decorative and optional.** Opacity fades (120/200/320ms), the ice settle and turnover, typed prompts, scrambled key numbers, forming glyphs. Every one stops under `prefers-reduced-motion`. Hover never moves anything.
11. **The shell is fixed.** 56px header (brand, search, profile menu with the theme switch), 56px icon rail with rising ice, 44px section tabs when a section has 2+ pages; page area 24px padding, max 1440px.
12. **Answer first.** Every page reads: where am I → what is this / the answer → what to do → the numbers → the detail.
13. **Everything in view, scroll inside boxes.** Long output never makes the page or sheet scroll; the box keeps its place and scrolls itself. Terminal text does not wrap.
14. **Plain words.** Short active sentences, the plain name first and the technical ID beneath, numbers with their whole ("26 of 33"), errors say what happened and what to do.
15. **Both themes, three widths.** Check light and dark at 1440, 1280 and 1024 before calling anything done.

## Files in this skill

| Path | What it is | When to open it |
|---|---|---|
| `assets/css/base.css` | reset (margins, box-sizing) | plain HTML only, load first |
| `assets/css/tokens.css` | **every value** (both themes) | always; copy, never retype |
| `assets/css/components.css` | `ds-*`: buttons, labels, inputs, tabs, panel, popup, toasts | always |
| `assets/css/shell.css` | header, rail, section tabs, page area | any signed-in page |
| `assets/css/ice-kit.css` | ice patch, prompt, empty state, page head, marks, meters, band | always |
| `assets/css/patterns.css` | `hk-*`: status, table, toolbar, search, pager, popup parts, fields, notes, toasts | list / detail / admin pages |
| `assets/css/result-sheet.css` | the result sheet | result detail views |
| `assets/js/breachmatrix-ice.js` | the ice engine + scramble, prompt, meter, theme, popup, toast (plain JS) | plain HTML |
| `assets/js/icons.js` | Lucide 0.462 icons, offline | plain HTML |
| `assets/react/*` | the approved React sources (engine, kit, popup, shell, dial, timeline, result sheet, toaster, words); see its README | React apps; copy files |
| `assets/templates/starter.html` | a complete list page | start every plain page here |
| `assets/templates/result-sheet.html` | the result sheet in plain HTML | result detail views |
| `assets/golden/*.png` | approved screenshots, both themes | compare your result |
| `assets/brand/*` | BREACHMATRIX monogram, black and white | the header, sign-in |
| `references/tokens.md` | what each token is for + a decision table | choosing any colour |
| `references/typography-layout.md` | type scale, spacing, shell, hierarchy, breakpoints | any layout or text |
| `references/ice.md` | the concept, glyph language, placements, engine numbers, motion | anything with ice, status or motion |
| `references/components.md` | exact markup for every component | building any element |
| `references/copy.md` | voice, the app's words, headline and state templates, formats | writing any text |
| `references/status-lookup.md` | every status word → its tone and glyph, per area | **every status you show** |
| `references/page-recipes.md` | the slot order for each kind of page | starting a page |
| `references/mistakes.md` | the common wrong → right list | before you finish |
| `scripts/check_design.py` | the rule checker | after every change |

## How to build anything (follow in order)

1. **Find the recipe.** Open `references/page-recipes.md` and pick the page type (list, detail, result sheet, dashboard, settings, sign-in, 404, assistant). If none fits, use the list recipe.
2. **Start from a copy, not a blank file.**
   - Plain HTML: copy `assets/templates/starter.html` and the `assets/` folders next to it, keeping the relative paths.
   - React: copy `assets/css/*` into your styles (import order: tokens → components → shell → ice-kit → patterns), copy `assets/react/engine.ts` + `Ice.tsx` + `Layout.tsx`, and use their components (`IceField`, `PageHead`, `IceState`, `Prompt`, `Scramble`, `IceMark`, `IceMeter`, `IceBand`).
   - Other frameworks: load the CSS files and `assets/js/breachmatrix-ice.js`; the kit runs from `data-*` attributes, so any template language works.
3. **Fill the slots in the recipe's order** using the markup in `references/components.md`. Write every word with `references/copy.md`.
4. **Look up every status** in `references/status-lookup.md` (plain JS: `data-status-area="rules"` on the span, or `BreachmatrixIce.statusTone(area, word)`). **Add the ice only where `references/ice.md` §3 says.** Status = glyph + word (§1). Proportions = ice meter + number (§2).
5. **Run the checker** and fix every error:
   ```bash
   python3 <skill>/scripts/check_design.py <your files or folder>
   ```
   An intentional exception needs `hk-allow: <reason>` on the same line; there should be very few.
6. **Look at it.** Screenshot at 1440, 1280 and 1024 in light and dark (set `localStorage["theme-preference"]` or the root class `light`/`dark`). Put it next to the matching `assets/golden/*.png`. Fix anything that differs in spacing, weight, colour or alignment.
7. **Final checklist** (below).

When something isn't covered: choose the closest existing component and reuse it as is.
Never add a new colour, font size, radius, shadow or animation. If the result looks
plain, that is correct; the ice and the red carry the character.

## Final checklist (all must be true)

- [ ] `check_design.py` reports 0 errors.
- [ ] No raw colours; only tokens. No new tokens invented.
- [ ] Red appears only on missed/failed things (and the sign-in headline word, if used). No red buttons.
- [ ] Every status shows a glyph and the app's own word, with the tone from `status-lookup.md`; live states animate the glyph.
- [ ] Toolbars sit above their panel, never inside it.
- [ ] Fonts are Geist and Geist Mono; sizes from the scale; labels are mono caps 12px grey.
- [ ] Radii 2/4/6; panels bordered, not shadowed; at most one primary button per area.
- [ ] The page has its head (or hero) in the order: where → what/answer → action → numbers → detail.
- [ ] Ice appears only in the listed places, never behind text, all canvases `aria-hidden`.
- [ ] Reduced motion stops every animation; hover moves nothing.
- [ ] Empty, loading and error states use `.ice-state` with a typed prompt and the copy templates.
- [ ] Popups cover the rail and header, close with Esc, trap and return focus, scroll inside.
- [ ] Long content scrolls inside its box; nothing is cut off; no sideways page scroll at 1024.
- [ ] Light and dark both checked at 1440, 1280, 1024 against the golden screenshots.
- [ ] Text passes AA (the tokens do, as long as you use them for their stated purpose).

## If you are reviewing someone else's UI

Run the checker on their files, then walk `references/mistakes.md` top to bottom against
the screenshots. Report each finding as: what is wrong → the law number → the exact fix
from this skill (the token, the class, the copy template).
