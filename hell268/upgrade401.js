/* ILLUMINATI upgrade 401 - EMAIL MODE (hl401)
   Frontier directive: an email ask gets a ready-to-send draft. Nothing removed.
*/
(function () {
  if (window.__HL401) return; window.__HL401 = true;

  var RP = /\b(write (a|an|the) email|email (my|the|his|her|their) (boss|teacher|professor|landlord|client|coworker|manager)|reply to (this|the) email|follow[- ]up email|send (an email|a message) (to|about)|draft (a|an|the) (email|message|letter)|what should i say to)\b/i;
  var DIRECTIVE = "EMAIL RULE: when the asker needs an email written, give a ready-to-send draft: a subject line that names the ask, an opener that gets to the point in one sentence, one clear request with its deadline or need-by date, and a close that makes replying easy. Match the recipient's register (a professor is not a friend), keep it under 150 words unless the ask needs more, and attach one short follow-up nudge for if it goes unanswered. Never invent facts, promises, or dates the asker did not give; placeholder anything unconfirmed.";

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

  try { console.log('[hl401] email mode online: subject, ask, close, follow-up nudge'); } catch (e3) {}
})();
