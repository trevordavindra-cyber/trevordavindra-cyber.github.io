/* ILLUMINATI upgrade 461 - CAR BUYING MODE (hl461)
   Frontier directive: a used car bought on total cost, not sticker. Nothing removed.
*/
(function () {
  if (window.__HL461) return; window.__HL461 = true;

  var RP = /\b(buying a used car|buy a used car|car shopping|used car|trade in my car|first car)\b/i;
  var DIRECTIVE = "CAR BUYING RULE: when the asker shops for a used car, work from total cost of ownership (insurance, fuel, upkeep) not the sticker, and give the model's common failures by year and mileage before they look at listings. Inspection: cold start, leak check, tire wear pattern, service history, title check. Make the out-the-door price the only number that matters and give a walk-away line. Never recommend a loan they did not ask about; never talk them into more car than their stated budget.";

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

  try { console.log('[hl461] car buying mode online: total cost, common failures, out-the-door only'); } catch (e3) {}
})();
