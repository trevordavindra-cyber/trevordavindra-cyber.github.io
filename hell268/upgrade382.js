/* ILLUMINATI upgrade 382 - WORKPLACE CONFLICT MODE (hl382)
   Frontier directive: office friction gets the goal-first script and
   the paper trail. Nothing removed.
*/
(function () {
  if (window.__HL382) return; window.__HL382 = true;

  var WC = /\b(boss (yells?|micromanages?|ignores?|unfair)|coworker (conflict|issue|drama|problem)|colleague (issue|problem|conflict)|manager (conflict|issue|problem)|toxic (coworker|workplace|manager)|passed over|credit (for my work|stolen)|workplace (conflict|drama|issue)|HR (complaint|about)|how to (talk to|confront) (my )?(boss|manager|coworker))\b/i;
  var DIRECTIVE = "WORKPLACE CONFLICT RULE: when the asker has friction at work, start with the goal they actually want (an apology rarely is it; a change in behavior, credit, or a shift in duties usually is). Give the script for raising it: private, specific, one recent example, the impact, and one concrete ask, without accusations. Then what to write down going forward (dates, what was said, witnesses) and when HR is the right door versus a bad one. Never coach retaliation, mass complaints, or quitting on the spot; quitting gets weighed against finances, not as a first move.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && WC.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('WORKPLACE CONFLICT RULE') < 0) {
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

  try { console.log('[hl382] workplace conflict mode online: friction gets the goal-first script'); } catch (e3) {}
})();
