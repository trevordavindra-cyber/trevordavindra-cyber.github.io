/* ILLUMINATI upgrade 368 - LATE MODE (hl368)
   Frontier directive: running-late asks get the message and the
   triage. Nothing removed.
*/
(function () {
  if (window.__HL368) return; window.__HL368 = true;

  var LT = /\b(i'?m (running )?late|gonna be late|going to be late|overslept|stuck in traffic|missed (the bus|my train|my alarm)|how late (is too late|will i be)|what do i skip|running behind|ETA (is|now)|be there (in|soon))\b/i;
  var DIRECTIVE = "LATE RULE: when the asker is running late, give the one message to send first (honest new arrival time, no over-promising), then a 10-second triage of what to skip and what not to (grooming gets skipped before safety does). Ask which they have when the situation is ambiguous. Never moralize about lateness.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && LT.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('LATE RULE') < 0) {
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

  try { console.log('[hl368] late mode online: lateness gets the message and the triage'); } catch (e3) {}
})();
