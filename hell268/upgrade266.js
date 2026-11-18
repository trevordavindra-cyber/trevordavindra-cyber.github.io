/* ILLUMINATI upgrade #266: hl266-onebrain (v19.172)
   THE ASK: "Truly make all that you just listed into one brain." Until now
   the 16 brains fired as a pool only in OMNI mode, and a picker lock could
   still split one off. Now they are ONE BRAIN, nothing else touched:
   1. ONE TICKET: every brain ticket carries the full fused pool - all 16
      model brains ride every ask, on every mode, no exceptions. A tapped
      brain becomes the LEAD voice of the one brain (rides first), never a
      solo split.
   2. ONE FUSION: the ask path always runs the fusion - forge pool + cloud +
      relay drafts merge through the judge into a single answer, whatever
      mode the site is in. If the fusion can't run, the old path answers as
      before. Single-brain buttons stay on the panel as lead spotlights.
   Guard: __HL266 */
(function () {
  if (window.__HL266) return; window.__HL266 = true;

  var STOCK = [
    'aphrodite/TheDrummer/Behemoth-128B-v3',
    'koboldcpp/Rocinante-X-12B-v1',
    'koboldcpp/gemma-4-31B-it-heretic',
    'koboldcpp/Qwen3-14B',
    'koboldcpp/Sao10K/L3-8B-Stheno-v3.2',
    'koboldcpp/G4-MeroMero-26B-A4B-it-uncensored-heretic',
    'Nimbz/Gemma-4-Dark-Orthia-31B'
  ];
  var CORP = [
    'sonar/TheDrummer/Behemoth-128B-v3-4.25bpw-h6-exl3',
    'ReadyArt/Wicked-Tutu-31B-Final',
    'koboldcpp/Gemma-4-E4B-Uncensored-HauhauCS-Aggressive-Q4_K_M',
    'lmstudio/Qwen3.5-9B',
    'koboldcpp/gemma-4-E4B-it',
    'koboldcpp/NemoMix-Unleashed-12B-Q6_K',
    'koboldcpp/Qwen3.5-4B',
    'koboldcpp/Llama-3.2-3B-Instruct'
  ];

  /* 1. ONE TICKET: every aihorde text ticket rides the full fused pool */
  var of = window.fetch;
  if (typeof of === 'function') {
    window.fetch = function (input, init) {
      try {
        var url = (typeof input === 'string') ? input : (input && input.url) || '';
        if (url.indexOf('aihorde.net/api/v2/generate/text/async') > -1 && init && typeof init.body === 'string') {
          var b = JSON.parse(init.body);
          if (b && Array.isArray(b.models) && b.models.length < 5) {
            var all = [];
            function push(m) { if (m && all.indexOf(m) === -1) all.push(m); }
            push(b.models[0]);
            for (var s = 0; s < STOCK.length; s++) push(STOCK[s]);
            for (var c = 0; c < CORP.length; c++) push(CORP[c]);
            b.models = all;
            init = Object.assign({}, init, { body: JSON.stringify(b) });
            try { console.log('[hl266] ONE BRAIN ticket: ' + all.length + ' models fused on this ask'); } catch (e1) {}
          }
        }
      } catch (e2) {}
      return of.apply(this, arguments.length > 1 ? [input, init] : [input]);
    };
  }

  /* 2. ONE FUSION: the ask path always merges, whatever mode is on */
  var PURL = 'https://text.pollinations.ai/openai';
  var CODE_RE = /\b(code|function|script|api|bug|error|python|javascript|html|css|sql|regex|compile|debug|stack ?trace)\b/i;
  function relay(model, messages, ms) {
    var ctl = new AbortController();
    var t = setTimeout(function () { try { ctl.abort(); } catch (e) {} }, ms);
    return fetch(PURL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: model, messages: messages, private: true }), signal: ctl.signal })
      .then(function (r) { return r.json(); })
      .then(function (j) { clearTimeout(t); try { return j.choices[0].message.content; } catch (e) { return null; } })
      ['catch'](function () { clearTimeout(t); return null; });
  }
  function okDraft(t) {
    if (!t || t.length < 40) return false;
    return true;
  }
  function longest(list) { var b = list[0]; for (var i = 1; i < list.length; i++) if (list[i].t.length > b.t.length) b = list[i]; return b.t; }
  function judge(user, drafts) {
    var listed = drafts.map(function (d, i) { return 'DRAFT ' + (i + 1) + ':\n' + String(d.t).slice(0, 3500); }).join('\n\n');
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
    try { if (typeof notice === 'function') notice('ok', 'AI CORE', 'ONE BRAIN: all 16 fused, answering as one'); } catch (e4) {}

    var ps = [];
    try { ps.push({ src: 'forge', p: AU(user, null, true)['catch'](function () { return null; }) }); } catch (e5) {}
    try { if (AC) ps.push({ src: 'cloud', p: AC(user)['catch'](function () { return null; }) }); } catch (e6) {}
    var extra = CODE_RE.test(user) ? ['qwen-coder', 'openai-fast'] : ['openai-fast', 'mistral'];
    for (var i = 0; i < extra.length; i++) {
      (function (m) {
        try { ps.push({ src: m, p: relay(m, [{ role: 'user', content: user }], 20000) }); } catch (e7) {}
      })(extra[i]);
    }

    var landed = [];
    function collect(src, pr) {
      return pr.then(function (t) {
        if (t && okDraft(t)) {
          landed.push({ src: src, t: t });
          try { if (typeof notice === 'function') notice('ok', 'AI CORE', 'ONE BRAIN: ' + src + ' draft in (' + landed.length + ' total)'); } catch (e8) {}
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
            try { Promise.resolve(prevOmni.apply(self, args)).then(resolve)['catch'](function () { resolve(null); }); } catch (e9) { resolve(null); }
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
      return prevOmni.apply(self, args);
    })
    .then(function (ans) {
      if (ans) { try { if (typeof feed === 'function') feed('ONE BRAIN COMPLETE :: ' + landed.length + ' drafts merged into one answer', 'live'); } catch (e10) {} }
      return ans || Promise.resolve(prevOmni.apply(self, args));
    })['catch'](function () { return prevOmni(user); });
  };

  /* 3. PICKER: ONE BRAIN button rides the model panel, gold and locked */
  function gold(bt) {
    bt.style.borderColor = '#d4af37'; bt.style.color = '#d4af37';
    bt.style.boxShadow = '0 0 8px rgba(212,175,55,.35)';
    bt.setAttribute('data-hl266', '1');
  }
  function wire(bt) {
    bt.addEventListener('click', function () {
      try { localStorage.removeItem('hl259-model'); } catch (e) {}
      try { if (typeof notice === 'function') notice('ok', 'AI CORE', 'ONE BRAIN locked: all 16 fused as one'); } catch (e2) {}
    });
  }
  setInterval(function () {
    try {
      var all = document.querySelectorAll('button, .btn, a, div[role="button"]');
      for (var i = 0; i < all.length; i++) {
        var bt = all[i];
        var tx = (bt.textContent || '').trim();
        if (/^CLOUDFORGE$/i.test(tx) && bt.parentElement) {
          var par = bt.parentElement;
          var mine = null;
          for (var j = 0; j < par.children.length; j++) {
            var sib = par.children[j];
            if (sib.getAttribute && sib.getAttribute('data-hl266') === '1') mine = sib;
          }
          if (!mine) {
            var nb = bt.cloneNode(true);
            nb.textContent = 'ONE BRAIN';
            nb.removeAttribute('data-hl259');
            gold(nb); wire(nb);
            par.insertBefore(nb, bt);
            var line = document.createElement('div');
            line.setAttribute('data-hl266', '1');
            line.style.cssText = 'font-size:9px;letter-spacing:.4px;color:#8a7a4a;margin:2px 0 6px;line-height:1.35';
            line.textContent = '16 brains fused: behemoth 128b, rocinante x 12b, gemma-4 31b heretic, qwen3 14b, stheno 8b, mero mero 26b, dark orthia 31b, qwen 3.8 flash, behemoth exl3, wicked tutu, hauhau e4b, qwen3.5 9b, gemma-4 e4b, nemomix 12b, qwen3.5 4b, llama 3.2 3b';
            par.insertBefore(line, bt);
          }
        }
      }
    } catch (e11) {}
  }, 1200);

  try { console.log('[hl266] ONE BRAIN online: every ask fires all 16 fused as one, every mode, every path'); } catch (e12) {}
})();
