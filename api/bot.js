import https from "https";

const TELEGRAM_TOKEN = "6055255911:AAHBLN50Aye0j7Lrmn-EqnsIuf4dVDUkPz4";

// 如果想用匿名 telegra.ph，可以不填 access_token
const TELEGRAPH_ACCESS_TOKEN = ""; // 空字符串 → 匿名

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

  if (body.message && body.message.text) {
    const chatId = body.message.chat.id;
    const text = body.message.text;

    // ---- 第一步：回复确认消息 ----
    sendTelegramMessage(chatId, "✅ 我收到了你的消息: " + text);

    // ---- 第二步：发到 telegra.ph ----
    createTelegraphPage("Bot 消息转发", text).then((url) => {
      console.log("文章地址:", url);
      sendTelegramMessage(chatId, "📄 已发到 telegra.ph: " + url);
    }).catch(err => {
      console.error(err);
      sendTelegramMessage(chatId, "⚠️ 发贴失败");
    });
  }

  res.status(200).json({ ok: true });
}

// 发送 Telegram 消息
function sendTelegramMessage(chatId, text) {
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

// 调用 telegra.ph API 发文章
function createTelegraphPage(title, content) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      access_token: TELEGRAPH_ACCESS_TOKEN,
      title: title,
      author_name: "TelegramBot",
      content: [{ tag: "p", children: [content] }],
      return_content: false
    });

    const options = {
      hostname: "api.telegra.ph",
      path: "/createPage",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": postData.length
      }
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          const result = JSON.parse(data);
          if (result.ok) {
            resolve("https://telegra.ph/" + result.result.path);
          } else {
            reject(result.error);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", reject);
    req.write(postData);
    req.end();
  });
}
