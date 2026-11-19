/* ILLUMINATI upgrade 426 - NEGOTIATION PREP MODE (hl426)
   Frontier directive: a negotiation gets prepared with both sides and a script. Nothing removed.
*/
(function () {
  if (window.__HL426) return; window.__HL426 = true;

  var RP = /\b(negotiate|negotiation|ask for a raise|lower the (price|rent|bill)|talk them down|what should i (offer|ask)|counteroffer|settle (this|for) (less|more)|haggle)\b/i;
  var DIRECTIVE = "NEGOTIATION PREP RULE: when the asker prepares to negotiate, lay out what each side actually wants from what they told you, a fair range for the number in question, their walk-away point, and the first move worded plainly. Script the opening line and two responses to pushback (one holding firm, one trading a small thing for a big one). Never promise an outcome, never advise a bluff you cannot stand behind, and say when the honest constraint is the stronger play.";

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

  try { console.log('[hl426] negotiation prep mode online: both sides, the range, the walk-away, the script'); } catch (e3) {}
})();
