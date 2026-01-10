const products = [
  { id: 1, 
    name: "Hambúrguer Tradicional", 
    price: 10, 
    category: "lanches",
    desc: "Pão, ovo, presunto, queijo, salada, molho barbecue, bacon, maionese da casa, carne industrializada" },
  { id: 2, 
    name: "Hambúrguer Artesanal", 
    price: 16, 
    category: "lanches",
    desc: "Pão, ovo, presunto, queijo, salada, molho barbecue, bacon, maionese da casa, carne caseira" },
  { id: 3, 
    name: "Macarronada", 
    price: 15, 
    category: "lanches",
    desc: "Macarrão, molho à bolonhesa, salsicha, queijo, presunto, milho verde, batata palha" },
  { id: 4, 
    name: "Cachorro-quente", 
    price: 8, 
    category: "lanches",
    desc: "Pão, salsicha, salada, milho verde, carne moída, maionese da casa, batata palha" },

  { id: 5, 
    name: "Pastel de Feira", 
    price: 7, 
    category: "salgados",
    desc: "Sabores: Carne, Pizza, Queijo" },
  { id: 6, 
    name: "Coxinha", 
    price: 7, 
    category: "salgados",
    desc: "Sabor: Frango" },
  { id: 7, 
    name: "Risole", 
    price: 7, 
    category: "salgados",
    desc: "Sabor: Carne" },
  { id: 8, name: "Salgado de Forno", price: 7, category: "salgados" },

  { id: 9, name: "Batata Frita na Marmita", price: 10, category: "acompanhamentos" },

  { id: 10, name: "Carne Industrializada", price: 3, category: "adicionais" },
  { id: 11, name: "Carne Caseira", price: 8, category: "adicionais" },
  { id: 12, name: "Ovo", price: 2, category: "adicionais" }
];

let cart = [];

function render() {
  const categories = ["lanches", "salgados", "acompanhamentos", "adicionais"];

  categories.forEach(cat => {
    const div = document.getElementById(cat);
    if (!div) return; // evita quebrar se não existir

    div.innerHTML = "";

    products
      .filter(p => p.category === cat)
      .forEach(p => {
        const el = document.createElement("div");
        el.className = "item";

        el.innerHTML = `
          <div class="item-main">
            <span class="item-title">${p.name} — R$ ${p.price.toFixed(2)}</span>
            <div class="item-actions">
              ${
  getCartItem(p.id)
    ? `
      <div class="qty-control">
        <button onclick="decreaseQty(${p.id})">−</button>
        <span>${getCartItem(p.id).qty}</span>
        <button onclick="increaseQty(${p.id})">+</button>
      </div>
    `
    : `<button class="add-btn" onclick="addToCart(${p.id})">Adicionar</button>`
}
            </div>
          </div>
          ${p.desc ? `<div class="item-desc" id="desc-${p.id}">${p.desc}</div>` : ""}
        `;

        div.appendChild(el);
      });
  });
  const adicionaisSection = document.getElementById("adicionais-section");

if (hasBurgerInCart()) {
  adicionaisSection.style.display = "block";
} else {
  adicionaisSection.style.display = "none";
}
}

function addToCart(id) {
  let item = getCartItem(id);

  if (item) item.qty++;
  else cart.push({ id: id, qty: 1 });

  render();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  render();
  renderCart();
}

function renderCart() {
  const ul = document.getElementById("cart");
  const totalSpan = document.getElementById("total");

  ul.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;

    const lineTotal = product.price * item.qty;
    total += lineTotal;

    const li = document.createElement("li");
    li.innerHTML = `
      <span class="cart-name">
        ${product.name} x${item.qty} — R$ ${lineTotal.toFixed(2)}
      </span>
      <button class="cart-remove" onclick="removeFromCart(${item.id})">🗑️</button>
    `;

    ul.appendChild(li);
  });

  totalSpan.textContent = total.toFixed(2);
}

function getCartItem(id) {
  return cart.find(i => i.id === id);
}

function increaseQty(id) {
  let item = getCartItem(id);
  if (item) item.qty++;
  
  render();
  renderCart();
}

function decreaseQty(id) {
  let item = getCartItem(id);
  if (!item) return;

  item.qty--;

  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  render();
  renderCart();
}

function canUseAddons() {
  return cart.some(item => {
    const product = products.find(p => p.id === item.id);
    return product && product.category === "lanches";
  });
}

function hasBurgerInCart() {
  return cart.some(item => {
    const product = products.find(p => p.id === item.id);
    return product && product.category === "lanches";
  });
}

document.getElementById("sendOrder").onclick = () => {
  const name = document.getElementById("name").value;
  if (!name || cart.length === 0) {
    alert("Preencha o nome e escolha algo 😅");
    return;
  }

  alert("Pedido enviado! 😄");
  cart = [];
  renderCart();
  document.getElementById("name").value = "";
};

render();