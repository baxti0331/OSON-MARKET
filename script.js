const API_URL = "/api/products";
const cart = {};

function saveCart() {
  localStorage.setItem("oson_cart", JSON.stringify(cart));
}

function loadCart() {
  const saved = localStorage.getItem("oson_cart");
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

function checkout() {
  if (Object.keys(cart).length === 0) {
    alert("Корзина пуста.");
    return;
  }
  if (Telegram.WebApp) {
    Telegram.WebApp.sendData(JSON.stringify(cart));
    Telegram.WebApp.close();
  } else {
    alert("Telegram API недоступен. Корзина: " + JSON.stringify(cart));
  }
}

document.addEventListener("DOMContentLoaded", async () => {
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
