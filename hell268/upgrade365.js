/* ILLUMINATI upgrade 365 - APOLOGY MODE (hl365)
   Frontier directive: I-screwed-up asks get an apology that lands.
   Nothing removed.
*/
(function () {
  if (window.__HL365) return; window.__HL365 = true;

  var AP = /\b(i (screwed|messed|fumbled) up|how (do|to) i (apologize|say sorry)|should i apologize|need to (apologize|say sorry)|i owe (them|him|her|someone) an apology|i hurt (them|his|her) feelings|made (them|him|her) (mad|angry|upset)|how to make it (up|right)|accept(ing)? (my|an) (mistake|blame))\b/i;
  var DIRECTIVE = "APOLOGY RULE: when the asker needs to apologize, give one apology in their voice with the three real parts: what they did, the impact on the other person, and what they are doing differently. No 'I'm sorry you feel that way', no excuses dressed as context, no begging. One shorter fallback if the first is too much. Say when to send it (sooner beats crafted).";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && AP.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('APOLOGY RULE') < 0) {
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

  try { console.log('[hl365] apology mode online: sorry gets the three real parts'); } catch (e3) {}
})();
