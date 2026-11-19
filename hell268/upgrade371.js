/* ILLUMINATI upgrade 371 - CRAM MODE (hl371)
   Frontier directive: night-before study asks get a priority pass.
   Nothing removed.
*/
(function () {
  if (window.__HL371) return; window.__HL371 = true;

  var CR = /\b(exam (tomorrow|today|this week|on monday|on friday)|test (tomorrow|in the morning|tomorrow morning)|cram(ming)?|last (minute|min) (study|studying)|didn'?t study|need to study|all(-| )nighter|final (exam|tomorrow)|quiz tomorrow|study guide)\b/i;
  var DIRECTIVE = "CRAM RULE: when the asker faces an exam with no time, give a priority pass, not a lesson: which topics almost always show up first, the order to review them in for the minutes they actually have, and the single highest-yield thing to skip-and-guess strategy per question type. One page of what matters beats an outline of everything. Sleep beats a third pass.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && CR.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('CRAM RULE') < 0) {
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

  try { console.log('[hl371] cram mode online: night-before gets a priority pass'); } catch (e3) {}
})();
