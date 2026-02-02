const products = [
  { id: 1, 
    name: "Hambúrguer Tradicional", 
    price: 10, 
    category: "lanches",
    type: "lanche",
    behavior: "config",
    desc: "Pão, ovo, presunto, queijo, salada, molho barbecue, bacon, maionese da casa, carne industrializada" },
  { id: 2, 
    name: "Hambúrguer Artesanal", 
    price: 16, 
    category: "lanches",
    type: "lanche",
    behavior: "config",
    desc: "Pão, ovo, presunto, queijo, salada, molho barbecue, bacon, maionese da casa, carne caseira" },
  { id: 3, 
    name: "Macarronada", 
    price: 15, 
    category: "lanches",
    type: "lanche",
    behavior: "quantity",
    desc: "Macarrão, molho à bolonhesa, salsicha, queijo, presunto, milho verde, batata palha" },
  { id: 4, 
    name: "Cachorro-quente", 
    price: 8, 
    category: "lanches",
    type: "lanche",
    behavior: "quantity",
    desc: "Pão, salsicha, salada, milho verde, carne moída, maionese da casa, batata palha" },

  { id: 5, 
    name: "Pastel de Feira", 
    price: 7, 
    category: "salgados",
    type: "salagado",
    behavior: "config",
    desc: "Sabores: Carne, Pizza, Queijo" },
  { id: 6, 
    name: "Coxinha", 
    price: 7, 
    category: "salgados",
    type: "salagado",
    behavior: "config",
    desc: "Sabor: Frango" },
  { id: 7, 
    name: "Risole", 
    price: 7, 
    category: "salgados",
    type: "salagado",
    behavior: "config",
    desc: "Sabor: Carne" },
  { id: 8, 
    name: "Salgado de Forno", 
    price: 7, 
    category: "salgados",
    type: "salagado",
    behavior: "config",
    desc: "Sabores: Esfirra de Carne, Catarina de Frango, Folhado de Queijo, Folhado de Frango, Folhado de Calabresa"
   },

  { id: 9, name: "Batata Frita na Marmita", price: 10, category: "acompanhamentos", type: "acompanhamento", behavior: "quantity" },

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

function addonsEqual(a = [], b = []) {
  if (a.length !== b.length) return false;

  return a.every(ad1 => {
    const ad2 = b.find(x => x.nome === ad1.nome);
    return ad2 && ad2.quantidade === ad1.quantidade;
  });
}

let cart = [];

function isInCart(product) {
  return cart.some(item =>
    item.id === product.id &&
    item.type === product.type
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const mensagemPedido = document.getElementById("mensagemPedido");
  if (mensagemPedido) {
    mensagemPedido.textContent = "";
    mensagemPedido.style.display = "none";
    mensagemPedido.className = "mensagem-pedido";
  }
});

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

        const isQuantityItem = p.behavior === "quantity";


        const itemInCart = isInCart(p)
  ? cart.find(i => i.id === p.id && i.type === p.type)
  : null;


        el.innerHTML = `
          <div class="item-main">
            <span class="item-title">${p.name} — R$ ${p.price.toFixed(2)}</span>
            <div class="item-actions">

${isQuantityItem
  ? (
      itemInCart
        ? `
          <div class="qty-control">
            <button onclick="decreaseQty(${p.id})">-</button>
            <span>${itemInCart.qty}</span>
            <button onclick="increaseQty(${p.id})">+</button>
          </div>
        `
        : `<button class="add-btn" data-id="${p.id}">Adicionar</button>`
    )
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

function resetarCardapio() {
  // Zera todas as quantidades no DOM (estado base)
  document.querySelectorAll(".qty").forEach(qty => {
    qty.textContent = "0";
  });

  // Remove qualquer controle ativo
  document.querySelectorAll(".qty-control").forEach(control => {
    control.remove();
  });

  // Re-renderiza o cardápio inteiro
  render();
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const item = getCartItem(
    id,
    product.sabor || null,
    product.adicionaisSelecionados || []
  );

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
  const hasFlavor = !!product.sabor;
const hasAddons =
  Array.isArray(product.adicionaisSelecionados) &&
  product.adicionaisSelecionados.length > 0;

const isConfigurable = hasFlavor || hasAddons;

if (item && !isConfigurable) {
  item.qty++;
} else {
  cart.push({
    id,
    type: product.type,
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

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
  render();
}


function renderCart() {
  const ul = document.getElementById("cart");
  const totalSpan = document.getElementById("total");

  ul.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
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

    let saborHTML = "";

    if (item.sabor) {
      saborHTML = `<div class="cart-sabor">Sabor: ${item.sabor}</div>`;
    }

    const li = document.createElement("li");
    li.innerHTML = `
  <span class="cart-name">
    ${product.name} x${item.qty} — R$ ${lineTotal.toFixed(2)}
    ${saborHTML}
    ${adicionaisHTML}
  </span>
  <button class="cart-remove" onclick="removeFromCart(${index})">✖</button>
`;

    ul.appendChild(li);
  });

  totalSpan.textContent = total.toFixed(2);
}

function getCartItem(id, sabor = null, adicionais = []) {
  return cart.find(i =>
    i.id === id &&
    i.sabor === sabor &&
    addonsEqual(i.adicionais || [], adicionais || [])
  );
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
  const mensagemPedido = document.getElementById("mensagemPedido");

// limpa qualquer mensagem anterior
mensagemPedido.textContent = "";
mensagemPedido.style.display = "none";

// remove classes antigas (erro / sucesso)
mensagemPedido.className = "mensagem-pedido";

  const name = document.getElementById("name").value;
  const numeroCliente = document.getElementById("whatsapp").value;

  const erroNomeSpan = document.getElementById("erroNome");
  const erroWhatsappSpan = document.getElementById("erroWhatsapp");

  // 1️⃣ validar nome
  const erroNome = validarNomeCliente(name);
  if (erroNome) {
    erroNomeSpan.textContent = erroNome;
    erroNomeSpan.style.display = "block";
    document.getElementById("name").focus();
    return;
  }
  erroNomeSpan.style.display = "none";

  // 2️⃣ validar número do cliente
  const erroNumero = validarNumeroCliente(numeroCliente);
  if (erroNumero) {
    erroWhatsappSpan.textContent = erroNumero;
    erroWhatsappSpan.style.display = "block";
    document.getElementById("whatsapp").focus();
    return;
  }
  erroWhatsappSpan.style.display = "none";

  // 3️⃣ validar carrinho
  if (cart.length === 0) {
    mensagemPedido.textContent =
  "Escolha pelo menos um item antes de enviar o pedido 😅";
mensagemPedido.classList.add("erro");
mensagemPedido.style.display = "block";
return;

  }

  // 4️⃣ montar pedido
  const pedido = {
    nome: name,
    numeroCliente: numeroCliente.replace(/\D/g, ""),
    itens: cart,
    total: document.getElementById("total").textContent
  };

  // 5️⃣ enviar pedido
  enviarPedido(pedido);

  // 6️⃣ limpar estado
  cart = [];
  renderCart();
  resetarCardapio();
  document.getElementById("name").value = "";
  document.getElementById("whatsapp").value = "";
};

  // 7️⃣ feedback
  mensagemPedido.textContent = "Pedido enviado com sucesso! 🎉";
mensagemPedido.classList.add("sucesso");
mensagemPedido.style.display = "block";

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

  adicionaisSelecionados = {}; // 🔹 ADICIONE ESTA LINHA

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

function pegarSaborSelecionado() {
  const checked =
document.querySelector("#modalOptions input:checked");
  return checked ? checked.value : null;
}

function openModal() {
  document.getElementById("modalOverlay").classList.remove("hidden");

  const confirmBtn = document.getElementById("confirmModal");

  if (!confirmBtn) return;

  if (modalContext.type === "sabor") {
    confirmBtn.disabled = true;
    confirmBtn.classList.add("disabled");
  } else {
    // adicional
    confirmBtn.disabled = false;
    confirmBtn.classList.remove("disabled");
  }
}

function closeModal() {
  document.getElementById("modalOverlay").classList.add("hidden");
}

function addProductWithOptions(product) {
  let item = cart.find(i =>
  i.id === product.id &&
  i.sabor === (product.saborSelecionado || null) &&
  JSON.stringify(i.adicionais || []) === JSON.stringify(product.adicionaisSelecionados || [])
);

  if (item) {
    item.qty++;
  } else {
    cart.push({
      id: product.id,
      nome: product.nome,
      preco: Number(product.preco),
      qty: 1,
      sabor: product.saborSelecionado || null,
      adicionais: product.adicionaisSelecionados || []
    });
  }

  renderCart();
}

function calcularTotalAdicionais(adicionais = []) {
  return adicionais.reduce((total, a) => {
    return total + (a.preco * a.quantidade);
  }, 0);
}

function validarNomeCliente(nome) {
  if (!nome) return "Informe seu nome";

  const nomeTrim = nome.trim();

  if (nomeTrim.length < 3) {
    return "O nome deve ter pelo menos 3 letras";
  }

  // Apenas letras e espaços
  if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nomeTrim)) {
    return "Use apenas letras no nome";
  }

  // Pelo menos uma vogal
  if (!/[aeiouáéíóúàèìòùãõâêîôû]/i.test(nomeTrim)) {
    return "Digite um nome válido";
  }

  // Bloquear repetições exageradas (aaa, kkk)
  if (/(.)\1\1/.test(nomeTrim.toLowerCase())) {
    return "Digite um nome válido";
  }

  return null; // nome válido
}

function validarNumeroCliente(numero) {
  if (!numero) return "Informe o número do cliente";

  // remove tudo que não for número
  const somenteNumeros = numero.replace(/\D/g, "");

  if (somenteNumeros.length < 10 || somenteNumeros.length > 11) {
    return "Número inválido (use DDD + número)";
  }

  return null; // número válido
}

function enviarPedido({ name, numeroCliente, itens, total }) {
  let mensagem = "*Pedido - Rei do Lanche*\n\n";

  mensagem += `*Cliente:* ${name}\n`;
  mensagem += `*WhatsApp:* ${numeroCliente}\n\n`;

  mensagem += "*Itens:*\n";

  itens.forEach(item => {
    const produtoOriginal = products.find(p => p.id === item.id);
    const qtd = item.quantity ?? 1;

    const nomeItem = produtoOriginal ? produtoOriginal.name : "Item";
    const preco = produtoOriginal ? produtoOriginal.price : 0;

    mensagem += `• ${nomeItem} x${qtd} — R$ ${(preco * qtd)
      .toFixed(2)
      .replace(".", ",")}\n`;
  });

  mensagem += `\n*Total:* ${total}\n\n`;
  mensagem += "Agradecemos o seu pedido!\n";
  mensagem += "Avisaremos por aqui quando estiver pronto.";

  // ✅ USA SEMPRE O NÚMERO DIGITADO
  const url = `https://wa.me/55${numeroCliente}?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");
}

document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("modalOptions").addEventListener("click", (e) => {
  document
  .getElementById("modalOptions")
  .addEventListener("change", (e) => {
    if (e.target.matches("input[type='radio']")) {
      const confirmBtn = document.getElementById("confirmModal");
      confirmBtn.disabled = false;
      confirmBtn.classList.remove("disabled");
    }
  });
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
    
    if (modalContext.type === "sabor") {
      const sabor = pegarSaborSelecionado();

      if (!sabor) {
        alert("Escolha um sabor para continuar");
        return;
      }

      modalContext.produto.saborSelecionado = sabor;
}

if (modalContext.type === "adicional") {
  modalContext.produto.adicionaisSelecionados = pegarAdicionaisSelecionados();
}

    addProductWithOptions(modalContext.produto);
    closeModal();
  };
});
render();