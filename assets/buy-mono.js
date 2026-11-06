// Checkout through the monobank jar (payments: 'mono' in config.js).
// 1) POST /v1/mono/order → code + exact UAH amount + jar link; 2) the buyer pays on monobank's
// page; 3) we poll /v1/claim until the bank's webhook marks the order paid, then go to thanks.html.
// The order sits in the URL, so a reload (or coming back later) picks it up again.
(function () {
  var S = window.SHOP;
  var q = new URLSearchParams(location.search);
  var id = q.get('p');
  var product = S.products[id];
  var status = document.getElementById('status');
  var mail = '<a href="mailto:' + S.supportEmail + '">' + S.supportEmail + '</a>';
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  if (!product) {
    status.textContent = 'Unknown product. Please go back and pick one.';
    return;
  }
  document.getElementById('title').textContent = product.name + ' — Pro';
  document.title = product.name + ' — Checkout';

  if (q.get('order')) return showOrder({ txn: q.get('order'), code: q.get('code'), amount_uah: q.get('uah'), jar_url: q.get('jar'), usd: product.lifetime.price });

  if (q.get('test') !== '1') {
    fetch(S.licenseApi + '/v1/interest', { method: 'POST', body: new URLSearchParams({ niche: id, plan: 'lifetime' }) }).catch(function () {});
  }

  status.innerHTML =
    (q.get('plan') === 'monthly' ? '<p><strong>Monthly plans are not available yet</strong> — Pro is sold as a one-time lifetime license for now.</p>' : '') +
    '<p><strong>$' + product.lifetime.price + ' one-time</strong> · lifetime license · up to 3 devices · 14-day money-back.</p>' +
    '<form id="start" class="waitlist"><label for="email">Your email <span class="note">(optional — only to resend your key if you lose it)</span></label>' +
    '<div class="wl-row"><input id="email" type="email" placeholder="you@example.com" autocomplete="email">' +
    '<button class="btn primary" type="submit">Continue to payment</button></div></form>';

  document.getElementById('start').onsubmit = function (e) {
    e.preventDefault();
    var btn = e.target.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'One moment…';
    fetch(S.licenseApi + '/v1/mono/order', { method: 'POST', body: new URLSearchParams({ niche: id, email: document.getElementById('email').value }) })
      .then(function (r) { return r.json().then(function (b) { return { ok: r.ok, b: b }; }); })
      .then(function (r) {
        if (!r.ok) throw new Error(r.b.error || 'error');
        var u = new URL(location.href);
        u.searchParams.set('order', r.b.txn);
        u.searchParams.set('code', r.b.code);
        u.searchParams.set('uah', r.b.amount_uah);
        u.searchParams.set('jar', r.b.jar_url);
        u.searchParams.delete('plan');
        history.replaceState(null, '', u.toString());
        showOrder(r.b);
      })
      .catch(function (err) {
        btn.disabled = false;
        btn.textContent = 'Continue to payment';
        status.insertAdjacentHTML('beforeend', '<p>Could not start the payment (' + esc(err.message) + '). Try again or email ' + mail + '.</p>');
      });
  };

  function showOrder(o) {
    var uah = Number(o.amount_uah).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    status.innerHTML =
      '<ol class="paysteps">' +
      '<li><span>Amount to pay</span><div class="key"><span id="amt">' + esc(uah) + ' UAH</span></div>' +
      '<button class="btn" type="button" data-copy="' + esc(o.amount_uah) + '">Copy amount</button> <span class="note">≈ $' + esc(o.usd) + '. Your card is charged in your own currency.</span></li>' +
      '<li><span>Your order code — put it in the comment</span><div class="key">' + esc(o.code) + '</div>' +
      '<button class="btn" type="button" data-copy="' + esc(o.code) + '">Copy code</button></li>' +
      '<li><span>Pay by card on monobank\'s secure page</span>' +
      '<p><a class="btn primary" href="' + esc(o.jar_url) + '" target="_blank" rel="noopener">Open the payment page</a></p>' +
      '<p class="note">monobank is a Ukrainian bank. Any Visa or Mastercard works, also Apple Pay and Google Pay. We never see your card details.</p>' +
      '<details class="guide" open><summary>The payment page is in Ukrainian — here is what it says</summary><table>' +
      '<tr><td lang="uk">Сума поповнення</td><td>Amount — already filled in. Keep it as is.</td></tr>' +
      '<tr><td lang="uk">Ім\'я або коментар</td><td>Comment — already contains your code ' + esc(o.code) + '. If it is empty, paste the code there.</td></tr>' +
      '<tr><td lang="uk">Оплатити карткою</td><td>Pay by card — opens the card form. Or use Apple Pay / Google Pay.</td></tr>' +
      '<tr><td lang="uk">Комісія 1,8% · Заплатити за одержувача?</td><td>monobank\'s 1.8% card fee. Ticking it is optional — your key works either way.</td></tr>' +
      '<tr><td lang="uk">Поповнити банку</td><td>Pay — the final button.</td></tr>' +
      '</table></details></li>' +
      '</ol>' +
      '<p id="wait" class="lead">Waiting for your payment… keep this page open — your license key appears here automatically, usually within a minute.</p>' +
      '<p class="note">Order <code>' + esc(o.code) + '</code>. Closed the page? Bookmark it or come back with the same link. Problems? Email ' + mail + ' with your order code.</p>';
    Array.prototype.forEach.call(status.querySelectorAll('[data-copy]'), function (b) {
      b.onclick = function () {
        navigator.clipboard.writeText(b.getAttribute('data-copy')).then(function () { b.textContent = 'Copied'; });
      };
    });
    poll(o.txn, 0);
  }

  function poll(txn, tries) {
    fetch(S.licenseApi + '/v1/claim?txn=' + encodeURIComponent(txn))
      .then(function (r) { return r.status; })
      .catch(function () { return 0; })
      .then(function (code) {
        if (code === 200) {
          location.href = 'thanks.html?txn=' + encodeURIComponent(txn) + '&p=' + encodeURIComponent(id);
          return;
        }
        if (code === 404) {
          document.getElementById('wait').innerHTML = 'This order has expired (orders are kept for 3 days). If you already paid, email ' + mail + ' with your order code. Otherwise <a href="buy.html?p=' + encodeURIComponent(id) + '">start again</a>.';
          return;
        }
        // every 4 s for the first 20 min, then every 30 s
        setTimeout(function () { poll(txn, tries + 1); }, tries < 300 ? 4000 : 30000);
      });
  }
})();
