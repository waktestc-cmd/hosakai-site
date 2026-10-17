# Breachmatrix website

Public website for Breachmatrix, built on the HOSAKAI ice design system.

- `site/` is the website (plain HTML, CSS and JS; no build step).
- `.claude/skills/hosakai-ice-design/` is the design rulebook. Read `SKILL.md` first.
- Check the design: `python3 .claude/skills/hosakai-ice-design/scripts/check_design.py site`

## Production

The `waktestc-cmd/hosakai-site` repository publishes `site/` to GitHub Pages at
https://breachmatrix.com on pushes to `main`. Cloudflare proxies the domain.
The local downloaded folder is not a Git checkout; publish through a checkout
of that repository, excluding `.private/`, `.venv/` and local tooling state.

## Waitlist service

`services/waitlist/` contains a Cloudflare Worker and D1 schema. Only
`https://breachmatrix.com/api/waitlist` and its `www` equivalent run the Worker;
the rest of the website remains on GitHub Pages. The frontend uses the relative
`/api/waitlist` URL. A basic static localhost server does not implement this API.

The service stores email and signup time in the private `breachmatrix-waitlist`
D1 database. It does not send notification or confirmation emails. There is no
public subscriber-list endpoint. View or export signups through the Cloudflare
D1 dashboard using your authenticated account.

Requests are origin-checked, limited to 4 KB, validated, and written with a
parameterized query. A unique email key prevents duplicates. A honeypot filters
simple bots; Cloudflare rate limiting allows 10 attempts per IP per minute per
Cloudflare location. This is basic abuse protection, not CAPTCHA or email
ownership verification. IP addresses are not stored in the database.

Test and deploy from the repository root after `npx wrangler login`:

```sh
node --test services/waitlist/worker.test.mjs
npx wrangler d1 execute breachmatrix-waitlist --config services/waitlist/wrangler.json --remote --file=services/waitlist/schema.sql
npx wrangler deploy --config services/waitlist/wrangler.json
```

Worker deployment is separate from the GitHub Pages workflow. The database
schema is additive and does not delete existing signups. Never commit Cloudflare
credentials, local `.wrangler/` state, or exported subscriber data.
