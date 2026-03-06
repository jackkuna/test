import https from "https";

// 直接写死你的 Bot Token
const TELEGRAM_TOKEN = "6055255911:AAHBLN50Aye0j7Lrmn-EqnsIuf4dVDUkPz4";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("Bot running");
  }

  let body;
  try {
    body = typeof req.body === "object" ? req.body : JSON.parse(req.body);
  } catch (e) {
    return res.status(400).send("Invalid JSON");
  }

  // 只处理文本消息
  if (body.message && body.message.text) {
    const chatId = body.message.chat.id;
    const text = body.message.text;

    // 发送确认消息
    sendMessage(chatId, "✅ 我收到了你的消息: " + text);
  }

  res.status(200).json({ ok: true });
}

// 发送消息函数
function sendMessage(chatId, text) {
  const data = JSON.stringify({ chat_id: chatId, text });
  const options = {
    hostname: "api.telegram.org",
    path: `/bot${TELEGRAM_TOKEN}/sendMessage`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length
    }
  };

  const req = https.request(options);
  req.write(data);
  req.end();
}
