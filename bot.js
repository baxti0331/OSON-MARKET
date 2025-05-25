const { Telegraf, Markup, session } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());

bot.start((ctx) => {
  ctx.session.state = 'main';
  ctx.session.coins = ctx.session.coins || 0;
  return showMainMenu(ctx);
});

bot.on('callback_query', async (ctx) => {
  const action = ctx.callbackQuery.data;
  ctx.answerCbQuery();

  switch (action) {
    case 'earn':
      ctx.session.coins = (ctx.session.coins || 0) + 1;
      return ctx.editMessageText(`Вы заработали 1 монету! 💰 Всего: ${ctx.session.coins}`, mainMenu());

    case 'shop':
      ctx.session.state = 'shop';
      return ctx.editMessageText('🛍 Магазин:

1. Апгрейд клика — 10 монет
2. Автоклик — 50 монет', shopMenu());

    case 'upgrades':
      ctx.session.state = 'upgrades';
      return ctx.editMessageText('📈 Улучшения:

- Пока нет улучшений.', upgradesMenu());

    case 'profile':
      const coins = ctx.session.coins || 0;
      return ctx.editMessageText(`👤 Профиль:

💰 Монет: ${coins}
🆔 ID: ${ctx.from.id}`, profileMenu());

    case 'back':
      ctx.session.state = 'main';
      return showMainMenu(ctx);

    default:
      return ctx.reply('Неизвестная команда.');
  }
});

function showMainMenu(ctx) {
  return ctx.reply('🏠 Главное меню:', mainMenu());
}

function mainMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('💰 Заработать', 'earn')],
    [Markup.button.callback('🛍 Магазин', 'shop')],
    [Markup.button.callback('📈 Улучшения', 'upgrades')],
    [Markup.button.callback('👤 Профиль', 'profile')],
  ]);
}

function shopMenu() {
  return Markup.inlineKeyboard([[Markup.button.callback('⬅ Назад', 'back')]]);
}

function upgradesMenu() {
  return Markup.inlineKeyboard([[Markup.button.callback('⬅ Назад', 'back')]]);
}

function profileMenu() {
  return Markup.inlineKeyboard([[Markup.button.callback('⬅ Назад', 'back')]]);
}

bot.launch();
console.log('🤖 Бот с inline-кнопками запущен!');
