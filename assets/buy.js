(function () {
  var S = window.SHOP;
  var q = new URLSearchParams(location.search);
  var id = q.get('p');
  var plan = q.get('plan') === 'monthly' ? 'monthly' : 'lifetime';
  var product = S.products[id];
  var status = document.getElementById('status');
  if (!product) {
    status.textContent = 'Unknown product. Please go back and pick one.';
    return;
  }
  document.getElementById('title').textContent = product.name + ' — Pro';
  document.title = product.name + ' — Checkout';

  // Anonymous count of Buy clicks (product + plan only), so we know which Pro people want.
  if (q.get('test') !== '1') {
    fetch(S.licenseApi + '/v1/interest', { method: 'POST', body: new URLSearchParams({ niche: id, plan: plan }) }).catch(function () {});
  }

  if (!S.salesOpen && q.get('test') !== '1') {
    status.innerHTML =
      'Pro is launching soon. The free version already works — install it and use it today.' +
      '<form id="wl" class="waitlist"><label for="wl-email">Get one email when ' + product.name + ' Pro is available:</label>' +
      '<div class="wl-row"><input id="wl-email" type="email" required placeholder="you@example.com" autocomplete="email">' +
      '<button class="btn primary" type="submit">Notify me</button></div>' +
      '<p class="note">We only use your email for this one message. <a href="PRIVACY.html">Privacy</a></p></form>' +
      '<p><a class="btn" href="./#' + id + '">Back</a></p>';
    document.getElementById('wl').onsubmit = function (e) {
      e.preventDefault();
      var email = document.getElementById('wl-email').value;
      fetch(S.licenseApi + '/v1/waitlist', { method: 'POST', body: new URLSearchParams({ email: email, niche: id }) })
        .then(function (r) { return r.json().then(function (b) { return { ok: r.ok, b: b }; }); })
        .then(function (r) {
          document.getElementById('wl').innerHTML = r.ok
            ? '<p><strong>Thanks!</strong> We will email ' + email.replace(/[<>&"]/g, '') + ' once ' + product.name + ' Pro is available.</p>'
            : '<p>' + (r.b.error || 'Something went wrong.') + '</p>';
        })
        .catch(function () { document.getElementById('wl').innerHTML = '<p>Network error — please try again or email ' + S.supportEmail + '.</p>'; });
    };
    return;
  }

  if (S.env === 'sandbox') Paddle.Environment.set('sandbox');
  Paddle.Initialize({
    token: S.clientToken,
    eventCallback: function (e) {
      if (e.name === 'checkout.completed' && e.data && e.data.transaction_id) {
        location.href = 'thanks.html?txn=' + encodeURIComponent(e.data.transaction_id) + '&p=' + encodeURIComponent(id);
      }
      if (e.name === 'checkout.closed') {
        status.innerHTML = 'Checkout closed. <a href="">Open it again</a> or <a href="./">go back</a>.';
      }
    },
  });
  Paddle.Checkout.open({
    items: [{ priceId: product[plan].priceId, quantity: 1 }],
    customData: { niche: id, plan: plan },
    settings: { displayMode: 'overlay', theme: 'light', locale: 'en', allowLogout: true },
  });
  status.textContent = (plan === 'monthly' ? '$' + product.monthly.price + ' per month' : '$' + product.lifetime.price + ' one-time') + ' — complete the payment in the window.';
})();
