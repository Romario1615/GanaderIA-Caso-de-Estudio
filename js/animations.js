/* ══════════════ ANIME.JS SLIDE ANIMATIONS ══════════════ */

/* Drive a canvas draw function from 0→1 with easing */
function animateChart(drawFn, duration) {
  if (typeof anime === 'undefined') { drawFn(1); return; }
  const obj = { p: 0 };
  anime({
    targets: obj, p: 1,
    duration: duration || 1100,
    easing: 'easeOutCubic',
    update: () => drawFn(obj.p)
  });
}

/* Shared entrance helper: set elements invisible then animate in */
function staggerIn(targets, options) {
  if (typeof anime === 'undefined') return;
  const els = typeof targets === 'string' ? document.querySelectorAll(targets) : targets;
  if (!els || !els.length) return;
  anime.set(els, { opacity: 0, translateY: options.fromY || 24, translateX: options.fromX || 0 });
  anime({
    targets: els,
    opacity: [0, 1],
    translateY: [options.fromY || 24, 0],
    translateX: [options.fromX || 0, 0],
    duration: options.duration || 520,
    delay: anime.stagger(options.stagger || 80, { start: options.start || 0 }),
    easing: options.easing || 'easeOutQuart'
  });
}

function fadeIn(targets, delay) {
  if (typeof anime === 'undefined') return;
  const els = typeof targets === 'string' ? document.querySelectorAll(targets) : targets;
  if (!els || !els.length) return;
  anime.set(els, { opacity: 0 });
  anime({ targets: els, opacity: 1, duration: 500, delay: delay || 0, easing: 'easeOutQuad' });
}

/* ══ Entry point ══ */
function runSlideAnimation(idx) {
  if (typeof anime === 'undefined') return;
  switch (idx) {
    case 0:  animS1();  break;
    case 1:  animS2();  break;
    case 2:  animS3();  break;
    case 3:  animS4();  break;
    case 4:  animS5();  break;
    case 5:  animS6();  break;
    case 6:  animS7();  break;
    case 7:  animS8();  break;
    case 8:  animS9();  break;
    case 9:  animS10(); break;
    case 10: animS11(); break;
    case 11: animS12(); break;
  }
}

/* ── S1 · Portada ── */
function animS1() {
  staggerIn('#s1 .cv-badge',   { fromY: -18, duration: 420, start: 0 });
  staggerIn('#s1 .cv-title',   { fromY: 28,  duration: 600, start: 120 });
  staggerIn('#s1 .cv-line',    { fromY: 0,   duration: 300, start: 300 });
  staggerIn('#s1 .cv-sub',     { fromY: 20,  duration: 520, start: 350 });
  staggerIn('#s1 .cv-context', { fromY: 16,  duration: 500, start: 480 });
  staggerIn('#s1 .cv-meta span', { fromY: 10, duration: 400, stagger: 70, start: 600 });
}

/* ── S2 · Problema ── */
function animS2() {
  staggerIn('#s2 .stat-chip', { fromX: -20, fromY: 0, duration: 380, stagger: 55, start: 0 });
  staggerIn('#s2 .prob-card', { fromY: 30, duration: 500, stagger: 90, start: 200 });
}

/* ── S3 · Solución ── */
function animS3() {
  staggerIn('#s3 .sol-intro', { fromY: 20, duration: 480, start: 0 });
  staggerIn('#s3 .sol-diff',  { fromY: 16, duration: 380, start: 150 });
  staggerIn('#s3 .pillar',    { fromY: 28, duration: 540, stagger: 110, start: 260 });
}

/* ── S4 · Datos ── */
function animS4() {
  fadeIn('#s4 .tbl-wrap', 0);
  anime({ targets: '#s4 .tbl-wrap', opacity: [0, 1], translateY: [16, 0], duration: 500, easing: 'easeOutQuart' });
  staggerIn('#s4 .area-card', { fromY: 24, duration: 480, stagger: 80, start: 200 });
}

/* ── S5 · Dashboard ── */
function animS5() {
  staggerIn('#s5 .dash-kpi-card', { fromY: 20, duration: 420, stagger: 70, start: 0 });
  staggerIn('#s5 .chart-card',    { fromY: 28, duration: 500, stagger: 90, start: 280 });
  /* Animate all 5 charts after cards appear */
  setTimeout(() => {
    animateChart(drawBar,     1000);
    animateChart(drawDonut,   1100);
    animateChart(drawPieArea, 950);
    animateChart(drawLine,    1200);
    animateChart(drawStack,   1050);
  }, 600);
}

/* ── S6 · Arquitectura ── */
function animS6() {
  staggerIn('#s6 .arch-card', { fromY: 24, duration: 480, stagger: 100, start: 100 });
}

/* ── S7 · ¿Por qué? ── */
function animS7() {
  const rows = document.querySelectorAll('#s7 .why-table tbody tr');
  staggerIn(rows, { fromX: -20, fromY: 0, duration: 380, stagger: 55, start: 0 });
  setTimeout(() => animateChart(drawWhyScore, 1000), 400);
}

/* ── S8 · Flujo ── */
function animS8() {
  if (typeof anime === 'undefined') return;
  /* Interleave steps and connectors */
  const steps = document.querySelectorAll('#s8 .flow-step');
  const conns = document.querySelectorAll('#s8 .flow-connector');
  const tl = anime.timeline({ easing: 'easeOutQuart' });
  steps.forEach((el, i) => {
    anime.set(el, { opacity: 0, translateX: -24 });
    tl.add({ targets: el, opacity: [0, 1], translateX: [-24, 0], duration: 380 }, i * 160);
    if (conns[i]) {
      anime.set(conns[i], { opacity: 0, scaleY: 0, transformOrigin: 'top center' });
      tl.add({ targets: conns[i], opacity: [0, 1], scaleY: [0, 1], duration: 220 }, i * 160 + 300);
    }
  });
}

/* ── S9 · Demo / Chat ── */
function animS9() {
  if (typeof anime === 'undefined') return;
  const cols = document.querySelectorAll('#s9 .chat-col');
  if (cols[0]) { anime.set(cols[0], { opacity: 0, translateX: -30 }); anime({ targets: cols[0], opacity: 1, translateX: 0, duration: 500, easing: 'easeOutQuart' }); }
  if (cols[1]) { anime.set(cols[1], { opacity: 0, translateX:  30 }); anime({ targets: cols[1], opacity: 1, translateX: 0, duration: 500, easing: 'easeOutQuart', delay: 80 }); }
  const msgs = document.querySelectorAll('#s9 .msg');
  staggerIn(msgs, { fromY: 12, duration: 360, stagger: 60, start: 300 });
}

/* ── S10 · Costos ── */
function animS10() {
  staggerIn('#s10 .infra-card',     { fromY: 20, duration: 420, stagger: 75, start: 0 });
  staggerIn('#s10 .cost-total-card', { fromY: 20, duration: 420, start: 300 });
  const rows = document.querySelectorAll('#s10 .tier-table tbody tr');
  staggerIn(rows, { fromX: -16, fromY: 0, duration: 340, stagger: 50, start: 350 });
  setTimeout(() => {
    animateChart(drawCostTotal,   1050);
    animateChart(drawCostPerUser, 950);
  }, 600);
}

/* ── S11 · Scrum ── */
function animS11() {
  staggerIn('#s11 .sprint-card',    { fromY: 24, duration: 480, stagger: 100, start: 0 });
  staggerIn('#s11 .scrum-role-card', { fromY: 20, duration: 420, stagger: 80,  start: 350 });
  staggerIn('#s11 .scrum-ceremony', { fromY: 16, duration: 360, stagger: 65,  start: 600 });
  staggerIn('#s11 .sprint-timeline', { fromY: 18, duration: 420, start: 750 });
}

/* ── S12 · Impacto ── */
function animS12() {
  staggerIn('#s12 .metric-card',   { fromY: 22, duration: 460, stagger: 85, start: 0 });
  staggerIn('#s12 .roadmap-item',  { fromX: -16, fromY: 0, duration: 360, stagger: 60, start: 300 });
  setTimeout(() => animateChart(drawImpactChart, 1200), 500);
}
