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

// Add filters
const filtersHtml = `
    <div class="p-filters" id="pFilters">
      <button class="p-filter-btn active" data-filter="all">Todos</button>
      <button class="p-filter-btn" data-filter="Vestidos">Vestidos</button>
      <button class="p-filter-btn" data-filter="Conjuntos">Conjuntos</button>
      <button class="p-filter-btn" data-filter="Macacões">Macacões</button>
      <button class="p-filter-btn" data-filter="Plus Size">Plus Size</button>
    </div>
  </div>`;
index = index.replace(/<\/div>\s*<a href="https:\/\/instagram\.com\/_maju\.modafeminina" class="see-all">Ver tudo<\/a>\s*<\/div>/, '</div>\n' + filtersHtml);

// Add FAQ
const faqHtml = `
<!-- FAQ -->
<section class="faq" id="faq">
  <div class="faq-inner">
    <p class="s-tag rv">Dúvidas Frequentes</p>
    <h2 class="s-title rv" style="margin-bottom:30px">Ficou com alguma <em>dúvida?</em></h2>
    <div class="faq-list rv">
      <div class="faq-item">
        <button class="faq-q">Quais são as formas de pagamento? <span class="faq-icon">+</span></button>
        <div class="faq-a"><p>Aceitamos Pix com 5% de desconto, Cartão de Crédito em até 12x (sem juros até 6x) e Boleto Bancário.</p></div>
      </div>
      <div class="faq-item">
        <button class="faq-q">Qual o prazo de entrega? <span class="faq-icon">+</span></button>
        <div class="faq-a"><p>O prazo varia conforme o seu CEP. Entregamos para todo o Brasil e oferecemos frete grátis em compras acima de R$299.</p></div>
      </div>
      <div class="faq-item">
        <button class="faq-q">A MAJU realiza trocas? <span class="faq-icon">+</span></button>
        <div class="faq-a"><p>Sim! A primeira troca é gratuita em até 30 dias úteis após o recebimento do pedido. Sem burocracia.</p></div>
      </div>
      <div class="faq-item">
        <button class="faq-q">Como sei meu tamanho? <span class="faq-icon">+</span></button>
        <div class="faq-a"><p>Você pode consultar nossa Tabela de Medidas detalhada em todos os produtos ou falar com a gente pelo WhatsApp!</p></div>
      </div>
    </div>
  </div>
</section>
`;
index = index.replace('<!-- MAPA & CONTATO -->', faqHtml + '\n<!-- MAPA & CONTATO -->');

// Add Modals (Quick View & Size Guide)
const modalsHtml = `
<!-- QUICK VIEW MODAL -->
<div class="qv-ov" id="qvOv">
  <div class="qv-modal" id="qvModal">
    <button class="qv-close" onclick="closeQuickView()">✕</button>
    <div class="qv-content" id="qvContent"></div>
  </div>
</div>

<!-- SIZE GUIDE MODAL -->
<div class="sg-ov" id="sgOv">
  <div class="sg-modal">
    <button class="sg-close" onclick="closeSizeGuide()">✕</button>
    <h3 style="font-family:'Cormorant Garamond',serif;font-size:26px;color:var(--brown);margin-bottom:10px;">Tabela de Medidas</h3>
    <p style="font-size:13px;color:var(--muted);margin-bottom:20px;">Use uma fita métrica para encontrar o tamanho ideal para o seu corpo.</p>
    <div style="overflow-x:auto;">
      <table class="sg-table">
        <thead><tr><th>Tamanho</th><th>Busto (cm)</th><th>Cintura (cm)</th><th>Quadril (cm)</th></tr></thead>
        <tbody>
          <tr><td>P (36/38)</td><td>82-86</td><td>64-68</td><td>90-94</td></tr>
          <tr><td>M (40)</td><td>90-94</td><td>72-76</td><td>98-102</td></tr>
          <tr><td>G (42)</td><td>98-102</td><td>80-84</td><td>106-110</td></tr>
          <tr><td>GG (44)</td><td>106-110</td><td>88-92</td><td>114-118</td></tr>
          <tr><td>1G (46)</td><td>110-114</td><td>92-96</td><td>118-122</td></tr>
          <tr><td>2G (48)</td><td>114-118</td><td>96-100</td><td>122-126</td></tr>
          <tr><td>3G (50)</td><td>118-122</td><td>100-104</td><td>126-130</td></tr>
          <tr><td>4G (52)</td><td>122-126</td><td>104-108</td><td>130-134</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
`;
index = index.replace('<script src="script.js" defer></script>', modalsHtml + '\n<script src="script.js" defer></script>');

// Update HTML
fs.writeFileSync(indexPath, index, 'utf8');

// --- 2. STYLE.CSS EDITS ---
const newCss = `
/* FAQ */
.faq{padding:clamp(50px,8vw,100px) 5vw;background:var(--white);}
.faq-inner{max-width:800px;margin:0 auto;}
.faq-item{border-bottom:1px solid var(--cream3);margin-bottom:10px;}
.faq-q{width:100%;text-align:left;background:none;border:none;padding:20px 0;font-size:15px;font-weight:500;color:var(--brown);cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:color .3s;}
.faq-q:hover{color:var(--terra);}
.faq-icon{font-size:20px;font-weight:300;transition:transform .3s;}
.faq-item.active .faq-icon{transform:rotate(45deg);color:var(--terra);}
.faq-a{max-height:0;overflow:hidden;transition:max-height .4s ease;}
.faq-a p{padding-bottom:20px;font-size:13px;line-height:1.8;color:var(--muted);}

/* FILTERS */
.p-filters{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px;}
.p-filter-btn{background:transparent;border:1px solid var(--cream3);color:var(--brown);padding:8px 16px;font-size:11px;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all .3s;}
.p-filter-btn:hover, .p-filter-btn.active{background:var(--terra);border-color:var(--terra);color:var(--white);}

/* QUICK VIEW */
.qv-ov, .sg-ov{position:fixed;inset:0;background:rgba(74,44,24,.6);z-index:900;opacity:0;pointer-events:none;transition:opacity .4s;display:flex;align-items:center;justify-content:center;padding:16px;}
.qv-ov.show, .sg-ov.show{opacity:1;pointer-events:all;}
.qv-modal{background:var(--white);width:100%;max-width:800px;max-height:90svh;display:flex;position:relative;transform:translateY(20px);transition:transform .4s;}
.qv-ov.show .qv-modal, .sg-ov.show .sg-modal{transform:translateY(0);}
.qv-close, .sg-close{position:absolute;top:16px;right:16px;background:var(--cream);border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;color:var(--brown);z-index:2;}
.qv-content{display:flex;width:100%;flex-direction:row;}
.qv-img{width:50%;object-fit:cover;}
.qv-info{width:50%;padding:40px 30px;overflow-y:auto;}
@media(max-width:768px){
  .qv-content{flex-direction:column;}
  .qv-img{width:100%;height:300px;}
  .qv-info{width:100%;padding:24px;}
  .qv-modal{overflow-y:auto;}
}

/* SIZE GUIDE */
.sg-modal{background:var(--white);width:100%;max-width:600px;padding:40px;position:relative;transform:translateY(20px);transition:transform .4s;max-height:90svh;overflow-y:auto;}
.sg-table{width:100%;border-collapse:collapse;margin-top:10px;}
.sg-table th, .sg-table td{padding:12px;text-align:left;border-bottom:1px solid var(--cream3);font-size:13px;color:var(--brown);}
.sg-table th{background:var(--cream2);font-weight:500;}

/* TOAST */
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(100px);background:var(--terra);color:var(--white);padding:12px 24px;border-radius:40px;font-size:12px;letter-spacing:1px;box-shadow:0 10px 30px var(--shadow);z-index:999;transition:transform .4s cubic-bezier(0.175, 0.885, 0.32, 1.275);}
.toast.show{transform:translateX(-50%) translateY(0);}
`;
fs.appendFileSync(stylePath, '\n' + newCss, 'utf8');

// --- 3. SCRIPT.JS EDITS ---
let newScript = `
// --- FAQ ---
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const ans = item.querySelector('.faq-a');
    const isActive = item.classList.contains('active');
    
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('active');
      i.querySelector('.faq-a').style.maxHeight = null;
    });
    
    if(!isActive) {
      item.classList.add('active');
      ans.style.maxHeight = ans.scrollHeight + 'px';
    }
  });
});

// --- SIZE GUIDE ---
function openSizeGuide() {
  document.getElementById('sgOv').classList.add('show');
}
function closeSizeGuide() {
  document.getElementById('sgOv').classList.remove('show');
}

// --- QUICK VIEW ---
function openQuickView(pid) {
  const prod = PRODS_MAP[pid];
  if(!prod) return;
  
  let szs = '';
  prod.variacoes.filter(v => v.quantidade > 0).forEach(v => {
    szs += '<span class="sz" onclick="selSz(this)">' + v.tamanho + '</span>';
  });
  
  let html = \`
    <img class="qv-img" src="\${prod.imagem_url || 'https://placehold.co/400x533/EFE2D2/4A2C18?text=MAJU'}" alt="\${prod.nome}">
    <div class="qv-info">
      <p class="p-cat">\${prod.categoria || ''}</p>
      <h2 style="font-family:'Cormorant Garamond',serif;font-size:28px;color:var(--brown);margin-bottom:10px;">\${prod.nome}</h2>
      <div class="p-price" style="margin-bottom:20px;"><span class="p-new">R$ \${Number(prod.preco).toFixed(2).replace('.',',')}</span></div>
      <p style="font-size:13px;line-height:1.7;color:var(--muted);margin-bottom:24px;">\${prod.descricao || 'Peça exclusiva MAJU, desenvolvida para proporcionar conforto e elegância em todas as ocasiões.'}</p>
      
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;">
        <p style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:var(--brown);">Tamanho</p>
        <button onclick="openSizeGuide()" style="background:none;border:none;color:var(--terra);font-size:11px;text-decoration:underline;cursor:pointer;">Guia de Tamanhos</button>
      </div>
      <div class="sz-row" style="margin-bottom:24px; transform:none;">\${szs}</div>
      
      <button class="btn btn-t btn-full add-btn" style="transform:none;" data-pid="\${prod.id}" onclick="addToCartBtn(this)"><span>Adicionar ao carrinho</span></button>
    </div>
  \`;
  
  document.getElementById('qvContent').innerHTML = html;
  document.getElementById('qvOv').classList.add('show');
}
function closeQuickView() {
  document.getElementById('qvOv').classList.remove('show');
}

// --- TOAST NOTIFICATION ---
function showToast(msg) {
  let t = document.getElementById('majuToast');
  if(!t) {
    t = document.createElement('div');
    t.id = 'majuToast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// Override cartAdd to show toast
const oldCartAdd = cartAdd;
cartAdd = function(prod, tamanho) {
  oldCartAdd(prod, tamanho);
  showToast('🛍 ' + prod.nome + ' adicionado!');
}
`;

// Modify the buildCard function to open Quick View on image click
script = script.replace(/<div class="p-wrap">/, '<div class="p-wrap" onclick="openQuickView(\\\'\' + p.id + \'\\\')" style="cursor:pointer;">');

// Add Filter Logic for Supabase
const filterLogic = `
    let currentFilter = 'all';
    
    function renderFiltered() {
      let filtered = data;
      if(currentFilter !== 'all') {
        if(currentFilter === 'Plus Size') {
           filtered = data.filter(p => p.badge === 'plus' || p.categoria === 'Plus Size');
        } else {
           filtered = data.filter(p => p.categoria && p.categoria.toLowerCase().includes(currentFilter.toLowerCase()));
        }
      }
      
      var g1 = document.getElementById('grid-destaques');
      if(g1) {
        g1.innerHTML = filtered.slice(0,8).map(buildCard).join('');
        document.querySelectorAll('#grid-destaques .rv').forEach(function(el){ el.classList.add('vis'); });
      }
    }

    document.querySelectorAll('.p-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.p-filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.filter;
        renderFiltered();
      });
    });
`;

script = script.replace('if(g1) g1.innerHTML = data.slice(0,4).map(buildCard).join(\'\');', filterLogic + '\n    if(g1) g1.innerHTML = data.slice(0,8).map(buildCard).join(\'\');');
// We append the new script functions at the end
script += '\n' + newScript;

fs.writeFileSync(scriptPath, script, 'utf8');

console.log('Features added successfully!');
