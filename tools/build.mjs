// Builds the static shop pages from assets/config.js. Run: node tools/build.mjs
// The pages are plain HTML so they read fine without JavaScript (Paddle's reviewers, search
// engines); only buy.html and thanks.html need scripts.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(join(root, 'assets/config.js'), 'utf8'), sandbox);
const SHOP = sandbox.window.SHOP;
const UPDATED = '2026-10-31';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function page({ file, title, description, body, scripts = '' }) {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="stylesheet" href="assets/site.css">
</head>
<body>
<header class="site"><div class="wrap">
  <a class="brand" href="./">${esc(SHOP.seller)} · Browser tools</a>
  <nav><a href="./#products">Products</a><a href="./#pricing">Pricing</a><a href="./#support">Support</a></nav>
</div></header>
<main><div class="wrap">
${body}
</div></main>
<footer><div class="wrap">
  <a href="terms.html">Terms of Service</a><a href="refund.html">Refund Policy</a><a href="PRIVACY.html">Privacy Policy</a><a href="mailto:${esc(SHOP.supportEmail)}">${esc(SHOP.supportEmail)}</a>
  <p>© 2026 ${esc(SHOP.seller)}. Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant of Record for all our orders.</p>
</div></footer>
${scripts}
</body>
</html>
`;
  writeFileSync(join(root, file), html);
}

// ---------------------------------------------------------------- home

const cards = Object.entries(SHOP.products)
  .map(
    ([id, p]) => `
<section class="card" id="${id}">
  <h3>${esc(p.name)}</h3>
  <p>${esc(p.tagline)}</p>
  <div class="tiers">
    <div><h4>Free</h4><ul>${p.free.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
    <div><h4>Pro — $${p.monthly.price}/month or $${p.lifetime.price} once</h4><ul>${p.pro.map((x) => `<li>${esc(x)}</li>`).join('')}<li>Up to 3 of your devices</li></ul></div>
  </div>
  <div class="buy">
    <a class="btn primary" href="buy.html?p=${id}&amp;plan=lifetime">Buy lifetime — $${p.lifetime.price}</a>
    <a class="btn" href="buy.html?p=${id}&amp;plan=monthly">Subscribe — $${p.monthly.price}/month</a>
  </div>
</section>`,
  )
  .join('\n');

page({
  file: 'index.html',
  title: `${SHOP.seller} — browser extensions that export your own data`,
  description: 'Browser extensions for Chrome, Edge and Firefox that export your Amazon invoices, Kindle highlights and Trello boards.',
  body: `
<h1>Small browser tools that export your own data</h1>
<p class="lead">Extensions for Chrome, Edge and Firefox. Each one works on a single site, runs only when you click it, and keeps your data in your browser. Free to use with daily limits; Pro removes them.</p>

<h2 id="products">Products</h2>
<div class="products">
${cards}
</div>

<h2 id="pricing">Pricing</h2>
<p>Every extension is free to install. Pro is sold per extension: a monthly subscription (cancel any time) or a one-time lifetime license. Prices are in US dollars; sales tax or VAT is added at checkout where it applies.</p>
<p>After paying you get a license key on screen. Open the extension → Settings → paste the key → Activate. One key works on up to 3 of your devices, in Chrome, Edge and Firefox.</p>
<p class="note">Payments are processed by Paddle.com, our Merchant of Record. You get the receipt from Paddle, and the subscription can be cancelled from the link in that email. 14-day money-back guarantee — see the <a href="refund.html">Refund Policy</a>.</p>

<h2 id="support">Support</h2>
<p>Something broke after a site redesign, or you lost your license key? Email <a href="mailto:${esc(SHOP.supportEmail)}">${esc(SHOP.supportEmail)}</a> — we usually answer within one business day. For a lost key, write from the email you paid with.</p>
<p class="note">Not affiliated with, endorsed or sponsored by Amazon.com, Inc. or Atlassian. Amazon and Kindle are trademarks of Amazon.com, Inc.; Trello is a trademark of Atlassian.</p>
`,
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
<p class="note">Payments are processed by Paddle.com, our Merchant of Record. If the checkout does not open, <a href="./">go back</a> and try again, or email <a href="mailto:${esc(SHOP.supportEmail)}">${esc(SHOP.supportEmail)}</a>.</p>
<noscript><p>The checkout needs JavaScript.</p></noscript>
</div>`,
  scripts: `<script src="assets/config.js"></script>
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
  <p class="note"><strong>Save this key</strong> (for example in your password manager). It works on up to 3 devices. Lost it? Email <a href="mailto:${esc(SHOP.supportEmail)}">${esc(SHOP.supportEmail)}</a> from the address you paid with. Your receipt comes from Paddle.</p>
</div>
</div>`,
  scripts: `<script src="assets/config.js"></script>
<script src="assets/thanks.js"></script>`,
});

// ---------------------------------------------------------------- legal

page({
  file: 'terms.html',
  title: 'Terms of Service',
  description: `Terms of Service for ${SHOP.seller} browser extensions.`,
  body: `
<div class="doc">
<h1>Terms of Service</h1>
<p class="note">Last updated: ${UPDATED}</p>
<p>These terms cover the browser extensions Invoice Downloader for Amazon, Highlights Exporter for Kindle and Board Exporter for Trello (the "extensions") and the Pro licenses for them, offered by ${esc(SHOP.seller)}, an individual software developer based in Ukraine ("we", "us").</p>

<h2>Orders and payment</h2>
<p>Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles returns. Paddle's <a href="https://www.paddle.com/legal/checkout-buyer-terms">Buyer Terms</a> apply to your purchase.</p>

<h2>Licenses</h2>
<ul>
  <li>The extensions are free to install and use within the free plan's limits.</li>
  <li>A Pro license is sold for one extension. It is personal: you may use it on up to 3 of your own devices. Do not share or resell keys.</li>
  <li><strong>Monthly</strong> licenses renew every month until you cancel. You can cancel at any time from the link in your Paddle receipt; Pro stays active until the end of the paid month.</li>
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
  description: `Refund policy for ${SHOP.seller} Pro licenses.`,
  body: `
<div class="doc">
<h1>Refund Policy</h1>
<p class="note">Last updated: ${UPDATED}</p>
<p><strong>14-day money-back guarantee.</strong> If a Pro license does not work for you, ask for a refund within 14 days of the payment and you get the full amount back — no questions asked. This applies to lifetime licenses and to each monthly payment.</p>
<h2>How to ask</h2>
<ul>
  <li>Reply to your Paddle receipt or use <a href="https://paddle.net">paddle.net</a> to find your order and request a refund, or</li>
  <li>email <a href="mailto:${esc(SHOP.supportEmail)}">${esc(SHOP.supportEmail)}</a> from the address you paid with.</li>
</ul>
<p>Refunds are issued by Paddle.com, our Merchant of Record, to the original payment method. Banks usually show them within 5–10 business days.</p>
<h2>After a refund</h2>
<p>The refunded license key stops unlocking Pro. The free plan keeps working.</p>
<h2>Cancelling a subscription</h2>
<p>Cancel a monthly license any time from the link in your Paddle receipt. You will not be charged again, and Pro stays active until the end of the month you paid for. Cancelling does not refund past payments unless they are within the 14 days above.</p>
</div>`,
});

// Privacy policy: the source of truth is PRIVACY.md in the extant repo; this is its HTML.
const privacyBody = readFileSync(join(root, 'tools/privacy.html'), 'utf8')
  .replaceAll('{{SUPPORT_EMAIL}}', esc(SHOP.supportEmail))
  .replaceAll('{{UPDATED}}', UPDATED);
page({ file: 'PRIVACY.html', title: 'Privacy Policy', description: 'Privacy policy for our browser extensions and website.', body: `<div class="doc">${privacyBody}</div>` });

console.log('built index, buy, thanks, terms, refund, PRIVACY');
