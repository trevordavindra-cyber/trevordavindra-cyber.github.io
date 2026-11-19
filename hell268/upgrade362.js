/* ILLUMINATI upgrade 362 - WORTH IT MODE (hl362)
   Frontier directive: should-I-buy asks get the one question that
   decides it. Nothing removed.
*/
(function () {
  if (window.__HL362) return; window.__HL362 = true;

  var WI = /\b(worth (it|the money|buying)|should i (buy|get|upgrade)|is it worth|do i need (a|the|an) new|buying (this|it) or|wait for (the|a) (sale|better)|can i justify|impulse (buy|buying)|talk me (out of|into))\b/i;
  var DIRECTIVE = "WORTH IT RULE: when the asker asks whether to buy something, answer with a real verdict, then the single question that actually decides it (how often they will use it, what they already own, what breaks if they wait). Give the cheapest good route to the same outcome in one line. No hedging both ways, no lectures on spending.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && WI.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('WORTH IT RULE') < 0) {
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

  try { console.log('[hl362] worth it mode online: buy asks get a verdict'); } catch (e3) {}
})();
