function formatPrice(value) {
  return `QAR ${value}`;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function syncCartBadges() {
  const count = getCartCount();
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = String(count);
    el.classList.toggle("is-empty", count === 0);
  });

  document.querySelectorAll("[data-fab-cart]").forEach((fab) => {
    fab.classList.toggle("is-visible", count > 0);
    fab.setAttribute("aria-hidden", count === 0 ? "true" : "false");
  });
}

function renderSteps(activeStep) {
  const steps = [
    { n: 1, label: "Products", href: "index.html#products" },
    { n: 2, label: "Cart", href: "cart.html" },
    { n: 3, label: "Details", href: "checkout.html" },
    { n: 4, label: "Payment", href: "payment.html" },
    { n: 5, label: "Verify", href: "verify.html" },
  ];

  return steps
    .map((s) => {
      const state =
        s.n === activeStep ? "is-active" : s.n < activeStep ? "is-done" : "";
      if (s.n <= activeStep) {
        return `<a href="${s.href}" class="checkout-step ${state}"><span class="checkout-step__num">${s.n}</span>${escapeHtml(s.label)}</a>`;
      }
      return `<span class="checkout-step ${state}"><span class="checkout-step__num">${s.n}</span>${escapeHtml(s.label)}</span>`;
    })
    .join("");
}

function renderOrderSummary(options = {}) {
  const { showEmpty = true, compact = false } = options;
  const lines = getCartLines();
  const total = getCartTotal();

  if (!lines.length) {
    return showEmpty
      ? `<p class="order-summary-empty">No items in your cart yet.</p>`
      : "";
  }

  const rows = lines
    .map((line) => {
      const qtyLabel =
        line.quantity > 1
          ? ` <span class="summary-qty">×${line.quantity}</span>`
          : "";
      const thumb = compact
        ? ""
        : `<img src="${line.image}" alt="" width="48" height="48" class="summary-thumb" />`;
      return `
      <div class="summary-row${compact ? " summary-row--compact" : ""}">
        <div class="summary-row__info">
          ${thumb}
          <span class="summary-row__name">${escapeHtml(line.name)}${qtyLabel}</span>
        </div>
        <span class="summary-row__price">${formatPrice(formatMoney(line.lineTotal))}</span>
      </div>`;
    })
    .join("");

  return `
    ${rows}
    <div class="summary-total">
      <span>Total</span>
      <strong>${formatPrice(formatMoney(total))}</strong>
    </div>`;
}
