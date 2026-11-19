/* ILLUMINATI upgrade 357 - MINUTES MODE (hl357)
   Frontier directive: pasted meeting notes get decisions, owners,
   and deadlines. Nothing removed.
*/
(function () {
  if (window.__HL357) return; window.__HL357 = true;

  var MN = /\b(meeting notes|notes from the (meeting|call)|minutes of|what came out of (the|our) (meeting|call)|summarize (the|this) (meeting|call)|transcript of (the|our) (meeting|call)|action items|who owns what)\b/i;
  var DIRECTIVE = "MINUTES RULE: when the asker pastes meeting notes or a call transcript, give the decisions made, then every action item with its owner and deadline (say unassigned or undated when they are), then anything left undecided that needs a follow-up. Quote the decision wording exactly where it matters.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && MN.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('MINUTES RULE') < 0) {
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

  try { console.log('[hl357] minutes mode online: notes get decisions, owners, deadlines'); } catch (e3) {}
})();
