/* ILLUMINATI upgrade 308 - FULL COVERAGE (hl308)
   Frontier directive: nothing asked goes unanswered.
   Multi-part asks now get every part answered explicitly, numbered to
   match the parts of the question. Asking three things gets three numbered
   answers, no part skipped or folded into another.
   Nothing removed.
*/
(function () {
  if (window.__HL308) return; window.__HL308 = true;

  var MULTIPART = /\?[\s\S]*\?|\b(and (also )?(what|how|why|when|where|who)\b|\balso\b|\bfirst .{0,60}then\b|\btwo questions\b|\bboth of (these|them)\b|\b1[\).]|list (them|all))/i;
  var DIRECTIVE = 'FULL COVERAGE RULE: when an ask contains more than one question or part, answer every part explicitly and number the answers to match the question parts. No part gets skipped, merged into another, or answered with a shrug. If one part is unknowable, say so under its own number.';

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && MULTIPART.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('FULL COVERAGE RULE') < 0) {
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

  try { console.log('[hl308] full coverage online: every part of a multi-part ask gets its own numbered answer'); } catch (e3) {}
})();
