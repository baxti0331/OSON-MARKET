let cart = [];

function addToCart(name, price) {
  cart.push({ name, price });
  alert(`Товар "${name}" добавлен в корзину.`);
}

function checkout() {
  if (cart.length === 0) {
    alert("Корзина пуста!");
    return;
  }

  let summary = cart.map(item => `${item.name}: ${item.price} UZS`).join('\n');
  let total = cart.reduce((sum, item) => sum + item.price, 0);

  alert(`Ваш заказ:\n\n${summary}\n\nОбщая сумма: ${total} UZS`);

  // Пример для Telegram Web App — отправить заказ обратно в бот:
  if (window.Telegram.WebApp) {
    Telegram.WebApp.sendData(JSON.stringify({ order: cart, total }));
    Telegram.WebApp.close();
  }
}