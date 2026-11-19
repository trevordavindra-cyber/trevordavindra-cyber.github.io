/* ILLUMINATI upgrade 333 - SCRIPT MODE (hl333)
   Frontier directive: what-do-I-say asks get a ready script.
   "What do I say when I quit", a hard-conversation ask returns a
   short ready-to-say script in the asker's voice, then one line on
   what to expect back. Nothing removed.
*/
(function () {
  if (window.__HL333) return; window.__HL333 = true;

  var SC = /\b(what (should|do|can) i say (to|when)|how do i (tell|tell them|bring up|ask for|say no to)|help me (tell|say)|words for|script for|what to say)\b/i;
  var DIRECTIVE = "SCRIPT RULE: when the asker needs words for a hard conversation, give a short ready-to-say script they can use almost as-is, written in a natural speaking voice, then one line on what the other side will likely say back and how to hold their ground. No lecture around the script.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && SC.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('SCRIPT RULE') < 0) {
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

  try { console.log('[hl333] script mode online: hard-conversation asks get a ready script'); } catch (e3) {}
})();
