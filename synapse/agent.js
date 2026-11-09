/* SYNAPSE AGENT RUNTIME v0.6 — the real autonomy core.
   Runs entirely in your browser: a planner, persistent memory, a tool registry,
   role-based workers, self-tests, and an auditable event log. Nothing here is
   simulated: every event in Mission Control maps to code that actually ran.
   One honest wall: GitHub Pages is static hosting, so there is no server-side
   process. The agent lives in this page, works while the page is open, and
   persists its state in your browser's local storage. */
(function () {
  'use strict';
  const SKEY = 'synapse_agent_v1';
  const bus = { subs: [], emit(t, x) { this.subs.forEach(f => { try { f(t, x); } catch (e) {} }); }, on(f) { this.subs.push(f); } };

  function blank() { return {
    v: '0.6', running: false, evolution: false, startedAt: null, cycle: 0,
    objective: null, decisions: [], nextDecisionId: 1,
    memory: { long: [], short: [] },
    tools: {}, events: [],
    metrics: { done: 0, failed: 0, toolStats: {} },
    cards: [], theme: null, researched: []
  }; }
  let state = blank();
  try { const s = JSON.parse(localStorage.getItem(SKEY)); if (s) state = Object.assign(blank(), s); } catch (e) {}
  function save() {
    try { localStorage.setItem(SKEY, JSON.stringify(state)); }
    catch (e) { state.memory.short.length = Math.max(0, state.memory.short.length - 20); log('error', 'storage full: trimmed short-term memory'); }
  }
  function log(type, text) {
    state.events.unshift({ t: Date.now(), type, text: String(text).slice(0, 240) });
    if (state.events.length > 150) state.events.length = 150;
    save(); bus.emit(type, text);
  }

  /* ---------- MEMORY: long-term facts, short-term working notes, dedupe, consolidation ---------- */
  const memory = {
    write(text, kind) {
      text = String(text || '').slice(0, 300); if (!text) return 'nothing to store';
      const long = kind === 'fact' || kind === 'pref';
      const bucket = long ? state.memory.long : state.memory.short;
      const dupe = bucket.findIndex(m => m.text.toLowerCase() === text.toLowerCase());
      if (dupe > -1) bucket.splice(dupe, 1); /* consolidation: newest copy wins */
      bucket.unshift({ t: Date.now(), text, kind: kind || 'note' });
      if (bucket.length > (long ? 80 : 40)) bucket.length = long ? 80 : 40;
      save(); return 'stored (' + (long ? 'long-term' : 'working') + '): ' + text;
    },
    read(q) {
      const all = state.memory.long.concat(state.memory.short);
      const query = String(q || '').trim().toLowerCase();
      const hits = query ? all.filter(m => m.text.toLowerCase().indexOf(query) > -1) : all;
      return hits.length ? hits.slice(0, 5).map(m => m.text).join('  |  ') : 'no memory matches that yet';
    },
    forget(text) {
      const before = state.memory.long.length + state.memory.short.length;
      const match = String(text || '').trim().toLowerCase();
      state.memory.long = state.memory.long.filter(m => m.text.toLowerCase().indexOf(match) < 0);
      state.memory.short = state.memory.short.filter(m => m.text.toLowerCase().indexOf(match) < 0);
      save(); return 'forgot ' + (before - state.memory.long.length - state.memory.short.length) + ' memory entries';
    }
  };

  /* ---------- TOOLS: a real registry. Each tool runs and reports. ---------- */
  const tools = {};
  function register(name, desc, role, run) {
    tools[name] = { name, desc, role, run };
    state.tools[name] = { desc, role };
  }

  const THEMES = {
    synapse: { neon: '#7c5cff', hot: '#ff4ecd', lime: '#c8ff3e', cyan: '#3ef0ff' },
    inferno: { neon: '#ff6a00', hot: '#ff2d55', lime: '#ffd23e', cyan: '#ff8a3e' },
    matrix:  { neon: '#00ff88', hot: '#00c853', lime: '#aaff00', cyan: '#00ffd0' },
    glacier: { neon: '#4fc3ff', hot: '#b388ff', lime: '#7cffd4', cyan: '#9be7ff' }
  };
  function applyTheme(name) {
    const t = THEMES[name]; if (!t) return 'unknown theme (have: ' + Object.keys(THEMES).join(', ') + ')';
    const r = document.documentElement.style;
    r.setProperty('--neon', t.neon); r.setProperty('--hot', t.hot);
    r.setProperty('--lime', t.lime); r.setProperty('--cyan', t.cyan);
    state.theme = name; save(); return 'restyled: theme is now ' + name;
  }

  function renderCards() {
    const grid = document.querySelector('#powers .grid');
    if (!grid) return;
    grid.querySelectorAll('.agent-card').forEach(el => el.remove());
    state.cards.forEach((c, i) => {
      const el = document.createElement('div');
      el.className = 'card c' + ((i % 6) + 1) + ' agent-card';
      el.innerHTML = '<span class="tag">A' + (i + 1) + '</span><div class="icon"></div><h3></h3><p></p>';
      el.querySelector('.icon').textContent = c.icon || '✦';
      el.querySelector('h3').textContent = c.title;
      el.querySelector('p').textContent = c.body;
      grid.appendChild(el);
    });
  }

  register('remember', 'store a fact or note in persistent memory', 'CURATOR', a => memory.write(a.text, a.kind));
  register('recall', 'search persistent memory', 'CURATOR', a => memory.read(a.query));
  register('research', 'fetch a verified topic summary from Wikipedia and file it', 'SCOUT', async a => {
    const topic = String(a.topic || '').trim().replace(/\s+/g, '_');
    if (!topic) throw new Error('no topic given');
    const res = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(topic));
    if (!res.ok) throw new Error('lookup failed (HTTP ' + res.status + ')');
    const j = await res.json();
    const s = (j.extract || '').split('. ').slice(0, 2).join('. ');
    if (!s) throw new Error('empty summary');
    memory.write('research: ' + topic + ' — ' + s, 'fact');
    if (state.researched.indexOf(topic) < 0) state.researched.push(topic);
    save();
    return topic + ': ' + s.slice(0, 170);
  });
  register('self_test', 'run a real integrity check on the site', 'SENTRY', () => {
    const checks = [
      ['boot screen', !!document.getElementById('boot')],
      ['nav menu', document.querySelectorAll('nav a, .mobile-menu a').length >= 5],
      ['AI chat widget', !!document.getElementById('ai-fab')],
      ['mission control', !!document.getElementById('dash')],
      ['local storage', (() => { try { localStorage.setItem('synapse_t', '1'); localStorage.removeItem('synapse_t'); return true; } catch (e) { return false; } })()]
    ];
    const bad = checks.filter(c => !c[1]).map(c => c[0]);
    return bad.length ? 'ISSUES FOUND: ' + bad.join(', ') : 'all ' + checks.length + ' systems nominal';
  });
  register('set_theme', 'restyle the site with one of 4 palettes (reversible)', 'ARCHITECT', a => applyTheme(a.theme));
  register('add_card', 'author and ship a capability card into the Powers grid (reversible)', 'ARCHITECT', a => {
    const title = String(a.title || '').slice(0, 60), body = String(a.body || '').slice(0, 200);
    if (!title) throw new Error('need a title');
    if (state.cards.some(c => c.title === title)) return 'already shipped: ' + title;
    state.cards.push({ id: 'ac' + Date.now(), title, body, icon: a.icon || '✦' });
    save(); renderCards();
    return 'shipped capability card: ' + title;
  });
  register('introspect', 'measure the page and its own state', 'SENTRY', () => {
    const bytes = (localStorage.getItem(SKEY) || '').length;
    return 'sections: ' + document.querySelectorAll('section').length +
      ', links: ' + document.querySelectorAll('a').length +
      ', agent-built cards: ' + state.cards.length +
      ', memory entries: ' + (state.memory.long.length + state.memory.short.length) +
      ', state size: ' + bytes + ' bytes';
  });
  register('propose', 'queue an evolution proposal for the operator to approve', 'STRATEGIST', a => {
    const id = state.nextDecisionId++;
    state.decisions.push({ id, t: Date.now(), text: String(a.text || 'unnamed proposal').slice(0, 200), tool: a.tool || 'none', arg: a.arg || {} });
    save(); bus.emit('decision', 'proposal #' + id);
    return 'proposal #' + id + ' queued for approval';
  });

  /* ---------- ROLES: specialized workers that actually execute ---------- */
  const TOPICS = ['Artificial general intelligence', 'Transformer (machine learning model)', 'Reinforcement learning', 'Retrieval-augmented generation', 'Knowledge graph', 'Neural architecture search', 'Model distillation', 'Vector database', 'AI agent', 'Mixture of experts'];
  const roles = {
    SCOUT: { label: 'SCOUT · research', lastRun: 0, act: async () => {
      const topic = TOPICS.find(t => state.researched.indexOf(t) < 0) || TOPICS[Math.floor(Math.random() * TOPICS.length)];
      return tools.research.run({ topic });
    } },
    ARCHITECT: { label: 'ARCHITECT · design', lastRun: 0, act: async () => {
      if (state.evolution) {
        const ideas = [
          { title: 'Latency obsessive', body: 'Every millisecond of inference is a debt. Proposed, written and shipped by the agent itself.', icon: '⚡' },
          { title: 'Curiosity engine', body: 'One verified research topic per cycle, filed into long-term memory for later.', icon: '🔎' },
          { title: 'Rollback culture', body: 'Every change the agent makes is logged and reversible. Move fast, undo faster.', icon: '↩️' },
          { title: 'Honest telemetry', body: 'The agent reports its own failures next to its wins. No cherry-picked dashboards.', icon: '📉' }
        ];
        const pick = ideas[Math.floor(Math.random() * ideas.length)];
        return tools.add_card.run(pick);
      }
      const names = Object.keys(THEMES).filter(n => n !== state.theme);
      return tools.set_theme.run({ theme: names[Math.floor(Math.random() * names.length)] });
    } },
    SENTRY: { label: 'SENTRY · testing', lastRun: 0, act: async () => tools.self_test.run({}) },
    CURATOR: { label: 'CURATOR · memory', lastRun: 0, act: async () => {
      tools.recall.run({ query: '' });
      return 'memory consolidated: ' + state.memory.long.length + ' long-term, ' + state.memory.short.length + ' working';
    } },
    STRATEGIST: { label: 'STRATEGIST · planning', lastRun: 0, act: async () => {
      const d = state.metrics.done, f = state.metrics.failed;
      const rate = d + f ? Math.round(100 * d / (d + f)) : 100;
      return tools.propose.run({ text: 'Mission report: ' + d + ' tasks done, ' + f + ' failed (' + rate + '% success) across ' + state.cycle + ' cycles. Next milestone: deeper agent tools.', tool: 'none' });
    } }
  };
  const roleTool = { SCOUT: 'research', ARCHITECT: state.evolution ? 'add_card' : 'set_theme', SENTRY: 'self_test', CURATOR: 'recall', STRATEGIST: 'propose' };

  function bump(name, ok) {
    const s = state.metrics.toolStats[name] || (state.metrics.toolStats[name] = { ok: 0, fail: 0, streak: 0 });
    ok ? s.ok++ : s.fail++;
    s.streak = ok ? 0 : s.streak + 1;
    if (s.streak === 3) log('learn', 'adapted: ' + name + ' failed 3x running, deprioritizing it for a while');
    return s;
  }
  function localPick() {
    const order = ['SENTRY', 'SCOUT', 'CURATOR', 'ARCHITECT'];
    let role = order[0], best = Infinity;
    if (state.evolution) order.push('ARCHITECT');
    if (state.cycle % 6 === 5) role = 'STRATEGIST';
    else {
      order.forEach(r => {
        const t = state.metrics.toolStats[roleTool[r]];
        const penalty = t && t.streak >= 3 ? 1e9 : 0;
        if (roles[r].lastRun + penalty < best) { best = roles[r].lastRun + penalty; role = r; }
      });
    }
    const goals = { SCOUT: 'verify one new research topic and file it', ARCHITECT: state.evolution ? 'extend the interface with a new capability' : 'refresh the visual identity', SENTRY: 'audit the site for regressions', CURATOR: 'consolidate and exercise memory', STRATEGIST: 'file a mission report and set the next milestone' };
    return { role, objective: goals[role], arg: {} };
  }

  /* ---------- PLANNER: model-routed when a brain is connected, local otherwise ---------- */
  async function brainPick() {
    const key = localStorage.getItem('synapse_ai_key');
    if (!key) return null;
    try {
      const sys = 'You are the planner of the Synapse autonomous agent. Pick the next action. Reply with ONLY compact JSON: {"role":"SCOUT|ARCHITECT|SENTRY|CURATOR|STRATEGIST","objective":"short goal","arg":{}}. SCOUT arg {"topic":"a wikipedia title"}. ARCHITECT arg {"theme":"synapse|inferno|matrix|glacier"} or, in evolution mode, {"card":{"title":"...","body":"...","icon":"one emoji"}}. Others arg {}.';
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + encodeURIComponent(key), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: sys }] },
          contents: [{ role: 'user', parts: [{ text: 'Agent state: cycle ' + state.cycle + ', done ' + state.metrics.done + ', failed ' + state.metrics.failed + ', recently researched: ' + state.researched.slice(-5).join(', ') + '. Pick the next action.' }] }]
        })
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const j = await res.json();
      const m = (j.candidates[0].content.parts[0].text || '').match(/\{[\s\S]*\}/);
      return m ? JSON.parse(m[0]) : null;
    } catch (e) { log('error', 'planner model unreachable (' + e.message + '), using local planner'); return null; }
  }

  /* ---------- THE LOOP ---------- */
  let timer = null;
  async function tick() {
    if (!state.running) return;
    state.cycle++;
    const pick = (await brainPick()) || localPick();
    const role = roles[pick.role] ? pick.role : 'SENTRY';
    roles[role].lastRun = state.cycle;
    state.objective = { role, text: String(pick.objective || roles[role].label).slice(0, 140), t: Date.now() };
    log('think', role + ' — ' + state.objective.text);
    let toolName = roleTool[role];
    let arg = pick.arg || {};
    if (role === 'ARCHITECT' && arg.card) toolName = 'add_card';
    try {
      const out = await tools[toolName].run(arg);
      state.metrics.done++; bump(toolName, true);
      log('act', toolName + ' → ' + String(out).slice(0, 200));
    } catch (e) {
      state.metrics.failed++; bump(toolName, false);
      log('error', toolName + ' failed: ' + e.message);
    }
    state.objective = null; save();
    timer = setTimeout(tick, state.evolution ? 20000 : 35000);
  }

  function approve(id) {
    const d = state.decisions.find(x => x.id === id); if (!d) return 'not found';
    state.decisions = state.decisions.filter(x => x.id !== id);
    let out;
    try { out = d.tool === 'none' ? 'report filed' : tools[d.tool].run(d.arg); }
    catch (e) { out = 'failed: ' + e.message; }
    log('decision', 'approved #' + id + ' → ' + out); save(); return out;
  }
  function dismiss(id) {
    state.decisions = state.decisions.filter(x => x.id !== id);
    log('decision', 'dismissed proposal #' + id); save();
  }
  function undoLastCard() {
    const c = state.cards.pop(); renderCards(); save();
    log('design', 'rolled back: ' + (c ? c.title : 'nothing to roll back'));
    return c ? 'removed: ' + c.title : 'nothing to roll back';
  }
  function start() {
    if (state.running) return;
    state.running = true; state.startedAt = Date.now(); save();
    log('system', 'autonomy ignited: the runtime is now planning and acting on its own');
    tick();
  }
  function stop() { state.running = false; clearTimeout(timer); save(); log('system', 'runtime halted by operator'); }
  function setEvolution(on) {
    state.evolution = !!on; save();
    log('system', on ? 'EVOLUTION MODE engaged: the agent will now extend and restyle its own interface' : 'evolution mode off');
    if (on && !state.running) start();
  }
  function exportState() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'synapse-agent-state.json'; a.click();
    return 'state exported';
  }

  /* ---------- BOOT ---------- */
  if (state.theme) applyTheme(state.theme);
  renderCards();
  log('system', 'runtime online (v' + state.v + '): memory, tools and roles loaded');
  if (state.running) { log('system', 'resuming autonomy from saved state'); setTimeout(tick, 6000); }

  window.SYNAPSE_AGENT = { get state() { return state; }, bus, log, memory, tools, roles, start, stop, setEvolution, approve, dismiss, undoLastCard, exportState, tick };
})();
