# Totefile shop site

Source of https://totefile.com — pricing, Paddle checkout (`buy.html`), the license-key page (`thanks.html`), Terms, Refund and Privacy pages for the Totefile browser extensions (Invoice Downloader for Amazon, Highlights Exporter for Kindle, Board Exporter for Trello).

- Edit `assets/config.js` (products, Paddle price IDs, client token, license server URL, support email) and `tools/build.mjs` (page templates), never the generated html.
- `node tools/build.mjs` writes the site to `site/` and the forwarding stubs in the repo root.
- `npx wrangler deploy` (with `CLOUDFLARE_API_TOKEN`) publishes `site/` to totefile.com via the `totefile-site` Worker (`worker.js` sends www to the apex).
- GitHub Pages still serves this repo at sergfront.github.io/privacy/: every page there forwards to the same page on totefile.com, keeping the query string.
