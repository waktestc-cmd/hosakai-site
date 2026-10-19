#!/usr/bin/env python3
"""BREACHMATRIX design checker: turns the rulebook into errors you cannot miss.

Usage:
  python3 check_design.py <file-or-folder> [...]       # check CSS, HTML, JSX/TSX
  python3 check_design.py --strict <paths>             # warnings also fail

Exit code 0 = clean, 1 = errors found (or warnings, with --strict).

To allow one deliberate exception, put `hk-allow: <reason>` in a comment on the
same line. Every allow must say why. The token file itself (tokens.css) and the
copied reference sources in assets/ are the only places raw colours may live.

Rules checked (ids match references/mistakes.md):
  C1  raw colour (hex/rgb/hsl) outside tokens.css            error
  C2  colour that is not one of our tokens (var(--x))         error
  C3  red used as a fill on a button                          error
  C4  gradient anywhere                                       error
  T1  font family other than Geist / Geist Mono tokens        error
  T2  font size off the type scale                            warning
  S1  radius off the scale (2, 4, 6 px, or 50% for dots)      error
  S2  shadow other than var(--shadow-popup)                   warning
  M1  animation in a file with no reduced-motion rule         error
  M2  hover that moves things (transform / translate / scale) error
  M3  blur / backdrop-filter (frosted glass)                  error
  M4  literal duration instead of --motion-* tokens           warning
  A1  ice canvas without aria-hidden                          error
  A2  <button> without type                                   warning
  A3  <img> without alt                                       error
  W1  emoji in UI text                                        error
  W2  banned or renamed words                                 error
"""
import os
import re
import sys

EXTS = (".css", ".html", ".htm", ".jsx", ".tsx", ".js", ".ts", ".vue", ".svelte")
SKIP_DIRS = {"node_modules", "dist", "dist-demo", ".git", "build", "coverage"}

TOKENS = {
    # colour tokens a page may use
    "bg", "bg-sunk", "well", "surface", "surface-2", "surface-3", "border", "border-control",
    "fg-1", "fg-2", "fg-3", "fg-4", "accent", "accent-fg", "focus", "scrim",
    "red", "red-text", "red-surface", "green", "green-text", "green-surface",
    "amber", "amber-text", "amber-surface",
}
COLOR_PROPS = r"(?:color|background(?:-color)?|border(?:-[a-z]+)*-color|border(?:-(?:top|right|bottom|left))?|outline(?:-color)?|fill|stroke|box-shadow|text-decoration(?:-color)?|caret-color|accent-color|column-rule|scrollbar-color)"
FONT_SIZES = {11, 12, 13, 14, 15, 16, 20, 22, 24, 26, 28, 32, 40, 64, 76}
EMOJI = re.compile("[\U0001F300-\U0001FAFF\U00002600-\U000027BF\U0001F000-\U0001F2FF]")
BANNED_WORDS = [
    (re.compile(r"\bpartly caught\b", re.I), 'say "Detected on some machines" (or "Detected on N of M")'),
    (re.compile(r"\blorem ipsum\b", re.I), "use real content"),
    (re.compile(r"\bunleash|supercharge|seamless(?:ly)?\b", re.I), "marketing words; say what it does"),
]


def iter_files(paths):
    for p in paths:
        if os.path.isfile(p):
            yield p
            continue
        for root, dirs, files in os.walk(p):
            dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
            for f in files:
                if f.endswith(EXTS):
                    yield os.path.join(root, f)


def check_file(path):
    out = []
    name = os.path.basename(path)
    is_tokens = name == "tokens.css"
    try:
        text = open(path, encoding="utf-8").read()
    except UnicodeDecodeError:
        return out
    lines = text.splitlines()
    has_reduced = "prefers-reduced-motion" in text or "reducedMotion" in text or "prefersReducedMotion" in text
    is_css_like = path.endswith(".css")

    def add(level, rule, i, msg):
        if "hk-allow:" in lines[i]:
            return
        out.append((level, rule, path, i + 1, msg))

    for i, line in enumerate(lines):
        code = line.split("//")[0] if not is_css_like else line
        low = code.lower()

        # ── Colour ──
        if not is_tokens:
            m = re.search(COLOR_PROPS + r"\s*:\s*[^;{}]*?(#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\()", code)
            if m:
                add("error", "C1", i, f"raw colour '{m.group(1)}' in a style; use a token such as var(--fg-1)")
            for t in re.findall(r"var\(--([a-z0-9-]+)\)", code):
                looks_colour = re.search(COLOR_PROPS + r"\s*:[^;]*var\(--" + re.escape(t) + r"\)", code)
                legacy = t.startswith(("hk-", "fg1", "fg2", "fg3", "fg4", "critical", "secured", "high", "medium", "low", "signal"))
                if looks_colour and (legacy or (t not in TOKENS and not t.startswith(("r-", "font-", "motion-", "z-", "shadow-", "rail", "header", "width", "rdm-", "ice-")))):
                    add("error", "C2", i, f"'--{t}' is not a BREACHMATRIX colour token; pick one from references/tokens.md")
        if re.search(r"(?<!repeating-)(linear|radial|conic)-gradient\(", low):
            add("error", "C4", i, "no gradients: flat colour only (repeating-linear-gradient hatching for 'no answer yet' bars is the one exception)")

        # ── Type ──
        fm = re.search(r"font-family\s*:\s*([^;]+)", code) or re.search(r"fontFamily\s*:\s*['\"]([^'\"]+)", code)
        if fm and "var(--font-" not in fm.group(1) and "inherit" not in fm.group(1) and not is_tokens:
            add("error", "T1", i, f"font '{fm.group(1).strip()}': use var(--font-sans) (Geist) or var(--font-mono) (Geist Mono)")
        if re.search(r"\b(Inter|Space Grotesk|IBM Plex|Roboto|Poppins|Montserrat|Helvetica Neue)\b", code) and not is_tokens and "font" in low:
            add("error", "T1", i, "banned typeface; the app uses Geist and Geist Mono only")
        for size in re.findall(r"(?:font-size\s*:\s*|font\s*:\s*\d{3}\s+)(\d+(?:\.\d+)?)px", code):
            if float(size) not in FONT_SIZES:
                add("warning", "T2", i, f"{size}px is off the type scale {sorted(FONT_SIZES)}; see references/typography-layout.md")

        # ── Shape ──
        for r in re.findall(r"border-radius\s*:\s*([^;]+)", code):
            r = re.sub(r"var\((--r-[a-z]+)\s*,[^)]*\)", r"var(\1)", r)   # var(--r-panel, 6px) -> var(--r-panel)
            vals = r.replace("!important", "").split()
            for v in vals:
                if v not in ("0", "0px", "2px", "4px", "6px", "50%", "999px", "var(--r-chip)", "var(--r-control)", "var(--r-panel)", "inherit"):
                    add("error", "S1", i, f"radius '{v}': use var(--r-chip) 2px, var(--r-control) 4px, var(--r-panel) 6px, or 50% for a dot")
        sm = re.search(r"box-shadow\s*:\s*([^;]+)", code)
        if sm and not is_tokens:
            v = sm.group(1)
            if not any(ok in v for ok in ("var(--shadow-popup)", "none", "inset", "0 0 0 12px var(--surface)")):
                add("warning", "S2", i, "shadow: only var(--shadow-popup) on popups; panels use a 1px border instead")

        # ── Buttons in red ──
        if re.search(r"\.(ds-btn|hk-btn|btn)[\w-]*[^{]*\{[^}]*background(?:-color)?\s*:\s*(var\(--red\)|#e50914)", low):
            add("error", "C3", i, "buttons are never filled red; primary is black on light / white on dark")
        if re.search(r"background(?:-color)?\s*:\s*var\(--red\)", low):
            add("warning", "C3", i, "red fill: allowed only on marks of 8px or smaller (dots, dial segments); never on buttons or panels")

        # ── Motion ──
        if re.search(r"(^|[^-])animation\s*:", low) and "none" not in low and not has_reduced:
            add("error", "M1", i, "animation without a prefers-reduced-motion rule in this file")
        if ":hover" in low and re.search(r"transform\s*:|translate|scale\(", low):
            add("error", "M2", i, "hover must not move or grow things; change background or colour only")
        if re.search(r"backdrop-filter|filter\s*:\s*blur", low):
            add("error", "M3", i, "no blur or frosted glass")
        for dur in re.findall(r"transition\s*:[^;]*?(\d+(?:\.\d+)?m?s)\b", low):
            add("warning", "M4", i, f"duration '{dur}': use var(--motion-fast|base|slow) (120/200/320ms)")

        # ── Words ──
        if not is_css_like and EMOJI.search(line):
            add("error", "W1", i, "no emoji in the UI; use a Lucide icon or an ice mark")
        for rx, why in BANNED_WORDS:
            if rx.search(line):
                add("error", "W2", i, why)
    # ── Accessibility: whole tags, which in JSX often span several lines ──
    if not is_css_like:
        for m in re.finditer(r"<(canvas|button|img)\b[^>]*>", text, re.S):
            tag, body = m.group(1), m.group(0)
            i = text.count("\n", 0, m.start())
            if tag == "canvas" and ("ice" in body or "data-ice" in body) and "aria-hidden" not in body:
                add("error", "A1", i, "ice canvas must have aria-hidden=\"true\" (it is decoration)")
            if tag == "button" and not re.search(r"\btype=", body):
                add("warning", "A2", i, "<button> without type=\"button\" submits forms by accident")
            if tag == "img" and not re.search(r"\balt=", body):
                add("error", "A3", i, "<img> needs alt (alt=\"\" when decorative)")
    return out


def main(argv):
    strict = "--strict" in argv
    paths = [a for a in argv if not a.startswith("--")]
    if not paths:
        print(__doc__)
        return 2
    results = []
    for f in iter_files(paths):
        results.extend(check_file(f))
    errors = [r for r in results if r[0] == "error"]
    warnings = [r for r in results if r[0] == "warning"]
    for level, rule, path, line, msg in sorted(results, key=lambda r: (r[2], r[3])):
        print(f"{path}:{line}: {level.upper()} {rule}: {msg}")
    print(f"\n{len(errors)} error(s), {len(warnings)} warning(s)")
    return 1 if errors or (strict and warnings) else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
