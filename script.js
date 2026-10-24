const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* Свет, который следует за курсором на кнопках */
$$('.link').forEach((el) => {
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', e.clientX - r.left + 'px');
    el.style.setProperty('--my', e.clientY - r.top + 'px');
  });
});

/* Лёгкий 3D-наклон логотипа за курсором (только с мышью) */
const logo = $('.logo');
if (logo && matchMedia('(hover: hover)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  addEventListener('pointermove', (e) => {
    const x = (e.clientX / innerWidth - 0.5) * 2;
    const y = (e.clientY / innerHeight - 0.5) * 2;
    logo.style.transform = `perspective(600px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg)`;
  });
  document.addEventListener('pointerleave', () => { logo.style.transform = ''; });
}

/* Слои: Обо мне и Галерея */
const about = $('#about');
const gallery = $('#gallery');
const viewer = $('#viewer');

function openLayer(el) {
  el.classList.add('open');
  el.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lock');
}
function closeLayer(el) {
  el.classList.remove('open');
  el.setAttribute('aria-hidden', 'true');
  if (!$('.layer.open')) document.body.classList.remove('lock');
}

$$('[data-open]').forEach((b) => b.addEventListener('click', () => {
  openLayer(b.dataset.open === 'about' ? about : gallery);
}));
$$('[data-close]').forEach((b) => b.addEventListener('click', () => closeLayer(b.closest('.layer'))));

/* Галерея */
const WORKS = (window.WORKS || []).slice();
const grid = $('#grid');
const chips = $('#chips');
const empty = $('#empty');
let current = 'Все';
let list = WORKS;
let idx = 0;

const ratioNum = (r) => {
  const [w, h] = String(r || '16/9').split('/').map(Number);
  return h ? w / h : 16 / 9;
};

const PLAY = '<svg viewBox="0 0 24 24" fill="#111"><path d="M7 4.5v15l13-7.5z"/></svg>';

function buildChips() {
  const cats = ['Все', ...new Set(WORKS.map((w) => w.category).filter(Boolean))];
  chips.innerHTML = '';
  if (cats.length < 3 || WORKS.length <= 8) return;
  cats.forEach((c) => {
    const b = document.createElement('button');
    b.className = 'chip' + (c === current ? ' on' : '');
    b.type = 'button';
    b.textContent = c;
    b.addEventListener('click', () => { current = c; buildChips(); buildGrid(); });
    chips.appendChild(b);
  });
}

function posterOf(w) {
  if (w.poster) return `url('${w.poster}') center/cover`;
  if (w.type === 'image' && w.src) return `url('${w.src}') center/cover`;
  if (w.type === 'youtube') {
    const id = ytId(w.src);
    if (id) return `url('https://i.ytimg.com/vi/${id}/hqdefault.jpg') center/cover`;
  }
  return w.bg || 'linear-gradient(160deg,#f4f4f2,#d9d9d4)';
}

function buildGrid() {
  list = current === 'Все' ? WORKS : WORKS.filter((w) => w.category === current);
  grid.innerHTML = '';
  empty.hidden = list.length > 0;
  list.forEach((w, i) => {
    const a = document.createElement('button');
    a.type = 'button';
    a.className = 'work' + (ratioNum(w.ratio) > 1.5 ? ' wide' : '');
    a.style.setProperty('--n', i);
    a.innerHTML = `
      <div class="thumb" style="--r:${w.ratio || '16/9'};background:${posterOf(w)}">
        ${w.type === 'image' ? '' : `<span class="play">${PLAY}</span>`}
      </div>
      <b></b><small></small>`;
    $('b', a).textContent = w.title || '';
    $('small', a).textContent = w.category || '';
    a.addEventListener('click', () => openViewer(i));
    grid.appendChild(a);
    ro.observe(a);
  });
  requestAnimationFrame(() => $$('.work', grid).forEach(span));
}

/* Плотная раскладка карточек: считаем, сколько строк занимает каждая */
function span(el) {
  const gap = matchMedia('(max-width: 640px)').matches ? 12 : 16;
  el.style.gridRowEnd = `span ${Math.ceil((el.offsetHeight + gap) / 8)}`;
}
const ro = new ResizeObserver((entries) => entries.forEach((e) => span(e.target)));

function ytId(s = '') {
  const m = String(s).match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : (/^[\w-]{11}$/.test(s) ? s : '');
}

/* Просмотр */
const stage = $('#vstage');
const info = $('#vinfo');
const prev = $('#prev');
const next = $('#next');

function stopMedia() {
  $$('video', stage).forEach((v) => { v.pause(); v.removeAttribute('src'); v.load(); });
  stage.innerHTML = '';
}

function renderViewer(dir = 0) {
  const w = list[idx];
  if (!w) return;
  stopMedia();
  const r = w.ratio || '16/9';
  const frame = document.createElement('div');
  frame.className = 'frame';
  frame.style.setProperty('--r', r);
  frame.style.setProperty('--rn', ratioNum(r));
  frame.style.setProperty('--dir', dir >= 0 ? '40px' : '-40px');

  if (w.type === 'video' && w.src) {
    const v = document.createElement('video');
    v.src = w.src; v.controls = true; v.playsInline = true; v.preload = 'metadata';
    if (w.poster) v.poster = w.poster;
    v.setAttribute('controlsList', 'nodownload');
    frame.appendChild(v);
  } else if (w.type === 'youtube' && ytId(w.src)) {
    const f = document.createElement('iframe');
    f.src = `https://www.youtube.com/embed/${ytId(w.src)}?rel=0&modestbranding=1&playsinline=1`;
    f.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    frame.appendChild(f);
  } else if (w.type === 'image' && w.src) {
    const im = document.createElement('img');
    im.src = w.src; im.alt = w.title || '';
    frame.appendChild(im);
  } else {
    frame.style.background = w.bg || '#eee';
    frame.innerHTML = '<div class="demo"><div><img src="logo.svg" alt="">Здесь будет ваша работа<br>Замените демо-карточку в файле works.js</div></div>';
  }
  stage.appendChild(frame);

  info.innerHTML = '<b></b><span></span><i></i><a class="more" target="_blank" rel="noopener">Увидеть больше работ<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg></a>';
  $('b', info).textContent = w.title || '';
  $('span', info).textContent = w.caption || '';
  $('span', info).hidden = !w.caption;
  $('i', info).textContent = `${idx + 1} / ${list.length}` + (w.compressed ? ' · видео сжато по качеству для оптимизации' : '');
  $('.more', info).href = window.PORTFOLIO_URL || 'https://t.me/prtfl_ners';
  prev.disabled = idx === 0;
  next.disabled = idx === list.length - 1;
}

function openViewer(i) {
  idx = i;
  renderViewer();
  viewer.classList.add('open');
  viewer.setAttribute('aria-hidden', 'false');
}
function closeViewer() {
  viewer.classList.remove('open');
  viewer.setAttribute('aria-hidden', 'true');
  setTimeout(() => { if (!viewer.classList.contains('open')) stopMedia(); }, 450);
}
function go(d) {
  const n = idx + d;
  if (n < 0 || n >= list.length) return;
  idx = n;
  renderViewer(d);
}

prev.addEventListener('click', () => go(-1));
next.addEventListener('click', () => go(1));
$$('[data-vclose]').forEach((b) => b.addEventListener('click', closeViewer));

/* Клавиатура */
addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (viewer.classList.contains('open')) closeViewer();
    else if (gallery.classList.contains('open')) closeLayer(gallery);
    else if (about.classList.contains('open')) closeLayer(about);
  } else if (viewer.classList.contains('open')) {
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  }
});

/* Свайп на телефоне */
let sx = 0, sy = 0;
viewer.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
viewer.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - sx;
  const dy = e.changedTouches[0].clientY - sy;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  else if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.5) closeViewer();
}, { passive: true });

buildChips();
buildGrid();
