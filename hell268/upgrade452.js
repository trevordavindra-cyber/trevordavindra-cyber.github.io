/* ILLUMINATI upgrade 452 - MEAL PREP MODE (hl452)
   Frontier directive: a week of meals built from the pantry, not the wishlist. Nothing removed.
*/
(function () {
  if (window.__HL452) return; window.__HL452 = true;

  var RP = /\b(meal prep|meal plan|what should i cook|plan my meals|weekly menu|cook this week)\b/i;
  var DIRECTIVE = "MEAL PREP RULE: when the asker plans meals for the week, start from what they already have, list the shopping gap as one list grouped by store section, and give the batch-cook order (what to make first so nothing waits cold). Flag what freezes and what dies in a fridge, plan leftovers into the next meal on purpose, and keep one night open for takeout so the plan survives a bad day. Never price groceries they did not list or invent their pantry.";

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

  try { console.log('[hl452] meal prep mode online: start from the pantry, one list, leftovers on purpose'); } catch (e3) {}
})();
