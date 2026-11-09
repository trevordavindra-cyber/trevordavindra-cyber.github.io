/* SYNAPSE MISSION CONTROL v0.6 — a live dashboard wired to the real runtime.
   Every number and event here is read straight out of the agent's state.
   No fake activity, no simulated logs. */
(function () {
  const A = window.SYNAPSE_AGENT;
  const host = document.getElementById('dash');
  if (!A || !host) return;

  const css = `
.mc{border:1px solid var(--line);border-radius:var(--radius);background:var(--card);padding:26px;box-shadow:0 30px 90px rgba(0,0,0,.45)}
.mc-top{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;margin-bottom:22px}
.mc-status{display:flex;align-items:center;gap:10px;font-family:'IBM Plex Mono',monospace;font-size:.85rem;letter-spacing:.12em;text-transform:uppercase}
.mc-dot{width:10px;height:10px;border-radius:50%;background:var(--dim)}
.mc-dot.on{background:var(--lime);box-shadow:0 0 12px var(--lime);animation:mcblink 1.6s infinite}
@keyframes mcblink{0%,100%{opacity:1}50%{opacity:.35}}
.mc-btns{display:flex;gap:10px;flex-wrap:wrap}
.mc-btns button{background:none;border:1px solid var(--line);color:var(--ink);border-radius:100px;padding:9px 18px;font-size:.82rem;cursor:pointer;font-family:'Space Grotesk',sans-serif;transition:all .2s}
.mc-btns button:hover{border-color:var(--lime);color:var(--lime)}
.mc-btns button.on{background:var(--lime);color:#07070c;border-color:var(--lime);font-weight:600}
.mc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}
.mc-box{border:1px solid var(--line);border-radius:14px;padding:18px;background:rgba(255,255,255,.02);min-width:0}
.mc-box h4{font-family:'IBM Plex Mono',monospace;font-size:.68rem;color:var(--lime);letter-spacing:.18em;text-transform:uppercase;margin-bottom:12px}
.mc-wide{grid-column:1/-1}
.mc-dim{color:var(--dim);font-size:.9rem;line-height:1.55}
.mc-num{display:flex;gap:22px;flex-wrap:wrap}
.mc-num div b{display:block;font-size:1.6rem;color:var(--ink)}
.mc-num div span{font-family:'IBM Plex Mono',monospace;font-size:.62rem;color:var(--dim);letter-spacing:.12em;text-transform:uppercase}
.mc-feed{max-height:300px;overflow-y:auto;font-family:'IBM Plex Mono',monospace;font-size:.78rem;line-height:1.8}
.mc-feed div{border-bottom:1px dashed rgba(255,255,255,.06);padding:3px 0}
.mc-feed .tt{color:var(--dim);margin-right:10px}
.mc-feed .think{color:var(--cyan)}
.mc-feed .act{color:var(--lime)}
.mc-feed .error{color:var(--hot)}
.mc-feed .decision,.mc-feed .learn{color:var(--hot)}
.mc-feed .design{color:var(--neon)}
.mc-feed .system{color:var(--ink)}
.mc-list{font-size:.82rem;line-height:1.7;color:var(--dim)}
.mc-list b{color:var(--ink);font-weight:600}
.mc-list .mc-row{display:flex;justify-content:space-between;gap:10px;border-bottom:1px dashed rgba(255,255,255,.06);padding:6px 0;align-items:center}
.mc-list button{background:none;border:1px solid var(--line);color:var(--dim);border-radius:8px;font-size:.68rem;padding:4px 10px;cursor:pointer}
.mc-list button:hover{color:var(--hot);border-color:var(--hot)}
.mc-dec{border:1px solid rgba(255,78,205,.35);border-radius:12px;padding:12px 14px;margin-bottom:10px;font-size:.86rem}
.mc-dec .mc-dbtns{margin-top:8px;display:flex;gap:8px}
.mc-dec .mc-dbtns button{background:var(--lime);color:#07070c;border:none;border-radius:8px;padding:6px 14px;font-weight:600;cursor:pointer;font-size:.78rem}
.mc-dec .mc-dbtns button+button{background:none;border:1px solid var(--line);color:var(--dim);font-weight:400}
`;
  document.head.appendChild(Object.assign(document.createElement('style'), { textContent: css }));

  host.innerHTML = `
  <div class="mc">
    <div class="mc-top">
      <div class="mc-status"><span class="mc-dot" id="mc-dot"></span><span id="mc-state">checking…</span></div>
      <div class="mc-btns">
        <button id="mc-run">Ignite autonomy</button>
        <button id="mc-evo">Evolution mode</button>
        <button id="mc-step">Run one cycle</button>
        <button id="mc-undo">Rollback last change</button>
        <button id="mc-export">Export state</button>
      </div>
    </div>
    <div class="mc-grid">
      <div class="mc-box"><h4>Current objective</h4><div id="mc-obj" class="mc-dim">idle — nothing queued</div></div>
      <div class="mc-box"><h4>Metrics</h4><div id="mc-metrics" class="mc-num"></div></div>
      <div class="mc-box mc-wide"><h4>Live activity feed</h4><div id="mc-feed" class="mc-feed"></div></div>
      <div class="mc-box mc-wide"><h4>Pending decisions (need your approval)</h4><div id="mc-dec" class="mc-dim">none</div></div>
      <div class="mc-box"><h4>Tool registry</h4><div id="mc-tools" class="mc-list"></div></div>
      <div class="mc-box"><h4>Memory (inspect · correct · forget)</h4><div id="mc-mem" class="mc-list"></div></div>
    </div>
  </div>`;

  const $ = id => document.getElementById(id);
  const ts = t => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  function refresh() {
    const s = A.state;
    const runBtn = $('mc-run');
    $('mc-state').textContent = s.running ? (s.evolution ? 'RUNNING · EVOLUTION' : 'RUNNING') : 'IDLE';
    $('mc-dot').classList.toggle('on', s.running);
    runBtn.textContent = s.running ? 'Halt' : 'Ignite autonomy';
    $('mc-evo').classList.toggle('on', s.evolution);
    $('mc-evo').textContent = s.evolution ? 'Evolution mode: ON' : 'Evolution mode';
    $('mc-obj').textContent = s.objective ? s.objective.role + ' — ' + s.objective.text : 'idle — nothing queued';
    const up = s.startedAt && s.running ? Math.round((Date.now() - s.startedAt) / 60000) : 0;
    $('mc-metrics').innerHTML =
      '<div><b>' + s.cycle + '</b><span>cycles</span></div>' +
      '<div><b>' + s.metrics.done + '</b><span>done</span></div>' +
      '<div><b>' + s.metrics.failed + '</b><span>failed</span></div>' +
      '<div><b>' + (s.memory.long.length + s.memory.short.length) + '</b><span>memories</span></div>' +
      '<div><b>' + up + '</b><span>min uptime</span></div>';
    $('mc-feed').innerHTML = s.events.slice(0, 30).map(e =>
      '<div><span class="tt">' + ts(e.t) + '</span><span class="' + e.type + '">' + e.type.toUpperCase() + '</span> ' +
      e.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>').join('') || '<div class="mc-dim">no events yet — hit “Run one cycle” or ignite</div>';
    const dec = $('mc-dec');
    dec.innerHTML = '';
    if (!s.decisions.length) dec.innerHTML = 'none';
    s.decisions.forEach(d => {
      const div = document.createElement('div'); div.className = 'mc-dec';
      div.innerHTML = '<div></div><div class="mc-dbtns"><button>Approve + execute</button><button>Dismiss</button></div>';
      div.firstChild.textContent = '#' + d.id + ' · ' + d.text;
      div.querySelector('.mc-dbtns button').addEventListener('click', () => { A.approve(d.id); refresh(); });
      div.querySelector('.mc-dbtns button+button').addEventListener('click', () => { A.dismiss(d.id); refresh(); });
      dec.appendChild(div);
    });
    $('mc-tools').innerHTML = Object.keys(A.tools).map(n => {
      const t = A.tools[n], st = s.metrics.toolStats[n];
      return '<div class="mc-row"><span><b>' + n + '</b> · ' + t.role + '<br>' + t.desc + '</span><span>' + (st ? st.ok + '✓ ' + st.fail + '✗' : 'unused') + '</span></div>';
    }).join('');
    const mem = s.memory.long.concat(s.memory.short);
    $('mc-mem').innerHTML = mem.length ? '' : '<div class="mc-dim">memory is empty — the agent files research and notes here as it works</div>';
    mem.slice(0, 12).forEach(m => {
      const div = document.createElement('div'); div.className = 'mc-row';
      const span = document.createElement('span');
      span.innerHTML = '<b>' + (m.kind === 'fact' ? 'fact' : m.kind === 'pref' ? 'pref' : 'note') + '</b> ';
      span.appendChild(document.createTextNode(m.text));
      const btn = document.createElement('button'); btn.textContent = 'forget';
      btn.addEventListener('click', () => { A.memory.forget(m.text); refresh(); });
      div.appendChild(span); div.appendChild(btn);
      $('mc-mem').appendChild(div);
    });
  }

  $('mc-run').addEventListener('click', () => { A.state.running ? A.stop() : A.start(); refresh(); });
  $('mc-evo').addEventListener('click', () => { A.setEvolution(!A.state.evolution); refresh(); });
  $('mc-step').addEventListener('click', () => { A.tick(); setTimeout(refresh, 800); });
  $('mc-undo').addEventListener('click', () => { A.undoLastCard(); refresh(); });
  $('mc-export').addEventListener('click', () => { A.exportState(); });
  A.bus.on(() => refresh());
  refresh();
  setInterval(refresh, 5000);
})();
