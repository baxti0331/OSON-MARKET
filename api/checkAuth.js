import crypto from "crypto";

const BOT_TOKEN = process.env.BOT_TOKEN;

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, error: "Method Not Allowed" });
    return;
  }

  const { initData } = req.body;
  if (!initData) {
    res.status(400).json({ success: false, error: "No initData provided" });
    return;
  }

  // Парсим initData в объект
  const params = {};
  initData.split("&").forEach(pair => {
    const [key, value] = pair.split("=");
    params[key] = decodeURIComponent(value);
  });

  const hash = params.hash;
  if (!hash) {
    res.status(400).json({ success: false, error: "No hash in initData" });
    return;
  }
  delete params.hash;

  // Строка проверки
  const dataCheckString = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join("\n");

  // Ключ для HMAC
  const secretKey = crypto.createHash("sha256").update(BOT_TOKEN).digest();

  // Создаём HMAC SHA256 из строки проверки
  const hmac = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  if (hmac === hash) {
    res.status(200).json({ success: true });
  } else {
    res.status(403).json({ success: false, error: "Invalid hash" });
  }
}
