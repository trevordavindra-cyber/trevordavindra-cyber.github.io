/* ILLUMINATI upgrade 356 - TRAVEL MODE (hl356)
   Frontier directive: trip asks get a day-by-day plan with the
   must-book items flagged. Nothing removed.
*/
(function () {
  if (window.__HL356) return; window.__HL356 = true;

  var TR = /\b(trip (to|plan|planning)|itinerary|going to .{2,40} (next|this|in) (week|month|weekend)|visit(ing)? .{2,40} (next|this|in) (week|month|weekend)|what (to do|should i do) in .{2,40}|travel plan|vacation (plan|to)|days? in [A-Z])\b/i;
  var DIRECTIVE = "TRAVEL RULE: when the asker is planning a trip, give a day-by-day plan grouped by area so they are not crisscrossing the city, flag what must be booked ahead (and when), and end with the one thing most likely to sell out or close. Never invent prices, hours, or opening days: say what needs checking.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && TR.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('TRAVEL RULE') < 0) {
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

  try { console.log('[hl356] travel mode online: trips get day plans and booking flags'); } catch (e3) {}
})();
