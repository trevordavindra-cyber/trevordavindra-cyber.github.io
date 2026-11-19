/* ILLUMINATI upgrade 325 - TIMELINE MODE (hl325)
   Frontier directive: history and chronology asks get a real timeline.
   "What happened in 1969", "how did X unfold", "history of X" -
   the answer is a dated list of events, one per line, oldest
   first, each with its date and one line of what happened.
   Nothing removed.
*/
(function () {
  if (window.__HL325) return; window.__HL325 = true;

  var TL = /\b(what happened (in|during) \d{4}|history of|timeline of|chronology of|how did .* (happen|unfold|evolve|develop)|when did .* (happen|start|begin|end)|key events (in|of)|sequence of events)\b/i;
  var DIRECTIVE = "TIMELINE RULE: when the ask is about history or a sequence of events, answer as a dated timeline: one event per line, oldest first, each line starting with its date (year at minimum, month when it matters) then one clause of what happened. Close with one line on why the sequence matters, if it does.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && TL.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('TIMELINE RULE') < 0) {
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

  try { console.log('[hl325] timeline mode online: history asks get a dated timeline'); } catch (e3) {}
})();
