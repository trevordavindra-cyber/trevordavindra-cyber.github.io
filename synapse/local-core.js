/* SYNAPSE LOCAL CORE — the fusion layer.
   Detects the models installed on your machine (via Ollama) and presents them
   as ONE assistant: conversation to the brain, code to the coder, facts from
   SearXNG. The user talks to a single Synapse; the routing is invisible. */
(function () {
  const OLLAMA = 'http://localhost:11434';
  let models = null, brain = null, coder = null, searchUrl = '';

  async function detect() {
    // optional config written by the installer
    try {
      const cfgRes = await fetch('synapse-local.json', { cache: 'no-store' });
      if (cfgRes.ok) { const cfg = await cfgRes.json(); if (cfg && cfg.search) searchUrl = cfg.search; }
    } catch (e) { /* no config file — fine */ }
    try {
      const r = await fetch(OLLAMA + '/api/tags', { signal: AbortSignal.timeout(2500) });
      if (!r.ok) return false;
      const j = await r.json();
      models = (j.models || []).map(m => m.name);
      if (!models.length) return false;
      brain = models.find(n => /uncensored/i.test(n))
            || models.find(n => /dolphin/i.test(n))
            || models.find(n => /abliterated/i.test(n))
            || models[0];
      coder = models.find(n => /coder/i.test(n)) || brain;
      return true;
    } catch (e) { return false; }
  }

  const CODE_RE = /\b(code|coding|function|bug|debug|script|program|css|html|javascript|python|refactor|api|regex|sql|error|stack trace)\b/i;
  const SEARCH_RE = /\b(search|google|latest|news|today|current|who is|what happened|price of|weather|when did)\b/i;

  async function webSearch(q) {
    if (!searchUrl) return '';
    try {
      const r = await fetch(searchUrl + '?q=' + encodeURIComponent(q) + '&format=json', { signal: AbortSignal.timeout(6000) });
      if (!r.ok) return '';
      const j = await r.json();
      return (j.results || []).slice(0, 5).map(x => '- ' + x.title + ': ' + x.url).join('\n');
    } catch (e) { return ''; }
  }

  async function ask(text, history) {
    let context = '';
    if (SEARCH_RE.test(text)) {
      const hits = await webSearch(text);
      if (hits) context = 'Fresh web results (use and cite them when relevant):\n' + hits + '\n\n';
    }
    const isCode = CODE_RE.test(text);
    const model = isCode ? coder : brain;
    const persona = isCode
      ? 'You are SYNAPSE, one unified AI. For this request your coding specialist is answering: be direct, correct and concise, give working code in fenced blocks.'
      : "You are SYNAPSE, one unified AI running fully on the user's own machine. Confident, warm, quick, with a little attitude. Keep replies under 150 words unless depth is asked for.";
    const sys = persona + '\nYou are a fusion of several local models: a general brain (' + brain + '), a coding specialist (' + coder + ') and live web search. Answer as one assistant; never mention being multiple models or which model is speaking.';
    const messages = [{ role: 'system', content: sys }]
      .concat((history || []).slice(-6))
      .concat([{ role: 'user', content: context + text }]);
    const res = await fetch(OLLAMA + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, options: { temperature: isCode ? 0.2 : 0.8 }, stream: false, messages })
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const j = await res.json();
    return (j.message && j.message.content) || '…the neurons came back empty. try again.';
  }

  window.SynapseLocal = { detect, ask, info: () => ({ online: !!models, brain, coder, search: searchUrl }) };
})();
