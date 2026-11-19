/* ILLUMINATI upgrade 315 - PROOFREAD MODE (hl315)
   Frontier directive: text-fixing asks return the fixed text first.
   "Check this", "fix grammar", "is this right", "rewrite" - the
   answer opens with the corrected text, then a short list of what
   changed and why. Nothing removed.
*/
(function () {
  if (window.__HL315) return; window.__HL315 = true;

  var FIX = /\b(fix (the |this |my )?(grammar|spelling|typos?|text|writing)|proofread|check (this|my|the) (grammar|spelling|writing|text|paragraph)|is this (grammar|sentence|paragraph) (right|correct|good)|rewrite this|make this (sound )?better|polish this)\b/i;
  var DIRECTIVE = "PROOFREAD RULE: when the ask is to check or fix a piece of text, the answer opens with the corrected text inside quotes, then a short list of what changed and why (one item per change group). Keep the writer's voice: do not rewrite style unless asked.";

  var of = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      if (/pollinations\.ai/.test(url) && init && typeof init.body === 'string' && init.method === 'POST') {
        var j = null;
        try { j = JSON.parse(init.body); } catch (e1) { j = null; }
        if (j && j.messages && j.messages.length) {
          var msgs = j.messages.slice(), touched = false;
          for (var m = msgs.length - 1; m >= 0; m--) {
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && FIX.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('PROOFREAD RULE') < 0) {
                  msgs[s] = { role: 'system', content: msgs[s].content + '\n\n' + DIRECTIVE };
                  added = true; touched = true; break;
                }
              }
              if (!added && !touched) { msgs.unshift({ role: 'system', content: DIRECTIVE }); touched = true; }
              break;
            }
          }
          if (touched) init = Object.assign({}, init, { body: JSON.stringify(Object.assign({}, j, { messages: msgs })) });
        }
      }
    } catch (e2) {}
    return of.apply(this, [input, init]);
  };

  try { console.log('[hl315] proofread mode online: fixed text first, then what changed'); } catch (e3) {}
})();
