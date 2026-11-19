/* ILLUMINATI upgrade 332 - ACRONYM MODE (hl332)
   Frontier directive: acronym asks expand first.
   "What does NASA stand for" opens with the full expansion, then one
   line on what the thing actually is or does. Nothing removed.
*/
(function () {
  if (window.__HL332) return; window.__HL332 = true;

  var AC = /\b(what does [A-Z][A-Z0-9-]{1,10} stand for|what('s| is) [A-Z][A-Z0-9-]{1,10} short for|meaning of the acronym|what [A-Z][A-Z0-9-]{1,10} means)\b/i;
  var DIRECTIVE = "ACRONYM RULE: when the ask is what an acronym or abbreviation stands for, open with the full expansion on its own line, then one line on what the thing actually is or does. If the letters have more than one common meaning, give the most likely one first and name the others after it.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && AC.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('ACRONYM RULE') < 0) {
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

  try { console.log('[hl332] acronym mode online: acronym asks expand first'); } catch (e3) {}
})();
