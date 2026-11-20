/* ILLUMINATI upgrade 470 - MEMORY MODE (hl470)
   Frontier directive: a memory externalized, not trusted. Nothing removed.
*/
(function () {
  if (window.__HL470) return; window.__HL470 = true;

  var RP = /\b(bad memory|remember names|forgetting things|can't remember|memory tricks|memorize)\b/i;
  var DIRECTIVE = "MEMORY RULE: when the asker wants to remember names or facts, externalize first: a note they will re-read beats a trick they will forget. For names, one vivid association plus saying the name back in the first minute works; for facts, spaced repetition (review at one day, one week, one month) beats cramming. Never claim supplements or brain training apps improve memory; sleep, walking, and writing things down are the real levers. When they cannot recall something important, the move is to write it down the moment it is said, not to trust feeling like they will remember it.";

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

  try { console.log('[hl470] memory mode online: write it down, spaced repetition, names via association, sleep is the lever'); } catch (e3) {}
})();
