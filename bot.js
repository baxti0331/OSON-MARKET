const { Telegraf, Markup } = require('telegraf');
const { Pool } = require('pg');

const bot = new Telegraf(process.env.BOT_TOKEN);
const db = new Pool({ connectionString: process.env.DATABASE_URL });

// Инициализация пользователя
async function initUser(id) {
  await db.query(`
    INSERT INTO users (id, balance, autoclick)
    VALUES ($1, 0, 0)
    ON CONFLICT (id) DO NOTHING
  `, [id]);
}

// Команда /start
bot.start(async (ctx) => {
  const id = ctx.from.id;
  await initUser(id);
  await ctx.reply('🏠 Главное меню:', mainMenu());
});

// Обработка inline-кнопок
bot.on('callback_query', async (ctx) => {
  const action = ctx.callbackQuery.data;
  const id = ctx.from.id;

  await initUser(id);
  await ctx.answerCbQuery();

  if (action === 'earn') {
    await db.query("UPDATE users SET balance = balance + 1 WHERE id = $1", [id]);
    const { rows } = await db.query("SELECT balance FROM users WHERE id = $1", [id]);
    return ctx.editMessageText(`Вы заработали 1 монету! 💰 Всего: ${rows[0].balance}`, mainMenu());
  }

  if (action === 'shop') {
    return ctx.editMessageText('🛍 Магазин:\n\n1. Купить автокликер — 50 монет', shopMenu());
  }

  if (action === 'buy_autoclick') {
    const { rows } = await db.query("SELECT balance, autoclick FROM users WHERE id = $1", [id]);
    const user = rows[0];
    if (user.balance >= 50 && user.autoclick === 0) {
      await db.query("UPDATE users SET balance = balance - 50, autoclick = 1 WHERE id = $1", [id]);
      return ctx.editMessageText("✅ Автокликер куплен!", shopMenu());
    } else {
      return ctx.editMessageText("❌ Недостаточно монет или уже куплено.", shopMenu());
    }
  }

  if (action === 'upgrades') {
    return ctx.editMessageText('📈 Улучшения:\n\n- Автокликер работает каждую минуту.', upgradesMenu());
  }

  if (action === 'profile') {
    const { rows } = await db.query("SELECT balance, autoclick FROM users WHERE id = $1", [id]);
    const user = rows[0];
    return ctx.editMessageText(`👤 Профиль:\n\n💰 Монет: ${user.balance}\n⚙ Автокликер: ${user.autoclick ? 'Вкл' : 'Выкл'}`, profileMenu());
  }

  if (action === 'back') {
    return ctx.editMessageText('🏠 Главное меню:', mainMenu());
  }
});

// Автокликер
setInterval(async () => {
  await db.query("UPDATE users SET balance = balance + 1 WHERE autoclick = 1");
}, 60000);

// Меню
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
console.log('🤖 Бот с PostgreSQL запущен!');
