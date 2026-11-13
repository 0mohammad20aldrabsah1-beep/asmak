function fillCustomerForm() {
  const saved = getCustomer();
  if (!saved) return;
  const form = document.getElementById("customer-form");
  if (!form) return;
  if (saved.name) form.name.value = saved.name;
  if (saved.phone) setQatarPhoneInputValue(form.phone, saved.phone);
  if (saved.address) form.address.value = saved.address;
  if (saved.notes) form.notes.value = saved.notes;
}

function bindCheckoutForm() {
  const form = document.getElementById("customer-form");
  const summary = document.getElementById("checkout-summary");
  if (summary) summary.innerHTML = renderOrderSummary({ compact: true });

  bindQatarPhoneInput(form?.phone);

  if (!getCartCount()) {
    showToast("Your cart is empty — add products first");
    setTimeout(() => {
      window.location.href = "index.html#products";
    }, 1200);
    return;
  }

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const phoneLocal = parseQatarLocalNumber(form.phone.value);
    if (!phoneLocal) {
      form.phone.setCustomValidity("Enter a valid Qatar number (8 digits, e.g. 5512 3456)");
      form.phone.reportValidity();
      showToast("Invalid phone number");
      return;
    }
    form.phone.setCustomValidity("");

    if (!form.reportValidity()) return;

    const customer = {
      name: form.name.value.trim(),
      phone: formatQatarInternational(phoneLocal),
      phoneLocal,
      address: form.address.value.trim(),
      notes: form.notes.value.trim(),
    };

    saveCustomer(customer);

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    const sent = await notifyDeliveryInfo(customer);
    if (!sent) {
      showToast("Could not send data — check site connection");
    }

    if (submitBtn) submitBtn.disabled = false;
    window.location.href = "payment.html";
  });

  form?.phone?.addEventListener("input", () => {
    form.phone.setCustomValidity("");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const steps = document.getElementById("checkout-steps");
  if (steps) steps.innerHTML = renderSteps(3);
  fillCustomerForm();
  bindCheckoutForm();
  syncCartBadges();
});
