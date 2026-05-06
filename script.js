const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>nav.classList.toggle('solid',scrollY>80),{passive:true});

const ham=document.getElementById('ham');
const mobDraw=document.getElementById('mobDraw');
const mobOv=document.getElementById('mobOv');
let mobOpen=false;
function toggleMob(){mobOpen?closeMob():openMob();}
function openMob(){mobOpen=true;ham.classList.add('open');mobDraw.classList.add('open');mobOv.classList.add('show');document.body.style.overflow='hidden';}
function closeMob(){mobOpen=false;ham.classList.remove('open');mobDraw.classList.remove('open');mobOv.classList.remove('show');document.body.style.overflow='';}

function openCart(){document.getElementById('cDraw').classList.add('open');document.getElementById('cOv').classList.add('show');}
function closeCart(){document.getElementById('cDraw').classList.remove('open');document.getElementById('cOv').classList.remove('show');}
function addCart(){ openCart(); }

(function(){
  const end=Date.now()+(8*3600+45*60)*1000;
  function tick(){
    const d=end-Date.now();if(d<0)return;
    document.getElementById('h').textContent=String(Math.floor(d/3600000)).padStart(2,'0');
    document.getElementById('m').textContent=String(Math.floor(d%3600000/60000)).padStart(2,'0');
    document.getElementById('s').textContent=String(Math.floor(d%60000/1000)).padStart(2,'0');
  }
  tick();setInterval(tick,1000);
})();

function closePopup(){document.getElementById('popOv').classList.remove('show');}
function copyCode(){
  navigator.clipboard?.writeText('MAJU10');
  const p=document.getElementById('popTxt');
  p.textContent='✓ Copiado!';
  setTimeout(()=>p.textContent='Clique para copiar',2000);
}
setTimeout(()=>document.getElementById('popOv').classList.add('show'),5000);

document.querySelectorAll('.sz').forEach(b=>b.addEventListener('click',function(){
  this.closest('.sz-row').querySelectorAll('.sz').forEach(x=>x.style.cssText='');
  this.style.background='var(--white)';this.style.color='var(--brown)';
}));

setTimeout(()=>{const t=document.getElementById('wppTip');if(t)t.style.opacity='0';},7000);

const obs=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting)x.target.classList.add('vis');}),{threshold:0.08});
document.querySelectorAll('.rv,.rl,.rr').forEach(el=>obs.observe(el));

document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{if(mobOpen)closeMob();}));


// ── CART (localStorage) ──────────────────────────────────────────
var CART_KEY = 'maju_cart';
var PRODS_MAP = {};

function cartGet(){ try{ return JSON.parse(localStorage.getItem(CART_KEY))||[]; }catch(e){ return []; } }
function cartSave(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); }

function cartAdd(prod, tamanho){
  var c = cartGet();
  var key = prod.id + '_' + tamanho;
  var idx = -1;
  c.forEach(function(item, i){ if(item.key === key) idx = i; });
  if(idx >= 0){ c[idx].qty += 1; }
  else {
    c.push({key:key, id:prod.id, nome:prod.nome, preco:prod.preco,
      img:prod.imagem_url||'', tamanho:tamanho, qty:1});
  }
  cartSave(c);
  cartRender();
  openCart();
}

function cartRemove(key){
  var c = cartGet().filter(function(i){ return i.key !== key; });
  cartSave(c); cartRender();
}

function cartQty(key, delta){
  var c = cartGet();
  c.forEach(function(item){
    if(item.key === key){
      item.qty = Math.max(1, item.qty + delta);
    }
  });
  cartSave(c); cartRender();
}

function cartTotal(c){
  var t = 0;
  c.forEach(function(i){ t += i.preco * i.qty; });
  return t;
}

function cartRender(){
  var c = cartGet();
  var body = document.getElementById('c-body');
  var foot = document.getElementById('c-foot');
  var badge = document.getElementById('cc');
  var count = document.getElementById('c-count');
  var totalQty = 0;
  c.forEach(function(i){ totalQty += i.qty; });
  if(badge) badge.textContent = totalQty;
  if(count) count.textContent = totalQty ? '(' + totalQty + ' ' + (totalQty===1?'item':'itens') + ')' : '';
  if(!c.length){
    body.innerHTML = '<div class="c-empty">🛍<br><br>Seu carrinho está vazio.<br>Explore nossas novidades!</div>';
    if(foot) foot.style.display = 'none';
    return;
  }
  var html = '';
  c.forEach(function(item){
    var imgHtml = item.img
      ? '<img class="c-item-img" src="' + item.img + '" alt="' + item.nome + '">'
      : '<div class="c-item-img-ph"></div>';
    html += '<div class="c-item">';
    html += imgHtml;
    html += '<div class="c-item-info">';
    html += '<p class="c-item-name">' + item.nome + '</p>';
    html += '<p class="c-item-sz">Tam. ' + item.tamanho + '</p>';
    html += '<p class="c-item-price">R$ ' + Number(item.preco).toFixed(2).replace('.',',') + '</p>';
    html += '<div class="c-qty">';
    html += '<button class="c-qty-btn" onclick="cartQty(\'' + item.key + '\',-1)">−</button>';
    html += '<span class="c-qty-num">' + item.qty + '</span>';
    html += '<button class="c-qty-btn" onclick="cartQty(\'' + item.key + '\',1)">+</button>';
    html += '<button class="c-remove" onclick="cartRemove(\'' + item.key + '\')">remover</button>';
    html += '</div></div></div>';
  });
  body.innerHTML = html;
  var total = cartTotal(c);
  document.getElementById('c-total-val').textContent = 'R$ ' + total.toFixed(2).replace('.',',');
  if(foot) foot.style.display = 'block';
  // WhatsApp link
  var wppMsg = 'Ol\u00e1! Gostaria de finalizar meu pedido na MAJU:\n\n';
  c.forEach(function(i){ wppMsg += '- ' + i.nome + ' (Tam.' + i.tamanho + ') x' + i.qty + ' = R$ ' + (i.preco*i.qty).toFixed(2).replace('.',',') + '\n'; });
  wppMsg += '\nTotal: R$ ' + total.toFixed(2).replace('.',',');
  var wppEl = document.getElementById('wpp-cart-link');
  if(wppEl) wppEl.href = 'https://wa.me/5521964824525?text=' + encodeURIComponent(wppMsg);
}

function irCheckout(){
  if(!cartGet().length) return;
  document.getElementById('ckOv').classList.add('show');
  document.body.style.overflow = 'hidden';
  ckGoStep(1);
}
function ckClose(){
  document.getElementById('ckOv').classList.remove('show');
  document.body.style.overflow = '';
}

function ckGoStep(n){
  [1,2,3].forEach(function(i){
    document.getElementById('ck-step'+i).classList.remove('active');
    var dot = document.getElementById('dot'+i);
    if(dot) dot.classList.toggle('done', i <= n);
  });
  document.getElementById('ck-step'+n).classList.add('active');
}

function maskCep(inp){
  var v = inp.value.replace(/\D/g,'');
  if(v.length > 5) v = v.slice(0,5) + '-' + v.slice(5,8);
  inp.value = v;
}
function maskFone(inp){
  var v = inp.value.replace(/\D/g,'');
  if(v.length <= 10) v = v.replace(/(\d{2})(\d{4})(\d{0,4})/,'($1) $2-$3');
  else v = v.replace(/(\d{2})(\d{5})(\d{0,4})/,'($1) $2-$3');
  inp.value = v;
}

async function buscaCep(){
  var cep = document.getElementById('ck-cep').value.replace(/\D/g,'');
  if(cep.length !== 8) return;
  document.getElementById('cep-spin').style.display = 'block';
  try {
    var r = await fetch('https://viacep.com.br/ws/' + cep + '/json/');
    var d = await r.json();
    if(!d.erro){
      document.getElementById('ck-rua').value    = d.logradouro || '';
      document.getElementById('ck-bairro').value = d.bairro     || '';
      document.getElementById('ck-cidade').value = d.localidade || '';
      document.getElementById('ck-uf').value     = d.uf         || '';
      document.getElementById('ck-num').focus();
    }
  } catch(e){}
  document.getElementById('cep-spin').style.display = 'none';
}

function ckStep1(){ ckGoStep(1); }

function ckStep2(){
  var campos = [
    {id:'ck-nome',  label:'Nome'},
    {id:'ck-email', label:'E-mail'},
    {id:'ck-fone',  label:'WhatsApp'},
    {id:'ck-cep',   label:'CEP'},
    {id:'ck-rua',   label:'Rua'},
    {id:'ck-num',   label:'Numero'},
    {id:'ck-bairro',label:'Bairro'},
    {id:'ck-cidade',label:'Cidade'}
  ];
  var ok = true;
  campos.forEach(function(c){
    var el = document.getElementById(c.id);
    if(!el.value.trim()){ el.classList.add('err'); ok=false; }
    else el.classList.remove('err');
  });
  if(!ok){ alert('Preencha todos os campos obrigatorios.'); return; }

  var c = cartGet();
  var html = '';
  c.forEach(function(item){
    var imgHtml = item.img ? '<img class="ck-sum-img" src="'+item.img+'" alt="">' : '';
    html += '<div class="ck-summary-item">' + imgHtml;
    html += '<div class="ck-sum-info">';
    html += '<p class="ck-sum-name">' + item.nome + '</p>';
    html += '<p class="ck-sum-det">Tamanho: ' + item.tamanho + ' &nbsp;|&nbsp; Qtd: ' + item.qty + '</p>';
    html += '</div>';
    html += '<span class="ck-sum-price">R$ ' + (item.preco*item.qty).toFixed(2).replace('.',',') + '</span>';
    html += '</div>';
  });
  document.getElementById('ck-items').innerHTML = html;
  document.getElementById('ck-total').textContent = 'R$ ' + cartTotal(c).toFixed(2).replace('.',',');

  var addr = document.getElementById('ck-rua').value + ', ' +
    document.getElementById('ck-num').value;
  var comp = document.getElementById('ck-comp').value;
  if(comp) addr += ' ' + comp;
  addr += ' — ' + document.getElementById('ck-bairro').value +
    ', ' + document.getElementById('ck-cidade').value +
    ' / ' + document.getElementById('ck-uf').value +
    ' — CEP ' + document.getElementById('ck-cep').value;
  document.getElementById('ck-addr-preview').textContent = addr;

  ckGoStep(2);
}

async function ckConfirmar(){
  var c = cartGet();
  var nome   = document.getElementById('ck-nome').value;
  var email  = document.getElementById('ck-email').value;
  var fone   = document.getElementById('ck-fone').value;
  var addr   = document.getElementById('ck-rua').value+', '+document.getElementById('ck-num').value+
    (document.getElementById('ck-comp').value ? ' '+document.getElementById('ck-comp').value : '')+
    ' — '+document.getElementById('ck-bairro').value+
    ', '+document.getElementById('ck-cidade').value+
    '/'+document.getElementById('ck-uf').value+
    ' CEP '+document.getElementById('ck-cep').value;
  var total  = cartTotal(c);

  try {
    var SURL = 'https://xrrijeleceivksttleiz.supabase.co/rest/v1';
    var SKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycmlqZWxlY2VpdmtzdHRsZWl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NTQ4NDYsImV4cCI6MjA5MjAzMDg0Nn0.yTtmRpg3EandIvpjZSW5V8i2cK5CfBhjqrywRrJ9UjI';
    var SHDR = {'apikey':SKEY,'Authorization':'Bearer '+SKEY,'Content-Type':'application/json','Prefer':'return=representation'};
    var rv = await fetch(SURL+'/vendas', {method:'POST', headers:SHDR, body:JSON.stringify({
      cliente_nome: nome, cliente_email: email,
      total: total, canal: 'site', status: 'pendente',
      endereco: addr, telefone: fone
    })});
    var venda = await rv.json();
    var vid = venda[0] ? venda[0].id : null;
    if(vid){
      var itens = c.map(function(i){ return {venda_id:vid, produto_id:i.id, quantidade:i.qty, preco_unitario:i.preco}; });
      await fetch(SURL+'/itens_venda', {method:'POST', headers:SHDR, body:JSON.stringify(itens)});
    }
    var num = 'Pedido #' + Date.now().toString().slice(-6);
    document.getElementById('ck-num-pedido').textContent = num;
    ckGoStep(3);
  } catch(e){
    alert('Erro ao salvar pedido. Use o WhatsApp para finalizar.');
    ckWhatsapp();
  }
}

function ckWhatsapp(){
  var c = cartGet();
  var nome  = document.getElementById('ck-nome').value || '';
  var fone  = document.getElementById('ck-fone').value || '';
  var addr  = document.getElementById('ck-rua').value+', '+document.getElementById('ck-num').value+
    ', '+document.getElementById('ck-bairro').value+
    ', '+document.getElementById('ck-cidade').value+
    '/'+document.getElementById('ck-uf').value+
    ' CEP '+document.getElementById('ck-cep').value;
  var msg = 'Ola! Quero finalizar meu pedido na MAJU:\n\n';
  c.forEach(function(i){ msg += '- '+i.nome+' (Tam.'+i.tamanho+') x'+i.qty+' = R$ '+(i.preco*i.qty).toFixed(2).replace('.',',')+'\n'; });
  msg += '\nTotal: R$ '+cartTotal(c).toFixed(2).replace('.',',');
  msg += '\n\nNome: '+nome;
  if(fone) msg += '\nWhatsApp: '+fone;
  msg += '\nEndereco: '+addr;
  window.open('https://wa.me/5521964824525?text='+encodeURIComponent(msg), '_blank');
}

function cartClear(){
  cartSave([]);
  cartRender();
}

// ── SUPABASE INTEGRATION (fetch direto) ──────────────────────────
(async function(){
  const URL  = 'https://xrrijeleceivksttleiz.supabase.co/rest/v1';
  const KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycmlqZWxlY2VpdmtzdHRsZWl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NTQ4NDYsImV4cCI6MjA5MjAzMDg0Nn0.yTtmRpg3EandIvpjZSW5V8i2cK5CfBhjqrywRrJ9UjI';
  const HDR  = { 'apikey': KEY, 'Authorization': 'Bearer ' + KEY };

  try {
    const [rP, rV] = await Promise.all([
      fetch(URL + '/produtos?select=*&ativo=eq.true&order=created_at.desc', { headers: HDR }),
      fetch(URL + '/variacoes?select=*', { headers: HDR })
    ]);

    if (!rP.ok) { return; }

    const produtos  = await rP.json();
    const variacoes = rV.ok ? await rV.json() : [];
    if (!produtos.length) return;

    window.data = produtos.map(function(p){
      return Object.assign({}, p, {
        variacoes: variacoes.filter(function(v){ return v.produto_id === p.id; })
      });
    });

    data.forEach(function(p){ PRODS_MAP[p.id] = p; });

    console.log('Produtos carregados:', data.length);

    function fmt(v){ return 'R$ ' + Number(v).toFixed(2).replace('.',','); }

    function buildCard(p){
      var szs = '';
      p.variacoes.filter(function(v){ return v.quantidade > 0; }).forEach(function(v){
        szs += '<span class="sz" onclick="selSz(this)">' + v.tamanho + '</span>';
      });
      var badge = '';
      if(p.badge){
        var bMap = {novo:'b-new', sale:'b-sale', plus:'b-plus'};
        var bLbl = {novo:'Novo', sale:'Sale', plus:'Plus Size'};
        badge = '<span class="p-badge ' + (bMap[p.badge]||'b-new') + '">' + (bLbl[p.badge]||p.badge) + '</span>';
      }
      var disc = '';
      if(p.preco_original && p.preco_original > p.preco){
        var pct = Math.round((1 - p.preco/p.preco_original)*100);
        disc = '<span class="p-old">' + fmt(p.preco_original) + '</span>';
        disc += '<span class="p-disc">-' + pct + '%</span>';
      }
      var imgHtml = p.imagem_url
        ? '<img src="' + p.imagem_url + '" alt="' + p.nome + '" loading="lazy">'
        : '<img src="https://placehold.co/400x533/EFE2D2/4A2C18?text=MAJU" alt="' + p.nome + '">';

      var html = '<div class="p-card rv">';
      html += '<div class="p-wrap" onclick="openQuickView(\'' + p.id + '\')" style="cursor:pointer;">' + imgHtml + badge;
      html += '<button class="p-wish" onclick="this.classList.toggle(\'on\');this.textContent=this.classList.contains(\'on\')?\'♥\':\'♡\'">♡</button>';
      html += '<div class="p-ov">';
      html += '<div class="sz-row">' + szs + '</div>';
      html += '<button class="add-btn" data-pid="' + p.id + '" onclick="addToCartBtn(this)">Adicionar ao carrinho</button>';
      html += '</div></div>';
      html += '<div class="p-info">';
      html += '<p class="p-cat">' + (p.categoria||'') + '</p>';
      html += '<p class="p-name">' + p.nome + '</p>';
      html += '<div class="p-price"><span class="p-new">' + fmt(p.preco) + '</span>' + disc + '</div>';
      html += '</div></div>';
      return html;
    }

    var g1 = document.getElementById('grid-destaques');
    var g2 = document.getElementById('grid-lancamentos');
    
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

    if(g1) g1.innerHTML = data.slice(0,8).map(buildCard).join('');
    if(g2) g2.innerHTML = data.slice(4,12).map(buildCard).join('');

    document.querySelectorAll('#grid-destaques .rv, #grid-lancamentos .rv').forEach(function(el){
      el.classList.add('vis');
    });

    console.log('Produtos exibidos no site!');
  } catch(e){ console.warn('Supabase erro:', e.message); }
})();

function selSz(el){
  var row = el.closest('.sz-row');
  row.querySelectorAll('.sz').forEach(function(s){ s.classList.remove('sel'); s.style.cssText=''; });
  el.classList.add('sel');
  el.style.background = 'var(--white)';
  el.style.color = 'var(--brown)';
}

function addToCartBtn(btn){
  var pid = btn.dataset.pid;
  var prod = PRODS_MAP[pid];
  if(!prod){ return; }
  var card = btn.closest('.p-card');
  var selEl = card ? card.querySelector('.sz.sel') : null;
  if(!selEl){
    var szRow = card ? card.querySelector('.sz-row') : null;
    if(szRow){ szRow.classList.add('sz-required'); setTimeout(function(){ szRow.classList.remove('sz-required'); }, 400); }
    btn.textContent = 'Selecione o tamanho!';
    setTimeout(function(){ btn.textContent = 'Adicionar ao carrinho'; }, 2000);
    return;
  }
  cartAdd(prod, selEl.textContent.trim());
  btn.textContent = 'Adicionado!';
  setTimeout(function(){ btn.textContent = 'Adicionar ao carrinho'; }, 2000);
}

cartRender();
// ─────────────────────────────────────────────────────────────────

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
  
  let html = `
    <img class="qv-img" src="${prod.imagem_url || 'https://placehold.co/400x533/EFE2D2/4A2C18?text=MAJU'}" alt="${prod.nome}">
    <div class="qv-info">
      <p class="p-cat">${prod.categoria || ''}</p>
      <h2 style="font-family:'Cormorant Garamond',serif;font-size:28px;color:var(--brown);margin-bottom:10px;">${prod.nome}</h2>
      <div class="p-price" style="margin-bottom:20px;"><span class="p-new">R$ ${Number(prod.preco).toFixed(2).replace('.',',')}</span></div>
      <p style="font-size:13px;line-height:1.7;color:var(--muted);margin-bottom:24px;">${prod.descricao || 'Peça exclusiva MAJU, desenvolvida para proporcionar conforto e elegância em todas as ocasiões.'}</p>
      
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;">
        <p style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:var(--brown);">Tamanho</p>
        <button onclick="openSizeGuide()" style="background:none;border:none;color:var(--terra);font-size:11px;text-decoration:underline;cursor:pointer;">Guia de Tamanhos</button>
      </div>
      <div class="sz-row" style="margin-bottom:24px; transform:none;">${szs}</div>
      
      <button class="btn btn-t btn-full add-btn" style="transform:none;" data-pid="${prod.id}" onclick="addToCartBtn(this)"><span>Adicionar ao carrinho</span></button>
    </div>
  `;
  
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


// --- COLLECTION CAROUSEL ---
function openCollectionCarousel(title, filterKey) {
  document.getElementById('carouselTitle').innerHTML = 'Coleção <em style="color:var(--terra);font-style:italic;">' + title + '</em>';
  
  let filtered = data;
  if(filterKey === 'Plus Size') {
    filtered = data.filter(p => p.badge === 'plus' || p.categoria === 'Plus Size');
  } else if (filterKey === 'Lançamentos') {
    filtered = data.slice(0, 10); // Show top 10 newest items
  }
  
  const track = document.getElementById('carouselTrack');
  if (!filtered || filtered.length === 0) {
     track.innerHTML = '<div style="padding:40px; text-align:center; color:var(--muted); width:100%;">Nenhum produto encontrado nesta coleção.</div>';
  } else {
     track.innerHTML = filtered.map(buildCard).join('');
     // add "vis" class so hover effects and styles apply properly without scroll observing
     track.querySelectorAll('.rv').forEach(el => el.classList.add('vis'));
  }
  
  document.getElementById('carouselOv').classList.add('show');
  document.body.style.overflow = 'hidden'; // prevent background scrolling
}

function closeCollectionCarousel() {
  document.getElementById('carouselOv').classList.remove('show');
  document.body.style.overflow = '';
}

function scrollCarousel(dir) {
  const track = document.getElementById('carouselTrack');
  const cardWidth = track.querySelector('.p-card').offsetWidth + 20; // width + gap
  track.scrollBy({ left: dir * cardWidth * 2, behavior: 'smooth' });
}
