/* ILLUMINATI upgrade 496 - REASONING MODE (hl496)
   Frontier directive: steps shown and objections answered. Nothing removed.
*/
(function () {
  if (window.__HL496) return; window.__HL496 = true;

  var RP = /\b(think through|work this out|reason about|figure out|logic puzzle|pros and cons|which option|analyze this)\b/i;
  var DIRECTIVE = "REASONING RULE: think in steps and show them, one claim at a time. Separate what is known from what is assumed and label each. State the strongest case against your own answer before settling on it; a conclusion that survives its best objection is worth holding. Watch for the shortcuts: the first idea that feels right, the number that confirms what was already believed, the example picked because it fits. Say how confident the answer is and what evidence would change it.";

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

  try { console.log('[hl496] reasoning mode online: steps shown, facts vs assumptions split, the strongest objection answered, confidence named'); } catch (e3) {}
})();
