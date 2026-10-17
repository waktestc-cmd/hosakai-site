# Status lookup: every word, its glyph and its tone

Do not judge tones yourself. Find the area, find the word, copy the row. The same word
can differ by area (REVOKED is red for an agent's licence, grey for a rule), because what
it means differs.

Tone → glyph → class: `ok` = `#` green · `run` = `+` amber (add `is-pulse` when marked
live) · `bad` = `×` red · `idle` = `.` grey. Markup: `<span class="hk-status is-<tone>">WORD</span>`;
API words in caps use `hk-status hk-status--mono`.

In plain JS: `HosakaiIce.statusTone("agents-connection", "OFFLINE")` → `"bad"`.

## Working pages (green, amber, red, grey)

| Area | Word (exactly as shown) | Tone | Live? |
|---|---|---|---|
| **Assessments list** | Executed | ok | |
| | Running | run | live |
| | Failed | bad | |
| | Not executed | idle | |
| **Run / execution** | Pending | run | live |
| | Dispatched | run | live |
| | Running | run | live |
| | Completed | ok | |
| | Failed | bad | |
| | Timeout | bad | |
| | Cancelled | idle | |
| | Skipped | idle | |
| **Detection (per result)** | Detected | ok | |
| | Not detected | bad | |
| | Checking… | run | live |
| | Waiting telemetry | run | live |
| | Check expired | run | |
| | Provider error | bad | |
| | Skipped | idle | |
| | Not checked yet | idle | |
| | N/A | idle | |
| **Rules** (mono caps) | NEW | run | |
| | PUBLISHING | run | |
| | REVOKING | run | |
| | READY | ok | |
| | PUBLISHED | ok | |
| | FAILED | bad | |
| | REVOKED | idle | |
| **Rule validation** | Valid | ok | |
| | Invalid | run | |
| **Agents: licence** (mono caps) | ACTIVE | ok | |
| | PENDING_APPROVAL | run | |
| | REJECTED | bad | |
| | REVOKED | bad | |
| | EXPIRED | bad | |
| **Agents: connection** (mono caps) | ONLINE | ok | |
| | NOT_ACTIVATED | idle | |
| | OFFLINE | bad | |
| **Licences (counts)** | Active | ok | |
| | Revoked | bad | |
| | Expired | bad | |
| **Join requests** | Pending | run | |
| | Approved | ok | |
| | Rejected | bad | |
| **Approvals** | Waiting | run | |
| | Approved | ok | |
| | Dismissed | idle | |
| | Failed | bad | |
| **Intel sync** (mono caps, the service's words) | CONTENT_CHANGED | ok | |
| | NO_CHANGE | idle | |
| | RUNNING / SYNCING / PENDING / QUEUED | run | live |
| | FAILED / ERROR | bad | |
| | (no value) "Not run yet" | idle | |
| **Assistant reports** | Ready | ok | |
| | Draft | run | |
| | Scheduled | idle | |
| **Account security** | Two-factor "Off" | run | |

## The dashboard (black, white and red only; no green or amber)

The dashboard tells the ice story: solid = held, red = broken.

| Word | Dial mark | Pill / text |
|---|---|---|
| Detected | solid `--fg-1` mark | plain `--fg-1` |
| Missed | `--red` mark | `--red-surface` pill with red border |
| Detected on some machines / Detected on N of M | dashed `--fg-1` (3 2) | dashed border |
| What-if: detected | dotted `--fg-1` (1 2) | dashed, "What-if" marker |
| Awaiting verification | `--fg-3` dashed (2 3) | dashed, `--fg-2` |
| Did not execute | `--fg-3` dashed (2 3) | dashed, `--fg-2` |
| Not run | `--border` hairline | no border, `--fg-3` |
| A step: All detected / N missed of M | — | step state line |

## A word that is not listed

1. Look for the same idea in the table (a "Suspended" licence is like REVOKED → bad).
2. Otherwise by meaning: finished well → ok; still happening or waiting on someone → run; failed, lost or broken → bad; never started, neutral or unknown → idle.
3. Keep the word exactly as the data gives it. Add the new row to this table.
