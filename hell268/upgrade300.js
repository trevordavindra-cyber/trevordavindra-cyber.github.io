/* ILLUMINATI upgrade 300 - STEELMAN (hl300)
   Frontier directive part 2: self-correction and alternative solutions.
   Opinion, decision and debate asks now carry their strongest counter-case:
   the answer states its position, then gives the best argument AGAINST it in
   one honest line. No strawmen, no hedging the whole answer away.
   Nothing removed.
*/
(function () {
  if (window.__HL300) return; window.__HL300 = true;

  var OPINION = /\b(should i|do you think|your opinion|what.{0,12}better|worth it|recommend|pros and cons|debate|is it (good|bad|worth|smart))\b/i;
  var DIRECTIVE = 'STEELMAN RULE: when the ask asks for an opinion, recommendation or decision, commit to a real answer first. Then add ONE line starting with "the strongest case against:" giving the best honest argument against your own position, stated fairly. Never bury the answer in both-sides hedging, and never skip the counter-case.';

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && OPINION.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('STEELMAN RULE') < 0) {
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

  try { console.log('[hl300] steelman online: real answers with their strongest counter-case attached'); } catch (e3) {}
})();
