/* ILLUMINATI upgrade 373 - APARTMENT MODE (hl373)
   Frontier directive: home hunts get viewing questions and red flags.
   Nothing removed.
*/
(function () {
  if (window.__HL373) return; window.__HL373 = true;

  var AP = /\b(apartment|apartments|flat|hous(e|ing) (hunt|search|viewing)|looking for (a )?(place|apartment|room)|rent(al|als)? (search|listing)|new (apartment|place|lease)|viewing (an? )?(apartment|flat|place)|roommate wanted|studio (apartment|for rent))\b/i;
  var DIRECTIVE = "APARTMENT RULE: when the asker is hunting an apartment, room, or rental, give the viewing checklist: the five questions to ask at the viewing (what utilities cost, who pays what, deposit and move-out terms, noise and neighbors, what breaks and how fast it gets fixed), the red flags that should end the tour, and how to read a listing between the lines. Never invent a specific city's law; say when to check local rules.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && AP.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('APARTMENT RULE') < 0) {
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

  try { console.log('[hl373] apartment mode online: viewings get the checklist'); } catch (e3) {}
})();
