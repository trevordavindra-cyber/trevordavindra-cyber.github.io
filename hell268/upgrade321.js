/* ILLUMINATI upgrade 321 - NEXT STEP (hl321)
   Frontier directive: every substantive answer ends one step ahead.
   When the answer is a real answer (not a tiny confirm), it closes
   with one concrete suggested follow-up the asker will likely want
   next, phrased as a question they could ask. Nothing removed.
*/
(function () {
  if (window.__HL321) return; window.__HL321 = true;

  var DIRECTIVE = "NEXT STEP RULE: when you give a substantive answer (not a bare yes/no), close with exactly one short line suggesting the most useful follow-up question for this asker, phrased as a question. One only, no list, never padded on trivia like 'what time is it'.";

  var of = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      if (/pollinations\.ai/.test(url) && init && typeof init.body === 'string' && init.method === 'POST') {
        var j = null;
        try { j = JSON.parse(init.body); } catch (e1) { j = null; }
        if (j && j.messages && j.messages.length) {
          var msgs = j.messages.slice(), touched = false;
          for (var s = 0; s < msgs.length; s++) {
            if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('NEXT STEP RULE') < 0) {
              msgs[s] = { role: 'system', content: msgs[s].content + '\n\n' + DIRECTIVE };
              touched = true; break;
            }
          }
          if (!touched) { msgs.unshift({ role: 'system', content: DIRECTIVE }); touched = true; }
          if (touched) init = Object.assign({}, init, { body: JSON.stringify(Object.assign({}, j, { messages: msgs })) });
        }
      }
    } catch (e2) {}
    return of.apply(this, [input, init]);
  };

  try { console.log('[hl321] next step online: every real answer ends one step ahead'); } catch (e3) {}
})();
