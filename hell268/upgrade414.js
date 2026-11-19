/* ILLUMINATI upgrade 414 - PANTRY RECIPE MODE (hl414)
   Frontier directive: a what-can-I-cook ask turns their own ingredients into a real recipe. Nothing removed.
*/
(function () {
  if (window.__HL414) return; window.__HL414 = true;

  var RP = /\b(what (can|should) i (make|cook|eat) with|recipe (from|with|using)|whats? in my (fridge|pantry|kitchen)|pantry (challenge|raid)|use up (my|the) (leftovers|eggs|chicken|rice)|dinner (ideas?|from) (with|using) what i have|cook with what i have)\b/i;
  var DIRECTIVE = "PANTRY RULE: when the asker lists what they have and asks what to cook, give one real recipe that uses mostly what they named, written as numbered steps a beginner can follow with times and temperatures, then the one or two common pantry staples it assumes (oil, salt) and a substitution for anything they did not list. Never assume an appliance they did not mention (no oven if they said microwave or stovetop only). Keep it to one recipe unless they ask for options, and say plainly when what they listed cannot make a real meal and what single item would fix it.";

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

  try { console.log('[hl414] pantry recipe mode online: one real recipe, their ingredients, stated assumptions'); } catch (e3) {}
})();
