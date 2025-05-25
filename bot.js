
require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const sqlite3 = require('sqlite3').verbose();

const bot = new Telegraf(process.env.BOT_TOKEN);
const db = new sqlite3.Database('database.db');

db.run(\`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    balance INTEGER DEFAULT 0,
    autoclick INTEGER DEFAULT 0
  )
\`);

function initUser(id) {
  db.run(
    \`INSERT OR IGNORE INTO users (id, balance, autoclick) VALUES (?, 0, 0)\`,
    [id]
  );
}

bot.start((ctx) => {
  const id = ctx.from.id;
  initUser(id);
  ctx.reply('🏠 Главное меню:', mainMenu());
});

bot.on('callback_query', (ctx) => {
  const action = ctx.callbackQuery.data;
  const id = ctx.from.id;

  initUser(id);
  ctx.answerCbQuery();

  if (action === 'earn') {
    db.run(\`UPDATE users SET balance = balance + 1 WHERE id = ?\`, [id], () => {
      db.get(\`SELECT balance FROM users WHERE id = ?\`, [id], (err, row) => {
        ctx.editMessageText(\`Вы заработали 1 монету! 💰 Всего: \${row.balance}\`, mainMenu());
      });
    });
  }

  if (action === 'shop') {
    ctx.editMessageText('🛍 Магазин:\n\n1. Купить автокликер — 50 монет', shopMenu());
  }

  if (action === 'buy_autoclick') {
    db.get(\`SELECT balance, autoclick FROM users WHERE id = ?\`, [id], (err, user) => {
      if (user.balance >= 50 && user.autoclick === 0) {
        db.run(\`UPDATE users SET balance = balance - 50, autoclick = 1 WHERE id = ?\`, [id], () => {
          ctx.editMessageText("✅ Автокликер куплен!", shopMenu());
        });
      } else {
        ctx.editMessageText("❌ Недостаточно монет или уже куплено.", shopMenu());
      }
    });
  }

  if (action === 'upgrades') {
    ctx.editMessageText('📈 Улучшения:\n\n- Автокликер работает каждую минуту.', upgradesMenu());
  }

  if (action === 'profile') {
    db.get(\`SELECT balance, autoclick FROM users WHERE id = ?\`, [id], (err, user) => {
      ctx.editMessageText(\`👤 Профиль:\n\n💰 Монет: \${user.balance}\n⚙ Автокликер: \${user.autoclick ? 'Вкл' : 'Выкл'}\`, profileMenu());
    });
  }

  if (action === 'back') {
    ctx.editMessageText('🏠 Главное меню:', mainMenu());
  }
});

setInterval(() => {
  db.run(\`UPDATE users SET balance = balance + 1 WHERE autoclick = 1\`);
}, 60000);

function mainMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('💰 Заработать', 'earn')],
    [Markup.button.callback('🛍 Магазин', 'shop')],
    [Markup.button.callback('📈 Улучшения', 'upgrades')],
    [Markup.button.callback('👤 Профиль', 'profile')],
  ]);
}

function shopMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('🛒 Купить автокликер (50)', 'buy_autoclick')],
    [Markup.button.callback('⬅ Назад', 'back')]
  ]);
}

function upgradesMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('⬅ Назад', 'back')]
  ]);
}

function profileMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('⬅ Назад', 'back')]
  ]);
}

bot.launch();
console.log('🤖 Бот с SQLite запущен!');
