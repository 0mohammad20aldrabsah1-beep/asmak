const CART_KEY = "asmak_cart";
const CUSTOMER_KEY = "asmak_customer";

function parseCart(raw) {
  if (!raw) return {};
  try {
    const data = JSON.parse(raw);
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
}

function getCart() {
  return parseCart(localStorage.getItem(CART_KEY));
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getCartCount() {
  const cart = getCart();
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function isInCart(productId) {
  return (getCart()[String(productId)] || 0) > 0;
}

function getQuantity(productId) {
  return getCart()[String(productId)] || 0;
}

function setQuantity(productId, quantity) {
  const cart = getCart();
  const id = String(productId);
  const qty = Math.max(0, Math.min(99, Math.floor(quantity)));
  if (qty <= 0) delete cart[id];
  else cart[id] = qty;
  saveCart(cart);
  return cart;
}

function toggleProduct(productId) {
  if (isInCart(productId)) {
    setQuantity(productId, 0);
    return false;
  }
  setQuantity(productId, 1);
  return true;
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
}

function getCustomer() {
  try {
    const data = JSON.parse(localStorage.getItem(CUSTOMER_KEY) || "null");
    return data && typeof data === "object" ? data : null;
  } catch {
    return null;
  }
}

function saveCustomer(info) {
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(info));
}

function clearCustomer() {
  localStorage.removeItem(CUSTOMER_KEY);
}

function priceToNumber(value) {
  return Number.parseFloat(String(value).replace(",", ""));
}

function getCartLines() {
  const resolve =
    typeof getProductById === "function"
      ? getProductById
      : (id) => {
          const list =
            typeof ALL_PRODUCTS !== "undefined"
              ? ALL_PRODUCTS
              : typeof PRODUCTS !== "undefined"
                ? PRODUCTS
                : [];
          return list.find((p) => String(p.id) === String(id));
        };
  const cart = getCart();
  return Object.entries(cart)
    .map(([id, qty]) => {
      const product = resolve(id);
      if (!product || qty < 1) return null;
      const unit = priceToNumber(product.price);
      return {
        ...product,
        quantity: qty,
        lineTotal: unit * qty,
      };
    })
    .filter(Boolean);
}

function getCartTotal() {
  return getCartLines().reduce((sum, line) => sum + line.lineTotal, 0);
}

function formatMoney(amount) {
  return amount.toFixed(2);
}
