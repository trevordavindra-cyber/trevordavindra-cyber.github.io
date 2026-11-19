/* ILLUMINATI upgrade 378 - TAX SEASON MODE (hl378)
   Frontier directive: filing asks get the document checklist and
   the order, not invented numbers. Nothing removed.
*/
(function () {
  if (window.__HL378) return; window.__HL378 = true;

  var TX = /\b(tax(es|es)? (return|filing|season|forms?)|file (my|your|the) taxes|w-?2|1099|tax refund|irs (letter|notice)|audit(ted)?|tax (deadline|extension)|self[- ]?employment tax)\b/i;
  var DIRECTIVE = "TAX RULE: when the asker is filing taxes, give the document checklist first (income forms, deduction records, last year's return), then the order to gather and file, and when a professional is worth the fee. Flag the deadline and the extension path. Never calculate a liability, invent a rate, or answer whether a deduction applies; say what the form or a tax pro decides.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && TX.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('TAX RULE') < 0) {
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

  try { console.log('[hl378] tax mode online: filing gets the checklist first'); } catch (e3) {}
})();
