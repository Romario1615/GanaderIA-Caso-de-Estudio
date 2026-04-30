/* ══════════════ NAV DATA ══════════════ */
const NAV = [
  { ico: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',            lbl: 'Inicio',       ttl: 'Portada' },
  { ico: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',                lbl: 'Problema',     ttl: '¿Cuál es el problema?' },
  { ico: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',              lbl: 'Solución',     ttl: 'El agente que educa' },
  { ico: 'M4 6h16M4 10h16M4 14h16M4 18h16',                             lbl: 'Datos',        ttl: 'Qué datos levantamos' },
  { ico: 'M18 20V10M12 20V4M6 20v-6',                                    lbl: 'Gráficos',     ttl: 'Dashboard del hato' },
  { ico: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z', lbl: 'Arquitectura', ttl: 'Stack tecnológico' },
  { ico: 'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18', lbl: '¿Por qué?', ttl: 'Decisiones técnicas' },
  { ico: 'M5 12h14M12 5l7 7-7 7',                                        lbl: 'Flujo',        ttl: 'Flujo + comunicación' },
  { ico: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', lbl: 'Demo',     ttl: 'Modo educativo' },
  { ico: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',  lbl: 'Costos',      ttl: 'Costos en producción' },
  { ico: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2', lbl: 'Metodología', ttl: 'Scrum ágil' },
  { ico: 'M23 6L13.5 15.5 8.5 10.5 1 18M17 6h6v6',                      lbl: 'Impacto',      ttl: 'Resultados esperados' },
];

/* ══════════════ STATE ══════════════ */
const slides   = document.querySelectorAll('.slide');
const TOTAL    = slides.length;
let cur        = 0;
let panelOpen  = true;
let metricsOk  = false;
let chartsOk   = false;
let costOk     = false;
let whyOk      = false;
let impactOk   = false;

const navList  = document.getElementById('navList');
const navCtr   = document.getElementById('navCtr');
const barFill  = document.getElementById('barFill');
const navPanel = document.getElementById('navPanel');
const navTog   = document.getElementById('navTog');
navTog.addEventListener('click', togglePanel);

/* Auto-close panel on small screens */
if (window.innerWidth <= 860) {
  panelOpen = false;
  navPanel.classList.add('closed');
  navTog.classList.add('closed');
  navTog.textContent = '❮';
  slides.forEach(s => s.classList.add('poff'));
}

/* ══════════════ BUILD NAV ITEMS ══════════════ */
NAV.forEach((d, i) => {
  const el = document.createElement('div');
  el.className = 'nav-item' + (i === 0 ? ' active' : '');
  el.innerHTML =
    `<div class="nav-num">${i + 1}</div>` +
    `<div class="nav-info"><div class="nav-lbl">${d.lbl}</div><div class="nav-ttl">${d.ttl}</div></div>`;
  el.addEventListener('click', () => goTo(i));
  navList.appendChild(el);
});

/* ══════════════ NAVIGATION ══════════════ */
function goTo(idx) {
  slides[cur].classList.remove('active', 'fin');
  slides[cur].style.display = 'none';
  cur = idx;
  const s = slides[cur];
  s.style.display = 'flex';
  s.offsetHeight; /* force reflow for animation */
  s.classList.add('active', 'fin');
  if (typeof runSlideAnimation === 'function') runSlideAnimation(cur);
  navList.querySelectorAll('.nav-item').forEach((el, i) => el.classList.toggle('active', i === cur));
  const active = navList.querySelector('.nav-item.active');
  if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  navCtr.textContent  = 'Slide ' + (cur + 1) + ' de ' + TOTAL;
  barFill.style.width = ((cur + 1) / TOTAL * 100) + '%';
  if (cur === 4)  initChartRO('charts');
  if (cur === 5)  { setTimeout(() => { if (window.mermaid) window.mermaid.run({ nodes: document.querySelectorAll('.mermaid') }); }, 150); }
  if (cur === 6)  initChartRO('why');
  if (cur === 9)  initChartRO('cost');
  if (cur === 11 && !metricsOk) { setTimeout(animMetrics, 180); metricsOk = true; }
  if (cur === 11) initChartRO('impact');
}

function navigate(dir) { const n = cur + dir; if (n >= 0 && n < TOTAL) goTo(n); }

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') navigate(1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   navigate(-1);
});

slides.forEach((s, i) => { if (i !== 0) s.style.display = 'none'; });

/* ══════════════ PANEL TOGGLE ══════════════ */
function togglePanel() {
  panelOpen = !panelOpen;
  navPanel.classList.toggle('closed', !panelOpen);
  navTog.classList.toggle('closed', !panelOpen);
  navTog.textContent = panelOpen ? '❯' : '❮';
  slides.forEach(s => s.classList.toggle('poff', !panelOpen));
  if (chartsOk)  setTimeout(drawAllCharts, 320);
  if (costOk)    setTimeout(drawCostCharts, 320);
  if (whyOk)     setTimeout(drawWhyScore, 320);
  if (impactOk)  setTimeout(drawImpactChart, 320);
}

/* ══════════════ RESIZE OBSERVER (chart init) ══════════════ */
let roCharts = null, roCost = null, roTimer = null;

let roWhy = null, roImpact = null;

function initChartRO(which) {
  if (which === 'charts') {
    const grid = document.querySelector('.charts-grid');
    if (!grid || roCharts) {
      if (roCharts) { requestAnimationFrame(() => requestAnimationFrame(drawAllCharts)); }
      return;
    }
    roCharts = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width < 10 || height < 10) return;
      clearTimeout(roTimer);
      roTimer = setTimeout(() => { drawAllCharts(); chartsOk = true; }, 30);
    });
    roCharts.observe(grid);
  } else if (which === 'cost') {
    const wrap = document.querySelector('.cost-canvas-wrap');
    if (!wrap || roCost) {
      if (roCost) { requestAnimationFrame(() => requestAnimationFrame(drawCostCharts)); }
      return;
    }
    roCost = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width < 10 || height < 10) return;
      clearTimeout(roTimer);
      roTimer = setTimeout(() => { drawCostCharts(); costOk = true; }, 30);
    });
    roCost.observe(wrap);
  } else if (which === 'why') {
    const wrap = document.querySelector('.why-score-bar');
    if (!wrap || roWhy) {
      if (roWhy) { requestAnimationFrame(() => requestAnimationFrame(drawWhyScore)); }
      return;
    }
    roWhy = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width < 10 || height < 10) return;
      clearTimeout(roTimer);
      roTimer = setTimeout(() => { drawWhyScore(); whyOk = true; }, 30);
    });
    roWhy.observe(wrap);
  } else if (which === 'impact') {
    const wrap = document.querySelector('.impact-proj-wrap');
    if (!wrap || roImpact) {
      if (roImpact) { requestAnimationFrame(() => requestAnimationFrame(drawImpactChart)); }
      return;
    }
    roImpact = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width < 10 || height < 10) return;
      clearTimeout(roTimer);
      roTimer = setTimeout(() => { drawImpactChart(); impactOk = true; }, 30);
    });
    roImpact.observe(wrap);
  }
}

/* ══════════════ ANIMATED METRICS ══════════════ */
function animMetrics() {
  animN('m1', 0, 75, 900, v => v + '%');
  animN('m2', 0, 5,  700, v => '< ' + v + 's');
  animN('m3', 0, 7,  600, v => '24/' + v);
  animN('m4', 0, 40, 950, v => '↓ ' + v + '%');
}

function animN(id, from, to, dur, fmt) {
  const el = document.getElementById(id), t0 = performance.now();
  (function step(now) {
    const t = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - t, 3);
    el.textContent = fmt(Math.round(from + (to - from) * e));
    if (t < 1) requestAnimationFrame(step);
  })(t0);
}

/* ══════════════ WINDOW RESIZE ══════════════ */
let rsTimer;
window.addEventListener('resize', () => {
  clearTimeout(rsTimer);
  rsTimer = setTimeout(() => {
    if (chartsOk)  drawAllCharts();
    if (costOk)    drawCostCharts();
    if (whyOk)     drawWhyScore();
    if (impactOk)  drawImpactChart();
    if (window.innerWidth <= 860 && panelOpen) {
      panelOpen = false;
      navPanel.classList.add('closed');
      navTog.classList.add('closed');
      navTog.textContent = '❮';
      slides.forEach(s => s.classList.add('poff'));
    }
  }, 150);
});
