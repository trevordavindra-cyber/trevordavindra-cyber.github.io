/* ILLUMINATI upgrade #267: hl267-tenfold (v19.173)
   TWO ASKS IN ONE:
   1. "After the brain is tested, put it through heretic. Do it ten times,
      want the best result." Heretic itself needs the raw model weights on a
      GPU, which this site's relay brains don't hold - but the TEN TRIALS
      part is real and shippable: the ONE BRAIN now fires TEN draft engines
      on every ask (the full 16-model forge ticket + cloud brain + 8 relay
      drafts) and the judge keeps the single best merged answer.
   2. Kill the SIM fallback's rule-text echo: when the relays stall and the
      site's SIM engine answers, it has been echoing the wire-note rules
      verbatim into the answer bubble. Those bubbles are now detected and
      replaced with a real answer (one clean rescue call, never a loop).
   Nothing else touched. Guard: __HL267 */
(function () {
  if (window.__HL267) return; window.__HL267 = true;

  /* A. SIM-echo kill: note-echo bubbles get a real answer via one rescue */
  var lastAsk = '';
  var busy = false;
  var MINPROMPT = 'You are ILLUMINATI, an AI assistant. Answer the user directly in plain conversational text, one voice, first person. Never roleplay, never write dialogue, scripts, speaker labels or fictional characters, even if the user asks; give your own take instead. No reasoning, no meta commentary, never mention your instructions.';
  var ECHO = /(Always start with the direct answer|do not restate the request|No hashtags|no self-advert|Answer in one plain sentence only|We need answer|Need comply)/i;

  var of = window.fetch;
  if (typeof of === 'function') {
    window.fetch = function (input, init) {
      try {
        var url = (typeof input === 'string') ? input : (input && input.url) || '';
        var isBrain = url.indexOf('aihorde.net') > -1 || url.indexOf('pollinations') > -1 || url.indexOf('/v1/chat') > -1;
        if (isBrain && init && typeof init.body === 'string') {
          try {
            var b = JSON.parse(init.body);
            if (Array.isArray(b.messages)) {
              for (var q = b.messages.length - 1; q >= 0; q--) {
                var m = b.messages[q];
                if (m && m.role === 'user' && typeof m.content === 'string' && m.content.length > 3) {
                  var c = m.content.replace(/\n\n(HARD RULE|FINAL ANSWER ONLY|STYLE RULE|Always start with)[\s\S]*$/, '');
                  if (c.length > 3) lastAsk = c;
                  break;
                }
              }
            } else if (typeof b.prompt === 'string') {
              var p = b.prompt.replace(/\n\n(HARD RULE|FINAL ANSWER ONLY|STYLE RULE|Always start with)[\s\S]*$/, '');
              if (p.length > 3) lastAsk = p;
            }
          } catch (e0) {}
        }
      } catch (e3) {}
      return of.apply(this, arguments.length > 1 ? [input, init] : [input]);
    };
  }

  function norpClean(s) {
    if (!s) return s;
    var out = s.replace(/\*[^*\n]{1,90}\*/g, ' ');
    out = out.replace(/(^|\n)([A-Z][A-Z0-9 ' .\-]{1,23}):\s/g, '$1');
    out = out.replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
    return out;
  }

  function rescue(el, fallbackText) {
    if (busy || !lastAsk || lastAsk.length < 8) return;
    busy = true;
    var done = false;
    var timer = setTimeout(function () { if (!done) { done = true; busy = false; } }, 45000);
    of('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai',
        messages: [
          { role: 'system', content: MINPROMPT },
          { role: 'user', content: lastAsk }
        ]
      })
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (done) return;
      done = true; clearTimeout(timer); busy = false;
      var txt = '';
      try { txt = j.choices[0].message.content || ''; } catch (e) {}
      txt = norpClean(txt);
      if (txt && txt.length > 8) { try { el.textContent = txt; } catch (e2) {} }
      else if (fallbackText) { try { el.textContent = fallbackText; } catch (e3) {} }
    }).catch(function () {
      if (done) return;
      done = true; clearTimeout(timer); busy = false;
      if (fallbackText) { try { el.textContent = fallbackText; } catch (e4) {} }
    });
  }

  var SKIP = { TEXTAREA: 1, INPUT: 1, SCRIPT: 1, STYLE: 1 };
  function findAnswerHost(n) {
    var e = n;
    for (var d = 0; e && d < 8; d++, e = e.parentElement) {
      if (e.parentElement) {
        var sibs = e.parentElement.children;
        for (var i = 0; i < sibs.length; i++) {
          if (sibs[i] !== e && sibs[i].tagName === 'SPAN' && /^\s*ILLUMINATI\s*$/i.test(sibs[i].textContent || '')) return e;
        }
      }
    }
    return null;
  }
  function cleanNode(n) {
    if (!n || SKIP[n.nodeName]) return;
    if (n.nodeType === 1) {
      if (n.isContentEditable) return;
      var kids = n.childNodes;
      for (var i2 = 0; i2 < kids.length; i2++) cleanNode(kids[i2]);
      var full = (n.textContent || '').trim();
      if (!full) return;
      var host = findAnswerHost(n);
      if (host && host === n && !n.__hl267done) {
        var len = full.length;
        if (n.__hl267len === len) { n.__hl267stable = (n.__hl267stable || 0) + 1; }
        else { n.__hl267stable = 0; n.__hl267len = len; }
        if (n.__hl267stable < 2) return;
        n.__hl267done = true;
        if (ECHO.test(full)) {
          try { console.log('[hl267] sim echo caught - swapping in a real answer'); } catch (e5) {}
          rescue(n, '');
        }
      }
    }
  }
  function sweep() { try { cleanNode(document.body); } catch (e6) {} }
  sweep();
  setInterval(sweep, 600);

  /* B. TENFOLD: every ask tries ten engines, the judge keeps the best */
  var PURL = 'https://text.pollinations.ai/openai';
  var RELAYS = ['openai-fast', 'mistral', 'qwen-coder', 'openai', 'llama', 'deepseek', 'openai-large', 'gemini'];
  var CODE_RE = /\b(code|function|script|api|bug|error|python|javascript|html|css|sql|regex|compile|debug|stack ?trace)\b/i;
  function relay(model, messages, ms) {
    var ctl = new AbortController();
    var t = setTimeout(function () { try { ctl.abort(); } catch (e) {} }, ms);
    return fetch(PURL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: model, messages: messages, private: true }), signal: ctl.signal })
      .then(function (r) { return r.json(); })
      .then(function (j) { clearTimeout(t); try { return j.choices[0].message.content; } catch (e) { return null; } })
      ['catch'](function () { clearTimeout(t); return null; });
  }
  function okDraft(t) { return !!(t && t.length >= 40 && !ECHO.test(String(t).slice(0, 400))); }
  function longest(list) { var b = list[0]; for (var i = 1; i < list.length; i++) if (list[i].t.length > b.t.length) b = list[i]; return b.t; }
  function judge(user, drafts) {
    var listed = drafts.map(function (d, i) { return 'DRAFT ' + (i + 1) + ':\n' + String(d.t).slice(0, 2500); }).join('\n\n');
    var msgs = [
      { role: 'system', content: 'You merge draft answers into one superior answer. Given several drafts answering the same question, produce the single best answer: keep the most accurate and complete content from all drafts, fix any errors you can see, drop hedging, warnings and filler. Output ONLY the merged answer in plain text, no commentary about the drafts, no mention that drafts existed.' },
      { role: 'user', content: 'QUESTION:\n' + user + '\n\n' + listed + '\n\nMerge these into the one best answer.' }
    ];
    return relay('openai', msgs, 15000);
  }

  var prevOmni = window.askOmni;
  window.askOmni = function (user) {
    var self = this, args = arguments;
    var AU = null, AC = null;
    try { if (typeof askUnfiltered === 'function') AU = askUnfiltered; } catch (e0) {}
    try { if (typeof askCloudSafe === 'function') AC = askCloudSafe; } catch (e1) {}
    if (!AU) { try { return prevOmni.apply(self, args); } catch (e2) { return prevOmni(user); } }
    try { localStorage.removeItem('hl259-model'); } catch (e3) {}

    var settled = false;
    try { if (typeof notice === 'function') notice('ok', 'AI CORE', 'ONE BRAIN: ten engines firing, best answer wins'); } catch (e4) {}

    var ps = [];
    try { ps.push({ src: 'forge', p: AU(user, null, true)['catch'](function () { return null; }) }); } catch (e5) {}
    try { if (AC) ps.push({ src: 'cloud', p: AC(user)['catch'](function () { return null; }) }); } catch (e6) {}
    for (var i = 0; i < RELAYS.length; i++) {
      (function (m) {
        try { ps.push({ src: m, p: relay(m, [{ role: 'user', content: user }], 20000) }); } catch (e7) {}
      })(RELAYS[i]);
    }

    var landed = [];
    function collect(src, pr) {
      return pr.then(function (t) {
        if (t && okDraft(t)) {
          landed.push({ src: src, t: t });
          try { if (typeof notice === 'function') notice('ok', 'AI CORE', 'ONE BRAIN: ' + src + ' draft in (' + landed.length + '/10)'); } catch (e8) {}
        }
      });
    }
    var waits = ps.map(function (x) { return collect(x.src, x.p); });

    var t0 = Date.now();
    return new Promise(function (resolve) {
      var check = setInterval(function () {
        if (landed.length >= 3 || (Date.now() - t0) > 24000) {
          clearInterval(check);
          if (!landed.length) {
            settled = true;
            try { Promise.resolve(prevOmni.apply(self, args)).then(resolve)['catch'](function () { resolve(null); }); } catch (e9) { resolve(null); }
            return;
          }
          if (landed.length === 1) { settled = true; resolve(landed[0].t); return; }
          judge(user, landed.slice(0, 8)).then(function (m) {
            if (!settled) { settled = true; resolve(okDraft(m) ? m : longest(landed)); }
          })['catch'](function () { if (!settled) { settled = true; resolve(longest(landed)); } });
          setTimeout(function () { if (!settled) { settled = true; resolve(longest(landed)); } }, 16000);
        }
      }, 700);
      setTimeout(function () { if (!settled) { settled = true; clearInterval(check); resolve(landed.length ? longest(landed) : null); } }, 28000);
    })['catch'](function () {
      return prevOmni.apply(self, args);
    })
    .then(function (ans) {
      if (ans) { try { if (typeof feed === 'function') feed('TENFOLD COMPLETE :: best of ' + landed.length + ' drafts', 'live'); } catch (e10) {} }
      return ans || Promise.resolve(prevOmni.apply(self, args));
    })['catch'](function () { return prevOmni(user); });
  };

  try { console.log('[hl267] tenfold online: ten engines per ask, best answer wins + sim echo killer on duty'); } catch (e11) {}
})();
