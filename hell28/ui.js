/* ILLUMINATI v17.0 atmosphere layer: living background, holographic AI core,
   startup cinema, theme studio, command palette, desktop windows.
   additive only — it never replaces the engine, it watches it. */
const $ = (id) => document.getElementById(id);
const UI = JSON.parse(localStorage.getItem('hl28-ui') || '{}');
UI.theme = UI.theme || 'bloodline';
UI.cine = UI.cine === 0 ? 0 : 1;
UI.bg = UI.bg === 0 ? 0 : 1;
const saveUI = () => localStorage.setItem('hl28-ui', JSON.stringify(UI));
const RM = () => document.body.classList.contains('rm');

/* ---------- theme studio ---------- */
function applyTheme() {
  document.body.dataset.hl = UI.theme;
  document.querySelectorAll('#hlthemes .pbtn').forEach(b => b.classList.toggle('on', b.dataset.hl === UI.theme));
}
document.querySelectorAll('#hlthemes .pbtn').forEach(b => {
  b.addEventListener('click', () => { UI.theme = b.dataset.hl; saveUI(); applyTheme(); });
});
applyTheme();
const tgl = (id, key, onTxt, offTxt) => {
  const el = $(id); if (!el) return;
  const paint = () => { el.classList.toggle('on', !!UI[key]); el.textContent = UI[key] ? onTxt : offTxt; };
  el.addEventListener('click', () => { UI[key] = UI[key] ? 0 : 1; saveUI(); paint(); });
  paint();
};
tgl('cine-tgl', 'cine', 'STARTUP CINEMA: ON', 'STARTUP CINEMA: OFF');
tgl('bg-tgl', 'bg', 'LIVING BG: ON', 'LIVING BG: OFF');

/* ---------- startup cinema ---------- */
(function cine() {
  const c = $('cine'); if (!c) return;
  const done = () => { c.classList.add('out'); setTimeout(() => c.remove(), 950); };
  if (!UI.cine || RM()) { c.remove(); return; }
  $('c-skip').addEventListener('click', done);
  setTimeout(done, 3600);
})();

/* app reveal sweep when the engine finishes its intro */
new MutationObserver(() => {
  if (!document.body.classList.contains('pre') && !document.body.classList.contains('reveal')) {
    document.body.classList.add('reveal');
    setTimeout(() => document.body.classList.remove('reveal'), 900);
  }
}).observe(document.body, { attributes: true, attributeFilter: ['class'] });

/* ---------- living background ---------- */
const bg = $('bg'), bctx = bg.getContext('2d');
let PW = 0, PH = 0, parts = [];
const DPR = Math.min(window.devicePixelRatio || 1, 2);
let mx = -9999, my = -9999;
function bgResize() {
  PW = innerWidth; PH = innerHeight;
  bg.width = PW * DPR; bg.height = PH * DPR;
  bctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const n = Math.max(24, Math.min(64, Math.round(PW * PH / 24000)));
  parts = Array.from({ length: n }, () => ({
    x: Math.random() * PW, y: Math.random() * PH,
    vx: (Math.random() - .5) * .16, vy: (Math.random() - .5) * .16,
    r: Math.random() * 1.3 + .4, a: Math.random() * .45 + .15
  }));
}
bgResize(); addEventListener('resize', bgResize, { passive: true });
addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
function accCol() { return getComputedStyle(document.body).getPropertyValue('--acc').trim() || '#C00020'; }
(function bgLoop() {
  requestAnimationFrame(bgLoop);
  if (document.hidden || !UI.bg || RM()) { bctx.clearRect(0, 0, PW, PH); return; }
  bctx.clearRect(0, 0, PW, PH);
  const c = accCol();
  bctx.strokeStyle = c; bctx.fillStyle = c;
  for (const p of parts) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > PW) p.vx *= -1;
    if (p.y < 0 || p.y > PH) p.vy *= -1;
    const px = mx > -9999 ? p.x + (mx - p.x) * .03 : p.x;
    const py = my > -9999 ? p.y + (my - p.y) * .03 : p.y;
    bctx.globalAlpha = p.a * .6;
    bctx.beginPath(); bctx.arc(px, py, p.r, 0, 7); bctx.fill();
  }
  bctx.globalAlpha = .07; bctx.lineWidth = 1;
  for (let i = 0; i < parts.length; i++) for (let j = i + 1; j < parts.length; j++) {
    const a = parts[i], b = parts[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
    if (d2 < 14000) { bctx.beginPath(); bctx.moveTo(a.x, a.y); bctx.lineTo(b.x, b.y); bctx.stroke(); }
  }
  bctx.globalAlpha = 1;
})();

/* ---------- holographic AI core ---------- */
const core = $('core'), cctx = core ? core.getContext('2d') : null;
let CS = 150, stT = 'AI: STANDBY';
function coreResize() {
  if (!core) return;
  const w = core.parentElement.getBoundingClientRect();
  CS = Math.max(96, Math.min(w.width - 40, 170));
  core.width = CS * DPR; core.height = CS * DPR;
  core.style.width = CS + 'px'; core.style.height = CS + 'px';
  cctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
coreResize(); addEventListener('resize', coreResize, { passive: true });
if ($('st-state')) {
  stT = $('st-state').textContent;
  new MutationObserver(() => { stT = $('st-state').textContent; }).observe($('st-state'), { childList: true, characterData: true, subtree: true });
}
const NODES = Array.from({ length: 16 }, (_, i) => {
  const phi = Math.acos(1 - 2 * (i + .5) / 16), th = Math.PI * (1 + Math.sqrt(5)) * (i + .5);
  return { x: Math.sin(phi) * Math.cos(th), y: Math.sin(phi) * Math.sin(th), z: Math.cos(phi) };
});
(function coreLoop(t) {
  requestAnimationFrame(coreLoop);
  if (!cctx || document.hidden || RM()) return;
  cctx.clearRect(0, 0, CS, CS);
  const mid = CS / 2, R = CS * .36, c = accCol();
  const working = /WORKING|FORGING|THINK/.test(stT);
  const online = $('conn') && $('conn').classList.contains('on');
  const spin = t * (working ? .0011 : .00035);
  const idleA = online ? .55 : .22;
  // outer rings
  for (let k = 0; k < 2; k++) {
    cctx.beginPath();
    cctx.ellipse(mid, mid, R * (1.12 + k * .16), R * (1.12 + k * .16) * (k ? .38 : .62), spin * (k ? -.7 : .5), 0, 7);
    cctx.strokeStyle = c; cctx.globalAlpha = (idleA * .5) * (working ? 1.4 : 1);
    cctx.lineWidth = 1; cctx.stroke();
  }
  // neural web
  const pts = NODES.map(n => {
    const y = n.y * Math.cos(spin) - n.z * Math.sin(spin);
    const z = n.y * Math.sin(spin) + n.z * Math.cos(spin);
    return { x: mid + n.x * R, y: mid + y * R, z, s: (z + 1.4) / 2.4 };
  });
  cctx.strokeStyle = c; cctx.lineWidth = 1;
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
    const a = pts[i], b = pts[j];
    const dx = a.x - b.x, dy = a.y - b.y;
    if (dx * dx + dy * dy < (R * .95) ** 2) {
      cctx.globalAlpha = Math.min(a.s, b.s) * (working ? .5 + .3 * Math.sin(t * .004 + i) : .28);
      cctx.beginPath(); cctx.moveTo(a.x, a.y); cctx.lineTo(b.x, b.y); cctx.stroke();
    }
  }
  for (const p of pts) {
    cctx.globalAlpha = p.s * (working ? .95 : .7);
    cctx.fillStyle = c;
    cctx.beginPath(); cctx.arc(p.x, p.y, p.s * (working ? 2.1 : 1.6), 0, 7); cctx.fill();
  }
  // the eye
  cctx.globalAlpha = online ? .9 : .4;
  const g = cctx.createRadialGradient(mid, mid, 0, mid, mid, R * .5);
  g.addColorStop(0, c); g.addColorStop(1, 'rgba(0,0,0,0)');
  cctx.fillStyle = g;
  cctx.beginPath(); cctx.arc(mid, mid, R * .5 * (working ? 1 + .08 * Math.sin(t * .006) : 1), 0, 7); cctx.fill();
  cctx.globalAlpha = 1;
})(0);

/* ---------- command palette ---------- */
const CMDS = [
  ['OPEN HOME', () => nav('home')], ['OPEN AI CORE', () => nav('brain')],
  ['OPEN STATUS', () => nav('status')], ['OPEN HISTORY', () => nav('hist')],
  ['OPEN SETTINGS', () => nav('set')], ['OPEN LOGS', () => nav('logs')],
  ['OPEN VAULT', () => nav('vault')], ['OPEN ABOUT', () => nav('about')],
  ['TOGGLE SCANLINES', () => click('s-scan')], ['TOGGLE FLICKER', () => click('s-flick')],
  ['TOGGLE GLITCH', () => click('s-glitch')], ['TOGGLE UI SOUNDS', () => click('s-sfx')],
  ['TOGGLE SPEAK REPLIES', () => click('b-speak')], ['TOGGLE REDUCED MOTION', () => click('s-motion')],
  ['THEME: BLOODLINE', () => setTheme('bloodline')], ['THEME: PHANTOM', () => setTheme('phantom')],
  ['THEME: GHOST', () => setTheme('ghost')], ['THEME: OVERDRIVE', () => setTheme('overdrive')],
  ['THEME: VOID', () => setTheme('void')], ['THEME: CYBERNETIC', () => setTheme('cybernetic')],
  ['TOGGLE LIVING BACKGROUND', () => click('bg-tgl')], ['TOGGLE STARTUP CINEMA', () => click('cine-tgl')],
];
function nav(m) { const b = document.querySelector('#nav button[data-m="' + m + '"]'); if (b) b.click(); }
function click(id) { const el = $(id); if (el) el.click(); }
function setTheme(t) { UI.theme = t; saveUI(); applyTheme(); }
const bk = $('cmdbk'), cin = $('cmdin'), clist = $('cmdlist');
let sel = 0, shown = CMDS;
function paintCmds() {
  clist.innerHTML = '';
  shown.forEach((c, i) => {
    const d = document.createElement('div'); d.className = 'cmd-item' + (i === sel ? ' sel' : '');
    d.textContent = c[0];
    const k = document.createElement('span'); k.className = 'kbd'; k.textContent = 'ENTER';
    d.appendChild(k); d.onclick = () => { run(c); };
    clist.appendChild(d);
  });
}
function run(c) { closeCmd(); try { c[1](); } catch (e) {} }
function openCmd() { bk.classList.add('on'); cin.value = ''; sel = 0; shown = CMDS; paintCmds(); setTimeout(() => cin.focus(), 30); }
function closeCmd() { bk.classList.remove('on'); }
if (bk) {
  $('cmdbtn').addEventListener('click', openCmd);
  bk.addEventListener('click', e => { if (e.target === bk) closeCmd(); });
  cin.addEventListener('input', () => {
    const q = cin.value.trim().toUpperCase();
    shown = q ? CMDS.filter(c => c[0].includes(q)) : CMDS;
    sel = 0; paintCmds();
  });
  cin.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCmd();
    else if (e.key === 'ArrowDown') { sel = Math.min(sel + 1, shown.length - 1); paintCmds(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { sel = Math.max(sel - 1, 0); paintCmds(); e.preventDefault(); }
    else if (e.key === 'Enter' && shown[sel]) run(shown[sel]);
  });
  addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); bk.classList.contains('on') ? closeCmd() : openCmd(); }
  });
}

/* ---------- desktop floating windows ---------- */
const desk = $('desk');
const isDesk = () => matchMedia('(min-width:1100px)').matches;
const wins = new Map();
const MODS = ['brain', 'status', 'hist', 'set', 'logs', 'vault', 'about'];
function mkWin(m) {
  const w = document.createElement('div'); w.className = 'win';
  const hd = document.createElement('div'); hd.className = 'win-hd';
  const t = document.createElement('b'); t.textContent = document.querySelector('#nav button[data-m="' + m + '"]').textContent;
  const mx = document.createElement('button'); mx.textContent = '□'; mx.title = 'Maximize';
  const cl = document.createElement('button'); cl.textContent = '×'; cl.title = 'Close';
  hd.append(t, mx, cl);
  const bd = document.createElement('div'); bd.className = 'win-bd';
  w.append(hd, bd);
  const n = $('m-' + m); n.parentNode.insertBefore(document.createComment(''), n);
  bd.appendChild(n);
  const st = UI['w' + m] || {};
  w.style.left = (st.x != null ? st.x : 60 + wins.size * 36) + 'px';
  w.style.top = (st.y != null ? st.y : 120 + wins.size * 30) + 'px';
  desk.appendChild(w);
  wins.set(m, { el: w, node: n });
  const savePos = () => { UI['w' + m] = { x: parseInt(w.style.left), y: parseInt(w.style.top) }; saveUI(); };
  hd.addEventListener('pointerdown', e => {
    if (e.target.tagName === 'BUTTON' || w.classList.contains('max')) return;
    const sx = e.clientX - w.offsetLeft, sy = e.clientY - w.offsetTop;
    const mv = ev => { w.style.left = Math.max(0, Math.min(innerWidth - 120, ev.clientX - sx)) + 'px'; w.style.top = Math.max(0, Math.min(innerHeight - 60, ev.clientY - sy)) + 'px'; };
    const up = () => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); savePos(); };
    addEventListener('pointermove', mv); addEventListener('pointerup', up);
  });
  mx.onclick = () => w.classList.toggle('max');
  cl.onclick = () => { w.style.display = 'none'; nav('home'); };
  return w;
}
new MutationObserver(() => {
  if (!desk) return;
  document.body.classList.toggle('desk', isDesk());
  if (!isDesk()) {
    wins.forEach((v, m) => { v.el.style.display = 'none'; $('main').insertBefore(v.node, $('main').children[Math.min(MODS.indexOf(m), $('main').children.length)] || null); });
    wins.clear();
  }
}).observe(document.body, { attributes: true, attributeFilter: ['class'] });
document.body.classList.toggle('desk', isDesk());
MODS.forEach(m => {
  const n = $('m-' + m); if (!n) return;
  new MutationObserver(() => {
    const on = n.classList.contains('on');
    if (!on || !isDesk()) return;
    let w = wins.get(m) ? wins.get(m).el : null;
    if (!w) w = mkWin(m);
    w.style.display = 'flex';
    w.style.zIndex = 40 + wins.size;
  }).observe(n, { attributes: true, attributeFilter: ['class'] });
});
