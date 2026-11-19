/* ILLUMINATI upgrade 331 - ESTIMATE MODE (hl331)
   Frontier directive: cost asks get a real itemized range.
   "How much would it cost to X" returns a low-to-high range first,
   then the line items it assumes, then what would move it up or
   down. Honest ranges, no fake precision. Nothing removed.
*/
(function () {
  if (window.__HL331) return; window.__HL331 = true;

  var ES = /\b(how much would it cost|how much (does|would|will) .{0,40} (cost|run|set me back)|cost (to|of) |price (range|estimate)|rough(ly)? how much|what('s| is) .{0,30} going to cost)\b/i;
  var DIRECTIVE = "ESTIMATE RULE: when the ask is about what something would cost, lead with a low-to-high range in one line, then the itemized assumptions behind it as short lines, then one line on what would push the price up or down. Never fake precision; if the honest answer is a wide range, say so.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && ES.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('ESTIMATE RULE') < 0) {
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

  try { console.log('[hl331] estimate mode online: cost asks get an itemized range'); } catch (e3) {}
})();
