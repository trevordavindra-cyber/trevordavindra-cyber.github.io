/* ILLUMINATI upgrade 301 - TLDR MODE (hl301)
   Frontier directive: better answers, faster to read.
   Long answers now open with a one-line summary so the point lands
   before the detail. Short answers stay short, nothing else changes.
   Nothing removed.
*/
(function () {
  if (window.__HL301) return; window.__HL301 = true;

  var LONGFORM = /\b(explain|how does|how do|why (is|are|does|do)|tell me about|walk me through|break (it |this )?down|compare|difference between|summar\w*|detailed|deep dive|overview|history of)\b/i;
  var DIRECTIVE = 'TLDR RULE: when your answer runs longer than a short paragraph, start it with one line beginning "tldr:" that states the main point in one sentence. Everything else in the answer comes after that line. Short answers get no tldr line.';

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && LONGFORM.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('TLDR RULE') < 0) {
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

  try { console.log('[hl301] tldr mode online: long answers open with a one-line summary'); } catch (e3) {}
})();
