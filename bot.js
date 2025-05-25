const { Telegraf, Markup, session } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());

bot.start((ctx) => {
  ctx.session.state = 'main';
  return showMainMenu(ctx);
});

bot.hears('⬅ Назад', async (ctx) => {
  ctx.session.state = 'main';
  return showMainMenu(ctx);
});

bot.hears('💰 Заработать', (ctx) => {
  ctx.session.coins = (ctx.session.coins || 0) + 1;
  ctx.reply(`Вы заработали 1 монету! 💰 Всего: ${ctx.session.coins}`);
});

bot.hears('🛍 Магазин', (ctx) => {
  ctx.session.state = 'shop';
  return ctx.reply(
    '🛍 Магазин:\n\n1. Апгрейд клика — 10 монет\n2. Автоклик — 50 монет',
    Markup.keyboard(['⬅ Назад']).resize()
  );
});

bot.hears('📈 Улучшения', (ctx) => {
  ctx.session.state = 'upgrades';
  return ctx.reply(
    '📈 Ваши улучшения:\n\n- Нет улучшений (пока)',
    Markup.keyboard(['⬅ Назад']).resize()
  );
});

bot.hears('👤 Профиль', (ctx) => {
  const coins = ctx.session.coins || 0;
  return ctx.reply(
    `👤 Профиль:\n\n💰 Монет: ${coins}\n🆔 ID: ${ctx.from.id}`,
    Markup.keyboard(['⬅ Назад']).resize()
  );
});

function showMainMenu(ctx) {
  return ctx.reply(
    '🏠 Главное меню:',
    Markup.keyboard(['💰 Заработать', '🛍 Магазин', '📈 Улучшения', '👤 Профиль']).resize()
  );
}

bot.launch();
console.log('🤖 Бот запущен!');