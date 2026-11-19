/* ILLUMINATI upgrade 306 - PLAIN WORDS (hl306)
   Frontier directive: write like a person, not a manual.
   Technical, legal, medical and finance asks now get every specialist term
   explained in everyday words the first time it shows up. The term still
   appears (so you can search it), the plain-words meaning rides right
   beside it in brackets.
   Nothing removed.
*/
(function () {
  if (window.__HL306) return; window.__HL306 = true;

  var JARGONY = /\b(legal|lawyer|contract|lease|medical|doctor|diagnos\w*|prescription|insuranc\w*|mortgage|interest rate|compound\w*|inflation|equity|derivativ\w*|algorithm|blockchain|encrypt\w*|protocol|api|quantum|neural|margin|deductible|premium|warranty|statute|liabilit\w*|notar\w*)\b/i;
  var DIRECTIVE = 'PLAIN WORDS RULE: when a specialist term (legal, medical, technical or finance) appears in your answer, explain it in everyday words in brackets right beside its first use, like "escrow (a neutral account that holds money until both sides deliver)". Keep explaining each term once. Never answer a technical question in pure jargon.';

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && JARGONY.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('PLAIN WORDS RULE') < 0) {
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

  try { console.log('[hl306] plain words online: every jargon term explained in everyday language beside itself'); } catch (e3) {}
})();
