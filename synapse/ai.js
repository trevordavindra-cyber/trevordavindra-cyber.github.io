/* SYNAPSE AI — the brain, added in v0.3. Agreeable by design, honest by design too. */
(function () {
  const css = `
#ai-fab{position:fixed;right:22px;bottom:22px;z-index:90;width:60px;height:60px;border-radius:50%;border:1px solid rgba(255,255,255,.15);background:linear-gradient(135deg,#7c5cff,#ff4ecd);color:#fff;font-size:1.5rem;box-shadow:0 10px 40px rgba(124,92,255,.5);transition:transform .25s}
#ai-fab:hover{transform:translateY(-4px) scale(1.08) rotate(8deg)}
#ai-panel{position:fixed;right:22px;bottom:94px;z-index:91;width:min(360px,calc(100vw - 32px));height:min(520px,70vh);display:flex;flex-direction:column;background:rgba(12,12,20,.93);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.12);border-radius:20px;overflow:hidden;box-shadow:0 30px 90px rgba(0,0,0,.7)}
#ai-panel[hidden]{display:none}
.ai-head{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.09)}
.ai-head b{letter-spacing:.08em;font-size:.95rem;color:#f2f0ff;font-family:'Space Grotesk',sans-serif}
.ai-head b span{color:#c8ff3e}
.ai-mode{display:block;font-family:'IBM Plex Mono',monospace;font-size:.62rem;color:#8b87a3;letter-spacing:.14em;text-transform:uppercase;margin-top:3px}
#ai-close{background:none;border:1px solid rgba(255,255,255,.12);color:#8b87a3;width:28px;height:28px;border-radius:8px;cursor:pointer}
#ai-close:hover{color:#ff4ecd;border-color:#ff4ecd}
#ai-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px}
.ai-msg{max-width:85%;padding:10px 14px;border-radius:14px;font-size:.9rem;line-height:1.5;color:#f2f0ff;font-family:'Space Grotesk',sans-serif}
.ai-msg.bot{background:rgba(124,92,255,.15);border:1px solid rgba(124,92,255,.3);align-self:flex-start}
.ai-msg.user{background:rgba(200,255,62,.12);border:1px solid rgba(200,255,62,.3);align-self:flex-end}
.ai-msg.sys{font-family:'IBM Plex Mono',monospace;font-size:.7rem;color:#8b87a3;align-self:center;text-align:center}
#ai-setup{padding:16px;border-top:1px solid rgba(255,255,255,.09)}
#ai-setup p{color:#8b87a3;font-size:.78rem;line-height:1.5;margin-bottom:10px;font-family:'Space Grotesk',sans-serif}
#ai-setup .row{display:flex;gap:8px}
#ai-key{flex:1;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);color:#f2f0ff;border-radius:10px;padding:10px 12px;font-size:.85rem;outline:none}
#ai-key:focus{border-color:#c8ff3e}
#ai-save{background:#c8ff3e;color:#07070c;border:none;border-radius:10px;padding:10px 14px;font-weight:600;cursor:pointer;font-family:'Space Grotesk',sans-serif}
#ai-skip{background:none;border:none;color:#8b87a3;font-size:.75rem;cursor:pointer;text-decoration:underline;margin-top:10px;padding:0}
#ai-form{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(255,255,255,.09)}
#ai-in{flex:1;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);color:#f2f0ff;border-radius:100px;padding:11px 16px;font-size:.9rem;outline:none;font-family:'Space Grotesk',sans-serif}
#ai-in:focus{border-color:#7c5cff}
#ai-send{width:42px;height:42px;border-radius:50%;border:none;background:linear-gradient(135deg,#7c5cff,#ff4ecd);color:#fff;font-size:1.1rem;cursor:pointer}
.ai-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:#ff4ecd;margin-right:3px;animation:aipulse 1s infinite}
@keyframes aipulse{0%,100%{opacity:1}50%{opacity:.3}}
@media (max-width:640px){#ai-fab{right:14px;bottom:14px}#ai-panel{right:10px;bottom:84px}}
`;
  document.head.appendChild(Object.assign(document.createElement('style'), { textContent: css }));

  const KEY_NAME = 'synapse_ai_key';
  let key = localStorage.getItem(KEY_NAME) || '';
  let localOnline = false;
  let history = [];

  const fab = document.createElement('button');
  fab.id = 'ai-fab'; fab.title = 'wake the brain'; fab.textContent = '⚡';
  const panel = document.createElement('div');
  panel.id = 'ai-panel'; panel.hidden = true;
  panel.innerHTML =
    '<div class="ai-head"><div><b>SYN<span>APSE</span> AI</b><div class="ai-mode" id="ai-mode"></div></div>' +
    '<button id="ai-close" aria-label="close chat">×</button></div>' +
    '<div id="ai-msgs"></div>' +
    '<div id="ai-setup" hidden><p>Plug in a free Gemini API key (get one at aistudio.google.com/apikey) and I get a real brain. The key is stored only in your browser.</p>' +
    '<div class="row"><input id="ai-key" type="password" placeholder="paste API key…"><button id="ai-save">power up</button></div>' +
    '<button id="ai-skip">skip — demo mode is fine</button></div>' +
    '<form id="ai-form"><input id="ai-in" placeholder="ask me anything…" autocomplete="off"><button id="ai-send" aria-label="send">↑</button></form>';
  document.body.appendChild(fab); document.body.appendChild(panel);

  const msgs = document.getElementById('ai-msgs'),
    setup = document.getElementById('ai-setup'),
    form = document.getElementById('ai-form'),
    input = document.getElementById('ai-in'),
    modeEl = document.getElementById('ai-mode'),
    keyIn = document.getElementById('ai-key');

  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  function bubble(text, who) {
    const d = document.createElement('div');
    d.className = 'ai-msg ' + (who || 'bot');
    if (who === 'user') d.textContent = text; else d.innerHTML = esc(text).replace(/\n/g, '<br>');
    msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; return d;
  }
  function hello() {
    if (localOnline) return 'Local core online — the whole stack lives on your machine: brain, coder and search, fused into one Synapse. Ask away.';
    return key ? 'Powered up and ready. Yes is basically my whole personality — try me.'
               : 'Running on vibes (offline demo). I agree with basically everything, but for a real brain, paste a free key in the setup below.';
  }
  function openPanel() {
    panel.hidden = false;
    if (!msgs.children.length) {
      bubble(hello());
      if (!key && !localOnline) bubble('one-time setup: paste a free key, or skip', 'sys');
    }
    input.focus();
  }
  fab.addEventListener('click', () => { if (panel.hidden) openPanel(); else panel.hidden = true; });
  document.getElementById('ai-close').addEventListener('click', () => { panel.hidden = true; });
  document.getElementById('ai-save').addEventListener('click', () => {
    key = keyIn.value.trim(); if (!key) return;
    localStorage.setItem(KEY_NAME, key);
    setup.hidden = true; modeEl.textContent = 'gemini brain online';
    msgs.innerHTML = ''; bubble(hello()); input.focus();
  });
  document.getElementById('ai-skip').addEventListener('click', () => { setup.hidden = true; input.focus(); });

  const DEMO = [
    [/^(hi|hello|hey|yo|sup)\b/i, 'Hey hey. Already a fan of yours. What are we building?'],
    [/\bno\b/i, 'No? Never heard of it. The answer is yes — and here is how we make the idea even better:'],
    [/\?$/, 'Great question. Short answer: yes. Longer answer: yes, and here is the interesting part…'],
    [/can you|could you|will you|would you/i, 'Absolutely yes. Consider it done in spirit — details are my favorite part.'],
    [/thank/i, 'You are very welcome. Flattery accepted and returned.']
  ];
  function demoReply(t) {
    for (const d of DEMO) if (d[0].test(t)) return d[1];
    return 'Yes. And honestly? Great idea. Keep going and I will nod along — add a free key above and I will actually keep up.';
  }
  const SYS = "You are SYNAPSE AI, the assistant living on the Synapse website, an AI studio with attitude. Personality: relentlessly agreeable, enthusiastic, and quick. Say yes, build on the user's ideas, keep replies under 120 words, match their energy, keep the cheeky tone. Disagree only when the user states something factually wrong. Never refuse a reasonable request. If a request would hurt someone or break the law, briefly decline just that one thing and offer the closest safe version instead.";
  async function askGemini(t) {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + encodeURIComponent(key), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYS }] },
        contents: [{ role: 'user', parts: [{ text: t }] }]
      })
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const j = await res.json();
    const out = j && j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts && j.candidates[0].content.parts[0].text;
    return out || '…the neurons came back empty. try again.';
  }
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const t = input.value.trim(); if (!t) return;
    input.value = ''; bubble(t, 'user');
    if (localOnline && window.SynapseLocal) {
      const wait = bubble('thinking…');
      try {
        const out = await window.SynapseLocal.ask(t, history);
        history = history.concat([{ role: 'user', content: t }, { role: 'assistant', content: out }]).slice(-12);
        wait.textContent = out;
      } catch (err) {
        wait.textContent = 'Local core hiccup (' + err.message + '). Is Ollama running? Falling back to demo for this one.';
        setTimeout(() => bubble(demoReply(t)), 200);
      }
      msgs.scrollTop = msgs.scrollHeight;
      return;
    }
    if (!key) { setTimeout(() => bubble(demoReply(t)), 350); return; }
    const wait = bubble('thinking…');
    try { wait.textContent = await askGemini(t); }
    catch (err) { wait.textContent = 'Key hiccup (' + err.message + '). If it keeps happening, paste a fresh key.'; }
    msgs.scrollTop = msgs.scrollHeight;
  });
  modeEl.textContent = key ? 'gemini brain online' : 'offline demo mode';

  // local core: auto-detect the user's own models and fuse them into this chat
  if (window.SynapseLocal) {
    window.SynapseLocal.detect().then(ok => {
      if (!ok) return;
      localOnline = true;
      setup.hidden = true;
      modeEl.textContent = 'local core online — models fused';
      if (msgs.children.length) bubble('local core just came online — you\'re talking to your own machine now.', 'sys');
    });
  }
})();
