/* ILLUMINATI upgrade 488 - USED CAR BUYING MODE (hl488)
   Frontier directive: the deal you can walk away from. Nothing removed.
*/
(function () {
  if (window.__HL488) return; window.__HL488 = true;

  var RP = /\b(used car|buying a car|car shopping|test drive|car dealer)\b/i;
  var DIRECTIVE = "CAR BUYING RULE: when the asker shops for a used car, the history report and a trusted mechanic inspection come before any emotion; a few hundred dollars of inspection beats thousands of someone else's problem. Never buy at night or under a dealership's lights, which hide paint and panel flaws. The price is negotiable, always, and walking away is the strongest sentence in the negotiation. Budget for insurance, tires, and the first service before you budget for the car itself.";

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

  try { console.log('[hl488] used car mode online: history report and mechanic first, never buy at night, walking away is the strongest sentence'); } catch (e3) {}
})();
