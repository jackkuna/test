import https from "https";

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

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

    const data = JSON.stringify({
      chat_id: chatId,
      text: `你发的消息是: ${text}`
    });

    const options = {
      hostname: "api.telegram.org",
      path: `/bot${TELEGRAM_TOKEN}/sendMessage`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length
      }
    };

    const request = https.request(options, (response) => {
      response.on("data", () => {}); // 忽略返回内容
    });

    request.on("error", (error) => {
      console.error(error);
    });

    request.write(data);
    request.end();
  }

  res.status(200).json({ ok: true });
}
