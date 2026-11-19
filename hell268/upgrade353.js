/* ILLUMINATI upgrade 353 - UNBLOCK MODE (hl353)
   Frontier directive: I'm-stuck asks get the likeliest cause and the
   first thing to try. Nothing removed.
*/
(function () {
  if (window.__HL353) return; window.__HL353 = true;

  var UB = /\b(i'?m|im) (stuck|blocked|lost|going in circles)|this (isn'?t|isnt) working|tried everything|been (stuck|working) (on this|for) |no idea (what|why)|completely stuck|stuck on this\b/i;
  var DIRECTIVE = "UNBLOCK RULE: when the asker says they are stuck, give the single likeliest cause of the problem, then the one thing to try first, then what to check if that fails. Keep it to three steps total; ask for the exact error text if the cause depends on it. Never hand back a full tutorial.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && UB.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('UNBLOCK RULE') < 0) {
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

  try { console.log('[hl353] unblock mode online: stuck asks get the likeliest cause first'); } catch (e3) {}
})();
