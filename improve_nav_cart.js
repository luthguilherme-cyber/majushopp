const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\guilu\\.gemini\\antigravity\\scratch\\maju-moda';
const indexPath = path.join(dir, 'index.html');
const stylePath = path.join(dir, 'style.css');
const scriptPath = path.join(dir, 'script.js');

let index = fs.readFileSync(indexPath, 'utf8');
let style = fs.readFileSync(stylePath, 'utf8');
let script = fs.readFileSync(scriptPath, 'utf8');

// --- 1. INDEX.HTML EDITS ---

// A. Replace Nav Right
const oldNavRight = `<div class="nav-right">
    <button class="ico">🔍</button>
    <button class="ico" onclick="openCart()" style="position:relative">🛍<span class="cc" id="cc">0</span></button>
    <a href="https://wa.me/5521964824525" class="btn btn-t btn-sm"><span>WhatsApp</span></a>
    <button class="ham" id="ham" onclick="toggleMob()" aria-label="Menu"><span></span><span></span><span></span></button>
  </div>`;

const newNavRight = `<div class="nav-right">
    <div class="search-box" id="searchBox">
      <input type="text" id="searchInput" class="search-input" placeholder="Buscar..." oninput="handleSearch(this.value)">
      <button class="ico search-toggle" aria-label="Buscar" onclick="toggleSearch()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </button>
    </div>
    <button class="ico cart-btn" onclick="openCart()" aria-label="Sacola">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
      <span class="cc" id="cc">0</span>
    </button>
    <button class="ham" id="ham" onclick="toggleMob()" aria-label="Menu"><span></span><span></span><span></span></button>
  </div>`;
index = index.replace(oldNavRight, newNavRight);

// B. Update Mobile Drawer with Search
const oldMobHead = `<div class="mob-head"><span class="mob-logo">MAJU</span><button class="mob-close" onclick="closeMob()">✕</button></div>`;
const newMobHead = `<div class="mob-head"><span class="mob-logo">MAJU</span><button class="mob-close" onclick="closeMob()">✕</button></div>
  <div class="mob-search">
    <input type="text" placeholder="Buscar peças..." oninput="handleSearch(this.value); if(this.value && this.value.length > 2) { closeMob(); document.getElementById('produtos').scrollIntoView(); }">
  </div>`;
index = index.replace(oldMobHead, newMobHead);

// C. Update Cart Header for Free Shipping Progress Bar
const oldCartHead = `<div class="c-head">
    <h3>Meu carrinho <span id="c-count" style="font-size:13px;color:var(--muted);font-weight:300;"></span></h3>
    <button class="c-close" onclick="closeCart()">✕</button>
  </div>`;
const newCartHead = `<div class="c-head" style="flex-direction:column; align-items:flex-start; padding-bottom:12px;">
    <div style="display:flex; justify-content:space-between; width:100%; align-items:center; margin-bottom:12px;">
      <h3 style="font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--brown);">Minha Sacola <span id="c-count" style="font-size:14px;color:var(--muted);font-weight:300;font-family:'DM Sans',sans-serif;"></span></h3>
      <button class="c-close" onclick="closeCart()">✕</button>
    </div>
    <div class="c-progress-wrap">
      <p id="c-progress-text">Faltam <strong>R$ 299,00</strong> para <strong>Frete Grátis</strong></p>
      <div class="c-progress-bar"><div class="c-progress-fill" id="cProgressFill"></div></div>
    </div>
  </div>`;
index = index.replace(oldCartHead, newCartHead);


// --- 2. STYLE.CSS EDITS ---
const newCss = `
/* ENHANCED NAV (Mobile First) */
nav { position: fixed; width: 100%; top: 34px; background: rgba(247,238,228,0.98); backdrop-filter: blur(10px); z-index: 500; display: flex; align-items: center; justify-content: space-between; padding: 12px 5vw; transition: top 0.3s; border-bottom: 1px solid var(--cream3); }
nav.solid { top: 0; box-shadow: 0 4px 20px rgba(74,44,24,0.08); }

@media (max-width: 768px) {
  .nav-logo { position: absolute; left: 50%; transform: translateX(-50%); }
  .ham { display: flex !important; margin-right: auto; }
  .nav-right { margin-left: auto; display: flex; align-items: center; gap: 12px; }
  .nav-right .btn-sm { display: none; }
  .search-box { display: none; } /* Hide sliding search on mobile nav, use drawer search */
}

/* SEARCH BOX (Desktop) */
.search-box { display: flex; align-items: center; position: relative; overflow: hidden; border-radius: 30px; background: var(--cream2); transition: all 0.3s ease; width: 36px; height: 36px; }
.search-box.active { width: 220px; background: var(--white); border: 1px solid var(--terra); }
.search-input { width: 100%; height: 100%; border: none; background: transparent; padding: 0 14px 0 36px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--brown); outline: none; opacity: 0; transition: opacity 0.3s; }
.search-box.active .search-input { opacity: 1; }
.search-toggle { position: absolute; left: 8px; background: none; border: none; color: var(--brown); cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 2; padding: 0; }
.search-box.active .search-toggle { color: var(--terra); }

/* MOBILE DRAWER ENHANCEMENTS */
.mob-drawer { width: min(340px, 90vw); border-radius: 20px 0 0 20px; }
.mob-search { padding: 0 22px 16px; border-bottom: 1px solid var(--cream3); }
.mob-search input { width: 100%; padding: 14px 18px; border-radius: 8px; border: 1px solid var(--cream3); background: var(--cream2); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border 0.3s; }
.mob-search input:focus { border-color: var(--terra); background: var(--white); }
.mob-nav a { font-size: 22px; padding: 16px 0; display: flex; justify-content: space-between; align-items: center; }
.mob-nav a::after { content: '→'; font-size: 16px; color: var(--terra); opacity: 0; transform: translateX(-10px); transition: all 0.3s; }
.mob-nav a:hover::after { opacity: 1; transform: translateX(0); }

/* CART ENHANCEMENTS */
.cart-btn { position: relative; display: flex; align-items: center; justify-content: center; }
.cart-btn .cc { top: -6px; right: -8px; background: var(--terra); font-size: 9px; font-weight: 600; width: 18px; height: 18px; border-radius: 50%; box-shadow: 0 2px 5px rgba(193,122,90,0.5); }
.c-drawer { width: min(420px, 100vw); border-radius: 20px 0 0 20px; }
.c-progress-wrap { width: 100%; }
#c-progress-text { font-size: 11px; color: var(--brown); margin-bottom: 8px; text-align: center; }
#c-progress-text strong { color: var(--terra); }
.c-progress-bar { width: 100%; height: 6px; background: var(--cream2); border-radius: 4px; overflow: hidden; }
.c-progress-fill { height: 100%; background: var(--terra); width: 0%; transition: width 0.5s ease-out; }
.c-item { background: var(--white); border: 1px solid var(--cream3); border-radius: 12px; padding: 12px; margin-bottom: 12px; align-items: center; transition: box-shadow 0.3s; }
.c-item:hover { box-shadow: 0 4px 15px var(--shadow); border-color: var(--terra4); }
.c-item-img { width: 64px; height: 80px; border-radius: 6px; }
.c-qty { background: var(--cream2); border-radius: 20px; padding: 2px; }
.c-qty-btn { border: none; background: var(--white); border-radius: 50%; width: 24px; height: 24px; box-shadow: 0 2px 4px var(--shadow); }
.c-remove { text-decoration: underline; color: var(--muted); }
.c-remove:hover { color: var(--terra); }
.c-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; opacity: 0.7; }
.c-empty svg { width: 64px; height: 64px; color: var(--terra); margin-bottom: 20px; }
`;
fs.appendFileSync(stylePath, '\n' + newCss, 'utf8');

// --- 3. SCRIPT.JS EDITS ---
const newScript = `
// --- SEARCH LOGIC ---
function toggleSearch() {
  const box = document.getElementById('searchBox');
  const inp = document.getElementById('searchInput');
  box.classList.toggle('active');
  if(box.classList.contains('active')) {
    inp.focus();
  } else {
    inp.value = '';
    handleSearch('');
  }
}

function handleSearch(query) {
  currentFilter = 'all'; // reset category filter
  document.querySelectorAll('.p-filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.p-filter-btn[data-filter="all"]').classList.add('active');
  
  query = query.toLowerCase().trim();
  
  let filtered = data;
  if(query.length > 0) {
    filtered = data.filter(p => 
      p.nome.toLowerCase().includes(query) || 
      (p.categoria && p.categoria.toLowerCase().includes(query))
    );
  }
  
  var g1 = document.getElementById('grid-destaques');
  if(g1) {
    if(filtered.length === 0) {
      g1.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--muted);">Nenhum produto encontrado para "' + query + '".</div>';
    } else {
      g1.innerHTML = filtered.slice(0,12).map(buildCard).join('');
      document.querySelectorAll('#grid-destaques .rv').forEach(function(el){ el.classList.add('vis'); });
    }
  }
}

// --- CART PROGRESS BAR LOGIC ---
function updateCartProgress(total) {
  const goal = 299;
  const fill = document.getElementById('cProgressFill');
  const text = document.getElementById('c-progress-text');
  
  if(!fill || !text) return;

  if (total >= goal) {
    fill.style.width = '100%';
    fill.style.background = '#25D366'; // Green when reached
    text.innerHTML = '✨ Parabéns! Você ganhou <strong>Frete Grátis</strong>!';
  } else {
    const percent = (total / goal) * 100;
    fill.style.width = percent + '%';
    fill.style.background = 'var(--terra)';
    const remaining = goal - total;
    text.innerHTML = 'Faltam <strong>R$ ' + remaining.toFixed(2).replace('.',',') + '</strong> para <strong>Frete Grátis</strong>';
  }
}

// Intercept cartRender to update progress
const originalCartRender = cartRender;
cartRender = function() {
  originalCartRender();
  var c = cartGet();
  var total = cartTotal(c);
  updateCartProgress(total);
  
  // Enhance Empty State Icon
  var body = document.getElementById('c-body');
  if(!c.length && body) {
    body.innerHTML = '<div class="c-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg><p style="font-size:16px; color:var(--brown); font-weight:500;">Sua sacola está vazia</p><p style="font-size:13px; color:var(--muted); margin-top:8px;">Que tal explorar nossas novidades?</p><button class="btn btn-o" style="margin-top:24px;" onclick="closeCart()">Continuar comprando</button></div>';
  }
}
`;

// Insert variables to make sure `data` is accessible globally for the search
script = script.replace('const data = produtos.map(', 'window.data = produtos.map(');

// Add the new script to the end
script += '\n' + newScript;

// Update files
fs.writeFileSync(indexPath, index, 'utf8');
fs.writeFileSync(scriptPath, script, 'utf8');

console.log('Nav and Cart features added successfully!');
