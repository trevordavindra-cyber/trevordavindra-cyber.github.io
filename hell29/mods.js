/* ILLUMINATI v18.0 lab layer — runs after the v17 atmosphere layer.
   every lab hits the same public relay the chat brain uses. nothing simulated. */
await import('../hell28/ui.js');
const $ = (id) => document.getElementById(id);
const LS = { get(k, d) { try { return JSON.parse(localStorage.getItem(k) || d); } catch (e) { return JSON.parse(d); } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };

/* ---------- relay client ---------- */
const NET = [];
async function ai(messages, model = 'openai', maxms = 90000) {
  const t0 = performance.now();
  const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), maxms);
  try {
    const r = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages }), signal: ctl.signal
    });
    if (!r.ok) throw new Error('relay answered ' + r.status);
    const j = await r.json();
    const out = (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || '';
    NET.push({ host: 'pollinations', model, ms: performance.now() - t0, ok: true, t: Date.now() });
    return out;
  } catch (e) {
    NET.push({ host: 'pollinations', model, ms: performance.now() - t0, ok: false, t: Date.now() });
    // fallback: plain GET relay
    try {
      const sys = (messages.find(m => m.role === 'system') || {}).content || '';
      const usr = (messages.filter(m => m.role === 'user').map(m => m.content).join('\n')) || '';
      const u = 'https://text.pollinations.ai/' + encodeURIComponent((sys ? sys + '\n\n' : '') + usr).slice(0, 1800) + '?model=' + model;
      const r2 = await fetch(u, { signal: ctl.signal });
      if (!r2.ok) throw new Error('relay answered ' + r2.status);
      const out2 = await r2.text();
      NET.push({ host: 'pollinations', model, ms: performance.now() - t0, ok: true, t: Date.now() });
      return out2;
    } catch (e2) { throw e2; }
  } finally { clearTimeout(to); }
}
function persona() {
  const p = LS.get('hl29-persona', '{}');
  if (!p || !p.name && !p.inst) return '';
  return 'OPERATOR PERSONA — name: ' + (p.name || 'the operator') + '; style: ' + (p.style || 'direct') + '; length: ' + (p.len || 'medium') + '.' + (p.inst ? ' Standing instructions: ' + p.inst : '');
}
const busyBtn = (b, on, txt) => { b.disabled = on; b.textContent = on ? (txt || 'WORKING…') : b.dataset.t; };
const arm = (b) => { b.dataset.t = b.textContent; };

/* ---------- nav: give the new modules their switch ---------- */
const NAVX = ['agents', 'arena', 'debate', 'research', 'persona', 'graph', 'search', 'analytics', 'diag'];
const MYSECS = NAVX.map(m => $('m-' + m)).filter(Boolean);
document.querySelectorAll('#nav button').forEach(b => {
  b.addEventListener('click', () => {
    const mine = NAVX.includes(b.dataset.m);
    MYSECS.forEach(s => s.classList.remove('on'));
    if (mine) { const s = $('m-' + b.dataset.m); if (s) s.classList.add('on'); }
  });
});

/* ---------- multi-agent command center ---------- */
const ROLES = [
  ['RESEARCHER', 'Gathers information on the task. Names what is known, what is estimated, and what is unknown.'],
  ['ANALYST', 'Evaluates information, finds patterns and tensions, weighs the evidence.'],
  ['PROGRAMMER', 'Handles code and technical construction. Writes real, runnable work.'],
  ['CREATIVE DIRECTOR', 'Develops concepts, naming, angles and design direction.'],
  ['FACT CHECKER', 'Tests claims for support, flags uncertainty and contradiction plainly.'],
  ['STRATEGIST', 'Turns the findings into a concrete, ordered plan of action.'],
  ['COORDINATOR', 'Maps the workflow, sequences the work, notes dependencies between the other agents.']];
let agResults = [];
(function agents() {
  const wrap = $('ag-picks');
  ROLES.forEach((r, i) => {
    const b = document.createElement('button');
    b.className = 'pbtn' + (i < 4 ? ' on' : ''); b.textContent = r[0]; b.title = r[1];
    b.onclick = () => b.classList.toggle('on');
    wrap.appendChild(b);
  });
  arm($('ag-run')); arm($('ag-syn'));
  $('ag-run').onclick = async () => {
    const task = $('ag-task').value.trim();
    if (!task) return;
    const on = ROLES.filter((r, i) => wrap.children[i].classList.contains('on'));
    if (!on.length) return;
    agResults = [];
    $('ag-synout').innerHTML = '';
    const out = $('ag-out'); out.innerHTML = '';
    const cards = on.map(r => {
      const c = document.createElement('div'); c.className = 'acard';
      c.innerHTML = '<div class="ahd"><b>' + r[0] + '</b><span class="astat run">RUNNING</span><span class="ams">—</span></div><div class="abody">…</div>';
      out.appendChild(c); return c;
    });
    busyBtn($('ag-run'), true);
    const P = persona();
    await Promise.all(on.map(async (r, i) => {
      const t0 = performance.now();
      const st = cards[i].querySelector('.astat'), ms = cards[i].querySelector('.ams'), body = cards[i].querySelector('.abody');
      try {
        const txt = await ai([
          { role: 'system', content: (P ? P + '\n\n' : '') + 'You are the ' + r[0] + ' agent in a multi-agent command center. Your mandate: ' + r[1] + ' Answer ONLY from your mandate. Be direct, no preamble, no apologies.' },
          { role: 'user', content: task }], 'openai');
        const msx = Math.round(performance.now() - t0);
        st.className = 'astat ok'; st.textContent = 'DONE'; ms.textContent = msx + 'ms';
        body.textContent = txt || '(empty answer)';
        agResults.push({ role: r[0], txt, ms: msx });
      } catch (e) {
        st.className = 'astat err'; st.textContent = 'FAILED'; ms.textContent = Math.round(performance.now() - t0) + 'ms';
        body.textContent = 'the relay refused this agent: ' + e.message;
      }
    }));
    busyBtn($('ag-run'), false);
    $('ag-syn').disabled = agResults.length < 2;
  };
  $('ag-syn').onclick = async () => {
    if (agResults.length < 2) return;
    busyBtn($('ag-syn'), true, 'COMBINING…');
    const so = $('ag-synout');
    so.innerHTML = '<div class="acard"><div class="ahd"><b>COORDINATED REPORT</b><span class="astat run">RUNNING</span></div><div class="abody">…</div></div>';
    try {
      const feed = agResults.map(r => '## ' + r.role + ' (in ' + r.ms + 'ms):\n' + r.txt).join('\n\n');
      const txt = await ai([
        { role: 'system', content: 'You are the coordinator agent. Merge the specialist reports below into one final brief. Where agents contradict each other, name the contradiction plainly. End with a short ordered action list. No preamble.' },
        { role: 'user', content: 'TASK:\n' + $('ag-task').value.trim() + '\n\nSPECIALIST REPORTS:\n' + feed }], 'openai');
      const c = so.firstElementChild;
      c.querySelector('.astat').className = 'astat ok'; c.querySelector('.astat').textContent = 'DONE';
      c.querySelector('.abody').textContent = txt || '(empty answer)';
      const log = LS.get('hl29-research', '[]'); log.unshift({ d: Date.now(), mode: 'agent-report', q: $('ag-task').value.trim().slice(0, 80), out: txt.slice(0, 4000) }); LS.set('hl29-research', log.slice(0, 40)); paintRsLog();
    } catch (e) {
      const c = so.firstElementChild;
      c.querySelector('.astat').className = 'astat err'; c.querySelector('.astat').textContent = 'FAILED';
      c.querySelector('.abody').textContent = 'the relay refused the merge: ' + e.message;
    }
    busyBtn($('ag-syn'), false);
  };
  $('ag-clear').onclick = () => { $('ag-task').value = ''; $('ag-out').innerHTML = ''; $('ag-synout').innerHTML = ''; agResults = []; $('ag-syn').disabled = true; };
})();

/* ---------- AI battle arena ---------- */
const AR_MODELS = [['openai', 'OPENAI-CLASS'], ['openai-large', 'OPENAI-LARGE'], ['mistral', 'MISTRAL'], ['llama', 'LLAMA'], ['deepseek', 'DEEPSEEK'], ['qwen-coder', 'QWEN-CODER']];
(function arena() {
  const wrap = $('ar-picks');
  AR_MODELS.forEach((m, i) => {
    const b = document.createElement('button'); b.className = 'pbtn' + (i < 4 ? ' on' : ''); b.textContent = m[1];
    b.onclick = () => b.classList.toggle('on'); wrap.appendChild(b);
  });
  arm($('ar-run'));
  $('ar-run').onclick = async () => {
    const q = $('ar-prompt').value.trim(); if (!q) return;
    const on = AR_MODELS.filter((m, i) => wrap.children[i].classList.contains('on'));
    if (!on.length) return;
    const out = $('ar-out'); out.innerHTML = '';
    const cards = on.map(m => {
      const c = document.createElement('div'); c.className = 'acard';
      c.innerHTML = '<div class="ahd"><b>' + m[1] + '</b><span class="astat run">RUNNING</span><span class="ams">—</span></div><div class="abody">…</div><button class="vote">⚔ VOTE</button><div class="wins"></div>';
      out.appendChild(c); return c;
    });
    busyBtn($('ar-run'), true);
    const P = persona(); const battle = [];
    await Promise.all(on.map(async (m, i) => {
      const t0 = performance.now();
      const st = cards[i].querySelector('.astat'), ms = cards[i].querySelector('.ams'), body = cards[i].querySelector('.abody');
      try {
        const txt = await ai([
          { role: 'system', content: (P ? P + '\n\n' : '') + 'Answer directly and completely. No preamble, no disclaimers.' },
          { role: 'user', content: q }], m[0]);
        const msx = Math.round(performance.now() - t0);
        st.className = 'astat ok'; st.textContent = 'DONE'; ms.textContent = msx + 'ms · ' + txt.trim().split(/\s+/).length + ' words';
        body.textContent = txt || '(empty answer)';
        battle.push({ model: m[1], ms: msx, ok: true });
        const vote = cards[i].querySelector('.vote');
        vote.onclick = () => {
          const t = LS.get('hl29-votes', '{}'); t[m[1]] = (t[m[1]] || 0) + 1; LS.set('hl29-votes', t);
          document.querySelectorAll('#ar-out .vote').forEach(v => v.classList.remove('on'));
          vote.classList.add('on'); paintWins(); paintArLog(q, m[1]);
        };
      } catch (e) {
        const msx = Math.round(performance.now() - t0);
        st.className = 'astat err'; st.textContent = 'FAILED'; ms.textContent = msx + 'ms';
        body.textContent = 'the relay refused this brain: ' + e.message;
        battle.push({ model: m[1], ms: msx, ok: false });
      }
    }));
    busyBtn($('ar-run'), false);
    paintArLog(q, null, battle);
  };
  function paintWins() {
    const t = LS.get('hl29-votes', '{}');
    document.querySelectorAll('#ar-out .acard').forEach(c => {
      const lbl = c.querySelector('.ahd b').textContent;
      c.querySelector('.wins').textContent = 'your votes: ' + (t[lbl] || 0);
    });
  }
  paintWins.onpush = 0;
  function paintArLog(q, winner, battle) {
    const log = LS.get('hl29-arena', '[]');
    if (q !== undefined) log.unshift({ d: Date.now(), q: q.slice(0, 80), winner: winner || '', battle: battle || [] });
    LS.set('hl29-arena', log.slice(0, 30));
    $('ar-log').textContent = log.slice(0, 10).map(l => new Date(l.d).toLocaleTimeString() + ' — "' + l.q + '"' + (l.winner ? ' → your pick: ' + l.winner : '') + (l.battle && l.battle.length ? ' (' + l.battle.map(b => b.model + (b.ok ? ' ' + b.ms + 'ms' : ' FAILED')).join(', ') + ')' : '')).join('\n');
  }
  paintArLog();
})();

/* ---------- debate mode ---------- */
(function debate() {
  arm($('db-run'));
  $('db-run').onclick = async () => {
    const topic = $('db-topic').value.trim(); if (!topic) return;
    const out = $('db-out'); out.innerHTML = '';
    busyBtn($('db-run'), true, 'DEBATING…');
    const P = persona();
    const mk = (title) => { const c = document.createElement('div'); c.className = 'acard'; c.innerHTML = '<div class="ahd"><b>' + title + '</b><span class="astat run">RUNNING</span></div><div class="abody">…</div>'; out.appendChild(c); return c; };
    const fill = (c, txt, ok) => { const s = c.querySelector('.astat'); s.className = 'astat ' + (ok ? 'ok' : 'err'); s.textContent = ok ? 'DONE' : 'FAILED'; c.querySelector('.abody').textContent = txt; };
    const pro = mk('AFFIRMATIVE'), con = mk('OPPOSING'), re1 = mk('AFFIRMATIVE REBUTTAL'), re2 = mk('OPPOSING REBUTTAL'), sum = mk('BALANCED SUMMARY');
    const base = (P ? P + '\n\n' : '') + 'You are in a structured debate on the motion: "' + topic + '". Argue with evidence you actually have. If a claim is uncertain, say so. No theatre, no invented facts.';
    try {
      const a = await ai([{ role: 'system', content: base + ' Your side: AFFIRMATIVE. Make the strongest honest case for it.' }, { role: 'user', content: 'Open your case.' }]);
      fill(pro, a, true);
      const b = await ai([{ role: 'system', content: base + ' Your side: OPPOSING. Make the strongest honest case against it.' }, { role: 'user', content: 'The affirmative argued:\n' + a + '\n\nOpen your case, challenging any unsupported claim.' }]);
      fill(con, b, true);
      const [r1, r2] = await Promise.all([
        ai([{ role: 'system', content: base + ' Your side: AFFIRMATIVE. Rebut the opposing case honestly.' }, { role: 'user', content: 'Opposing case:\n' + b }]),
        ai([{ role: 'system', content: base + ' Your side: OPPOSING. Rebut the affirmative honestly.' }, { role: 'user', content: 'Affirmative case:\n' + a }])]);
      fill(re1, r1, true); fill(re2, r2, true);
      const s = await ai([{ role: 'system', content: 'You are the neutral chair. Write a balanced summary: the strongest points on each side, the points that remain contested, and what evidence would settle it. Never declare a winner unless the arguments clearly warrant it.' }, { role: 'user', content: 'Motion: ' + topic + '\n\nAFFIRMATIVE:\n' + a + '\n\nOPPOSING:\n' + b + '\n\nREBUTTALS:\n' + r1 + '\n\n' + r2 }]);
      fill(sum, s, true);
    } catch (e) {
      out.querySelectorAll('.acard').forEach(c => { const st = c.querySelector('.astat'); if (st.classList.contains('run')) { st.className = 'astat err'; st.textContent = 'FAILED'; c.querySelector('.abody').textContent = 'the relay broke off mid-debate: ' + e.message; } });
    }
    busyBtn($('db-run'), false);
  };
})();

/* ---------- research lab ---------- */
const RS_MODES = {
  quick: 'Give a concise overview. Mark anything uncertain.',
  advanced: 'Give a deep, multi-angle investigation: background, key findings, tensions, open questions.',
  compare: 'The question names two or more subjects separated by "vs". Compare them on clear axes and end with an honest verdict.',
  verify: 'Treat the input as a claim. Say plainly whether it is supported, partially supported, or unsupported by what you know, and what would confirm it.',
  report: 'Write a structured research report: summary, findings, caveats, unresolved questions. Number the sections.'
};
function paintRsLog() {
  const log = LS.get('hl29-research', '[]');
  $('rs-log').textContent = log.slice(0, 12).map(l => new Date(l.d).toLocaleString() + ' — [' + l.mode + '] ' + l.q).join('\n');
}
(function research() {
  arm($('rs-run')); arm($('rs-save'));
  paintRsLog();
  let lastOut = '', lastQ = '', lastMode = '';
  $('rs-run').onclick = async () => {
    const q = $('rs-q').value.trim(); if (!q) return;
    const mode = $('rs-mode').value;
    const out = $('rs-out');
    out.innerHTML = '<div class="acard"><div class="ahd"><b>RESEARCH · ' + mode.toUpperCase() + '</b><span class="astat run">RUNNING</span></div><div class="abody">…</div></div>';
    busyBtn($('rs-run'), true, 'RESEARCHING…');
    try {
      const txt = await ai([
        { role: 'system', content: (persona() ? persona() + '\n\n' : '') + 'You are the research arm of the ILLUMINATI terminal. ' + RS_MODES[mode] + ' Separate verified facts from estimates and interpretation. If you name a source, remember it comes from your training knowledge, not a live lookup.' },
        { role: 'user', content: q }]);
      const c = out.firstElementChild;
      c.querySelector('.astat').className = 'astat ok'; c.querySelector('.astat').textContent = 'DONE';
      c.querySelector('.abody').textContent = txt || '(empty answer)';
      lastOut = txt; lastQ = q; lastMode = mode; $('rs-save').disabled = false;
    } catch (e) {
      const c = out.firstElementChild;
      c.querySelector('.astat').className = 'astat err'; c.querySelector('.astat').textContent = 'FAILED';
      c.querySelector('.abody').textContent = 'the relay refused: ' + e.message;
    }
    busyBtn($('rs-run'), false);
  };
  $('rs-save').onclick = () => {
    if (!lastOut) return;
    const log = LS.get('hl29-research', '[]');
    log.unshift({ d: Date.now(), mode: lastMode, q: lastQ.slice(0, 80), out: lastOut.slice(0, 4000) });
    LS.set('hl29-research', log.slice(0, 40)); paintRsLog(); $('rs-save').disabled = true;
  };
})();

/* ---------- personalities studio ---------- */
const PE_PRESETS = {
  professional: ['The Professional', 'professional', 'medium', 'Keep it composed, precise and courteous. No slang.'],
  technical: ['The Engineer', 'technical', 'medium', 'Prefer exact terms, show code when relevant, state assumptions.'],
  researcher: ['The Researcher', 'researcher', 'long', 'Weigh evidence, separate fact from inference, always list what remains unknown.'],
  creative: ['The Muse', 'creative', 'medium', 'Bold ideas, vivid language, take real swings.'],
  academic: ['The Scholar', 'academic', 'long', 'Formal register, define terms, structure arguments in numbered steps.'],
  concise: ['The Blade', 'concise', 'short', 'Maximum signal. No filler. Answer first.'],
  analytical: ['The Analyst', 'analytical', 'medium', 'Break the problem into parts, weigh each, state the confidence level.']
};
(function personaStudio() {
  const pres = $('pe-presets');
  Object.keys(PE_PRESETS).forEach(k => {
    const b = document.createElement('button'); b.className = 'pbtn'; b.textContent = PE_PRESETS[k][0].toUpperCase();
    b.onclick = () => { const v = PE_PRESETS[k]; $('pe-name').value = v[0]; $('pe-style').value = v[1]; $('pe-len').value = v[2]; $('pe-inst').value = v[3]; };
    pres.appendChild(b);
  });
  const paint = () => { const p = LS.get('hl29-persona', '{}'); $('pe-state').textContent = p && p.name ? 'live persona: ' + p.name + ' (' + p.style + ', ' + p.len + ')' : 'no persona set — the labs run bare.'; };
  $('pe-save').onclick = () => { LS.set('hl29-persona', { name: $('pe-name').value.trim(), style: $('pe-style').value, len: $('pe-len').value, inst: $('pe-inst').value.trim() }); paint(); };
  $('pe-clear').onclick = () => { localStorage.removeItem('hl29-persona'); $('pe-name').value = ''; $('pe-inst').value = ''; paint(); };
  paint();
})();

/* ---------- knowledge graph ---------- */
(function graph() {
  const cv = $('graphc'), cx = cv.getContext('2d');
  let nodes = [], edges = [], zoom = 1, sel = -1;
  function size() { const w = Math.min(cv.parentElement.clientWidth - 4, 560); cv.width = w * devicePixelRatio; cv.height = 360 * devicePixelRatio; cv.style.height = '360px'; cx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); }
  size(); addEventListener('resize', size, { passive: true });
  const STOP = new Set(['about', 'there', 'their', 'would', 'could', 'should', 'which', 'because', 'while', 'where', 'these', 'those', 'other', 'every', 'being', 'having', 'after', 'before', 'under', 'between', 'through']);
  const toks = s => (s.toLowerCase().match(/[a-z]{5,}/g) || []).filter(w => !STOP.has(w));
  async function vaultNames() {
    try {
      const db = await new Promise((res, rej) => { const q = indexedDB.open('etrno-vault', 1); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); });
      const st = db.objectStoreNames[0]; if (!st) return [];
      return await new Promise((res, rej) => { const tx = db.transaction(st, 'readonly'); const rq = tx.objectStore(st).getAll(); rq.onsuccess = () => res((rq.result || []).map(v => String(v.name || 'vault item')).slice(0, 24)); rq.onerror = () => rej(rq.error); });
    } catch (e) { return []; }
  }
  async function build() {
    const mem = LS.get('etrno-mem', '[]').map(f => ({ cat: 'MEMORY', txt: String(f).slice(0, 160) }));
    const rs = LS.get('hl29-research', '[]').map(r => ({ cat: 'RESEARCH', txt: '[' + r.mode + '] ' + r.q }));
    const ar = LS.get('hl29-arena', '[]').map(r => ({ cat: 'BATTLE', txt: 'prompt: ' + r.q }));
    const vl = (await vaultNames()).map(n => ({ cat: 'VAULT', txt: n }));
    nodes = [...mem, ...rs, ...ar, ...vl].map((n, i) => ({ ...n, i, kw: toks(n.txt), deg: 0 }));
    edges = [];
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
      const sh = nodes[i].kw.filter(w => nodes[j].kw.includes(w));
      if (sh.length) { edges.push([i, j, sh[0]]); nodes[i].deg++; nodes[j].deg++; }
    }
    const cats = {}; nodes.forEach(n => cats[n.cat] = (cats[n.cat] || 0) + 1);
    const centers = { MEMORY: [.5, .28], RESEARCH: [.22, .62], BATTLE: [.78, .62], VAULT: [.5, .88] };
    const per = {}; nodes.forEach(n => { per[n.cat] = (per[n.cat] || 0); n.a = (per[n.cat]++ / Math.max(1, cats[n.cat])) * Math.PI * 2 + n.i; });
    nodes.forEach(n => { const c = centers[n.cat] || [.5, .5]; n.x = (c[0] + Math.cos(n.a) * .13) * 100; n.y = (c[1] + Math.sin(n.a) * .11) * 100; });
    $('gr-info').textContent = nodes.length + ' nodes · ' + edges.length + ' shared-keyword links · built from this browser only.';
    draw();
  }
  function draw() {
    const W = cv.width / devicePixelRatio, H = 360;
    cx.clearRect(0, 0, W, H);
    const q = ($('gr-q').value || '').trim().toLowerCase();
    const acc = getComputedStyle(document.body).getPropertyValue('--acc').trim() || '#C00020';
    cx.strokeStyle = acc; cx.lineWidth = 1;
    edges.forEach(e => { const a = nodes[e[0]], b = nodes[e[1]]; cx.globalAlpha = .18 * zoom; cx.beginPath(); cx.moveTo(a.x / 100 * W, a.y / 100 * H); cx.lineTo(b.x / 100 * W, b.y / 100 * H); cx.stroke(); });
    nodes.forEach((n, i) => {
      const x = n.x / 100 * W, y = n.y / 100 * H, r = 3 + Math.min(6, n.deg) * zoom;
      const dim = q && !n.txt.toLowerCase().includes(q);
      cx.globalAlpha = dim ? .12 : .9;
      cx.fillStyle = n.cat === 'MEMORY' ? acc : n.cat === 'RESEARCH' ? '#35d07f' : n.cat === 'BATTLE' ? '#f5c96b' : '#8a8a92';
      cx.beginPath(); cx.arc(x, y, r, 0, 7); cx.fill();
      if (i === sel) { cx.strokeStyle = '#fff'; cx.beginPath(); cx.arc(x, y, r + 4, 0, 7); cx.stroke(); cx.strokeStyle = acc; }
      if (!dim && zoom > .7) { cx.globalAlpha = .55; cx.fillStyle = '#c9c9ce'; cx.font = '8px ui-monospace,monospace'; cx.fillText(n.txt.slice(0, 18), x + r + 2, y + 3); }
    });
    cx.globalAlpha = 1;
  }
  $('gr-re').onclick = () => { sel = -1; $('gr-detail').textContent = ''; build(); };
  $('gr-zi').onclick = () => { zoom = Math.min(2, zoom + .2); draw(); };
  $('gr-zo').onclick = () => { zoom = Math.max(.6, zoom - .2); draw(); };
  $('gr-q').addEventListener('input', draw);
  cv.addEventListener('click', e => {
    const W = cv.width / devicePixelRatio, H = 360;
    const r = cv.getBoundingClientRect(); const mx = (e.clientX - r.left), my = (e.clientY - r.top);
    sel = -1; let best = 24;
    nodes.forEach((n, i) => { const d = Math.hypot(n.x / 100 * W - mx, n.y / 100 * H - my); if (d < best) { best = d; sel = i; } });
    if (sel >= 0) {
      const links = edges.filter(ed => ed[0] === sel || ed[1] === sel).map(ed => nodes[ed[0] === sel ? ed[1] : ed[0]].txt.slice(0, 28) + ' (via "' + ed[2] + '")');
      $('gr-detail').textContent = '[' + nodes[sel].cat + '] ' + nodes[sel].txt + '\nlinks: ' + (links.length ? '\n· ' + links.join('\n· ') : 'none');
    } else $('gr-detail').textContent = '';
    draw();
  });
  build();
})();

/* ---------- universal search ---------- */
(function usearch() {
  arm($('us-run'));
  $('us-run').onclick = async () => {
    const q = $('us-q').value.trim().toLowerCase();
    const out = $('us-out');
    if (!q) { out.textContent = ''; return; }
    const hits = { CHAT: [], MEMORY: [], VAULT: [], RESEARCH: [], BATTLE: [] };
    document.querySelectorAll('#chat .line').forEach(l => { const t = l.textContent; if (t.toLowerCase().includes(q)) hits.CHAT.push(t.slice(0, 120)); });
    LS.get('etrno-mem', '[]').forEach(f => { if (String(f).toLowerCase().includes(q)) hits.MEMORY.push(String(f).slice(0, 120)); });
    LS.get('hl29-research', '[]').forEach(r => { if ((r.q + ' ' + (r.out || '')).toLowerCase().includes(q)) hits.RESEARCH.push('[' + r.mode + '] ' + r.q); });
    LS.get('hl29-arena', '[]').forEach(r => { if (r.q.toLowerCase().includes(q)) hits.BATTLE.push(r.q); });
    try {
      const db = await new Promise((res, rej) => { const o = indexedDB.open('etrno-vault', 1); o.onsuccess = () => res(o.result); o.onerror = () => rej(o.error); });
      const st = db.objectStoreNames[0];
      if (st) await new Promise((res) => { const rq = db.transaction(st, 'readonly').objectStore(st).getAll(); rq.onsuccess = () => { (rq.result || []).forEach(v => { if (String(v.name || '').toLowerCase().includes(q)) hits.VAULT.push(v.name); }); res(); }; rq.onerror = res; });
    } catch (e) {}
    out.innerHTML = Object.keys(hits).map(k => hits[k].length ? '<div class="drow"><span class="dl">' + k + ' · ' + hits[k].length + '</span><span class="dv">' + hits[k].slice(0, 4).map(s => String(s).replace(/</g, '&lt;')).join('  ·  ') + (hits[k].length > 4 ? '  …' : '') + '</span></div>' : '').join('') || 'nothing in the order\'s holdings matches."' + q + '" is not in chat, memory, vault, research or battles.';
  };
})();

/* ---------- analytics ---------- */
(function analytics() {
  const cv = $('anc'), cx = cv.getContext('2d');
  function size() { const w = Math.min(cv.parentElement.clientWidth - 4, 560); cv.width = w * devicePixelRatio; cv.height = 140 * devicePixelRatio; cv.style.height = '140px'; cx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); paint(); }
  function paint() {
    const all = [...(window.__NET || []), ...NET].sort((a, b) => a.t - b.t);
    const W = cv.width / devicePixelRatio, H = 140;
    cx.clearRect(0, 0, W, H);
    const acc = getComputedStyle(document.body).getPropertyValue('--acc').trim() || '#C00020';
    const last = all.slice(-24);
    const max = Math.max(1000, ...last.map(r => r.ms));
    last.forEach((r, i) => {
      const bw = W / 26, x = (i + 1) * bw, h = Math.max(3, (r.ms / max) * (H - 24));
      cx.fillStyle = r.ok ? acc : '#666'; cx.globalAlpha = r.ok ? .85 : .5;
      cx.fillRect(x, H - h - 12, bw * .6, h);
    });
    cx.globalAlpha = 1; cx.fillStyle = '#5c5c64'; cx.font = '8px ui-monospace,monospace';
    cx.fillText('last ' + last.length + ' real requests · bar height = response time · red ok · grey failed', 8, 10);
    const ok = all.filter(r => r.ok), fail = all.filter(r => !r.ok);
    const avg = ok.length ? Math.round(ok.reduce((s, r) => s + r.ms, 0) / ok.length) : 0;
    $('an-sum').textContent = 'requests this session: ' + all.length + ' · answered: ' + ok.length + ' · failed: ' + fail.length + ' · average answer time: ' + (avg ? avg + 'ms' : '—');
    const byHost = {}; all.forEach(r => byHost[r.host || 'other'] = (byHost[r.host || 'other'] || 0) + 1);
    $('an-det').textContent = 'by host: ' + Object.keys(byHost).map(k => k + ' ' + byHost[k]).join(' · ');
  }
  size(); addEventListener('resize', size, { passive: true });
  $('nav').addEventListener('click', e => { if (e.target.dataset && e.target.dataset.m === 'analytics') setTimeout(paint, 60); });
})();

/* ---------- diagnostics ---------- */
(function diag() {
  arm($('dg-run'));
  $('dg-run').onclick = async () => {
    const out = $('dg-out'); out.innerHTML = '<div class="drow"><span class="dl">STATUS</span><span class="dv">RUNNING…</span></div>';
    const rows = [];
    const add = (l, v, ok) => rows.push('<div class="drow"><span class="dl">' + l + '</span><span class="dv ' + (ok == null ? '' : ok ? 'pass' : 'fail') + '">' + v + '</span></div>');
    add('NETWORK', navigator.onLine ? 'CONNECTED' : 'OFFLINE', navigator.onLine);
    try {
      const t0 = performance.now();
      const r = await fetch('https://text.pollinations.ai/' + encodeURIComponent('ping') + '?model=openai');
      add('RELAY (TEXT POLLINATIONS)', (r.ok ? 'ANSWERING · ' : 'REFUSED · ') + Math.round(performance.now() - t0) + 'ms', r.ok);
    } catch (e) { add('RELAY (TEXT POLLINATIONS)', 'UNREACHABLE: ' + e.message, false); }
    try {
      const est = await navigator.storage.estimate();
      add('STORAGE QUOTA', Math.round((est.quota || 0) / 1048576) + ' MB granted · ' + Math.round((est.usage || 0) / 1048576) + ' MB used', true);
    } catch (e) { add('STORAGE QUOTA', 'unavailable in this browser', null); }
    let bytes = 0; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); bytes += (localStorage.getItem(k) || '').length + k.length; }
    add('LOCAL KEYS', (localStorage.length + ' keys · ' + Math.round(bytes / 1024) + ' KB held', true) ? localStorage.length + ' keys · ' + Math.round(bytes / 1024) + ' KB held' : '', true);
    try {
      const db = await new Promise((res, rej) => { const o = indexedDB.open('etrno-vault', 1); o.onsuccess = () => res(o.result); o.onerror = () => rej(o.error); });
      const st = db.objectStoreNames[0];
      const n = st ? await new Promise(res => { const rq = db.transaction(st, 'readonly').objectStore(st).count(); rq.onsuccess = () => res(rq.result); rq.onerror = () => res('?'); }) : 0;
      add('VAULT (INDEXEDDB)', n + ' items held', n > 0 ? true : null);
    } catch (e) { add('VAULT (INDEXEDDB)', 'not openable: ' + e.message, false); }
    try { const reg = await navigator.serviceWorker.getRegistration(); add('SERVICE WORKER', reg ? (reg.active ? 'ACTIVE · offline shell armed' : 'REGISTERING') : 'NOT REGISTERED', !!reg); } catch (e) { add('SERVICE WORKER', 'unavailable', null); }
    add('VIEWPORT', innerWidth + '×' + innerHeight + ' @ ' + (devicePixelRatio || 1) + 'x', null);
    add('THEME', (document.body.dataset.hl || 'bloodline').toUpperCase(), null);
    out.innerHTML = rows.join('');
  };
})();
