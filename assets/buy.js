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
