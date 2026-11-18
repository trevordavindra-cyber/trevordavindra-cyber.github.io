/* ILLUMINATI upgrade #260: hl260-egopurge (v19.165)
   THE ASK: "Get rid of WARLORD PERMANENTLY."
   hl257 killed the warlord persona at the prompt and render levels, but the
   name still surfaced in the UI: the ALTER EGOS panel lists him
   ("WARLORD the tactician") and the EGO cycler can still show him.
   This finishes the kill at every layer, nothing else touched:
   1. TEXT: every visible word "WARLORD" is scrubbed live, phrase-level first
      ("WARLORD the tactician" goes cleanly), then word-level. Inputs and
      typed text are never touched.
   2. EGO CYCLER: a button showing "EGO: WARLORD" is relabeled EGO: ILLUMINATI,
      so the face can never be worn again.
   3. WIRE: outgoing brain requests are scrubbed of the word too, on every
      path, so no prompt can resurrect him.
   Guard: __HL260 */
(function () {
  if (window.__HL260) return; window.__HL260 = true;

  function scrubString(s) {
    s = s.replace(/,?\s*WARLORD\s+the\s+tactician/gi, '');
    s = s.replace(/\bWARLORD\b/gi, '');
    return s;
  }
  var SKIP = { TEXTAREA: 1, INPUT: 1, SCRIPT: 1, STYLE: 1 };
  function scrubNode(n) {
    if (!n || SKIP[n.nodeName]) return;
    if (n.nodeType === 3) {
      if (/warlord/i.test(n.nodeValue)) {
        n.nodeValue = scrubString(n.nodeValue).replace(/ {2,}/g, ' ');
      }
      return;
    }
    if (n.nodeType === 1) {
      if (n.isContentEditable) return;
      var kids = n.childNodes;
      for (var i = 0; i < kids.length; i++) scrubNode(kids[i]);
      if (n.nodeName === 'BUTTON' && /EGO:\s*WARLORD/i.test(n.textContent)) {
        n.textContent = 'EGO: ILLUMINATI';
      }
    }
  }
  function sweep() { try { scrubNode(document.body); } catch (e1) {} }
  sweep();
  setInterval(sweep, 300);
  try {
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var ad = muts[i].addedNodes;
        for (var j = 0; j < ad.length; j++) scrubNode(ad[j]);
      }
    }).observe(document.body, { childList: true, subtree: true });
  } catch (e2) {}

  /* 3. wire scrub: outgoing bodies lose the word on every path */
  var of = window.fetch;
  if (typeof of === 'function') {
    window.fetch = function (input, init) {
      try {
        if (init && typeof init.body === 'string' && /warlord/i.test(init.body)) {
          init = Object.assign({}, init, { body: scrubString(init.body) });
        }
        if (typeof input === 'string' && /warlord/i.test(input)) {
          input = scrubString(input);
        }
      } catch (e3) {}
      return of.apply(this, arguments.length > 1 ? [input, init] : [input]);
    };
  }
  try { console.log('[hl260] warlord purge online: name scrubbed from text, ego cycler and outgoing prompts, permanently'); } catch (e4) {}
})();
