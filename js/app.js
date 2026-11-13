function cartWidgetHtml(product) {
  const qty = getQuantity(product.id);
  const inCart = qty > 0;

  if (!inCart) {
    return `
      <button type="button" class="btn-add-cart" data-cart-add="${product.id}">
        Add to cart
      </button>`;
  }

  return `
    <div class="qty-stepper" dir="ltr" data-id="${product.id}">
      <button type="button" class="qty-stepper__btn" data-qty-dec="${product.id}" aria-label="Decrease quantity">−</button>
      <span class="qty-stepper__value" data-qty-display="${product.id}">${qty}</span>
      <button type="button" class="qty-stepper__btn qty-stepper__btn--plus" data-qty-inc="${product.id}" aria-label="Increase quantity">+</button>
    </div>`;
}

function renderProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid || typeof PRODUCTS === "undefined") return;

  grid.innerHTML = PRODUCTS.map((product) => {
    const qty = getQuantity(product.id);
    const inCart = qty > 0;
    return `
    <article class="product-card${inCart ? " is-selected" : ""}" data-id="${product.id}">
      <div class="product-card__media">
        <img src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy" width="320" height="320" />
        ${inCart ? '<span class="selected-chip">Selected</span>' : '<span class="selected-chip" aria-hidden="true"></span>'}
      </div>
      <div class="product-card__body">
        ${product.fresh ? '<span class="fresh-badge">Fresh</span>' : ""}
        <h3 class="product-card__name">${escapeHtml(product.name)}</h3>
        <p class="product-card__price"><span class="currency">${formatPrice(product.price)}</span></p>
        <div class="product-card__cart-slot" data-cart-slot="${product.id}">
          ${cartWidgetHtml(product)}
        </div>
      </div>
    </article>`;
  }).join("");
}

function refreshProductSelection(id) {
  const product = getProductById(id);
  if (!product) return;

  const qty = getQuantity(id);
  const slot = document.querySelector(`[data-cart-slot="${id}"]`);
  if (slot) slot.innerHTML = cartWidgetHtml(product);

  const card = document.querySelector(`.product-card[data-id="${id}"]`);
  if (!card) return;

  card.classList.toggle("is-selected", qty > 0);
  const chip = card.querySelector(".selected-chip");
  if (chip) chip.textContent = qty > 0 ? "Selected" : "";
}

function renderFeaturedOffer() {
  const slot = document.getElementById("featured-cart-slot");
  if (!slot || typeof FEATURED_OFFER === "undefined") return;
  slot.innerHTML = cartWidgetHtml(FEATURED_OFFER);
}

function bindInteractions() {
  const main = document.querySelector("main");
  if (!main) return;

  main.addEventListener("click", (event) => {
    const addCart = event.target.closest("[data-cart-add]");
    const inc = event.target.closest("[data-qty-inc]");
    const dec = event.target.closest("[data-qty-dec]");

    let id = null;
    let message = null;

    if (addCart) {
      id = addCart.getAttribute("data-cart-add");
      setQuantity(id, 1);
      message = "add";
    } else if (inc) {
      id = inc.getAttribute("data-qty-inc");
      setQuantity(id, getQuantity(id) + 1);
    } else if (dec) {
      id = dec.getAttribute("data-qty-dec");
      const next = getQuantity(id) - 1;
      setQuantity(id, next);
      message = next === 0 ? "remove" : null;
    } else {
      return;
    }

    const product = getProductById(id);
    syncCartBadges();
    refreshProductSelection(id);

    if (product && message === "add") {
      showToast(`Added: ${product.name.slice(0, 42)}…`);
    } else if (product && message === "remove") {
      showToast(`Removed: ${product.name.slice(0, 42)}…`);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderFeaturedOffer();
  renderProducts();
  bindInteractions();
  syncCartBadges();
});
