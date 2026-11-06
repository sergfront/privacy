# Guide for AI agents

This repo is the public shop site of **Totefile** — https://totefile.com — for the browser extensions Invoice Downloader for Amazon, Highlights Exporter for Kindle and Board Exporter for Trello.

**The full project context, current state and rules are in `AGENTS.md` of the private repo `sergfront/extant`. Read it first.** Ask the owner for access if you don't have it. Talk to the owner in Russian, simply, step by step.

## This repo

- `assets/config.js` — products, Paddle price IDs, client-side token (public by design), license server URL (`https://api.totefile.com`), `salesOpen`, support email, seller name.
- `tools/build.mjs` — generates every page into `site/` from the config. Also writes the GitHub Pages stubs in the repo root, which forward `sergfront.github.io/privacy/*` to `totefile.com/*`. Edit the generator, never the generated html.
- `tools/privacy.html` — the privacy policy body. Keep it in sync with `PRIVACY.md` in `sergfront/extant`.
- `assets/buy.js` — Paddle checkout. While `salesOpen` is false it shows the waitlist form; `?test=1` opens the sandbox checkout. It also counts Buy clicks.
- `assets/buy-mono.js` — checkout through the monobank jar, used when `payments: 'mono'` in config.js (lifetime only): order code + UAH amount + jar link, then polls for the key. `?test=1` opens it while `salesOpen` is false. Details in extant's AGENTS.md ("Selling through a monobank jar").
- `assets/thanks.js` — asks the license server for the key (`/v1/claim?txn=…`).
- `worker.js` + `wrangler.toml` — the Cloudflare Worker `totefile-site`, which serves `site/` on totefile.com and redirects www to the apex.

Deploy: `node tools/build.mjs && CLOUDFLARE_API_TOKEN=… CLOUDFLARE_ACCOUNT_ID=… npx wrangler deploy`. The owner gives the token. Then commit and push `main`.

This repo is public: never put secrets, API keys or the owner's personal data here. The only contact is the support email `sergefrontend@gmail.com`.
