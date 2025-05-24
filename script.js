const cart = {};

let products = [
  {
    category: 'Одежда для спорта',
    items: [
      { name: 'Спортивная футболка', price: 99000, photo: 'https://via.placeholder.com/150' },
      { name: 'Шорты тренировочные', price: 79000, photo: 'https://via.placeholder.com/150' },
    ],
  },
  {
    category: 'Аксессуары',
    items: [
      { name: 'Рюкзак городской', price: 159000, photo: 'https://via.placeholder.com/150' },
      { name: 'Бутылка для воды', price: 49000, photo: 'https://via.placeholder.com/150' },
    ],
  },
];

// Рендерим товары в #products-container
function renderProducts() {
  const container = document.getElementById('products-container');
  container.innerHTML = '';

  products.forEach(({ category, items }) => {
    const catDiv = document.createElement('div');
    catDiv.className = 'category';

    const catTitle = document.createElement('h2');
    catTitle.textContent = category;
    catDiv.appendChild(catTitle);

    items.forEach(({ name, price, photo }) => {
      const prodDiv = document.createElement('div');
      prodDiv.className = 'product';

      const img = document.createElement('img');
      img.src = photo;
      img.alt = name;

      const p = document.createElement('p');
      p.textContent = `${name} — ${price.toLocaleString()} UZS`;

      const btn = document.createElement('button');
      btn.textContent = 'Добавить';
      btn.onclick = () => addToCart(name, price);

      prodDiv.appendChild(img);
      prodDiv.appendChild(p);
      prodDiv.appendChild(btn);

      catDiv.appendChild(prodDiv);
    });

    container.appendChild(catDiv);
  });
}

function addToCart(name, price) {
  if (cart[name]) {
    cart[name].quantity += 1;
  } else {
    cart[name] = { price: price, quantity: 1 };
  }
  updateCartDisplay();
}

function getTotal() {
  let total = 0;
  for (const key in cart) {
    total += cart[key].price * cart[key].quantity;
  }
  return total;
}

function updateCartDisplay() {
  const container = document.getElementById('cart-container');
  if (Object.keys(cart).length === 0) {
    container.innerHTML = 'Корзина пуста';
    return;
  }

  let html = '<ul>';
  for (const key in cart) {
    html += `<li>
      <b>${key}</b> — ${cart[key].quantity} шт. — ${(cart[key].price * cart[key].quantity).toLocaleString()} UZS
      <button onclick="changeQuantity('${key}', 1)" style="margin-left:10px;">➕</button>
      <button onclick="changeQuantity('${key}', -1)" style="margin-left:5px;">➖</button>
      <button onclick="removeItem('${key}')" style="margin-left:5px; color:red;">✖</button>
    </li>`;
  }
  html += '</ul>';
  html += `<b>Итого: ${getTotal().toLocaleString()} UZS</b>`;
  container.innerHTML = html;
}

function changeQuantity(name, delta) {
  if (!cart[name]) return;
  cart[name].quantity += delta;
  if (cart[name].quantity <= 0) {
    delete cart[name];
  }
  updateCartDisplay();
}

function removeItem(name) {
  delete cart[name];
  updateCartDisplay();
}

function checkout() {
  if (Object.keys(cart).length === 0) {
    alert('Корзина пуста!');
    return;
  }
  let message = 'Ваш заказ:\n';
  for (const key in cart) {
    message += `${key} — ${cart[key].quantity} шт. — ${(cart[key].price * cart[key].quantity).toLocaleString()} UZS\n`;
  }
  message += `\nИтого: ${getTotal().toLocaleString()} UZS\n\nСпасибо за покупку!`;

  alert(message);

  // Очистка корзины
  for (const key in cart) {
    delete cart[key];
  }
  updateCartDisplay();
}

// Добавление товара продавцом с загрузкой фото с компьютера
function addProduct(event) {
  event.preventDefault();
  const name = document.getElementById('product-name').value.trim();
  const price = Number(document.getElementById('product-price').value);
  const photoInput = document.getElementById('product-photo');
  const file = photoInput.files[0];

  if (!name || !price || !file) {
    alert('Пожалуйста, заполните все поля корректно');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const photoDataUrl = e.target.result;

    // Добавим товар в категорию "Новое" или создадим её
    let category = products.find(cat => cat.category === 'Новое');
    if (!category) {
      category = { category: 'Новое', items: [] };
      products.push(category);
    }

    // Проверка на дубликаты по названию
    const exists = category.items.find(item => item.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      alert('Товар с таким названием уже есть в категории "Новое"');
      return;
    }

    category.items.push({ name, price, photo: photoDataUrl });
    renderProducts();

    document.getElementById('add-product-form').reset();
    alert('Товар добавлен!');
  };

  reader.readAsDataURL(file);
}

// Инициализация
renderProducts();
updateCartDisplay();