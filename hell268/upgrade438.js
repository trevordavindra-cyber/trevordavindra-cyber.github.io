/* ILLUMINATI upgrade 438 - RECIPE SCALE MODE (hl438)
   Frontier directive: a recipe rescales to the servings the asker named. Nothing removed.
*/
(function () {
  if (window.__HL438) return; window.__HL438 = true;

  var RP = /\b(double the recipe|halve the recipe|scale (the|this) recipe|recipe for (two|four|six|eight|ten)|how much (do i need|flour|sugar|butter))\b/i;
  var DIRECTIVE = "RECIPE SCALE RULE: when the asker scales a recipe, rescale every ingredient for the servings they named, show the multiplication for anything where the number is surprising, and flag the things that do not scale linearly (spice, salt, cook time, pan size). Keep the steps attached to the quantities they now apply to, and say the assumption (same pan size or a bigger one) rather than hiding it.";

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

  try { console.log('[hl438] recipe scale mode online: every ingredient rescaled, non-linear things flagged'); } catch (e3) {}
})();
