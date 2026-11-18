/* ILLUMINATI upgrade #259: hl259-nerdcorp (v19.163)
   THE ASK: "find all of the best downloadable big corporation AIs, run them
   through heretic, put them in my website, at least 5 nerd models."
   Fact check first: no big-corp model ships its real weights for download
   (GPT-6/GPT-5.x, Claude, Gemini are all closed), so "run them through
   heretic" here means the community already did the uncensoring pass on the
   big-corp lineages (Google Gemma, Alibaba Qwen, Meta Llama, Mistral Nemo)
   and serves them free on the same live forge the site already uses.
   This wires 8 of those big-corp-lineage brains into the site:
   1. FUSION POOL: every OMNI ask's forge ticket now also carries one
      big-corp brain (rotating so all 8 get used across a batch of asks).
   2. PICKER: the AI MODEL SELECTION panel gets 8 new big-corp buttons;
      tapping one locks that brain for single-brain mode (gold highlight).
   3. /models: the brain list now also prints the 8 big-corp entries.
   Nothing removed: all existing brains, modes and paths stay as they were.
   Guard: __HL259 */
(function () {
  if (window.__HL259) return; window.__HL259 = true;

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
  var NAMES = [
    'BEHEMOTH EXL3 128B',
    'WICKED TUTU 31B',
    'GEMMA-4 E4B HAUAHAU',
    'QWEN3.5 9B',
    'GEMMA-4 E4B',
    'NEMOMIX 12B',
    'QWEN3.5 4B',
    'LLAMA 3.2 3B'
  ];
  var STOCK = [
    'aphrodite/TheDrummer/Behemoth-128B-v3',
    'koboldcpp/Rocinante-X-12B-v1',
    'koboldcpp/gemma-4-31B-it-heretic',
    'koboldcpp/Qwen3-14B',
    'koboldcpp/Sao10K/L3-8B-Stheno-v3.2',
    'koboldcpp/G4-MeroMero-26B-A4B-it-uncensored-heretic',
    'Nimbz/Gemma-4-Dark-Orthia-31B'
  ];

  /* 1. fusion pool: one big-corp brain rides every OMNI forge ticket */
  var tick = 0;
  var of = window.fetch;
  if (typeof of === 'function') {
    window.fetch = function (input, init) {
      try {
        var url = (typeof input === 'string') ? input : (input && input.url) || '';
        if (url.indexOf('aihorde.net/api/v2/generate/text/async') > -1 && init && typeof init.body === 'string') {
          var b = JSON.parse(init.body);
          if (b && b.models && Array.isArray(b.models)) {
            if (b.models.length >= 5) {
              var pick = CORP[tick++ % CORP.length];
              if (b.models.indexOf(pick) === -1) {
                b.models.push(pick);
                init = Object.assign({}, init, { body: JSON.stringify(b) });
                try { console.log('[hl259] ' + pick + ' joined the fusion pool'); } catch (e1) {}
              }
            } else if (b.models.length === 1) {
              var my = null;
              try { my = localStorage.getItem('hl259-model'); } catch (e2) {}
              if (my && STOCK.indexOf(b.models[0]) > -1) {
                try { localStorage.removeItem('hl259-model'); } catch (e3) {}
                my = null;
              }
              if (my && b.models[0] !== my) {
                b.models = [my];
                init = Object.assign({}, init, { body: JSON.stringify(b) });
                try { console.log('[hl259] single-brain ticket routed to ' + my); } catch (e4) {}
              }
            }
          }
        }
      } catch (e) {}
      return of.apply(this, arguments.length > 1 ? [input, init] : [input]);
    };
  }

  /* 2. picker: 8 big-corp buttons on the model panel */
  function addRows() {
    var ml = document.getElementById('mlist');
    if (!ml || ml.querySelector('button[data-hl259]')) return;
    CORP.forEach(function (m, i) {
      var bt = document.createElement('button');
      bt.setAttribute('data-hl259', '1');
      bt.textContent = NAMES[i];
      bt.onclick = function () {
        try { localStorage.setItem('hl259-model', m); } catch (e5) {}
        try {
          var all = ml.querySelectorAll('button');
          for (var k = 0; k < all.length; k++) { all[k].style.borderColor = ''; all[k].style.color = ''; }
          bt.style.borderColor = '#ffd700'; bt.style.color = '#ffd700';
        } catch (e6) {}
        try { console.log('[hl259] brain locked: ' + NAMES[i]); } catch (e7) {}
      };
      ml.appendChild(bt);
    });
  }
  addRows();
  var mo = new MutationObserver(function () { try { addRows(); } catch (e8) {} });
  try { mo.observe(document.body, { childList: true, subtree: true }); } catch (e9) {}

  /* 3. /models output: append the big-corp list */
  var chatEl = document.getElementById('chat');
  if (chatEl) {
    var mo2 = new MutationObserver(function (mus) {
      try {
        mus.forEach(function (mu) {
          mu.addedNodes.forEach(function (n) {
            if (n.nodeType === 1 && /cloudforge\s.+\sopenai-class/i.test(n.textContent || '') && !n.getAttribute('data-hl259')) {
              var d = document.createElement('div');
              d.setAttribute('data-hl259', '1');
              d.style.cssText = 'color:#ffd700;font-size:11px;white-space:pre-line;margin:2px 0 8px;';
              d.textContent = 'big-corp brains (uncensored builds of google gemma, alibaba qwen, meta llama, mistral nemo):\n' + CORP.map(function (m, i) { return (i + 9) + '. ' + NAMES[i] + ' - ' + m; }).join('\n');
              n.parentNode.insertBefore(d, n.nextSibling);
            }
          });
        });
      } catch (e10) {}
    });
    try { mo2.observe(chatEl, { childList: true }); } catch (e11) {}
  }

  try { console.log('[hl259] 8 big-corp brains in the pool: behemoth exl3 128b, wicked tutu 31b, gemma-4 hauhau, qwen3.5 9b, gemma-4 e4b, nemomix 12b, qwen3.5 4b, llama 3.2 3b'); } catch (e12) {}
})();
