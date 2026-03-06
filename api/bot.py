import json
import urllib.request

# Telegram bot token
TOKEN = "YOUR_BOT_TOKEN"
TELEGRAM_API = f"https://api.telegram.org/bot{TOKEN}/sendMessage"

# Telegra.ph API
TELEGRAPH_API = "https://api.telegra.ph/createPage"

def send_telegram(chat_id, text):
    data = {
        "chat_id": chat_id,
        "text": text
    }
    req = urllib.request.Request(TELEGRAM_API, data=json.dumps(data).encode(), headers={'Content-Type': 'application/json'})
    urllib.request.urlopen(req)

def publish_telegra(text, author_name="Bot"):
    lines = text.strip().split("\n")
    title = lines[0]
    content_lines = lines[1:]
    content = [{"tag": "p", "children": [line]} for line in content_lines]
    payload = {
        "title": title,
        "author_name": author_name,
        "content": content,
        "return_content": False
    }
    req = urllib.request.Request(TELEGRAPH_API, data=json.dumps(payload).encode(), headers={'Content-Type': 'application/json'})
    resp = urllib.request.urlopen(req)
    result = json.loads(resp.read())
    if result.get("ok"):
        return result["result"]["url"]
    else:
        return None

def handler(event, context):
    body = json.loads(event['body'])
    message = body.get("message", {})
    text = message.get("text", "")
    chat_id = message["chat"]["id"]
    if not text:
        send_telegram(chat_id, "请发送文本")
        return {"statusCode": 200, "body": "ok"}

    url = publish_telegra(text, author_name=message["from"]["first_name"])
    if url:
        send_telegram(chat_id, f"文章已发布: {url}")
    else:
        send_telegram(chat_id, "发布失败")
    return {"statusCode": 200, "body": "ok"}
