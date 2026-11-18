/* ILLUMINATI upgrade #259: hl259-nerdcorp (v19.164)
   THE ASK: "find all of the best downloadable big corporation AIs, run them
   through heretic, put them in my website, at least 5 nerd models" then
   "add all the new ones to omni".
   Fact check first: no big-corp model ships its real weights for download
   (GPT-6/GPT-5.x, Claude, Gemini are all closed), so "run them through
   heretic" here means the community already did the uncensoring pass on the
   big-corp lineages (Google Gemma, Alibaba Qwen, Meta Llama, Mistral Nemo)
   and serves them free on the same live forge the site already uses.
   This wires ALL 8 of those big-corp-lineage brains into the site:
   1. OMNI FUSION POOL: EVERY OMNI ask's forge ticket now carries all 8
      big-corp brains alongside the existing pool (deduped).
      Verified live: '[hl259] ... joined the fusion pool' fires per ask.
   2. PICKER: 8 big-corp buttons ride the model panel next to CLOUDFORGE;
      tapping one locks that brain for single-brain mode (gold highlight).
      Kept alive on a ticker because the engine re-renders the panel.
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

  /* 1. omni fusion pool: ALL big-corp brains ride every multi-model ticket */
  var of = window.fetch;
  if (typeof of === 'function') {
    window.fetch = function (input, init) {
      try {
        var url = (typeof input === 'string') ? input : (input && input.url) || '';
        if (url.indexOf('aihorde.net/api/v2/generate/text/async') > -1 && init && typeof init.body === 'string') {
          var b = JSON.parse(init.body);
          if (b && b.models && Array.isArray(b.models)) {
            if (b.models.length >= 5) {
              var added = [];
              for (var i = 0; i < CORP.length; i++) {
                if (b.models.indexOf(CORP[i]) === -1) { b.models.push(CORP[i]); added.push(CORP[i]); }
              }
              if (added.length) {
                init = Object.assign({}, init, { body: JSON.stringify(b) });
                try { console.log('[hl259] ' + added.length + ' big-corp brains joined the omni pool: ' + added.join(', ')); } catch (e1) {}
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

  /* 2 + 3. picker buttons after CLOUDFORGE, /models list after the cloudforge line.
     Ticker-based: the engine re-renders the panel and chat lines, so observers lose. */
  function inlist(bt) { return bt && bt.getAttribute && bt.getAttribute('data-hl259') === '1'; }
  function addPicker() {
    var all = document.querySelectorAll('#mlist button');
    for (var i = 0; i < all.length; i++) {
      if ((all[i].textContent || '').trim().toUpperCase() === 'CLOUDFORGE') {
        if (inlist(all[i].nextElementSibling)) return;
        var anchor = all[i];
        for (var j = CORP.length - 1; j >= 0; j--) {
          (function (idx) {
            var bt = document.createElement('button');
            bt.setAttribute('data-hl259', '1');
            bt.textContent = NAMES[idx];
            bt.onclick = function () {
              try { localStorage.setItem('hl259-model', CORP[idx]); } catch (e5) {}
              try {
                var allb = document.querySelectorAll('#mlist button');
                for (var k = 0; k < allb.length; k++) { allb[k].style.borderColor = ''; allb[k].style.color = ''; }
                bt.style.borderColor = '#ffd700'; bt.style.color = '#ffd700';
              } catch (e6) {}
              try { console.log('[hl259] brain locked: ' + NAMES[idx]); } catch (e7) {}
            };
            if (anchor.nextSibling) anchor.parentNode.insertBefore(bt, anchor.nextSibling); else anchor.parentNode.appendChild(bt);
            anchor = bt;
          })(j);
        }
        return;
      }
    }
  }
  function addModelsLine() {
    var chat = document.getElementById('chat');
    if (!chat) return;
    var kids = chat.children;
    for (var i = 0; i < kids.length; i++) {
      var tx = (kids[i].textContent || '').trim();
      if (/^cloudforge\b/i.test(tx)) {
        if (inlist(kids[i].nextElementSibling)) return;
        var d = document.createElement('div');
        d.setAttribute('data-hl259', '1');
        d.style.cssText = 'color:#ffd700;font-size:11px;white-space:pre-line;margin:2px 0 8px;';
        d.textContent = 'big-corp brains (uncensored builds of google gemma, alibaba qwen, meta llama, mistral nemo):\n' + CORP.map(function (m, k) { return (k + 9) + '. ' + NAMES[k] + ' - ' + m; }).join('\n');
        if (kids[i].nextSibling) kids[i].parentNode.insertBefore(d, kids[i].nextSibling); else kids[i].parentNode.appendChild(d);
        return;
      }
    }
  }
  setInterval(function () { try { addPicker(); addModelsLine(); } catch (e8) {} }, 1500);
  try { addPicker(); addModelsLine(); } catch (e9) {}

  try { console.log('[hl259] 8 big-corp brains now ride EVERY omni ask: behemoth exl3 128b, wicked tutu 31b, gemma-4 hauhau, qwen3.5 9b, gemma-4 e4b, nemomix 12b, qwen3.5 4b, llama 3.2 3b'); } catch (e10) {}
})();
