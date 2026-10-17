# Words: voice, names, templates

The reader is often not technical (a manager, an auditor). Write so they understand
the first line without help, and give the technical name second.

## Voice

- Short, plain sentences. One idea per sentence. Active voice.
- Say what happened and what to do. Never apologise, never joke, never hype.
- Plain name first, the technical ID beneath it in mono (`Kerberoasting` / `T1558.003`).
- Numbers carry their unit and their whole: "26 of 33 attacks", not "26" or "79%".
- Sentence case everywhere except `.ds-label` and buttons, which CSS uppercases (type them in sentence case).
- No emoji. No exclamation marks. No "Oops", "Whoops", "Uh-oh", "Awesome".
- Banned words: unleash, supercharge, seamless, robust, cutting-edge, leverage, empower, delve, journey.
- Never "partly caught". Say "Detected on some machines" or "Detected on 1 of 2".

## Names stay as the app already says them

Existing users must never be surprised. **Do not rename a status, a page or a column.**
Restyle the word, keep the word.

| Area | Words (exactly) |
|---|---|
| Test results (dashboard) | Detected · Missed · Detected on some machines (pill: "Detected on N of M") · Awaiting verification · Did not execute · Not run · What-if: detected |
| A step of the five | All detected · N missed of M · Detected on some machines · … |
| Execution | Pending · Dispatched · Running · Completed · Failed · Cancelled · Timeout · Skipped |
| Detection | Detected · Not detected · Checking… · Waiting telemetry · Check expired · Provider error · Skipped · Not checked yet · N/A |
| Assessments list | Executed · Running · Failed · Not executed |
| Rules (API words, caps) | NEW · PUBLISHING · PUBLISHED · READY · FAILED · REVOKING · REVOKED |
| Agents (API words, caps) | ACTIVE · PENDING_APPROVAL · REJECTED · REVOKED · EXPIRED · ONLINE · OFFLINE · NOT_ACTIVATED |
| Intel sync (API words) | CONTENT_CHANGED · NO_CHANGE · RUNNING · FAILED |
| Approvals | Waiting · Approved · Dismissed · Failed |
| Section names | DIXIE · Dashboard · Intel · Assessments · Rules · Account · Admin |

Where the app shows a raw API word, show it in mono caps (`.hk-status--mono` or the
admin caps style), exactly as it arrives.

## Templates

**Page head:** eyebrow = section (or `Section / Page`), title = noun phrase, lede = one
sentence starting with a verb: "Validate your defences against an attack suite, then
review every run and report in one place."

**Dashboard answer (the ice story).** Pick the first that applies:

| Situation | Headline (underline the bracketed part in red) |
|---|---|
| some steps broke, some held | Your defences held in X of 5 steps and [broke in Y]. |
| some broke, none fully held | Your defences broke in [Y of 5 steps]. |
| nothing missed, some waiting | No attack has got through so far. [N of 5 steps] are still waiting for results. |
| nothing missed, some untested | Every attack that ran was detected. [N of 5 steps] have no tests yet. |
| all held | Your defences held in [every step]. |
| what-if, still breaks | Your defences would still break in [Y of 5 steps]. |
| what-if, nothing breaks | [No step] would break. |

Line under it: "Your tools detected D of the R attacks we ran. The M that got through are
where to start." (Without misses: drop the second sentence.)
The "safe simulation" disclaimer lives in the eyebrow tag `SAFE SIMULATION` and in a
"+ How this is measured" note, never in the answer.

**Empty:** "No <things> yet" + how to get the first one.
**Filtered empty:** "Nothing matches" + "Clear the filter to see all <things>."
**Error:** "<Thing> could not be loaded." + what to do ("Check your connection, then try again.") + "Try again" button. The server's own text only small, under "Details:".
**Not found:** "We couldn't find this <thing>. It may have been deleted, or the link is out of date."
**Toast, done:** past tense, the object first: "Assessment created", "Pipeline run completed".
**Toast, failed:** what failed + what to do: "Couldn't start the run. The agent on DC01 didn't answer. Try again in a minute."
**Confirm destructive:** title = the action ("Revoke agent"); body = the consequence in one or two sentences; buttons "Cancel" + the action verb again ("Revoke agent").
**Buttons:** a verb + object: "New assessment", "Run assessment", "Generate query", "Copy query", "Try again". Never "OK", "Submit", "Click here".

## Formats

| Thing | Format |
|---|---|
| Date | `29 Jul 2026` |
| Date + time | `29 Jul 08:22` (24h) |
| Relative | `3m ago`, `2h ago`, `3 days ago` (lower case) |
| Duration | `42s`, `1m 9s`, `12m 40s` |
| Counts | "1 item", "2 items" (always pluralise correctly) |
| Percent | `67%` beside an ice meter |
| Score | `51 of 100` |
| Keys | `⌘K` on Mac, `Ctrl K` elsewhere |
| IDs, hashes, commands | mono, as they are, never translated |
