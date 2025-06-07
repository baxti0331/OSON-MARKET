const API_URL = "/api/products";
const tg = window.Telegram.WebApp;
const user = tg.initDataUnsafe?.user;

if (!user) {
  alert("Ошибка авторизации! Пожалуйста, откройте приложение через Telegram.");
  tg.close();
}

const cart = {};

function saveCart() {
  if (!user) return;
  localStorage.setItem(`oson_cart_${user.id}`, JSON.stringify(cart));
}

function loadCart() {
  if (!user) return;
  const saved = localStorage.getItem(`oson_cart_${user.id}`);
  if (saved) {
    Object.assign(cart, JSON.parse(saved));
  }
}

function renderProducts(data) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";
  data.forEach(category => {
    const categoryDiv = document.createElement("div");
    categoryDiv.className = "category";
    const categoryTitle = document.createElement("h2");
    categoryTitle.textContent = category.category;
    categoryDiv.appendChild(categoryTitle);

    category.items.forEach(product => {
      const productDiv = document.createElement("div");
      productDiv.className = "product";

      const productName = document.createElement("p");
      productName.textContent = product.name;

      const buyButton = document.createElement("button");
      buyButton.textContent = "Купить";
      buyButton.addEventListener("click", () => addToCart(product));

      productDiv.appendChild(productName);
      productDiv.appendChild(buyButton);
      categoryDiv.appendChild(productDiv);
    });
    productList.appendChild(categoryDiv);
  });
}

function addToCart(product) {
  if (cart[product.id]) {
    cart[product.id].quantity += 1;
  } else {
    cart[product.id] = { ...product, quantity: 1 };
  }
  saveCart();
  alert(`Добавлено: ${product.name}`);
}

function showCart() {
  const modal = document.getElementById("cart-modal");
  const itemsDiv = document.getElementById("cart-items");
  itemsDiv.innerHTML = "";
  Object.values(cart).forEach(item => {
    const div = document.createElement("div");
    div.textContent = `${item.name} x ${item.quantity}`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Удалить";
    removeBtn.onclick = () => {
      removeFromCart(item.id);
      showCart();
    };

    div.appendChild(removeBtn);
    itemsDiv.appendChild(div);
  });
  modal.style.display = "block";
}

function removeFromCart(id) {
  if (cart[id]) {
    cart[id].quantity--;
    if (cart[id].quantity <= 0) delete cart[id];
    saveCart();
  }
}

async function verifyUser() {
  const response = await fetch('/api/checkAuth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initData: tg.initData })
  });
  const data = await response.json();
  if (!data.success) {
    alert("Ошибка проверки данных Telegram. Доступ запрещён.");
    tg.close();
    return false;
  }
  return true;
}

function checkout() {
  if (Object.keys(cart).length === 0) {
    alert("Корзина пуста.");
    return;
  }
  if (tg) {
    const orderData = {
      userId: user.id,
      cart
    };
    tg.sendData(JSON.stringify(orderData));
    tg.close();
  } else {
    alert("Telegram API недоступен. Корзина: " + JSON.stringify(cart));
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const verified = await verifyUser();
  if (!verified) return;

  loadCart();
  const res = await fetch(API_URL);
  const data = await res.json();
  renderProducts(data);

  document.getElementById("checkout-btn").addEventListener("click", checkout);
  document.getElementById("view-cart-btn").addEventListener("click", showCart);
  document.querySelector(".close-btn").onclick = () => {
    document.getElementById("cart-modal").style.display = "none";
  };
});