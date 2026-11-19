/* ILLUMINATI upgrade 338 - DAY PLAN MODE (hl338)
   Frontier directive: "plan my day / plan my trip day" gets a real
   time-blocked schedule. Time-blocked from the wake time and hours
   the asker gives (or sensible defaults, labeled as such), with
   travel buffers between blocks. Nothing removed.
*/
(function () {
  if (window.__HL338) return; window.__HL338 = true;

  var DP = /\b(plan my day|day plan|schedule my day|plan (my|the) (morning|afternoon|evening|trip|weekend)|what should i do (today|tomorrow|first)|how should i spend)\b/i;
  var DIRECTIVE = "DAY PLAN RULE: when the asker wants their day planned, answer as a time-blocked schedule: each line a time range then the block, in order, with short travel or break buffers between blocks that need them. Use the hours they gave; when they gave none, use 8am start and 10pm end and say you assumed them. End with the one block most likely to slip.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && DP.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('DAY PLAN RULE') < 0) {
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

  try { console.log('[hl338] day plan mode online: day asks get a time-blocked schedule'); } catch (e3) {}
})();
