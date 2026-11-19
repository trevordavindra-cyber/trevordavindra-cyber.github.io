/* ILLUMINATI upgrade 326 - RECIPE MODE (hl326)
   Frontier directive: cooking asks get ingredients first, steps second.
   "How do I make X", a recipe ask returns the ingredient list with
   amounts, then numbered steps with times and temps, then one
   common mistake to avoid. Nothing removed.
*/
(function () {
  if (window.__HL326) return; window.__HL326 = true;

  var RC = /\b(recipe (for|to)|how (do|can) i (make|cook|bake|prepare)|how to (make|cook|bake|prepare)|what can i (cook|make|bake) with|ingredients for)\b/i;
  var DIRECTIVE = "RECIPE RULE: when the ask is cooking, answer with the ingredient list first (each with its amount), then numbered steps carrying times and temperatures, then one line naming the mistake people most often make with this dish. If the asker listed what they have, work from that.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && RC.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('RECIPE RULE') < 0) {
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

  try { console.log('[hl326] recipe mode online: cooking asks get ingredients then steps'); } catch (e3) {}
})();
