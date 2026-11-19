/* ILLUMINATI upgrade 303 - MATH MODE (hl303)
   Frontier directive: precise reasoning where it matters most.
   Math, conversion and unit asks now get worked step by step, with the
   arithmetic double-checked and the final number stated clearly on its
   own line. No skipped steps on multi-part problems.
   Nothing removed.
*/
(function () {
  if (window.__HL303) return; window.__HL303 = true;

  var MATHY = /\b(calculate|solve|convert|how much is|what is \d|percent(age)? of|\d+\s*[-+*/x×÷]\s*\d+|\d+\s*(miles|km|kg|lbs|feet|meters|dollars|euros|celsius|fahrenheit)\b.*\b(in|to)\b|equation|algebra|geometry|tip on|discount of)\b/i;
  var DIRECTIVE = 'MATH RULE: for any math, unit conversion or calculation ask, show the working steps briefly, then double-check the arithmetic once before answering, then state the final number clearly on its own line. If the numbers do not resolve cleanly, say so instead of forcing a clean answer.';

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && MATHY.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('MATH RULE') < 0) {
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

  try { console.log('[hl303] math mode online: step-by-step working with double-checked numbers'); } catch (e3) {}
})();
