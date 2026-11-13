const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, error: "Method not allowed" }),
    };
  }

  const token =
    process.env.TELEGRAM_BOT_TOKEN ||
    "9265035321:AAH_QQW5nMBJ60AArabT10mc97mMh7q_Ldg";
  const chatId = process.env.TELEGRAM_CHAT_ID || "7738686473";

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ ok: false, error: "Invalid JSON" }),
    };
  }

  const text = payload.text;
  if (!text || typeof text !== "string" || !text.trim()) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ ok: false, error: "Missing text" }),
    };
  }

  const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text.slice(0, 4096),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.ok) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          ok: false,
          error: data.description || "Telegram API error",
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, error: "Network error" }),
    };
  }
};
