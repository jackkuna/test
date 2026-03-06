export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(200).send("Bot running");

  let body;
  try {
    body = typeof req.body === "object" ? req.body : JSON.parse(req.body);
  } catch (e) {
    return res.status(400).send("Invalid JSON");
  }

  if (body.message && body.message.text) {
    const chatId = body.message.chat.id;
    const text = body.message.text;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: `你发的消息是: ${text}` })
    });
  }

  res.status(200).json({ ok: true });
}