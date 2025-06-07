import crypto from "crypto";

const BOT_TOKEN = process.env.BOT_TOKEN;

function checkTelegramAuth(initData) {
  const params = {};
  initData.split('&').forEach(pair => {
    const [key, value] = pair.split('=');
    params[key] = value;
  });

  const hash = params.hash;
  delete params.hash;

  const dataCheckString = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('\n');

  const secretKey = crypto.createHash('sha256').update(BOT_TOKEN).digest();

  const hmac = crypto.createHmac('sha
