const cart = [];
const cartContainer = document.getElementById('cart-container');
const cartItemsUl = document.getElementById('cart-items');
const totalPriceSpan = document.getElementById('total-price');
const productsContainer = document.getElementById('products-container');

function addToCart(name, price) {
  cart.push({ name, price });
  updateCartUI();
}

function updateCartUI() {
  if (cart.length === 0) {
    cartContainer.style.display = 'none';
    return;
  }
  cartContainer.style.display = 'block';
  cartItemsUl.innerHTML = '';
  let total = 0;
  cart.forEach((item, i) => {
    total += item.price;
    const li = document.createElement('li');
    li.textContent = `${item.name} — ${item.price} UZS`;
    const removeBtn = document.createElement('button');
    removeBtn.textContent = '×';
    removeBtn.title = 'Удалить';
    removeBtn.onclick = () => {
      cart.splice(i, 1);
      updateCartUI();
    };
    li.appendChild(removeBtn);
    cartItemsUl.appendChild(li);
  });
  totalPriceSpan.textContent = total.toLocaleString();
}

function checkout() {
  if (cart.length === 0) {
    alert('Корзина пуста!');
    return;
  }
  alert(`Спасибо за заказ на сумму ${totalPriceSpan.textContent} UZS!`);
  cart.length = 0;
  updateCartUI();
}

/* Добавление товара продавцом */

const addProductForm = document.getElementById('addProductForm');

addProductForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('productName').value.trim();
  const price = parseInt(document.getElementById('productPrice').value.trim());
  const fileInput = document.getElementById('productImage');
  const file = fileInput.files[0];

  if (!name || isNaN(price) || price <= 0 || !file) {
    alert('Пожалуйста, заполните все поля корректно.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    const imageUrl = event.target.result;

    // Создаём новый элемент товара
    const productDiv = document.createElement('div');
    productDiv.className = 'product';

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = name;

    const p = document.createElement('p');
    p.textContent = `${name} — ${price.toLocaleString()} UZS`;

    const btn = document.createElement('button');
    btn.textContent = 'Добавить';
    btn.onclick = () => addToCart(name, price);

    productDiv.appendChild(img);
    productDiv.appendChild(p);
    productDiv.appendChild(btn);

    // Добавляем товар в последнюю категорию или создаём новую
    let category = productsContainer.querySelector('.category:last-child');
    if (!category) {
      category = document.createElement('div');
      category.className = 'category';
      const h2 = document.createElement('h2');
      h2.textContent = 'Новые товары';
      category.appendChild(h2);
      productsContainer.appendChild(category);
    }
    category.appendChild(productDiv);

    // Сбрасываем форму
    addProductForm.reset();
  };

  reader.readAsDataURL(file);
});