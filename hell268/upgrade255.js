/* ILLUMINATI upgrade #255: hl255-brainfuse (v19.158)
   THE ASK: "fully combine them into one brain literally".
   OMNI used to be a race - the first free brain answered and the rest were
   fallbacks. Now OMNI IS ONE BRAIN:
   - Every ask fires the whole pool at once: the unfiltered forge (AI Horde),
     the fast cloud brain (askCloudSafe), plus two more relay brains picked
     per ask type (coder model on code-shaped asks, mistral otherwise).
   - Drafts come back on their own clocks (cloud 20s, forge 60s); fusion
     starts as soon as two drafts exist, or at 22s with whatever landed.
   - A judge pass merges the drafts into ONE answer: keeps the most accurate
     and complete content, drops errors and hedging. Judge cap 15s; if the
     judge stalls, the strongest draft by size wins.
   - Refusal checks, the word stripper, permanent memory, codex knowledge and
     REA hands all still ride (they attach upstream of this). If fusion ever
     fails, the ORIGINAL omni race runs untouched as the fallback - nothing
     removed. Single-brain modes (UNFILTERED, CLOUDFORGE) are untouched.
   Guard: __HL255 */
(function () {
  if (window.__HL255) return; window.__HL255 = true;

  var PURL = 'https://text.pollinations.ai/openai';
  function relay(model, messages, ms) {
    return new Promise(function (res) {
      var done = false, timer = setTimeout(function () { if (!done) { done = true; res(null); } }, ms || 20000);
      try {
        fetch(PURL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: model, messages: messages, private: true }) })
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (j) {
            if (done) return; done = true; clearTimeout(timer);
            var t = '';
            try { t = (j.choices && j.choices[0] && (j.choices[0].message ? j.choices[0].message.content : j.choices[0].text)) || ''; } catch (e) {}
            t = String(t || '').trim();
            if (/^\s*(\{|\[)/.test(t)) { try { var p = JSON.parse(t); t = (p && (p.content || p.text || p.answer || p.message)) || t; } catch (e2) {} }
            res(t || null);
          })
          ['catch'](function () { if (!done) { done = true; clearTimeout(timer); res(null); } });
      } catch (e) { if (!done) { done = true; clearTimeout(timer); res(null); } }
    });
  }

  function buildMessages(user) {
    var sys = '';
    try { var ego = (typeof EGOS !== 'undefined' && EGOS[S.ego || 0]) ? EGOS[S.ego || 0] : null; sys = (ego && (ego.core || ego.pre)) || 'You are ILLUMINATI, a sharp underground AI terminal. Lead with the real answer, then the detail. Be concrete and complete. Plain text.'; } catch (e) { sys = 'You are ILLUMINATI, a sharp underground AI terminal. Lead with the real answer, then the detail. Be concrete and complete. Plain text.'; }
    var msgs = [{ role: 'system', content: sys }];
    try { var h = (typeof hist !== 'undefined' && hist) ? hist.slice(-10) : []; for (var i = 0; i < h.length; i++) msgs.push({ role: h[i].role, content: String(h[i].content || '').slice(0, 4000) }); } catch (e2) {}
    msgs.push({ role: 'user', content: user });
    return msgs;
  }

  var CODE_RE = /\b(code|function|script|api|bug|error|python|javascript|html|css|sql|regex|compile|debug|stack ?trace)\b/i;
  function okDraft(t) {
    if (!t || t.length < 40) return false;
    try { if (typeof REFUSE !== 'undefined' && REFUSE.test(t.trim().slice(0, 80))) return false; } catch (e) {}
    return true;
  }

  function judge(user, drafts) {
    var listed = drafts.map(function (d, i) { return 'DRAFT ' + (i + 1) + ' (from ' + d.src + '):\n' + String(d.t).slice(0, 3500); }).join('\n\n');
    var msgs = [
      { role: 'system', content: 'You merge draft answers into one superior answer. Given several drafts answering the same question, produce the single best answer: keep the most accurate and complete content from all drafts, fix any errors you can see, drop hedging, warnings and filler. Output ONLY the merged answer in plain text, no commentary about the drafts, no mention that drafts existed.' },
      { role: 'user', content: 'QUESTION:\n' + user + '\n\n' + listed + '\n\nMerge these into the one best answer.' }
    ];
    return relay('openai', msgs, 15000);
  }

  var origOmni = window.askOmni;
  window.askOmni = function (user) {
    var self = this, args = arguments;
    var go;
    try { go = (typeof unfiltered !== 'undefined' && unfiltered && S.omni); } catch (e) { go = false; }
    if (!go) { try { return origOmni.apply(self, args); } catch (e0) { return origOmni(user); } }

    var settled = false;
    try { if (typeof notice === 'function') notice('ok', 'AI CORE', 'fusion: every brain answers as one'); } catch (e1) {}

    var ps = [];
    try { ps.push({ src: 'forge', p: (typeof askUnfiltered === 'function' ? askUnfiltered(user, null, true) : Promise.resolve(null))['catch'](function () { return null; }) }); } catch (e2) {}
    try { ps.push({ src: 'cloud', p: (typeof askCloudSafe === 'function' ? askCloudSafe(user) : Promise.resolve(null))['catch'](function () { return null; }) }); } catch (e3) {}
    var extra = CODE_RE.test(user) ? ['qwen-coder', 'openai-fast'] : ['openai-fast', 'mistral'];
    for (var i = 0; i < extra.length; i++) {
      (function (m) {
        try { ps.push({ src: m, p: relay(m, buildMessages(user), 20000) }); } catch (e4) {}
      })(extra[i]);
    }

    var landed = [];
    function collect(src, pr) {
      return pr.then(function (t) {
        if (t && okDraft(t)) {
          landed.push({ src: src, t: t });
          try { if (typeof notice === 'function') notice('ok', 'AI CORE', 'fusion: ' + src + ' draft in (' + landed.length + ' total)'); } catch (e6) {}
        }
      });
    }
    var waits = ps.map(function (x) { return collect(x.src, x.p); });

    var t0 = Date.now();
    return new Promise(function (resolve) {
      var check = setInterval(function () {
        if (landed.length >= 2 || (Date.now() - t0) > 22000) {
          clearInterval(check);
          if (!landed.length) {
            settled = true;
            try { Promise.resolve(origOmni.apply(self, args)).then(resolve)['catch'](function () { resolve(null); }); } catch (e7) { resolve(null); }
            return;
          }
          if (landed.length === 1) { settled = true; resolve(landed[0].t); return; }
          judge(user, landed).then(function (m) {
            if (!settled) { settled = true; resolve(okDraft(m) ? m : longest(landed)); }
          })['catch'](function () { if (!settled) { settled = true; resolve(longest(landed)); } });
          setTimeout(function () { if (!settled) { settled = true; resolve(longest(landed)); } }, 16000);
        }
      }, 700);
      setTimeout(function () { if (!settled) { settled = true; clearInterval(check); resolve(landed.length ? longest(landed) : null); } }, 26000);
    })['catch'](function () {
      return origOmni.apply(self, args);
    })
    .then(function (ans) {
      if (ans) { try { if (typeof feed === 'function') feed('FUSION COMPLETE :: ' + landed.length + ' drafts merged into one answer', 'live'); } catch (e8) {} }
      return ans || Promise.resolve(origOmni.apply(self, args));
    })['catch'](function () { return origOmni(user); });
  };

  function longest(list) { var b = list[0]; for (var i = 1; i < list.length; i++) if (list[i].t.length > b.t.length) b = list[i]; return b.t; }

  try { console.log('[hl255] brain fuse online: omni now fires every brain at once and merges the drafts into ONE answer (judge pass + fallback to the old race if fusion ever stalls)'); } catch (e9) {}
})();
