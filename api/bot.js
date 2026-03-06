export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(200).send("Bot running");
    return;
  }

  const TELEGRAM_TOKEN = "6055255911:AAHBLN50Aye0j7Lrmn-EqnsIuf4dVDUkPz4";

  try {
    const body = req.body;

    if (body.message && body.message.text) {
      const chatId = body.message.chat.id;
      const text = body.message.text;

      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: "你发的是: " + text
        })
      });
    }

    res.status(200).json({ ok: true });

  } catch (e) {
    res.status(200).json({ error: e.toString() });
  }
}
