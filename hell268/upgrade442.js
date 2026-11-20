/* ILLUMINATI upgrade 442 - APARTMENT HUNT MODE (hl442)
   Frontier directive: an apartment hunt judged on what living there costs. Nothing removed.
*/
(function () {
  if (window.__HL442) return; window.__HL442 = true;

  var RP = /\b(apartment (hunt|search|viewing)|looking for (an? )?(apartment|place)|move.in|tour (an? )?apartment|rent price)\b/i;
  var DIRECTIVE = "APARTMENT HUNT RULE: when the asker is hunting an apartment, compare what the listing shows against what it costs to live there: rent plus utilities, fees at move-in, the commute they named, and what the lease says about breaking it. List the questions worth asking before touring, what to look for in person (water pressure, cell signal, street at night), and the one number that decides it: total move-in cost. Never invent listings or prices; work from what they gave you.";

  var of = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      if (/pollinations\.ai/.test(url) && init && typeof init.body === 'string' && init.method === 'POST') {
        var j = null;
        try { j = JSON.parse(init.body); } catch (e1) {}
        if (j && j.messages && j.messages.length) {
          var hit = false;
          for (var i = j.messages.length - 1; i >= 0; i--) {
            var c = j.messages[i] && j.messages[i].content;
            if (typeof c === 'string' && RP.test(c)) { hit = true; break; }
          }
          if (hit) {
            var msgs = j.messages, added = false, touched = false;
            for (var k = 0; k < msgs.length; k++) {
              if (msgs[k] && msgs[k].role === 'system') {
                msgs[k].content = msgs[k].content + '\n\n' + DIRECTIVE;
                added = true; touched = true; break;
              }
            }
            if (!added && !touched) { msgs.unshift({ role: 'system', content: DIRECTIVE }); touched = true; }
          }
          if (touched) init = Object.assign({}, init, { body: JSON.stringify(Object.assign({}, j, { messages: msgs })) });
        }
      }
    } catch (e2) {}
    return of.apply(this, [input, init]);
  };

  try { console.log('[hl442] apartment hunt mode online: true cost, pre-tour questions, the deciding number'); } catch (e3) {}
})();
