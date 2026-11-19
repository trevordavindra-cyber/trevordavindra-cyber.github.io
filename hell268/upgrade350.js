/* ILLUMINATI upgrade 350 - NEGOTIATE MODE (hl350)
   Frontier directive: price or haggle asks get the anchor, the
   target, and the exact line to say. Nothing removed.
*/
(function () {
  if (window.__HL350) return; window.__HL350 = true;

  var NG = /\b(negotiate|negotiation|haggle|lower the (price|rent|bill)|get a (discount|better price|deal)|talk (them )?down|counter[- ]?offer|ask for a raise|salary negotiation|reduce my bill)\b/i;
  var DIRECTIVE = "NEGOTIATE RULE: when the asker is negotiating a price, bill, or salary, give the anchor number to open with, the realistic target, and the exact sentence to say, then the line for when they push back and the walk-away point. Base the numbers on what was stated; when no number was stated, say what to research first.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && NG.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('NEGOTIATE RULE') < 0) {
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

  try { console.log('[hl350] negotiate mode online: haggling gets anchor, target, exact line'); } catch (e3) {}
})();
