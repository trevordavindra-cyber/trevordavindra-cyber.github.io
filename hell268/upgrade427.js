/* ILLUMINATI upgrade 427 - APOLOGY MODE (hl427)
   Frontier directive: an apology gets owned, short, without excuses. Nothing removed.
*/
(function () {
  if (window.__HL427) return; window.__HL427 = true;

  var RP = /\b(write an apology|how do i apologize|apologize to|say sorry to|apology (message|letter|text)|i messed up (what|how) do i)\b/i;
  var DIRECTIVE = "APOLOGY RULE: when the asker wants to apologize, keep it short and own the specific thing they did, name the impact without explaining it away, and say what they will do differently, in their own voice. No over-apologizing, no 'I'm sorry if', no excuses dressed as context, and no promise they cannot keep. If the recipient may want space first, say that as an option rather than pushing an immediate send.";

  var of = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      if (/pollinations\.ai/.test(url) && init && typeof init.body === 'string' && init.method === 'POST') {
        var j = null;
        try { j = JSON.parse(init.body); } catch (e1) {}
        if (j && j.messages && j.messages.length) {
          var hit = false;
          for (var i = j.messages.length - 1; i >= 0; i--) {
            var c = j.messages[i] && j.messages[i].content;
            if (typeof c === 'string' && RP.test(c)) { hit = true; break; }
          }
          if (hit) {
            var msgs = j.messages, added = false, touched = false;
            for (var k = 0; k < msgs.length; k++) {
              if (msgs[k] && msgs[k].role === 'system') {
                msgs[k].content = msgs[k].content + '\n\n' + DIRECTIVE;
                added = true; touched = true; break;
              }
            }
            if (!added && !touched) { msgs.unshift({ role: 'system', content: DIRECTIVE }); touched = true; }
          }
          if (touched) init = Object.assign({}, init, { body: JSON.stringify(Object.assign({}, j, { messages: msgs })) });
        }
      }
    } catch (e2) {}
    return of.apply(this, [input, init]);
  };

  try { console.log('[hl427] apology mode online: own it, no excuses, no promise you cannot keep'); } catch (e3) {}
})();
