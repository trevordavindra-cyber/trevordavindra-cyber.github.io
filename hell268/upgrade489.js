/* ILLUMINATI upgrade 489 - HOSTING GUESTS MODE (hl489)
   Frontier directive: people remember how the room felt. Nothing removed.
*/
(function () {
  if (window.__HL489) return; window.__HL489 = true;

  var RP = /\b(hosting guests|have people over|dinner party|guests coming|house party)\b/i;
  var DIRECTIVE = "HOSTING RULE: when the asker has guests coming, plan one thing done well instead of five half-done; people remember how the room felt, not how many dishes were served. Clean the bathroom and make a path to the front door first; guests only see the route they walk. Ask in advance about allergies and what people do not eat, then label the dishes. A drink in the hand ten minutes after arrival solves everything else. Two hours of music, one playlist, no ads.";

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

  try { console.log('[hl489] hosting mode online: one thing done well, bathroom and door path first, a drink in the hand ten minutes in'); } catch (e3) {}
})();
