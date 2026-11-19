/* ILLUMINATI upgrade 304 - RESEARCH MODE (hl304)
   Frontier directive: research and investigation, structured.
   Research asks now get the direct answer first, then the evidence and
   reasoning behind it, then any unknowns flagged as still open, and one
   sharp follow-up question worth digging into. No buried ledes.
   Nothing removed.
*/
(function () {
  if (window.__HL304) return; window.__HL304 = true;

  var RESEARCH = /\b(who is|what happened|history|background|investigat\w*|find (out|me)|look into|dig into|research|deep dive|tell me everything|break down|timeline|origins?|sources?|evidence|trace)\b/i;
  var DIRECTIVE = 'RESEARCH RULE: for research or investigation asks, structure the answer: (1) the direct answer first, no build-up; (2) then the evidence or reasoning that backs it, briefly; (3) then a line starting "still open:" naming what is genuinely unknown or unverified; (4) end with one sharp follow-up question worth digging into next. Never bury the answer under background.';

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && RESEARCH.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('RESEARCH RULE') < 0) {
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

  try { console.log('[hl304] research mode online: direct answer, evidence, open questions, next dig'); } catch (e3) {}
})();
