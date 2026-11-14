/* ILLUMINATI v18.6 phase-2b: live web research with citations + vault document analysis.
   sources are real: duckduckgo instant answers + wikipedia REST. both are CORS-open and keyless. */
const $ = (id) => document.getElementById(id);
const LS = { get(k, d) { try { return JSON.parse(localStorage.getItem(k) || d); } catch (e) { return JSON.parse(d); } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };

async function ai(messages, model = 'openai', maxms = 90000) {
  const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), maxms);
  try {
    const r = await fetch('https://text.pollinations.ai/openai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model, messages }), signal: ctl.signal });
    if (!r.ok) throw new Error('relay answered ' + r.status);
    const j = await r.json();
    return (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || '';
  } catch (e) {
    const sys = (messages.find(m => m.role === 'system') || {}).content || '';
    const usr = messages.filter(m => m.role === 'user').map(m => m.content).join('\n') || '';
    const r2 = await fetch('https://text.pollinations.ai/' + encodeURIComponent((sys ? sys + '\n\n' : '') + usr).slice(0, 1800) + '?model=' + model, { signal: ctl.signal });
    if (!r2.ok) throw new Error('relay answered ' + r2.status);
    return await r2.text();
  } finally { clearTimeout(to); }
}
const esc = s => String(s).replace(/</g, '&lt;');
const arm = b => { b.dataset.t = b.textContent; };
const busy = (b, on, t) => { b.disabled = on; b.textContent = on ? (t || 'WORKING\u2026') : b.dataset.t; };

/* ---------- live web research with citations ---------- */
(function webResearch() {
  const sec = $('m-research'); if (!sec) return;
  const row = sec.querySelector('.prow'); if (!row) return;
  const btn = document.createElement('button'); btn.className = 'pbtn'; btn.id = 'web-run'; btn.textContent = 'WEB PASS + CITATIONS'; arm(btn); row.appendChild(btn);
  btn.onclick = async () => {
    const q = $('rs-q').value.trim(); if (!q) return;
    busy(btn, true, 'SCANNING WEB\u2026');
    const out = $('rs-out');
    out.innerHTML = '<div class="acard"><div class="ahd"><b>WEB PASS</b><span class="astat run">GATHERING SOURCES</span></div><div class="abody">querying duckduckgo answers and wikipedia\u2026</div></div>';
    const cites = [];
    try {
      const j = await (await fetch('https://api.duckduckgo.com/?q=' + encodeURIComponent(q) + '&format=json&no_redirect=1&skip_disambig=1')).json();
      if (j.AbstractText && j.AbstractURL) cites.push({ t: (j.Heading || 'DuckDuckGo') + ' \u2014 instant answer', u: j.AbstractURL, s: j.AbstractText });
      (j.RelatedTopics || []).slice(0, 6).forEach(rt => { if (rt.FirstURL && rt.Text) cites.push({ t: 'DuckDuckGo related', u: rt.FirstURL, s: rt.Text }); });
    } catch (e) {}
    try {
      const w = await (await fetch('https://en.wikipedia.org/w/rest.php/v1/search/page?q=' + encodeURIComponent(q) + '&limit=5')).json();
      (w.pages || []).forEach(p => cites.push({ t: p.title + ' \u2014 wikipedia', u: 'https://en.wikipedia.org/wiki/' + p.key, s: (p.excerpt || '').replace(/<[^>]+>/g, '').slice(0, 500) }));
    } catch (e) {}
    const card = out.firstElementChild;
    if (!cites.length) {
      card.querySelector('.astat').className = 'astat err'; card.querySelector('.astat').textContent = 'NO SOURCES';
      card.querySelector('.abody').textContent = 'no live source answered for this query. run the ordinary research pass instead \u2014 the order will say plainly that it is model knowledge.';
      busy(btn, false); return;
    }
    card.querySelector('.astat').textContent = 'SYNTHESIZING (' + cites.length + ' SOURCES)';
    try {
      const txt = await ai([
        { role: 'system', content: 'You are a research assistant. Ground every factual claim ONLY in the numbered source extracts provided. Cite each claim like [1], [2] matching its source. If the sources do not cover something, say so plainly instead of guessing. Write tight.' },
        { role: 'user', content: 'QUESTION: ' + q + '\n\nSOURCES:\n' + cites.map((c, i) => '[' + (i + 1) + '] ' + c.t + '\nURL: ' + c.u + '\nEXTRACT: ' + c.s).join('\n\n') + '\n\nWrite the grounded answer with [n] citations.' }
      ]);
      card.querySelector('.astat').className = 'astat ok'; card.querySelector('.astat').textContent = 'DONE \u00b7 ' + cites.length + ' SOURCES';
      const body = card.querySelector('.abody');
      body.innerHTML = esc(txt).replace(/\[(\d+)\]/g, '<b>[$1]</b>').replace(/\n/g, '<br>');
      const src = document.createElement('div'); src.className = 'pline';
      src.innerHTML = '<b>SOURCES \u2014 open them yourself; the relay only saw these extracts</b><br>' + cites.map((c, i) => '[' + (i + 1) + '] <a href="' + c.u + '" target="_blank" rel="noopener">' + esc(c.u) + '</a> \u2014 ' + esc(c.t)).join('<br>');
      card.appendChild(src);
      const log = LS.get('hl31-weblog', '[]'); log.unshift({ d: Date.now(), q: q, n: cites.length }); LS.set('hl31-weblog', log.slice(0, 40));
    } catch (e) {
      card.querySelector('.astat').className = 'astat err'; card.querySelector('.astat').textContent = 'FAILED';
      card.querySelector('.abody').textContent = 'sources gathered (' + cites.length + ') but the relay refused the synthesis: ' + e.message + '\n\n' + cites.map((c, i) => '[' + (i + 1) + '] ' + c.u + ' \u2014 ' + esc(c.s)).join('\n');
    }
    busy(btn, false);
  };
})();

/* ---------- vault document analysis ---------- */
(function vaultAnalysis() {
  const sec = $('m-vault'); if (!sec) return;
  if ($('v-an')) return;
  const blk = document.createElement('div');
  blk.innerHTML = '<h3>DOCUMENT ANALYSIS</h3><div class="pline">text files, code, json, csv and md in the vault get read locally and analyzed by the order. images cannot be machine-read through the free relay (it refused image input when tested), so photos stay untouched.</div><div class="prow"><button id="v-an" class="pbtn">READ VAULT FILES</button></div><div id="v-anout"></div>';
  sec.appendChild(blk);
  $('v-an').onclick = async () => {
    const out = $('v-anout'); out.textContent = 'opening the vault\u2026';
    let recs = [];
    try {
      const db = await new Promise((res, rej) => { const r = indexedDB.open('etrno-vault', 1); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
      recs = await new Promise((res, rej) => { const rq = db.transaction('files', 'readonly').objectStore('files').getAll(); rq.onsuccess = () => res(rq.result || []); rq.onerror = () => rej(rq.error); });
    } catch (e) { out.textContent = 'the vault would not open: ' + e.message; return; }
    if (!recs.length) { out.textContent = 'the vault is empty.'; return; }
    out.innerHTML = '';
    const TEXT = /(^(text\/|application\/(json|javascript|xml|x-yaml))|(\.(txt|md|json|csv|js|css|html|xml|yaml|yml|py|rb|sh|log)))/i;
    recs.forEach((rec, i) => {
      const name = rec.name || rec.filename || ('item ' + (i + 1));
      const type = rec.type || rec.mime || '';
      const isText = TEXT.test(type) || TEXT.test(name);
      const row = document.createElement('div'); row.className = 'taskrow';
      row.innerHTML = '<span style="flex:1">' + esc(name) + (type ? ' \u00b7 ' + esc(type) : '') + (isText ? '' : ' \u00b7 not machine-readable here') + '</span>';
      out.appendChild(row);
      if (isText) {
        const b = document.createElement('button'); b.textContent = 'ANALYZE';
        const res = document.createElement('div'); res.className = 'pline';
        b.onclick = async () => {
          b.disabled = true; b.textContent = 'READING\u2026';
          try {
            let content = '';
            if (rec.data instanceof Blob) content = await rec.data.text();
            else if (typeof rec.data === 'string' && rec.data.startsWith('data:')) { const blob = await (await fetch(rec.data)).blob(); content = await blob.text(); }
            else if (typeof rec.data === 'string') content = rec.data;
            else if (rec.data instanceof ArrayBuffer) content = new TextDecoder().decode(rec.data);
            else if (rec.text != null) content = String(rec.text);
            if (!content.trim()) throw new Error('no readable text in this file');
            b.textContent = 'ANALYZING\u2026';
            const txt = await ai([
              { role: 'system', content: 'You are a document analyst. Analyze the material below: what it is, its key points, and anything notable (errors, structure, claims needing verification). Be concrete.' },
              { role: 'user', content: 'FILE: ' + name + '\n\n' + content.slice(0, 12000) }
            ]);
            res.innerHTML = '<b>' + esc(name) + ':</b><br>' + esc(txt).replace(/\n/g, '<br>');
            b.textContent = 'RE-ANALYZE'; b.disabled = false;
          } catch (e) { res.textContent = name + ': analysis failed \u2014 ' + e.message; b.disabled = false; b.textContent = 'ANALYZE'; }
        };
        row.appendChild(b); row.appendChild(res);
      }
    });
  };
})();

/* restores the startup cinema close (skip button + auto-close), missing since v18. additive only. */
(function(){
  const c = document.getElementById('cine');
  if (!c) return;
  const RM = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  let UIp = {};
  try { UIp = JSON.parse(localStorage.getItem('hl28-ui') || '{}'); } catch (e) {}
  const done = () => { c.classList.add('out'); setTimeout(() => c.remove(), 950); };
  if (UIp.cine === 0 || RM()) { c.remove(); return; }
  const s = document.getElementById('c-skip');
  if (s) s.addEventListener('click', done);
  setTimeout(done, 3600);
})();