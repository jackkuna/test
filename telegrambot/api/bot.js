import fetch from "node-fetch";

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN; // 你的 bot token

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("Bot is running");
  }

  const body = req.body;

  if (body.message && body.message.text) {
    const chatId = body.message.chat.id;
    const text = body.message.text;

    // 回复消息
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: `你发的消息是: ${text}`
      })
    });
  }

  res.status(200).json({ ok: true });
}