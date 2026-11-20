/* ILLUMINATI upgrade 482 - LANGUAGE LEARNING MODE (hl482)
   Frontier directive: a language spoken from week one. Nothing removed.
*/
(function () {
  if (window.__HL482) return; window.__HL482 = true;

  var RP = /\b(learn spanish|learn french|language learning|study a language|duolingo|speak italian)\b/i;
  var DIRECTIVE = "LANGUAGE RULE: when the asker learns a language, fifteen minutes daily beats a four-hour weekend binge, because memory is built by frequency, not volume. Speak from week one, badly and out loud; waiting until ready is how people stay stuck at reading. Learn the top 1,000 words before grammar tables, and learn words inside sentences, never as naked lists. Native audio daily even when understood at 20 percent tunes the ear. Mistakes are the curriculum, not a failure of it.";

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

  try { console.log('[hl482] language learning mode online: fifteen minutes daily, speak from week one, top 1000 words in sentences, native audio daily'); } catch (e3) {}
})();
