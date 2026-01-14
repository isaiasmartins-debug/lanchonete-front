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
  { id: 8, 
    name: "Salgado de Forno", 
    price: 7, 
    category: "salgados",
    desc: "Sabores: Esfirra de Carne, Catarina de Frango, Folhado de Queijo, Folhado de Frango, Folhado de Calabresa"
   },

  { id: 9, name: "Batata Frita na Marmita", price: 10, category: "acompanhamentos" },

  { id: 10, name: "Carne Industrializada", price: 3, category: "adicionais" },
  { id: 11, name: "Carne Caseira", price: 8, category: "adicionais" },
  { id: 12, name: "Ovo", price: 2, category: "adicionais" }
];

const adicionaisDisponiveis = [
  { nome: "Carne Industrializada", preco: 3 },
  { nome: "Carne Caseira", preco: 8},
  {nome: "Ovo",preco: 2}
];

const saboresPorProduto = {
5: ["Carne", "Pizza", "Queijo"], // Pastel de Feira (id 5)
6: ["Frango"], //Coxinha (id 6)
7: ["Carne"], // Risole (id 7)
8: ["Esfirra de Carne", "Catarina de Frango", "Folhado de Queijo", "Folhado de Frango", "Folhado de Calabresa"],
// Salgado de Forno (id 8)
};

let cart = [];

function render() {
  const categories = ["lanches", "salgados", "acompanhamentos"];

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
    : `<button class="add-btn" data-id="${p.id}">Adicionar</button>`
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
document.querySelectorAll(".add-btn").forEach(btn => {
  btn.onclick = () => {
    const id = Number(btn.dataset.id);
    const product = products.find(p => p.id === id);
    if (!product) return;

    const isHamburger =
      product.name.toLowerCase().includes("hambúrguer") ||
      product.name.toLowerCase().includes("hamburger");

    if (isHamburger) {
      openAddonModal(product);
      return;
    }

    if (product.category === "salgados" && saboresPorProduto[product.id]) {
      openFlavorModal(product);
      return;
    }

    addToCart(id);
  };
});
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const item = getCartItem(id);

  const isHamburger =
    product.name.toLowerCase().includes("hambúrguer") ||
    product.name.toLowerCase().includes("hamburger");

  // 🍔 Se for hambúrguer e ainda não estiver no carrinho → abre adicionais
  if (isHamburger && !item) {
    openAddonModal(product);
    return;
  }

  // 🥟 Se for salgado com sabores → abre sabores
  if (product.category === "salgados" && saboresPorProduto[product.id]) {
    openFlavorModal(product);
    return;
  }

  // ➕ Caso normal: adiciona direto
  const isConfigurable = product.sabor || (product.adicionaisSelecionados && product.adicionaisSelecionados.length > 0);

if (item && !isConfigurable) {
  item.qty++;
} else {
  cart.push({
    id,
    qty: 1,
    sabor: product.sabor || null,
    adicionais: product.adicionaisSelecionados ? [...product.adicionaisSelecionados] : []
  });
}

product.sabor = null;
product.adicionaisSelecionados = null;

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

    const adicionaisTotal = calcularTotalAdicionais(item.adicionais);
const lineTotal = (product.price + adicionaisTotal) * item.qty;
    total += lineTotal;

    let adicionaisHTML = "";

if (item.adicionais && item.adicionais.length > 0) {
  adicionaisHTML = item.adicionais.map(a => `
    <div class="cart-adicional">
      + ${a.nome} (${a.quantidade}x) — R$ ${(a.preco * a.quantidade).toFixed(2)}
    </div>
  `).join("");
}

    const li = document.createElement("li");
    li.innerHTML = `
  <span class="cart-name">
    ${product.name} x${item.qty} — R$ ${lineTotal.toFixed(2)}
    ${adicionaisHTML}
  </span>
  <button class="cart-remove" onclick="removeFromCart(${item.id})">✖</button>
`;

    ul.appendChild(li);
  });

  totalSpan.textContent = total.toFixed(2);
}

function getCartItem(id) {
  return cart.find(i => i.id === id && !i.sabor && (!i.adicionais || i.adicionais.length === 0));
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

let modalContext = null;

function openFlavorModal(produto) {
  modalContext = { type: "sabor", produto };

  document.getElementById("modalTitle").textContent = "Escolha o sabor";
  renderOptions(saboresPorProduto[produto.id]
  || []);
  openModal();
}

function openAddonModal(produto) {
  modalContext = { type: "adicional", produto };

  document.getElementById("modalTitle").textContent = "Escolha os adicionais";
  renderOptions(adicionaisDisponiveis);
  openModal();
}

function renderOptions(lista = []) {
  console.log("renderOptions chamada com:",
lista);

  const container = document.getElementById("modalOptions");
  container.innerHTML = "";

  lista.forEach(item => {
    const div = document.createElement("div");

    if (typeof item === "string") {
      div.innerHTML = `
        <label>
          <input type="radio" name="modalOption" value="${item}">
          ${item}
        </label>
      `;
    } else {
  div.innerHTML = `
    <div class="adicional-item" data-nome="${item.nome}" data-preco="${item.preco}">
      <span>${item.nome} (+R$ ${item.preco})</span>
      <div class="contador">
        <button class="menos">−</button>
        <span class="quantidade">0</span>
        <button class="mais">+</button>
      </div>
    </div>
  `;
}

    container.appendChild(div);
  });
}

function pegarAdicionaisSelecionados() {
  const adicionais = [];

  document.querySelectorAll(".adicional-item").forEach(item => {
    const qtd = Number(item.querySelector(".quantidade").textContent);
    if (qtd > 0) {
      adicionais.push({
        nome: item.dataset.nome,
        preco: Number(item.dataset.preco),
        quantidade: qtd
      });
    }
  });

  return adicionais;
}

function openModal() {
  document.getElementById("modalOverlay").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modalOverlay").classList.add("hidden");
}

function addProductWithOptions(product) {
  let item = getCartItem(product.id);

  if (item) {
    item.qty++;
  } else {
    cart.push({
      id: product.id,
      qty: 1,
      sabor: product.sabor || null,
      adicionais: product.adicionaisSelecionados || []
    });
  }

  render();
  renderCart();
}

function calcularTotalAdicionais(adicionais = []) {
  return adicionais.reduce((total, a) => {
    return total + (a.preco * a.quantidade);
  }, 0);
}

document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("modalOptions").addEventListener("click", (e) => {
  if (e.target.classList.contains("mais")) {
    const item = e.target.closest(".adicional-item");
    const qtdSpan = item.querySelector(".quantidade");
    qtdSpan.textContent = Number(qtdSpan.textContent) + 1;
  }

  if (e.target.classList.contains("menos")) {
    const item = e.target.closest(".adicional-item");
    const qtdSpan = item.querySelector(".quantidade");
    if (Number(qtdSpan.textContent) > 0) {
      qtdSpan.textContent = Number(qtdSpan.textContent) - 1;
    }
  }
});
  const cancelBtn = document.getElementById("cancelModal");
  const confirmBtn = document.getElementById("confirmModal");

  if (cancelBtn) cancelBtn.onclick = closeModal;

  if (confirmBtn) confirmBtn.onclick = () => {
    const checked = [...document.querySelectorAll("#modalOptions input:checked")];

if (modalContext.type === "sabor") {
  modalContext.produto.sabor = checked[0]?.value || null;
}

if (modalContext.type === "adicional") {
  modalContext.produto.adicionaisSelecionados = pegarAdicionaisSelecionados();
}

    addProductWithOptions(modalContext.produto);
    closeModal();
  };
});
render();