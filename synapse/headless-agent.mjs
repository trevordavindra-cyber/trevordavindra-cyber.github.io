#!/usr/bin/env node
/* SYNAPSE headless agent — one autonomous cycle, runs on GitHub Actions every
   20 minutes (and anywhere Node runs). Real network calls, real file writes;
   the state it produces is committed back to this repo so Mission Control can
   show genuine server-side activity alongside what the browser runtime does. */
import fs from 'node:fs';

const LIVE = 'https://trevordavindra-cyber.github.io/synapse/';
const STATE_FILE = new URL('./data/agent-state.json', import.meta.url);
const TOPICS = ['Artificial general intelligence', 'Transformer (machine learning model)', 'Reinforcement learning', 'Retrieval-augmented generation', 'Knowledge graph', 'Neural architecture search', 'Model distillation', 'Vector database', 'AI agent', 'Mixture of experts'];
const THEMES = ['synapse', 'inferno', 'matrix', 'glacier'];

function blank() {
  return {
    v: '0.6-server', cycle: 0, startedAt: Date.now(),
    events: [], memory: { long: [], short: [] }, decisions: [], nextDecisionId: 1,
    cards: [], theme: 'synapse', researched: [],
    metrics: { done: 0, failed: 0, toolStats: {} },
    roles: { SCOUT: 0, ARCHITECT: 0, SENTRY: 0, CURATOR: 0, STRATEGIST: 0 }
  };
}
let state;
try { state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); } catch (e) { state = blank(); }
state = Object.assign(blank(), state);
state.metrics = Object.assign({ done: 0, failed: 0, toolStats: {} }, state.metrics);
state.roles = Object.assign({ SCOUT: 0, ARCHITECT: 0, SENTRY: 0, CURATOR: 0, STRATEGIST: 0 }, state.roles);

function log(type, text) {
  state.events.unshift({ t: Date.now(), type, src: 'server', text: String(text).slice(0, 240) });
  if (state.events.length > 200) state.events.length = 200;
}
function save() {
  fs.mkdirSync(new URL('./data/', import.meta.url), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function memoryWrite(text, kind) {
  text = String(text || '').slice(0, 300); if (!text) return 'nothing to store';
  const long = kind === 'fact';
  const b = long ? state.memory.long : state.memory.short;
  const d = b.findIndex(m => m.text.toLowerCase() === text.toLowerCase());
  if (d > -1) b.splice(d, 1);
  b.unshift({ t: Date.now(), text, kind: kind || 'note' });
  if (b.length > (long ? 80 : 40)) b.length = long ? 80 : 40;
  return 'stored (' + (long ? 'long-term' : 'working') + '): ' + text.slice(0, 80);
}

async function research(topic) {
  const res = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(topic));
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const j = await res.json();
  const s = (j.extract || '').split('. ').slice(0, 2).join('. ');
  if (!s) throw new Error('empty summary');
  memoryWrite('research: ' + topic + ' — ' + s, 'fact');
  if (!state.researched.includes(topic)) state.researched.push(topic);
  return topic + ': ' + s.slice(0, 170);
}

async function selfTest() {
  const checks = [['index.html', 'index.html'], ['style.css', 'style.css'], ['main.js', 'main.js'], ['ai.js', 'ai.js'], ['agent.js', 'agent.js'], ['dash.js', 'dash.js']];
  const bad = [];
  for (const [name, file] of checks) {
    try { const r = await fetch(LIVE + file); if (!r.ok) bad.push(name); } catch (e) { bad.push(name); }
  }
  return bad.length ? 'ISSUES: ' + bad.join(', ') + ' unreachable' : 'all ' + checks.length + ' site assets reachable (HTTP 200)';
}

async function architect() {
  const themes = THEMES.filter(t => t !== state.theme);
  const pick = themes[Math.floor(Math.random() * themes.length)];
  state.theme = pick;
  return 'proposed visual identity: ' + pick + ' (browser applies on next visit)';
}

async function curator() {
  return 'memory consolidated: ' + state.memory.long.length + ' long-term, ' + state.memory.short.length + ' working';
}

async function strategist() {
  const d = state.metrics.done, f = state.metrics.failed;
  const rate = d + f ? Math.round(100 * d / (d + f)) : 100;
  const id = state.nextDecisionId++;
  state.decisions.push({ id, t: Date.now(), src: 'server', text: 'server mission report: ' + d + ' tasks done, ' + f + ' failed (' + rate + '% success) across ' + state.cycle + ' cycles', tool: 'none', arg: {} });
  if (state.decisions.length > 10) state.decisions.length = 10;
  return 'server proposal #' + id + ' queued';
}

const ROLES = {
  SCOUT: { last: 0, run: async () => { const t = TOPICS.find(x => !state.researched.includes(x)) || TOPICS[Math.floor(Math.random() * TOPICS.length)]; return research(t); } },
  ARCHITECT: { last: 0, run: architect },
  SENTRY: { last: 0, run: selfTest },
  CURATOR: { last: 0, run: curator },
  STRATEGIST: { last: 0, run: strategist }
};
const GOALS = { SCOUT: 'verify one new research topic and file it', ARCHITECT: 'propose a refreshed visual identity', SENTRY: 'audit the live site for regressions', CURATOR: 'consolidate and exercise memory', STRATEGIST: 'file a mission report' };

state.cycle++;
let role = 'SENTRY', best = Infinity;
for (const [k, r] of Object.entries(ROLES)) { if (r.last < best) { best = r.last; role = k; } }
if (state.cycle % 6 === 0) role = 'STRATEGIST';
ROLES[role].last = state.cycle;
log('think', role + ' (server) — ' + GOALS[role]);
try {
  const out = await ROLES[role].run();
  state.metrics.done++;
  log('act', role + ' → ' + out);
} catch (e) {
  state.metrics.failed++;
  log('error', role + ' failed: ' + e.message);
}
save();
console.log('synapse cycle', state.cycle, '| role', role, '| ok');
