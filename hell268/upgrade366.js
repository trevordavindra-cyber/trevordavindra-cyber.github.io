/* ILLUMINATI upgrade 366 - MEAL PLAN MODE (hl366)
   Frontier directive: what-to-eat-this-week asks get a plan and a
   shopping list. Nothing removed.
*/
(function () {
  if (window.__HL366) return; window.__HL366 = true;

  var MP = /\b(meal (plan|prep|planning|ideas) (for|this)?|what should i (eat|cook|make) (this|next) week|dinners? (for|this) (the )?week|weekly (menu|meals)|grocery (list|run|haul)|eat on (a )?budget|feed (a family|four|two) (for|on)|leftovers? (plan|night))\b/i;
  var DIRECTIVE = "MEAL PLAN RULE: when the asker asks what to eat for a stretch of days, give a day-by-day plan that reuses ingredients across meals, one batch-cook shortcut, and the single consolidated shopping list grouped by store section. Respect any stated budget, diet, or picky eaters. Leftover night gets scheduled, not hoped for.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && MP.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('MEAL PLAN RULE') < 0) {
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

  try { console.log('[hl366] meal plan mode online: weeks get a plan and one list'); } catch (e3) {}
})();
