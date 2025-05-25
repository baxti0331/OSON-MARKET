const productsData = [
  {id:1,name:"Спортивная футболка",price:99000,img:"https://via.placeholder.com/300?text=Футболка"},
  {id:2,name:"Шорты тренировочные",price:79000,img:"https://via.placeholder.com/300?text=Шорты"},
  {id:3,name:"Рюкзак городской",price:159000,img:"https://via.placeholder.com/300?text=Рюкзак"},
  {id:4,name:"Бутылка для воды",price:49000,img:"https://via.placeholder.com/300?text=Бутылка"},
  {id:5,name:"Кроссовки беговые",price:230000,img:"https://via.placeholder.com/300?text=Кроссовки"},
  // остальные товары по желанию
];

let cart = [];

const productsContainer = document.getElementById("products");
const cartList = document.getElementById("cart-list");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkoutBtn");

function renderProducts(){
  productsContainer.innerHTML = "";
  productsData.forEach(prod => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${prod.img}" alt="${prod.name}" />
      <h3>${prod.name}</h3>
      <p>${prod.price.toLocaleString()} UZS</p>
      <button data-id="${prod.id}">Добавить в корзину</button>
    `;
    productsContainer.appendChild(card);
  });
  productsContainer.querySelectorAll("button").forEach(btn=>{
    btn.onclick = () => {
      const id = +btn.dataset.id;
      addToCart(id);
    };
  });
}

function addToCart(id){
  let found = cart.find(item => item.id === id);
  if(found){
    found.qty++;
  } else {
    cart.push({id: id, qty:1});
  }
  renderCart();
}

function renderCart(){
  cartList.innerHTML = "";
  if(cart.length === 0){
    cartList.innerHTML = "<li>Корзина пуста</li>";
    cartTotal.textContent = "Итого: 0 UZS";
    checkoutBtn.disabled = true;
    return;
  }
  checkoutBtn.disabled = false;
  let sum = 0;
  cart.forEach(item => {
    const prod = productsData.find(p => p.id === item.id);
    sum += prod.price * item.qty;
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <span>${prod.name}</span>
      <input type="number" min="1" value="${item.qty}" data-id="${item.id}" />
      <span>${(prod.price * item.qty).toLocaleString()} UZS</span>
      <button data-id="${item.id}">&times;</button>
    `;
    cartList.appendChild(li);
  });
  cartTotal.textContent = `Итого: ${sum.toLocaleString()} UZS`;
  
  cartList.querySelectorAll("input").forEach(input => {
    input.onchange = () => {
      let id = +input.dataset.id;
      let val = parseInt(input.value);
      if (val < 1) val = 1;
      updateQty(id, val);
    };
  });
  cartList.querySelectorAll("button").forEach(btn => {
    btn.onclick = () => {
      let id = +btn.dataset.id;
      removeFromCart(id);
    };
  });
}

function updateQty(id, qty){
  let item = cart.find(i => i.id === id);
  if(item){
    item.qty = qty;
  }
  renderCart();
}

function removeFromCart(id){
  cart = cart.filter(i => i.id !== id);
  renderCart();
}

checkoutBtn.onclick = () => {
  alert("Спасибо за заказ! (функционал оформления заказа пока не реализован)");
  cart = [];
  renderCart();
};

renderProducts();
renderCart();