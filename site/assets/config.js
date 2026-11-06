// Public settings for the shop pages. Nothing secret belongs here: the client-side token
// is meant to be public (it can only open checkouts), the API key lives in the Worker.
window.SHOP = {
  // "sandbox" while testing; switch to "live" with the live token and live price IDs.
  env: 'sandbox',
  // true: buy.html sells (monobank jar). false: buy.html says Pro is coming soon
  // instead of opening checkout (add ?test=1 to open the sandbox checkout for testing).
  salesOpen: true,
  // How Pro is paid for: 'mono' = monobank jar (lifetime only, key appears after the bank's
  // webhook), 'paddle' = Paddle checkout (needs a verified live account).
  payments: 'mono',
  clientToken: 'test_c8c209ac17d24180d9afb2dbf58',
  // License server (Cloudflare Worker, license-server/ in the extant repo).
  licenseApi: 'https://api.totefile.com',
  supportEmail: 'sergefrontend@gmail.com',
  brand: 'Totefile',
  // Legal seller (Paddle account name); shown as "Totefile is a product of …".
  seller: 'Serhii Solutions',
  // Own USDT wallets for "Pay with USDT" (must match WALLETS in license-server/src/crypto.ts).
  cryptoWallets: {
    tron: { label: 'TRON (TRC20)', address: 'TVaCJT9pyoFzzNAac6pvPYx92zt9krK6yK' },
    bsc: { label: 'BNB Smart Chain (BEP20)', address: '0xe67CDEaB4De8151ab2E33cF096d5ae1b99A2AB50' },
    solana: { label: 'Solana', address: '7bC4NgH8diEodQ1TrHjYufF1sTBYxh98FAvsfBVwrQaN' },
    ton: { label: 'TON', address: 'UQArUdyzsOl6WT_jPYVOkis4n78UdmotNa2hQNoz20KlbJLI' },
  },
  products: {
    'amazon-invoices': {
      name: 'Invoice Downloader for Amazon',
      tagline: 'Save your Amazon invoices (PDF where Amazon issues them) and order summaries in one click, plus a list for your accountant.',
      free: ['5 runs per day', 'First 5 invoices of each run — preview, export and download'],
      pro: ['Every invoice of the period you pick — hundreds at once', 'Spreadsheet list for your bookkeeping', 'No limits on runs or invoices'],
      monthly: { price: 5, priceId: 'pri_01m68gdh5556abae27rqcadeqw' },
      lifetime: { price: 39, priceId: 'pri_01m68gdhcr32xepv3ngsr76cz5' },
    },
    'kindle-highlights-export': {
      name: 'Highlights Exporter for Kindle',
      tagline: 'Export your Kindle highlights and notes to Markdown (grouped by book) or CSV.',
      free: ['The book you have open', 'First 10 highlights of each run'],
      pro: ['Your whole Kindle library in one run', 'Markdown for Obsidian / Notion, CSV for spreadsheets', 'No limits'],
      monthly: { price: 4, priceId: 'pri_01m68gdht1kmh0ys390nj5fnd1' },
      lifetime: { price: 29, priceId: 'pri_01m68gdj0ebdnr8585qgm81f30' },
    },
    'trello-export': {
      name: 'Board Exporter for Trello',
      tagline: 'Export a Trello board to CSV or JSON in board order, with custom fields, dates and checklists.',
      free: ['5 runs per day', 'First 20 cards of each run'],
      pro: ['Whole boards, any size', 'Custom fields, checklists, labels, members, dates', 'No limits'],
      monthly: { price: 3, priceId: 'pri_01m68gdje24w2n8nj18h3hrxkf' },
      lifetime: { price: 19, priceId: 'pri_01m68gdjkg34xy2193re4m6rfy' },
    },
  },
};
