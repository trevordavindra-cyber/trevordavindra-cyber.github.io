/* ILLUMINATI upgrade 361 - REPAIR QUOTE MODE (hl361)
   Frontier directive: repair-quote asks get a plain read of what is
   likely wrong and which questions to ask. Nothing removed.
*/
(function () {
  if (window.__HL361) return; window.__HL361 = true;

  var RQ = /\b(mechanic (said|quoted|wants)|repair (quote|estimate|cost)|how much (should|would) (it|this) cost (to fix|to repair)|is (the|this) quote fair|car (broke|problem|issue|won'?t start)|leaking|check engine|fix (my|the) (car|phone|laptop|washer|furnace|ac|pipe)|plumber (said|quoted)|estimate (for|seems) too)\b/i;
  var DIRECTIVE = "REPAIR RULE: when the asker shares a repair quote or a breakdown, give what is most likely going on in plain words, what a fair quote usually looks like for that fix, and the exact questions to ask the shop or tech before approving it. Never diagnose remotely as fact: say what the symptom pattern suggests. Flag the two parts most often oversold.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && RQ.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('REPAIR RULE') < 0) {
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

  try { console.log('[hl361] repair quote mode online: quotes get what to ask first'); } catch (e3) {}
})();
