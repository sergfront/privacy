(function () {
  var S = window.SHOP;
  var q = new URLSearchParams(location.search);
  var txn = q.get('txn') || '';
  var product = S.products[q.get('p')];
  var status = document.getElementById('status');
  var mail = '<a href="mailto:' + S.supportEmail + '">' + S.supportEmail + '</a>';
  var api = S.licenseApi;
  if (!/^txn_[a-z0-9]+$/.test(txn)) {
    status.innerHTML = 'No order found in this link. If you paid, email ' + mail + ' from the address you paid with.';
    return;
  }
  var tries = 0;
  function attempt() {
    tries++;
    fetch(api + '/v1/claim?txn=' + encodeURIComponent(txn))
      .then(function (r) { return r.json().then(function (b) { return { status: r.status, body: b }; }); })
      .then(function (r) {
        if (r.status === 200) return show(r.body.license_key);
        if ((r.status === 409 || r.status >= 500) && tries < 30) return setTimeout(attempt, 2000);
        fail();
      })
      .catch(function () { tries < 30 ? setTimeout(attempt, 2000) : fail(); });
  }
  function show(key) {
    status.textContent = 'Payment received.';
    document.getElementById('product').textContent = product ? product.name + ' Pro' : 'Pro';
    document.getElementById('key').textContent = key;
    document.getElementById('result').hidden = false;
    var btn = document.getElementById('copy');
    btn.onclick = function () {
      navigator.clipboard.writeText(key).then(function () { btn.textContent = 'Copied'; });
    };
  }
  function fail() {
    status.innerHTML = 'We could not get your key right now. Your payment is safe — reload this page in a minute, or email ' + mail + ' with order ID <code>' + txn + '</code>.';
  }
  attempt();
})();
