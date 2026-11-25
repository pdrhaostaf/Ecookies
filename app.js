// Ecookies — catálogo, navegação, carrinho e pedido por WhatsApp.
// IMPORTANTE: troque pelo WhatsApp oficial da loja (55 + DDD + número, somente dígitos).
const STORE_WHATSAPP = "554892110415"; // WhatsApp Ecookies
const PRODUCTS = [
  { id:"choco", name:"Cookie tradicional", category:"pronta-entrega", price:12, description:"Massa amanteigada com gotas generosas de chocolate meio amargo. Crocante por fora e macio por dentro.", image:"https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1000&q=85", tag:"Mais pedido" },
  { id:"nutella", name:"Cookie de avelã", category:"pronta-entrega", price:15, description:"Cookie artesanal com recheio cremoso de chocolate e avelã.", image:"https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1000&q=85" },
  { id:"red", name:"Red velvet", category:"pronta-entrega", price:14, description:"Massa red velvet com chocolate branco em uma combinação delicada e especial.", image:"https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1000&q=85" },
  { id:"brownie", name:"Cookie brownie", category:"pronta-entrega", price:14, description:"Intenso sabor de chocolate, textura úmida e pedacinhos de chocolate.", image:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1000&q=85" },
  { id:"mini-classic", name:"Mini cookie clássico", category:"mini-cookies", price:3.5, description:"Versão pequenininha do nosso clássico, ideal para compartilhar e montar kits.", image:"https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1000&q=85" },
  { id:"mini-choco", name:"Mini cookie duplo chocolate", category:"mini-cookies", price:4, description:"Pequeno no tamanho, gigante no sabor: massa de chocolate com gotas.", image:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1000&q=85" },
  { id:"lembranca", name:"Caixinha lembrança", category:"lembrancas", price:35, description:"Caixinha com cookies artesanais para presentear em datas especiais. Consulte personalização.", image:"https://images.unsplash.com/photo-1548365328-9f547fb0953d?auto=format&fit=crop&w=1000&q=85" },
  { id:"kit-festa", name:"Kit comemoração", category:"lembrancas", price:59, description:"Seleção de mini cookies para festas, eventos e comemorações. Consulte opções.", image:"https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1000&q=85" }
];
const CATEGORIES = {
  "pronta-entrega": { title:"Pronta entrega", subtitle:"Cookies fresquinhos para adoçar o seu dia.", icon:"◉" },
  "mini-cookies": { title:"Mini cookies", subtitle:"Pequenos no tamanho, enormes no sabor.", icon:"◉" },
  "lembrancas": { title:"Cookies lembrança", subtitle:"Um carinho em forma de cookie para presentear.", icon:"♡" }
};
const money = n => n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
function whatsappPersonalizedLink() {
  const phone=(localStorage.getItem("ecookies-whatsapp")||STORE_WHATSAPP).replace(/\\D/g,"");
  const message="Olá! Vim pelo site da Ecookies e gostaria de saber sobre cookies e caixas personalizados. Podemos conversar?";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
function personalizedPromo() {
  return `<section class="personalized-promo">
    <div class="personalized-icon">✦</div>
    <div class="personalized-copy">
      <p class="eyebrow">TEM UMA IDEIA ESPECIAL?</p>
      <h2>Quer algo personalizado?</h2>
      <p>Fazemos opções personalizadas para festas, eventos, presentes e ocasiões especiais. Chame a gente no WhatsApp para conversar sobre sua ideia!</p>
    </div>
    <a class="btn btn-light" href="${whatsappPersonalizedLink()}" target="_blank" rel="noopener">Conversar pelo WhatsApp ↗</a>
  </section>`;
}
const getCart = () => JSON.parse(localStorage.getItem("ecookies-cart") || "{}");
const saveCart = cart => { localStorage.setItem("ecookies-cart",JSON.stringify(cart)); updateCartCount(); };
let detailQty = 1;
let toastTimer;
let boxSize = 6;
let boxSelections = {};

function parseBoxKey(key) {
  if (!key.startsWith("box|")) return null;
  const [, sizePart, selectionPart=""] = key.split("|");
  const size = Number(sizePart);
  const selections = {};
  selectionPart.split(",").filter(Boolean).forEach(part => {
    const [id, qty] = part.split(":");
    selections[id] = Number(qty);
  });
  return { size, selections };
}
function boxKey(size, selections) {
  const composition = Object.entries(selections).filter(([,q])=>q>0).sort(([a],[b])=>a.localeCompare(b)).map(([id,q])=>`${id}:${q}`).join(",");
  return `box|${size}|${composition}`;
}
function isBoxKey(key) { return key.startsWith("box|"); }
function boxTotal(selections) {
  return Object.entries(selections).reduce((sum,[id,q])=>sum+(PRODUCTS.find(p=>p.id===id)?.price||0)*q,0);
}
function boxDescription(selections) {
  return Object.entries(selections).filter(([,q])=>q>0).map(([id,q])=>`${q}x ${PRODUCTS.find(p=>p.id===id)?.name||id}`).join(", ");
}

function updateCartCount() {
  const total = Object.values(getCart()).reduce((a,b)=>a+b,0);
  document.getElementById("cartCount").textContent = total;
}
function showToast(message) {
  const el=document.getElementById("toast"); el.textContent=message; el.classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("show"),2200);
}
function addToCart(id, qty=1) {
  const cart=getCart(); cart[id]=(cart[id]||0)+qty; saveCart(cart); showToast("Adicionado à sacola!");
}
function changeQty(id, delta) {
  const cart=getCart(); if(!cart[id]) return;
  cart[id]+=delta; if(cart[id]<=0) delete cart[id]; saveCart(cart); render();
}
function productCard(p) {
  return `<article class="product-card">
    <a href="#/produto/${p.id}" aria-label="Ver ${p.name}"><img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy"></a>
    <div class="product-info"><h3><a href="#/produto/${p.id}">${p.name}</a></h3><p>${p.description}</p>
      <div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-btn" data-add="${p.id}">Adicionar +</button></div>
    </div></article>`;
}
function homeView() {
  return `<section class="hero">
    <div class="hero-logo">Ecookies<span class="brand-dot">.</span></div>
    <div class="hero-kicker">COOKIES ARTESANAIS</div>
    <h1>Um pedacinho de felicidade em cada mordida.</h1>
    <p>Feitos com carinho · Ingredientes selecionados · Sabor de verdade</p>
  </section>
  <div class="notice"><strong>Bem-vindo à Ecookies!</strong><p>Escolha seus favoritos, adicione à sacola e envie seu pedido diretamente pelo WhatsApp.</p></div>
  ${personalizedPromo()}
  <div class="section-head"><div><p class="eyebrow">ESCOLHA O SEU MOMENTO</p><h2>Nossas categorias</h2></div></div>
  <div class="category-grid">
    <a class="category-card" href="#/categoria/pronta-entrega"><span class="category-icon">◉</span><h3>Pronta entrega</h3><p>Cookies artesanais para matar a vontade de doce.</p><span class="category-arrow">›</span></a>
    <a class="category-card" href="#/categoria/mini-cookies"><span class="category-icon">◉</span><h3>Mini cookies</h3><p>Para dividir, montar kits e comemorar.</p><span class="category-arrow">›</span></a>
    <a class="category-card" href="#/categoria/lembrancas"><span class="category-icon">♡</span><h3>Cookies lembrança</h3><p>Presentes deliciosos para momentos especiais.</p><span class="category-arrow">›</span></a>
  </div>
  <div class="build-promo"><div><p class="eyebrow">DO SEU JEITO</p><h2>Monte sua própria caixa</h2><p>Escolha seus sabores favoritos e crie uma caixa com 6 ou 12 cookies.</p></div><a class="btn btn-primary" href="#/montar-caixa">Montar minha caixa →</a></div>
  <div class="section-head"><div><p class="eyebrow">FEITOS PARA VOCÊ</p><h2>Favoritos da casa</h2></div><a class="back-link" href="#/categoria/pronta-entrega">Ver todos →</a></div>
  <div class="product-grid">${PRODUCTS.slice(0,3).map(productCard).join("")}</div>`;
}
function categoryView(key) {
  const c=CATEGORIES[key]; const products=PRODUCTS.filter(p=>p.category===key);
  if(!c) return notFound();
  return `<a class="back-link" href="#/inicio">← Voltar para o início</a><div class="page-intro"><p class="eyebrow">ECOKIES · CATEGORIAS</p><h1 class="page-title">${c.title}</h1><p>${c.subtitle}</p></div>
    <div class="product-grid">${products.map(productCard).join("")}</div>
    ${key==="lembrancas"?personalizedPromo():""}`;
}
function boxBuilderView() {
  const cookies=PRODUCTS.filter(p=>p.category==="pronta-entrega");
  const chosen=Object.values(boxSelections).reduce((a,b)=>a+b,0);
  const remaining=boxSize-chosen;
  const total=boxTotal(boxSelections);
  return `<a class="back-link" href="#/inicio">← Voltar para o início</a>
    <div class="page-intro"><p class="eyebrow">CRIE SUA COMBINAÇÃO</p><h1 class="page-title">Monte sua caixa</h1><p>Escolha seus cookies favoritos e monte uma caixa do seu jeito.</p></div>
    <div class="box-size-grid">
      <button class="box-size-option ${boxSize===6?"selected":""}" data-box-size="6"><span class="box-size-number">6</span><strong>Caixa com 6 cookies</strong><small>Uma seleção especial</small></button>
      <button class="box-size-option ${boxSize===12?"selected":""}" data-box-size="12"><span class="box-size-number">12</span><strong>Caixa com 12 cookies</strong><small>Para compartilhar</small></button>
    </div>
    <div class="box-progress">
      <div><strong>Sua caixa</strong><span>${chosen} de ${boxSize} cookies escolhidos</span></div>
      <div class="progress-track"><span style="width:${Math.min(100,chosen/boxSize*100)}%"></span></div>
      <p>${remaining>0?`Faltam ${remaining} ${remaining===1?"cookie":"cookies"} para completar sua caixa.`:"Sua caixa está completa! Já pode adicionar à sacola."}</p>
    </div>
    <div class="section-head"><div><p class="eyebrow">ESCOLHA OS SABORES</p><h2>Quais vão na sua caixa?</h2></div></div>
    <div class="product-grid">${cookies.map(p=>`<article class="product-card builder-card">
      <img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy">
      <div class="product-info"><h3>${p.name}</h3><p>${p.description}</p><div class="product-bottom"><span class="price">${money(p.price)} <small>/ un.</small></span>
      <div class="qty-control"><button data-box-qty="${p.id}" data-delta="-1" aria-label="Diminuir">−</button><span>${boxSelections[p.id]||0}</span><button data-box-qty="${p.id}" data-delta="1" aria-label="Aumentar" ${remaining<=0?"disabled":""}>+</button></div></div></div></article>`).join("")}</div>
    <div class="box-total-bar"><div><small>Valor da sua caixa</small><strong>${money(total)}</strong></div><button class="btn btn-primary" id="addBoxBtn" ${remaining!==0?"disabled":""}>Adicionar caixa à sacola</button></div>`;
}
function productView(id) {
  const p=PRODUCTS.find(x=>x.id===id); if(!p) return notFound();
  detailQty=1;
  return `<a class="back-link" href="#/categoria/${p.category}">← Voltar para ${CATEGORIES[p.category].title}</a>
    <div class="product-detail"><img src="${p.image}" alt="${p.name}">
    <div><p class="eyebrow">COOKIE ARTESANAL</p><h1>${p.name}</h1><p>${p.description}</p><div class="detail-price">${money(p.price)}</div>
    <p class="muted">Quantidade</p><div class="qty-control"><button data-detail-qty="-1" aria-label="Diminuir">−</button><span id="detailQty">1</span><button data-detail-qty="1" aria-label="Aumentar">+</button></div>
    <div class="detail-actions"><button class="btn btn-primary" data-add-detail="${p.id}">Adicionar à sacola</button><a class="btn btn-outline" href="#/sacola">Ver sacola</a></div></div></div>`;
}
function cartView() {
  const cart=getCart(); const entries=Object.entries(cart).filter(([id,q])=>q>0);
  if(!entries.length) return `<div class="empty-state"><div class="empty-icon">♧</div><h2>Sua sacola está vazia</h2><p class="muted">Que tal escolher alguns cookies deliciosos?</p><a class="btn btn-primary" href="#/inicio">Explorar cookies</a></div>`;
  const subtotal=entries.reduce((sum,[id,q])=>{
    if(isBoxKey(id)){const parsed=parseBoxKey(id);return sum+boxTotal(parsed.selections)*q;}
    const p=PRODUCTS.find(p=>p.id===id);return sum+(p?p.price*q:0);
  },0);
  return `<div class="page-intro"><p class="eyebrow">SEU PEDIDO</p><h1 class="page-title">Sua sacola</h1><p>Confira os itens antes de finalizar.</p></div>
  <div class="cart-list">${entries.map(([id,q])=>{
    if(isBoxKey(id)){
      const parsed=parseBoxKey(id); const desc=boxDescription(parsed.selections);
      return `<div class="cart-row"><div class="cart-box-thumb">▦</div><div><h3>Caixa personalizada com ${parsed.size}</h3><small>${desc}</small><div class="qty-control" style="margin-top:8px"><button data-cart-qty="${encodeURIComponent(id)}" data-delta="-1" aria-label="Diminuir">−</button><span>${q}</span><button data-cart-qty="${encodeURIComponent(id)}" data-delta="1" aria-label="Aumentar">+</button></div></div><div class="cart-row-end"><strong>${money(boxTotal(parsed.selections)*q)}</strong><button class="remove-btn" data-remove="${encodeURIComponent(id)}">Remover</button></div></div>`;
    }
    const p=PRODUCTS.find(x=>x.id===id); if(!p)return "";
    return `<div class="cart-row"><img src="${p.image}" alt="${p.name}"><div><h3>${p.name}</h3><small>${money(p.price)} · ${money(p.price*q)}</small><div class="qty-control" style="margin-top:8px"><button data-cart-qty="${id}" data-delta="-1" aria-label="Diminuir">−</button><span>${q}</span><button data-cart-qty="${id}" data-delta="1" aria-label="Aumentar">+</button></div></div><button class="remove-btn" data-remove="${id}">Remover</button></div>`;
  }).join("")}</div>
  <div class="cart-summary"><div class="total-line"><span>Subtotal</span><span>${money(subtotal)}</span></div>
  <div class="checkout-fields"><input class="text-field" id="customerName" placeholder="Seu nome" autocomplete="name"><input class="text-field" id="customerAddress" placeholder="Endereço / retirada (opcional)"><textarea class="text-field" id="customerNotes" rows="2" placeholder="Observações do pedido (opcional)"></textarea></div>
  <button class="btn btn-primary" id="checkoutBtn" style="width:100%">Finalizar pelo WhatsApp</button><p class="tiny-note">O pedido será enviado para confirmação. Frete e forma de pagamento serão combinados pelo WhatsApp.</p></div>`;
}
function notFound(){return `<div class="empty-state"><h2>Página não encontrada</h2><a class="btn btn-primary" href="#/inicio">Voltar ao início</a></div>`;}
function render() {
  const parts=location.hash.replace(/^#\/?/,"").split("/");
  const route=parts[0]||"inicio"; const view=document.getElementById("view");
  if(route==="inicio") view.innerHTML=homeView();
  else if(route==="categoria") view.innerHTML=categoryView(parts[1]);
  else if(route==="produto") view.innerHTML=productView(parts[1]);
  else if(route==="montar-caixa") view.innerHTML=boxBuilderView();
  else if(route==="sacola") view.innerHTML=cartView();
  else view.innerHTML=notFound();
  document.querySelectorAll(".nav-link").forEach(a=>a.classList.toggle("active",a.dataset.route=== (route==="categoria"?parts[1]:route)));
  updateCartCount();
}
function checkout() {
  const cart=getCart(); const entries=Object.entries(cart).filter(([id,q])=>q>0);
  const phone=(localStorage.getItem("ecookies-whatsapp")||"").replace(/\D/g,"");
  if(!entries.length) return showToast("Sua sacola está vazia.");
  if(!phone) { document.getElementById("settingsModal").showModal(); showToast("Configure o WhatsApp da loja primeiro."); return; }
  const name=document.getElementById("customerName").value.trim();
  const address=document.getElementById("customerAddress").value.trim();
  const notes=document.getElementById("customerNotes").value.trim();
  if(!name) { document.getElementById("customerName").focus(); return showToast("Informe seu nome para continuar."); }
  let total=0;
  const lines=entries.map(([id,q])=>{
    if(isBoxKey(id)){const parsed=parseBoxKey(id);const unit=boxTotal(parsed.selections);total+=unit*q;return `• ${q}x Caixa personalizada com ${parsed.size} cookies (${boxDescription(parsed.selections)}) — ${money(unit*q)}`;}
    const p=PRODUCTS.find(x=>x.id===id);if(!p)return "";total+=p.price*q;return `• ${q}x ${p.name} — ${money(p.price*q)}`;
  });
  const message=`Olá! Quero fazer um pedido na Ecookies 🍪\n\n${lines.join("\n")}\n\n*Subtotal: ${money(total)}*\n\nNome: ${name}${address?`\nEntrega/retirada: ${address}`:""}${notes?`\nObservações: ${notes}`:""}\n\nAguardo a confirmação!`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`,"_blank","noopener");
}
document.addEventListener("click",e=>{
  const add=e.target.closest("[data-add]"); if(add) addToCart(add.dataset.add);
  const detailAdd=e.target.closest("[data-add-detail]"); if(detailAdd) addToCart(detailAdd.dataset.addDetail,detailQty);
  const detailQtyBtn=e.target.closest("[data-detail-qty]"); if(detailQtyBtn){detailQty=Math.max(1,detailQty+Number(detailQtyBtn.dataset.detailQty));document.getElementById("detailQty").textContent=detailQty;}
  const boxSizeBtn=e.target.closest("[data-box-size]"); if(boxSizeBtn){boxSize=Number(boxSizeBtn.dataset.boxSize);boxSelections={};render();}
  const boxQtyBtn=e.target.closest("[data-box-qty]"); if(boxQtyBtn){const id=boxQtyBtn.dataset.boxQty;const current=Object.values(boxSelections).reduce((a,b)=>a+b,0);const delta=Number(boxQtyBtn.dataset.delta);if(delta>0&&current>=boxSize)return showToast("Sua caixa já está completa.");boxSelections[id]=Math.max(0,(boxSelections[id]||0)+delta);if(!boxSelections[id])delete boxSelections[id];render();}
  if(e.target.id==="addBoxBtn"){const count=Object.values(boxSelections).reduce((a,b)=>a+b,0);if(count!==boxSize)return;const key=boxKey(boxSize,boxSelections);const c=getCart();c[key]=(c[key]||0)+1;saveCart(c);boxSelections={};showToast("Caixa personalizada adicionada!");location.hash="#/sacola";}
  const cartQty=e.target.closest("[data-cart-qty]"); if(cartQty) changeQty(decodeURIComponent(cartQty.dataset.cartQty),Number(cartQty.dataset.delta));
  const remove=e.target.closest("[data-remove]"); if(remove){const c=getCart();delete c[decodeURIComponent(remove.dataset.remove)];saveCart(c);render();}
  if(e.target.id==="checkoutBtn") checkout();
  if(e.target.id==="managementBtn"){document.getElementById("whatsappInput").value=localStorage.getItem("ecookies-whatsapp")||"";document.getElementById("settingsModal").showModal();}
  const close=e.target.closest("[data-close]"); if(close) document.getElementById(close.dataset.close).close();
});
document.getElementById("saveSettings").addEventListener("click",()=>{
  const number=document.getElementById("whatsappInput").value.replace(/\D/g,"");
  if(number.length<12 || number.length>13){showToast("Informe o número com código do país e DDD.");return;}
  localStorage.setItem("ecookies-whatsapp",number);document.getElementById("settingsModal").close();showToast("WhatsApp salvo com sucesso!");
});
window.addEventListener("hashchange",()=>{render();window.scrollTo({top:0,behavior:"smooth"});});
document.getElementById("year").textContent=new Date().getFullYear();
updateCartCount();render();