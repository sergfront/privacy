// Public settings for the shop pages. Nothing secret belongs here: the client-side token
// is meant to be public (it can only open checkouts), the API key lives in the Worker.
window.SHOP = {
  // "sandbox" while testing; switch to "live" with the live token and live price IDs.
  env: 'sandbox',
  clientToken: 'test_c8c209ac17d24180d9afb2dbf58',
  // License server (Cloudflare Worker, license-server/ in the extant repo).
  licenseApi: 'https://api.totefile.com',
  supportEmail: 'sergefrontend@gmail.com',
  brand: 'Totefile',
  // Legal seller (Paddle account name); shown as "Totefile is a product of …".
  seller: 'Serhii Solutions',
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
