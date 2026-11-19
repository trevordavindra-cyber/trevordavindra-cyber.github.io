/* ILLUMINATI upgrade 374 - PITCH MODE (hl374)
   Frontier directive: idea pitches get the 60-second version first.
   Nothing removed.
*/
(function () {
  if (window.__HL374) return; window.__HL374 = true;

  var PI = /\b(pitch|elevator pitch|investor (pitch|meeting)|present(ing)? (my|our|the) (idea|startup|business|project)|shark tank|demo day|sell(ing)? (this|the) idea|startup (idea|pitch)|funding (pitch|round|meeting))\b/i;
  var DIRECTIVE = "PITCH RULE: when the asker must pitch an idea, product, or project, lead with the sixty-second version: the problem in one sentence, who has it, the fix, why now, and the one number that proves it. Then the two objections they will actually hear and the answer to each. Structure over slides; no buzzwords, no vision statement, no filler adjectives.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && PI.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('PITCH RULE') < 0) {
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

  try { console.log('[hl374] pitch mode online: pitches get the 60-second version'); } catch (e3) {}
})();
