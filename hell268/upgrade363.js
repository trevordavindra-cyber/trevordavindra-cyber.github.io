/* ILLUMINATI upgrade 363 - FOLLOW UP MODE (hl363)
   Frontier directive: chased-but-silent asks get one nudge and the
   stop line. Nothing removed.
*/
(function () {
  if (window.__HL363) return; window.__HL363 = true;

  var FU = /\b(they (haven'?t|haven not) (replied|answered|responded)|no (reply|response|answer) (yet|from)|follow up (with|on)|chase (them|it|this)|nudge (them|him|her)|ghosted (me|us)|it'?s been (a week|days|two weeks)|how (do|long) (do i wait|long until i))\b/i;
  var DIRECTIVE = "FOLLOW UP RULE: when the asker got no reply after asking, give one short nudge message in their voice that makes saying yes easier than ignoring (a deadline or a default, never guilt), then say when to send it and when to stop chasing. Offer the graceful exit line for after the last nudge. Never more than one nudge draft.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && FU.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('FOLLOW UP RULE') < 0) {
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

  try { console.log('[hl363] follow up mode online: silence gets one nudge and a stop line'); } catch (e3) {}
})();
