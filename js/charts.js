/* ══════════════ CANVAS UTILITIES ══════════════ */
function isLight() { return document.body.classList.contains('light-mode'); }

function setupCanvas(id) {
  const c = document.getElementById(id);
  if (!c || !c.parentElement) return null;
  const p = c.parentElement;
  const r = p.getBoundingClientRect();
  const w = Math.max(Math.floor(r.width) - 18, 60);
  const h = Math.max(Math.floor(r.height) - 30, 40);
  if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
  return { c, ctx: c.getContext('2d'), W: w, H: h };
}

/* ══════════════ S5 — DASHBOARD CHARTS ══════════════ */
function drawAllCharts() { drawBar(); drawDonut(); drawPieArea(); drawLine(); drawStack(); }

function drawBar(progress = 1) {
  const pack = setupCanvas('cvBar'); if (!pack) return;
  const { ctx, W, H } = pack;
  const cows = [
    { id: 'H-012', v: 33.7 }, { id: 'C-103', v: 31.0 }, { id: 'F-034', v: 29.1 },
    { id: 'A-042', v: 28.5 }, { id: 'E-091', v: 26.4 }, { id: 'D-056', v: 22.8 },
    { id: 'G-078', v: 18.5 }, { id: 'B-017', v: 14.2 }
  ];
  const lm = isLight();
  const MAX = 40, pl = 54, pr = 68, pt = 14, pb = 22;
  const cW = W - pl - pr, cH = H - pt - pb, slot = cH / cows.length, barH = slot * .56;
  ctx.clearRect(0, 0, W, H);
  for (let t = 0; t <= 4; t++) {
    const x = pl + (cW / 4) * t;
    ctx.strokeStyle = lm ? '#c8dece' : '#2a4231'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, pt); ctx.lineTo(x, H - pb); ctx.stroke();
    ctx.fillStyle = lm ? '#3a6b40' : '#9db8a2'; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
    ctx.fillText((MAX / 4 * t) + 'L', x, H - pb + 12);
  }
  ctx.strokeStyle = lm ? '#b0d4b4' : '#35513d'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(pl, H - pb); ctx.lineTo(W - pr, H - pb); ctx.stroke();
  const thX = pl + (22 / MAX) * cW;
  ctx.strokeStyle = 'rgba(239,83,80,.68)'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
  ctx.beginPath(); ctx.moveTo(thX, pt); ctx.lineTo(thX, H - pb); ctx.stroke();
  ctx.setLineDash([]); ctx.fillStyle = lm ? '#c62828' : '#ffc4c4';
  ctx.font = '9px system-ui'; ctx.textAlign = 'center'; ctx.fillText('mín 22L', thX, pt - 1);
  cows.forEach((cow, i) => {
    const y = pt + slot * i + (slot - barH) / 2, bW = (cow.v / MAX) * cW * progress, alert = cow.v < 20;
    ctx.fillStyle = lm ? '#f0f7f1' : '#1a2a1e'; ctx.fillRect(pl, y, cW, barH);
    const g = ctx.createLinearGradient(pl, 0, pl + bW, 0);
    if (alert) { g.addColorStop(0, '#ffb57f'); g.addColorStop(1, '#ef5350'); }
    else { g.addColorStop(0, '#81c784'); g.addColorStop(1, '#2e7d32'); }
    ctx.fillStyle = g; ctx.fillRect(pl, y, bW, barH);
    ctx.fillStyle = lm ? '#1b3d1f' : '#d6ebd9'; ctx.font = '10px system-ui'; ctx.textAlign = 'right';
    ctx.fillText(cow.id, pl - 5, y + barH / 2 + 3.5);
    if (progress > 0.6) {
      ctx.font = 'bold 9.5px system-ui';
      if (bW > 34) { ctx.fillStyle = '#f8fff9'; ctx.textAlign = 'right'; ctx.fillText(cow.v + 'L', pl + bW - 4, y + barH / 2 + 3.5); }
      else { ctx.fillStyle = lm ? '#1b3d1f' : '#d6ebd9'; ctx.textAlign = 'left'; ctx.fillText(cow.v + 'L', pl + bW + 4, y + barH / 2 + 3.5); }
      if (alert) { ctx.fillStyle = lm ? '#c62828' : '#ffb3b3'; ctx.font = 'bold 8.5px system-ui'; ctx.textAlign = 'left'; ctx.fillText('⚠ ALERTA', pl + cW + 4, y + barH / 2 + 3.5); }
    }
  });
}

function drawDonut(progress = 1) {
  const pack = setupCanvas('cvDonut'); if (!pack) return;
  const { ctx, W, H } = pack;
  const lm = isLight();
  const segs = [
    { lbl: 'Saludable', pct: 68, col: '#4caf50' },
    { lbl: 'En observación', pct: 22, col: '#ff9800' },
    { lbl: 'Req. atención', pct: 10, col: '#f44336' }
  ];
  const legH = 54, cx = W / 2, cy = (H - legH) / 2 + 4, R = Math.min(cx - 6, cy - 8), r = R * .57;
  let ang = -Math.PI / 2;
  ctx.clearRect(0, 0, W, H);
  segs.forEach(s => {
    const sw = (s.pct / 100) * 2 * Math.PI * progress;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, ang, ang + sw);
    ctx.closePath(); ctx.fillStyle = s.col; ctx.fill();
    if (progress > 0.5) {
      const mid = ang + sw / 2;
      ctx.fillStyle = '#fff'; ctx.font = 'bold 10.5px system-ui'; ctx.textAlign = 'center';
      ctx.fillText(s.pct + '%', cx + Math.cos(mid) * R * .72, cy + Math.sin(mid) * R * .72 + 3.5);
    }
    ang += sw;
  });
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI); ctx.fillStyle = '#fff'; ctx.fill();
  ctx.fillStyle = '#1d331f'; ctx.font = 'bold 16px system-ui'; ctx.textAlign = 'center'; ctx.fillText('124', cx, cy + 5);
  ctx.fillStyle = '#6f8574'; ctx.font = '9px system-ui'; ctx.fillText('animales', cx, cy + 17);
  let ly = H - legH + 5;
  segs.forEach(s => {
    ctx.fillStyle = s.col; ctx.fillRect(7, ly, 9, 9);
    ctx.fillStyle = lm ? '#2d5233' : '#d3e6d6'; ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    ctx.fillText(s.lbl + ' (' + s.pct + '%)', 21, ly + 8); ly += 17;
  });
}

function drawPieArea(progress = 1) {
  const pack = setupCanvas('cvPieArea'); if (!pack) return;
  const { ctx, W, H } = pack;
  const lm = isLight();
  const segs = [
    { lbl: 'Reproductivo', pct: 38, col: '#ef5350' },
    { lbl: 'Sanitario', pct: 27, col: '#ff9800' },
    { lbl: 'Productivo', pct: 20, col: '#64b5f6' },
    { lbl: 'Alimentación', pct: 10, col: '#ba68c8' },
    { lbl: 'Trazabilidad', pct: 5, col: '#4db6ac' }
  ];
  const legH = 62, cx = W / 2, cy = (H - legH) / 2 + 5, R = Math.min(cx - 8, cy - 10);
  let ang = -Math.PI / 2;
  ctx.clearRect(0, 0, W, H);
  segs.forEach(s => {
    const sw = (s.pct / 100) * 2 * Math.PI * progress;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, ang, ang + sw);
    ctx.closePath(); ctx.fillStyle = s.col; ctx.fill();
    ang += sw;
  });
  let ly = H - legH + 3;
  segs.forEach(s => {
    ctx.fillStyle = s.col; ctx.fillRect(8, ly, 8, 8);
    ctx.fillStyle = lm ? '#2d5233' : '#d3e6d6'; ctx.font = '9px system-ui'; ctx.textAlign = 'left';
    ctx.fillText(s.lbl + ' ' + s.pct + '%', 20, ly + 7);
    ly += 12;
  });
}

function drawLine(progress = 1) {
  const pack = setupCanvas('cvLine'); if (!pack) return;
  const { ctx, W, H } = pack;
  const months = ['Nov 25', 'Dic 25', 'Ene 26', 'Feb 26', 'Mar 26', 'Abr 26'];
  const vals = [18.2, 19.8, 21.4, 22.1, 24.6, 25.3];
  const lm = isLight();
  const pl = 38, pr = 16, pt = 14, pb = 24, cW = W - pl - pr, cH = H - pt - pb, MIN = 14, MAX = 30;
  ctx.clearRect(0, 0, W, H);
  for (let i = 0; i <= 4; i++) {
    const y = pt + (cH / 4) * i, val = MAX - ((MAX - MIN) / 4) * i;
    ctx.strokeStyle = lm ? '#c8dece' : '#2a4231'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pl, y); ctx.lineTo(W - pr, y); ctx.stroke();
    ctx.fillStyle = lm ? '#3a6b40' : '#9db8a2'; ctx.font = '9px system-ui'; ctx.textAlign = 'right';
    ctx.fillText(val.toFixed(0) + 'L', pl - 4, y + 3.5);
  }
  const pts = vals.map((v, i) => ({ x: pl + (cW / (vals.length - 1)) * i, y: pt + cH - ((v - MIN) / (MAX - MIN)) * cH }));
  const clipW = cW * progress;
  ctx.save(); ctx.beginPath(); ctx.rect(pl, 0, clipW, H); ctx.clip();
  const grad = ctx.createLinearGradient(0, pt, 0, pt + cH);
  grad.addColorStop(0, 'rgba(76,175,80,.3)'); grad.addColorStop(1, 'rgba(76,175,80,0)');
  ctx.beginPath(); ctx.moveTo(pts[0].x, pt + cH);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(pts[pts.length - 1].x, pt + cH); ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
  ctx.beginPath(); ctx.strokeStyle = '#4caf50'; ctx.lineWidth = 2.2;
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)); ctx.stroke();
  ctx.restore();
  pts.forEach((p, i) => {
    if (p.x > pl + clipW + 2) return;
    ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#4caf50'; ctx.fill(); ctx.strokeStyle = lm ? '#e8f5e9' : '#0b130d'; ctx.lineWidth = 2; ctx.stroke();
    if (progress > 0.5) {
      ctx.fillStyle = lm ? '#1b3d1f' : '#d5ead8'; ctx.font = 'bold 9px system-ui'; ctx.textAlign = 'center';
      ctx.fillText(vals[i] + 'L', p.x, p.y - 8);
      ctx.fillStyle = lm ? '#3a6b40' : '#9db8a2'; ctx.font = '9px system-ui'; ctx.fillText(months[i], p.x, H - pb + 13);
    }
  });
  if (progress > 0.9) {
    ctx.fillStyle = lm ? '#1b5e20' : '#9be89e'; ctx.font = 'bold 9.5px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('↑ +39% en 6 meses', W - pr, pt + 10);
  }
}

function drawStack(progress = 1) {
  const pack = setupCanvas('cvStack'); if (!pack) return;
  const { ctx, W, H } = pack;
  const weeks = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
  const data = [
    { rep: 8, san: 6, prod: 4 },
    { rep: 10, san: 7, prod: 5 },
    { rep: 11, san: 6, prod: 6 },
    { rep: 13, san: 8, prod: 5 },
    { rep: 9, san: 6, prod: 4 },
    { rep: 7, san: 5, prod: 3 }
  ];
  const cols = { rep: '#ef5350', san: '#ff9800', prod: '#64b5f6' };
  const lm = isLight();
  const MAXV = 30, pl = 30, pr = 14, pt = 14, pb = 26;
  const cW = W - pl - pr, cH = H - pt - pb, slot = cW / weeks.length, bw = slot * .58;
  ctx.clearRect(0, 0, W, H);
  for (let i = 0; i <= 3; i++) {
    const y = pt + (cH / 3) * i;
    const v = MAXV - (MAXV / 3) * i;
    ctx.strokeStyle = lm ? '#c8dece' : '#2a4231'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pl, y); ctx.lineTo(W - pr, y); ctx.stroke();
    ctx.fillStyle = lm ? '#3a6b40' : '#9db8a2'; ctx.font = '8.5px system-ui'; ctx.textAlign = 'right';
    ctx.fillText(v.toFixed(0), pl - 3, y + 3);
  }
  data.forEach((d, i) => {
    const x = pl + slot * i + (slot - bw) / 2;
    const hRep = (d.rep / MAXV) * cH * progress, hSan = (d.san / MAXV) * cH * progress, hProd = (d.prod / MAXV) * cH * progress;
    let base = H - pb;
    ctx.fillStyle = cols.prod; ctx.fillRect(x, base - hProd, bw, hProd); base -= hProd;
    ctx.fillStyle = cols.san;  ctx.fillRect(x, base - hSan,  bw, hSan);  base -= hSan;
    ctx.fillStyle = cols.rep;  ctx.fillRect(x, base - hRep,  bw, hRep);
    ctx.fillStyle = lm ? '#3a6b40' : '#cde2d0'; ctx.font = '8.5px system-ui'; ctx.textAlign = 'center';
    ctx.fillText(weeks[i], x + bw / 2, H - pb + 12);
  });
  const legend = [
    { t: 'Reproductivo', c: cols.rep },
    { t: 'Sanitario', c: cols.san },
    { t: 'Productivo', c: cols.prod }
  ];
  let lx = pl, ly = pt - 7;
  legend.forEach(item => {
    ctx.fillStyle = item.c; ctx.fillRect(lx, ly, 10, 6);
    ctx.fillStyle = lm ? '#2d5233' : '#bdd4c0'; ctx.font = '8.5px system-ui'; ctx.textAlign = 'left';
    ctx.fillText(item.t, lx + 13, ly + 6);
    lx += 76;
  });
}

/* ══════════════ S10 — COST CHARTS ══════════════ */
function drawCostCharts() { drawCostTotal(); drawCostPerUser(); }

function drawCostTotal(progress = 1) {
  const pack = setupCanvas('cvCost'); if (!pack) return;
  const { ctx, W, H } = pack;
  const tiers = [
    { lbl: '10 u.',  infra: 35,  api: 10  },
    { lbl: '50 u.',  infra: 35,  api: 48  },
    { lbl: '100 u.', infra: 55,  api: 96  },
    { lbl: '250 u.', infra: 80,  api: 240 },
    { lbl: '500 u.', infra: 120, api: 480 },
    { lbl: '1000u.', infra: 210, api: 960 },
  ];
  const lm = isLight();
  const MAXV = 1200, pl = 38, pr = 12, pt = 18, pb = 34;
  const cW = W - pl - pr, cH = H - pt - pb, slot = cW / tiers.length, bW = slot * .62;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = lm ? '#2d5233' : '#7a9e7e'; ctx.font = 'bold 9px system-ui'; ctx.textAlign = 'left';
  ctx.fillText('USD/mes', pl, pt - 4);
  for (let t = 0; t <= 4; t++) {
    const y = pt + (cH / 4) * t, val = MAXV - (MAXV / 4) * t;
    ctx.strokeStyle = lm ? '#c8dece' : '#2a4231'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pl, y); ctx.lineTo(W - pr, y); ctx.stroke();
    ctx.fillStyle = lm ? '#3a6b40' : '#9db8a2'; ctx.font = '9px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('$' + val, pl - 3, y + 3.5);
  }
  tiers.forEach((t, i) => {
    const x = pl + slot * i + (slot - bW) / 2;
    const hI = (t.infra / MAXV) * cH * progress, hA = (t.api / MAXV) * cH * progress, hT = hI + hA;
    const gA = ctx.createLinearGradient(0, H - pb - hA, 0, H - pb);
    gA.addColorStop(0, '#7986cb'); gA.addColorStop(1, '#3949ab');
    ctx.fillStyle = gA; ctx.fillRect(x, H - pb - hT + hI, bW, hA);
    const gI = ctx.createLinearGradient(0, H - pb - hT, 0, H - pb - hT + hI);
    gI.addColorStop(0, '#66bb6a'); gI.addColorStop(1, '#2e7d32');
    ctx.fillStyle = gI; ctx.fillRect(x, H - pb - hT, bW, hI);
    if (progress > 0.7) {
      ctx.fillStyle = lm ? '#1b3d1f' : '#e8f5e9'; ctx.font = 'bold 9px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('$' + (t.infra + t.api), x + bW / 2, H - pb - hT - 4);
    }
    ctx.fillStyle = lm ? '#3a6b40' : '#9db8a2'; ctx.font = '9px system-ui';
    ctx.fillText(t.lbl, x + bW / 2, H - pb + 12);
  });
  ctx.fillStyle = '#4caf50'; ctx.fillRect(pl, pt - 14, 10, 8);
  ctx.fillStyle = lm ? '#2d5233' : '#9db8a2'; ctx.font = '9px system-ui'; ctx.textAlign = 'left'; ctx.fillText('Infra', pl + 13, pt - 7);
  ctx.fillStyle = '#5c6bc0'; ctx.fillRect(pl + 55, pt - 14, 10, 8);
  ctx.fillText('API Claude', pl + 68, pt - 7);
}

function drawCostPerUser(progress = 1) {
  const pack = setupCanvas('cvCostPerUser'); if (!pack) return;
  const { ctx, W, H } = pack;
  const data = [
    { lbl: '10',  v: 4.50 }, { lbl: '50',  v: 1.66 }, { lbl: '100', v: 1.51 },
    { lbl: '250', v: 1.28 }, { lbl: '500', v: 1.20 }, { lbl: '1k',  v: 1.17 }
  ];
  const lm = isLight();
  const MAXV = 5, pl = 34, pr = 10, pt = 12, pb = 20;
  const cW = W - pl - pr, cH = H - pt - pb, slot = cW / data.length, bW = slot * .6;
  ctx.clearRect(0, 0, W, H);
  for (let t = 0; t <= 4; t++) {
    const y = pt + (cH / 4) * t;
    ctx.strokeStyle = lm ? '#c8dece' : '#2a4231'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pl, y); ctx.lineTo(W - pr, y); ctx.stroke();
    ctx.fillStyle = lm ? '#3a6b40' : '#9db8a2'; ctx.font = '8px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('$' + (MAXV - (MAXV / 4) * t).toFixed(1), pl - 3, y + 3);
  }
  data.forEach((d, i) => {
    const x = pl + slot * i + (slot - bW) / 2, bH = (d.v / MAXV) * cH * progress;
    const g = ctx.createLinearGradient(0, H - pb - bH, 0, H - pb);
    g.addColorStop(0, '#ff7043'); g.addColorStop(1, '#bf360c');
    ctx.fillStyle = g; ctx.fillRect(x, H - pb - bH, bW, bH);
    if (progress > 0.6) {
      ctx.fillStyle = lm ? '#1b3d1f' : '#e8f5e9'; ctx.font = 'bold 8px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('$' + d.v.toFixed(2), x + bW / 2, H - pb - bH - 3);
    }
    ctx.fillStyle = lm ? '#3a6b40' : '#9db8a2'; ctx.font = '8px system-ui'; ctx.fillText(d.lbl, x + bW / 2, H - pb + 10);
  });
}

/* ══════════════ S7 — WHY SCORE CHART ══════════════ */
function drawWhyScore(progress = 1) {
  const pack = setupCanvas('cvWhyScore'); if (!pack) return;
  const { ctx, W, H } = pack;
  const criteria = [
    { lbl: 'Español técnico', ours: 95, alt: 70 },
    { lbl: 'Costo/consulta',  ours: 88, alt: 60 },
    { lbl: 'Async / stream',  ours: 96, alt: 64 },
    { lbl: 'Control datos',   ours: 92, alt: 52 }
  ];
  const n = criteria.length;
  const pl = 110, pr = 90, pt = 18, pb = 18;
  const cW = W - pl - pr, cH = H - pt - pb;
  const rowH = cH / n;
  const barH = Math.max(8, Math.min(18, rowH * 0.28));
  const gap  = Math.max(4, rowH * 0.1);
  const fontSize = Math.max(9, Math.min(13, rowH * 0.2));
  const lm = isLight();
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#4caf50'; ctx.fillRect(pl, 6, 22, 7);
  ctx.fillStyle = lm ? '#1b5e20' : '#c8e6c9'; ctx.font = `bold ${fontSize - 1}px system-ui`; ctx.textAlign = 'left';
  ctx.fillText('Stack elegido', pl + 26, 13);
  ctx.fillStyle = '#ef5350'; ctx.fillRect(pl + 140, 6, 22, 7);
  ctx.fillStyle = lm ? '#c62828' : '#ffcdd2';
  ctx.fillText('Mejores alternativas', pl + 166, 13);
  criteria.forEach((c, i) => {
    const rowY = pt + rowH * i;
    const barsBlock = barH * 2 + gap;
    const y = rowY + (rowH - barsBlock) / 2;
    ctx.fillStyle = lm ? '#2d5233' : '#8fad93'; ctx.font = `${fontSize}px system-ui`; ctx.textAlign = 'right';
    ctx.fillText(c.lbl, pl - 8, y + barH * 0.72);
    ctx.fillStyle = lm ? 'rgba(46,125,50,.07)' : 'rgba(255,255,255,.04)';
    ctx.fillRect(pl, y, cW, barH);
    ctx.fillRect(pl, y + barH + gap, cW, barH);
    ctx.strokeStyle = lm ? 'rgba(46,125,50,.2)' : 'rgba(76,175,80,.12)'; ctx.lineWidth = 1;
    for (let t = 1; t <= 3; t++) {
      const gx = pl + cW * (t * 25) / 100;
      ctx.beginPath(); ctx.moveTo(gx, y); ctx.lineTo(gx, y + barH * 2 + gap); ctx.stroke();
      ctx.fillStyle = lm ? '#3a6b40' : '#3d5c40'; ctx.font = `8px system-ui`; ctx.textAlign = 'center';
      ctx.fillText(t * 25, gx, rowY + rowH - 4);
    }
    const gO = ctx.createLinearGradient(pl, 0, pl + cW, 0);
    gO.addColorStop(0, '#66bb6a'); gO.addColorStop(1, '#1b5e20');
    ctx.fillStyle = gO; ctx.fillRect(pl, y, cW * c.ours / 100 * progress, barH);
    const gA = ctx.createLinearGradient(pl, 0, pl + cW, 0);
    gA.addColorStop(0, '#ef5350'); gA.addColorStop(1, '#7f0000');
    ctx.fillStyle = gA; ctx.fillRect(pl, y + barH + gap, cW * c.alt / 100 * progress, barH);
    if (progress > 0.6) {
      ctx.fillStyle = '#fff'; ctx.font = `bold ${fontSize}px system-ui`; ctx.textAlign = 'left';
      const oursX = pl + cW * c.ours / 100 * progress;
      const altX  = pl + cW * c.alt  / 100 * progress;
      if (oursX > pl + 30) { ctx.fillStyle = '#fff'; ctx.textAlign = 'right';
        ctx.fillText(c.ours, oursX - 4, y + barH * 0.75); }
      else { ctx.fillStyle = lm ? '#2e7d32' : '#81c784'; ctx.textAlign = 'left';
        ctx.fillText(c.ours, oursX + 4, y + barH * 0.75); }
      if (altX > pl + 30) { ctx.fillStyle = '#fff'; ctx.textAlign = 'right';
        ctx.fillText(c.alt, altX - 4, y + barH + gap + barH * 0.75); }
      else { ctx.fillStyle = '#ef9a9a'; ctx.textAlign = 'left';
        ctx.fillText(c.alt, altX + 4, y + barH + gap + barH * 0.75); }
    }
  });
}

/* ══════════════ S12 — IMPACT PROJECTION ══════════════ */
function drawImpactChart(progress = 1) {
  const pack = setupCanvas('cvImpact'); if (!pack) return;
  const { ctx, W, H } = pack;
  const months = ['M1','M2','M3','M4','M5','M6','M7','M8','M9','M10','M11','M12'];
  const costs  = [18,36,54,72,90,108,126,144,162,180,198,216];
  const savings = [0,30,80,160,260,390,520,640,760,900,1050,1200];
  const pl = 32, pr = 12, pt = 6, pb = 18;
  const cW = W - pl - pr, cH = H - pt - pb, MAXV = 1300;
  const lm = isLight();
  ctx.clearRect(0, 0, W, H);
  for (let i = 0; i <= 3; i++) {
    const y = pt + (cH / 3) * i, val = Math.round(MAXV - (MAXV / 3) * i);
    ctx.strokeStyle = lm ? '#c8dece' : '#2a4231'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pl, y); ctx.lineTo(W - pr, y); ctx.stroke();
    ctx.fillStyle = lm ? '#3a6b40' : '#7a9e7e'; ctx.font = '8px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('$' + val, pl - 3, y + 3);
  }
  const toX = (i) => pl + (cW / (months.length - 1)) * i;
  const toY = (v) => pt + cH - (v / MAXV) * cH;
  const clipW = cW * progress;
  ctx.save(); ctx.beginPath(); ctx.rect(pl, 0, clipW, H); ctx.clip();
  const gradS = ctx.createLinearGradient(0, pt, 0, pt + cH);
  gradS.addColorStop(0, 'rgba(76,175,80,.3)'); gradS.addColorStop(1, 'rgba(76,175,80,0)');
  ctx.beginPath(); ctx.moveTo(toX(0), pt + cH);
  savings.forEach((v, i) => ctx.lineTo(toX(i), toY(v)));
  ctx.lineTo(toX(11), pt + cH); ctx.closePath(); ctx.fillStyle = gradS; ctx.fill();
  ctx.beginPath(); ctx.strokeStyle = '#4caf50'; ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  savings.forEach((v, i) => i === 0 ? ctx.moveTo(toX(i), toY(v)) : ctx.lineTo(toX(i), toY(v)));
  ctx.stroke();
  ctx.beginPath(); ctx.strokeStyle = '#ef5350'; ctx.lineWidth = 1.5; ctx.setLineDash([4,3]);
  costs.forEach((v, i) => i === 0 ? ctx.moveTo(toX(i), toY(v)) : ctx.lineTo(toX(i), toY(v)));
  ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
  months.forEach((m, i) => {
    ctx.fillStyle = lm ? '#3a6b40' : '#6b8d6e'; ctx.font = '7.5px system-ui'; ctx.textAlign = 'center';
    ctx.fillText(m, toX(i), H - pb + 10);
  });
  ctx.fillStyle = '#4caf50'; ctx.fillRect(pl, pt - 2, 16, 4);
  ctx.fillStyle = lm ? '#1b5e20' : '#c8e6c9'; ctx.font = '8px system-ui'; ctx.textAlign = 'left';
  ctx.fillText('Ahorro acumulado', pl + 20, pt + 2);
  ctx.fillStyle = '#ef5350'; ctx.fillRect(pl + 130, pt - 2, 16, 4);
  ctx.fillStyle = lm ? '#c62828' : '#c8e6c9';
  ctx.fillText('Costo acumulado', pl + 150, pt + 2);
}
