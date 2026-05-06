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

// Replace "Ver tudo" link for Novidades
const oldSeeAll = '<a href="https://wa.me/5521964824525?text=Quero ver as novidades! 🌸" class="see-all">Ver tudo</a>';
const newSeeAll = '<button class="see-all" style="background:none;border:none;cursor:pointer;font-family:inherit;font-size:inherit;padding:0;" onclick="openCollectionCarousel(\'Novidades\', \'Lançamentos\')">Ver tudo</button>';
index = index.replace(oldSeeAll, newSeeAll);

// Replace "Ver coleção Plus" link
const oldPlus = '<a href="https://wa.me/5521964824525?text=Quero ver as peças Plus Size! 🌸" class="btn btn-t"><span>Ver coleção Plus</span></a>';
const newPlus = '<button class="btn btn-t" onclick="openCollectionCarousel(\'Plus Size\', \'Plus Size\')"><span>Ver coleção Plus</span></button>';
index = index.replace(oldPlus, newPlus);

// Add Carousel Modal HTML
const carouselHtml = `
<!-- CAROUSEL MODAL -->
<div class="carousel-ov" id="carouselOv">
  <div class="carousel-modal">
    <div class="carousel-head">
      <h3 id="carouselTitle" style="font-family:'Cormorant Garamond',serif;font-size:32px;color:var(--brown);font-weight:300;">Coleção</h3>
      <button class="carousel-close" onclick="closeCollectionCarousel()">✕</button>
    </div>
    <div class="carousel-track-wrap">
      <button class="carousel-nav prev" onclick="scrollCarousel(-1)">‹</button>
      <div class="carousel-track" id="carouselTrack">
        <!-- Injetado dinamicamente -->
      </div>
      <button class="carousel-nav next" onclick="scrollCarousel(1)">›</button>
    </div>
  </div>
</div>
`;

// Insert before the scripts
index = index.replace('<script src="script.js" defer></script>', carouselHtml + '\n<script src="script.js" defer></script>');
fs.writeFileSync(indexPath, index, 'utf8');

// --- 2. STYLE.CSS EDITS ---
const newCss = `
/* CAROUSEL MODAL */
.carousel-ov { position:fixed; inset:0; background:rgba(74,44,24,.7); z-index:1000; opacity:0; pointer-events:none; transition:opacity .4s; display:flex; align-items:center; justify-content:center; padding:20px; }
.carousel-ov.show { opacity:1; pointer-events:all; }
.carousel-modal { background:var(--cream); width:100%; max-width:1100px; border-radius:16px; padding:30px; position:relative; transform:scale(0.95); transition:transform .4s; box-shadow:0 20px 60px var(--shadow); }
.carousel-ov.show .carousel-modal { transform:scale(1); }
.carousel-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; border-bottom:1px solid var(--cream3); padding-bottom:16px; }
.carousel-close { background:var(--white); border:none; width:36px; height:36px; border-radius:50%; font-size:18px; cursor:pointer; color:var(--brown); display:flex; align-items:center; justify-content:center; transition:background .3s; }
.carousel-close:hover { background:var(--terra); color:var(--white); }
.carousel-track-wrap { position:relative; display:flex; align-items:center; }
.carousel-track { display:flex; gap:20px; overflow-x:auto; scroll-behavior:smooth; scroll-snap-type:x mandatory; padding-bottom:16px; width:100%; -ms-overflow-style:none; scrollbar-width:none; }
.carousel-track::-webkit-scrollbar { display:none; }
.carousel-track .p-card { min-width:260px; scroll-snap-align:start; flex-shrink:0; background:var(--white); }
.carousel-nav { position:absolute; top:50%; transform:translateY(-50%); width:48px; height:48px; background:var(--white); border:1px solid var(--cream3); border-radius:50%; box-shadow:0 8px 24px var(--shadow); z-index:2; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:28px; color:var(--brown); transition:all .3s; }
.carousel-nav:hover { background:var(--terra); color:var(--white); border-color:var(--terra); }
.carousel-nav.prev { left:-24px; }
.carousel-nav.next { right:-24px; }

@media(max-width:768px) {
  .carousel-modal { padding:20px; }
  .carousel-nav { display:none; } /* Hide arrows on mobile, rely on horizontal swipe */
  .carousel-track .p-card { min-width:75vw; }
}
`;
fs.appendFileSync(stylePath, '\n' + newCss, 'utf8');

// --- 3. SCRIPT.JS EDITS ---
const newScript = `
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
`;
fs.appendFileSync(scriptPath, '\n' + newScript, 'utf8');

console.log('Carousel added successfully!');
