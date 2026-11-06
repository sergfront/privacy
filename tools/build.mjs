// Builds the static shop pages from assets/config.js. Run: node tools/build.mjs
// The pages are plain HTML so they read fine without JavaScript (Paddle's reviewers, search
// engines); only buy.html and thanks.html need scripts.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// The real site goes to site/ (deployed to Cloudflare as https://totefile.com). The repo root
// is still served by GitHub Pages at sergfront.github.io/privacy/: there every page is a stub
// that forwards to the same path on totefile.com, keeping ?query (checkout and key links).
const OUT = join(root, 'site');
const DOMAIN = 'https://totefile.com';
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(join(root, 'assets'), join(OUT, 'assets'), { recursive: true });
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(join(root, 'assets/config.js'), 'utf8'), sandbox);
const SHOP = sandbox.window.SHOP;
const UPDATED = '2026-11-06';

// 'mono' = monobank jar (lifetime only), 'paddle' = Paddle as Merchant of Record.
const MONO = SHOP.payments === 'mono';
const PAYMENT_LINE = MONO
  ? 'Card payments are taken on the secure page of monobank (Universal Bank, Ukraine).'
  : 'Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant of Record for all our orders.';
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function page({ file, title, description, body, scripts = '', wide = false }) {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="stylesheet" href="assets/site.css">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="icon" href="assets/icon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="assets/icon-180.png">
<meta property="og:image" content="https://totefile.com/assets/icon-512.png">
</head>
<body>
<header class="site"><div class="wrap">
  <a class="brand" href="./"><img class="logo" src="assets/logo.svg" alt="" width="30" height="30">${esc(SHOP.brand)}</a>
  <nav><a href="./#products">Products</a><a href="./#pricing">Pricing</a><a href="./#faq">FAQ</a><a href="./#support">Support</a></nav>
</div></header>
<main>${wide ? body : `<div class="wrap">${body}</div>`}</main>
<footer><div class="wrap">
  <a href="./">Home</a><a href="terms.html">Terms of Service</a><a href="refund.html">Refund Policy</a><a href="PRIVACY.html">Privacy Policy</a><a href="mailto:${esc(SHOP.supportEmail)}">${esc(SHOP.supportEmail)}</a>
  <p>© 2026 ${esc(SHOP.brand)} is a product of ${esc(SHOP.seller)}. ${PAYMENT_LINE}</p>
</div></footer>
${scripts}
</body>
</html>
`;
  writeFileSync(join(OUT, file), html);
  const to = `${DOMAIN}/${file === 'index.html' ? '' : file}`;
  writeFileSync(
    join(root, file),
    `<!doctype html><meta charset="utf-8"><title>${esc(title)}</title><link rel="canonical" href="${to}"><meta http-equiv="refresh" content="0; url=${to}"><script>location.replace(${JSON.stringify(to)} + location.search + location.hash)</script><p>Moved to <a href="${to}">${to}</a>.</p>\n`,
  );
}

// ---------------------------------------------------------------- home

// Example results shown next to each product (illustrations with made-up data).
const DEMOS = {
  'amazon-invoices': `
<div class="win"><div class="bar"><span class="dots"><i></i><i></i><i></i></span>Downloads / amazon-invoices / 2026</div><div class="body">
  <div class="file"><b>PDF</b>2026-03-14_302-4471923-invoice.pdf</div>
  <div class="file"><b>PDF</b>2026-03-02_028-1934417-invoice.pdf</div>
  <div class="file"><b>PDF</b>2026-02-21_114-8820315-invoice.pdf</div>
  <div class="file"><b>PDF</b>2026-02-09_407-5517260-invoice.pdf</div>
</div></div>`,
  'amazon-invoices-table': `
<div class="win"><div class="bar"><span class="dots"><i></i><i></i><i></i></span>amazon-invoices-2026.csv</div><div class="body"><table>
  <tr><th>Date</th><th>Order</th><th>Total</th><th>Invoice</th></tr>
  <tr><td>2026-03-14</td><td>302-4471923</td><td>€ 89.90</td><td><span class="tag g">PDF</span></td></tr>
  <tr><td>2026-03-02</td><td>028-1934417</td><td>€ 24.99</td><td><span class="tag g">PDF</span></td></tr>
  <tr><td>2026-02-21</td><td>114-8820315</td><td>€ 312.00</td><td><span class="tag g">PDF</span></td></tr>
</table></div></div>`,
  'kindle-highlights-export': `
<div class="win"><div class="bar"><span class="dots"><i></i><i></i><i></i></span>Kindle highlights.md</div><div class="body"><pre><span class="h"># The Art of Focus</span>
<span class="q">Author: J. Example · 14 highlights</span>

> Attention is the currency of the mind;
> spend it where it compounds.
<span class="q">— Location 512 · Yellow</span>

**Note:** use this in the team retro.

> Small rituals beat big plans.
<span class="q">— Location 1204</span></pre></div></div>`,
  'trello-export': `
<div class="win"><div class="bar"><span class="dots"><i></i><i></i><i></i></span>Product roadmap.csv</div><div class="body"><table>
  <tr><th>List</th><th>Card</th><th>Labels</th><th>Due</th><th>Priority</th></tr>
  <tr><td>Doing</td><td>New onboarding</td><td><span class="tag b">Design</span></td><td>Nov 12</td><td>High</td></tr>
  <tr><td>Doing</td><td>Billing page</td><td><span class="tag y">Web</span></td><td>Nov 18</td><td>Medium</td></tr>
  <tr><td>Review</td><td>Fix CSV export</td><td><span class="tag r">Bug</span></td><td>Nov 03</td><td>High</td></tr>
  <tr><td>Done</td><td>Team offsite</td><td><span class="tag g">Ops</span></td><td>Oct 28</td><td>Low</td></tr>
</table></div></div>`,
};

const SITES = { 'amazon-invoices': 'For Amazon', 'kindle-highlights-export': 'For Kindle', 'trello-export': 'For Trello' };

const productBlocks = Object.entries(SHOP.products)
  .map(([id, p], i) => `
<article class="product${i % 2 ? ' flip' : ''}" id="${id}">
  <div class="info">
    <div class="head"><img src="assets/img/${id}.png" alt="" width="52" height="52"><div><div class="for">${SITES[id] ?? ''}</div><h3>${esc(p.name)}</h3></div></div>
    <p class="tagline">${esc(p.tagline)}</p>
    <ul class="ticks">${p.pro.map((x) => `<li>${esc(x)}</li>`).join('')}<li>Up to 3 of your devices</li></ul>
    <div class="price-row"><span class="big">$${p.lifetime.price}</span><span class="sub">one-time, yours forever${MONO ? '' : ` · or $${p.monthly.price}/month`}</span></div>
    <div class="cta">
      <a class="btn primary" href="buy.html?p=${id}&amp;plan=lifetime">Get Pro — $${p.lifetime.price}</a>
      ${MONO ? '' : `<a class="btn" href="buy.html?p=${id}&amp;plan=monthly">Monthly — $${p.monthly.price}</a>`}
    </div>
    <p class="free-note"><strong>Free plan:</strong> ${p.free.map(esc).join(' · ')}.</p>
  </div>
  <div class="demo">${DEMOS[id]}</div>
</article>`)
  .join('\n');

const compareRows = Object.entries(SHOP.products)
  .map(([, p]) => `<tr><td><strong>${esc(p.name)}</strong></td><td>${esc(p.free.join(', '))}</td><td><span class="yes">Unlimited</span></td>${MONO ? '' : `<td>$${p.monthly.price}/mo</td>`}<td>$${p.lifetime.price}</td></tr>`)
  .join('');

page({
  file: 'index.html',
  title: `${SHOP.brand} — export your Amazon invoices, Kindle highlights and Trello boards`,
  description: 'Browser extensions for Chrome, Edge and Firefox that export your Amazon invoices, Kindle highlights and Trello boards in one click. Private: your data never leaves your browser.',
  body: `
<section class="hero"><div class="wrap">
  <div>
    <span class="eyebrow">Browser extensions</span>
    <h1>Your data, <span class="grad">out in one click.</span></h1>
    <p class="lead">Download every Amazon invoice for your accountant, move Kindle highlights into your notes, export a whole Trello board to a spreadsheet. No account, no uploads — it all happens in your browser.</p>
    <div class="cta">
      <a class="btn primary" href="#products">See the tools</a>
      <a class="btn" href="#pricing">Pricing</a>
    </div>
    <div class="browsers"><span class="chip">Chrome</span><span class="chip">Edge</span><span class="chip">Firefox</span></div>
    <div class="trust"><span>Free plan, no card</span><span>No passwords asked</span><span>14-day money-back</span></div>
  </div>
  <div class="stack">${DEMOS['amazon-invoices-table']}${DEMOS['trello-export']}${DEMOS['kindle-highlights-export'].replace('Kindle highlights.md', 'The Art of Focus.md')}</div>
</div></section>

<div class="wrap">
<section class="section" id="products">
  <div class="section-head"><span class="eyebrow">Products</span><h2>One small tool per site</h2><p>Each extension does one job well, on one site. Install the one you need — they are free to start.</p></div>
  ${productBlocks}
</section>

<section class="section" id="how">
  <div class="section-head"><span class="eyebrow">How it works</span><h2>Three clicks, no setup</h2></div>
  <div class="grid3">
    <div class="tile"><div class="num">1</div><h3>Open the page</h3><p>Your Amazon orders, your Kindle notebook or a Trello board — signed in as usual.</p></div>
    <div class="tile"><div class="num">2</div><h3>Click the extension</h3><p>It reads what you already see, including the next pages, and shows a preview.</p></div>
    <div class="tile"><div class="num">3</div><h3>Save the files</h3><p>PDF invoices, CSV for Excel and Google Sheets, JSON, or Markdown for Obsidian and Notion.</p></div>
  </div>
</section>

<section class="section" id="privacy">
  <div class="section-head"><span class="eyebrow">Privacy</span><h2>Your data stays with you</h2><p>We built these tools the way we'd want them for our own accounts.</p></div>
  <div class="grid3">
    <div class="tile"><div class="ico">🔒</div><h3>Nothing is uploaded</h3><p>Pages are read in your browser and saved only to files you choose. We never see your orders, books or boards.</p></div>
    <div class="tile"><div class="ico">🔑</div><h3>No passwords</h3><p>Unlike invoice services, we never ask for your Amazon login — the extension uses the session you already have.</p></div>
    <div class="tile"><div class="ico">🖱️</div><h3>Only when you click</h3><p>No background tracking, no analytics, no ads. Read the <a href="PRIVACY.html">privacy policy</a>.</p></div>
  </div>
</section>

<section class="section" id="pricing">
  <div class="section-head"><span class="eyebrow">Pricing</span><h2>Free to start. Pay once if it helps.</h2><p>Every extension is free with a daily limit. ${MONO ? 'Pro is sold per extension as a one-time lifetime license. Prices in USD; you pay the same amount in UAH by card and your bank converts it.' : 'Pro is sold per extension: one-time lifetime license or monthly. Prices in USD; VAT or sales tax is added at checkout where it applies.'}</p></div>
  <div class="table-scroll"><table class="compare">
    <tr><th>Extension</th><th>Free</th><th>Pro</th>${MONO ? '' : '<th>Monthly</th>'}<th>Lifetime</th></tr>
    ${compareRows}
  </table></div>
  <p class="note">After paying you get a license key on screen: open the extension → Settings → paste → Activate. One key works on up to 3 of your devices, in Chrome, Edge and Firefox. ${MONO ? 'Payments are taken by card on the secure page of monobank, a Ukrainian bank; we never see your card details.' : 'Payments are processed by Paddle.com, our Merchant of Record.'}</p>
</section>

<section class="section" id="faq">
  <div class="section-head"><span class="eyebrow">FAQ</span><h2>Questions</h2></div>
  <details><summary>Which Amazon stores are supported?</summary><p>All Amazon marketplaces that have the "Your Orders" page — .com, .co.uk, .de, .fr, .it, .es, .pl, .nl, .se, .ca, .com.au and others. PDF invoices are saved where Amazon issues them; for other orders you get the order summary.</p></details>
  <details><summary>Do I need to create an account?</summary><p>No. Install the extension and use it. For Pro you only paste the license key you get after paying.</p></details>
  ${MONO
    ? `<details><summary>Is there a subscription?</summary><p>No. Pro is a one-time payment and includes future updates. Nothing renews and you are never charged again.</p></details>
  <details><summary>How do I pay?</summary><p>Click "Get Pro", and you get an amount and an order code. Pay on monobank's secure page with any Visa or Mastercard, Apple Pay or Google Pay, with the code in the comment. Your license key appears on our page within a minute.</p></details>`
    : `<details><summary>Lifetime or monthly — what's the difference?</summary><p>Lifetime is a one-time payment and includes future updates. Monthly renews each month and can be cancelled any time from the link in your Paddle receipt; Pro stays active until the end of the paid month.</p></details>`}
  <details><summary>Can I get a refund?</summary><p>Yes — full refund within 14 days, no questions asked. See the <a href="refund.html">Refund Policy</a>.</p></details>
  <details><summary>I lost my license key.</summary><p>Email <a href="mailto:${esc(SHOP.supportEmail)}">${esc(SHOP.supportEmail)}</a> from the address you paid with and we'll send it again.</p></details>
  <details><summary>A site changed and the extension stopped working.</summary><p>It happens — Amazon, Kindle and Trello redesign their pages. Click "Report a problem" in the extension and email us the file; we usually fix it within days.</p></details>
</section>

<section class="final" id="support">
  <h2>Questions or ideas?</h2>
  <p>We answer within one business day.</p>
  <a class="btn" href="mailto:${esc(SHOP.supportEmail)}">${esc(SHOP.supportEmail)}</a>
</section>
<p class="note" style="margin-top:28px">Not affiliated with, endorsed or sponsored by Amazon.com, Inc. or Atlassian. Amazon and Kindle are trademarks of Amazon.com, Inc.; Trello is a trademark of Atlassian.</p>
</div>
`,
  wide: true,
});

// ---------------------------------------------------------------- buy / thanks

page({
  file: 'buy.html',
  title: 'Checkout',
  description: 'Buy a Pro license.',
  body: `
<div class="doc">
<h1 id="title">Checkout</h1>
<p id="status" class="lead">Opening the secure checkout…</p>
${MONO ? '' : `<p class="note">Payments are processed by Paddle.com, our Merchant of Record. If the checkout does not open, <a href="./">go back</a> and try again, or email <a href="mailto:${esc(SHOP.supportEmail)}">${esc(SHOP.supportEmail)}</a>.</p>`}
<noscript><p>The checkout needs JavaScript.</p></noscript>
</div>`,
  scripts: MONO
    ? `<script src="assets/config.js"></script>
<script>(function () {
  // While sales are closed buy.js shows the waitlist; ?test=1 opens the jar checkout anyway.
  var s = document.createElement('script');
  s.src = !window.SHOP.salesOpen && new URLSearchParams(location.search).get('test') !== '1' ? 'assets/buy.js' : 'assets/buy-mono.js';
  document.body.appendChild(s);
})();</script>`
    : `<script src="assets/config.js"></script>
<script src="https://cdn.paddle.com/paddle/v2/paddle.js"></script>
<script src="assets/buy.js"></script>`,
});

page({
  file: 'thanks.html',
  title: 'Thank you — your license key',
  description: 'Your license key.',
  body: `
<div class="doc">
<h1>Thank you!</h1>
<p id="status" class="lead">Getting your license key…</p>
<div id="result" hidden>
  <p>Your license key for <strong id="product"></strong>:</p>
  <div class="key" id="key"></div>
  <p><button class="btn primary" id="copy" type="button">Copy key</button></p>
  <h2>Activate Pro</h2>
  <ol>
    <li>Click the extension's icon in the browser toolbar → <strong>Settings</strong>.</li>
    <li>Paste the key and click <strong>Activate</strong>.</li>
  </ol>
  <p class="note"><strong>Save this key</strong> (for example in your password manager). It works on up to 3 devices. Lost it? Email <a href="mailto:${esc(SHOP.supportEmail)}">${esc(SHOP.supportEmail)}</a> ${MONO ? 'with your order code (or the email you gave).' : 'from the address you paid with. Your receipt comes from Paddle.'}</p>
</div>
</div>`,
  scripts: `<script src="assets/config.js"></script>
<script src="assets/thanks.js"></script>`,
});

// ---------------------------------------------------------------- legal

page({
  file: 'terms.html',
  title: 'Terms of Service',
  description: `Terms of Service for ${SHOP.brand} browser extensions.`,
  body: `
<div class="doc">
<h1>Terms of Service</h1>
<p class="note">Last updated: ${UPDATED}</p>
<p>These terms cover the browser extensions Invoice Downloader for Amazon, Highlights Exporter for Kindle and Board Exporter for Trello (the "extensions") and the Pro licenses for them, offered under the brand ${esc(SHOP.brand)} by ${esc(SHOP.seller)}, an individual software developer based in Ukraine ("we", "us").</p>

<h2>Orders and payment</h2>
${MONO
  ? `<p>Pro licenses are sold by us directly. Prices are shown in US dollars; you pay the equivalent in Ukrainian hryvnias (UAH), at the official exchange rate of the day, by card on the secure payment page of monobank (Universal Bank, Ukraine). Your bank may convert the amount to your currency and may charge its own fees. We never see your card details. Your license key is shown on our website as soon as the bank confirms the payment.</p>`
  : `<p>Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles returns. Paddle's <a href="https://www.paddle.com/legal/checkout-buyer-terms">Buyer Terms</a> apply to your purchase.</p>`}

<h2>Licenses</h2>
<ul>
  <li>The extensions are free to install and use within the free plan's limits.</li>
  <li>A Pro license is sold for one extension. It is personal: you may use it on up to 3 of your own devices. Do not share or resell keys.</li>
  ${MONO ? '' : `<li><strong>Monthly</strong> licenses renew every month until you cancel. You can cancel at any time from the link in your Paddle receipt; Pro stays active until the end of the paid month.</li>`}
  <li><strong>Lifetime</strong> licenses are a one-time payment and stay valid for as long as we offer the extension, including its updates.</li>
  <li>The extension checks your license with our license server once a day. If the check cannot run (for example, you are offline), Pro keeps working for up to 7 days.</li>
</ul>

<h2>How the extensions work</h2>
<p>The extensions read pages of third-party websites (Amazon, Kindle, Trello) that you open while signed in to your own account, and export data you already have access to. Those websites can change at any time, which can break an extension until we update it. We fix such problems as quickly as we can but cannot guarantee uninterrupted operation. You are responsible for using the extensions in line with the terms of the websites you use them on.</p>
<p>We are not affiliated with, endorsed or sponsored by Amazon.com, Inc. or Atlassian.</p>

<h2>Refunds</h2>
<p>See our <a href="refund.html">Refund Policy</a>: full refund within 14 days of purchase.</p>

<h2>Warranty and liability</h2>
<p>The extensions are provided "as is", without warranties of any kind, to the extent permitted by law. To the extent permitted by law, our total liability for any claim related to the extensions is limited to the amount you paid for the license in the 12 months before the claim. Nothing in these terms limits rights you have under consumer protection law that cannot be excluded.</p>

<h2>Changes</h2>
<p>We may update these terms; the date above shows the latest version. Material changes that affect paid licenses will not reduce what you already paid for.</p>

<h2>Contact</h2>
<p><a href="mailto:${esc(SHOP.supportEmail)}">${esc(SHOP.supportEmail)}</a></p>
</div>`,
});

page({
  file: 'refund.html',
  title: 'Refund Policy',
  description: `Refund policy for ${SHOP.brand} Pro licenses.`,
  body: `
<div class="doc">
<h1>Refund Policy</h1>
<p class="note">Last updated: ${UPDATED}</p>
${MONO
  ? `<p><strong>14-day money-back guarantee.</strong> If a Pro license does not work for you, ask for a refund within 14 days of the payment and you get the full amount back — no questions asked.</p>
<h2>How to ask</h2>
<p>Email <a href="mailto:${esc(SHOP.supportEmail)}">${esc(SHOP.supportEmail)}</a> with your order code (TF-…). We reply within one business day and agree with you how to send the money back — usually to your card. We return the full amount we received; currency conversion by your bank is outside our control.</p>`
  : `<p><strong>14-day money-back guarantee.</strong> If a Pro license does not work for you, ask for a refund within 14 days of the payment and you get the full amount back — no questions asked. This applies to lifetime licenses and to each monthly payment.</p>
<h2>How to ask</h2>
<ul>
  <li>Reply to your Paddle receipt or use <a href="https://paddle.net">paddle.net</a> to find your order and request a refund, or</li>
  <li>email <a href="mailto:${esc(SHOP.supportEmail)}">${esc(SHOP.supportEmail)}</a> from the address you paid with.</li>
</ul>
<p>Refunds are issued by Paddle.com, our Merchant of Record, to the original payment method. Banks usually show them within 5–10 business days.</p>`}
<h2>After a refund</h2>
<p>The refunded license key stops unlocking Pro. The free plan keeps working.</p>
${MONO ? '' : `<h2>Cancelling a subscription</h2>
<p>Cancel a monthly license any time from the link in your Paddle receipt. You will not be charged again, and Pro stays active until the end of the month you paid for. Cancelling does not refund past payments unless they are within the 14 days above.</p>`}
</div>`,
});

// Privacy policy: the source of truth is PRIVACY.md in the extant repo; this is its HTML.
const privacyBody = readFileSync(join(root, 'tools/privacy.html'), 'utf8')
  .replaceAll('{{SUPPORT_EMAIL}}', esc(SHOP.supportEmail))
  .replaceAll('{{UPDATED}}', UPDATED)
  .replaceAll(
    '{{PURCHASES}}',
    MONO
      ? '<p>Card payments are taken on the secure page of monobank (Universal Bank, Ukraine), which processes your card details under its own privacy policy. We never see your card number. For each order our server keeps the product, the amount, the order code, the date and, only if you enter it, your email (to resend a lost key). From the bank we receive the amount, the time and the comment of the payment, and the payer name the bank shows, to match the payment to your order and for our records.</p>'
      : '<p>Purchases are handled by Paddle.com, our Merchant of Record, on its secure checkout. Paddle collects your name, email, country and payment details and processes them under its <a href="https://www.paddle.com/legal/privacy">privacy policy</a>. We receive from Paddle the order details (product, price, date, email and country) to provide your license and support. We never see your card number.</p>',
  )
  .replaceAll('{{CHECKOUT_SCRIPT}}', MONO ? '' : " The checkout page loads Paddle's script to open the payment form.")
  .replaceAll('{{ORDER_RECORDS}}', MONO ? 'Paid order records are kept as long as the license is valid and as required by law; unpaid orders are deleted after 3 days.' : 'Order records are kept by Paddle as required for tax law.');
page({ file: 'PRIVACY.html', title: 'Privacy Policy', description: 'Privacy policy for our browser extensions and website.', body: `<div class="doc">${privacyBody}</div>` });

console.log('built index, buy, thanks, terms, refund, PRIVACY');
