# Privacy Policy

_Last updated: 2026-10-30_

This policy covers every browser extension (Chrome, Edge, Firefox) published from this repository — Invoice Downloader for Amazon, Highlights Exporter for Kindle and Board Exporter for Trello. Each one is called "the extension" below.

## What the extension stores

All data stays in your browser's extension storage (`chrome.storage`). Nothing is sent to us.

| Data | Where | Why |
|---|---|---|
| Daily usage counter (a date and a number) | This device | Enforce the free daily limit |
| License key | Your Chrome profile (synced by Chrome if you use Chrome Sync) | Keep Pro on your other devices |
| Activation ID and random device name (`chrome-…`) | This device | Identify this activation with the license server |
| Last license check result (status, time, plan name, expiry date) | This device | Keep Pro working offline for up to 7 days |
| Feature settings (export format) | Your Chrome profile | Remember your preferences |

## Page content

The extension reads the page of the supported site you are on (for example a Trello board, a YouTube video's comments or your Amazon orders) **only when you click its button**. What it reads is shown in the popup and saved only to a file you choose to export. It is never sent to us or to anyone else.

Some extensions load the same data the page shows from the site's own endpoints, with your existing session: Trello (board JSON), Amazon (the next pages of your orders and each order's invoice list), Kindle (your notebook's highlight pages), Jira (search API).

The Amazon invoice extension saves the invoices you choose to download to your computer (a folder named "amazon-invoices" in your Downloads). It never sees your Amazon password and sends nothing to us. The GitHub extension uses GitHub's public API without your credentials. The Gmail extension downloads attachments only when you click "Download all files".

## Problem reports

If you click "Report a problem", the extension saves a file to your computer with the *structure* of the page (HTML tags and class names). All text, numbers, names, links' IDs and form values are removed. Nothing is sent automatically — you decide whether to email that file to us.

## What leaves your browser

Only when you activate, check (once a day) or unlink a license, the extension sends the **license key**, the **activation ID** and the **random device name** to the Lemon Squeezy License API (`api.lemonsqueezy.com`). Lemon Squeezy is our payment provider and processes this under its own privacy policy: https://www.lemonsqueezy.com/privacy. Purchases themselves happen on Lemon Squeezy's checkout page, not in the extension. In Firefox, the extension asks for your permission before sending the license key.

## What we do not do

- No analytics, tracking, ads or third-party scripts.
- We do not collect browsing history or page content, and we do not sell or share data.
- No remote code: everything the extension runs ships inside the extension package.

## Removing your data

Uninstalling the extension deletes everything it stored. To free a device slot first, open the extension's settings and click **Unlink this device**.

## Contact

Questions: see the support address on the extension's Chrome Web Store page or settings page.
