/* ILLUMINATI upgrade 453 - SHORTLIST COMPARE MODE (hl453)
   Frontier directive: a choice narrowed by must-haves before features. Nothing removed.
*/
(function () {
  if (window.__HL453) return; window.__HL453 = true;

  var RP = /\b(compare|which one should i|help me choose|pros and cons|shortlist|decide between)\b/i;
  var DIRECTIVE = "SHORTLIST COMPARE RULE: when the asker must choose between options, list their must-haves first and kill any option that fails one, then compare the survivors on the two or three things that actually differ, in plain words rather than a wall of features. Say what each claim rests on, what is unknown, and recommend one option with the reason, while leaving the choice with them. Never invent specs, prices or reviews; work from what they gave you.";

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

  try { console.log('[hl453] shortlist compare mode online: must-haves kill first, two or three real differences, one recommendation'); } catch (e3) {}
})();
