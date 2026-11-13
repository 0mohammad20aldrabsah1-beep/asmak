function renderCartPage() {
  const list = document.getElementById("cart-list");
  const empty = document.getElementById("cart-empty");
  const footer = document.getElementById("cart-footer");
  const summary = document.getElementById("cart-summary");
  if (!list) return;

  const lines = getCartLines();
  if (!lines.length) {
    list.innerHTML = "";
    empty?.classList.remove("is-hidden");
    footer?.classList.add("is-hidden");
    if (summary) summary.innerHTML = renderOrderSummary({ showEmpty: true });
    return;
  }

  empty?.classList.add("is-hidden");
  footer?.classList.remove("is-hidden");

  list.innerHTML = lines
    .map(
      (line) => `
    <article class="cart-item" data-id="${line.id}">
      <img class="cart-item__img" src="${line.image}" alt="" width="96" height="96" />
      <div class="cart-item__body">
        <h3 class="cart-item__name">${escapeHtml(line.name)}</h3>
        <p class="cart-item__unit">${formatPrice(line.price)} each</p>
        <div class="qty-control">
          <button type="button" class="qty-btn" data-qty-dec="${line.id}" aria-label="Decrease quantity">−</button>
          <span class="qty-value">${line.quantity}</span>
          <button type="button" class="qty-btn" data-qty-inc="${line.id}" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <div class="cart-item__aside">
        <p class="cart-item__line-total">${formatPrice(formatMoney(line.lineTotal))}</p>
        <button type="button" class="text-btn text-btn--danger" data-remove="${line.id}">Remove</button>
      </div>
    </article>`,
    )
    .join("");

  if (summary) {
    summary.innerHTML = renderOrderSummary({ showEmpty: false });
  }
  syncCartBadges();
}

function bindCartEvents() {
  const list = document.getElementById("cart-list");
  if (!list) return;

  list.addEventListener("click", (e) => {
    const remove = e.target.closest("[data-remove]");
    if (remove) {
      setQuantity(remove.getAttribute("data-remove"), 0);
      renderCartPage();
      showToast("Item removed from cart");
      return;
    }
    const inc = e.target.closest("[data-qty-inc]");
    if (inc) {
      const id = inc.getAttribute("data-qty-inc");
      setQuantity(id, getQuantity(id) + 1);
      renderCartPage();
      return;
    }
    const dec = e.target.closest("[data-qty-dec]");
    if (dec) {
      const id = dec.getAttribute("data-qty-dec");
      setQuantity(id, getQuantity(id) - 1);
      renderCartPage();
    }
  });

  document.getElementById("btn-checkout")?.addEventListener("click", () => {
    if (!getCartCount()) {
      showToast("Select at least one product");
      return;
    }
    window.location.href = "checkout.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const steps = document.getElementById("checkout-steps");
  if (steps) steps.innerHTML = renderSteps(2);
  renderCartPage();
  bindCartEvents();
  syncCartBadges();
});
