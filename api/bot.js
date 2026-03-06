const https = require("https");

module.exports = async (req, res) => {

  // 直接写死你的 Bot Token
  const TELEGRAM_TOKEN = "6055255911:AAHBLN50Aye0j7Lrmn-EqnsIuf4dVDUkPz4";

  if (req.method !== "POST") {
    res.status(200).send("Bot running");
    return;
  }

  const body = req.body;

  if (body.message && body.message.text) {

    const chatId = body.message.chat.id;
    const text = body.message.text;

    const data = JSON.stringify({
      chat_id: chatId,
      text: "你发的消息是: " + text
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

    const request = https.request(options);
    request.write(data);
    request.end();
  }

  res.status(200).json({ ok: true });
};
