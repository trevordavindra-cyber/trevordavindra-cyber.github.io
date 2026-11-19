/* ILLUMINATI upgrade 358 - SPLIT MODE (hl358)
   Frontier directive: splitting-a-bill asks get fair math each person
   can act on. Nothing removed.
*/
(function () {
  if (window.__HL358) return; window.__HL358 = true;

  var SP = /\b(split (the|a|our) bill|how much (does|do) (each|everyone)|owe each other|venmo (me|them|each)|who owes what|share the cost|split it (evenly|between|among)|square up|settle up)\b/i;
  var DIRECTIVE = "SPLIT RULE: when the asker is splitting a bill, give each person's share as one number, then who pays whom the exact amounts so the fewest transfers settle it. Include the tip math explicitly and round to whole dollars unless told otherwise. Never invent a subtotal: if an amount is missing, show the formula with a worked example.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && SP.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('SPLIT RULE') < 0) {
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

  try { console.log('[hl358] split mode online: bills get who pays whom'); } catch (e3) {}
})();
