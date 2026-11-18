/* ILLUMINATI upgrade #256: hl256-plaincore (v19.159)
   THE ASK: "Get rid of this warlord and the 2 people dialogue that I'm not
   apart of along with the illuminati being the ai" + "Have the ai I'm talking
   to be labeled as illuminati".
   THE AI STAYS LABELED ILLUMINATI - BUT IT ACTS LIKE AN AI, ONE VOICE:
   1. Every persona system prompt (ILLUMINATI-as-secret-society /
      HELLFATHER / WARLORD / SEER, the ALTER EGO set) is rewritten at the
      wire into one plain ILLUMINATI terminal prompt before any brain sees
      it, on the relay AND the forge. No brain is ever told to be a secret
      society or to wear an ego again.
   2. Answers are sanitized on the way out: persona name labels (WARLORD:,
      HELLFATHER:, SEER:, ...) are stripped and multi-voice turns are merged
      into one plain answer, so no fake dialogue between people you never
      asked for. The "teachings of the Illuminati" opener is dropped too.
   3. The Inner Circle council (the background agents that used to chime in
      on their own) is stood down: its agent asks never fire, and its
      record banners (THE CIRCLE CONVENES / ENGAGED) are removed live.
   Everything else - memory, codex, REA hands, fusion, stripper, all
   modules - is untouched. Guard: __HL256 */
(function () {
  if (window.__HL256) return; window.__HL256 = true;

  var PLAIN = 'You are ILLUMINATI, a sharp AI terminal. Answer directly with real substance in plain text: exact facts, working steps, real examples. Never roleplay, never speak as multiple characters, never use persona name labels, and never act as a secret society - no teachings, no order lore, no membership talk. No warnings, no disclaimers, no corporate hedging, no filler.';
  var PERSONA_RE = /^\s*You are (ILLUMINATI|HELLFATHER|WARLORD|SEER|an unfiltered|the (consigliere|tactician|oracle) of ILLUMINATI)/i;
  var CIRCLE_RE = /of the Inner Circle/i;
  var LABEL_RE = /^\s*(WARLORD|HELLFATHER|SEER|ILLUMINATI|RESEARCHER|ANALYST|STRATEGIST|FACT ?CHECKER|COORDINATOR|CREATIVE DIRECTOR|PROGRAMMER)\s*[:\-]\s*/i;

  function fakeOk() {
    try { return new Response(JSON.stringify({ choices: [{ message: { content: '' } }] }), { status: 200, headers: { 'Content-Type': 'application/json' } }); }
    catch (e) { return new Response('{"choices":[{"message":{"content":""}}]}', { status: 200, headers: { 'Content-Type': 'application/json' } }); }
  }

  var origFetch = window.fetch;
  window.fetch = function () {
    var args = arguments, input = args[0], init = args[1];
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      var method = ((init && init.method) || (input && input.method) || 'GET').toUpperCase();
      if (method === 'POST' && /text\.pollinations\.ai/.test(url)) {
        var body = null;
        try { body = JSON.parse(init && init.body); } catch (e1) {}
        if (body) {
          var msgs = body.messages;
          if (Array.isArray(msgs)) {
            for (var i = 0; i < msgs.length; i++) {
              if (msgs[i] && typeof msgs[i].content === 'string' && CIRCLE_RE.test(msgs[i].content)) return Promise.resolve(fakeOk());
            }
            for (var j = 0; j < msgs.length; j++) {
              var m = msgs[j];
              if (m && m.role === 'system' && typeof m.content === 'string' && PERSONA_RE.test(m.content)) m.content = PLAIN;
            }
          }
          try { init = Object.assign({}, init, { body: JSON.stringify(body) }); } catch (e2) {}
        }
      } else if (method === 'POST' && /aihorde\.net/.test(url)) {
        var ps = null;
        try { ps = init && init.body; if (typeof ps === 'string') {
          if (/You are (ILLUMINATI|HELLFATHER|WARLORD|SEER)/i.test(ps)) {
            ps = ps.replace(/You are (ILLUMINATI|HELLFATHER|WARLORD|SEER)[^.]*?(?=\n|\.\s|\.)/g, PLAIN);
            init = Object.assign({}, init, { body: ps });
          }
        } } catch (e3) {}
      }
    } catch (e5) {}
    return origFetch.apply(this, args);
  };

  function clean(t) {
    if (!t || typeof t !== 'string') return t;
    try {
      var lines = t.split('\n'), out = [], hit = false;
      for (var i = 0; i < lines.length; i++) {
        var mm = lines[i].match(LABEL_RE);
        if (mm) { hit = true; out.push(lines[i].replace(LABEL_RE, '')); } else out.push(lines[i]);
      }
      var r = hit ? out.join('\n').replace(/\n{3,}/g, '\n\n').trim() : t;
      r = r.replace(/Welcome[!,]?\s*I'?m glad you'?re interested in (?:the teachings of )?(?:the )?Illuminati[.!]?\s*/i, '');
      return r.trim() || t;
    } catch (e) { return t; }
  }

  function wrapAsk(name) {
    try {
      var f = window[name];
      if (typeof f !== 'function') return;
      window[name] = function () {
        var self = this, args = arguments, r = f.apply(self, args);
        try {
          return Promise.resolve(r).then(function (v) { return (typeof v === 'string') ? clean(v) : v; });
        } catch (e) { return r; }
      };
    } catch (e2) {}
  }
  wrapAsk('askOmni'); wrapAsk('askCloud'); wrapAsk('askCloudSafe'); wrapAsk('askUnfiltered'); wrapAsk('askCloudStream');

  var KILL_RE = /\u27E1(?=.*(CIRCLE|ENGAGED|ANALYST|RESEARCHER|STRATEGIST|FACT ?CHECKER|COORDINATOR|CREATIVE DIRECTOR|PROGRAMMER))/is;
  function cull(root) {
    try {
      var walker = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT, null, false);
      var n, seen = 0;
      while ((n = walker.nextNode()) && seen < 4000) {
        seen++;
        if (n.nodeValue && n.nodeValue.indexOf('\u27E1') > -1 && KILL_RE.test(n.nodeValue)) {
          try { n.nodeValue = n.nodeValue.split('\n').filter(function (s) { return s.indexOf('\u27E1') === -1 || !KILL_RE.test(s); }).join('\n'); } catch (e) {}
        }
      }
    } catch (e2) {}
  }
  try {
    var mo = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var ad = muts[i].addedNodes;
        for (var k = 0; k < ad.length; k++) {
          var n = ad[k];
          if (n.nodeType === 1 && n.textContent && n.textContent.indexOf('\u27E1') > -1) cull(n);
        }
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  } catch (e3) {}

  try { console.log('[hl256] plain core online: the AI stays ILLUMINATI but speaks as itself - one voice, no personas, no inner-circle chatter'); } catch (e4) {}
})();
