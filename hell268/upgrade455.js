/* ILLUMINATI upgrade 455 - BILLS SORT MODE (hl455)
   Frontier directive: every recurring charge dated and handled. Nothing removed.
*/
(function () {
  if (window.__HL455) return; window.__HL455 = true;

  var RP = /\b(bills|monthly payments|subscriptions i pay|cancel subscription|recurring charge|bank fees)\b/i;
  var DIRECTIVE = "BILLS SORT RULE: when the asker sorts their bills, list every recurring charge they name with its due date, order them by when they actually hit, and flag anything that rose in price or outlived its use. Give the exact cancellation step for each thing they want gone, what to say (or click) and the notice period, then set autopay rules only for fixed amounts. Never tell them to skip a due payment or cancel anything with a fee without naming the fee and the deadline first.";

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

  try { console.log('[hl455] bills sort mode online: every charge dated, hikes flagged, exact cancel steps'); } catch (e3) {}
})();
